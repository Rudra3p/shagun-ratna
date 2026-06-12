import Product from "@/models/product";
import { NextResponse } from "next/server";
export const addProduct = async (req: Request) => {
  try {
    const { productName, price, imageUrl, category, discount, offerPrice, offertime } = await req.json();
    const newProduct = new Product({
      productName,
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

export const getProducts = async () => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Get Products Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
};

export const deleteProduct = async (req: Request) => {
  try {
    const { id } = await req.json();
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
};

export const updateProduct = async (req: Request) => {
    try {
        const { id, productName, price, imageUrl, category, discount, offerPrice, offertime } = await req.json();
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { productName, price, imageUrl, category, discount, offerPrice, offertime },
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

