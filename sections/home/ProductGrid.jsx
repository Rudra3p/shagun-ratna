"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import userApi from '@/lib/userApi';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    userApi.get('/products/homepage')
      .then((res) => {
        if (!cancelled) setProducts(res.data.products || []);
      })
      .catch(() => {
        // Homepage stays fine without this section if the catalog fetch fails
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 md:mb-20 text-center">
          {/* Self-drawing vertical pointer line */}
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: 50 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-[1px] bg-[#C5A059]/60 mb-6"
          />
          <span className="text-[#90060c] font-bold tracking-[0.4em] uppercase text-[10px] mb-3">
            Our Curation
          </span>
          <h2 className="font-brand text-3xl md:text-5xl text-[#1a1a1a] tracking-[0.15em] font-light uppercase">
            Selected Masterpieces
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-[1px] bg-[#C5A059] mt-4 md:mt-6"
          />
        </div>

        {/* Dynamic Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} aspectClassName="aspect-[3/4]" centered />
            ))
          ) : (
            products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.8 }}
                className="group bg-transparent"
              >
                <Link href={`/collection/${product._id}`}>
                  {/* Product Image Card with updated aspect-[3/4] ratio */}
                  <div className="relative w-full aspect-[3/4] bg-[#e5e5e5] rounded-2xl border border-[#C5A059]/30 overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-700">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.productName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F5EFE6] to-[#EDE2CC] text-[#C9BFA8] text-[10px] font-sans font-semibold uppercase tracking-widest">
                        Image Coming Soon
                      </div>
                    )}

                    {/* Subtle Glassmorphic Category Badge */}
                    <div className="absolute top-4 left-4 md:top-5 md:left-5 z-10 bg-[#FDFBF7]/90 backdrop-blur-sm border border-[#C5A059]/25 text-[#90060c] px-3.5 py-1 md:px-4 md:py-1.5 rounded-full shadow-sm">
                      <p className="text-[9px] uppercase tracking-[0.2em] font-bold">
                        {product.category || "Fine Jewelry"}
                      </p>
                    </div>

                    {/* Hover Reveal Inquire Overlay */}
                    <div className="absolute inset-0 bg-[#1a1a1a]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-20">
                      <span
                        className="font-sans px-8 py-3 bg-[#FDFBF7] text-[#90060c] border border-[#C5A059] text-[10px] tracking-[0.25em] uppercase font-bold rounded-full transform scale-95 group-hover:scale-100 transition-all duration-500 shadow-lg"
                      >
                        View Piece
                      </span>
                    </div>
                  </div>

                  {/* Bottom Details */}
                  <div className="pt-4 md:pt-6 px-2 text-center flex flex-col items-center">
                    <h4 className="font-brand text-xl md:text-2xl text-[#1a1a1a] group-hover:text-[#90060c] transition-colors duration-500 font-light line-clamp-1">
                      {product.productName}
                    </h4>
                    <p className="font-sans text-sm text-[#2D2926] mt-1.5 font-semibold">
                      {product.price ? `₹${parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'Price on Request'}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
