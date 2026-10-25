"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSiteImages } from '@/components/SiteImagesProvider';
import { EditableText } from '@/components/admin/EditableText';
import { EditableMedia } from '@/components/admin/EditableMedia';

const slides = [
  {
    key: 'about-hero-2',
    defaultSrc: '/about-2.webp',
    titleKey: 'about-hero-slide-1-title',
    defaultTitle: 'Our Legacy',
    descKey: 'about-hero-slide-1-desc',
    defaultDesc: 'Four Decades of Handcrafted Elegance',
  },
  {
    key: 'about-hero-3',
    defaultSrc: '/about-3.webp',
    titleKey: 'about-hero-slide-2-title',
    defaultTitle: 'Made by Hand',
    descKey: 'about-hero-slide-2-desc',
    defaultDesc: 'Crafted with Patience, Precision, and Soul',
  },
  {
    key: 'about-hero-4',
    defaultSrc: '/about-4.webp',
    titleKey: 'about-hero-slide-3-title',
    defaultTitle: 'Nature, Certified',
    descKey: 'about-hero-slide-3-desc',
    defaultDesc: 'Natural Gemstones Chosen with Care',
  },
  {
    key: 'about-hero-5',
    defaultSrc: '/about-5.webp',
    titleKey: 'about-hero-slide-4-title',
    defaultTitle: 'A Personal Legacy',
    descKey: 'about-hero-slide-4-desc',
    defaultDesc: 'Timeless Pieces for Every Chapter',
  },
];

export default function AboutHero() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const pointerStartX = useRef(null);
  const siteImages = useSiteImages();

  const currentSlide = slides[index];

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
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePointerStart = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerStartX.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerEnd = (event) => {
    if (pointerStartX.current === null) return;

    const swipeDistance = pointerStartX.current - event.clientX;
    pointerStartX.current = null;

    if (Math.abs(swipeDistance) < 50) return;
    if (swipeDistance > 0) goToNextSlide();
    else goToPreviousSlide();
  };

  return (
    <section
      className="relative h-[60vh] md:h-[90vh] w-full select-none touch-pan-y overflow-hidden bg-[#90060c]"
      onPointerDown={handlePointerStart}
      onPointerUp={handlePointerEnd}
      onPointerCancel={() => { pointerStartX.current = null; }}
    >
      <EditableMedia
        slotKey={currentSlide.key}
        label={`About Slide ${index + 1}`}
        defaultSrc={currentSlide.defaultSrc}
        className="absolute inset-0 w-full h-full"
      >
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
                src={siteImages[currentSlide.key] || currentSlide.defaultSrc}
                alt={currentSlide.defaultTitle}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-black/30 z-[5]" />

              {/* Hero Content - Responsive Typography */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-[#faf3e5] px-6">
                <EditableText
                  textKey={currentSlide.titleKey}
                  defaultText={currentSlide.defaultTitle}
                  label={`Slide ${index + 1} Title`}
                  section="About Hero"
                  as="h1"
                  className="font-serif text-4xl sm:text-6xl md:text-8xl mb-4 md:mb-6 leading-tight block"
                />

                <div className="h-[1px] w-16 md:w-20 bg-[#C5A059] mb-6 md:mb-8" />

                <EditableText
                  textKey={currentSlide.descKey}
                  defaultText={currentSlide.defaultDesc}
                  label={`Slide ${index + 1} Description`}
                  section="About Hero"
                  as="p"
                  className="text-[10px] sm:text-xs md:text-sm tracking-[0.25em] md:tracking-[0.4em] uppercase opacity-90 block"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </EditableMedia>
    </section>
  );
}
