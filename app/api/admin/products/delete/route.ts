import { deleteProduct } from "@/controllers/productController";
export async function DELETE(req: Request) { return await deleteProduct(req); }