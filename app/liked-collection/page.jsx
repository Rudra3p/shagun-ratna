"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import userApi from '@/lib/userApi';
import ProductCard, { FAVORITES_STORAGE_KEY } from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import { usePersistedState } from '@/hooks/usePersistedState';
import { HeartOff } from 'lucide-react';

// Shared crossfade so skeleton -> content/error/empty swaps never hard-cut
const fadeProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.35, ease: 'easeOut' },
};

export default function LikedCollection() {
  const [favorites, setFavorites] = usePersistedState(FAVORITES_STORAGE_KEY, {});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const likedIds = Object.keys(favorites).filter((id) => favorites[id]);
    if (likedIds.length === 0) {
      setLoading(false);
      return;
    }

    Promise.all(
      likedIds.map((id) =>
        userApi.get(`/products/${id}`).then((res) => res.data.product).catch(() => null)
      )
    )
      .then((results) => setProducts(results.filter(Boolean)))
      .catch(() => setError("Unable to load your liked pieces."))
      .finally(() => setLoading(false));
    // Intentionally runs once on mount, using whatever favorites were persisted —
    // toggling a card off below removes it from view directly, no need to refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every card shown here is already liked, so toggling always removes it from view.
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: false }));
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2926] antialiased">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-28 pb-24">
        <div className="mb-10">
          <h1 className="font-brand text-3xl sm:text-4xl text-[#1a1a1a] mb-2">Your Liked Collection</h1>
          <p className="text-sm text-[#9C8253] font-sans">
            {products.length > 0
              ? `${products.length} piece${products.length === 1 ? '' : 's'} you've saved for later`
              : "Pieces you save from the collection will appear here"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" {...fadeProps} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div key="error" {...fadeProps} className="text-center py-16 bg-[#90060C]/5 border border-[#90060C]/20 rounded-2xl max-w-xl mx-auto text-[#90060C] font-serif">
              {error}
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div key="empty" {...fadeProps} className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-[#EBE3D5] rounded-2xl">
              <div className="w-14 h-14 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#A8A196] mb-4">
                <HeartOff size={24} />
              </div>
              <p className="font-serif text-lg text-[#1a1a1a]">Nothing saved just yet</p>
              <p className="text-sm text-[#A8A196] mt-1.5 max-w-xs font-sans">
                Tap the heart on any piece in the collection to save it here.
              </p>
              <Link
                href="/collection"
                className="mt-6 px-8 py-3 border border-[#90060C] text-[#90060C] bg-transparent hover:bg-[#90060C] hover:text-white font-medium transition-all duration-300 font-sans text-xs uppercase tracking-[0.2em] rounded-full"
              >
                Browse the Collection
              </Link>
            </motion.div>
          ) : (
            <motion.div key="content" {...fadeProps} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {products.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isFavorited={!!favorites[product._id]}
                  onToggleFavorite={toggleFavorite}
                  priority={index < 4}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
