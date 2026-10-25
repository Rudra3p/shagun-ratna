import { NextResponse } from "next/server";
import { getPublicSiteTexts } from "@/controllers/siteContentController";

// PUBLIC GET ROUTE: Inside /api/user/site-texts
export async function GET(): Promise<NextResponse> {
  return getPublicSiteTexts();
}

