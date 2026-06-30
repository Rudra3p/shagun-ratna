import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import { getProducts, searchProducts } from "@/controllers/productController";

const ensureDB = async () => await dbConnect();

// PUBLIC GET ROUTE: Inside /api/user/products
export async function GET(req: Request) { 
  try {
    await ensureDB();
    
    const url = new URL(req.url);
    const searchParam = url.searchParams.get("search");

    // If a search parameter exists (?search=...), call searchProducts
    if (searchParam !== null) {
      return await searchProducts(req);
    }

    // Otherwise, standard view catalog
    return await getProducts(); 
  } catch (error: any) {
    console.error("User Route Product Fetch Crash Log:", error);
    return NextResponse.json(
      { error: "Unable to load collection data." }, 
      { status: 500 }
    );
  }
}