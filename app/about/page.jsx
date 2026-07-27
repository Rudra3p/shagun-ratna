import AboutHero from '@/sections/about/AboutHero';
import HeritageSection from '@/sections/about/Heritage';
import PhilosophySection from '@/sections/about/Philosophy';
import CertificationSection from '@/sections/about/Certification';
import BoutiqueVisit from '@/sections/about/BoutiqueVisit';
import FAQSection from '@/sections/about/FAQ';
import { FAQS } from '@/sections/about/faqData';
import PageDivider from '@/components/PageDivider';

export const metadata = {
  title: "Certified Gemstones & Jewelry Since 1980",
  description: "Learn the story of Shagun Ratna — four decades of crafting timeless gold jewelry and sourcing certified natural gemstones in Ahmedabad, including ruby, emerald, and sapphire.",
   alternates: {
    canonical: 'https://shagunratna.com/about',
  },
};

export default function About() {
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

  return (
    <main className="bg-[#faf3e5] mt-5">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <AboutHero />

      <PageDivider />

      <HeritageSection />

      {/* Philosophy section provides a dark-mode contrast for better visual rhythm */}
      <PhilosophySection />

      <CertificationSection />

      <PageDivider />

      <BoutiqueVisit />

      <FAQSection />
    </main>
  );
}