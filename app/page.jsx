"use client";

import HeroSection from '@/sections/home/Hero';
import PageDivider from '@/components/PageDivider';
import StorySection from '@/sections/home/Story';
import FeaturedCollections from '@/sections/home/FeaturedCollections';
import ProductGrid from '@/sections/home/ProductGrid';
import Testimonials from '@/sections/home/Testimonials';
import NewsletterSignup from '@/sections/home/Newsletter';
import Footer from '@/components/Footer';

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
      <NewsletterSignup />
      <Footer />
    </main>
  );
}