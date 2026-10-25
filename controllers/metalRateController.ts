import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import MetalRate from "@/models/metalRate";
import Product from "@/models/product";
import { scrapeDailyMetalRates } from "@/lib/metalRateScraper";

const DEFAULT_RATES = {
  goldRatePerGram: 14260,
  silverRatePerGram: 220,
  platinumRatePerGram: 5500,
} as const;

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

const ONE_HOUR_MS = 60 * 60 * 1000; // 1 hour cache window
let inFlightScrapePromise: Promise<RateDocument | null> | null = null;

// Resolves current metal rates with an automated 1-hour live scraper cache:
// - When a visitor arrives: checks if the existing rate was updated within the last 1 hour.
// - If within 1 hour: returns the cached database rate immediately (no scraper called).
// - If after 1 hour (or never set): triggers the live Ahmedabad & IBJA scraper, saves to DB, and returns updated rates.
export const readRates = async (): Promise<RateDocument> => {
  await dbConnect();
  const existing = (await MetalRate.findOne({ singleton: 'current' }).lean()) as RateDocument | null;

  const now = Date.now();
  const lastUpdated = existing?.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
  const isOlderThanOneHour = !existing || (now - lastUpdated) >= ONE_HOUR_MS;

  // Rate is older than 1 hour (or initial visit): run live scraper
  if (isOlderThanOneHour) {
    try {
      if (!inFlightScrapePromise) {
        inFlightScrapePromise = updateMetalRatesFromApi()
          .catch((scrapeErr) => {
            console.warn("[Live Metal Scraper] Hourly scrape failed, falling back to cached rates:", scrapeErr);
            return null;
          })
          .finally(() => {
            inFlightScrapePromise = null;
          });
      }

      const freshlyScraped = await inFlightScrapePromise;
      if (freshlyScraped) {
        return freshlyScraped;
      }
    } catch (err) {
      console.warn("[Live Metal Scraper] In-flight scraper error:", err);
    }
  }

  // Rate was updated within 1 hour (or fallback used on network glitch)
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

    return (repaired || { ...existing, ...repairs }) as RateDocument;
  }

  // Safety fallback if database had no record and scraper failed
  const created = await MetalRate.create({
    singleton: 'current',
    ...DEFAULT_RATES,
    source: 'Safe Fallback (Ahmedabad Rates)',
    updatedBy: 'System',
  });
  return created.toObject() as RateDocument;
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
        source: 'Admin Manual Update',
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

// Live Hourly & Scheduled Scraper: fetches Ahmedabad, Gujarat daily rates with IBJA official fallback
export async function updateMetalRatesFromApi(): Promise<RateDocument> {
  const scraped = await scrapeDailyMetalRates();

  await dbConnect();
  const updated = await MetalRate.findOneAndUpdate(
    { singleton: 'current' },
    {
      goldRatePerGram: scraped.goldRatePerGram,
      silverRatePerGram: scraped.silverRatePerGram,
      platinumRatePerGram: scraped.platinumRatePerGram,
      source: scraped.source,
      updatedBy: 'Live Hourly Scraper',
      updatedAt: new Date(),
    },
    { new: true, upsert: true, runValidators: true }
  ).lean();

  if (!updated) throw new Error('Scraped metal rates could not be saved to database');
  return updated as RateDocument;
}

// Admin manual trigger for instant market scrape & sync
export const syncMetalRates = async (): Promise<NextResponse> => {
  try {
    const rates = await updateMetalRatesFromApi();
    return NextResponse.json({ success: true, rates }, { status: 200 });
  } catch (error: any) {
    console.error("Metal rate scraper sync error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to scrape daily metal rates" },
      { status: 500 }
    );
  }
};
