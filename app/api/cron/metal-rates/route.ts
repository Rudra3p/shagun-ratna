import { NextResponse } from "next/server";
import { updateMetalRatesFromApi } from "@/controllers/metalRateController";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rates = await updateMetalRatesFromApi();
    return NextResponse.json({ success: true, rates });
  } catch (error) {
    console.error("Metal rate cron failed:", error);
    return NextResponse.json({ success: false, error: "Failed to update metal rates" }, { status: 500 });
  }
}