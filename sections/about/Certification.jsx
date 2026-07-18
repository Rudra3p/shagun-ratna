"use client";

import React from 'react';
import { ShieldCheck, Gem, BadgeCheck } from 'lucide-react';

const CERTIFICATIONS = [
  {
    icon: ShieldCheck,
    title: 'BIS Hallmarked',
    description: 'Every gold piece is stamped with the official BIS hallmark, certifying purity down to the karat.',
  },
  {
    icon: Gem,
    title: 'Certified Gemstones',
    description: 'Each gemstone is independently lab-certified for authenticity, clarity, and origin before it is set.',
  },
  {
    icon: BadgeCheck,
    title: 'GIA / IGI Referenced',
    description: 'Diamonds are graded against internationally recognized GIA and IGI standards, so quality is never a question of trust alone.',
  },
];

export default function CertificationSection() {
  return (
    <section className="py-20 px-6 bg-[#faf3e5] text-[#90060c]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
          Authenticity, <span className="italic text-[#C5A059]">Certified</span>
        </h2>
        <p className="max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed opacity-80 mb-16">
          Four decades of craftsmanship mean little without proof to stand behind it. Every piece that carries
          the Shagun Ratna name is independently verified, so what you see is exactly what you own.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-12 max-w-5xl mx-auto">
          {CERTIFICATIONS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center px-4">
              <div className="w-16 h-16 rounded-full bg-white border border-[#C5A059]/40 flex items-center justify-center text-[#90060c] mb-5 shadow-sm">
                <Icon size={26} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg mb-2">{title}</h3>
              <p className="text-sm font-light leading-relaxed opacity-75">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
