import { FAQS } from '@/sections/about/faqData';
import { SITE_URL, breadcrumbJsonLd, JsonLd } from '@/lib/seo';

export const metadata = {
  title: "About Us — Certified Gemstones & Jewellery Since 1980",
  description:
    "Learn the story of Shagun Ratna — four decades of crafting timeless gold jewelry and sourcing certified natural gemstones in Ahmedabad, including ruby, emerald, and sapphire.",
  keywords: [
    "about Shagun Ratna",
    "jewellers Ahmedabad since 1980",
    "BIS hallmarked jewellery",
    "GIA IGI certified diamonds Ahmedabad",
    "heritage jewellery Ahmedabad",
    "certified natural gemstones India",
  ],
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About Shagun Ratna | Jewellers in Ahmedabad Since 1980",
    description:
      "Four decades of handcrafted gold jewellery and certified natural gemstones, from our Ahmedabad boutique.",
    url: `${SITE_URL}/about`,
    siteName: "Shagun Ratna Jewelry",
    images: [{ url: "/og-jewelry.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
};

// Answers rendered by the FAQ section, restated for Google — this is what can earn
// the expandable question rows underneath the result.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Shagun Ratna",
  description:
    "The story of Shagun Ratna — a jewellery boutique in Satellite, Ahmedabad, crafting gold and certified natural gemstone pieces since 1980.",
  url: `${SITE_URL}/about`,
  isPartOf: { "@type": "WebSite", name: "Shagun Ratna", url: SITE_URL },
};

export default function AboutLayout({ children }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
      ])} />
      <JsonLd data={aboutJsonLd} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
