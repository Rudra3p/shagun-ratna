import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import {
  getReviews,
  addReview,
  deleteReview,
  syncFeaturedReviews,
  importGoogleReviews,
} from "@/controllers/reviewsController";
import { generateUploadUrl } from "@/lib/r2Service";

const ensureDB = async () => await dbConnect();

export async function GET(req: Request) {
  await ensureDB();
  return await getReviews(req);
}

// POST does three jobs, told apart by `action`:
//   'get-upload-url' -> presigned R2 URL for a reviewer photo, same flow as site images
//   'import-google'  -> back up the live Google reviews to the database
//   (no action)      -> save a review typed into the admin panel
export async function POST(req: Request) {
  await ensureDB();

  const body = await req.json().catch(() => ({}));

  if (body.action === "get-upload-url") {
    const fileName = String(body.fileName || "photo").replace(/\s+/g, "-");
    const uniqueKey = `reviews/${Date.now()}-${fileName}`;
    const signedUrl = await generateUploadUrl(uniqueKey, body.fileType);

    return NextResponse.json({
      signedUrl,
      uniqueKey,
      publicUrl: `${process.env.R2_PUBLIC_DOMAIN}/${uniqueKey}`,
    });
  }

  if (body.action === "import-google") {
    return await importGoogleReviews();
  }

  return await addReview(body);
}

export async function PUT(req: Request) {
  await ensureDB();
  return await syncFeaturedReviews(req);
}

export async function DELETE(req: Request) {
  await ensureDB();
  return await deleteReview(req);
}
