// 🧠 Just update the import at the top of controllers/showcaseController.ts to look like this:
import Showcase from "@/models/showcase";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import dbConnect from "@/db/db";

const HOMEPAGE_ZONES = ["Card 1", "Card 2", "Card 3", "Card 4", "Card 5", "Card 6"];

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
export const getHomepageShowcase = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();

    const mapped = await Showcase.find({ homepageZone: { $in: HOMEPAGE_ZONES } })
      .select("homepageZone productIds")
      .populate({ path: "productIds", model: Product });

    const zoneProduct = new Map<string, any>();
    for (const collection of mapped) {
      if (zoneProduct.has(collection.homepageZone)) continue;
      // productIds may contain nulls for products that were deleted after being assigned
      const validProduct = (collection.productIds as any[]).find((p) => p);
      if (validProduct) zoneProduct.set(collection.homepageZone, validProduct);
    }

    const usedIds = Array.from(zoneProduct.values()).map((p: any) => p._id);
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