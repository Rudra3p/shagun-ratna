"use client";

import HeroSection from '@/sections/home/HeroSection';
import PageDivider from '@/components/PageDivider';
import StorySection from '@/sections/home/StorySection';
import FeaturedCollections from '@/sections/home/FeaturedCollections';
import ProductGrid from '@/sections/home/ProductGrid';
// import Testimonials from '@/sections/home/Testimonials';
// import NewsletterSignup from '@/sections/home/NewsletterSignup';
// import Footer from '@/components/Footer';

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