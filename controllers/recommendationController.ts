import { NextResponse } from "next/server";
import Product from "@/models/product";
import Showcase from "@/models/showcase";
import dbConnect from "@/db/db";
import { readRates } from "@/controllers/metalRateController";
import { applyPricingToList } from "@/lib/pricing";

// Recommendations are driven by the visitor's survey answers (name/age/gender kept
// in their browser's localStorage) rather than an account — age and gender arrive as
// query params, so this endpoint is stateless and holds no personal data.
export const getRecommendations = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const ageParam = url.searchParams.get("age");
    const gender = url.searchParams.get("gender");

    const age = Number(ageParam);
    if (!ageParam || Number.isNaN(age) || age < 1 || age > 120 || !gender) {
      // No survey taken yet (or an incomplete one) — nothing to personalise from.
      return NextResponse.json({ success: true, recommended: false, products: [] }, { status: 200 });
    }

    const matchingCollections = await Showcase.find({
      minAge: { $lte: age },
      maxAge: { $gte: age },
      $or: [{ gender: "All" }, { gender: "Unisex" }, { gender }],
    }).select("productIds");

    const productIdSet = new Set<string>();
    for (const collection of matchingCollections) {
      for (const pid of collection.productIds) {
        productIdSet.add(pid.toString());
      }
    }

    if (productIdSet.size === 0) {
      return NextResponse.json({ success: true, recommended: false, products: [] }, { status: 200 });
    }

    const products = await Product.find({ _id: { $in: Array.from(productIdSet) } }).lean();
    const rates = await readRates();

    return NextResponse.json(
      { success: true, recommended: true, products: applyPricingToList(products, rates) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Recommendation Error:", error);
    return NextResponse.json({ success: false, recommended: false, products: [] }, { status: 500 });
  }
};
