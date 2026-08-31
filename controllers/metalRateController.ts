import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import MetalRate from "@/models/metalRate";
import Product from "@/models/product";

// Always resolves to the single rate document, creating it on first use so the
// admin screen has something to edit rather than erroring on an empty database.
export const readRates = async () => {
  await dbConnect();
  const existing = await MetalRate.findOne({ singleton: 'current' }).lean();
  if (existing) return existing;
  const created = await MetalRate.create({ singleton: 'current', goldRatePerGram: 0, silverRatePerGram: 0, platinumRatePerGram: 0 });
  return created.toObject();
};

export const getMetalRates = async (): Promise<NextResponse> => {
  try {
    const rates = await readRates();
    // How many pieces this rate change would actually reprice — shown in admin so
    // the impact of an edit is visible before saving.
    const [goldCount, silverCount, platinumCount] = await Promise.all([
      Product.countDocuments({ pricingMode: 'formula', metal: 'Gold' }),
      Product.countDocuments({ pricingMode: 'formula', metal: 'Silver' }),
      Product.countDocuments({ pricingMode: 'formula', metal: 'Platinum' }),
    ]);

    return NextResponse.json(
      { success: true, rates, affected: { gold: goldCount, silver: silverCount, platinum: platinumCount } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Metal rate read error:", error);
    return NextResponse.json({ success: false, error: "Failed to load metal rates" }, { status: 500 });
  }
};

export const updateMetalRates = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();
    const body = await req.json();

    const gold = Number(body.goldRatePerGram);
    const silver = Number(body.silverRatePerGram);
    const platinum = Number(body.platinumRatePerGram);

    if ([gold, silver, platinum].some((r) => Number.isNaN(r) || r < 0)) {
      return NextResponse.json(
        { success: false, error: "Rates must be zero or a positive number." },
        { status: 400 }
      );
    }

    const rates = await MetalRate.findOneAndUpdate(
      { singleton: 'current' },
      { goldRatePerGram: gold, silverRatePerGram: silver, platinumRatePerGram: platinum },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    // Nothing else to write — formula-priced products derive their price from
    // these rates at read time, so this single update reprices the whole catalog.
    return NextResponse.json({ success: true, rates }, { status: 200 });
  } catch (error) {
    console.error("Metal rate update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update metal rates" }, { status: 500 });
  }
};
