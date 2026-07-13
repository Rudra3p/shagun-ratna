"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSiteImages } from '@/components/SiteImagesProvider';
import userApi from '@/lib/userApi';

const collections = [
  {
    tag: "The Collection",
    title: "Certified Diamonds",
    text: "Unrivaled brilliance, ethically sourced. Each stone is hand-selected for its fire and clarity, ensuring your piece is as unique as the moments it celebrates.",
    imageKey: "home-featured-diamond",
    image: "/diamond-section.jpg"
  },
  {
    tag: "The Collection",
    title: "Rare Gemstones",
    text: "Stones that tell a story of origin. From deep emeralds to vibrant rubies, we curate rare treasures that bring color and life to traditional silhouettes.",
    imageKey: "home-featured-gemstone",
    image: "/gemstone-section.jpg"
  },
  {
    tag: "The Collection",
    title: "Gold Artistry",
    text: "Tradition captured in 22K gold. Our master artisans breathe soul into metal, creating timeless pieces that carry the legacy of generations forward.",
    imageKey: "home-featured-gold",
    image: "/gold-section.jpg"
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
};

export default function FeaturedCollections() {
  const siteImages = useSiteImages();
  const [featured, setFeatured] = useState([null, null, null]);

  useEffect(() => {
    let cancelled = false;

    userApi.get('/site-content')
      .then((res) => {
        if (!cancelled) setFeatured(res.data.featured || [null, null, null]);
      })
      .catch(() => {
        // Cards keep their default content if this feed fails
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="bg-[#FDFBF7]">
      {collections.map((defaultItem, index) => {
        const assigned = featured[index];
        const product = assigned?.product;
        const item = {
          title: assigned?.title || defaultItem.title,
          text: assigned?.description || defaultItem.text,
          tag: defaultItem.tag,
          image: product?.imageUrl || siteImages[defaultItem.imageKey] || defaultItem.image,
        };

        return (
        <section key={index} className="min-h-screen py-16 md:py-28 px-6 md:px-12 flex items-center overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center w-full">
            
            {/* Image Section - Alternates Order on Desktop, Stays Top on Mobile */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className={`relative h-[360px] sm:h-[480px] lg:h-[650px] w-full lg:col-span-7 group pr-3 pb-3 lg:pr-0 lg:pb-0 ${
                index % 2 !== 0 ? 'lg:order-2' : ''
              }`}
            >
              {/* Outer gold-matted layout frame */}
              <div className="absolute inset-0 border border-[#C5A059]/40 rounded-2xl translate-x-3 translate-y-3 lg:translate-x-4 lg:translate-y-4 -z-10 group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform duration-700" />
              
              {/* Accent corner borders */}
              <div className={`absolute -bottom-2 lg:-bottom-4 w-16 h-16 lg:w-20 lg:h-20 border-b border-[#C5A059]/60 z-10 
                ${index % 2 !== 0 ? '-right-2 lg:-right-4 border-r rounded-br-2xl' : '-left-2 lg:-left-4 border-l rounded-bl-2xl'}`} 
              />
              
              <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
                  className="object-cover scale-100 group-hover:scale-103 transition-all duration-[1200ms] ease-out"
                  priority={index === 0}
                />
              </div>
            </motion.div>

            {/* Floating Glassmorphic Text Card */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className={`flex flex-col justify-center items-center lg:items-start text-center lg:text-left lg:col-span-5 bg-[#FDFBF7]/90 lg:bg-[#FDFBF7]/70 backdrop-blur-md border border-[#C5A059]/20 p-8 md:p-12 lg:p-14 rounded-2xl shadow-lg z-20 mt-4 lg:mt-0
                ${index % 2 !== 0 
                  ? 'lg:order-1 lg:-mr-12 lg:translate-x-6' 
                  : 'lg:-ml-12 lg:-translate-x-6'}`}
            >
              {/* Micro vertical pointer line */}
              <motion.div 
                initial={{ height: 0 }}
                whileInView={{ height: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="w-[1px] bg-[#C5A059]/60 mb-4 hidden lg:block"
              />

              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#90060c] font-bold tracking-[0.4em] uppercase text-[10px]">
                  {item.tag}
                </span>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: 32 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-[1px] bg-[#C5A059]" 
                />
              </div>
              
              <h2 className="font-brand text-3xl sm:text-4xl lg:text-5xl mb-6 leading-tight text-[#1a1a1a] font-light uppercase">
                {item.title}
              </h2>
              
              <p className="font-sans text-sm leading-[2.1] tracking-[0.05em] text-[#1a1a1a]/80 mb-8 text-left">
                {item.text}
              </p>
              
              {product ? (
                <Link
                  href={`/collection/${product._id}`}
                  className="relative w-fit font-sans px-10 py-3.5 text-xs tracking-[0.25em] uppercase text-[#90060c] border border-[#90060c] rounded-full overflow-hidden group transition-all duration-500 hover:shadow-[0_8px_20px_rgba(144,6,12,0.15)] active:scale-[0.98]"
                >
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-[#faf3e5]">Discover {item.title}</span>
                  <span className="absolute inset-0 bg-[#90060c] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </Link>
              ) : (
                <Link href="/collection" className="relative w-fit font-sans px-10 py-3.5 text-xs tracking-[0.25em] uppercase text-[#90060c] border border-[#90060c] rounded-full overflow-hidden group transition-all duration-500 hover:shadow-[0_8px_20px_rgba(144,6,12,0.15)] active:scale-[0.98]">
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-[#faf3e5]">Discover {item.title}</span>
                  <span className="absolute inset-0 bg-[#90060c] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </Link>
              )}
            </motion.div>

          </div>
        </section>
        );
      })}
    </div>
  );
}