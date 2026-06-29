// 🧠 Just update the import at the top of controllers/showcaseController.ts to look like this:
import Showcase from "@/models/showcase";
import { NextResponse } from "next/server";
import dbConnect from "@/db/db";

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