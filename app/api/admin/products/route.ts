import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import {
  getProducts,
  addProduct,
  searchProducts,
  updateProduct,
  deleteProduct,
  syncFeaturedProducts
} from "@/controllers/productController";
import { generateUploadUrl } from "@/lib/r2Service";

const ensureDB = async () => await dbConnect();

// 1. GET ROUTE: Handles default catalog loading AND active query string searches
export async function GET(req: Request) { 
  await ensureDB();
  
  const url = new URL(req.url);
  const searchParam = url.searchParams.get("search");

  // 🧠 FIX: If the URL string contains a '?search=' parameter, pipe the request to searchProducts!
  if (searchParam !== null) {
    return await searchProducts(req);
  }

  // Otherwise, fallback to the standard paginated catalog view
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  return await getProducts(null, 0, page, 0, limit);
}

// 2. POST ROUTE: Handles R2 image uploading operations and data asset insertions
export async function POST(req: Request) {
  // Read and parse the request stream once here at the entrypoint
  const body = await req.json();

  // Handle R2 Upload URL Requests
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
  
  // Handle Add Product Entry Tasks (Cleaned up the old dead POST search check)
  return await addProduct(new Request(req.url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: req.headers
  }));
}

// 3. PUT ROUTE: Handles inventory updates, or (with no ?id=) syncing the homepage grid selection
export async function PUT(req: Request) {
  await ensureDB();

  const url = new URL(req.url);
  if (!url.searchParams.get("id")) {
    return await syncFeaturedProducts(req);
  }

  return await updateProduct(req);
}

// 4. DELETE ROUTE: Handles inventory entry deletions
export async function DELETE(req: Request) { 
  await ensureDB();
  return await deleteProduct(req); 
}