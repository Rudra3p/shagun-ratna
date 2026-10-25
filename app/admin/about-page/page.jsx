"use client";

import AboutHero from '@/sections/about/AboutHero';
import HeritageSection from '@/sections/about/Heritage';
import PhilosophySection from '@/sections/about/Philosophy';
import CertificationSection from '@/sections/about/Certification';
import BoutiqueVisit from '@/sections/about/BoutiqueVisit';
import FAQSection from '@/sections/about/FAQ';
import PageDivider from '@/components/PageDivider';
import { SiteImagesProvider } from '@/components/SiteImagesProvider';
import { SiteTextsProvider } from '@/components/SiteTextsProvider';
import { AdminEditorProvider } from '@/components/admin/AdminEditorContext';
import { AdminEditToggle } from '@/components/admin/AdminEditToggle';
import { AdminEditModals } from '@/components/admin/AdminEditModals';

export default function AdminAboutPage() {
  return (
    <SiteImagesProvider>
      <SiteTextsProvider>
        <AdminEditorProvider page="About">
          <AdminEditToggle />
          <main className="bg-[#FDFBF7] mt-5">
            <AboutHero />
            <PageDivider />
            <HeritageSection />
            <PhilosophySection />
            <CertificationSection />
            <PageDivider />
            <BoutiqueVisit />
            <FAQSection />
          </main>
          <AdminEditModals />
        </AdminEditorProvider>
      </SiteTextsProvider>
    </SiteImagesProvider>
  );
}
