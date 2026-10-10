"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [direction, setDirection] = useState(1);
  const siteImages = useSiteImages();

  const goToSlide = (nextIndex, nextDirection) => {
    setDirection(nextDirection);
    setIndex(nextIndex);
  };

  const goToNextSlide = () => {
    goToSlide((index + 1) % slides.length, 1);
  };

  const goToPreviousSlide = () => {
    goToSlide((index - 1 + slides.length) % slides.length, -1);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative h-[60vh] md:h-[90vh] w-full overflow-hidden bg-[#90060c]"
    >
      
      {/* Image and content move together from right to left. */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={index}
            initial={{ x: direction === 1 ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: direction === 1 ? '-100%' : '100%' }}
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

      <button
        type="button"
        onClick={goToPreviousSlide}
        aria-label="Previous about hero slide"
        title="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#faf3e5]/40 bg-black/20 p-2.5 text-[#faf3e5] backdrop-blur-sm transition-colors hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        onClick={goToNextSlide}
        aria-label="Next about hero slide"
        title="Next slide"
        className="absolute right-4 md:right-8 top-1/2 z-20 -translate-y-1/2 rounded-full border border-[#faf3e5]/40 bg-black/20 p-2.5 text-[#faf3e5] backdrop-blur-sm transition-colors hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.key}
            type="button"
            onClick={() => goToSlide(slideIndex, slideIndex > index ? 1 : -1)}
            aria-label={`Show ${slide.title} slide`}
            aria-current={slideIndex === index ? 'true' : undefined}
            title={slide.title}
            className={`h-2.5 rounded-full border border-[#faf3e5]/80 shadow-[0_1px_8px_rgba(0,0,0,0.25)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90060c] ${
              slideIndex === index ? 'w-8 bg-[#90060c]' : 'w-2.5 bg-[#90060c]/65 hover:bg-[#90060c]'
            }`}
          />
        ))}
      </div>

    </section>
  );
}