import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import { 
  getProducts, 
  addProduct, 
  searchProducts, 
  updateProduct, 
  deleteProduct 
} from "@/controllers/productController";

// Helper to ensure DB is connected before any logic
const ensureDB = async () => await dbConnect();

export async function GET() { 
  await ensureDB();
  return await getProducts(); 
}

export async function POST(req: Request) {
  await ensureDB(); // Connection happens here first
  const body = await req.json();
  
  if (body.hasOwnProperty('search')) {
    // Note: Creating a new Request object is clever, but make sure
    // your searchProducts logic can handle the cloned request.
    return await searchProducts(new Request(req.url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: req.headers
    }));
  }
  
  return await addProduct(new Request(req.url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: req.headers
  }));
}

export async function PUT(req: Request) { 
  await ensureDB();
  return await updateProduct(req); 
}

export async function DELETE(req: Request) { 
  await ensureDB();
  return await deleteProduct(req); 
}