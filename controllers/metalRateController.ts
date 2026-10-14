import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import MetalRate from "@/models/metalRate";
import Product from "@/models/product";

const DEFAULT_RATES = {
  goldRatePerGram: 7850,
  silverRatePerGram: 95,
  platinumRatePerGram: 3200,
} as const;

const IBJA_API_BASE_URL = "https://ibja-api.vercel.app";

type RateDocument = {
  singleton: string;
  goldRatePerGram: number;
  silverRatePerGram: number;
  platinumRatePerGram: number;
  source?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type JsonObject = Record<string, unknown>;

function asObject(value: unknown): JsonObject | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as JsonObject
    : null;
}

function asPositiveNumber(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;

  const numberValue = Number(String(value).replace(/[,₹\s]/g, ""));
  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : null;
}

// Always resolves to the single rate document, creating it on first use so the
// admin screen has something to edit rather than erroring on an empty database.
export const readRates = async () => {
  await dbConnect();
  const existing = await MetalRate.findOne({ singleton: 'current' }).lean();
  if (existing) {
    const repairs = {
      ...(existing.goldRatePerGram > 0 ? {} : { goldRatePerGram: DEFAULT_RATES.goldRatePerGram }),
      ...(existing.silverRatePerGram > 0 ? {} : { silverRatePerGram: DEFAULT_RATES.silverRatePerGram }),
      ...(existing.platinumRatePerGram > 0 ? {} : { platinumRatePerGram: DEFAULT_RATES.platinumRatePerGram }),
    };

    if (Object.keys(repairs).length === 0) return existing;

    const repaired = await MetalRate.findOneAndUpdate(
      { singleton: 'current' },
      repairs,
      { new: true, runValidators: true }
    ).lean();

    return repaired || { ...existing, ...repairs };
  }

  const created = await MetalRate.create({
    singleton: 'current',
    ...DEFAULT_RATES,
    source: 'Safe Fallback',
    updatedBy: 'System',
  });
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
      {
        goldRatePerGram: gold,
        silverRatePerGram: silver,
        platinumRatePerGram: platinum,
        source: 'Admin Dashboard',
        updatedBy: 'Admin Dashboard',
      },
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

export async function updateMetalRatesFromApi(): Promise<RateDocument> {
  const fetchJson = async (path: string): Promise<JsonObject> => {
    const response = await fetch(`${IBJA_API_BASE_URL}${path}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`IBJA ${path} request failed (${response.status})`);

    const payload = asObject(await response.json());
    if (!payload) throw new Error(`IBJA ${path} returned an invalid JSON object`);
    return payload;
  };

  const [goldPayload, silverPayload, platinumPayload] = await Promise.all([
    fetchJson('/latest'),
    fetchJson('/silver/latest'),
    fetchJson('/platinum/latest'),
  ]);

  const goldPerTenGrams = asPositiveNumber(goldPayload.lblGold999_PM)
    ?? asPositiveNumber(goldPayload.lblGold999_AM);
  const silverPerKilogram = asPositiveNumber(silverPayload.lblSilver999_PM)
    ?? asPositiveNumber(silverPayload.lblSilver999_AM);
  const platinumPerGram = asPositiveNumber(platinumPayload.lblPlatinum999_PM)
    ?? asPositiveNumber(platinumPayload.lblPlatinum999_AM);

  if (goldPerTenGrams === null || silverPerKilogram === null || platinumPerGram === null) {
    throw new Error('IBJA responses did not contain valid AM/PM metal rates');
  }

  const rates = {
    goldRatePerGram: goldPerTenGrams / 10,
    silverRatePerGram: silverPerKilogram / 1000,
    platinumRatePerGram: platinumPerGram / 10,
  };

  await dbConnect();
  const updated = await MetalRate.findOneAndUpdate(
    { singleton: 'current' },
    { ...rates, source: 'IBJA-Automated', updatedBy: 'Cron Job', updatedAt: new Date() },
    { new: true, upsert: true, runValidators: true }
  ).lean();

  if (!updated) throw new Error('IBJA rates could not be saved');
  return updated as RateDocument;
}
