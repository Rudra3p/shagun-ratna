import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import Product from "@/models/product";
import Review from "@/models/reviews";
import Inquiry from "@/models/Inquiry";
import VisitLog from "@/models/VisitLog";

const DAY_MS = 24 * 60 * 60 * 1000;

export const getDashboardStats = async (): Promise<NextResponse> => {
  try {
    await dbConnect();

    // No user accounts on the site any more (visitors answer a local-only survey
    // instead of registering), so there is no registered-user count to report.
    // Rolling 30 days, inclusive of today — VisitLog keys are "YYYY-MM-DD" strings,
    // so a lexicographic $gte is the same as a date comparison.
    const monthStartKey = new Date(Date.now() - 29 * DAY_MS).toISOString().slice(0, 10);

    const [totalProducts, pendingInquiries, reviewStats, visitLogs] = await Promise.all([
      Product.countDocuments(),
      // Only the ones still awaiting a reply. This used to count every inquiry ever
      // received, under a card headed "Pending" — the client would chase enquiries
      // they had already dealt with.
      Inquiry.countDocuments({ status: "pending" }),
      Review.aggregate([
        { $group: { _id: null, totalReviews: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
      ]),
      VisitLog.find({ date: { $gte: monthStartKey } }).select("count").lean(),
    ]);

    const { totalReviews = 0, avgRating = 0 } = reviewStats[0] || {};
    const monthlyVisitors = (visitLogs as { count?: number }[]).reduce(
      (sum, log) => sum + (log.count || 0),
      0
    );

    const dashboardData = {
      totalProducts,
      pendingInquiries,
      totalReviews,
      avgRating: Number(avgRating.toFixed(1)),
      monthlyVisitors,
    };

    return NextResponse.json(
      { success: true, data: dashboardData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
};
