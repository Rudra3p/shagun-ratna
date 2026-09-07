import { NextResponse } from "next/server";
import Product from "@/models/product";
import Showcase from "@/models/showcase";
import dbConnect from "@/db/db";
import { readRates } from "@/controllers/metalRateController";
import { applyPricingToList } from "@/lib/pricing";

// Guards against a stone name being read as a pattern once it goes into $in.
const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// A visitor can only have a handful of stones; anything beyond this is noise.
const MAX_GEMSTONES = 8;

/**
 * Products whose category list names one of the stones the reading suggested.
 * It matches the categories the admin already ticks when adding a piece
 * ("Ruby", "Emerald", ...), so nothing has to be tagged a second time.
 */
const findByGemstone = async (gemstonesParam: string | null) => {
  const names = (gemstonesParam || "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .slice(0, MAX_GEMSTONES);

  if (names.length === 0) return [];

  // Anchored and case-insensitive: "Ruby" should not also pull in "Ruby Red Spinel"
  // from a free-typed category, but it should still match a lowercased "ruby".
  const patterns = names.map((name) => new RegExp(`^${escapeRegex(name)}$`, "i"));
  return Product.find({ category: { $in: patterns } }).lean();
};

// Recommendations are driven by the visitor's survey answers (name/age/gender and
// their gemstone reading, all kept in their browser's localStorage) rather than an
// account — everything arrives as query params, so this endpoint is stateless and
// holds no personal data.
export const getRecommendations = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const ageParam = url.searchParams.get("age");
    const gender = url.searchParams.get("gender");
    const gemstonesParam = url.searchParams.get("gemstones");

    const age = Number(ageParam);
    const hasAudience = Boolean(ageParam) && !Number.isNaN(age) && age >= 1 && age <= 120 && Boolean(gender);

    if (!hasAudience && !gemstonesParam) {
      // No survey taken yet (or an incomplete one) — nothing to personalise from.
      return NextResponse.json({ success: true, recommended: false, products: [] }, { status: 200 });
    }

    // The stone is the sharper signal, so its matches are returned first and the
    // storefront weaves those into the opening rows.
    const gemstoneProducts = await findByGemstone(gemstonesParam);
    const seen = new Set<string>(gemstoneProducts.map((p) => String(p._id)));

    let showcaseProducts: Awaited<ReturnType<typeof findByGemstone>> = [];
    if (hasAudience) {
      const matchingCollections = await Showcase.find({
        minAge: { $lte: age },
        maxAge: { $gte: age },
        $or: [{ gender: "All" }, { gender: "Unisex" }, { gender }],
      }).select("productIds");

      const productIdSet = new Set<string>();
      for (const collection of matchingCollections) {
        for (const pid of collection.productIds) {
          const id = pid.toString();
          // A piece already matched on its stone shouldn't be fetched or listed twice.
          if (!seen.has(id)) productIdSet.add(id);
        }
      }

      if (productIdSet.size > 0) {
        showcaseProducts = await Product.find({ _id: { $in: Array.from(productIdSet) } }).lean();
      }
    }

    const products = [...gemstoneProducts, ...showcaseProducts];
    if (products.length === 0) {
      return NextResponse.json({ success: true, recommended: false, products: [] }, { status: 200 });
    }

    const rates = await readRates();

    return NextResponse.json(
      {
        success: true,
        recommended: true,
        gemstoneMatches: gemstoneProducts.length,
        products: applyPricingToList(products, rates),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Recommendation Error:", error);
    return NextResponse.json({ success: false, recommended: false, products: [] }, { status: 500 });
  }
};
