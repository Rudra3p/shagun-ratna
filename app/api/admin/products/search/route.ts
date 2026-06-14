import { searchProducts } from "@/controllers/productController";
export async function POST(req: Request) { return await searchProducts(req); }