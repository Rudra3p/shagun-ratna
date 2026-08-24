"use client";

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import userApi from '@/lib/userApi';
import ProductCard, { FAVORITES_STORAGE_KEY } from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import { usePersistedState } from '@/hooks/usePersistedState';
import { useSurvey } from '@/components/SurveyProvider';
import { Loader2, Search, SearchX, X, SlidersHorizontal } from 'lucide-react';

// Shared crossfade so skeleton -> content/error/empty swaps never hard-cut
const fadeProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.35, ease: 'easeOut' },
};

const CATEGORIES = [
  "Gold", "Silver", "Platinum", "Diamond", "Gemstone",
  "Ruby", "Emerald", "Sapphire",
  "Bridal", "Heirloom", "Contemporary", "Traditional",
  "Rings", "Necklaces", "Earrings", "Bangles", "Bracelets", "Pendants"
];

// Cards fetched per auto-loaded batch as the reader scrolls.
const PAGE_SIZE = 10;

export default function Collection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = usePersistedState(FAVORITES_STORAGE_KEY, {});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const { survey } = useSurvey();

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
    setError(null);

    try {
      // Search and category filters run through the same paginated endpoint as the
      // full catalog, so scrolling keeps pulling results in every mode (previously
      // filtered views were capped at the first page and could never load more).
      const query = currentSearch.trim() !== ""
        ? currentSearch.trim()
        : currentCategories.length > 0
          ? currentCategories.join(' ')
          : "";

      const endpoint = query !== ""
        ? `/products?search=${encodeURIComponent(query)}&page=${pageNumber}&limit=${PAGE_SIZE}`
        : `/products?page=${pageNumber}&limit=${PAGE_SIZE}`;

      const res = await userApi.get(endpoint);
      const incomingItems = res.data.products || [];

      setProducts(prev => {
        if (pageNumber === 1) return incomingItems;
        // Guard against a page overlapping with what's already on screen — duplicate
        // _ids would collide as React keys.
        const seen = new Set(prev.map((p) => p._id));
        return [...prev, ...incomingItems.filter((p) => !seen.has(p._id))];
      });
      setHasMore(incomingItems.length === PAGE_SIZE);
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

  const loadRecommendations = async (currentSurvey) => {
    // Nothing to personalise from until the visitor has filled in the survey.
    if (!currentSurvey?.age || !currentSurvey?.gender) {
      setRecommendedProducts([]);
      return;
    }
    try {
      const res = await userApi.get(
        `/recommendations?age=${encodeURIComponent(currentSurvey.age)}&gender=${encodeURIComponent(currentSurvey.gender)}`
      );
      setRecommendedProducts(res.data.recommended ? (res.data.products || []) : []);
    } catch (err) {
      // A failure here only costs the "Recommended" badges — the catalog still renders
      console.error("Failed to load recommendations:", err);
    }
  };

  useEffect(() => {
    loadCollectionItems(1, "", []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-runs whenever the survey is filled in, updated, or cleared, so the
  // "Recommended" badges track the visitor's answers without a page reload.
  useEffect(() => {
    loadRecommendations(survey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [survey?.age, survey?.gender]);

  // --- Infinite scroll -----------------------------------------------------
  // An invisible sentinel sits below the grid; when it comes near the viewport
  // the next page loads on its own, so there's no "Load More" button to press.
  const sentinelRef = useRef(null);
  const loadMoreRef = useRef(() => {});

  // Kept fresh on every render so the observer callback below always sees the
  // current page/filter state without having to be torn down and rebuilt.
  useEffect(() => {
    loadMoreRef.current = () => {
      if (loading || loadingMore || !hasMore || error) return;
      loadCollectionItems(page + 1, appliedSearch, selectedCategories);
    };
  });

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreRef.current();
      },
      // Fire well before the sentinel is actually on screen so the next row is
      // already in place by the time the reader gets there.
      { rootMargin: '600px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // Re-observing after each batch re-fires the callback if the sentinel is still
    // in view (a short page), which keeps filling until the viewport is covered —
    // IntersectionObserver only reports transitions, so a static sentinel would stall.
  }, [products.length, hasMore]);

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
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Recommended pieces stay right where they'd normally sort in the catalog —
  // just flagged with a badge on the card — instead of being pulled into a
  // separate section or reordered to the front.
  const recommendedIds = new Set(recommendedProducts.map((p) => p._id));

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
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" {...fadeProps} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} showCategoryLine />
              ))}
            </motion.div>
          ) : error && products.length === 0 ? (
            // Only takes over the page when there's nothing to show. A failure partway
            // through scrolling keeps the loaded pieces on screen and offers a retry
            // down by the sentinel instead of blanking the grid.
            <motion.div key="error" {...fadeProps} className="text-center py-16 bg-[#90060C]/5 border border-[#90060C]/20 rounded-2xl max-w-xl mx-auto text-[#90060C] font-serif">
              {error}
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div key="empty" {...fadeProps} className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-[#EBE3D5] rounded-2xl">
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
            </motion.div>
          ) : (
            <motion.div key="content" {...fadeProps} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10">
              {products.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isFavorited={!!favorites[product._id]}
                  onToggleFavorite={toggleFavorite}
                  isRecommended={recommendedIds.has(product._id)}
                  priority={index < 4}
                />
              ))}

            </motion.div>
          )}
        </AnimatePresence>

        {/* Infinite-scroll sentinel — kept mounted (not inside the AnimatePresence
            branches) so the observer has a stable node to watch from first paint. */}
        <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

        {!loading && products.length > 0 && (
          <div className="mt-16 flex justify-center" aria-live="polite">
            {error ? (
              // Auto-loading stops on failure (so it can't spin in a retry loop) —
              // this is the one case that still needs a tap to continue.
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="font-sans text-xs text-[#90060C]">{error}</p>
                <button
                  onClick={() => loadCollectionItems(page + 1, appliedSearch, selectedCategories)}
                  className="px-8 py-3 border border-[#90060C] text-[#90060C] hover:bg-[#90060C] hover:text-white font-sans text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : loadingMore ? (
              <span className="inline-flex items-center gap-2.5 font-sans text-xs uppercase tracking-[0.2em] text-[#90060C]">
                <Loader2 size={14} className="animate-spin" />
                Unveiling more masterpieces…
              </span>
            ) : hasMore ? null : (
              <span className="inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.25em] text-[#A8A196]">
                <span className="h-px w-8 bg-[#D9CFBB]" />
                You&rsquo;ve seen the full collection
                <span className="h-px w-8 bg-[#D9CFBB]" />
              </span>
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