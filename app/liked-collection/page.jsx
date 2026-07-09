"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import userApi from '@/lib/userApi';
import ProductCard, { FAVORITES_STORAGE_KEY } from '@/components/ProductCard';
import { HeartOff } from 'lucide-react';

export default function LikedCollection() {
  const [favorites, setFavorites] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stored = {};
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (raw) stored = JSON.parse(raw);
    } catch {
      // localStorage unavailable — nothing to show
    }
    setFavorites(stored);

    const likedIds = Object.keys(stored).filter((id) => stored[id]);
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
  }, []);

  // Every card shown here is already liked, so toggling always removes it from view.
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = { ...prev, [id]: false };
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable — favorites just won't persist
      }
      return next;
    });
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

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col bg-transparent p-0">
                <div className="aspect-[4/5] w-full bg-[#EBE3D5]/30 rounded-xl mb-4" />
                <div className="h-4 bg-[#EBE3D5]/30 w-3/4 rounded-md mb-2.5 ml-1" />
                <div className="h-3 bg-[#EBE3D5]/30 w-1/3 rounded-md ml-1" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-[#90060C]/5 border border-[#90060C]/20 rounded-2xl max-w-xl mx-auto text-[#90060C] font-serif">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-[#EBE3D5] rounded-2xl">
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
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isFavorited={!!favorites[product._id]}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
