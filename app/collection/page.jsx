"use client";

import { useState } from 'react';

const mockProducts = [
  { id: 1, name: "Royal Heritage Necklace", category: "Gold", karat: "22K" },
  { id: 2, name: "Classic Silver Bangle", category: "Silver", karat: "925" },
  { id: 3, name: "Bridal Platinum Ring", category: "Bridal", karat: "PT950" },
  { id: 4, name: "Modern Chain", category: "Chains", karat: "18K" },
  { id: 5, name: "Antique Gold Earring", category: "Gold", karat: "22K" },
];

export default function collection() {
  const [activeFilters, setActiveFilters] = useState([]);
  const [search, setSearch] = useState("");

  const categories = ["Gold", "Silver", "Platinum", "Heirloom", "Bridal", "Contemporary"];

  // Filter Logic
  const toggleFilter = (cat) => {
    setActiveFilters(prev => 
      prev.includes(cat) ? prev.filter(f => f !== cat) : [...prev, cat]
    );
  };

  // Filtered Display Logic
  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = activeFilters.length === 0 || activeFilters.includes(product.category);
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
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
                <div className="aspect-[3/4] bg-[#F5EFE6] mb-6 border border-[#EBE3D5] group-hover:border-[#90060C] transition-colors">
                  {/* Product Image Space */}
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