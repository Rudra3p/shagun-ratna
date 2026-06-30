"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import userApi from '@/lib/api'; // Swapped to your dedicated client instance running on base '/api/user'
import { Loader2 } from 'lucide-react';

const getLevenshteinDistance = (a, b) => {
  const tmp = [];
  let i, j;
  for (i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (i = 1; i <= a.length; i++) {
    for (j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[a.length][b.length];
};

const isFuzzyMatch = (productName, searchQuery) => {
  if (!productName) return false;
  const cleanName = productName.toLowerCase();
  const cleanQuery = searchQuery.trim().toLowerCase();
  
  if (!cleanQuery) return true;
  if (cleanName.includes(cleanQuery)) return true;
  
  const queryWords = cleanQuery.split(/\s+/);
  const nameWords = cleanName.split(/\s+/);
  
  return queryWords.every(qWord => {
    if (nameWords.some(nWord => nWord.includes(qWord) || qWord.includes(nWord))) return true;
    const threshold = qWord.length <= 5 ? 1 : 2;
    return nameWords.some(nWord => {
      const distance = getLevenshteinDistance(qWord, nWord);
      return distance <= threshold;
    });
  });
};

export default function Collection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [activeFilters, setActiveFilters] = useState([]);
  const [search, setSearch] = useState("");

  const categories = ["Gold", "Bridal", "Heirloom", "Contemporary"];

  // Core Data Fetcher optimized for the /api/user/products routing layout
  const loadCollectionItems = async (pageNumber = 1, currentSearchQuery = "") => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      // 🧠 If a search query is active, request via search query logic, otherwise request page limits
      let endpoint = `/products?page=${pageNumber}&limit=12`;
      if (currentSearchQuery.trim() !== "") {
        endpoint = `/products?search=${encodeURIComponent(currentSearchQuery)}`;
      }

      const res = await userApi.get(endpoint);
      const incomingItems = res.data.products || [];

      // Completely replace results if reading page 1, otherwise append rows for continuous scroll
      setProducts(prev => (pageNumber === 1 ? incomingItems : [...prev, ...incomingItems]));
      
      // If we are searching, server side typically yields all matches without fixed pagination boundaries
      setHasMore(currentSearchQuery.trim() !== "" ? false : incomingItems.length === 12);
      setPage(pageNumber);
    } catch (err) {
      console.error("Database connection failure:", err);
      // Fail silently on 401 interceptors so guests aren't thrown alert errors
      if (err.response?.status !== 401) {
        setError("Unable to sync with our heritage database vault.");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Run catalog baseline build on component mount
  useEffect(() => {
    loadCollectionItems(1, "");
  }, []);

  // Listen for text input modifications to immediately reset the window matrix if input clears out
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (val.trim() === "") {
      loadCollectionItems(1, "");
    }
  };

  // Explicit form submission helper to run backend searches on Enter key trigger
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCollectionItems(1, search);
  };

  const toggleFilter = (cat) => {
    setActiveFilters(prev => 
      prev.includes(cat) ? prev.filter(f => f !== cat) : [...prev, cat]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeFilters.length === 0 || activeFilters.includes(product.category);
    const matchesSearch = isFuzzyMatch(product.productName, search);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2926]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 pt-36 pb-16">
        
        {/* Header Search Bar form container */}
        <div className="mb-10 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-serif text-[#90060C] mb-6 md:mb-8 uppercase tracking-wide">Our Collection</h1>
          <form onSubmit={handleSearchSubmit}>
            <input 
              type="text"
              placeholder="Search our heritage pieces and press enter..."
              className="w-full max-w-xl bg-transparent border-b-2 border-[#DED5C4] py-3 focus:outline-none focus:border-[#90060C] transition-colors text-[#2D2926] text-sm md:text-base rounded-none"
              value={search}
              onChange={handleSearchChange}
            />
          </form>
        </div>

        {/* Filter Swiper */}
        <div className="w-full overflow-x-auto no-scrollbar mb-12 md:mb-16 -mx-6 px-6 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-3 md:gap-4 min-w-max pb-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => toggleFilter(cat)}
                className={`px-6 py-2.5 md:px-8 md:py-3 border text-xs md:text-sm tracking-wider uppercase transition-all duration-300 rounded-none whitespace-nowrap ${
                  activeFilters.includes(cat) 
                    ? "bg-[#90060C] text-white border-[#90060C]" 
                    : "bg-transparent border-[#DED5C4] hover:border-[#90060C] text-[#2D2926]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display Rendering Pipeline */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col">
                <div className="aspect-[3/4] w-full bg-[#EBE3D5]/40 rounded-xl mb-4" />
                <div className="h-4 bg-[#EBE3D5]/40 w-3/4 rounded mb-2" />
                <div className="h-3 bg-[#EBE3D5]/40 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-[#90060C] font-serif">{error}</div>
        ) : (
          <>
            {/* Real Assets Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product._id} className="group cursor-pointer flex flex-col">
                    {/* Image Card Container */}
                    <div className="relative aspect-[3/4] w-full mb-4 md:mb-6 border border-[#EBE3D5] group-hover:border-[#90060C] transition-colors overflow-hidden rounded-xl bg-[#F5EFE6]">
                      <Image 
                        src={product.imageUrl || "/placeholder-jewelry.jpg"} 
                        alt={product.productName || "Shagun Ratna Masterpiece"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                    {/* Description Details Block */}
                    <h3 className="text-base md:text-lg font-serif mb-1 text-[#1a1a1a] group-hover:text-[#90060C] transition-colors duration-300">
                      {product.productName}
                    </h3>
                    
                    {/* Dynamic Pricing Module */}
                    <div className="flex items-center gap-2 mt-0.5 mb-1">
                      {product.offerPrice > 0 && product.offerPrice !== product.price ? (
                        <>
                          <span className="text-xs text-gray-400 line-through">${parseFloat(product.price).toFixed(2)}</span>
                          <span className="text-sm font-sans font-semibold text-[#90060C]">${parseFloat(product.offerPrice).toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-sm font-sans font-semibold text-[#1a1a1a]">
                          {product.price ? `$${parseFloat(product.price).toFixed(2)}` : 'Price on Request'}
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] tracking-widest text-[#A8A196] uppercase font-bold">
                      {product.category || 'General'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-[#A8A196] font-serif py-8 text-center sm:text-left">No pieces found matching your selection.</p>
              )}
            </div>

            {/* Pagination Controls */}
            {hasMore && (
              <div className="mt-16 text-center">
                <button 
                  disabled={loadingMore} 
                  onClick={() => loadCollectionItems(page + 1, search)}
                  className="px-8 py-3.5 border border-[#90060C] text-[#90060C] bg-transparent hover:bg-[#90060C] hover:text-[#faf3e5] disabled:bg-gray-100 disabled:text-gray-400 transition-all font-sans text-xs uppercase tracking-widest rounded-full inline-flex items-center gap-2"
                >
                  {loadingMore && <Loader2 size={14} className="animate-spin" />}
                  {loadingMore ? 'Syncing Vault...' : 'Load More Masterpieces'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}