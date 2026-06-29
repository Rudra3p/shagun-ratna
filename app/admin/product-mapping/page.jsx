"use client";

import { useEffect, useState } from 'react';
import adminApi from '@/lib/adminApi';
import { Filter, Save, Loader2, Sparkles, User, Calendar, CheckCircle } from 'lucide-react';

export default function ProductMapping() {
  // Products collection state for the selector dropdown
  const [products, setProducts] = useState([]); 
  const [selectorPage, setSelectorPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [loadingSelector, setLoadingSelector] = useState(false);

  // Filtered showcase mappings from server (Right panel view)
  const [mappedItems, setMappedItems] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State for creating/updating a mapping
  const [formData, setFormData] = useState({
    productRefId: '',
    isPopularHomepage: false,
    targetGender: 'All',
    targetAgeGroup: 'All'
  });

  // Filter State for viewing current mappings
  const [viewFilters, setViewFilters] = useState({
    gender: '',
    age: '',
    popular: ''
  });

  // 1. Fetch products step-by-step (10 at a time) without duplicates
  const fetchAllProducts = async (pageToFetch = 1) => {
    if (loadingSelector || (!hasMoreProducts && pageToFetch > 1)) return;
    
    setLoadingSelector(true);
    try {
      // Hits your paginated database route passing page and standard limit of 10
      const res = await adminApi.get(`/products?page=${pageToFetch}&limit=10`);
      const newProducts = res.data.products || [];
      
      if (newProducts.length < 10) {
        setHasMoreProducts(false); // Reached the end of the inventory database
      }

      setProducts((prevProducts) => {
        // Build a unique tracking set of existing IDs to enforce zero duplication
        const existingIds = new Set(prevProducts.map(p => p._id));
        const filteredNew = newProducts.filter(p => !existingIds.has(p._id));
        return [...prevProducts, ...filteredNew];
      });
      
      setSelectorPage(pageToFetch);
    } catch (err) {
      console.error("Failed to load step-by-step items:", err);
    } finally {
      setLoadingSelector(false);
    }
  };

  // 2. Fetch current active mappings based on chosen admin view filters
  const fetchMappings = async () => {
    setLoading(true);
    try {
      let queryString = [];
      if (viewFilters.gender) queryString.push(`gender=${viewFilters.gender}`);
      if (viewFilters.age) queryString.push(`age=${viewFilters.age}`);
      if (viewFilters.popular) queryString.push(`popular=${viewFilters.popular}`);

      const buildUrl = `/collection/smart?${queryString.join('&')}`;
      const res = await adminApi.get(buildUrl);
      
      setMappedItems(res.data.data?.recommendations || res.data.data?.catalog || []);
    } catch (err) {
      console.error("Failed to query mappings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial step-by-step data load on component mount
  useEffect(() => {
    fetchAllProducts(1);
  }, []);

  // Sync right panel view automatically when filter drop-downs change
  useEffect(() => {
    fetchMappings();
  }, [viewFilters]);

  // 3. Submit mapping assignments to backend configure endpoint
  const handleSubmitMapping = async (e) => {
    e.preventDefault();
    if (!formData.productRefId) return alert("Please select a product first");

    setSaving(true);
    try {
      await adminApi.post('/collection/smart/configure', formData);
      alert("Product target demographic mapped successfully!");
      
      // Reset form options and refresh lookups
      setFormData({ productRefId: '', isPopularHomepage: false, targetGender: 'All', targetAgeGroup: 'All' });
      fetchMappings();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to save mapping config");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-[1200px] mx-auto px-4 font-sans">
      
      {/* Header Panel */}
      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-[#721c24] tracking-tight flex items-center gap-2">
          <Sparkles className="text-[#540411]" size={22} />
          Smart Product Demographic Mapping
        </h1>
        <p className="text-[13px] text-gray-500 mt-1">
          Map your jewelry assets to target age brackets, genders, or highlight them as the 6 popular collections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: CREATION/UPDATE CONFIGURATION CONTROL BOARD */}
        <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm h-fit">
          <h2 className="text-[16px] font-bold text-gray-800 mb-5 border-b pb-2">Assign Smart Targets</h2>
          
          <form onSubmit={handleSubmitMapping} className="space-y-5">
            
            {/* Step-by-Step Dropdown Product Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Select Product</label>
              <select
                value={formData.productRefId}
                onChange={(e) => setFormData({...formData, productRefId: e.target.value})}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] focus:ring-1 focus:ring-[#540411] text-[13px] text-gray-800 shadow-sm"
              >
                <option value="">-- Choose Inventory Item --</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>{p.productName} ({p.category || 'General'})</option>
                ))}
              </select>
              
              {/* Inline Step Loader Link Trigger */}
              {hasMoreProducts && (
                <div className="text-right">
                  <button
                    type="button"
                    disabled={loadingSelector}
                    onClick={() => fetchAllProducts(selectorPage + 1)}
                    className="text-[11px] text-[#540411] hover:underline font-semibold disabled:text-gray-400 pt-1"
                  >
                    {loadingSelector ? "Loading items..." : "➕ Load Next 10 Products"}
                  </button>
                </div>
              )}
            </div>

            {/* Target Gender Dropdown Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Target Demographic Gender</label>
              <select
                value={formData.targetGender}
                onChange={(e) => setFormData({...formData, targetGender: e.target.value})}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] text-[13px] text-gray-800 shadow-sm"
              >
                <option value="All">All / General</option>
                <option value="Female">Female Curation</option>
                <option value="Male">Male Curation</option>
                <option value="Unisex">Unisex Framework</option>
              </select>
            </div>

            {/* Target Age Bracket Dropdown Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Target Age Group</label>
              <select
                value={formData.targetAgeGroup}
                onChange={(e) => setFormData({...formData, targetAgeGroup: e.target.value})}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] text-[13px] text-gray-800 shadow-sm"
              >
                <option value="All">All Brackets</option>
                <option value="Kids">Kids Selection</option>
                <option value="Teens">Teens Showcase</option>
                <option value="Young Adult">Young Adult Curation</option>
                <option value="Adult">Adult Luxury Range</option>
                <option value="Senior">Senior Classic Segment</option>
              </select>
            </div>

            {/* Home Page Showcase Pinned Switcher */}
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <label className="text-[13px] font-bold text-gray-700">Pin as Popular Masterpiece</label>
                <p className="text-[11px] text-gray-400 mt-0.5">Showcase inside the 6 home screen slots.</p>
              </div>
              <input
                type="checkbox"
                checked={formData.isPopularHomepage}
                onChange={(e) => setFormData({...formData, isPopularHomepage: e.target.checked})}
                className="w-4 h-4 text-[#540411] border-gray-300 rounded focus:ring-[#540411] accent-[#540411]"
              />
            </div>

            {/* Form Save Action Trigger */}
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#540411] text-white rounded-lg shadow-sm hover:bg-[#400009] disabled:bg-gray-400 transition-all text-[13px] font-semibold"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Configuration Mapping
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: ACTIVE FILTER MAP INSPECTION MONITOR VIEW GRID */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Audit Filters Navigation Panel */}
          <div className="bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-[13px] font-medium pr-2">
              <Filter size={16} />
              Filter Inspection:
            </div>

            {/* Audit Gender Toggle */}
            <select
              value={viewFilters.gender}
              onChange={(e) => setViewFilters({...viewFilters, gender: e.target.value})}
              className="px-3 py-1.5 bg-gray-50 border border-transparent rounded-lg text-[12px] text-gray-700 focus:outline-none focus:bg-white focus:border-gray-200"
            >
              <option value="">All Genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Unisex">Unisex</option>
            </select>

            {/* Audit Age Bracket Toggle */}
            <select
              value={viewFilters.age}
              onChange={(e) => setViewFilters({...viewFilters, age: e.target.value})}
              className="px-3 py-1.5 bg-gray-50 border border-transparent rounded-lg text-[12px] text-gray-700 focus:outline-none focus:bg-white focus:border-gray-200"
            >
              <option value="">All Ages</option>
              <option value="Kids">Kids</option>
              <option value="Teens">Teens</option>
              <option value="Young Adult">Young Adult</option>
              <option value="Adult">Adult</option>
              <option value="Senior">Senior</option>
            </select>

            {/* Audit Popular Target Toggle */}
            <select
              value={viewFilters.popular}
              onChange={(e) => setViewFilters({...viewFilters, popular: e.target.value})}
              className="px-3 py-1.5 bg-gray-50 border border-transparent rounded-lg text-[12px] text-gray-700 focus:outline-none focus:bg-white focus:border-gray-200"
            >
              <option value="">All Placements</option>
              <option value="true">Pinned Home Showcase (Max 6)</option>
            </select>
          </div>

          {/* Map Verification Output Display Grid */}
          {loading ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-gray-400 gap-2">
              <Loader2 className="animate-spin text-[#540411]" size={24} />
              <p className="text-[13px]">Querying CDN-mapped indexes...</p>
            </div>
          ) : mappedItems.length === 0 ? (
            <div className="bg-white border border-dashed rounded-[20px] py-16 text-center text-gray-400 text-[13px]">
              No products found currently mapped matching this specific parameter sequence template.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mappedItems.map((item) => (
                <div key={item.showcaseId || item._id} className="bg-white border border-gray-100 rounded-[16px] p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-all">
                  {/* Thumbnail Image Render */}
                  <div className="w-16 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.product?.imageUrl || item.imageUrl})` }}
                  />
                  {/* Meta Details List */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-[14px] font-bold text-gray-800 truncate">{item.product?.productName || item.productName}</h4>
                    <p className="text-[12px] text-[#540411] font-semibold">
                      ${(item.product?.price || item.price) ? parseFloat(item.product?.price || item.price).toFixed(2) : '0.00'}
                    </p>
                    
                    {/* Active Assignment Badges Layout Row */}
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-[10px] font-medium">
                        <User size={10} /> {item.gender || 'General'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-[10px] font-medium">
                        <Calendar size={10} /> {item.ageGroup || 'All Brackets'}
                      </span>
                      {item.isPopular && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle size={10} /> Pinned 6
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}