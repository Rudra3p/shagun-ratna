import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import { syncGoogleReviews } from "@/lib/googleReviewsSync";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const result = await syncGoogleReviews();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Google reviews sync failed:", error);
    return NextResponse.json({ success: false, error: "Google review sync failed" }, { status: 500 });
  }
}