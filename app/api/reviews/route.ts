import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import { addReview, getReviews } from "@/controllers/reviewsController";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    await dbConnect();
    return await getReviews(request);
  } catch (error) {
    console.error("Reviews GET route error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await dbConnect();
    return await addReview(request);
  } catch (error) {
    console.error("Reviews POST route error:", error);
    return NextResponse.json({ success: false, error: "Failed to create review" }, { status: 500 });
  }
}