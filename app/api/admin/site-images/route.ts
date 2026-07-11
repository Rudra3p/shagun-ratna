import { NextResponse } from "next/server";
import {
  getAdminSiteImages,
  upsertSiteImage,
  deleteSiteImage,
} from "@/controllers/siteImageController";
import { generateUploadUrl } from "@/lib/r2Service";

// GET /api/admin/site-images
export async function GET(): Promise<NextResponse> {
  return getAdminSiteImages();
}

// POST /api/admin/site-images
// action: 'get-upload-url' -> presigned R2 upload URL, same flow as product images
// otherwise -> upsert { key, imageUrl }
export async function POST(req: Request): Promise<NextResponse> {
  const body = await req.json();

  if (body.action === "get-upload-url") {
    const { fileName, fileType } = body;
    const uniqueKey = `site/${Date.now()}-${fileName.replace(/\s+/g, "-")}`;
    const signedUrl = await generateUploadUrl(uniqueKey, fileType);

    const r2PublicDomain = process.env.R2_PUBLIC_DOMAIN;
    const publicUrl = `${r2PublicDomain}/${uniqueKey}`;

    return NextResponse.json({ signedUrl, uniqueKey, publicUrl });
  }

  return upsertSiteImage(body);
}

// DELETE /api/admin/site-images?key=home-hero
export async function DELETE(req: Request): Promise<NextResponse> {
  return deleteSiteImage(req);
}
