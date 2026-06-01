"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const FontInjector = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Montserrat:wght@200;300;400&display=swap');
      .brand-font { font-family: 'Cormorant Garamond', serif; }
      .ui-font { font-family: 'Montserrat', sans-serif; }
    `
  }} />
);

export default function HeroSection() {
  return (
    <section className="h-screen flex items-center justify-center bg-[#faf3e5] relative overflow-hidden">
      <FontInjector />
      
      {/* Background Hand Image */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <Image 
          src="/hero_sec_hand.png" 
          alt="Shagun Ratna Jewelry" 
          width={600} 
          height={800} 
          className="object-contain h-[90%] mt-[7%]" 
          priority
        />
        {/* Soft overlay */}
        <div className="absolute inset-0 bg-[#faf3e5]/50" />
      </div>

      {/* Content Layer */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center space-y-6 mt-[7vh]"
      >
        <p className="ui-font text-[10px] md:text-[12px] tracking-[0.5em] uppercase text-[#1a1a1a]">
          Est. 1980
        </p>

        {/* Logo Container */}
        <div className="relative w-full flex justify-center">
            <div className="relative w-[200px] h-[80px] md:w-[300px] md:h-[120px]">
            <Image 
                src="/shagunratnalogo.png" 
                alt="Shagun Ratna Logo" 
                fill
                className="object-contain" 
                priority
            />
            </div>
        </div>

        <p className="ui-font text-[10px] md:text-[12px] tracking-[0.3em] uppercase text-[#1a1a1a] font-medium pt-2">
          Defining the art of subtlety through timeless, handcrafted elegance.
        </p>

        <div className="pt-8">
          <button className="ui-font px-10 py-3 text-[10px] tracking-[0.25em] uppercase text-[#faf3e5] bg-[#90060c] hover:bg-[#700509] transition-all rounded-full shadow-md">
            Acquire the collection
          </button>
        </div>
      </motion.div>
    </section>
  );
}