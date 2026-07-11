"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSiteImage } from '@/components/SiteImagesProvider';

const fadeUp = {
  hidden: { opacity: 0, y: 30 }, // Reduced initial offset slightly for smoother tracking on mobile
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
};

export default function StorySection() {
  const storyImage = useSiteImage('home-story', '/story-image.jpg');

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-[#FDFBF7] text-[#1a1a1a] overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Asymmetric Matting Image Container */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }} // Adjusted margin so it triggers earlier on small screens
          variants={fadeUp}
          className="relative h-[400px] sm:h-[500px] lg:h-[650px] w-full group pr-3 pb-3 lg:pr-0 lg:pb-0" // Added padding to contain offset shadows on mobile
        >
          {/* Gold Matted Frame behind the image */}
          <div className="absolute inset-0 border border-[#C5A059]/40 rounded-2xl translate-x-3 translate-y-3 lg:translate-x-4 lg:translate-y-4 -z-10 group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform duration-700" />
          
          {/* Burgundy accent corner lines */}
          <div className="absolute -bottom-2 -left-2 lg:-bottom-4 lg:-left-4 w-16 h-16 lg:w-24 lg:h-24 border-l border-b border-[#90060c]/35 rounded-bl-2xl -z-10" />
          
          <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={storyImage}
              alt="The craftsmanship of Shagun Ratna"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
              className="object-cover scale-100 group-hover:scale-103 transition-all duration-[1200ms] ease-out"
              priority
            />
          </div>
        </motion.div>

        {/* Text Storytelling Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left lg:pl-6"
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
          
          <h2 className="font-brand text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 lg:mb-8 leading-[1.2] text-[#1a1a1a] font-light italic">
            Defined by <span className="text-[#90060c] font-normal not-italic">Time,</span> <br /> 
            <span className="text-[#90060c] font-normal not-italic">Crafted</span> by Hand.
          </h2>
          
          <p className="font-sans text-sm leading-[2.1] tracking-[0.05em] text-[#1a1a1a]/80 mb-8 lg:mb-10 max-w-lg text-left">
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