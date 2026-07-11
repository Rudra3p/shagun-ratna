import { getHomepageContent } from "@/controllers/showcaseController";

// PUBLIC GET ROUTE: Inside /api/user/site-content
// Resolves the admin-assigned "New Launch" and "Featured 1..3" zones from /admin/product-mapping
export async function GET() {
  return getHomepageContent();
}
