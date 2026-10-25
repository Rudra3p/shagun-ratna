"use client";

import HeroSection from '@/sections/home/Hero';
import PageDivider from '@/components/PageDivider';
import StorySection from '@/sections/home/Story';
import AuthenticitySection from '@/sections/home/Authenticity';
import FeaturedCollections from '@/sections/home/FeaturedCollections';
import ProductGrid from '@/sections/home/ProductGrid';
import Testimonials from '@/sections/home/Testimonials';
import { SiteImagesProvider } from '@/components/SiteImagesProvider';
import { SiteTextsProvider } from '@/components/SiteTextsProvider';
import { AdminEditorProvider } from '@/components/admin/AdminEditorContext';
import { AdminEditorToolbar } from '@/components/admin/AdminEditorToolbar';
import { AdminEditorDrawer } from '@/components/admin/AdminEditorDrawer';
import { AdminEditModals } from '@/components/admin/AdminEditModals';

export default function AdminHomePage() {
  return (
    <SiteImagesProvider>
      <SiteTextsProvider>
        <AdminEditorProvider page="Home">
          <AdminEditorToolbar />
          <div className="relative border border-[#C5A059]/20 rounded-2xl overflow-hidden shadow-xl bg-[#FDFBF7]">
            <HeroSection />
            <PageDivider />
            <StorySection />
            <AuthenticitySection />
            <PageDivider />
            <ProductGrid />
            <FeaturedCollections />
            <PageDivider />
            <Testimonials />
          </div>
          <AdminEditorDrawer />
          <AdminEditModals />
        </AdminEditorProvider>
      </SiteTextsProvider>
    </SiteImagesProvider>
  );
}
