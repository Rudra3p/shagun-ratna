"use client";

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Gem, BadgeCheck } from 'lucide-react';
import { useSiteImage, useSiteImages } from '@/components/SiteImagesProvider';
import CertificatePreview from '@/components/CertificatePreview';
import { EditableText } from '@/components/admin/EditableText';
import { EditableMedia } from '@/components/admin/EditableMedia';

const CERTIFICATIONS = [
  {
    icon: ShieldCheck,
    titleKey: 'about-cert-1-title',
    defaultTitle: 'BIS Hallmarked',
    descKey: 'about-cert-1-desc',
    defaultDesc: 'Every gold piece is stamped with the official BIS hallmark, certifying purity down to the karat.',
    imageKey: 'cert-bis-hallmark',
    defaultImage: '/certificates/bis-hallmark-sample.svg',
    label: 'BIS Hallmark Certificate',
  },
  {
    icon: Gem,
    titleKey: 'about-cert-2-title',
    defaultTitle: 'Certified Gemstones',
    descKey: 'about-cert-2-desc',
    defaultDesc: 'Each gemstone is independently lab-certified for authenticity, clarity, and origin before it is set.',
    imageKey: 'cert-gemstone',
    defaultImage: '/certificates/gemstone-lab-report-sample.svg',
    label: 'Gemstone Lab Report',
  },
  {
    icon: BadgeCheck,
    titleKey: 'about-cert-3-title',
    defaultTitle: 'GIA / IGI Referenced',
    descKey: 'about-cert-3-desc',
    defaultDesc: 'Diamonds are graded against internationally recognized GIA and IGI standards, so quality is never a question of trust alone.',
    imageKey: 'cert-gia-igi',
    defaultImage: '/certificates/gia-igi-report-sample.svg',
    label: 'GIA / IGI Report',
  },
];

export default function CertificationSection() {
  const certificateImage = useSiteImage('about-certification', '/new-launch.webp');
  const siteImages = useSiteImages();

  return (
    <section className="py-20 px-6 bg-[#FDFBF7] text-[#90060c]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Framed certificate photo, mounted like a document on display */}
        <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
          <EditableMedia
            slotKey="about-certification"
            label="About Certification Frame Photo"
            defaultSrc="/new-launch.webp"
            className="relative w-[80%] md:w-[70%] lg:w-full max-w-md aspect-[4/5]"
          >
            <div className="relative w-full h-full">
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
          </EditableMedia>
        </div>

        {/* Text Content */}
        <div className="order-1 lg:order-2 text-center lg:text-left">
          <EditableText
            textKey="about-cert-title"
            defaultText="Authenticity, Certified"
            label="Certification Heading"
            section="Certification"
            as="h2"
            className="font-serif text-4xl md:text-5xl mb-6 leading-tight block"
          />
          <EditableText
            textKey="about-cert-intro"
            defaultText="Four decades of craftsmanship mean little without proof to stand behind it. Every piece that carries the Shagun Ratna name is independently verified, so what you see is exactly what you own."
            label="Certification Introduction"
            section="Certification"
            type="textarea"
            as="p"
            className="text-sm md:text-base font-light leading-relaxed opacity-80 mb-10 max-w-xl mx-auto lg:mx-0 block"
          />

          <div className="space-y-7 max-w-xl mx-auto lg:mx-0">
            {CERTIFICATIONS.map(({ icon: Icon, titleKey, defaultTitle, descKey, defaultDesc, imageKey, defaultImage, label }) => (
              <div key={titleKey} className="flex items-start gap-4 text-left">
                <div className="shrink-0 w-12 h-12 rounded-full bg-white border border-[#C5A059]/40 flex items-center justify-center text-[#90060c] shadow-sm">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <EditableText
                    textKey={titleKey}
                    defaultText={defaultTitle}
                    label={label + ' Title'}
                    section="Certification"
                    as="h3"
                    className="font-serif text-lg mb-1 block"
                  />
                  <EditableText
                    textKey={descKey}
                    defaultText={defaultDesc}
                    label={label + ' Description'}
                    section="Certification"
                    type="textarea"
                    as="p"
                    className="text-sm font-light leading-relaxed opacity-75 mb-2 block"
                  />
                  <EditableMedia
                    slotKey={imageKey}
                    label={label + ' Sample'}
                    defaultSrc={defaultImage}
                    className="inline-block"
                  >
                    <CertificatePreview
                      title={defaultTitle}
                      description={defaultDesc}
                      image={siteImages[imageKey] || defaultImage}
                    />
                  </EditableMedia>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
