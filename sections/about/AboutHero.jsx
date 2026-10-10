"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSiteImages } from '@/components/SiteImagesProvider';

// Note: a former slide 1 (about-1.webp) showed storefront signage reading
// "EST. 1921 | LUXURY JEWELLERS", contradicting the "Founded in 1980" copy used
// everywhere else on the site (Heritage section, etc). It's been dropped from the
// rotation rather than left up with incorrect text. If a real, correctly-dated
// storefront photo becomes available, add it back here as a new slide.
const slides = [
  {
    key: 'about-hero-2',
    defaultSrc: '/about-2.webp',
    title: 'Our Legacy',
    description: 'Four Decades of Handcrafted Elegance',
  },
  {
    key: 'about-hero-3',
    defaultSrc: '/about-3.webp',
    title: 'Made by Hand',
    description: 'Crafted with Patience, Precision, and Soul',
  },
  {
    key: 'about-hero-4',
    defaultSrc: '/about-4.webp',
    title: 'Nature, Certified',
    description: 'Natural Gemstones Chosen with Care',
  },
  {
    key: 'about-hero-5',
    defaultSrc: '/about-5.webp',
    title: 'A Personal Legacy',
    description: 'Timeless Pieces for Every Chapter',
  },
];

export default function AboutHero() {
  const [index, setIndex] = useState(0);
  const siteImages = useSiteImages();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[60vh] md:h-[90vh] w-full overflow-hidden bg-[#90060c]">
      
      {/* Image and content move together from right to left. */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={index}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={siteImages[slides[index].key] || slides[index].defaultSrc}
              alt={slides[index].title}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-black/30 z-[5]" />

            {/* Hero Content - Responsive Typography */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-[#faf3e5] px-6">
              <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl mb-4 md:mb-6 leading-tight">
                {slides[index].title}
              </h1>

              <div className="h-[1px] w-16 md:w-20 bg-[#C5A059] mb-6 md:mb-8" />

              <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.25em] md:tracking-[0.4em] uppercase opacity-90">
                {slides[index].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </section>
  );
}