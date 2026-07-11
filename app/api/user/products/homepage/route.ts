import { getHomepageShowcase } from "@/controllers/showcaseController";

// PUBLIC GET ROUTE: Inside /api/user/products/homepage
// Resolves the admin-assigned "Card 1".."Card 6" zones from /admin/product-mapping
export async function GET(req: Request) {
  return getHomepageShowcase(req);
}
