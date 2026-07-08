"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import userApi from '@/lib/userApi';
import { Loader2, Search, Heart, SearchX, X, Gem, SlidersHorizontal } from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'shagun_ratna_favorites';

const CATEGORIES = [
  "Gold", "Silver", "Platinum", "Diamond", "Gemstone",
  "Bridal", "Heirloom", "Contemporary", "Traditional",
  "Rings", "Necklaces", "Earrings", "Bangles", "Bracelets", "Pendants"
];

export default function Collection() {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [typedSearch, setTypedSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const hasActiveFilter = appliedSearch.trim() !== "" || selectedCategories.length > 0;

  const loadCollectionItems = async (pageNumber = 1, currentSearch = "", currentCategories = []) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      let endpoint = `/products?page=${pageNumber}&limit=10`;
      if (currentSearch.trim() !== "") {
        endpoint = `/products?search=${encodeURIComponent(currentSearch.trim())}`;
      } else if (currentCategories.length > 0) {
        endpoint = `/products?search=${encodeURIComponent(currentCategories.join(' '))}`;
      }

      const res = await userApi.get(endpoint);
      const incomingItems = res.data.products || [];

      setProducts(prev => (pageNumber === 1 ? incomingItems : [...prev, ...incomingItems]));
      setTotalCount(res.data.total || 0);
      setHasMore(currentSearch.trim() !== "" || currentCategories.length > 0 ? false : incomingItems.length === 10);
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
    loadCollectionItems(1, "", []);

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
    setSelectedCategories([]);
    loadCollectionItems(1, "", []);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSelectedCategories([]);
    setAppliedSearch(typedSearch);
    loadCollectionItems(1, typedSearch, []);
  };

  const handleCategoryToggle = (cat) => {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(next);
    setTypedSearch("");
    setAppliedSearch("");
    loadCollectionItems(1, "", next);
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
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 pb-24">

        {/* Sticky Search + Filter Toolbar */}
        <div className="sticky top-20 z-20 -mx-6 px-6 md:-mx-10 md:px-10 pt-2 pb-4 mb-10 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EBE3D5]/60">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full sm:flex-1 sm:max-w-2xl gap-2 sm:gap-2.5">
              <div className="relative flex-grow group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A196]" size={16} />
                <input
                  type="text"
                  placeholder="Search the collection..."
                  className="w-full bg-white border border-[#EBE3D5] focus:border-[#90060C] pl-11 pr-4 py-3 sm:py-3.5 rounded-full text-[#2D2926] placeholder-[#A8A196] text-sm outline-none transition-colors duration-300 shadow-sm"
                  value={typedSearch}
                  onChange={(e) => setTypedSearch(e.target.value)}
                />
              </div>
              <button
                type="submit"
                aria-label="Search"
                className="flex items-center justify-center gap-1.5 bg-[#90060C] hover:bg-[#730509] text-white text-xs font-semibold tracking-wider uppercase px-3.5 sm:px-5 py-3 sm:py-3.5 rounded-full transition-colors duration-300 shadow-sm cursor-pointer whitespace-nowrap shrink-0"
              >
                <Search size={15} className="sm:hidden" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>

            <button
              onClick={() => setIsFilterOpen(true)}
              aria-label="Filters"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3.5 rounded-full border border-[#EBE3D5] bg-white hover:border-[#90060C] text-[#2D2926] text-xs font-semibold uppercase tracking-wider transition-colors duration-300 shadow-sm shrink-0 cursor-pointer"
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
              {selectedCategories.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#90060C] text-white text-[10px] font-bold flex items-center justify-center">
                  {selectedCategories.length}
                </span>
              )}
            </button>
          </div>

          {!loading && (hasActiveFilter || totalCount > 0) && (
            <div className="flex items-center justify-between gap-4 flex-wrap text-xs text-[#A8A196] font-sans mt-3">
              <span>
                {hasActiveFilter
                  ? `${products.length} result${products.length === 1 ? '' : 's'}${
                      appliedSearch
                        ? ` for “${appliedSearch}”`
                        : selectedCategories.length > 0
                          ? ` in ${selectedCategories.join(', ')}`
                          : ''
                    }`
                  : `${totalCount} piece${totalCount === 1 ? '' : 's'} in the collection`}
              </span>
              {hasActiveFilter && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1.5 text-[#90060C] hover:text-[#730509] font-medium uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <X size={12} /> Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product Grid Layout */}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {products.map((product) => {
              const hasDiscount = product.offerPrice > 0 && product.offerPrice !== product.price;
              const isFavorited = !!favorites[product._id];

              return (
                <div key={product._id} className="group flex flex-col bg-transparent border-none p-0">
                  {/* Image Frame (Ratio 4:5, Transparent Borderless Grid Frame) */}
                  <div className="relative aspect-[4/5] w-full mb-2.5 sm:mb-3.5 overflow-hidden rounded-xl bg-gradient-to-b from-[#F5EFE6] to-[#EDE2CC] ring-1 ring-[#EBE3D5]/40 group-hover:ring-[#C5A059]/50 shadow-sm group-hover:shadow-[0_18px_36px_rgba(0,0,0,0.1)] transition-all duration-500">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.productName}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#C9BFA8]">
                        <Gem size={28} strokeWidth={1.25} />
                        <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-center px-2">Image Coming Soon</span>
                      </div>
                    )}

                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                        <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/60 text-[#90060C] font-sans text-[9px] sm:text-[10px] font-bold tracking-widest uppercase shadow-sm">
                          {product.discount}% Off
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(product._id, e)}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-white/60 text-[#2D2926] hover:text-[#90060C] transition-all duration-300 shadow-sm z-10 active:scale-90"
                    >
                      <Heart size={14} className={`sm:hidden ${isFavorited ? "fill-[#90060C] text-[#90060C]" : "text-[#2D2926]"}`} />
                      <Heart size={16} className={`hidden sm:block ${isFavorited ? "fill-[#90060C] text-[#90060C]" : "text-[#2D2926]"}`} />
                    </button>
                  </div>

                  {/* Clean Product Typography stack info panel */}
                  <div className="flex flex-col flex-grow px-0.5 sm:px-1 pb-1">
                    <h3 className="text-sm sm:text-lg font-brand font-medium text-[#1a1a1a] group-hover:text-[#90060C] transition-colors duration-300 line-clamp-1 mb-1">
                      {product.productName}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-sans font-medium tracking-wide text-[#A8A196] mb-2 sm:mb-2.5 line-clamp-1">
                      {product.purity || "22K Pure Gold"} • {product.category || "Fine Jewelry"}
                    </p>
                    <div className="h-px w-6 bg-[#C5A059]/50 mb-2 sm:mb-2.5" />
                    <div className="flex items-baseline gap-1.5 sm:gap-2 mt-auto flex-wrap">
                      {hasDiscount ? (
                        <>
                          <span className="text-xs sm:text-sm font-sans font-bold text-[#90060C]">
                            ${parseFloat(product.offerPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[10px] sm:text-xs text-[#A8A196] font-medium line-through">
                            ${parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs sm:text-sm font-sans font-bold text-[#2D2926]">
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
                  onClick={() => loadCollectionItems(page + 1, appliedSearch, selectedCategories)}
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

      {/* Right-side Filter Drawer */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-end animate-in fade-in duration-200"
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FDFBF7] h-full w-full sm:max-w-sm border-l border-[#EBE3D5]/60 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBE3D5]/60">
              <div>
                <h3 className="font-serif text-lg text-[#1a1a1a]">Filter by Category</h3>
                <p className="text-[11px] text-[#A8A196] mt-0.5">Select as many as you like</p>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 rounded-full hover:bg-[#EBE3D5]/40 text-[#2D2926] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-wrap gap-2.5">
                {CATEGORIES.map((cat) => {
                  const active = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryToggle(cat)}
                      className={`px-5 py-2.5 border text-xs tracking-wider uppercase font-medium transition-all duration-300 rounded-full cursor-pointer ${
                        active
                          ? "bg-[#90060C] text-white border-[#90060C] shadow-sm shadow-[#90060C]/20"
                          : "bg-white border-[#EBE3D5] hover:border-[#90060C] text-[#2D2926] hover:bg-[#FDFBF7]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-5 border-t border-[#EBE3D5]/60 flex items-center gap-3">
              <button
                onClick={handleClearFilters}
                disabled={selectedCategories.length === 0}
                className="flex-1 px-5 py-3 border border-[#EBE3D5] text-[#2D2926] rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#EBE3D5]/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 px-5 py-3 bg-[#90060C] hover:bg-[#730509] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}