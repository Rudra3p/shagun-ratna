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
    <section className="py-24 px-6 bg-[#faf3e5]">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center font-serif text-4xl text-[#1a1a1a] mb-16 uppercase tracking-[0.2em]"
        >
          Selected Pieces
        </motion.h2>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ scale: 1.02 }}
              className="group cursor-pointer border border-[#C5A059]/20 bg-white"
            >
              <div className="relative h-[400px] w-full bg-[#e5e5e5] overflow-hidden">
                {/* Product Image */}
                <Image 
                  src={`/product-${product.id}.jpg`} 
                  alt={product.name}
                  fill
                  className="object-cover"
                />

                {/* Category Badge inside the image top-left */}
                <div className="absolute top-4 left-4 z-10 bg-[#C5A059] text-white px-3 py-1 rounded-sm">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-medium">
                    {product.category}
                  </p>
                </div>
              </div>

              <div className="p-6 text-center">
                <h4 className="font-serif text-lg text-[#1a1a1a]">{product.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}