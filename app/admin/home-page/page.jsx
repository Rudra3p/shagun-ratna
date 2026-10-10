import HeroSection from '@/sections/home/Hero';
import PageDivider from '@/components/PageDivider';
import StorySection from '@/sections/home/Story';
import AuthenticitySection from '@/sections/home/Authenticity';
import FeaturedCollections from '@/sections/home/FeaturedCollections';
import ProductGrid from '@/sections/home/ProductGrid';
import Testimonials from '@/sections/home/Testimonials';
import { SiteImagesProvider } from '@/components/SiteImagesProvider';

export default function AdminHomePage() {
  return (
    <SiteImagesProvider>
      <main>
        <HeroSection />
        <PageDivider />
        <StorySection />
        <AuthenticitySection />
        <PageDivider />
        <ProductGrid />
        <FeaturedCollections />
        <PageDivider />
        <Testimonials />
      </main>
    </SiteImagesProvider>
  );
}