"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function PhilosophySection() {
  return (
    <section className="py-16 md:py-24 px-6 bg-[#90060c] text-[#faf3e5] overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        
        {/* Text Side - Now on the Left */}
        <div className="text-center md:text-left">
          <div className="text-[#C5A059] mb-4 md:mb-6 text-xl md:text-2xl">✧</div>
          <h2 className="font-serif text-3xl md:text-5xl mb-6 md:mb-10 text-[#C5A059]">Our Philosophy</h2>
          
          <div className="space-y-6 md:space-y-8 text-base md:text-xl font-light leading-relaxed italic opacity-90 max-w-xl mx-auto md:mx-0">
            <p>"We believe that jewelry is not merely an accessory, but a silent testament to the moments that define a life."</p>
            <p className="not-italic text-sm md:text-lg opacity-80">
              Our commitment to sustainability, ethical sourcing, and unrivaled artistry ensures that every piece we create is as kind to the earth as it is beautiful to the wearer. 
            </p>
          </div>
        </div>

        {/* Image Side - Now on the Right, Smaller & Floating */}
        <div className="flex justify-center md:justify-end">
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-[80%] md:w-[70%] aspect-[4/5] shadow-2xl"
          >
            <Image 
              src="/philosophy-main.jpg" 
              alt="Our Philosophy" 
              fill 
              className="object-cover border border-[#C5A059]/30"
            />
            {/* Decorative Border */}
            <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-full h-full border border-[#C5A059]/40 -z-10" />
          </motion.div>
        </div>

      </div>
    </section>
  );
}