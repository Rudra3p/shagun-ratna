import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import User from "@/models/user";
import Product from "@/models/product";
import Showcase from "@/models/showcase";
import { verifyUserSession } from "@/lib/verifyUserSession";

export const getRecommendations = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();

    const userId = await verifyUserSession(req.headers.get("cookie"));
    if (!userId) {
      return NextResponse.json({ success: true, recommended: false, products: [] }, { status: 200 });
    }

    const user = await User.findById(userId).select("age gender");
    if (!user) {
      return NextResponse.json({ success: true, recommended: false, products: [] }, { status: 200 });
    }

    const age = user.age;

    const matchingCollections = await Showcase.find({
      minAge: { $lte: age },
      maxAge: { $gte: age },
      $or: [{ gender: "All" }, { gender: "Unisex" }, { gender: user.gender }],
    }).select("productIds");

    const productIdSet = new Set<string>();
    for (const collection of matchingCollections) {
      for (const pid of collection.productIds) {
        productIdSet.add(pid.toString());
      }
    }

    if (productIdSet.size === 0) {
      return NextResponse.json({ success: true, recommended: false, products: [] }, { status: 200 });
    }

    const products = await Product.find({ _id: { $in: Array.from(productIdSet) } });

    return NextResponse.json({ success: true, recommended: true, products }, { status: 200 });
  } catch (error) {
    console.error("Recommendation Error:", error);
    return NextResponse.json({ success: false, recommended: false, products: [] }, { status: 500 });
  }
};
