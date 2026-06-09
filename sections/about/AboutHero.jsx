"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const images = [
  "/about-1.jpg", 
  "/about-2.jpg",
  "/about-3.jpg",
  "/about-4.jpg",
  "/about-5.jpg",
];

export default function AboutHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[60vh] md:h-[90vh] w-full overflow-hidden bg-[#90060c]">
      
      {/* Image Layer - Crossfading smoothly */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[index]}
              alt="Shagun Ratna Legacy"
              fill
              priority
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Persistent Overlay Layer */}
      <div className="absolute inset-0 bg-black/30 z-[5]" />

      {/* Hero Content - Responsive Typography */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-[#faf3e5] px-6">
        <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl mb-4 md:mb-6 leading-tight">
          Our Legacy
        </h1>
        
        <div className="h-[1px] w-16 md:w-20 bg-[#C5A059] mb-6 md:mb-8" />
        
        <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.25em] md:tracking-[0.4em] uppercase opacity-90">
          Four Decades of Handcrafted Elegance
        </p>
      </div>
    </section>
  );
}