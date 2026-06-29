import Showcase from "@/models/showcase";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import dbConnect from '@/db/db';

// 1. GET SHOWCASE DATA (For Homepage Popular Cards & Age/Gender Filters)
export const getShowcase = async (req: Request) => {
  try {
    await dbConnect();
    
    // Parse the incoming URL filter params
    const { searchParams } = new URL(req.url);
    const popular = searchParams.get("popular"); // e.g., ?popular=true
    const gender = searchParams.get("gender");   // e.g., ?gender=Female
    const age = searchParams.get("age");         // e.g., ?age=Adult

    // Dynamic query building
    let query: any = {};

    if (popular === "true") {
      query.isPopularHomepage = true;
    }
    if (gender) {
      query.targetGender = gender;
    }
    if (age) {
      query.targetAgeGroup = age;
    }

    // Find entries and populate the full product payload from the "products" collection
    const showcaseItems = await Showcase.find(query)
      .populate({
        path: "productRefId",
        model: Product
      })
      .sort({ updatedAt: -1 })
      .limit(popular === "true" ? 6 : 20); // Cap popular items at exactly 6 cards!

    // Format the response nicely
    const responseData = showcaseItems.map(item => ({
      showcaseId: item._id,
      isPopular: item.isPopularHomepage,
      gender: item.targetGender,
      ageGroup: item.targetAgeGroup,
      product: item.productRefId // This contains the full image, price, title details
    }));

    const response = NextResponse.json({ success: true, data: responseData }, { status: 200 });

    // 🔥 CRITICAL: Cache this data on Cloudflare CDN for 1 hour
    // Since these collections don't change every second, caching them saves huge server costs!
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=60"
    );

    return response;

  } catch (error) {
    console.error("Showcase fetch system error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch showcase items" }, { status: 500 });
  }
};

// 2. CONFIGURE / SAVE SHOWCASE ITEM (Admin Dashboard Operations)
export const configureShowcase = async (req: Request) => {
  try {
    await dbConnect();
    const body = await req.json();
    const { productRefId, isPopularHomepage, targetGender, targetAgeGroup } = body;

    if (!productRefId) {
      return NextResponse.json({ success: false, error: "Product reference link ID missing" }, { status: 400 });
    }

    // If setting a popular homepage item, verify we don't exceed the client's 6-card limit
    if (isPopularHomepage === true) {
      const activePopularCount = await Showcase.countDocuments({ isPopularHomepage: true, productRefId: { $ne: productRefId } });
      if (activePopularCount >= 6) {
        return NextResponse.json({ 
          success: false, 
          error: "Limit exceeded! You already have 6 popular cards selected for the home page. Deselect one first." 
        }, { status: 400 });
      }
    }

    // Upsert mechanism: Create or update configuration parameters atomically
    const configuredItem = await Showcase.findOneAndUpdate(
      { productRefId },
      { 
        isPopularHomepage, 
        targetGender: targetGender || "All", 
        targetAgeGroup: targetAgeGroup || "All" 
      },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Showcase properties saved successfully", 
      data: configuredItem 
    }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Configuration failed";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
};