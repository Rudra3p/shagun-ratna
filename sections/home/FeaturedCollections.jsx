"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const gems = [
  { name: "Certified Diamonds", desc: "Unrivaled brilliance, ethically sourced." },
  { name: "Rare Gemstones", desc: "Stones that tell a story of origin." },
  { name: "Gold Artistry", desc: "Tradition captured in 22K gold." }
];

export default function FeaturedCollections() {
  return (
    <section className="py-32 px-6 bg-[#faf3e5]">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center font-serif text-5xl text-[#1a1a1a] mb-20"
        >
          Exquisite Selections
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {gems.map((gem, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }}
              className="border border-[#C5A059]/20 p-8 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-[#C5A059]/10 rounded-full mb-6" /> {/* Placeholder for Gem Icon */}
              <h4 className="text-xl font-serif mb-3">{gem.name}</h4>
              <p className="text-sm tracking-widest uppercase opacity-70">{gem.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}