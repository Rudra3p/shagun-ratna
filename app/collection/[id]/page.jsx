"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import userApi from '@/lib/userApi';
import Badge from '@/components/Badge';
import ProductDetailSkeleton from '@/components/skeletons/ProductDetailSkeleton';
import { ArrowLeft, Heart, Gem, AlertCircle } from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'shagun_ratna_favorites';

// Real, admin-set expiry only — mirrors the countdown shown on the collection grid.
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

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    userApi.get(`/products/${id}`)
      .then((res) => {
        if (!cancelled) setProduct(res.data.product);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.status === 404 ? "This piece could not be found." : "Unable to load this piece.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // localStorage unavailable — favorites just won't persist
    }

    return () => { cancelled = true; };
  }, [id]);

  const toggleFavorite = () => {
    setFavorites(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable — favorites just won't persist
      }
      return next;
    });
  };

  const countdownLabel = useOfferCountdown(product?.offertime);
  const hasDiscount = !!product && product.offerPrice > 0 && product.offerPrice !== product.price;
  const savings = hasDiscount ? product.price - product.offerPrice : 0;
  const isFavorited = !!favorites[id];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2926] antialiased">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-28 pb-24">
        <Link
          href="/collection"
          className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-[#9C8253] hover:text-[#90060C] transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Collection
        </Link>

        {loading ? (
          <ProductDetailSkeleton />
        ) : error || !product ? (
          <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-[#EBE3D5] rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#A8A196] mb-4">
              <AlertCircle size={24} />
            </div>
            <p className="font-serif text-lg text-[#1a1a1a]">{error || "This piece could not be found."}</p>
            <Link
              href="/collection"
              className="mt-6 px-8 py-3 border border-[#90060C] text-[#90060C] bg-transparent hover:bg-[#90060C] hover:text-white font-medium transition-all duration-300 font-sans text-xs uppercase tracking-[0.2em] rounded-full"
            >
              View Full Collection
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Image */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#F5EFE6] to-[#EDE2CC] ring-1 ring-[#EBE3D5]/40 shadow-sm">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.productName}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#C9BFA8]">
                  <Gem size={40} strokeWidth={1.25} />
                  <span className="font-sans text-xs font-semibold uppercase tracking-widest text-center px-2">Image Coming Soon</span>
                </div>
              )}

              {(product.discount > 0 || countdownLabel) && (
                <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5">
                  {product.discount > 0 && <Badge variant="discount">{product.discount}% Off</Badge>}
                  {countdownLabel && <Badge variant="urgency">{countdownLabel}</Badge>}
                </div>
              )}

              <button
                type="button"
                onClick={toggleFavorite}
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/85 backdrop-blur-md ring-1 ring-black/[0.04] shadow-sm hover:bg-white hover:scale-110 active:scale-90 transition-all duration-300 cursor-pointer"
              >
                <Heart size={17} className={`transition-colors duration-300 ${isFavorited ? "fill-[#90060C] text-[#90060C]" : "text-[#2D2926]"}`} />
              </button>
            </div>

            {/* Details */}
            <div className="flex flex-col pt-2">
              <p className="text-[11px] font-sans font-semibold uppercase tracking-wide text-[#9C8253] mb-3">
                {[product.purity, product.category || "Fine Jewelry"].filter(Boolean).join(" • ")}
              </p>
              <h1 className="font-brand text-3xl sm:text-4xl text-[#1a1a1a] mb-5 leading-tight">
                {product.productName}
              </h1>
              <div className="h-px w-12 bg-[#C5A059]/50 mb-6" />

              <div className="flex items-baseline gap-3 flex-wrap">
                {hasDiscount ? (
                  <>
                    <span className="text-2xl sm:text-3xl font-sans font-bold text-[#90060C]">
                      ₹{parseFloat(product.offerPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-base text-[#A8A196] font-medium line-through">
                      ₹{parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl sm:text-3xl font-sans font-bold text-[#2D2926]">
                    {product.price ? `₹${parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'Price on Request'}
                  </span>
                )}
              </div>
              {hasDiscount && savings > 0 && (
                <span className="text-sm font-sans font-semibold text-[#9C8253] mt-2">
                  You save ₹{savings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              )}

              {product.description && (
                <p className="mt-6 text-sm leading-7 text-[#5f5a53] whitespace-pre-line">
                  {product.description}
                </p>
              )}

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/contact?product=${encodeURIComponent(product.productName)}`}
                  className="flex items-center justify-center px-8 py-3.5 bg-[#90060C] hover:bg-[#730509] text-white font-sans text-xs font-semibold uppercase tracking-[0.2em] rounded-full transition-colors duration-300 shadow-sm"
                >
                  Inquire About This Piece
                </Link>
                <button
                  type="button"
                  onClick={toggleFavorite}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 border border-[#EBE3D5] hover:border-[#90060C] text-[#2D2926] font-sans text-xs font-semibold uppercase tracking-[0.2em] rounded-full transition-colors duration-300 cursor-pointer"
                >
                  <Heart size={14} className={isFavorited ? "fill-[#90060C] text-[#90060C]" : ""} />
                  {isFavorited ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
