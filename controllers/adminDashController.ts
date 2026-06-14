import Product from "@/models/product";
import Inquiry from "@/models/inquiry"; // Assuming you created this model
import Order from "@/models/order";     // Assuming this handles your POS/Offline sales
import { NextResponse } from "next/server";

export const getDashboardStats = async () => {
  try {
    // 1. Get counts for your KPI cards
    const totalProducts = await Product.countDocuments();
    
    // 2. Aggregate total revenue from Offline Sales
    const offlineSales = await Order.aggregate([
      { $match: { orderType: 'OFFLINE' } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    
    const totalOfflineRevenue = offlineSales.length > 0 ? offlineSales[0].total : 0;

    // 3. Get Low Stock Alert (Products with quantity < 3)
    const lowStockItems = await Product.find({ stock: { $lt: 3 } }).limit(5);

    // 4. Get recent inquiries to show on the dashboard
    const recentInquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(5);

    return NextResponse.json({
      totalProducts,
      totalOfflineRevenue,
      lowStockItems,
      recentInquiries
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
};