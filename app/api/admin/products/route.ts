import { 
  getProducts, 
  addProduct, 
  searchProducts, 
  updateProduct, 
  deleteProduct 
} from "@/controllers/productController";

// 1. READ
export async function GET() { 
  return await getProducts(); 
}

// 2. CREATE or SEARCH (The Intelligent Dispatcher)
export async function POST(req: Request) {
  const body = await req.json();

  if (body.hasOwnProperty('search')) {
    // Re-package the request for the search controller
    return await searchProducts(new Request(req.url, {
      method: 'POST',
      body: JSON.stringify(body)
    }));
  }
  
  return await addProduct(new Request(req.url, {
    method: 'POST',
    body: JSON.stringify(body)
  }));
}

// 3. UPDATE
export async function PUT(req: Request) { 
  return await updateProduct(req); 
}

// 4. DELETE
export async function DELETE(req: Request) { 
  return await deleteProduct(req); 
}