import { NextResponse } from "next/server";
// TODO: Adjust these import paths to match your actual folder structure
import dbConnect from "@/db/db"; 
import Product from "@/models/product";
// import Review from "@/models/review";
import User from "@/models/user";
// import Inquiry from "@/models/Inquiry";

export async function GET() {
  try {
    // 1. Ensure MongoDB is connected before running queries
    await dbConnect();

    // 2. Fetch all counts in parallel for faster performance
    const [
      totalProducts,
    //   totalReviews,
    //   totalUsers,
    //   pendingInquiries
    ] = await Promise.all([
      Product.countDocuments(),
    //   Review.countDocuments(),
      User.countDocuments(),
    //   Inquiry.countDocuments({ status: "pending" }) // Assuming your Inquiry schema has a status field
    ]);

    // 3. Assemble the payload mapping exactly to your frontend state
    const dashboardData = {
      totalProducts,
    //   totalReviews,
    //   totalUsers,
    //   pendingInquiries,
      // Note: Live visitors usually requires WebSockets (Socket.io) or Google Analytics APIs. 
      // We will keep it as a static string for now to match your UI.
      liveVisitors: "15,420", 
    };

    // 4. Send the successful response
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
}