import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import SiteImage from "@/models/siteImage";

// PUBLIC: returns only the slots an admin has overridden, as a flat { key: imageUrl } map.
// Components fall back to their own default asset when a key is absent.
export const getPublicSiteImages = async (): Promise<NextResponse> => {
  try {
    await dbConnect();
    const docs = await SiteImage.find().select("key imageUrl");

    const images: Record<string, string> = {};
    for (const doc of docs) images[doc.key] = doc.imageUrl;

    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    // The homepage/about page should never break because this feed failed
    return NextResponse.json({ images: {} }, { status: 200 });
  }
};

// ADMIN: full list of overrides currently stored
export const getAdminSiteImages = async (): Promise<NextResponse> => {
  try {
    await dbConnect();
    const images = await SiteImage.find().sort({ key: 1 });
    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load site images" }, { status: 500 });
  }
};

// ADMIN: upsert a single slot's image
export const upsertSiteImage = async (body: { key?: string; imageUrl?: string }): Promise<NextResponse> => {
  try {
    await dbConnect();
    const { key, imageUrl } = body;

    if (!key || !imageUrl) {
      return NextResponse.json({ error: "key and imageUrl are required" }, { status: 400 });
    }

    const updated = await SiteImage.findOneAndUpdate(
      { key },
      { $set: { imageUrl } },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ success: true, image: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
};

// ADMIN: clear an override so the slot falls back to its default asset again
export const deleteSiteImage = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const key = url.searchParams.get("key");
    if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

    await SiteImage.deleteOne({ key });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reset image" }, { status: 500 });
  }
};
