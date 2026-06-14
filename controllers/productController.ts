import Product from "@/models/product";
import { NextResponse } from "next/server";

// 1. ADD PRODUCT
export const addProduct = async (req: Request) => {
  try {
    const { productName, price, imageUrl, category, discount, offerPrice, offertime } = await req.json();
    
    // Trim input to ensure clean search data
    const newProduct = new Product({
      productName: productName.trim(),
      price,
      imageUrl,
      category,
      discount,
      offerPrice,
      offertime,
    });
    
    await newProduct.save();
    return NextResponse.json({ message: "Product added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Add Product Error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
};

// 2. FUZZY SEARCH (Google-like)
export const searchProducts = async (req: Request) => {
  try {
    const { search } = await req.json();
    
    if (!search || search.trim() === "") {
        return NextResponse.json([]);
    }

    // Atlas Search Aggregation
    const products = await Product.aggregate([
      {
        $search: {
          index: "default", // Ensure this name matches your Atlas index
          text: {
            query: search,
            path: "productName",
            fuzzy: {
              maxEdits: 1, 
              prefixLength: 2 
            }
          }
        }
      },
      { $limit: 10 }
    ]);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 });
  }
};

// 3. GET ALL PRODUCTS
export const getProducts = async () => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
};

// 4. DELETE PRODUCT
export const deleteProduct = async (req: Request) => {
  try {
    const { id } = await req.json();
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
};

// 5. UPDATE PRODUCT
export const updateProduct = async (req: Request) => {
    try {
        const { id, productName, ...updateData } = await req.json();
        
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { ...updateData, productName: productName?.trim() },
            { new: true, runValidators: true }
        );
        
        if (!updatedProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Product updated successfully", product: updatedProduct }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
};