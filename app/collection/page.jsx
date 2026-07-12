"use client";

import { useState, useEffect, useRef } from 'react';
import userApi from '@/lib/userApi';
import ProductCard, { FAVORITES_STORAGE_KEY } from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import { Loader2, Search, SearchX, X, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  "Gold", "Silver", "Platinum", "Diamond", "Gemstone",
  "Bridal", "Heirloom", "Contemporary", "Traditional",
  "Rings", "Necklaces", "Earrings", "Bangles", "Bracelets", "Pendants"
];

export default function Collection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const [typedSearch, setTypedSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [toolbarHidden, setToolbarHidden] = useState(false);

  const hasActiveFilter = appliedSearch.trim() !== "" || selectedCategories.length > 0;

  const lastScrollY = useRef(0);

  // Hide the search/filter toolbar while scrolling down (gives the grid more room),
  // reveal it again on any upward scroll or near the top of the page.
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 140) {
        setToolbarHidden(false);
      } else if (currentY > lastScrollY.current + 4) {
        setToolbarHidden(true);
      } else if (currentY < lastScrollY.current - 4) {
        setToolbarHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const loadRecommendations = async () => {
    try {
      const res = await userApi.get('/recommendations');
      if (res.data.recommended) {
        setRecommendedProducts(res.data.products || []);
      }
    } catch (err) {
      // Guests and users without a matching collection simply get no recommendations
      console.error("Failed to load recommendations:", err);
    }
  };

  useEffect(() => {
    loadCollectionItems(1, "", []);
    loadRecommendations();

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

  // Recommended pieces are woven into the main grid (flagged with a badge on the
  // card) rather than shown as their own section — pinned to the front only on
  // the default, unfiltered browse view so a search/filter isn't reshuffled.
  const recommendedIds = new Set(recommendedProducts.map((p) => p._id));
  const displayProducts = hasActiveFilter || recommendedProducts.length === 0
    ? products
    : [...recommendedProducts, ...products.filter((p) => !recommendedIds.has(p._id))];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2926] antialiased">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-6 pb-24">

        {/* Sticky Search + Filter Toolbar — slides away on scroll-down, returns on scroll-up */}
        <div
          className={`sticky top-20 z-30 -mx-6 px-6 md:-mx-10 md:px-10 pt-2 pb-4 mb-6 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EBE3D5]/60 transition-transform duration-300 ease-out ${
            toolbarHidden ? '-translate-y-40 pointer-events-none' : 'translate-y-0'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="w-full sm:flex-1 sm:max-w-md">
              {/* Underline search field — a quiet base line, with a crimson accent that expands from center on focus */}
              <div className="group relative flex items-center gap-2.5 pb-2.5 sm:pb-3">
                <Search size={16} className="shrink-0 text-[#A8A196] group-focus-within:text-[#90060C] transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search the collection..."
                  className="flex-1 min-w-0 bg-transparent text-[#2D2926] placeholder-[#A8A196] text-sm outline-none"
                  value={typedSearch}
                  onChange={(e) => setTypedSearch(e.target.value)}
                />
                {typedSearch && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    aria-label="Clear search"
                    className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-[#A8A196] hover:text-[#2D2926] hover:bg-[#F5EFE6] transition-colors duration-200 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
                <button
                  type="submit"
                  aria-label="Search"
                  className="shrink-0 -mr-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-[#90060C] hover:bg-[#730509] text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-70"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                </button>

                {/* Base line, always visible */}
                <span className="absolute left-0 right-0 bottom-0 h-px bg-[#D9CFBB]" />
                {/* Accent line, expands from center to fill on focus */}
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#90060C] scale-x-0 group-focus-within:scale-x-100 origin-center transition-transform duration-300 ease-out" />
              </div>
            </form>

            <button
              onClick={() => setIsFilterOpen(true)}
              aria-label="Filters"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto sm:ml-auto px-5 py-2.5 sm:py-3 rounded-full border border-[#D9CFBB] bg-white hover:border-[#90060C] hover:bg-[#90060C] text-[#2D2926] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-[#90060C]/15 shrink-0 cursor-pointer"
            >
              <SlidersHorizontal size={15} className="transition-transform duration-300 group-hover:rotate-90" />
              <span>Filters</span>
              {selectedCategories.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#90060C] text-white group-hover:bg-white group-hover:text-[#90060C] text-[10px] font-bold flex items-center justify-center transition-colors duration-300">
                  {selectedCategories.length}
                </span>
              )}
            </button>
          </div>

          {!loading && hasActiveFilter && (
            <div className="flex items-center justify-between gap-4 flex-wrap text-xs text-[#A8A196] font-sans mt-3">
              <span>
                {products.length} result{products.length === 1 ? '' : 's'}
                {appliedSearch ? (
                  <> for <em className="font-brand not-italic text-[#2D2926] font-semibold">“{appliedSearch}”</em></>
                ) : selectedCategories.length > 0 ? (
                  ` in ${selectedCategories.join(', ')}`
                ) : null}
              </span>
              <button
                onClick={handleClearFilters}
                className="group flex items-center gap-1.5 text-[#90060C] hover:text-[#730509] font-medium uppercase tracking-wider transition-colors cursor-pointer"
              >
                <X size={12} /> <span className="border-b border-transparent group-hover:border-[#730509] transition-colors">Clear</span>
              </button>
            </div>
          )}
        </div>

        {/* Product Grid Layout */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} showCategoryLine />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-[#90060C]/5 border border-[#90060C]/20 rounded-2xl max-w-xl mx-auto text-[#90060C] font-serif">
            {error}
          </div>
        ) : displayProducts.length === 0 ? (
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
            {displayProducts.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                isFavorited={!!favorites[product._id]}
                onToggleFavorite={toggleFavorite}
                isRecommended={recommendedIds.has(product._id)}
                priority={index < 4}
              />
            ))}

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