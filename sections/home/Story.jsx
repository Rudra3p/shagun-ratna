"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
};

export default function StorySection() {
  return (
    <section className="py-32 px-12 bg-[#FDFBF7] text-[#1a1a1a] overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Asymmetric Matting Image Container */}
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
              src="/story-image.jpg"
              alt="The craftsmanship of Shagun Ratna"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover grayscale hover:grayscale-0 scale-100 group-hover:scale-103 transition-all duration-[1200ms] ease-out"
            />
          </div>
        </motion.div>

        {/* Text Storytelling Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="flex flex-col justify-center lg:pl-6"
        >
          {/* Subtle vertical connection line */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: 40 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-[1px] bg-[#C5A059]/60 mb-6 hidden lg:block"
          />

          <div className="flex items-center gap-4 mb-4">
            <span className="text-[#90060c] font-bold tracking-[0.4em] uppercase text-[10px]">
              The Legacy
            </span>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-[1px] bg-[#C5A059]" 
            />
          </div>
          
          <h2 className="font-brand text-5xl md:text-6xl mb-8 leading-[1.15] text-[#1a1a1a] font-light italic">
            Defined by <span className="text-[#90060c] font-normal not-italic">Time,</span> <br /> 
            <span className="text-[#90060c] font-normal not-italic">Crafted</span> by Hand.
          </h2>
          
          <p className="font-sans text-sm leading-[2.1] tracking-[0.05em] text-[#1a1a1a]/80 mb-10 max-w-lg">
            <span className="float-left text-6xl font-brand text-[#90060c] mr-3 mt-1 font-bold leading-none select-none">S</span>
            ince 1980, Shagun Ratna has transcended the ordinary. We believe that 
            jewelry is not merely an ornament, but a silent language of tradition 
            and grace. Inspired by the depth of our heritage and the precision 
            of modern artistry, every piece is born from a meticulous process 
            that honors the artisan&apos;s touch.
          </p>
          
          <button className="relative w-fit font-sans px-10 py-3.5 text-xs tracking-[0.25em] uppercase text-[#90060c] border border-[#90060c] rounded-full overflow-hidden group transition-all duration-500 hover:shadow-[0_8px_20px_rgba(144,6,12,0.15)] active:scale-[0.98]">
            <span className="relative z-10 transition-colors duration-500 group-hover:text-[#faf3e5]">Discover Our Craft</span>
            <span className="absolute inset-0 bg-[#90060c] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </button>
        </motion.div>
        
      </div>
    </section>
  );
}