import React from 'react';
import Image from 'next/image';

export default function HeritageSection() {
  return (
    <section className="py-20 px-6 bg-[#faf3e5] text-[#90060c]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Text Content */}
        <div className="order-2 lg:order-1">
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

        {/* Static Image Grid - Optimized for Mobile & Desktop */}
        <div className="order-1 lg:order-2 grid grid-cols-2 lg:grid-cols-3 gap-4 h-[400px] lg:h-[500px]">
          {/* Main Tall Image (Spans 2 columns on Desktop, 2 on Mobile) */}
          <div className="col-span-2 relative h-full">
            <Image 
              src="/heritage-tall.jpg" 
              alt="Heritage Craftsmanship" 
              fill 
              className="object-cover"
              priority
            />
          </div>
          
          {/* Stacked Images (Right side on Desktop, side-by-side on Mobile) */}
          <div className="col-span-2 lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
            <div className="relative h-full">
              <Image 
                src="/heritage-square-1.jpg" 
                alt="Detailed Work" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            <div className="relative h-full">
              <Image 
                src="/heritage-square-2.jpg" 
                alt="Legacy Detail" 
                fill 
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}