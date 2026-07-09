import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import Product from "@/models/product";

// PUBLIC GET ROUTE: Inside /api/user/products/[id]
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Single product fetch failed:", error);
    return NextResponse.json({ error: "Unable to load this piece." }, { status: 500 });
  }
}
