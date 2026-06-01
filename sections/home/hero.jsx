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
{/* Content Layer - Adjusted for better visual balance */}
    <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
    className="relative z-10 text-center flex flex-col items-center justify-center px-4"
    >
    <p className="ui-font text-xs md:text-sm tracking-[0.4em] uppercase text-[#1a1a1a] mb-6">
        Est. 1980
    </p>

    {/* Logo - Slightly larger constraint for desktop impact */}
    <div className="relative w-[300px] h-[150px] md:w-[450px] md:h-[225px] transition-all">
        <Image 
        src="/shagunratnalogo.png" 
        alt="Shagun Ratna Logo" 
        fill
        className="object-contain" 
        priority
        />
    </div>

    <p className="ui-font text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#1a1a1a] font-light mt-6 max-w-lg">
        Defining the art of subtlety through timeless, handcrafted elegance.
    </p>

    <div className="mt-12">
        <button className="ui-font px-12 py-4 text-sm tracking-[0.25em] uppercase text-[#faf3e5] bg-[#90060c] hover:bg-[#7a050a] transition-all duration-500 ease-in-out hover:scale-[1.02] rounded-full shadow-lg">
        Acquire the collection
        </button>
    </div>
    </motion.div>
    </section>
  );
}