import React from 'react';

export default function PhilosophySection() {
  return (
    <section className="py-24 px-6 bg-[#90060c] text-[#faf3e5]">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Decorative element to emphasize the "Luxury" feel */}
        <div className="text-[#C5A059] mb-8 text-2xl">✧</div>
        
        <h2 className="font-serif text-4xl mb-10 text-[#C5A059]">Our Philosophy</h2>
        
        <div className="space-y-8 text-lg md:text-xl font-light leading-relaxed italic opacity-90">
          <p>
            "We believe that jewelry is not merely an accessory, but a silent testament to the moments that define a life."
          </p>
          <p>
            Our commitment to sustainability, ethical sourcing, and unrivaled artistry ensures that every piece we create is as kind to the earth as it is beautiful to the wearer. At Shagun Ratna, we don't just set stones; we uphold the integrity of the legacy they represent.
          </p>
        </div>

      </div>
    </section>
  );
}