"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, Calendar, Award, Compass } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
};

export default function NewLaunchSection() {
  return (
    <section className="py-32 px-12 bg-[#FDFBF7] text-[#1a1a1a] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center mb-20 text-center">
        {/* Self-drawing vertical line */}
        <motion.div 
          initial={{ height: 0 }}
          whileInView={{ height: 50 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-[1px] bg-[#C5A059]/60 mb-6"
        />
        <span className="text-[#90060c] font-bold tracking-[0.4em] uppercase text-[10px] mb-3">
          The New Debut
        </span>
        <h2 className="font-brand text-4xl md:text-5xl text-[#1a1a1a] tracking-[0.15em] font-light">
          L&apos;Inauguration
        </h2>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: 96 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-[1px] bg-[#C5A059] mt-6" 
        />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Left: Asymmetric Matting Image Container */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="relative h-[650px] w-full group"
        >
          {/* Gold Matted Frame behind the image */}
          <div className="absolute inset-0 border border-[#C5A059]/40 rounded-2xl translate-x-4 translate-y-4 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700" />
          
          {/* Burgundy accent corner lines */}
          <div className="absolute -bottom-4 -left-4 w-24 h-24 border-l border-b border-[#90060c]/35 rounded-bl-2xl -z-10" />
          
          <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-xl">
            <Image 
              src="/new-launch.png"
              alt="Shagun Ratna New Launch - The Aadya Emerald Choker"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover scale-100 group-hover:scale-103 transition-all duration-[1200ms] ease-out"
            />
          </div>
        </motion.div>

        {/* Right: Product Details & Specs */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="flex flex-col justify-center lg:pl-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={14} className="text-[#C5A059]" />
            <span className="text-[#C5A059] font-bold tracking-[0.3em] uppercase text-[10px]">
              Signature Piece
            </span>
          </div>
          
          <h3 className="font-brand text-4xl md:text-5xl mb-6 leading-tight text-[#1a1a1a] font-light">
            The Aadya <br />
            <span className="text-[#90060c] font-normal not-italic">Emerald Choker</span>
          </h3>
          
          <p className="font-sans text-sm leading-[2.1] tracking-[0.05em] text-[#1a1a1a]/85 mb-8 max-w-lg">
            Unveiling our latest masterpiece—an exquisite choker that marries the architectural symmetry of heritage royal arches with the modern fluid lines of contemporary fine jewelry. Every single Colombian emerald has been hand-selected and cut to align with the intricate golden filigree, taking over 150 hours of meticulous craftsmanship.
          </p>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-6 border-t border-b border-[#C5A059]/20 py-8 mb-10 max-w-lg">
            <div className="flex items-center gap-3">
              <Award size={18} className="text-[#90060c] opacity-80" />
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#C5A059] font-bold">Gold Purity</p>
                <p className="text-sm font-brand text-[#1a1a1a] mt-0.5">22K Solid Gold</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Compass size={18} className="text-[#90060c] opacity-80" />
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#C5A059] font-bold">Colombian Emeralds</p>
                <p className="text-sm font-brand text-[#1a1a1a] mt-0.5">8.45 Carats</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-[#90060c] opacity-80" />
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#C5A059] font-bold">Uncut Diamonds</p>
                <p className="text-sm font-brand text-[#1a1a1a] mt-0.5">4.20 Carats</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-[#90060c] opacity-80" />
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#C5A059] font-bold">Artisan Sign</p>
                <p className="text-sm font-brand text-[#1a1a1a] mt-0.5">Harish Soni</p>
              </div>
            </div>
          </div>
          
          <button className="relative w-fit font-sans px-10 py-3.5 text-xs tracking-[0.25em] uppercase text-[#90060c] border border-[#90060c] rounded-full overflow-hidden group transition-all duration-500 hover:shadow-[0_8px_20px_rgba(144,6,12,0.15)] active:scale-[0.98]">
            <span className="relative z-10 transition-colors duration-500 group-hover:text-[#faf3e5]">Book Private Viewing</span>
            <span className="absolute inset-0 bg-[#90060c] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </button>
        </motion.div>
        
      </div>
    </section>
  );
}
