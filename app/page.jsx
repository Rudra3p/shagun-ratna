import HeroSection from '@/sections/home/hero';
import StorySection from '@/sections/home/story';
import PageDivider from '@/components/PageDivider';
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
    </main>
  );
}