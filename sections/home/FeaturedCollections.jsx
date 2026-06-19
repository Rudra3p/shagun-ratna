"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const collections = [
  {
    tag: "The Collection",
    title: "Certified Diamonds",
    text: "Unrivaled brilliance, ethically sourced. Each stone is hand-selected for its fire and clarity, ensuring your piece is as unique as the moments it celebrates.",
    image: "/diamond-section.jpg"
  },
  {
    tag: "The Collection",
    title: "Rare Gemstones",
    text: "Stones that tell a story of origin. From deep emeralds to vibrant rubies, we curate rare treasures that bring color and life to traditional silhouettes.",
    image: "/gemstone-section.jpg"
  },
  {
    tag: "The Collection",
    title: "Gold Artistry",
    text: "Tradition captured in 22K gold. Our master artisans breathe soul into metal, creating timeless pieces that carry the legacy of generations forward.",
    image: "/gold-section.jpg"
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
};

export default function FeaturedCollections() {
  return (
    <div className="bg-[#FDFBF7]">
      {collections.map((item, index) => (
        <section key={index} className="min-h-screen py-28 px-12 flex items-center overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center w-full">
            
            {/* Image Section - Alternates Order */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className={`relative h-[550px] lg:h-[650px] w-full lg:col-span-7 group ${index % 2 !== 0 ? 'lg:order-2' : ''}`}
            >
              {/* Outer gold-matted layout frame */}
              <div className="absolute inset-0 border border-[#C5A059]/40 rounded-2xl translate-x-4 translate-y-4 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700" />
              
              {/* Accent corner borders */}
              <div className={`absolute -bottom-4 w-20 h-20 border-b border-[#C5A059]/60 z-10 
                ${index % 2 !== 0 ? '-right-4 border-r rounded-br-2xl' : '-left-4 border-l rounded-bl-2xl'}`} 
              />
              
              <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-xl">
                <Image 
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover grayscale hover:grayscale-0 scale-100 group-hover:scale-103 transition-all duration-[1200ms] ease-out"
                />
              </div>
            </motion.div>

            {/* Floating Glassmorphic Text Card */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className={`flex flex-col justify-center lg:col-span-5 bg-[#FDFBF7]/70 backdrop-blur-md border border-[#C5A059]/20 p-8 md:p-12 lg:p-14 rounded-2xl shadow-lg z-20 
                ${index % 2 !== 0 
                  ? 'lg:order-1 lg:-mr-12 lg:translate-x-6' 
                  : 'lg:-ml-12 lg:-translate-x-6'}`}
            >
              {/* Micro vertical pointer line */}
              <motion.div 
                initial={{ height: 0 }}
                whileInView={{ height: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="w-[1px] bg-[#C5A059]/60 mb-4"
              />

              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#90060c] font-bold tracking-[0.4em] uppercase text-[10px]">
                  {item.tag}
                </span>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: 32 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-[1px] bg-[#C5A059]" 
                />
              </div>
              
              <h2 className="font-brand text-4xl md:text-5xl mb-6 leading-tight text-[#1a1a1a] font-light">
                {item.title}
              </h2>
              
              <p className="font-sans text-sm leading-[2.1] tracking-[0.05em] text-[#1a1a1a]/80 mb-8">
                {item.text}
              </p>
              
              <button className="relative w-fit font-sans px-10 py-3.5 text-xs tracking-[0.25em] uppercase text-[#90060c] border border-[#90060c] rounded-full overflow-hidden group transition-all duration-500 hover:shadow-[0_8px_20px_rgba(144,6,12,0.15)] active:scale-[0.98]">
                <span className="relative z-10 transition-colors duration-500 group-hover:text-[#faf3e5]">Discover {item.title}</span>
                <span className="absolute inset-0 bg-[#90060c] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </button>
            </motion.div>
            
          </div>
        </section>
      ))}
    </div>
  );
}