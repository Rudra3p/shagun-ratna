import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import Product from "@/models/product";
import { readRates } from "@/controllers/metalRateController";
import { applyPricing } from "@/lib/pricing";

// PUBLIC GET ROUTE: Inside /api/user/products/[id]
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Reprice from the live metal rates if this piece is formula-priced
    const rates = await readRates();
    return NextResponse.json({ product: applyPricing(product, rates) }, { status: 200 });
  } catch (error) {
    console.error("Single product fetch failed:", error);
    return NextResponse.json({ error: "Unable to load this piece." }, { status: 500 });
  }
}
