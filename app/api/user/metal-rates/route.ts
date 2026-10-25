import { NextResponse } from "next/server";
import { readRates } from "@/controllers/metalRateController";

export const runtime = "nodejs";

// Public endpoint for live metal rates (Ahmedabad bullion & IBJA benchmark)
// Automatically enforces the 1-hour live scraper cache
export async function GET(): Promise<NextResponse> {
  try {
    const rates = await readRates();
    return NextResponse.json({ success: true, rates }, { status: 200 });
  } catch (error: any) {
    console.error("Public metal rates fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve live metal rates" },
      { status: 500 }
    );
  }
}

