import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import { getProducts, searchProducts } from "@/controllers/productController";

const ensureDB = async () => await dbConnect();

// Edge-cache policy for the public catalog. This payload is identical for every
// visitor (no per-user data — recommendations live on their own route), so each
// page of the collection can be served straight from the CDN instead of hitting
// MongoDB on every infinite-scroll fetch.
//   max-age=0            → the browser always revalidates, so edits show up promptly
//   s-maxage=300         → the CDN serves it for 5 minutes without touching origin
//   stale-while-revalidate → past that, users still get an instant cached response
//                            while the CDN refreshes in the background
// `CDN-Cache-Control` is the CDN-specific override Cloudflare reads; Vercel's edge
// honours the s-maxage in `Cache-Control`, so both layers are covered.
const CATALOG_CACHE = "public, max-age=0, s-maxage=300, stale-while-revalidate=3600";

const withCatalogCache = (res: NextResponse): NextResponse => {
  // Never cache a failure — the controllers can return their own 500, and pinning
  // that at the edge would keep the collection broken long after the DB recovers.
  if (!res.ok) return res;
  res.headers.set("Cache-Control", CATALOG_CACHE);
  res.headers.set("CDN-Cache-Control", CATALOG_CACHE);
  return res;
};

// PUBLIC GET ROUTE: Inside /api/user/products
export async function GET(req: Request) {
  try {
    await ensureDB();

    const url = new URL(req.url);
    const searchParam = url.searchParams.get("search");

    // If a search parameter exists (?search=...), call searchProducts
    if (searchParam !== null) {
      return withCatalogCache(await searchProducts(req));
    }

    // Otherwise, standard view catalog
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    return withCatalogCache(await getProducts(null, 0, page, 0, limit));
  } catch (error: any) {
    console.error("User Route Product Fetch Crash Log:", error);
    return NextResponse.json(
      { error: "Unable to load collection data." }, 
      { status: 500 }
    );
  }
}