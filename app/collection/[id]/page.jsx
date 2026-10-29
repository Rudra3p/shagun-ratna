"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import userApi from '@/lib/userApi';
import Badge from '@/components/Badge';
import ProductDetailSkeleton from '@/components/skeletons/ProductDetailSkeleton';
import { usePersistedState } from '@/hooks/usePersistedState';
import { formatCategory } from '@/lib/formatCategory';
import { ArrowLeft, Heart, Gem, AlertCircle, Phone, MessageSquare } from 'lucide-react';

const WhatsAppIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const InstagramIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FAVORITES_STORAGE_KEY = 'shagun_ratna_favorites';

// Shared crossfade so skeleton -> content/error swaps never hard-cut
const fadeProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.35, ease: 'easeOut' },
};

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
  const [favorites, setFavorites] = usePersistedState(FAVORITES_STORAGE_KEY, {});

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

    return () => { cancelled = true; };
  }, [id]);

  const toggleFavorite = () => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const countdownLabel = useOfferCountdown(product?.offertime);
  const hasValidPrice = typeof product?.price === 'number' && product.price > 0;
  const hasDiscount = hasValidPrice && product.offerPrice > 0 && product.offerPrice !== product.price;
  const savings = hasDiscount ? product.price - product.offerPrice : 0;
  const isFavorited = !!favorites[id];
  const productPriceStr = product?.price ? `₹${Number(product.offerPrice || product.price).toLocaleString('en-IN')}` : 'Price on request';
  const whatsappUrl = `https://wa.me/919558888754?text=${encodeURIComponent(
    `Namaste Shagun Ratna,\n\nI am interested in acquiring "${product?.productName}" (${productPriceStr}).\n\nPlease share design specifications, availability, and high-resolution visuals.\n\nProduct Link: ${typeof window !== 'undefined' ? window.location.href : ''}`
  )}`;
  const smsUrl = `sms:+919558888754?&body=${encodeURIComponent(
    `Namaste Shagun Ratna, I am interested in "${product?.productName}". Please share details.`
  )}`;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2926] antialiased">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-28 pb-24">
        <Link
          href="/collection"
          className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-[#9C8253] hover:text-[#90060C] transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Collection
        </Link>

        <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" {...fadeProps}>
            <ProductDetailSkeleton />
          </motion.div>
        ) : error || !product ? (
          <motion.div key="error" {...fadeProps} className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-[#EBE3D5] rounded-2xl">
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
          </motion.div>
        ) : (
          <motion.div key="content" {...fadeProps} className="grid md:grid-cols-2 gap-10 lg:gap-16">
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
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#7a6b52]">
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
                {[product.purity, formatCategory(product.category) || "Fine Jewelry"].filter(Boolean).join(" • ")}
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

              {/* Direct Inquiry Channels */}
              <div className="mt-8 pt-6 border-t border-[#EBE3D5] flex flex-col gap-3.5">
                <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#9C8253]">
                  Direct Boutique Inquiry
                </p>

                {/* Primary: Inquire on WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#075e54] hover:bg-[#128C7E] text-white font-sans text-xs font-semibold uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-[0_4px_16px_rgba(37,211,102,0.25)] hover:shadow-[0_6px_22px_rgba(37,211,102,0.35)] group"
                >
                  <WhatsAppIcon size={18} className="text-[#25D366] group-hover:scale-110 transition-transform" />
                  <span>Inquire on WhatsApp</span>
                </a>

                {/* Secondary Actions Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {/* Instagram DM */}
                  <a
                    href="https://ig.me/m/shagunratnagemsjewellers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-[#EBE3D5] hover:border-[#DD2A7B] text-[#2D2926] hover:text-[#DD2A7B] font-sans text-[11px] font-semibold uppercase tracking-wider rounded-xl transition-all bg-white/70"
                    title="DM on Instagram"
                  >
                    <InstagramIcon size={15} />
                    <span>Instagram</span>
                  </a>

                  {/* Direct Call */}
                  <a
                    href="tel:+919558888754"
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-[#EBE3D5] hover:border-[#90060C] text-[#2D2926] hover:text-[#90060C] font-sans text-[11px] font-semibold uppercase tracking-wider rounded-xl transition-all bg-white/70"
                    title="Call Boutique: +91 95588 88754"
                  >
                    <Phone size={14} />
                    <span>Call Concierge</span>
                  </a>

                  {/* Direct SMS */}
                  <a
                    href={smsUrl}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-[#EBE3D5] hover:border-[#C5A059] text-[#2D2926] hover:text-[#9C8253] font-sans text-[11px] font-semibold uppercase tracking-wider rounded-xl transition-all bg-white/70 col-span-2 sm:col-span-1"
                    title="Send SMS"
                  >
                    <MessageSquare size={14} />
                    <span>Send SMS</span>
                  </a>
                </div>

                {/* Form Link & Favorite */}
                <div className="flex items-center justify-between pt-2">
                  <Link
                    href={`/contact?product=${encodeURIComponent(product.productName)}`}
                    className="text-[11px] font-sans text-[#9C8253] hover:text-[#90060C] underline underline-offset-4 tracking-wider uppercase transition-colors"
                  >
                    Or submit inquiry form →
                  </Link>

                  <button
                    type="button"
                    onClick={toggleFavorite}
                    className="flex items-center gap-1.5 text-xs text-[#2D2926] hover:text-[#90060C] transition-colors cursor-pointer"
                  >
                    <Heart size={14} className={isFavorited ? "fill-[#90060C] text-[#90060C]" : ""} />
                    <span>{isFavorited ? "Saved in Favorites" : "Save Piece"}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
