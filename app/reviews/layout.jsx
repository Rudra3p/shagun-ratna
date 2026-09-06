import { SITE_URL, breadcrumbJsonLd, JsonLd } from "@/lib/seo";

export const metadata = {
  // Renders as "Customer Reviews & Ratings | Shagun Ratna" through the root
  // template — the brand and the word people actually search sit side by side,
  // and it stays inside the ~60 characters Google shows before truncating.
  title: "Customer Reviews & Ratings",
  description:
    "Genuine customer reviews and star ratings for Shagun Ratna Gems & Jewellers, Ahmedabad — feedback on certified gemstones, gold and diamond jewellery.",
  keywords: [
    "Shagun Ratna reviews",
    "Shagunratna review",
    "Shagun Ratna Gems & Jewellers review",
    "Shagun Ratna Ahmedabad reviews",
    "Shagun Ratna ratings",
    "jewellery shop reviews Ahmedabad",
    "gemstone dealer reviews Ahmedabad",
    "jewellers Satellite Ahmedabad reviews",
  ],
  alternates: {
    canonical: `${SITE_URL}/reviews`,
  },
  openGraph: {
    title: "Customer Reviews & Ratings | Shagun Ratna",
    description:
      "What customers say about Shagun Ratna Gems & Jewellers, Ahmedabad — genuine reviews and star ratings.",
    url: `${SITE_URL}/reviews`,
    siteName: "Shagun Ratna Jewelry",
    images: [{ url: "/og-jewelry.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
};

export default function ReviewsLayout({ children }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Reviews", path: "/reviews" },
      ])} />
      {children}
    </>
  );
}
