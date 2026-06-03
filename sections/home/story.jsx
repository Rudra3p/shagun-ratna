"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';


const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
};

export default function StorySection() {
  return (
    <section className="py-24 px-6 bg-[#faf3e5] text-[#1a1a1a]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* The "Editorial" Image Section - Similar to Dhaaga-Arts aesthetic */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative h-[600px] w-full"
        >
          <Image 
            src="/story-image.jpg" // High-quality, close-up artisanal shot
            alt="The craftsmanship of Shagun Ratna"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
          />
          {/* Gold Accent border to match your palette */}
          <div className="absolute -bottom-6 -left-6 w-24 h-24 border-l-2 border-b-2 border-[#C5A059] z-10" />
        </motion.div>

        {/* The Text Storytelling Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col justify-center"
        >
          <span className="text-[#90060c] font-semibold tracking-[0.3em] uppercase text-xs mb-4">
            The Legacy
          </span>
          <h2 className="brand-font text-5xl md:text-6xl mb-8 leading-tight">
            Defined by Time, <br />Crafted by Hand.
          </h2>
          <p className="ui-font text-sm leading-[2.2] tracking-[0.1em] opacity-80 mb-10 max-w-lg">
            Since 1980, Shagun Ratna has transcended the ordinary. We believe that 
            jewelry is not merely an ornament, but a silent language of tradition 
            and grace. Inspired by the depth of our heritage and the precision 
            of modern artistry, every piece is born from a meticulous process 
            that honors the artisan's touch.
          </p>
          
          <button className="w-fit border border-[#90060c] text-[#90060c] px-12 py-4 text-xs tracking-[0.25em] uppercase hover:bg-[#90060c] hover:text-[#faf3e5] transition-all duration-500">
            Discover Our Craft
          </button>
        </motion.div>
        
      </div>
    </section>
  );
}