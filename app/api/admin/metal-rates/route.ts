import { NextResponse } from "next/server";
import { getMetalRates, updateMetalRates, syncMetalRates } from "@/controllers/metalRateController";

export async function GET(): Promise<NextResponse> {
  return getMetalRates();
}

export async function PUT(request: Request): Promise<NextResponse> {
  return updateMetalRates(request);
}

export async function POST(): Promise<NextResponse> {
  return syncMetalRates();
}

