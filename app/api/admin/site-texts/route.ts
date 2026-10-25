import { NextResponse } from "next/server";
import {
  getAdminSiteTexts,
  upsertSiteText,
  deleteSiteText,
} from "@/controllers/siteContentController";

// GET /api/admin/site-texts
export async function GET(): Promise<NextResponse> {
  return getAdminSiteTexts();
}

// POST /api/admin/site-texts
export async function POST(req: Request): Promise<NextResponse> {
  const body = await req.json();
  return upsertSiteText(body);
}

// DELETE /api/admin/site-texts?key=some-key
export async function DELETE(req: Request): Promise<NextResponse> {
  return deleteSiteText(req);
}

