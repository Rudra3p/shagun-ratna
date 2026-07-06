import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import Review from "@/models/reviews";
import { verifyUserSession } from "@/lib/verifyUserSession";

export const addReview = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();

    const userId = await verifyUserSession(req.headers.get("cookie"));
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Please sign in to submit a review." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const newReview = new Review({
      name: body.name,
      product: body.product,
      text: body.text,
      rating: Number(body.rating),
      approved: Boolean(body.approved),
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

    const query: Record<string, unknown> = {};
    if (approved === "true") query.approved = true;
    if (approved === "false") query.approved = false;

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Review.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        reviews,
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