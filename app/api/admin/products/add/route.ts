import { addProduct } from "@/controllers/productController";
export async function POST(req: Request) { return await addProduct(req); }