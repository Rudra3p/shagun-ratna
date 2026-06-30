"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react'; // Added Star icon

const testimonials = [
  {
    name: "Dr. Anjali Mehta",
    quote: "The craftsmanship at Shagun Ratna is unparalleled. Every piece I've acquired feels like a timeless heirloom.",
    role: "Patron",
    rating: 5
  },
  {
    name: "Vikram Shah",
    quote: "Exceptional service and rare gemstone quality. They understand the art of subtlety perfectly.",
    role: "Collector",
    rating: 5
  },
  {
    name: "Pooja Desai",
    quote: "An Ahmedabad gem. Their attention to detail in every gold piece is truly remarkable.",
    role: "Regular Client",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 md:mb-20 text-center">
          {/* Self-drawing vertical line */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: 50 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-[1px] bg-[#C5A059]/60 mb-6"
          />
          <span className="text-[#90060c] font-bold tracking-[0.4em] uppercase text-[10px] mb-3">
            Words from our Patrons
          </span>
          <h2 className="font-brand text-3xl md:text-5xl text-[#1a1a1a] tracking-[0.15em] font-light uppercase">
            Patron Experiences
          </h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-[1px] bg-[#C5A059] mt-4 md:mt-6" 
          />
        </div>
        
        {/* Fluid Testimonial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ 
                delay: typeof window !== 'undefined' && window.innerWidth >= 1024 ? i * 0.15 : 0, 
                duration: 0.8 
              }}
              className={`bg-[#FDFBF7]/60 backdrop-blur-sm border border-[#C5A059]/25 p-8 md:p-10 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-500 flex flex-col justify-between ${
                i === 2 ? 'sm:col-span-2 lg:col-span-1 sm:max-w-[50%] sm:mx-auto lg:max-w-none lg:mx-0' : ''
              }`}
            >
              <div>
                {/* 5-Star Luxury Rating Row */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, index) => (
                    <Star 
                      key={index} 
                      size={13} 
                      className="text-[#C5A059] fill-[#C5A059]" 
                    />
                  ))}
                </div>

                {/* Large Decorative Quote Mark */}
                <span className="font-brand text-6xl md:text-7xl text-[#C5A059]/30 select-none block h-4 leading-none mb-4">“</span>
                <p className="font-sans text-[#1a1a1a]/80 italic text-sm leading-[1.8] tracking-[0.04em] mb-8">
                  {t.quote}
                </p>
              </div>
              <div>
                <div className="h-[1px] w-8 bg-[#C5A059]/40 mb-4" />
                <h4 className="font-brand text-xl md:text-2xl text-[#90060c] font-normal">{t.name}</h4>
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#C5A059] mt-2 font-bold">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}