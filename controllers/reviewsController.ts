import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import Review from "@/models/reviews";

// Saves one review typed into the admin panel — the client copying a review across
// from their Google listing by hand. Takes an already parsed body rather than a
// Request, because the route reads it first to route on `action`.
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