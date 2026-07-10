"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Badge, { isNewArrival } from '@/components/Badge';
import { Heart, Gem, Eye } from 'lucide-react';

export const FAVORITES_STORAGE_KEY = 'shagun_ratna_favorites';

// Real, admin-set expiry only — never a fabricated countdown. Ticks fast near the
// deadline (loss-aversion urgency), slow otherwise, so idle cards don't re-render every second.
function useOfferCountdown(offertime) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!offertime) return;
    const msLeft = new Date(offertime).getTime() - Date.now();
    if (msLeft <= 0) return;
    const tickMs = msLeft < 3600000 ? 1000 : 60000;
    const id = setInterval(() => setNow(Date.now()), tickMs);
    return () => clearInterval(id);
  }, [offertime]);

  if (!offertime) return null;
  const diff = new Date(offertime).getTime() - now;
  if (diff <= 0) return null;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  if (minutes > 0) return `${minutes}m ${seconds}s left`;
  return `${seconds}s left`;
}

export default function ProductCard({ product, isFavorited, onToggleFavorite, isRecommended = false }) {
  const hasDiscount = product.offerPrice > 0 && product.offerPrice !== product.price;
  const isNew = isNewArrival(product);
  const countdownLabel = useOfferCountdown(product.offertime);
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

          {/* Gallery-style corner brackets, like a certificate frame */}
          <span className="absolute top-3 left-3 w-5 h-5 border-t-[1.5px] border-l-[1.5px] border-[#C5A059] opacity-0 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
          <span className="absolute bottom-3 left-3 w-5 h-5 border-b-[1.5px] border-l-[1.5px] border-[#C5A059] opacity-0 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />

          {/* Soft scrim so floating controls stay legible over any image */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {(isRecommended || isNew || product.discount > 0 || countdownLabel) && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col items-start gap-1.5">
              {isRecommended ? (
                <Badge variant="recommended">For You</Badge>
              ) : isNew ? (
                <Badge variant="new">New</Badge>
              ) : null}
              {product.discount > 0 && <Badge variant="discount">{product.discount}% Off</Badge>}
              {countdownLabel && <Badge variant="urgency">{countdownLabel}</Badge>}
            </div>
          )}

          {/* Quick View strip, slides up from the base of the image on hover */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pt-10 pb-3 flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
            <span className="flex items-center gap-1.5 text-white text-[10px] font-sans font-bold uppercase tracking-[0.2em]">
              <Eye size={12} strokeWidth={2.5} /> Quick View
            </span>
          </div>
        </div>

        {/* Clean Product Typography stack info panel — sits below the image, no shared box */}
        <div className="flex flex-col flex-grow px-0.5 sm:px-1 pb-1">
          <h3 className="text-sm sm:text-lg font-brand font-semibold text-[#1a1a1a] group-hover:text-[#90060C] transition-colors duration-300 line-clamp-1 mb-1">
            {product.productName}
          </h3>
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

      {/* Floating favorite control — sibling of the Link, not nested inside it */}
      <button
        type="button"
        onClick={(e) => onToggleFavorite(product._id, e)}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md ring-1 ring-black/[0.05] shadow-md hover:ring-[#C5A059]/70 hover:bg-white hover:scale-110 active:scale-90 transition-all duration-300 cursor-pointer"
      >
        {burst && <span className="absolute inset-0 rounded-full bg-[#90060C]/50 animate-ping" />}
        <Heart
          size={13}
          className={`sm:hidden transition-colors duration-300 ${isFavorited ? "fill-[#90060C] text-[#90060C]" : "text-[#2D2926]"}`}
        />
        <Heart
          size={15}
          className={`hidden sm:block transition-colors duration-300 ${isFavorited ? "fill-[#90060C] text-[#90060C]" : "text-[#2D2926]"}`}
        />
      </button>
    </div>
  );
}
