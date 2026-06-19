"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const products = [
  { id: 1, name: "Gold Necklace", category: "Heirloom" },
  { id: 2, name: "Diamond Ring", category: "Solitaire" },
  { id: 3, name: "Emerald Studs", category: "Gemstone" },
  { id: 4, name: "Ruby Bangle", category: "Traditional" },
  { id: 5, name: "Platinum Chain", category: "Modern" },
  { id: 6, name: "Pearl Set", category: "Everyday" },
];

export default function ProductGrid() {
  return (
    <section className="py-32 px-12 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-20 text-center">
          {/* Self-drawing vertical pointer line */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: 50 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-[1px] bg-[#C5A059]/60 mb-6"
          />
          <span className="text-[#90060c] font-bold tracking-[0.4em] uppercase text-[10px] mb-3">
            Our Curation
          </span>
          <h2 className="font-brand text-4xl md:text-5xl text-[#1a1a1a] tracking-[0.15em] font-light">
            Selected Masterpieces
          </h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-[1px] bg-[#C5A059] mt-6" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className="group cursor-pointer bg-transparent"
            >
              {/* Product Image Card with Hover Overlay */}
              <div className="relative w-full aspect-[4/5] bg-[#e5e5e5] rounded-2xl border border-[#C5A059]/30 overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-700">
                <Image 
                  src={`/product-${product.id}.jpg`} 
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
                />

                {/* Subtle Glassmorphic Category Badge */}
                <div className="absolute top-5 left-5 z-10 bg-[#FDFBF7]/90 backdrop-blur-sm border border-[#C5A059]/25 text-[#90060c] px-4 py-1.5 rounded-full shadow-sm">
                  <p className="text-[9px] uppercase tracking-[0.2em] font-bold">
                    {product.category}
                  </p>
                </div>

                {/* Hover Reveal Inquire Overlay */}
                <div className="absolute inset-0 bg-[#1a1a1a]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-20">
                  <motion.span 
                    className="font-sans px-8 py-3 bg-[#FDFBF7] text-[#90060c] border border-[#C5A059] text-[10px] tracking-[0.25em] uppercase font-bold rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 shadow-lg"
                  >
                    Inquire Now
                  </motion.span>
                </div>
              </div>

              {/* Bottom Details */}
              <div className="pt-6 px-2 text-center flex flex-col items-center">
                <h4 className="font-brand text-2xl text-[#1a1a1a] group-hover:text-[#90060c] transition-colors duration-500 font-light">
                  {product.name}
                </h4>
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#C5A059] mt-2 font-semibold">
                  View Masterpiece
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}