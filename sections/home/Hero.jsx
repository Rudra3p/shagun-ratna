"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteImages } from '@/components/SiteImagesProvider';
import { useSiteText } from '@/components/SiteTextsProvider';
import { useAdminEditor } from '@/components/admin/AdminEditorContext';
import { EditableText } from '@/components/admin/EditableText';

// Optimized animation variants for luxury choreography
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.25 }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
  }
};

export default function HeroSection() {
  const [imageIndex, setImageIndex] = useState(0);
  const siteImages = useSiteImages();
  const { isAdmin, editMode, openMediaEdit, openTextEdit } = useAdminEditor();

  const ctaText = useSiteText('home-hero-cta', 'Explore Now');
  const conciergeText = useSiteText('home-hero-concierge', 'Visit our Ahmedabad boutique by appointment');

  const heroSlides = [
    { key: 'home-hero', label: 'Slide 1 (Handpiece)', defaultSrc: '/hero_sec_hand.webp', src: siteImages['home-hero'] || '/hero_sec_hand.webp', alt: 'Shagun Ratna gemstone jewelry' },
    { key: 'home-hero-2', label: 'Slide 2 (Emerald Showcase)', defaultSrc: '/new-launch.webp', src: siteImages['home-hero-2'] || '/new-launch.webp', alt: 'Shagun Ratna emerald jewelry' },
    { key: 'home-hero-3', label: 'Slide 3 (Gold Artistry)', defaultSrc: '/gold-section.webp', src: siteImages['home-hero-3'] || '/gold-section.webp', alt: 'Shagun Ratna handcrafted gold jewelry' },
    { key: 'home-hero-4', label: 'Slide 4 (Rare Gemstones)', defaultSrc: '/gemstone-section.webp', src: siteImages['home-hero-4'] || '/gemstone-section.webp', alt: 'Natural gemstones at Shagun Ratna' },
    { key: 'home-hero-5', label: 'Slide 5 (Certified Diamonds)', defaultSrc: '/diamond-section.webp', src: siteImages['home-hero-5'] || '/diamond-section.webp', alt: 'Certified diamonds at Shagun Ratna' },
  ];

  const currentSlide = heroSlides[imageIndex] || heroSlides[0];

  const goToSlide = (nextIndex) => {
    setImageIndex((nextIndex + heroSlides.length) % heroSlides.length);
  };

  const goToNextSlide = () => {
    goToSlide(imageIndex + 1);
  };

  const goToPreviousSlide = () => {
    goToSlide(imageIndex - 1);
  };

  // Only auto-advance when NOT in admin edit mode. When edit mode is active, slides stay manual.
  useEffect(() => {
    if (isAdmin && editMode) return;

    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [heroSlides.length, isAdmin, editMode]);

  return (
    <section 
      className="min-h-screen w-full flex items-center bg-[#FDFBF7] relative overflow-hidden px-6 md:px-16 lg:px-24 pt-32 pb-24 lg:py-16 antialiased"
    >
      {/* Background elegant dotted matrix */}
      <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center w-full z-10">
        
        {/* Left Column - Brand Title & Explore CTA */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center lg:items-start text-center lg:text-left justify-center w-full lg:col-span-6 order-2 lg:order-1 mt-4 lg:mt-0"
        >
          <motion.div variants={childVariants} className="flex items-center gap-4 mb-4 lg:mb-6">
            <EditableText
              textKey="home-hero-badge"
              defaultText="Est. 1980"
              label="Established Badge"
              section="Hero"
              as="span"
              className="font-sans text-[10px] tracking-[0.5em] uppercase text-[#C5A059] font-bold"
            />
            <div className="h-[1px] w-12 bg-[#90060c]/40" />
          </motion.div>

          <motion.h1 
            variants={childVariants} 
            className="font-brand text-4xl sm:text-5xl md:text-6xl text-[#1a1a1a] tracking-[0.15em] leading-tight mb-4 lg:mb-6 font-light uppercase"
          >
            <EditableText
              textKey="home-hero-title-prefix"
              defaultText="Shagun"
              label="Brand Title (Line 1)"
              section="Hero"
              as="span"
            /> <br className="hidden lg:block"/>
            <EditableText
              textKey="home-hero-title-highlight"
              defaultText="Ratna"
              label="Brand Title (Highlight)"
              section="Hero"
              as="span"
              className="text-[#90060c] font-normal"
            />
          </motion.h1>

          <motion.div variants={childVariants} className="w-full">
            <EditableText
              textKey="home-hero-subtitle"
              defaultText="Defining the art of subtlety through timeless, handcrafted elegance."
              label="Hero Subtitle"
              section="Hero"
              type="textarea"
              as="p"
              className="font-brand text-lg sm:text-xl md:text-2xl text-[#C5A059] tracking-[0.15em] leading-relaxed mb-8 lg:mb-10 max-w-lg italic font-light block"
            />
          </motion.div>

          <motion.div variants={childVariants}>
            {isAdmin && editMode ? (
              <button
                type="button"
                onClick={() => openTextEdit('home-hero-cta', 'Explore CTA Button Text', 'Explore Now', 'text', 'Hero')}
                className="relative font-sans px-10 py-3.5 lg:px-12 lg:py-4 text-xs tracking-[0.3em] uppercase text-[#faf3e5] bg-[#90060c] rounded-full overflow-hidden group hover:shadow-[0_10px_30px_rgba(144,6,12,0.25)] hover:ring-2 hover:ring-[#C5A059] transition-all cursor-pointer"
                title="Click to edit CTA button text"
              >
                <span className="relative z-10">{ctaText}</span>
              </button>
            ) : (
              <Link href="/collection">
                <button className="relative font-sans px-10 py-3.5 lg:px-12 lg:py-4 text-xs tracking-[0.3em] uppercase text-[#faf3e5] bg-[#90060c] rounded-full overflow-hidden group transition-all duration-500 hover:shadow-[0_10px_30px_rgba(144,6,12,0.25)] active:scale-[0.98]">
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-[#faf3e5]">{ctaText}</span>
                  <span className="absolute inset-0 bg-[#C5A059] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </button>
              </Link>
            )}
          </motion.div>

          {/* Concierge model clarified up front */}
          <motion.div variants={childVariants}>
            {isAdmin && editMode ? (
              <button
                type="button"
                onClick={() => openTextEdit('home-hero-concierge', 'Boutique Appointment Text', 'Visit our Ahmedabad boutique by appointment', 'text', 'Hero')}
                className="inline-flex items-center gap-2 mt-6 lg:mt-8 text-[11px] sm:text-xs tracking-[0.15em] uppercase text-[#1a1a1a]/70 hover:text-[#90060c] cursor-pointer hover:underline transition-colors"
                title="Click to edit boutique concierge text"
              >
                <MapPin size={13} className="text-[#C5A059] shrink-0" />
                <span className="underline underline-offset-4 decoration-[#C5A059]/40 hover:decoration-[#90060c]">
                  {conciergeText}
                </span>
              </button>
            ) : (
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-6 lg:mt-8 text-[11px] sm:text-xs tracking-[0.15em] uppercase text-[#1a1a1a]/70 hover:text-[#90060c] transition-colors group"
              >
                <MapPin size={13} className="text-[#C5A059] shrink-0" />
                <span className="underline underline-offset-4 decoration-[#C5A059]/40 group-hover:decoration-[#90060c]">
                  {conciergeText}
                </span>
              </Link>
            )}
          </motion.div>
        </motion.div>

        {/* Right Column - Floating Hand Image with Fine Blueprint Accents */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="relative flex justify-center items-center w-full lg:col-span-6 order-1 lg:order-2 z-10 h-[350px] sm:h-[450px] lg:h-[550px]"
        >
          {/* Change Media Button & Manual Navigation in Edit Mode */}
          {isAdmin && editMode && (
            <>
              {/* Dynamic Change Media Button for Active Slide */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openMediaEdit(
                    currentSlide.key,
                    `Home Hero — ${currentSlide.label}`,
                    currentSlide.defaultSrc
                  );
                }}
                className="absolute top-2 right-2 z-40 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-sans font-medium text-white bg-[#90060c] hover:bg-[#730509] border border-[#C5A059] rounded-full shadow-2xl backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title={`Change photo for ${currentSlide.label}`}
              >
                <Camera size={13} className="text-[#C5A059]" />
                <span>Change Slide {imageIndex + 1} Image</span>
              </button>

              {/* Manual Slide Previous Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToPreviousSlide();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-black/60 hover:bg-[#90060c] text-white border border-[#C5A059]/60 flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
                aria-label="Previous Slide"
                title="Previous Slide"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Manual Slide Next Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToNextSlide();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-black/60 hover:bg-[#90060c] text-white border border-[#C5A059]/60 flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
                aria-label="Next Slide"
                title="Next Slide"
              >
                <ChevronRight size={20} />
              </button>

              {/* Bottom Slide Switcher Tabs */}
              <div className="absolute -bottom-3 sm:bottom-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A059]/60 shadow-2xl">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.key}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToSlide(idx);
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider transition-all cursor-pointer ${
                      idx === imageIndex
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

          {/* Gold aura background glow */}
          <div className="absolute w-[80%] aspect-square rounded-full bg-radial from-[#C5A059]/15 to-transparent blur-3xl -z-10" />

          {/* Rotating Gold Ring behind the image */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute w-[80%] md:w-[70%] aspect-square rounded-full border border-dashed border-[#C5A059]/30 z-0 select-none pointer-events-none will-change-transform"
          />

          {/* Solid thin gold ring */}
          <div className="absolute w-[68%] md:w-[58%] aspect-square rounded-full border border-[#C5A059]/20 z-0 select-none pointer-events-none" />

          {/* Fine blueprint crosshairs */}
          <div className="absolute w-[90%] md:w-[80%] h-[1px] bg-[#C5A059]/15 z-0 select-none pointer-events-none" />
          <div className="absolute h-[90%] md:h-[80%] w-[1px] bg-[#C5A059]/15 z-0 select-none pointer-events-none" />

          {/* Small corner alignment markers */}
          <div className="absolute top-[10%] left-[15%] w-3 h-3 border-t border-l border-[#C5A059]/40 z-0 select-none pointer-events-none" />
          <div className="absolute top-[10%] right-[15%] w-3 h-3 border-t border-r border-[#C5A059]/40 z-0 select-none pointer-events-none" />
          <div className="absolute bottom-[10%] left-[15%] w-3 h-3 border-b border-l border-[#C5A059]/40 z-0 select-none pointer-events-none" />
          <div className="absolute bottom-[10%] right-[15%] w-3 h-3 border-b border-r border-[#C5A059]/40 z-0 select-none pointer-events-none" />

          {/* The image carousel */}
          <div className="absolute inset-0 z-10 overflow-hidden">
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={imageIndex}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center select-none pointer-events-none will-change-transform"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={heroSlides[imageIndex].src}
                    alt={heroSlides[imageIndex].alt}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 50vw"
                    className="object-contain opacity-95 select-none pointer-events-none"
                    priority={imageIndex === 0}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
