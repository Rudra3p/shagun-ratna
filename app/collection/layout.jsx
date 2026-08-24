import dbConnect from "@/db/db";
import Product from "@/models/product";
import { SITE_URL, breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { readRates } from "@/controllers/metalRateController";
import { applyPricingToList } from "@/lib/pricing";

// The grid itself is client-fetched, so the server HTML carries no product text for
// crawlers to read. Emitting the catalog as ItemList structured data below gives
// Google the real pieces without depending on it executing the page's JavaScript.
// Revalidated rather than request-time rendered so the page stays edge-cacheable.
export const revalidate = 300;

const MAX_LISTED = 30;

export const metadata = {
  title: "Jewellery Collection — Gold, Diamond & Certified Gemstones",
  description:
    "Browse the full Shagun Ratna collection in Ahmedabad — certified natural gemstones (ruby, emerald, sapphire, diamond alternatives) alongside handcrafted gold and diamond jewellery: rings, necklaces, earrings, bangles, bracelets and pendants.",
  keywords: [
    "Shagun Ratna collection",
    "jewellery collection Ahmedabad",
    "gold jewellery Ahmedabad",
    "diamond jewellery Ahmedabad",
    "certified gemstones Ahmedabad",
    "ruby emerald sapphire jewellery",
    "gold necklace designs",
    "diamond rings India",
    "bridal jewellery Ahmedabad",
    "BIS hallmarked gold jewellery",
  ],
  alternates: {
    canonical: `${SITE_URL}/collection`,
  },
  openGraph: {
    title: "Jewellery Collection | Shagun Ratna",
    description:
      "Explore certified natural gemstones and handcrafted gold and diamond jewellery from Shagun Ratna, Ahmedabad — crafted since 1980.",
    url: `${SITE_URL}/collection`,
    siteName: "Shagun Ratna Jewelry",
    images: [{ url: "/og-jewelry.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
};

export default async function CollectionLayout({ children }) {
  await dbConnect();
  const rawProducts = await Product.find()
    // Formula fields included so structured-data prices match what shoppers see
    .select("productName imageUrl price offerPrice updatedAt purity pricingMode metal metalWeight labourCost discount")
    .sort({ featured: -1, createdAt: -1 })
    .limit(MAX_LISTED)
    .lean();
  const products = applyPricingToList(rawProducts, await readRates());

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Jewellery Collection",
    description:
      "The full Shagun Ratna catalogue of certified natural gemstones and handcrafted gold and diamond jewellery.",
    url: `${SITE_URL}/collection`,
    isPartOf: { "@type": "WebSite", name: "Shagun Ratna", url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.productName,
          url: `${SITE_URL}/collection/${product._id}`,
          image: product.imageUrl || undefined,
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: product.offerPrice > 0 ? product.offerPrice : product.price,
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/collection/${product._id}`,
          },
        },
      })),
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Collection", path: "/collection" },
      ])} />
      <JsonLd data={collectionJsonLd} />
      {children}
    </>
  );
}
