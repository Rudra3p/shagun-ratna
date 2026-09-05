import { NextResponse } from "next/server";
import { getPublicReviews } from "@/controllers/reviewsController";

// Read-only. Serves the Google listing's live reviews (falling back to stored ones
// when Google is unreachable), so there's no public POST — reviews are written on
// Google, and an open write endpoint with no UI behind it is just a spam surface.
export async function GET(request: Request): Promise<NextResponse> {
  try {
    return await getPublicReviews(request);
  } catch (error) {
    console.error("Reviews GET route error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
  }
}
