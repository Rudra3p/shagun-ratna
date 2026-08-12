"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useSiteImage } from '@/components/SiteImagesProvider';

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
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const heroImage = useSiteImage('home-hero', '/hero_sec_hand.webp');

  // Check window width to adjust parallax intensity safely
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hook into scroll position relative to this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Safe Parallax: 0px offset on mobile to prevent overflow; up to 150px on desktop
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : 150]);

  return (
    <section 
      ref={containerRef} 
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
            <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-[#C5A059] font-bold">
              Est. 1980
            </span>
            <div className="h-[1px] w-12 bg-[#90060c]/40" />
          </motion.div>

          <motion.h1 
            variants={childVariants} 
            className="font-brand text-4xl sm:text-5xl md:text-6xl text-[#1a1a1a] tracking-[0.15em] leading-tight mb-4 lg:mb-6 font-light uppercase"
          >
            Shagun <br className="hidden lg:block"/>
            <span className="text-[#90060c] font-normal">Ratna</span>
          </motion.h1>

          <motion.p 
            variants={childVariants} 
            className="font-brand text-lg sm:text-xl md:text-2xl text-[#C5A059] tracking-[0.15em] leading-relaxed mb-8 lg:mb-10 max-w-lg italic font-light"
          >
            Defining the art of subtlety through timeless, handcrafted elegance.
          </motion.p>

          <motion.div variants={childVariants}>
            <Link href="/collection">
              <button className="relative font-sans px-10 py-3.5 lg:px-12 lg:py-4 text-xs tracking-[0.3em] uppercase text-[#faf3e5] bg-[#90060c] rounded-full overflow-hidden group transition-all duration-500 hover:shadow-[0_10px_30px_rgba(144,6,12,0.25)] active:scale-[0.98]">
                <span className="relative z-10 transition-colors duration-500 group-hover:text-[#faf3e5]">Explore Now</span>
                <span className="absolute inset-0 bg-[#C5A059] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </button>
            </Link>
          </motion.div>

          {/* Concierge model clarified up front — otherwise this isn't clear until the Contact page */}
          <motion.div variants={childVariants}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-6 lg:mt-8 text-[11px] sm:text-xs tracking-[0.15em] uppercase text-[#1a1a1a]/70 hover:text-[#90060c] transition-colors group"
            >
              <MapPin size={13} className="text-[#C5A059] shrink-0" />
              <span className="underline underline-offset-4 decoration-[#C5A059]/40 group-hover:decoration-[#90060c]">
                Visit our Ahmedabad boutique by appointment
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column - Floating Hand Image with Fine Blueprint Accents */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          style={{ y: yOffset, willChange: 'transform' }}
          className="relative flex justify-center items-center w-full lg:col-span-6 order-1 lg:order-2 z-10 h-[350px] sm:h-[450px] lg:h-[550px]"
        >
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

          {/* The hand image itself, floating borderless */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 z-10 flex items-center justify-center select-none pointer-events-none will-change-transform"
          >
            <Image
              src={heroImage}
              alt="Shagun Ratna Jewelry"
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 50vw"
              className="object-contain opacity-95 select-none pointer-events-none" 
              priority
            />
          </motion.div>
        </motion.div>

      </div>

      {/* Luxury Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3 z-20 cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-[#C5A059] font-semibold">Scroll</span>
        <div className="w-[1px] h-8 lg:h-12 bg-[#C5A059]/35 relative overflow-hidden">
          <motion.div 
            animate={{ 
              y: ["-100%", "100%"] 
            }}
            transition={{ 
              duration: 2.2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 left-0 w-full h-1/2 bg-[#90060c]"
          />
        </div>
      </motion.div>
    </section>
  );
}