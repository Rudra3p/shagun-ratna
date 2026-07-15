// 🧠 Just update the import at the top of controllers/showcaseController.ts to look like this:
import Showcase from "@/models/showcase";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import dbConnect from "@/db/db";

interface PopulatedProduct {
  _id: unknown;
  productName: string;
  price: number;
  category?: string;
  offerPrice?: number;
  imageUrl?: string | null;
  createdAt: Date;
}

const HOMEPAGE_ZONES = ["Card 1", "Card 2", "Card 3", "Card 4", "Card 5", "Card 6"];
const NEW_LAUNCH_ZONE = "New Launch";
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

    const collections = await Showcase.find().sort({ createdAt: -1 }); // 👈 Uses new Showcase model
    return NextResponse.json({ collections }, { status: 200 });
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

// 4. GET: Public homepage feed — resolves the 6 admin-assigned card zones,
// backfilling any unassigned slots with the latest products so the grid never looks empty.
export const getHomepageShowcase = async (): Promise<NextResponse> => {
  try {
    await dbConnect();

    const mapped = await Showcase.find({ homepageZone: { $in: HOMEPAGE_ZONES } })
      .select("homepageZone productIds")
      .populate({ path: "productIds", model: Product });

    const zoneProduct = new Map<string, PopulatedProduct>();
    for (const collection of mapped) {
      if (zoneProduct.has(collection.homepageZone)) continue;
      // productIds may contain nulls for products that were deleted after being assigned
      const validProduct = (collection.productIds as unknown as PopulatedProduct[]).find((p) => p);
      if (validProduct) zoneProduct.set(collection.homepageZone, validProduct);
    }

    const usedIds = Array.from(zoneProduct.values()).map((p) => p._id);
    const emptySlots = HOMEPAGE_ZONES.length - zoneProduct.size;

    const fillerProducts = emptySlots > 0
      ? await Product.find({ _id: { $nin: usedIds } }).sort({ createdAt: -1 }).limit(emptySlots)
      : [];

    let fillerIndex = 0;
    const products = HOMEPAGE_ZONES
      .map((zone) => zoneProduct.get(zone) || fillerProducts[fillerIndex++])
      .filter(Boolean);

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load homepage showcase" }, { status: 500 });
  }
};

// 5. GET: Public feed for the "New Launch" spotlight and the 3 "Featured Collections" cards.
// Each zone resolves to the collection's title/description plus its first assigned product;
// a zone with no collection assigned (or no product in it) resolves to null so the section
// falls back to its own default copy/image.
export const getHomepageContent = async (): Promise<NextResponse> => {
  try {
    await dbConnect();

    const zones = [NEW_LAUNCH_ZONE, ...FEATURED_ZONES];
    const mapped = await Showcase.find({ homepageZone: { $in: zones } })
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

    const newLaunch = buildEntry(NEW_LAUNCH_ZONE);
    const featured = FEATURED_ZONES.map(buildEntry);

    return NextResponse.json({ newLaunch, featured }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ newLaunch: null, featured: [null, null, null] }, { status: 200 });
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