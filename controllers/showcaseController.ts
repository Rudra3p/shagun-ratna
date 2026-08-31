// 🧠 Just update the import at the top of controllers/showcaseController.ts to look like this:
import Showcase from "@/models/showcase";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import { readRates } from "@/controllers/metalRateController";
import { applyPricingToList } from "@/lib/pricing";

interface PopulatedProduct {
  _id: unknown;
  productName: string;
  price: number;
  category?: string;
  offerPrice?: number;
  imageUrl?: string | null;
  createdAt: Date;
}

const HOMEPAGE_GRID_SLOTS = 6;
const FEATURED_ZONES = ["Featured 1", "Featured 2", "Featured 3"];

// 1. GET: Fetch folders
export const getSmartCollection = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (id) {
      const collection = await Showcase.findById(id); // 👈 Uses new Showcase model
      if (!collection) return NextResponse.json({ error: "Folder repository not found" }, { status: 404 });
      return NextResponse.json({ collection }, { status: 200 });
    }

    const collections = await Showcase.find().sort({ createdAt: -1 }).lean(); // 👈 Uses new Showcase model

    // Attach a lightweight thumbnail (first product's image) per collection without
    // touching productIds itself, so the "N Products" count on the card stays accurate
    const firstProductIds = collections
      .map((c) => c.productIds?.[0])
      .filter(Boolean);

    const thumbnailDocs = firstProductIds.length
      ? await Product.find({ _id: { $in: firstProductIds } }).select('imageUrl').lean()
      : [];
    const thumbnailById = new Map(thumbnailDocs.map((p) => [String(p._id), p.imageUrl]));

    const collectionsWithThumbnails = collections.map((c) => ({
      ...c,
      thumbnailImage: c.productIds?.[0] ? thumbnailById.get(String(c.productIds[0])) || null : null,
    }));

    return NextResponse.json({ collections: collectionsWithThumbnails }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server read failure" }, { status: 500 });
  }
};

// 2. POST: Create a folder
export const configureShowcase = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();
    const body = await req.json();

    const newCollection = new Showcase({
      title: body.title,
      gender: body.gender,
      minAge: parseInt(body.minAge) || 0,
      maxAge: parseInt(body.maxAge) || 120,
      homepageZone: body.homepageZone || "None", // 🧠 Captures homepage spot assignment
      description: body.description,
      productIds: []
    });

    await newCollection.save();
    return NextResponse.json({ success: true, message: "Folder repository created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server write failure" }, { status: 400 });
  }
};

// 4. GET: Public homepage feed — shows the admin's directly-picked products (via
// /admin/homepage-grid), backfilling any remaining slots with the latest products
// so the grid never looks empty even if fewer than 6 have been picked.
export const getHomepageShowcase = async (): Promise<NextResponse> => {
  try {
    await dbConnect();

    const featuredProducts = await Product.find({ featured: true })
      .sort({ updatedAt: -1 })
      .limit(HOMEPAGE_GRID_SLOTS)
      .lean();

    const usedIds = featuredProducts.map((p) => p._id);
    const emptySlots = HOMEPAGE_GRID_SLOTS - featuredProducts.length;

    const fillerProducts = emptySlots > 0
      ? await Product.find({ _id: { $nin: usedIds } }).sort({ createdAt: -1 }).limit(emptySlots).lean()
      : [];

    const products = [...featuredProducts, ...fillerProducts];

    // Formula-priced pieces reflect the current metal rates here too
    const rates = await readRates();
    return NextResponse.json({ products: applyPricingToList(products, rates) }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load homepage showcase" }, { status: 500 });
  }
};

// 5. GET: Public feed for the 3 "Featured Collections" cards.
// Each zone resolves to the collection's title/description plus its first assigned product;
// a zone with no collection assigned (or no product in it) resolves to null so the section
// falls back to its own default copy/image.
export const getHomepageContent = async (): Promise<NextResponse> => {
  try {
    await dbConnect();

    const mapped = await Showcase.find({ homepageZone: { $in: FEATURED_ZONES } })
      .select("homepageZone title description productIds")
      .populate({ path: "productIds", model: Product });

    const byZone = new Map<string, (typeof mapped)[number]>();
    for (const collection of mapped) {
      if (!byZone.has(collection.homepageZone)) byZone.set(collection.homepageZone, collection);
    }

    const buildEntry = (zone: string) => {
      const collection = byZone.get(zone);
      if (!collection) return null;

      // productIds may contain nulls for products that were deleted after being assigned
      const product = (collection.productIds as unknown as PopulatedProduct[]).find((p) => p);
      if (!product) return null;

      return { title: collection.title, description: collection.description || "", product };
    };

    const featured = FEATURED_ZONES.map(buildEntry);

    return NextResponse.json({ featured }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ featured: [null, null, null] }, { status: 200 });
  }
};

// 3. PUT: Update checklist array values
export const updateSmartCollection = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const body = await req.json();

    const updatedCollection = await Showcase.findByIdAndUpdate( // 👈 Uses new Showcase model
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedCollection) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, collection: updatedCollection }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server update failure" }, { status: 500 });
  }
};

// 6. DELETE: Remove a folder
export const deleteSmartCollection = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const deletedCollection = await Showcase.findByIdAndDelete(id);
    if (!deletedCollection) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Folder repository deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server delete failure" }, { status: 500 });
  }
};