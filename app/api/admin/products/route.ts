import { 
  getProducts, 
  addProduct, 
  searchProducts, 
  updateProduct, 
  deleteProduct 
} from "@/controllers/productController";

// GET: Gateway to fetch all
export async function GET() { 
  return await getProducts(); 
}

// POST: Intelligent Dispatcher
export async function POST(req: Request) {
  const body = await req.json();
  
  // Logic branch: Search vs Add
  if (body.hasOwnProperty('search')) {
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

// PUT: Update
export async function PUT(req: Request) { 
  return await updateProduct(req); 
}

// DELETE: Remove
export async function DELETE(req: Request) { 
  return await deleteProduct(req); 
}