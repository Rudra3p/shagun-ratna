import AboutHero from '@/sections/about/AboutHero';
import HeritageSection from '@/sections/about/Heritage';
import PhilosophySection from '@/sections/about/Philosophy';
import CertificationSection from '@/sections/about/Certification';
import BoutiqueVisit from '@/sections/about/BoutiqueVisit';
import FAQSection from '@/sections/about/FAQ';
import PageDivider from '@/components/PageDivider';

// Metadata and structured data (breadcrumb, AboutPage, FAQPage) live in ./layout.jsx,
// matching how /collection and /contact are organised.

export default function About() {
  return (
    <main className="bg-[#FDFBF7] mt-5">
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
