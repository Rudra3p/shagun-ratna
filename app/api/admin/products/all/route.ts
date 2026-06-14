import { getProducts } from "@/controllers/productController";
export async function GET() { return await getProducts(); }