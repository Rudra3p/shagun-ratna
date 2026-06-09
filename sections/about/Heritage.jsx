import React from 'react';

export default function HeritageSection() {
  return (
    <section className="py-24 px-6 bg-[#faf3e5] text-[#90060c]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Text Side */}
        <div>
          <h2 className="font-serif text-4xl mb-8">Four Decades of Artistry</h2>
          <div className="space-y-6 text-sm leading-relaxed opacity-80">
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

        {/* Image Side */}
        <div className="relative aspect-[4/3] md:aspect-square bg-gray-200 overflow-hidden">
          {/* Replace this div with an <img /> or next/image component */}
          <div className="absolute inset-0 bg-[#90060c]/10 flex items-center justify-center italic text-[#90060c]">
            
          </div>
        </div>
        
      </div>
    </section>
  );
}