import { SITE_URL, breadcrumbJsonLd, JsonLd } from "@/lib/seo";

export const metadata = {
  title: "Contact & Boutique Visit — Satellite, Ahmedabad",
  description:
    "Visit the Shagun Ratna boutique at Shivranjani Cross Road, Satellite, Ahmedabad, or book a private viewing. Get in touch for custom orders, gemstone sourcing, and jewellery enquiries.",
  keywords: [
    "Shagun Ratna contact",
    "jewellery shop Satellite Ahmedabad",
    "jewellers Shivranjani Cross Road",
    "book private jewellery viewing Ahmedabad",
    "custom jewellery enquiry Ahmedabad",
  ],
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact & Boutique Visit | Shagun Ratna",
    description:
      "Visit our Ahmedabad boutique by appointment, or reach out for custom orders and gemstone enquiries.",
    url: `${SITE_URL}/contact`,
    siteName: "Shagun Ratna Jewelry",
    images: [{ url: "/og-jewelry.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
};

export default function ContactLayout({ children }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ])} />
      {children}
    </>
  );
}
