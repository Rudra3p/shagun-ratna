import HeroSection from '@/sections/home/Hero';
import PageDivider from '@/sections/home/PageDivider';
import StorySection from '@/sections/home/StorySection';
import FeaturedCollections from '@/sections/home/FeaturedCollections';
import ProductGrid from '@/sections/home/ProductGrid';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <PageDivider />
      <StorySection />
      <FeaturedCollections />
      <ProductGrid /> 
      <PageDivider /> 
      {/* <Testimonials />
      <NewsletterSignup />
      <Footer /> */}
    </main>
  );
}