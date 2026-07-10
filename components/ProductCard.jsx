"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Gem } from 'lucide-react';

export const FAVORITES_STORAGE_KEY = 'shagun_ratna_favorites';

export default function ProductCard({ product, isFavorited, onToggleFavorite }) {
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
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.productName}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover scale-100 group-hover:scale-[1.08] transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#C9BFA8]">
              <Gem size={28} strokeWidth={1.25} />
              <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-center px-2">Image Coming Soon</span>
            </div>
          )}
        </div>

        {/* Clean Product Typography stack info panel — sits below the image, no shared box */}
        <div className="flex flex-col flex-grow px-0.5 sm:px-1 pb-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm sm:text-lg font-brand font-semibold tracking-tight text-[#1a1a1a] group-hover:text-[#90060C] transition-colors duration-300 line-clamp-1">
              {product.productName}
            </h3>

            {/* Favorite control — lives with the product info, not floating over the image */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(product._id, e);
              }}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              className={`relative shrink-0 -mt-0.5 -mr-0.5 flex items-center justify-center w-7 h-7 rounded-full ring-1 transition-all duration-300 cursor-pointer active:scale-90 ${
                isFavorited
                  ? "ring-[#90060C]/20 bg-[#90060C]/5"
                  : "ring-[#EBE3D5] hover:ring-[#C5A059]/60 hover:bg-[#F5EFE6]"
              }`}
            >
              {burst && <span className="absolute inset-0 rounded-full bg-[#90060C]/50 animate-ping" />}
              <Heart
                size={14}
                className={`transition-colors duration-300 ${isFavorited ? "fill-[#90060C] text-[#90060C]" : "text-[#A8A196] hover:text-[#2D2926]"}`}
              />
            </button>
          </div>
          <p className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-wide text-[#9C8253] mb-2 sm:mb-2.5 line-clamp-1">
            <Gem size={9} strokeWidth={2.5} className="shrink-0 opacity-70" />
            {product.purity || "22K Pure Gold"} · {product.category || "Fine Jewelry"}
          </p>
          <div className="h-px w-6 bg-[#C5A059]/50 mb-2 sm:mb-2.5 group-hover:w-10 transition-all duration-500" />
          <div className="flex items-baseline gap-1.5 sm:gap-2 mt-auto flex-wrap">
            {hasDiscount ? (
              <>
                <span className="text-sm sm:text-base font-brand font-bold text-[#90060C]">
                  ${parseFloat(product.offerPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] sm:text-xs text-[#A8A196] font-medium line-through">
                  ${parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-base font-brand font-bold text-[#2D2926]">
                {product.price ? `$${parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'Price on Request'}
              </span>
            )}
          </div>
          {/* Concrete dollar savings reads stronger than a bare percentage (loss-aversion framing) */}
          {hasDiscount && savings > 0 && (
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold text-[#9C8253] mt-1">
              You save ${savings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
