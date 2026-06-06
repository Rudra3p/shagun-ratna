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
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
};

export default function FeaturedCollections() {
  return (
    <div className="bg-[#faf3e5]">
      {collections.map((item, index) => (
        <section key={index} className="min-h-screen py-24 px-6 flex items-center">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Image Section - Alternates Order */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className={`relative h-[600px] w-full ${index % 2 !== 0 ? 'lg:order-2' : ''}`}
            >
              <Image 
                src={item.image}
                alt={item.title}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
              />
              {/* Gold Accent Border - Flips based on side */}
              <div className={`absolute -bottom-6 w-24 h-24 border-b-2 border-[#C5A059] z-10 
                ${index % 2 !== 0 ? '-right-6 border-r-2' : '-left-6 border-l-2'}`} 
              />
            </motion.div>

            {/* Text Section */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className={`flex flex-col justify-center ${index % 2 !== 0 ? 'lg:order-1' : ''}`}
            >
              <span className="text-[#90060c] font-semibold tracking-[0.3em] uppercase text-xs mb-4">
                {item.tag}
              </span>
              <h2 className="font-serif text-5xl md:text-6xl mb-8 leading-tight text-[#1a1a1a]">
                {item.title}
              </h2>
              <p className="ui-font text-sm leading-[2.2] tracking-[0.1em] opacity-80 mb-10 max-w-lg">
                {item.text}
              </p>
              
              <button className="w-fit border border-[#90060c] text-[#90060c] px-12 py-4 text-xs tracking-[0.25em] uppercase hover:bg-[#90060c] hover:text-[#faf3e5] transition-all duration-500">
                Discover {item.title}
              </button>
            </motion.div>
            
          </div>
        </section>
      ))}
    </div>
  );
}