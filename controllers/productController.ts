import Product from "@/models/product";
import { NextResponse } from "next/server";
import dbConnect from '@/db/db';

// 1. ADD PRODUCT
// controllers/productController.ts

export const addProduct = async (req: Request) => {
  try {
    await dbConnect();
    const body = await req.json();

    // Sanitization layer
    const sanitizedData = {
      ...body,
      imageUrl: (body.imageUrl === "" || body.imageUrl === undefined) ? null : body.imageUrl,
      price: parseFloat(body.price) || 0,
      discount: parseFloat(body.discount) || 0,
      offerPrice: parseFloat(body.offerPrice) || 0,
      offertime: body.offertime ? new Date(body.offertime) : null
    };

    const newProduct = new Product(sanitizedData);
    await newProduct.save();

    return NextResponse.json({ 
      success: true, 
      message: "Product added successfully" 
    }, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to add product";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
};

// 2. SEARCH PRODUCTS (The Logic Refiner)
// Only extracts data (IDs/Category matches) and passes it to the Gateway
export const searchProducts = async (req: Request) => {
  try {
    const { search, page = 1, limit = 10 } = await req.json();

    if (!search || search.trim() === "") {
      return await getProducts(null, 0, page); // Fallback to standard pagination
    }

    // Aggregation with pagination
    const skip = (page - 1) * limit;
    const results = await Product.aggregate([
      { $search: { index: "default", text: { query: search, path: ["productName", "category"] } } },
      { $skip: skip },
      { $limit: limit }
    ]);

    // Get count for search
    const totalResults = await Product.aggregate([
      { $search: { index: "default", text: { query: search, path: ["productName", "category"] } } },
      { $count: "total" }
    ]);
    const total = totalResults.length > 0 ? totalResults[0].total : 0;

    // Pass data to Gateway
    return await getProducts(results, Math.ceil(total / limit), page);
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
};

// 3. GET PRODUCTS (The Data Gateway)
// This is the ONLY function that returns data to the frontend
export const getProducts = async (
  products: any[] | null = null, 
  totalPages: number = 0, 
  currentPage: number = 1
) => {
  try {
    // If we passed specific data (like search results), use it
    if (products) {
      return NextResponse.json({ products, totalPages, currentPage }, { status: 200 });
    }

    // Default fetch logic (if no products were provided)
    const page = currentPage;
    const limit = 10;
    const skip = (page - 1) * limit;

    const allProducts = await Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Product.countDocuments();

    return NextResponse.json({ 
      products: allProducts, 
      totalPages: Math.ceil(total / limit),
      currentPage: page 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
};

// 4. UPDATE PRODUCT
// controllers/productController.ts

export const updateProduct = async (req: Request) => {
  try {
    await dbConnect();
    
    // Extract ID from URL
    const url = new URL(req.url);
    const id = url.searchParams.get("id"); 
    
    if (!id) {
      return NextResponse.json({ error: "ID missing in URL" }, { status: 400 });
    }

    const body = await req.json();
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Updated", product: updatedProduct }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
};
// 5. DELETE PRODUCT
export const deleteProduct = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id"); // Extract from URL
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
};