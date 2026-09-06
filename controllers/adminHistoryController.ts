import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import Inquiry from "@/models/Inquiry";
import Product from "@/models/product";
import Review from "@/models/reviews";
import VisitLog from "@/models/VisitLog";

const DAY_MS = 24 * 60 * 60 * 1000;

const toDateKey = (d: Date): string => d.toISOString().slice(0, 10);

const countByDay = (docs: { createdAt: Date }[]): Map<string, number> => {
  const map = new Map<string, number>();
  for (const doc of docs) {
    const key = toDateKey(new Date(doc.createdAt));
    map.set(key, (map.get(key) || 0) + 1);
  }
  return map;
};

export const getHistoryStats = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const range = url.searchParams.get("range") === "weekly" ? "weekly" : "daily";
    const totalDays = range === "weekly" ? 56 : 14; // 8 weeks or 14 days

    const now = new Date();
    const startDate = new Date(now.getTime() - (totalDays - 1) * DAY_MS);
    startDate.setUTCHours(0, 0, 0, 0);

    const [inquiries, reviews, products, visits] = await Promise.all([
      Inquiry.find({ createdAt: { $gte: startDate } }).select("createdAt").lean(),
      Review.find({ createdAt: { $gte: startDate } }).select("createdAt").lean(),
      Product.find({ createdAt: { $gte: startDate } }).select("createdAt").lean(),
      VisitLog.find({ date: { $gte: toDateKey(startDate) } }).select("date count").lean(),
    ]);

    const inquiryByDay = countByDay(inquiries as { createdAt: Date }[]);
    const reviewByDay = countByDay(reviews as { createdAt: Date }[]);
    const productByDay = countByDay(products as { createdAt: Date }[]);

    const visitByDay = new Map<string, number>();
    for (const v of visits as { date: string; count: number }[]) {
      visitByDay.set(v.date, v.count);
    }

    // Most recent day first
    const dayKeys: string[] = [];
    for (let i = 0; i < totalDays; i++) {
      dayKeys.push(toDateKey(new Date(now.getTime() - i * DAY_MS)));
    }

    const dailyStats = dayKeys.map((key) => ({
      date: key,
      visitors: visitByDay.get(key) || 0,
      inquiries: inquiryByDay.get(key) || 0,
      reviews: reviewByDay.get(key) || 0,
      products: productByDay.get(key) || 0,
    }));

    if (range === "daily") {
      return NextResponse.json({ success: true, range, data: dailyStats }, { status: 200 });
    }

    // Bucket the daily stats into 7-day weeks, most recent week first
    const weeklyStats = [];
    for (let i = 0; i < dailyStats.length; i += 7) {
      const bucket = dailyStats.slice(i, i + 7);
      weeklyStats.push({
        startDate: bucket[bucket.length - 1].date,
        endDate: bucket[0].date,
        visitors: bucket.reduce((sum, d) => sum + d.visitors, 0),
        inquiries: bucket.reduce((sum, d) => sum + d.inquiries, 0),
        reviews: bucket.reduce((sum, d) => sum + d.reviews, 0),
        products: bucket.reduce((sum, d) => sum + d.products, 0),
      });
    }

    return NextResponse.json({ success: true, range, data: weeklyStats }, { status: 200 });
  } catch (error) {
    console.error("History Stats API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch history stats" },
      { status: 500 }
    );
  }
};
