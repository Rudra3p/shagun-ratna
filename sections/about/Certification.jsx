"use client";

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Gem, BadgeCheck } from 'lucide-react';
import { useSiteImage, useSiteImages } from '@/components/SiteImagesProvider';
import CertificatePreview from '@/components/CertificatePreview';

const CERTIFICATIONS = [
  {
    icon: ShieldCheck,
    title: 'BIS Hallmarked',
    description: 'Every gold piece is stamped with the official BIS hallmark, certifying purity down to the karat.',
    imageKey: 'cert-bis-hallmark',
    defaultImage: '/certificates/bis-hallmark-sample.svg',
  },
  {
    icon: Gem,
    title: 'Certified Gemstones',
    description: 'Each gemstone is independently lab-certified for authenticity, clarity, and origin before it is set.',
    imageKey: 'cert-gemstone',
    defaultImage: '/certificates/gemstone-lab-report-sample.svg',
  },
  {
    icon: BadgeCheck,
    title: 'GIA / IGI Referenced',
    description: 'Diamonds are graded against internationally recognized GIA and IGI standards, so quality is never a question of trust alone.',
    imageKey: 'cert-gia-igi',
    defaultImage: '/certificates/gia-igi-report-sample.svg',
  },
];

export default function CertificationSection() {
  const certificateImage = useSiteImage('about-certification', '/new-launch.webp');
  const siteImages = useSiteImages();

  return (
    <section className="py-20 px-6 bg-[#faf3e5] text-[#90060c]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Framed certificate photo, mounted like a document on display */}
        <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
          <div className="relative w-[80%] md:w-[70%] lg:w-full max-w-md aspect-[4/5]">
            <div className="absolute -bottom-4 -left-4 w-full h-full border border-[#C5A059]/50" />
            <div className="relative w-full h-full bg-white p-3 shadow-xl">
              <div className="relative w-full h-full">
                <Image
                  src={certificateImage}
                  alt="Certification"
                  fill
                  sizes="(max-width: 1024px) 70vw, 35vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="order-1 lg:order-2 text-center lg:text-left">
          <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
            Authenticity, <span className="italic text-[#C5A059]">Certified</span>
          </h2>
          <p className="text-sm md:text-base font-light leading-relaxed opacity-80 mb-10 max-w-xl mx-auto lg:mx-0">
            Four decades of craftsmanship mean little without proof to stand behind it. Every piece that carries
            the Shagun Ratna name is independently verified, so what you see is exactly what you own.
          </p>

          <div className="space-y-7 max-w-xl mx-auto lg:mx-0">
            {CERTIFICATIONS.map(({ icon: Icon, title, description, imageKey, defaultImage }) => (
              <div key={title} className="flex items-start gap-4 text-left">
                <div className="shrink-0 w-12 h-12 rounded-full bg-white border border-[#C5A059]/40 flex items-center justify-center text-[#90060c] shadow-sm">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-1">{title}</h3>
                  <p className="text-sm font-light leading-relaxed opacity-75">{description}</p>
                  <CertificatePreview
                    title={title}
                    description={description}
                    image={siteImages[imageKey] || defaultImage}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
