import AboutHero from '@/sections/about/AboutHero';
import HeritageSection from '@/sections/about/Heritage';
import PhilosophySection from '@/sections/about/Philosophy';
import CertificationSection from '@/sections/about/Certification';
import BoutiqueVisit from '@/sections/about/BoutiqueVisit';
import PageDivider from '@/components/PageDivider';

export const metadata = {
  title: "About Shagun Ratna | Handcrafted Jewelry Since 1980",
  description: "Learn the story of Shagun Ratna. Over four decades of crafting timeless gold jewelry.",
   alternates: {
    canonical: 'https://shagunratna.com/about',
  },
};

export default function About() {
  return (
    <main className="bg-[#faf3e5] mt-5">
      <AboutHero />
      
      <PageDivider />
      
      <HeritageSection />
      
      {/* Philosophy section provides a dark-mode contrast for better visual rhythm */}
      <PhilosophySection />

      <CertificationSection />

      <PageDivider />

      <BoutiqueVisit />
    </main>
  );
}