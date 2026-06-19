"use client";

import { useState } from 'react';
import Image from 'next/image';

const mockProducts = [
  { id: 1, name: "Royal Heritage Necklace", category: "Gold", karat: "22K" },
  { id: 2, name: "Bridal Diamond Ring", category: "Bridal", karat: "PT950" },
  { id: 3, name: "Emerald Halo Studs", category: "Heirloom", karat: "18K" },
  { id: 4, name: "Royal Ruby Bangle", category: "Heirloom", karat: "22K" },
  { id: 5, name: "Classic Platinum Chain", category: "Contemporary", karat: "PT950" },
  { id: 6, name: "Premium Pearl Set", category: "Contemporary", karat: "18K" },
];

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
        tmp[i - 1][j] + 1, // deletion
        tmp[i][j - 1] + 1, // insertion
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // substitution
      );
    }
  }
  return tmp[a.length][b.length];
};

const isFuzzyMatch = (productName, searchQuery) => {
  const cleanName = productName.toLowerCase();
  const cleanQuery = searchQuery.trim().toLowerCase();
  
  if (!cleanQuery) return true;
  
  // 1. Direct match check
  if (cleanName.includes(cleanQuery)) return true;
  
  // 2. Split query and product name into words
  const queryWords = cleanQuery.split(/\s+/);
  const nameWords = cleanName.split(/\s+/);
  
  // For each query word, find if there is a highly similar word in the product name
  return queryWords.every(qWord => {
    // Direct substring check for this word
    if (nameWords.some(nWord => nWord.includes(qWord) || qWord.includes(nWord))) return true;
    
    // Levenshtein distance check (allow 1 error for short words <= 5 chars, and 2 errors for longer words)
    const threshold = qWord.length <= 5 ? 1 : 2;
    
    return nameWords.some(nWord => {
      const distance = getLevenshteinDistance(qWord, nWord);
      return distance <= threshold;
    });
  });
};

export default function collection() {
  const [activeFilters, setActiveFilters] = useState([]);
  const [search, setSearch] = useState("");

  const categories = ["Gold", "Bridal", "Heirloom", "Contemporary"];

  // Filter Logic
  const toggleFilter = (cat) => {
    setActiveFilters(prev => 
      prev.includes(cat) ? prev.filter(f => f !== cat) : [...prev, cat]
    );
  };

  // Filtered Display Logic
  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = activeFilters.length === 0 || activeFilters.includes(product.category);
    const matchesSearch = isFuzzyMatch(product.name, search);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2926]">
      <div className="max-w-[1400px] mx-auto px-8 py-16">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-[#90060C] mb-8">Our Collection</h1>
          <input 
            type="text"
            placeholder="Search our heritage pieces..."
            className="w-full max-w-xl bg-transparent border-b-2 border-[#DED5C4] py-3 focus:outline-none focus:border-[#90060C] transition-colors text-[#2D2926]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-16">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => toggleFilter(cat)}
              className={`px-8 py-3 border transition-all duration-300 ${
                activeFilters.includes(cat) 
                  ? "bg-[#90060C] text-white border-[#90060C]" 
                  : "bg-transparent border-[#DED5C4] hover:border-[#90060C] text-[#2D2926]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] w-full mb-6 border border-[#EBE3D5] group-hover:border-[#90060C] transition-colors overflow-hidden rounded-xl bg-[#F5EFE6]">
                  <Image 
                    src={`/product-${product.id}.jpg`} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <h3 className="text-lg font-serif mb-1">{product.name}</h3>
                <p className="text-sm tracking-widest text-[#A8A196]">
                  {product.category.toUpperCase()} · {product.karat}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-[#A8A196] font-serif">No pieces found matching your selection.</p>
          )}
        </div>
        
      </div>
    </div>
  );
}