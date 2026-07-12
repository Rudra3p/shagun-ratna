"use client";

import React from 'react';
import Image from 'next/image';
import { useSiteImage } from '@/components/SiteImagesProvider';

export default function BoutiqueVisit() {
  const boutiqueImage = useSiteImage('about-boutique', '/boutique-interior.jpg');

  return (
    <section className="relative py-24 px-6 bg-white text-[#90060c]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Visual Content - Editorial Style */}
        <div className="w-full lg:w-1/2 relative">
          <div className="aspect-[4/3] w-full relative shadow-xl">
            <Image
              src={boutiqueImage}
              alt="Visit our Boutique"
              fill 
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          {/* Subtle Accent Box */}
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#90060c] -z-10 hidden lg:block" />
        </div>

        {/* Text Content - Inviting & Sophisticated */}
        <div className="w-full lg:w-1/2 space-y-8">
          <h2 className="font-serif text-4xl md:text-6xl leading-tight">
            Experience <br />
            <span className="text-[#90060c]/70 italic">Shagun Ratna</span>
          </h2>
          
          <p className="text-base md:text-lg font-light leading-relaxed opacity-80">
            Beyond the digital screen lies the true essence of our craft. We invite you to step into our sanctuary, where light dances on gold and every stone tells a story waiting to be yours.
          </p>
        </div>

      </div>
    </section>
  );
}