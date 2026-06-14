import Product from "@/models/product";
import { NextResponse } from "next/server";

// 1. ADD PRODUCT
export const addProduct = async (req: Request) => {
  try {
    const { productName, price, imageUrl, category, discount, offerPrice, offertime } = await req.json();
    
    const newProduct = new Product({
      productName: productName?.trim(),
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

// 2. SEARCH PRODUCTS (The Logic Refiner)
// Only extracts data (IDs/Category matches) and passes it to the Gateway
export const searchProducts = async (req: Request) => {
  try {
    const { search } = await req.json();

    if (!search || search.trim() === "") {
      return await getProducts(); // If no search, jump to default Gateway
    }

    const results = await Product.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: search,
            path: ["productName", "category"],
            fuzzy: { maxEdits: 1, prefixLength: 2 }
          }
        }
      },
      { $limit: 20 }
    ]);

    // Pass the filtered results to the Gateway
    return await getProducts(results);
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
};

// 3. GET PRODUCTS (The Data Gateway)
// This is the ONLY function that returns data to the frontend
export const getProducts = async (refinedResults: any[] | null = null) => {
  try {
    let finalProducts;

    if (refinedResults && refinedResults.length > 0) {
      finalProducts = refinedResults;
    } else {
      finalProducts = await Product.find().sort({ createdAt: -1 });
    }

    return NextResponse.json(finalProducts, { status: 200 });
  } catch (error) {
    console.error("Get Product Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
};

// 4. UPDATE PRODUCT
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
    console.error("Update Product Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
};

// 5. DELETE PRODUCT
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