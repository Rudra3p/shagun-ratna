import { NextResponse } from "next/server";
import { getPublicSiteImages } from "@/controllers/siteImageController";

// PUBLIC GET ROUTE: Inside /api/user/site-images
export async function GET(): Promise<NextResponse> {
  return getPublicSiteImages();
}
