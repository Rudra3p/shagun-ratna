"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSiteImage } from '@/components/SiteImagesProvider';
import { EditableText } from '@/components/admin/EditableText';
import { EditableMedia } from '@/components/admin/EditableMedia';

export default function PhilosophySection() {
  const philosophyImage = useSiteImage('about-philosophy', '/philosophy-main.webp');

  return (
    <section className="py-16 md:py-24 px-6 bg-[#90060c] text-[#faf3e5] overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        
        {/* Text Side - Now on the Left */}
        <div className="text-center md:text-left">
          <div className="text-[#C5A059] mb-4 md:mb-6 text-xl md:text-2xl">✧</div>
          <EditableText
            textKey="about-philosophy-title"
            defaultText="Our Philosophy"
            label="Philosophy Heading"
            section="Philosophy"
            as="h2"
            className="font-serif text-3xl md:text-5xl mb-6 md:mb-10 text-[#C5A059] block"
          />
          
          <div className="space-y-6 md:space-y-8 text-base md:text-xl font-light leading-relaxed italic opacity-90 max-w-xl mx-auto md:mx-0">
            <EditableText
              textKey="about-philosophy-quote"
              defaultText='"We believe that jewelry is not merely an accessory, but a silent testament to the moments that define a life."'
              label="Philosophy Quote"
              section="Philosophy"
              type="textarea"
              as="p"
              className="block"
            />
            <EditableText
              textKey="about-philosophy-desc"
              defaultText="Our commitment to sustainability, ethical sourcing, and unrivaled artistry ensures that every piece we create is as kind to the earth as it is beautiful to the wearer."
              label="Philosophy Description"
              section="Philosophy"
              type="textarea"
              as="p"
              className="not-italic text-sm md:text-lg opacity-80 block"
            />
          </div>
        </div>

        {/* Image Side - Now on the Right, Smaller & Floating */}
        <div className="flex justify-center md:justify-end">
          <EditableMedia
            slotKey="about-philosophy"
            label="Philosophy Featured Photo"
            defaultSrc="/philosophy-main.webp"
            className="relative w-[80%] md:w-[70%] aspect-[4/5]"
          >
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full shadow-2xl"
            >
              <Image
                src={philosophyImage}
                alt="Our Philosophy"
                fill 
                sizes="(max-width: 768px) 80vw, 35vw"
                className="object-cover border border-[#C5A059]/30"
              />
              {/* Decorative Border */}
              <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-full h-full border border-[#C5A059]/40 -z-10" />
            </motion.div>
          </EditableMedia>
        </div>

      </div>
    </section>
  );
}
