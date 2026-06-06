"use client";

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Dr. Anjali Mehta",
    quote: "The craftsmanship at Shagun Ratna is unparalleled. Every piece I've acquired feels like a timeless heirloom.",
    role: "Patron"
  },
  {
    name: "Vikram Shah",
    quote: "Exceptional service and rare gemstone quality. They understand the art of subtlety perfectly.",
    role: "Collector"
  },
  {
    name: "Pooja Desai",
    quote: "An Ahmedabad gem. Their attention to detail in every gold piece is truly remarkable.",
    role: "Regular Client"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-[#faf3e5]">
      <div className="max-w-5xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center font-serif text-4xl text-[#1a1a1a] mb-16 uppercase tracking-[0.2em]"
        >
          Patron Experiences
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="border-l border-[#C5A059] pl-6"
            >
              <p className="text-[#1a1a1a]/80 italic mb-6 leading-relaxed">"{t.quote}"</p>
              <h4 className="font-serif text-[#90060c]">{t.name}</h4>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/60 mt-1">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}