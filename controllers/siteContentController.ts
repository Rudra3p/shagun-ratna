import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import SiteContent from "@/models/siteContent";

// PUBLIC: returns key -> value dictionary of all active copy overrides.
// Client components fall back to their default hardcoded copy when a key is absent.
export const getPublicSiteTexts = async (): Promise<NextResponse> => {
  try {
    await dbConnect();
    const docs = await SiteContent.find().select("key value").lean();

    const texts: Record<string, string> = {};
    for (const doc of docs) {
      texts[doc.key] = doc.value;
    }

    return NextResponse.json({ texts }, { status: 200 });
  } catch (error) {
    // The storefront should never fail if this feed is unavailable
    return NextResponse.json({ texts: {} }, { status: 200 });
  }
};

// ADMIN: returns all stored copy records with metadata
export const getAdminSiteTexts = async (): Promise<NextResponse> => {
  try {
    await dbConnect();
    const texts = await SiteContent.find().sort({ key: 1 }).lean();
    return NextResponse.json({ texts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load site texts" }, { status: 500 });
  }
};

// ADMIN: upsert a copy item
export const upsertSiteText = async (body: {
  key?: string;
  value?: string;
  page?: string;
  section?: string;
}): Promise<NextResponse> => {
  try {
    await dbConnect();
    const { key, value, page, section } = body;

    if (!key || typeof value !== "string") {
      return NextResponse.json({ error: "key and value are required" }, { status: 400 });
    }

    const updated = await SiteContent.findOneAndUpdate(
      { key },
      { $set: { value, page: page || "", section: section || "" } },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ success: true, text: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save text content" }, { status: 500 });
  }
};

// ADMIN: delete an override so it falls back to the default copy
export const deleteSiteText = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const key = url.searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
    }

    await SiteContent.deleteOne({ key });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reset text content" }, { status: 500 });
  }
};

