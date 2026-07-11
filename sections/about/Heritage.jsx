"use client";

import React from 'react';
import Image from 'next/image';
import { useSiteImage } from '@/components/SiteImagesProvider';

export default function HeritageSection() {
  const tallImage = useSiteImage('about-heritage-tall', '/heritage-tall.jpg');
  const squareImage1 = useSiteImage('about-heritage-square-1', '/heritage-square-1.jpg');
  const squareImage2 = useSiteImage('about-heritage-square-2', '/heritage-square-2.jpg');

  return (
    <section className="py-20 px-6 bg-white text-[#90060c]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Image Grid - Moved to the Left */}
        <div className="order-1 grid grid-cols-2 lg:grid-cols-3 gap-4 h-[400px] lg:h-[500px]">
          {/* Main Tall Image */}
          <div className="col-span-2 relative h-full">
            <Image
              src={tallImage}
              alt="Heritage Craftsmanship"
              fill 
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
          
          {/* Stacked Images */}
          <div className="col-span-2 lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
            <div className="relative h-full">
              <Image
                src={squareImage1}
                alt="Detailed Work"
                fill 
                sizes="(max-width: 1024px) 50vw, 17vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="relative h-full">
              <Image
                src={squareImage2}
                alt="Legacy Detail"
                fill 
                sizes="(max-width: 1024px) 50vw, 17vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Text Content - Moved to the Right */}
        <div className="order-2">
          <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">
            Four Decades of <br />
            <span className="italic text-[#C5A059]">Artistry</span>
          </h2>
          <div className="space-y-6 text-sm md:text-base leading-relaxed opacity-80 font-light">
            <p>
              Founded in 1980, Shagun Ratna began as a humble atelier with a singular vision: 
              to translate the language of precious stones into wearable legacies.
            </p>
            <p>
              Over the last 40 years, our journey has been defined by the pursuit of perfection. 
              From selecting the purest gold to the meticulous hand-setting of each gem, 
              we treat every creation as a timeless artifact of our history.
            </p>
          </div>
        </div>
        
      </div>
    </section>
  );
}