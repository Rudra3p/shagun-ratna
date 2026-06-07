"use client";

import AboutHero from '@/sections/about/AboutHero';
import HeritageSection from '@/sections/about/Heritage';
import PhilosophySection from '@/sections/about/Philosophy';
import BoutiqueVisit from '@/sections/about/BoutiqueVisit';
import PageDivider from '@/components/PageDivider';

export default function About() {
  return (
    <main className="bg-[#faf3e5]">
      <AboutHero />
      
      <PageDivider />
      
      <HeritageSection />
      
      {/* Philosophy section provides a dark-mode contrast for better visual rhythm */}
      <PhilosophySection />
      
      <PageDivider />
      
      <BoutiqueVisit />
    </main>
  );
}