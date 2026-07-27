import dbConnect from "@/db/db";
import Product from "@/models/product";

const BASE_URL = "https://shagunratna.com";

// Cap the inline product list so the file stays a quick, cheap fetch even as the catalog grows.
const MAX_PRODUCTS = 300;

export async function GET() {
  await dbConnect();
  const [products, totalCount] = await Promise.all([
    Product.find()
      .select("productName price category purity description offerPrice featured")
      .sort({ featured: -1, createdAt: -1 })
      .limit(MAX_PRODUCTS)
      .lean(),
    Product.countDocuments(),
  ]);

  const productLines = products
    .map((product) => {
      const price = product.offerPrice > 0 ? product.offerPrice : product.price;
      const purity = product.purity ? `${product.purity} ` : "";
      const summary = product.description.length > 140
        ? `${product.description.slice(0, 140).trim()}...`
        : product.description;
      return `- [${product.productName}](${BASE_URL}/collection/${product._id}): ${purity}${product.category} — ₹${price.toLocaleString("en-IN")}. ${summary}`;
    })
    .join("\n");

  const truncationNote = totalCount > products.length
    ? `\n\n_Showing ${products.length} of ${totalCount} products. Full catalog: ${BASE_URL}/collection — every product URL is also listed in ${BASE_URL}/sitemap.xml._`
    : "";

  const body = `# Shagun Ratna

> Shagun Ratna is a premium handcrafted jewelry boutique founded in 1980 in Ahmedabad, India. It offers authentic gold, diamond, and gemstone jewelry — every gold piece is BIS hallmarked and every gemstone independently lab-certified, with diamonds graded against GIA/IGI standards.

Shagun Ratna is a family jewelry house with four decades of craftsmanship, specializing in bridal sets, gold heirlooms, solitaire diamonds, and astrological/rashi gemstones, alongside bespoke commission design. The brand emphasizes ethical sourcing, sustainability, and verified authenticity behind every piece.

## Pages

- [Home](${BASE_URL}/): brand introduction, featured and new collections
- [Collection](${BASE_URL}/collection): full jewelry catalog, filterable by category
- [About](${BASE_URL}/about): heritage (est. 1980), philosophy, certifications, boutique story, and FAQ
- [Contact](${BASE_URL}/contact): inquiry form and boutique details
- [Reviews](${BASE_URL}/reviews): customer testimonials

## Categories

- Bridal & Wedding Sets
- Gold Heirlooms & Necklaces
- Solitaire Diamonds & Rings
- Astrological & Rashi Gems
- Bespoke Commission Design

## Products${truncationNote}

${productLines}

## Boutique details

- Flagship Boutique: GF/9, Akshar Complex, Beside Harit Zaveri, Shivranjani Cross Road, Satellite, Ahmedabad, Gujarat 380015, India
- Phone: +91 22 2282 9800 / +91 95588 88754
- Email: concierge@shagunratna.com / info@shagunratna.com
- Hours: Monday–Saturday, 11:00 AM–8:00 PM. Sunday by appointment only.

## Optional

- [Sitemap](${BASE_URL}/sitemap.xml): full list of pages and product URLs
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
