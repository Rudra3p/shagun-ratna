"use client";

import { useEffect, useState } from 'react';
import adminApi from '@/lib/adminApi';
import { Search, Filter, Plus, Edit2, Trash2, ArrowLeft, Upload, Loader2 } from 'lucide-react';

export default function Products() {
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [formData, setFormData] = useState({ 
    productName: '', price: '', category: 'General', discount: 0, offerPrice: 0 
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // FETCH: Loads products and appends them to the existing list
  const fetchProducts = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await adminApi.get(`/products?page=${pageNumber}&limit=10`);
      const newProducts = res.data.products;

      // If page is 1, replace products. If page > 1, append new products.
      setProducts(prev => pageNumber === 1 ? newProducts : [...prev, ...newProducts]);
      
      // If we got fewer than 10 products, we've reached the end
      setHasMore(newProducts.length === 10);
      setPage(pageNumber);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchProducts(1); 
  }, []);

  // 1. Keep your standard state managers

// 2. The explicit submission event handler
  const handleSearchSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser from reloading the entire page
    
    // Fallback: If they cleared the box, reload standard page 1 inventory items
    if (searchQuery.trim() === "") {
      fetchProducts(1);
      return;
    }

    setLoading(true);
    try {
      console.log(`Firing explicit network search trigger for: "${searchQuery}"`);
      
      const res = await adminApi.post('/products', {
        search: searchQuery,
        page: 1,
        limit: 10
      });

      // Populate state with your fuzzy-matched, CDN-cached response payload
      setProducts(res.data.products);
      setHasMore(res.data.products.length === 10);
      setPage(1);
    } catch (err) {
      console.error("Manual search execution failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle local image preview generation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = formData.imageUrl || null;

      if (imageFile) {
        console.log("1. Requesting signed URL for:", imageFile.name);
        
        const { data } = await adminApi.post('/products', {
          action: 'get-upload-url',
          fileName: imageFile.name,
          fileType: imageFile.type
        });
        
        console.log("2. Received signed URL, starting R2 upload...");

        await fetch(data.signedUrl, {
          method: 'PUT',
          body: imageFile,
          headers: { 'Content-Type': imageFile.type }
        });

        console.log("3. R2 upload successful");
        imageUrl = data.publicUrl;
      }

      const payload = {
        ...formData,
        imageUrl,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount),
        offerPrice: parseFloat(formData.offerPrice)
      };

      console.log("4. Sending payload to database:", payload);

      if (view === 'add') {
        await adminApi.post('/products', { action: 'create', ...payload });
      } else {
        await adminApi.put(`/products?id=${editingId}`, payload);
      }
      
      console.log("5. Save successful!");
      resetForm();
      setView('list');
      fetchProducts(1);
    } catch (err) { 
      console.error("6. ERROR caught:", err);
      alert(err.response?.data?.error || "Save failed"); 
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (product) => {
    setFormData({ 
      productName: product.productName, 
      price: product.price,
      category: product.category,
      discount: product.discount,
      offerPrice: product.offerPrice,
      imageUrl: product.imageUrl || ''
    });
    setImagePreview(product.imageUrl || null);
    setEditingId(product._id);
    setView('edit');
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await adminApi.delete(`/products?id=${id}`);
        fetchProducts(1);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ productName: '', price: '', category: 'General', discount: 0, offerPrice: 0 });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
  };

  const filteredProducts = products.filter(product => 
    product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- RENDERING FORM VIEW (ADD / EDIT) ---
  if (view === 'add' || view === 'edit') {
    return (
      <div className="animate-in fade-in duration-500 pb-10 max-w-[600px] mx-auto">
        {/* Form Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => { resetForm(); setView('list'); }} 
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[20px] font-sans font-bold text-[#721c24] tracking-tight">
              {view === 'add' ? 'Add New Product' : 'Edit Product'}
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">Fill out your gemstone and jewelry collection fields asset entries.</p>
          </div>
        </div>

        {/* Form Body Container */}
        <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)] space-y-6">
          
          {/* Product Name Input */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider font-sans">Product Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Royal Sapphire Halo" 
              value={formData.productName} 
              onChange={(e) => setFormData({...formData, productName: e.target.value})} 
              required 
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] focus:ring-1 focus:ring-[#540411] transition-all text-[14px] text-gray-900 shadow-sm"
            />
          </div>

          {/* Category Input */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider font-sans">Category</label>
            <input 
              type="text" 
              placeholder="e.g. High-End Jewelry" 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})} 
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] focus:ring-1 focus:ring-[#540411] transition-all text-[14px] text-gray-900 shadow-sm"
            />
          </div>

          {/* Pricing Row Layout Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider font-sans">Original Price ($) *</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
                required 
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] focus:ring-1 focus:ring-[#540411] transition-all text-[14px] text-gray-900 shadow-sm"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider font-sans">Discount (%)</label>
              <input 
                type="number" 
                placeholder="0" 
                value={formData.discount} 
                onChange={(e) => setFormData({...formData, discount: e.target.value})} 
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] focus:ring-1 focus:ring-[#540411] transition-all text-[14px] text-gray-900 shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider font-sans">Offer Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                value={formData.offerPrice} 
                onChange={(e) => setFormData({...formData, offerPrice: e.target.value})} 
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] focus:ring-1 focus:ring-[#540411] transition-all text-[14px] text-gray-900 shadow-sm"
              />
            </div>
          </div>

          {/* Styled Image Upload Dropzone area */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider font-sans">Product Asset Image</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 bg-white rounded-[16px] cursor-pointer hover:border-[#540411] hover:bg-[#ffecec]/20 transition-all duration-300 relative overflow-hidden group">
                {imagePreview ? (
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${imagePreview})` }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-[#540411] transition-colors" />
                    <p className="text-[13px] text-gray-900 font-bold">Click to upload file</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG or WEBP formats allowed</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* Action Trigger Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => { resetForm(); setView('list'); }}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors font-semibold text-[13px] shadow-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#540411] text-white rounded-lg shadow-md hover:bg-[#400009] disabled:bg-gray-400 transition-all font-semibold text-[13px]"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {view === 'add' ? 'Create Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- RENDERING INVENTORY GRID VIEW ---
  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-[1200px]">
      {/* Top Layout Management Search & Filters Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex gap-2">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#540411] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Safe now! Only changes local string state, doesn't hit API.
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] focus:ring-1 focus:ring-[#540411] transition-all text-[14px] text-gray-900 placeholder:text-gray-400 shadow-sm"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="px-4 bg-[#540411] text-white rounded-lg hover:bg-[#400009] transition-all text-[13px] font-semibold flex items-center justify-center shadow-sm"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors font-semibold text-[13px] shadow-sm">
            <Filter size={16} />
            Filter
          </button>
          <button 
            onClick={() => { resetForm(); setView('add'); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#540411] text-white rounded-lg shadow-md hover:bg-[#400009] transition-all font-semibold text-[13px]"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Main Grid View Dashboard Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        
        {/* Map database entries directly into structured layout cards */}
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-[20px] border border-gray-100 overflow-hidden flex flex-col group hover:border-[#540411]/30 transition-all duration-300 shadow-sm hover:shadow-md min-h-[340px]">
            {/* Asset Image Layer */}
            <div className="relative h-48 w-full overflow-hidden bg-gray-50">
              {product.imageUrl ? (
                <div 
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
                  style={{ backgroundImage: `url(${product.imageUrl})` }} 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 font-sans text-[12px] font-semibold uppercase tracking-wide">
                  No Asset Render
                </div>
              )}
              {/* Optional: Render discount offer status badge */}
              {product.discount > 0 && (
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1.5 rounded-full backdrop-blur-sm bg-[#ffecec]/95 text-[#b03038] font-sans text-[10px] font-bold tracking-widest uppercase shadow-sm">
                    {product.discount}% OFF
                  </span>
                </div>
              )}
            </div>
            
            {/* Product description texts */}
            <div className="p-6 flex flex-col flex-1">
              <div className="mb-4">
                <span className="font-sans text-[11px] text-gray-500 font-bold uppercase tracking-widest">{product.category || 'General'}</span>
                <h3 className="text-[17px] text-gray-900 font-bold truncate mt-1 tracking-tight">{product.productName}</h3>
              </div>
              
              {/* Pricing metrics & Admin Control interfaces */}
              <div className="flex items-end justify-between mt-auto">
                <div>
                  {product.offerPrice > 0 && product.offerPrice !== product.price ? (
                    <div className="space-y-0.5">
                      <p className="text-[12px] text-gray-400 line-through font-medium">${parseFloat(product.price).toFixed(2)}</p>
                      <p className="text-[20px] text-gray-900 font-sans font-bold">${parseFloat(product.offerPrice).toFixed(2)}</p>
                    </div>
                  ) : (
                    <p className="text-[20px] text-gray-900 font-sans font-bold">${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}</p>
                  )}
                </div>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => startEdit(product)}
                    className="p-2 text-gray-400 hover:text-[#540411] hover:bg-gray-50 transition-colors rounded-lg border border-transparent hover:border-gray-100"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="p-2 text-gray-400 hover:text-[#b03038] hover:bg-gray-50 transition-colors rounded-lg border border-transparent hover:border-gray-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* "New Product" Dash Button Card placeholder target */}
        <button 
          onClick={() => { resetForm(); setView('add'); }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-white rounded-[20px] p-8 group hover:border-[#540411] hover:bg-[#ffecec]/50 transition-all duration-300 min-h-[340px]"
        >
          <div className="w-16 h-16 rounded-full bg-[#f1f4f9] flex items-center justify-center group-hover:bg-[#540411] group-hover:text-white text-gray-400 transition-colors mb-4">
            <Plus size={28} />
          </div>
          <p className="text-[17px] text-gray-900 font-bold tracking-tight">New Product</p>
          <p className="text-[14px] text-gray-500 text-center px-4 mt-1">Expand your catalog with a new asset entry.</p>
        </button>
      </div>

      {/* Append Pagination Load More Controls */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button 
            disabled={loading} 
            onClick={() => fetchProducts(page + 1)}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 bg-white rounded-lg hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 transition-all font-semibold text-[13px] shadow-sm inline-flex items-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? 'Loading Next Assets...' : 'Load More Products'}
          </button>
        </div>
      )}
    </div>
  );
}