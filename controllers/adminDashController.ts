import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import Product from "@/models/product";
import Review from "@/models/reviews";
import Inquiry from "@/models/Inquiry";

export const getDashboardStats = async (): Promise<NextResponse> => {
  try {
    await dbConnect();

    // No user accounts on the site any more (visitors answer a local-only survey
    // instead of registering), so there is no registered-user count to report.
    const [totalProducts, pendingInquiries, reviewStats] = await Promise.all([
      Product.countDocuments(),
      Inquiry.countDocuments(),
      Review.aggregate([
        { $group: { _id: null, totalReviews: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
      ]),
    ]);

    const { totalReviews = 0, avgRating = 0 } = reviewStats[0] || {};

    const dashboardData = {
      totalProducts,
      pendingInquiries,
      totalReviews,
      avgRating: Number(avgRating.toFixed(1)),
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
