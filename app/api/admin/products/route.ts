import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import { 
  getProducts, 
  addProduct, 
  searchProducts, 
  updateProduct, 
  deleteProduct 
} from "@/controllers/productController";
import { generateUploadUrl } from "@/lib/r2Service"; // Import the service

const ensureDB = async () => await dbConnect();

export async function GET() { 
  await ensureDB();
  return await getProducts(); 
}

export async function POST(req: Request) {
  const body = await req.json();

  // NEW: Handle R2 Upload URL Request
  if (body.action === 'get-upload-url') {
    const { fileName, fileType } = body;
    const uniqueKey = `products/${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
    const signedUrl = await generateUploadUrl(uniqueKey, fileType);
    return NextResponse.json({ signedUrl, uniqueKey });
  }

  // EXISTING: Handle Search
  await ensureDB();
  if (body.hasOwnProperty('search')) {
    return await searchProducts(new Request(req.url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: req.headers
    }));
  }
  
  // EXISTING: Handle Add Product
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