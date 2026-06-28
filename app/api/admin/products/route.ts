import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import { 
  getProducts, 
  addProduct, 
  searchProducts, 
  updateProduct, 
  deleteProduct 
} from "@/controllers/productController";
import { generateUploadUrl } from "@/lib/r2Service";

const ensureDB = async () => await dbConnect();

export async function GET() { 
  await ensureDB();
  return await getProducts(); 
}

export async function POST(req: Request) {
  // Read and parse the request stream once here at the entrypoint
  const body = await req.json();

  // 1. Handle R2 Upload URL Requests
  if (body.action === 'get-upload-url') {
    const { fileName, fileType } = body;
    const uniqueKey = `products/${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
    const signedUrl = await generateUploadUrl(uniqueKey, fileType);
    
    // Construct the public storage endpoint string to complement the upload link
    const r2PublicDomain = process.env.R2_PUBLIC_DOMAIN; // e.g., https://assets.yourdomain.com
    const publicUrl = `${r2PublicDomain}/${uniqueKey}`;

    return NextResponse.json({ signedUrl, uniqueKey, publicUrl });
  }

  // Ensure database initialization for downstream operations
  await ensureDB();

  // 2. Handle System Search Pipelines
  if (body.hasOwnProperty('search')) {
    // Pass the already parsed body directly to prevent stream re-reading issues
    return await searchProducts(new Request(req.url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: req.headers
    }));
  }
  
  // 3. Handle Add Product Entry Tasks
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