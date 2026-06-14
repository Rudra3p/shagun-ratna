import { updateProduct } from "@/controllers/productController";
export async function PUT(req: Request) { return await updateProduct(req); }