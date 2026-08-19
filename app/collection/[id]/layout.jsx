import { cache } from "react";
import dbConnect from "@/db/db";
import Product from "@/models/product";
import { formatCategory } from "@/lib/formatCategory";

const getProduct = cache(async (id) => {
  await dbConnect();
  try {
    return await Product.findById(id).lean();
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: { absolute: "Product Not Found | Shagun Ratna" },
      robots: { index: false, follow: true },
    };
  }

  const materialText = product.purity ? `${product.purity} ` : "";
  const categoryText = formatCategory(product.category) || "fine jewelry";
  const description = product.description
    ? product.description.slice(0, 160)
    : `Shop the ${product.productName} from Shagun Ratna — ${materialText}${categoryText}.`;

  return {
    // Explicit .absolute: a title from generateMetadata in a nested layout doesn't
    // reliably inherit the root's title.template when the page below it defines no
    // metadata of its own, so the brand suffix is spelled out here instead.
    title: { absolute: `${product.productName} | Shagun Ratna` },
    description,
    alternates: {
      canonical: `https://shagunratna.com/collection/${id}`,
    },
    openGraph: {
      title: `${product.productName} | Shagun Ratna`,
      description,
      url: `https://shagunratna.com/collection/${id}`,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
      type: "website",
    },
  };
}

export default async function ProductLayout({ children, params }) {
  const { id } = await params;
  const product = await getProduct(id);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.productName,
        image: product.imageUrl ? [product.imageUrl] : undefined,
        description: product.description || undefined,
        category: formatCategory(product.category) || undefined,
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: product.offerPrice > 0 ? product.offerPrice : product.price,
          availability: "https://schema.org/InStock",
          url: `https://shagunratna.com/collection/${id}`,
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
