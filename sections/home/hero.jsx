"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Optimized animation variants for luxury choreography
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.25 }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } 
  }
};

export default function HeroSection() {
  return (
    <section className="h-screen w-full mt-6 flex items-center justify-center bg-[#faf3e5] relative overflow-hidden antialiased">
      
      {/* Background Hand Image */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <Image 
          src="/hero_sec_hand.png" 
          alt="Shagun Ratna Jewelry" 
          width={700} 
          height={900} 
          className="object-contain h-[90%] mt-[5%] opacity-90" 
          priority
        />
        <div className="absolute inset-0 bg-[#faf3e5]/60" />
      </div>

      {/* Choreographed Content Layer */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center flex flex-col items-center justify-center px-4 mt-12"
      >
        <motion.p 
          variants={childVariants} 
          className="font-sans text-xs tracking-[0.4em] uppercase text-[#C5A059] mb-6 font-semibold"
        >
          Est. 1980
        </motion.p>

        <motion.div variants={childVariants} className="relative w-[450px] h-[225px]">
          <Image 
            src="/shagunratnalogo.png" 
            alt="Shagun Ratna Logo" 
            fill
            className="object-contain" 
            priority
          />
        </motion.div>

        <motion.p variants={childVariants} className="font-sans text-xs tracking-[0.35em] uppercase text-[#1a1a1a] mt-6 max-w-lg leading-relaxed">
          Defining the art of subtlety through timeless, handcrafted elegance.
        </motion.p>

        <motion.div variants={childVariants} className="mt-12">
          <button className="font-sans px-12 py-4 text-sm tracking-[0.25em] uppercase text-[#faf3e5] bg-[#90060c] 
            transition-all duration-700 ease-in-out 
            hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(144,6,12,0.4)] 
            active:scale-[0.98] rounded-full">
            Acquire the collection
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}