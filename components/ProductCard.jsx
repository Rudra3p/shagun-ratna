"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Gem } from 'lucide-react';
import Badge from '@/components/Badge';

export const FAVORITES_STORAGE_KEY = 'shagun_ratna_favorites';

export default function ProductCard({ product, isFavorited, onToggleFavorite, priority = false, isRecommended = false }) {
  const hasDiscount = product.offerPrice > 0 && product.offerPrice !== product.price;
  const savings = hasDiscount ? product.price - product.offerPrice : 0;

  // Heart "burst" micro-reward: a brief ping the moment a piece is favorited.
  const [burst, setBurst] = useState(false);
  const wasFavorited = useRef(isFavorited);
  useEffect(() => {
    if (isFavorited && !wasFavorited.current) {
      setBurst(true);
      const t = setTimeout(() => setBurst(false), 500);
      wasFavorited.current = isFavorited;
      return () => clearTimeout(t);
    }
    wasFavorited.current = isFavorited;
  }, [isFavorited]);

  return (
    <div className="group relative flex flex-col bg-transparent border-none p-0 transition-transform duration-500 ease-out hover:-translate-y-1.5">
      <Link href={`/collection/${product._id}`} className="contents">
        {/* Image Frame (Ratio 4:5, floats free of the text — no boxed card) */}
        <div className="relative aspect-[4/5] w-full mb-2.5 sm:mb-3.5 overflow-hidden rounded-xl bg-gradient-to-b from-[#F5EFE6] to-[#EDE2CC] ring-1 ring-[#EBE3D5]/40 group-hover:ring-[#C5A059]/60 shadow-sm group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.14)] transition-all duration-500">
          {isRecommended && (
            <div className="absolute top-3 left-3 z-10">
              <Badge variant="recommended">Recommended</Badge>
            </div>
          )}
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.productName}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : undefined}
              className="object-cover scale-100 group-hover:scale-[1.08] transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#C9BFA8]">
              <Gem size={28} strokeWidth={1.25} />
              <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-center px-2">Image Coming Soon</span>
            </div>
          )}

          {/* Favorite control — floats over the image so the info block below can stay centered */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(product._id, e);
            }}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/85 backdrop-blur-md ring-1 ring-black/[0.04] shadow-sm transition-all duration-300 hover:bg-white hover:scale-110 active:scale-90 cursor-pointer"
          >
            {burst && <span className="absolute inset-0 rounded-full bg-[#90060C]/50 animate-ping" />}
            <Heart
              size={15}
              className={`transition-colors duration-300 ${isFavorited ? "fill-[#90060C] text-[#90060C]" : "text-[#2D2926]"}`}
            />
          </button>
        </div>

        {/* Product info — centered stack: purity → title → divider → price block (bottom-anchored so
            it lines up across cards regardless of which optional bits — purity, discount — are present) */}
        <div className="flex flex-col flex-grow items-center text-center px-0.5 sm:px-1 pt-1">
          {/* Always rendered at the same size (invisible when there's no purity to show) so
              the title below starts at the same height across every card in the row */}
          <p
            className={`flex items-center gap-1 text-[9px] sm:text-[10.5px] font-sans font-bold uppercase tracking-[0.18em] text-[#C5A059] mb-1.5 line-clamp-1 ${
              product.purity ? "" : "invisible"
            }`}
          >
            <Gem size={9} strokeWidth={2.5} className="shrink-0" />
            {product.purity || "placeholder"}
          </p>
          <h3 className="text-base sm:text-xl font-brand font-semibold tracking-tight leading-snug text-[#1a1a1a] group-hover:text-[#90060C] transition-colors duration-300 line-clamp-1 w-full">
            {product.productName}
          </h3>

          <div className="h-px w-6 bg-[#C5A059]/50 mt-2.5 mb-3 group-hover:w-10 transition-all duration-500" />

          <div className="mt-auto flex flex-col items-center">
            <div className="flex items-baseline justify-center gap-2 flex-wrap">
              {hasDiscount ? (
                <>
                  <span className="text-lg sm:text-2xl font-brand font-bold text-[#90060C]">
                    ₹{parseFloat(product.offerPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs sm:text-sm text-[#A8A196] font-medium line-through">
                    ₹{parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </>
              ) : (
                <span className="text-lg sm:text-2xl font-brand font-bold text-[#2D2926]">
                  {product.price ? `₹${parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'Price on Request'}
                </span>
              )}
            </div>
            {/* Concrete dollar savings reads stronger than a bare percentage (loss-aversion framing) */}
            {hasDiscount && savings > 0 && (
              <span className="text-[10px] sm:text-xs font-sans font-semibold text-[#9C8253] mt-1">
                You save ₹{savings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
