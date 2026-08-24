import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import { getReviews } from "@/controllers/reviewsController";

// Read-only. Reviews are left on the Google Business listing rather than submitted
// here, so there's no public POST — an open write endpoint with no UI behind it is
// just a spam surface. `addReview` is still exported from the controller for the
// planned Google-review import to reuse.
export async function GET(request: Request): Promise<NextResponse> {
  try {
    await dbConnect();
    return await getReviews(request);
  } catch (error) {
    console.error("Reviews GET route error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
  }
}
