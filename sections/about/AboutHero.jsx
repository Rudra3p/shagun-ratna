"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { useSiteImages } from '@/components/SiteImagesProvider';
import { useAdminEditor } from '@/components/admin/AdminEditorContext';
import { EditableText } from '@/components/admin/EditableText';

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
  const { isAdmin, editMode, openMediaEdit } = useAdminEditor();

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

  // Only auto-advance when NOT in admin edit mode. When edit mode is active, slides stay manual.
  useEffect(() => {
    if (isAdmin && editMode) return;

    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isAdmin, editMode]);

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

      {/* Manual Controls & Image Editing When Edit Mode is Active */}
      {isAdmin && editMode && (
        <>
          {/* Change Media Button for the Active Slide */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openMediaEdit(
                currentSlide.key,
                `About Slide ${index + 1} Image (${currentSlide.defaultTitle})`,
                currentSlide.defaultSrc
              );
            }}
            className="absolute top-6 left-6 z-30 inline-flex items-center gap-2 px-4 py-2 text-xs font-sans font-semibold text-white bg-[#90060c] hover:bg-[#730509] border border-[#C5A059] rounded-full shadow-2xl backdrop-blur-sm cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title={`Change photo for slide ${index + 1}`}
          >
            <Camera size={14} className="text-[#C5A059]" />
            <span>Change Slide {index + 1} Photo</span>
          </button>

          {/* Left / Right Navigation Arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToPreviousSlide();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-[#90060c] text-white border border-[#C5A059]/50 flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
            aria-label="Previous Slide"
            title="Previous Slide"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToNextSlide();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-[#90060c] text-white border border-[#C5A059]/50 flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
            aria-label="Next Slide"
            title="Next Slide"
          >
            <ChevronRight size={22} />
          </button>

          {/* Bottom Slide Switcher Tabs */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-[#C5A059]/50 shadow-2xl">
            {slides.map((s, idx) => (
              <button
                key={s.key}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(idx, idx > index ? 1 : -1);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-sans uppercase tracking-wider transition-all cursor-pointer ${
                  idx === index
                    ? 'bg-[#90060c] text-[#faf3e5] font-bold border border-[#C5A059] shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Slide {idx + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
