"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, Gem, BadgeCheck, Leaf } from 'lucide-react';
import { useSiteImages } from '@/components/SiteImagesProvider';
import CertificatePreview from '@/components/CertificatePreview';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
};

const CERTIFICATIONS = [
  {
    icon: ShieldCheck,
    title: 'BIS Hallmarked',
    description: 'Every gold piece carries the official BIS hallmark, certifying purity and fineness.',
    imageKey: 'cert-bis-hallmark',
    defaultImage: '/certificates/bis-hallmark-sample.svg',
  },
  {
    icon: Gem,
    title: 'Certified Gemstones',
    description: 'Every gemstone is lab-certified for authenticity, clarity, and origin before it reaches you.',
    imageKey: 'cert-gemstone',
    defaultImage: '/certificates/gemstone-lab-report-sample.svg',
  },
  {
    icon: BadgeCheck,
    title: 'GIA / IGI Referenced',
    description: 'Diamonds are graded against internationally recognized GIA and IGI standards.',
    imageKey: 'cert-gia-igi',
    defaultImage: '/certificates/gia-igi-report-sample.svg',
  },
];

export default function AuthenticitySection() {
  const siteImages = useSiteImages();

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-[#FDFBF7] text-[#1a1a1a] overflow-hidden">

      {/* Section Header */}
      <div className="max-w-7xl mx-auto flex flex-col items-center mb-16 md:mb-20 text-center">
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: 50 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-[1px] bg-[#C5A059]/60 mb-6"
        />
        <span className="text-[#90060c] font-bold tracking-[0.4em] uppercase text-[10px] mb-3">
          Our Promise
        </span>
        <h2 className="font-brand text-3xl md:text-5xl text-[#1a1a1a] tracking-[0.15em] font-light uppercase">
          Authenticity &amp; Certification
        </h2>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 96 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-[1px] bg-[#C5A059] mt-4 md:mt-6"
        />
        <p className="font-sans text-sm leading-[2.1] tracking-[0.05em] text-[#1a1a1a]/80 mt-8 max-w-2xl">
          Every piece that leaves our atelier is backed by rigorous, independently verified certification —
          because trust is the truest measure of fine jewelry.
        </p>
      </div>

      {/* Certification badges */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUp}
        className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-12 mb-20"
      >
        {CERTIFICATIONS.map(({ icon: Icon, title, description, imageKey, defaultImage }) => (
          <div key={title} className="flex flex-col items-center text-center px-4">
            <div className="w-14 h-14 rounded-full bg-[#90060c]/5 border border-[#C5A059]/30 flex items-center justify-center text-[#90060c] mb-5">
              <Icon size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-brand text-lg text-[#1a1a1a] mb-2 tracking-wide">{title}</h3>
            <p className="font-sans text-xs leading-6 text-[#1a1a1a]/70 tracking-wide">{description}</p>
            <CertificatePreview
              title={title}
              description={description}
              image={siteImages[imageKey] || defaultImage}
            />
          </div>
        ))}
      </motion.div>

      {/* Provenance & ethical sourcing */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUp}
        className="max-w-3xl mx-auto text-center border-t border-[#C5A059]/20 pt-12"
      >
        <div className="flex items-center justify-center gap-3 mb-5">
          <Leaf size={16} className="text-[#C5A059]" />
          <span className="text-[#C5A059] font-bold tracking-[0.3em] uppercase text-[10px]">
            Provenance &amp; Ethics
          </span>
        </div>
        <p className="font-sans text-sm leading-[2.1] tracking-[0.05em] text-[#1a1a1a]/85 mb-10">
          We guarantee the provenance of every material we use — sourced responsibly and verified at each
          stage, then crafted with an unwavering commitment to purity. Our artisans work only with ethically
          sourced gold and conflict-free stones, upholding a standard of integrity that matches the
          craftsmanship itself.
        </p>

        <Link
          href="/about"
          className="relative w-fit inline-block font-sans px-10 py-3.5 text-xs tracking-[0.25em] uppercase text-[#90060c] border border-[#90060c] rounded-full overflow-hidden group transition-all duration-500 hover:shadow-[0_8px_20px_rgba(144,6,12,0.15)] active:scale-[0.98]"
        >
          <span className="relative z-10 transition-colors duration-500 group-hover:text-[#faf3e5]">View Our Standards</span>
          <span className="absolute inset-0 bg-[#90060c] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
        </Link>
      </motion.div>
    </section>
  );
}
