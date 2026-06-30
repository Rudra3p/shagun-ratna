"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import userApi from '@/lib/userApi'; 
import { Loader2, Search, SlidersHorizontal, Heart, Sparkles } from 'lucide-react';

export default function Collection() {
  const [products, setProducts] = useState([]);
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

  // 👤 User Profile: Replace this with your actual Auth hook/data
  const [userProfile] = useState({
    name: "Rudra",
    gender: "male", 
    age: 24,
  });

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
  }, []);

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
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2926] antialiased">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-32 pb-24">
        
        {/* Top Controls Bar */}
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
        </div>

        {/* Product Grid Area */}
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => {
              const hasDiscount = product.offerPrice > 0 && product.offerPrice !== product.price;
              const isFavorited = !!favorites[product._id];
              
              return (
                <div key={product._id} className="group cursor-pointer flex flex-col bg-transparent border-none p-0">
                  <div className="relative aspect-[4/5] w-full mb-3.5 overflow-hidden rounded-xl bg-[#F5EFE6] border border-[#EBE3D5]/20">
                    <Image 
                      src={product.imageUrl || "/placeholder-jewelry.jpg"} 
                      alt={product.productName}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(product._id, e)}
                      className="absolute top-3 right-3 p-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#EBE3D5]/20 text-[#2D2926] hover:text-[#90060C] transition-all duration-300 shadow-sm z-10 active:scale-90"
                    >
                      <Heart size={16} className={isFavorited ? "fill-[#90060C] text-[#90060C]" : "text-[#2D2926]"} />
                    </button>
                  </div>
                  
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
            
            {hasMore && (
              <div className="col-span-full mt-20 text-center">
                <button 
                  disabled={loadingMore} 
                  onClick={() => loadCollectionItems(page + 1, appliedSearch, selectedCategory)}
                  className="px-10 py-4 border border-[#90060C] text-[#90060C] bg-transparent hover:bg-[#90060C] hover:text-white font-medium transition-all duration-300 font-sans text-xs uppercase tracking-[0.2em] rounded-full inline-flex items-center gap-2.5 shadow-md"
                >
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