"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import userApi from '@/lib/userApi';
import { Loader2, Search, SlidersHorizontal, Heart, SearchX, X, Gem } from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'shagun_ratna_favorites';

export default function Collection() {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState({});

  const [typedSearch, setTypedSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = ["Gold", "Bridal", "Heirloom", "Contemporary"];
  const hasActiveFilter = appliedSearch.trim() !== "" || selectedCategory !== "";

  const loadCollectionItems = async (pageNumber = 1, currentSearch = "", currentCat = "") => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      let endpoint = `/products?page=${pageNumber}&limit=10`;
      if (currentSearch.trim() !== "") {
        endpoint = `/products?search=${encodeURIComponent(currentSearch.trim())}`;
      } else if (currentCat !== "") {
        endpoint = `/products?search=${encodeURIComponent(currentCat)}`;
      }

      const res = await userApi.get(endpoint);
      const incomingItems = res.data.products || [];

      setProducts(prev => (pageNumber === 1 ? incomingItems : [...prev, ...incomingItems]));
      setTotalCount(res.data.total || 0);
      setHasMore(currentSearch.trim() !== "" || currentCat !== "" ? false : incomingItems.length === 10);
      setPage(pageNumber);
    } catch (err) {
      console.error("Database connection failure:", err);
      if (err.response?.status !== 401) {
        setError("Unable to sync with our heritage database vault.");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadCollectionItems(1, "", "");

    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // localStorage unavailable (e.g. private browsing) — favorites just won't persist
    }
  }, []);

  const handleClearFilters = () => {
    setTypedSearch("");
    setAppliedSearch("");
    setSelectedCategory("");
    loadCollectionItems(1, "", "");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSelectedCategory(""); 
    setAppliedSearch(typedSearch);
    loadCollectionItems(1, typedSearch, "");
  };

  const handleCategoryClick = (cat) => {
    const nextCategory = selectedCategory === cat ? "" : cat; 
    setSelectedCategory(nextCategory);
    setTypedSearch(""); 
    setAppliedSearch("");
    loadCollectionItems(1, "", nextCategory);
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
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

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2926] antialiased">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-32 pb-24">

        {/* Page Heading */}
        <div className="mb-10 md:mb-14 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
            <span className="text-[#90060C] font-bold tracking-[0.4em] uppercase text-[10px]">
              Shagun Ratna
            </span>
            <div className="h-[1px] w-8 bg-[#C5A059]" />
          </div>
          <h1 className="font-brand text-4xl sm:text-5xl text-[#1a1a1a] font-light uppercase tracking-tight">
            The Collection
          </h1>
          <p className="font-sans text-sm text-[#A8A196] mt-3 max-w-md mx-auto md:mx-0">
            Timeless gold, gemstones, and heirloom craftsmanship, curated for every story.
          </p>
        </div>

        {/* Top Controls Bar: Search & Filter Categories */}
        <div className="flex flex-col gap-6 md:gap-8 border-b border-[#EBE3D5]/60 pb-8 mb-10">
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full max-w-2xl gap-3">
            <div className="relative flex-grow group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A196]" size={18} />
              <input 
                type="text"
                placeholder="Search our heritage masterworks..."
                className="w-full bg-white border border-[#EBE3D5] focus:border-[#90060C] pl-12 pr-4 py-4 rounded-full text-[#2D2926] placeholder-[#A8A196] text-sm md:text-base outline-none transition-colors duration-300 shadow-sm"
                value={typedSearch}
                onChange={(e) => setTypedSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-[#90060C] hover:bg-[#730509] text-white text-sm font-medium tracking-wider uppercase px-7 py-4 rounded-full transition-colors duration-300 shadow-md cursor-pointer whitespace-nowrap"
            >
              Search
            </button>
          </form>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#A8A196]">
              <SlidersHorizontal size={12} /> Curate By Category
            </div>
            <div className="w-full overflow-x-auto no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
              <div className="flex items-center gap-2.5 min-w-max pb-1">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-6 py-2.5 border text-xs tracking-wider uppercase font-medium transition-all duration-300 rounded-full cursor-pointer ${
                      selectedCategory === cat 
                        ? "bg-[#90060C] text-white border-[#90060C] shadow-sm shadow-[#90060C]/20" 
                        : "bg-white border-[#EBE3D5] hover:border-[#90060C] text-[#2D2926] hover:bg-[#FDFBF7]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {!loading && (
            <div className="flex items-center justify-between gap-4 text-xs text-[#A8A196] font-sans">
              <span>
                {hasActiveFilter
                  ? `${products.length} result${products.length === 1 ? '' : 's'}${appliedSearch ? ` for “${appliedSearch}”` : ''}`
                  : totalCount > 0
                    ? `${totalCount} piece${totalCount === 1 ? '' : 's'} in the collection`
                    : null}
              </span>
              {hasActiveFilter && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1.5 text-[#90060C] hover:text-[#730509] font-medium uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <X size={12} /> Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product Grid Layout */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
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
              <SearchX size={24} />
            </div>
            <p className="font-serif text-lg text-[#1a1a1a]">
              {appliedSearch ? `No pieces match “${appliedSearch}”` : 'No pieces in this category yet'}
            </p>
            <p className="text-sm text-[#A8A196] mt-1.5 max-w-xs font-sans">
              Try a different search term or browse the full collection.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-6 px-8 py-3 border border-[#90060C] text-[#90060C] bg-transparent hover:bg-[#90060C] hover:text-white font-medium transition-all duration-300 font-sans text-xs uppercase tracking-[0.2em] rounded-full cursor-pointer"
            >
              View Full Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => {
              const hasDiscount = product.offerPrice > 0 && product.offerPrice !== product.price;
              const isFavorited = !!favorites[product._id];

              return (
                <div key={product._id} className="group flex flex-col bg-transparent border-none p-0">
                  {/* Image Frame (Ratio 4:5, Transparent Borderless Grid Frame) */}
                  <div className="relative aspect-[4/5] w-full mb-3.5 overflow-hidden rounded-xl bg-[#F5EFE6] border border-[#EBE3D5]/20 shadow-sm group-hover:shadow-[0_18px_36px_rgba(0,0,0,0.08)] transition-shadow duration-500">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.productName}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#C9BFA8]">
                        <Gem size={28} strokeWidth={1.25} />
                        <span className="font-sans text-[10px] font-semibold uppercase tracking-widest">Image Coming Soon</span>
                      </div>
                    )}

                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#90060C] font-sans text-[10px] font-bold tracking-widest uppercase shadow-sm">
                          {product.discount}% Off
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(product._id, e)}
                      className="absolute top-3 right-3 p-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#EBE3D5]/20 text-[#2D2926] hover:text-[#90060C] transition-all duration-300 shadow-sm z-10 active:scale-90"
                    >
                      <Heart size={16} className={isFavorited ? "fill-[#90060C] text-[#90060C]" : "text-[#2D2926]"} />
                    </button>
                  </div>

                  {/* Clean Product Typography stack info panel */}
                  <div className="flex flex-col flex-grow px-1 pb-1">
                    <h3 className="text-base font-serif font-medium text-[#1a1a1a] group-hover:text-[#90060C] transition-colors duration-300 line-clamp-1 mb-0.5">
                      {product.productName}
                    </h3>
                    <p className="text-[11px] font-sans font-medium tracking-wide text-[#A8A196] mb-2">
                      {product.purity || "22K Pure Gold"} • {product.category || "Fine Jewelry"}
                    </p>
                    <div className="flex items-baseline gap-2 mt-auto">
                      {hasDiscount ? (
                        <>
                          <span className="text-sm font-sans font-bold text-[#90060C]">
                            ${parseFloat(product.offerPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs text-[#A8A196] font-medium line-through">
                            ${parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-sans font-bold text-[#2D2926]">
                          {product.price ? `$${parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'Price on Request'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Load More Button Trigger Pagination system */}
            {hasMore && (
              <div className="col-span-full mt-20 text-center">
                <button 
                  disabled={loadingMore} 
                  onClick={() => loadCollectionItems(page + 1, appliedSearch, selectedCategory)}
                  className="px-10 py-4 border border-[#90060C] text-[#90060C] bg-transparent hover:bg-[#90060C] hover:text-white font-medium transition-all duration-300 font-sans text-xs uppercase tracking-[0.2em] rounded-full inline-flex items-center gap-2.5 shadow-md cursor-pointer"
                >
                  {loadingMore && <Loader2 size={14} className="animate-spin mr-2" />}
                  {loadingMore ? 'Syncing Vault...' : 'Load More Masterpieces'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}