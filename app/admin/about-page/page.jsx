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
import { AdminEditorToolbar } from '@/components/admin/AdminEditorToolbar';
import { AdminEditorDrawer } from '@/components/admin/AdminEditorDrawer';
import { AdminEditModals } from '@/components/admin/AdminEditModals';

export default function AdminAboutPage() {
  return (
    <SiteImagesProvider>
      <SiteTextsProvider>
        <AdminEditorProvider page="About">
          <AdminEditorToolbar />
          <div className="relative border border-[#C5A059]/20 rounded-2xl overflow-hidden shadow-xl bg-[#FDFBF7]">
            <AboutHero />
            <PageDivider />
            <HeritageSection />
            <PhilosophySection />
            <CertificationSection />
            <PageDivider />
            <BoutiqueVisit />
            <FAQSection />
          </div>
          <AdminEditorDrawer />
          <AdminEditModals />
        </AdminEditorProvider>
      </SiteTextsProvider>
    </SiteImagesProvider>
  );
}
