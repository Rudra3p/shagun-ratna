"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const collections = [
  { title: "Bridal Heirloom", sub: "Timeless Elegance", img: "/collection-1.jpg" },
  { title: "Daily Grace", sub: "Subtle Sophistication", img: "/collection-2.jpg" },
  { title: "Solitaire Series", sub: "Precision Artistry", img: "/collection-3.jpg" }
];

export default function FeaturedCollections() {
  return (
    <section className="py-24 px-6 bg-white text-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h3 className="text-[#90060c] font-semibold tracking-[0.3em] uppercase text-xs mb-4">
            Curated Selection
          </h3>
          <h2 className="font-serif text-4xl md:text-5xl">Explore The Artistry</h2>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="group cursor-pointer"
            >
              <div className="relative h-[550px] w-full overflow-hidden bg-[#e5e5e5] mb-8">
                <Image 
                  src={item.img} 
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
                />
              </div>
              <h4 className="text-lg tracking-[0.2em] uppercase mb-1">{item.title}</h4>
              <p className="text-[#C5A059] text-xs uppercase tracking-[0.2em]">{item.sub}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Footer CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <button className="border-b border-[#1a1a1a] pb-1 uppercase tracking-[0.2em] text-xs hover:text-[#90060c] hover:border-[#90060c] transition-colors">
            View All Collections
          </button>
        </motion.div>
      </div>
    </section>
  );
}