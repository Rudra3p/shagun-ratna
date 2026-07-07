import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import Product from "@/models/product";
import Review from "@/models/reviews";
import User from "@/models/user";
import Inquiry from "@/models/Inquiry";

export const getDashboardStats = async (): Promise<NextResponse> => {
  try {
    await dbConnect();

    const [totalProducts, totalUsers, pendingInquiries, reviewStats] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Inquiry.countDocuments(),
      Review.aggregate([
        { $group: { _id: null, totalReviews: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
      ]),
    ]);

    const { totalReviews = 0, avgRating = 0 } = reviewStats[0] || {};

    const dashboardData = {
      totalProducts,
      totalUsers,
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
