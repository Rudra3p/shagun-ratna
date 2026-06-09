"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
      <AnimatePresence mode='wait'>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${images[index]})` }}
        >
          {/* Subtle Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content - Centered */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-[#faf3e5] px-6">
        <h1 className="font-serif text-4xl md:text-7xl mb-4">Our Legacy</h1>
        <p className="text-xs md:text-sm tracking-[0.3em] uppercase opacity-90">
          Four Decades of Handcrafted Elegance
        </p>
      </div>
    </section>
  );
}