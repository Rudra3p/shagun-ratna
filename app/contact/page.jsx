"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageDivider from '@/components/PageDivider';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const mockProducts = [
  { id: 1, name: "Royal Heritage Necklace", category: "Gold", karat: "22K" },
  { id: 2, name: "Bridal Diamond Ring", category: "Bridal", karat: "PT950" },
  { id: 3, name: "Emerald Halo Studs", category: "Heirloom", karat: "18K" },
  { id: 4, name: "Royal Ruby Bangle", category: "Heirloom", karat: "22K" },
  { id: 5, name: "Classic Platinum Chain", category: "Contemporary", karat: "PT950" },
  { id: 6, name: "Premium Pearl Set", category: "Contemporary", karat: "18K" },
];

// Zodiac & birthstone calculator
const getGemstoneAndZodiac = (dobString) => {
  if (!dobString) return null;
  const date = new Date(dobString);
  const month = date.getMonth() + 1; // 1-indexed
  const day = date.getDate();

  let zodiac = "";
  let gemstone = "";
  let description = "";

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    zodiac = "Aries";
    gemstone = "Diamond";
    description = "Symbolizes strength, clarity, and eternal love. Amplifies energy and focus.";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    zodiac = "Taurus";
    gemstone = "Emerald";
    description = "The stone of wisdom, growth, and patience. Nurtures the heart and brings prosperity.";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    zodiac = "Gemini";
    gemstone = "Pearl";
    description = "Represents purity, balance, and wisdom. Calms the mind and enhances intuition.";
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    zodiac = "Cancer";
    gemstone = "Ruby";
    description = "Stone of passion, courage, and vitality. Ignites enthusiasm and protects the heart.";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    zodiac = "Leo";
    gemstone = "Peridot";
    description = "Brings light, joy, and spiritual protection. Instills confidence and attracts good fortune.";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    zodiac = "Virgo";
    gemstone = "Blue Sapphire";
    description = "Symbolizes loyalty, truth, and mental clarity. Brings inner peace and spiritual insight.";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    zodiac = "Libra";
    gemstone = "Opal";
    description = "Stone of inspiration, hope, and love. Enhances creativity and amplifies emotions.";
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    zodiac = "Scorpio";
    gemstone = "Topaz";
    description = "Brings healing, strength, and manifestation. Calms anger and promotes forgiveness.";
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    zodiac = "Sagittarius";
    gemstone = "Tanzanite";
    description = "Promotes spiritual growth, truth, and transformation. Stimulates intuition.";
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    zodiac = "Capricorn";
    gemstone = "Garnet";
    description = "Brings grounding energy, security, and vitality. Ignites passion and dedication.";
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    zodiac = "Aquarius";
    gemstone = "Amethyst";
    description = "A powerful meditative stone. Promotes spiritual wisdom, sobriety, and tranquility.";
  } else {
    zodiac = "Pisces";
    gemstone = "Aquamarine";
    description = "The stone of the sea. Calms fears, enhances communication, and brings eternal youth.";
  }

  return { zodiac, gemstone, description };
};

const isRecommended = (productName, gemstone) => {
  if (!gemstone) return false;
  const name = productName.toLowerCase();
  const gem = gemstone.toLowerCase();

  // Match exact name parts
  if (name.includes(gem)) return true;

  // Fallbacks
  if (gem === "diamond" && (name.includes("diamond") || name.includes("platinum"))) return true;
  if (gem === "ruby" && name.includes("ruby")) return true;
  if (gem === "pearl" && name.includes("pearl")) return true;

  // For other stones (e.g. Sapphire, Opal, Amethyst, Aquamarine), suggest high-value cosmic gold and emerald items
  if (["aquamarine", "amethyst", "opal", "topaz", "tanzanite", "garnet", "peridot", "blue sapphire"].includes(gem)) {
    return name.includes("heritage") || name.includes("emerald");
  }

  return false;
};

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

export default function MyCollectionPage() {
  const [user, setUser] = useState({ name: "", dob: "" });
  const [alignment, setAlignment] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [search, setSearch] = useState("");
  const [showOnlyRecommended, setShowOnlyRecommended] = useState(false);

  // Carousel slider refs
  const zodiacScrollRef = useRef(null);
  const newLaunchScrollRef = useRef(null);
  const mothersScrollRef = useRef(null);
  const lovableScrollRef = useRef(null);

  useEffect(() => {
    const name = localStorage.getItem("shagun_user_name") || "";
    const dob = localStorage.getItem("shagun_user_dob") || "";
    setUser({ name, dob });

    if (dob) {
      const align = getGemstoneAndZodiac(dob);
      setAlignment(align);
    }
  }, []);

  const categories = ["Gold", "Bridal", "Heirloom", "Contemporary"];

  const toggleFilter = (cat) => {
    setActiveFilters(prev => 
      prev.includes(cat) ? prev.filter(f => f !== cat) : [...prev, cat]
    );
  };

  const handleLogout = async () => {
    localStorage.removeItem("shagun_user_name");
    localStorage.removeItem("shagun_user_dob");
    try {
      await fetch('/api/user/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    window.location.href = '/';
  };

  const handleViewAllDestiny = (e) => {
    e.preventDefault();
    setShowOnlyRecommended(true);
    // Smooth scroll to the main grid
    const mainGrid = document.getElementById('destiny-grid-anchor');
    if (mainGrid) {
      mainGrid.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollSlider = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount = clientWidth * 0.6; // Scroll 60% of visible slider width
      ref.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = activeFilters.length === 0 || activeFilters.includes(product.category);
    const matchesSearch = isFuzzyMatch(product.name, search);
    const matchesRecommended = !showOnlyRecommended || (alignment && isRecommended(product.name, alignment.gemstone));
    return matchesCategory && matchesSearch && matchesRecommended;
  });

  // Calculate dynamic products specifically matching their suggested zodiac gemstone
  const getZodiacProducts = () => {
    if (!alignment || !alignment.gemstone) return [];
    
    // Filter products matching the gemstone
    const matches = mockProducts.filter(p => isRecommended(p.name, alignment.gemstone));
    const list = [...matches];

    // Include the signature emerald choker if their stone is Emerald
    if (alignment.gemstone.toLowerCase() === 'emerald') {
      const exists = list.some(item => item.id === "new-launch");
      if (!exists) {
        list.unshift({ id: "new-launch", name: "The Aadya Emerald Choker", category: "Heirloom", karat: "22K", customImage: "/new-launch.png" });
      }
    }

    // Fallback: If we have fewer than 3 products, append general masterworks to complete the slider view
    if (list.length < 3) {
      mockProducts.forEach(p => {
        if (!list.some(item => item.id === p.id) && list.length < 3) {
          list.push(p);
        }
      });
    }
    return list;
  };

  const zodiacProducts = getZodiacProducts();

  // Curated lists for special sliders
  const newLaunchProducts = [
    { id: "new-launch", name: "The Aadya Emerald Choker", category: "Heirloom", karat: "22K", customImage: "/new-launch.png" },
    mockProducts[0], // Royal Heritage Necklace (Gold)
    mockProducts[1], // Bridal Diamond Ring (Bridal)
    mockProducts[2], // Emerald Halo Studs (Heirloom)
    mockProducts[3], // Royal Ruby Bangle (Heirloom)
  ];

  const mothersGiftProducts = [
    mockProducts[0], // Royal Heritage Necklace (Gold)
    mockProducts[3], // Royal Ruby Bangle (Heirloom)
    mockProducts[5], // Premium Pearl Set (Contemporary)
    mockProducts[4], // Classic Platinum Chain (Contemporary)
    mockProducts[2], // Emerald Halo Studs (Heirloom)
  ];

  const lovableOnesProducts = [
    mockProducts[1], // Bridal Diamond Ring (Bridal)
    mockProducts[2], // Emerald Halo Studs (Heirloom)
    mockProducts[4], // Classic Platinum Chain (Contemporary)
    mockProducts[0], // Royal Heritage Necklace (Gold)
    mockProducts[5], // Premium Pearl Set (Contemporary)
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2926]">
      {/* Hide scrollbar utility styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-8 py-16">
        
        {/* User Greeting & Astrological Summary Banner */}
        <div className="mb-12 bg-white/60 backdrop-blur-md border border-[#C5A059]/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm relative overflow-hidden">
          {/* Gold Decorative Corner Trim */}
          <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-[#C5A059]/40" />
          <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-[#C5A059]/40" />
          
          <div>
            <span className="text-[#90060c] font-bold tracking-[0.3em] uppercase text-[9px] block mb-1">
              Personalized Boutique
            </span>
            <h2 className="font-brand text-3xl text-[#1a1a1a] font-light tracking-[0.05em]">
              Welcome, {user.name || "Patron"}
            </h2>
            {alignment && (
              <p className="font-sans text-xs text-[#1a1a1a]/70 mt-2 tracking-[0.05em] flex items-center gap-1.5 flex-wrap">
                Your Cosmic Sign: <strong className="text-[#90060C] font-semibold">{alignment.zodiac}</strong> · 
                Suggested Destiny Stone: <strong className="text-[#90060C] font-semibold">{alignment.gemstone}</strong> 
                <span className="text-[10px] text-[#C5A059]">✧</span>
              </p>
            )}
          </div>

          <div className="flex gap-4 items-center">
            {alignment && (
              <button 
                onClick={() => setShowOnlyRecommended(!showOnlyRecommended)}
                className={`text-xs uppercase tracking-[0.15em] px-6 py-3 rounded-full transition-all duration-300 font-sans font-bold border ${
                  showOnlyRecommended 
                    ? "bg-[#90060c] text-white border-[#90060c] shadow-md" 
                    : "bg-transparent border-[#C5A059]/40 text-[#90060c] hover:border-[#90060c]"
                }`}
              >
                ✦ Show Suggested
              </button>
            )}

            <button 
              onClick={handleLogout}
              className="text-xs uppercase tracking-[0.15em] text-[#1a1a1a]/70 hover:text-[#90060C] transition-colors font-sans font-bold border border-[#1a1a1a]/20 hover:border-[#90060C]/40 px-6 py-3 rounded-full"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Header */}
        <div id="destiny-grid-anchor" className="mb-12 scroll-mt-24">
          <h1 className="text-4xl font-brand text-[#90060C] mb-8 font-light tracking-[0.05em]">Your Destiny Collection</h1>
          <input 
            type="text"
            placeholder="Search matching heritage pieces..."
            className="w-full max-w-xl bg-transparent border-b-2 border-[#DED5C4] py-3 focus:outline-none focus:border-[#90060C] transition-colors text-[#2D2926] font-sans"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-16">
          <button 
            onClick={() => setActiveFilters([])}
            className={`px-8 py-3 border transition-all duration-300 font-sans text-xs tracking-widest ${
              activeFilters.length === 0 
                ? "bg-[#90060C] text-white border-[#90060C]" 
                : "bg-transparent border-[#DED5C4] hover:border-[#90060c] text-[#2D2926]"
            }`}
          >
            ALL PIECES
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => toggleFilter(cat)}
              className={`px-8 py-3 border transition-all duration-300 font-sans text-xs tracking-widest ${
                activeFilters.includes(cat) 
                  ? "bg-[#90060C] text-white border-[#90060C]" 
                  : "bg-transparent border-[#DED5C4] hover:border-[#90060C] text-[#2D2926]"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const recommended = alignment && isRecommended(product.name, alignment.gemstone);
              return (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] w-full mb-6 border border-[#EBE3D5] group-hover:border-[#90060C] transition-colors overflow-hidden rounded-xl bg-[#F5EFE6]">
                    <Image 
                      src={`/product-${product.id}.jpg`} 
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {recommended && (
                      <div className="absolute top-3 right-3 z-10 bg-[#faf3e5] border border-[#C5A059] text-[#90060c] px-3 py-1 rounded-full shadow-md">
                        <p className="text-[8px] font-bold uppercase tracking-widest">
                          ✦ SUGGESTED
                        </p>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-brand mb-1 text-[#1a1a1a] font-light group-hover:text-[#90060C] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs tracking-widest text-[#A8A196] font-sans font-medium">
                    {product.category.toUpperCase()} · {product.karat}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="col-span-full text-[#A8A196] font-brand text-lg">No pieces found matching your selection.</p>
          )}
        </div>
        
      </div>

      {/* 1. Destiny Gemstone Sliding Section */}
      {alignment && (
        <>
          <PageDivider />
          <section className="py-24 px-12 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto">
              {/* Header Row with Navigation Controls & View All */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                <div className="text-left max-w-xl">
                  <span className="text-[#90060c] font-bold tracking-[0.4em] uppercase text-[10px] mb-3 block">
                    Cosmic Alignment
                  </span>
                  <h2 className="font-brand text-4xl md:text-5xl text-[#1a1a1a] tracking-[0.05em] font-light">
                    Your Destiny Stone: {alignment.gemstone}
                  </h2>
                  <p className="font-sans text-xs tracking-wider text-[#A8A196] mt-4 leading-relaxed">
                    Exclusive selections aligning with your astrological birth chart to amplify positive energy, clarity, and harmony.
                  </p>
                </div>

                {/* Slider controls & View All */}
                <div className="flex items-center gap-6">
                  <button 
                    onClick={handleViewAllDestiny} 
                    className="text-xs uppercase tracking-[0.2em] text-[#90060C] hover:text-[#1a1a1a] transition-all duration-300 font-bold border-b border-[#90060C]/30 pb-0.5 hover:border-[#90060c] cursor-pointer"
                  >
                    View All
                  </button>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => scrollSlider(zodiacScrollRef, 'left')}
                      className="p-3.5 rounded-full border border-[#C5A059]/40 hover:border-[#90060c] text-[#90060c] hover:bg-[#90060c] hover:text-[#FDFBF7] transition-all duration-500 active:scale-95"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      onClick={() => scrollSlider(zodiacScrollRef, 'right')}
                      className="p-3.5 rounded-full border border-[#C5A059]/40 hover:border-[#90060c] text-[#90060c] hover:bg-[#90060c] hover:text-[#FDFBF7] transition-all duration-500 active:scale-95"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Destiny Gemstone Horizontal Slider */}
              <div 
                ref={zodiacScrollRef}
                className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-8"
              >
                {zodiacProducts.map((product, idx) => (
                  <div 
                    key={`zod-${product.id}-${idx}`} 
                    className="group cursor-pointer min-w-[280px] sm:min-w-[320px] max-w-[320px]"
                  >
                    <div className="relative aspect-[3/4] w-full mb-6 border border-[#EBE3D5] group-hover:border-[#90060C] transition-colors overflow-hidden rounded-xl bg-[#F5EFE6]">
                      <Image 
                        src={product.customImage || `/product-${product.id}.jpg`} 
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 280px, 320px"
                        className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-3 right-3 z-10 bg-[#faf3e5] border border-[#C5A059] text-[#90060c] px-3 py-1 rounded-full shadow-md">
                        <p className="text-[8px] font-bold uppercase tracking-widest">
                          ✦ MATCH
                        </p>
                      </div>
                    </div>
                    <h3 className="text-lg font-brand mb-1 text-[#1a1a1a] font-light group-hover:text-[#90060C] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs tracking-widest text-[#A8A196] font-sans font-medium">
                      {product.category.toUpperCase()} · {product.karat}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* 2. New Launch Sliding Section */}
      <PageDivider />
      <section className="py-24 px-12 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto">
          {/* Header Row with Navigation Controls & View All */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="text-left max-w-xl">
              <span className="text-[#90060c] font-bold tracking-[0.4em] uppercase text-[10px] mb-3 block">
                The New Debut
              </span>
              <h2 className="font-brand text-4xl md:text-5xl text-[#1a1a1a] tracking-[0.05em] font-light">
                New Launches
              </h2>
              <p className="font-sans text-xs tracking-wider text-[#A8A196] mt-4 leading-relaxed">
                Explore our latest debuts, showcasing hand-selected emeralds, architectural symmetry, and mastercrafted gold silhouettes.
              </p>
            </div>

            {/* Slider controls & View All */}
            <div className="flex items-center gap-6">
              <Link 
                href="/collection" 
                className="text-xs uppercase tracking-[0.2em] text-[#90060C] hover:text-[#1a1a1a] transition-all duration-300 font-bold border-b border-[#90060C]/30 pb-0.5 hover:border-[#90060c]"
              >
                View All
              </Link>
              <div className="flex gap-3">
                <button 
                  onClick={() => scrollSlider(newLaunchScrollRef, 'left')}
                  className="p-3.5 rounded-full border border-[#C5A059]/40 hover:border-[#90060c] text-[#90060c] hover:bg-[#90060c] hover:text-[#FDFBF7] transition-all duration-500 active:scale-95"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => scrollSlider(newLaunchScrollRef, 'right')}
                  className="p-3.5 rounded-full border border-[#C5A059]/40 hover:border-[#90060c] text-[#90060c] hover:bg-[#90060c] hover:text-[#FDFBF7] transition-all duration-500 active:scale-95"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* New Launch Horizontal Slider */}
          <div 
            ref={newLaunchScrollRef}
            className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-8"
          >
            {newLaunchProducts.map((product, idx) => (
              <div 
                key={`new-${product.id}-${idx}`} 
                className="group cursor-pointer min-w-[280px] sm:min-w-[320px] max-w-[320px]"
              >
                <div className="relative aspect-[3/4] w-full mb-6 border border-[#EBE3D5] group-hover:border-[#90060C] transition-colors overflow-hidden rounded-xl bg-[#F5EFE6]">
                  <Image 
                    src={product.customImage || `/product-${product.id}.jpg`} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 280px, 320px"
                    className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <h3 className="text-lg font-brand mb-1 text-[#1a1a1a] font-light group-hover:text-[#90060C] transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs tracking-widest text-[#A8A196] font-sans font-medium">
                  {product.category.toUpperCase()} · {product.karat}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. For Mother's Gift Sliding Section */}
      <PageDivider />
      <section className="py-24 px-12 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto">
          {/* Header Row with Navigation Controls & View All */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="text-left max-w-xl">
              <span className="text-[#90060c] font-bold tracking-[0.4em] uppercase text-[10px] mb-3 block">
                Honor & Legacy
              </span>
              <h2 className="font-brand text-4xl md:text-5xl text-[#1a1a1a] tracking-[0.05em] font-light">
                For Mother&apos;s Gift
              </h2>
              <p className="font-sans text-xs tracking-wider text-[#A8A196] mt-4 leading-relaxed">
                Celebrate the enduring warmth of maternal love with curated heirloom masterpieces featuring timeless pearls, traditional rubies, and handcrafted solid gold arches.
              </p>
            </div>

            {/* Slider controls & View All */}
            <div className="flex items-center gap-6">
              <Link 
                href="/collection" 
                className="text-xs uppercase tracking-[0.2em] text-[#90060C] hover:text-[#1a1a1a] transition-all duration-300 font-bold border-b border-[#90060C]/30 pb-0.5 hover:border-[#90060c]"
              >
                View All
              </Link>
              <div className="flex gap-3">
                <button 
                  onClick={() => scrollSlider(mothersScrollRef, 'left')}
                  className="p-3.5 rounded-full border border-[#C5A059]/40 hover:border-[#90060c] text-[#90060c] hover:bg-[#90060c] hover:text-[#FDFBF7] transition-all duration-500 active:scale-95"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => scrollSlider(mothersScrollRef, 'right')}
                  className="p-3.5 rounded-full border border-[#C5A059]/40 hover:border-[#90060c] text-[#90060c] hover:bg-[#90060c] hover:text-[#FDFBF7] transition-all duration-500 active:scale-95"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Mothers Gift Horizontal Slider */}
          <div 
            ref={mothersScrollRef}
            className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-8"
          >
            {mothersGiftProducts.map((product, idx) => (
              <div 
                key={`mom-${product.id}-${idx}`} 
                className="group cursor-pointer min-w-[280px] sm:min-w-[320px] max-w-[320px]"
              >
                <div className="relative aspect-[3/4] w-full mb-6 border border-[#EBE3D5] group-hover:border-[#90060C] transition-colors overflow-hidden rounded-xl bg-[#F5EFE6]">
                  <Image 
                    src={`/product-${product.id}.jpg`} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 280px, 320px"
                    className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <h3 className="text-lg font-brand mb-1 text-[#1a1a1a] font-light group-hover:text-[#90060C] transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs tracking-widest text-[#A8A196] font-sans font-medium">
                  {product.category.toUpperCase()} · {product.karat}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. For Lovable Ones Sliding Section */}
      <PageDivider />
      <section className="py-24 px-12 bg-[#FDFBF7] pb-36">
        <div className="max-w-7xl mx-auto">
          {/* Header Row with Navigation Controls & View All */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="text-left max-w-xl">
              <span className="text-[#90060c] font-bold tracking-[0.4em] uppercase text-[10px] mb-3 block">
                Devotion & Sparkle
              </span>
              <h2 className="font-brand text-4xl md:text-5xl text-[#1a1a1a] tracking-[0.05em] font-light">
                For Lovable Ones
              </h2>
              <p className="font-sans text-xs tracking-wider text-[#A8A196] mt-4 leading-relaxed">
                Commemorate deep bonds and shared dreams with hand-selected brilliant solitaires, contemporary platinum, and glowing emerald studs that celebrate love.
              </p>
            </div>

            {/* Slider controls & View All */}
            <div className="flex items-center gap-6">
              <Link 
                href="/collection" 
                className="text-xs uppercase tracking-[0.2em] text-[#90060C] hover:text-[#1a1a1a] transition-all duration-300 font-bold border-b border-[#90060C]/30 pb-0.5 hover:border-[#90060c]"
              >
                View All
              </Link>
              <div className="flex gap-3">
                <button 
                  onClick={() => scrollSlider(lovableScrollRef, 'left')}
                  className="p-3.5 rounded-full border border-[#C5A059]/40 hover:border-[#90060c] text-[#90060c] hover:bg-[#90060c] hover:text-[#FDFBF7] transition-all duration-500 active:scale-95"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => scrollSlider(lovableScrollRef, 'right')}
                  className="p-3.5 rounded-full border border-[#C5A059]/40 hover:border-[#90060c] text-[#90060c] hover:bg-[#90060c] hover:text-[#FDFBF7] transition-all duration-500 active:scale-95"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Lovable Ones Horizontal Slider */}
          <div 
            ref={lovableScrollRef}
            className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-8"
          >
            {lovableOnesProducts.map((product, idx) => (
              <div 
                key={`love-${product.id}-${idx}`} 
                className="group cursor-pointer min-w-[280px] sm:min-w-[320px] max-w-[320px]"
              >
                <div className="relative aspect-[3/4] w-full mb-6 border border-[#EBE3D5] group-hover:border-[#90060C] transition-colors overflow-hidden rounded-xl bg-[#F5EFE6]">
                  <Image 
                    src={`/product-${product.id}.jpg`} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 280px, 320px"
                    className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <h3 className="text-lg font-brand mb-1 text-[#1a1a1a] font-light group-hover:text-[#90060C] transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs tracking-widest text-[#A8A196] font-sans font-medium">
                  {product.category.toUpperCase()} · {product.karat}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
