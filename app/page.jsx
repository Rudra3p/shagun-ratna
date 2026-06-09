import HeroSection from '@/sections/home/Hero';
import PageDivider from '@/components/PageDivider';
import StorySection from '@/sections/home/Story';
import FeaturedCollections from '@/sections/home/FeaturedCollections';
import ProductGrid from '@/sections/home/ProductGrid';
import Testimonials from '@/sections/home/Testimonials';

export const metadata = {
  title: "Shagun Ratna | Handcrafted Fine Jewelry Since 1980",
  description: "Discover Shagun Ratna, where tradition meets elegance. Explore our collection of premium, handcrafted gold jewelry, designed to last a lifetime.",
  alternates: {
    canonical: 'https://shagunratna.com',
  },
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <PageDivider />
      <StorySection />
      <ProductGrid /> 
      <FeaturedCollections />
      <PageDivider /> 
      <Testimonials />
    </main>
  );
}