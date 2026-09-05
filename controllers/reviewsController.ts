import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import Review from "@/models/reviews";
import { fetchGooglePlace, isGoogleReviewsConfigured } from "@/lib/googleReviews";

// Saves one review typed into the admin panel — normally the client copying a review
// across from their Google listing when the Places API isn't set up. Takes an already
// parsed body rather than a Request, because the route reads it first to route on
// `action`.
export const addReview = async (body: Record<string, unknown>): Promise<NextResponse> => {
  try {
    await dbConnect();

    const newReview = new Review({
      name: body.name,
      // The small line under the name. Defaults to crediting Google, since that's
      // where these are copied from.
      product: body.product || "Google Review",
      text: body.text,
      rating: Number(body.rating),
      authorImage: body.authorImage || "",
      authorUrl: body.authorUrl || "",
      // No moderation queue — whoever typed it in has already vetted it. Showing it
      // on the homepage stays a separate, deliberate choice.
      approved: body.approved === undefined ? true : Boolean(body.approved),
      source: "site",
    });

    const savedReview = await newReview.save();

    return NextResponse.json(
      { success: true, message: "Review created successfully", review: savedReview },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create review";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
};

export const getReviews = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const approved = url.searchParams.get("approved");
    const featured = url.searchParams.get("featured");

    const query: Record<string, unknown> = {};
    if (approved === "true") query.approved = true;
    if (approved === "false") query.approved = false;
    if (featured === "true") query.featured = true;

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Review.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        reviews,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
  }
};

export const updateReview = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID missing in URL" }, { status: 400 });
    }

    const body = await req.json();
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      {
        ...body,
        rating: body.rating !== undefined ? Number(body.rating) : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Review updated", review: updatedReview }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update review";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
};

// Stores a copy of the listing's Google reviews in the database. The site renders
// Google live (see getPublicReviews), so this isn't what visitors normally see — it's
// the safety net that keeps reviews on the page if Google is down, rate-limited, or
// the key expires. Upserts on the Google review id, so re-running refreshes photos and
// edited text rather than duplicating.
export const importGoogleReviews = async (): Promise<NextResponse> => {
  try {
    await dbConnect();

    if (!isGoogleReviewsConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "Google reviews aren't configured yet. Add GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID to the environment.",
        },
        { status: 400 }
      );
    }

    const place = await fetchGooglePlace();
    const googleReviews = place?.reviews ?? [];

    let changed = 0;
    for (const review of googleReviews) {
      // updateOne skips the document-level zod hook, which is fine — fetchGoogleReviews
      // already drops anything too thin to satisfy it.
      const result = await Review.updateOne(
        { googleReviewId: review.googleReviewId },
        {
          $set: {
            name: review.name,
            text: review.text,
            rating: review.rating,
            authorImage: review.authorImage,
            authorUrl: review.authorUrl,
            source: "google",
            approved: true,
          },
          $setOnInsert: {
            googleReviewId: review.googleReviewId,
            product: "Google Review",
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0 || result.modifiedCount > 0) changed += 1;
    }

    return NextResponse.json(
      {
        success: true,
        message: googleReviews.length
          ? `Synced ${googleReviews.length} Google review${googleReviews.length === 1 ? "" : "s"} (${changed} new or updated).`
          : "Google returned no reviews with text for this listing.",
        total: googleReviews.length,
        changed,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to import Google reviews";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
};

// A Google review dressed as a stored one, so the pages don't care where it came from.
type GoogleReview = {
  googleReviewId: string;
  name: string;
  authorImage: string;
  authorUrl: string;
  text: string;
  rating: number;
  relativeTime: string;
};

const toPublicReview = (review: GoogleReview) => ({
  _id: review.googleReviewId,
  name: review.name,
  product: "Google Review", // rendered as the small line under the name
  text: review.text,
  rating: review.rating,
  authorImage: review.authorImage,
  authorUrl: review.authorUrl,
  relativeTime: review.relativeTime,
  source: "google",
});

// What every public page reads. Google is the live source — new reviews land on the
// site by themselves, photos and all — and the database is the fallback for when
// Google isn't configured, errors, or returns nothing with text in it.
export const getPublicReviews = async (req: Request): Promise<NextResponse> => {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const place = await fetchGooglePlace();

    if (place && place.reviews.length > 0) {
      return NextResponse.json(
        {
          success: true,
          source: "google",
          reviews: place.reviews.slice(0, limit).map(toPublicReview),
          // The listing's real figures — not just the handful of reviews Google hands back.
          total: place.totalRatings || place.reviews.length,
          averageRating: place.rating,
        },
        { status: 200 }
      );
    }

    return await getReviews(req);
  } catch (error) {
    console.error("Live Google reviews unavailable, serving stored reviews:", error);
    return await getReviews(req);
  }
};

// Sets the homepage Testimonials section to show exactly this set of reviews —
// anything previously featured but not in `featuredIds` is unfeatured.
export const syncFeaturedReviews = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();

    const body = await req.json();
    const featuredIds: string[] = Array.isArray(body.featuredIds) ? body.featuredIds : [];

    await Review.updateMany({}, { $set: { featured: false } });
    if (featuredIds.length > 0) {
      await Review.updateMany({ _id: { $in: featuredIds } }, { $set: { featured: true } });
    }

    return NextResponse.json(
      { success: true, message: "Homepage reviews updated", count: featuredIds.length },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update homepage reviews" }, { status: 500 });
  }
};

export const deleteReview = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID missing in URL" }, { status: 400 });
    }

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Review deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete review" }, { status: 500 });
  }
};