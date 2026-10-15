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
    const { fileName, fileType, fileSize, key } = body;
    const isImage = typeof fileType === "string" && fileType.startsWith("image/");
    const isStoryVideo = key === "home-story" && fileType === "video/mp4";
    const maxVideoSize = 100 * 1024 * 1024;

    if (typeof fileName !== "string" || !fileName || (!isImage && !isStoryVideo)) {
      return NextResponse.json({ error: "Only images are supported here; Our Story also supports MP4 video" }, { status: 400 });
    }
    if (isStoryVideo && (!Number.isSafeInteger(fileSize) || fileSize <= 0 || fileSize > maxVideoSize)) {
      return NextResponse.json({ error: "MP4 videos must be 100 MB or smaller" }, { status: 400 });
    }

    const safeFileName = fileName.split(/[\\/]/).pop()!.replace(/[^\w.-]+/g, "-");
    const uniqueKey = `site/${Date.now()}-${safeFileName}`;
    const signedUrl = await generateUploadUrl(uniqueKey, fileType, fileSize);

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
