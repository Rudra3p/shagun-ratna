"use client";

import React from 'react';
import { motion } from 'framer-motion';

// Matches the animation flow of the Hero Section
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.3 }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
  }
};

export default function StorySection() {
  return (
    // bg-[#faf3e5] matches your Hero Section background color
    <section className="py-24 px-6 bg-[#faf3e5] text-center flex flex-col items-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-2xl"
      >
        {/* brand-font uses your Cormorant Garamond style */}
        <motion.h2 
          variants={childVariants} 
          className="brand-font text-4xl md:text-5xl mb-10 text-[#1a1a1a]"
        >
          Our Story
        </motion.h2>
        
        {/* ui-font uses your Montserrat style */}
        <motion.p 
          variants={childVariants} 
          className="ui-font text-xs md:text-sm text-[#1a1a1a]/80 leading-[2.2] tracking-[0.2em] uppercase font-light"
        >
          Since 1980, Shagun Ratna has been a beacon of timeless elegance and exquisite craftsmanship in the world of fine jewelry. Our journey began with a passion for creating pieces that not only adorn but also tell a story. Each creation is a blend of traditional artistry and contemporary design, crafted with the utmost care and precision. We believe that jewelry is more than just an accessory; it's a reflection of your unique style and a celebration of life's precious moments.
        </motion.p>
      </motion.div>
    </section>
  );
}