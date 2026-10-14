import { NextResponse } from "next/server";
import { readRates, updateMetalRatesFromApi } from "@/controllers/metalRateController";

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

    try {
      const currentRate = await readRates();
      return NextResponse.json({ success: false, fallbackUsed: true, currentRate }, { status: 200 });
    } catch (fallbackError) {
      console.error("Metal rate fallback read failed:", fallbackError);
      return NextResponse.json(
        { success: false, fallbackUsed: true, currentRate: null },
        { status: 200 }
      );
    }
  }
}