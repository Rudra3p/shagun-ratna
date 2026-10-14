import { NextResponse } from "next/server";
import { getMetalRates } from "@/controllers/metalRateController";

export async function GET(): Promise<NextResponse> {
  return getMetalRates();
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json(
    { success: false, error: "Metal rates are updated automatically by the daily feed." },
    { status: 405 }
  );
}
