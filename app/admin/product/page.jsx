"use client";

import { useEffect, useRef, useState } from 'react';
import adminApi from '@/lib/adminApi';
import {
  Search, Tag, Plus, Edit2, Trash2, ArrowLeft, Upload, Loader2,
  CheckCircle2, AlertCircle, PackageSearch
} from 'lucide-react';

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-[3/4] w-full rounded-[24px] bg-gray-100" />
      <div className="pt-4 flex flex-col items-center gap-2">
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
        <div className="h-2.5 w-1/3 bg-gray-100 rounded" />
        <div className="h-4 w-1/4 bg-gray-100 rounded mt-1" />
      </div>
    </div>
  );
}

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
  const [isSearching, setIsSearching] = useState(false); // Tracks if search results are active
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showOfferOnly, setShowOfferOnly] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  // FETCH: Loads products and appends them to the existing list
  const fetchProducts = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await adminApi.get(`/products?page=${pageNumber}&limit=10`);
      const newProducts = res.data.products || [];

      setProducts(prev => {
        // Force complete overwrite on page 1 to discard old layouts cleanly
        if (pageNumber === 1) {
          return newProducts;
        }
        return [...prev, ...newProducts];
      });

      setTotalCount(res.data.total || 0);
      setHasMore(newProducts.length === 10);
      setPage(pageNumber);
      setIsSearching(false); // Confirm we are back to standard view pipeline
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  // Track search query variations instantly to clear junk if input is wiped out empty
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // If the input box is cleared out completely, instantly wipe data and restore standard items
    if (value.trim() === "") {
      fetchProducts(1);
    }
  };

  // The upgraded cache-eligible explicit GET search submission handler
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (searchQuery.trim() === "") {
      fetchProducts(1);
      return;
    }

    setLoading(true);
    try {
      const res = await adminApi.get(`/products?search=${encodeURIComponent(searchQuery)}&page=1&limit=10`);
      const foundItems = res.data.products || [];

      setProducts(foundItems);
      setTotalCount(res.data.total || 0);
      setHasMore(foundItems.length === 10);
      setPage(1);
      setIsSearching(true); // Locks interface into search view mode
    } catch (err) {
      console.error("Manual search execution failed:", err);
      showToast('error', 'Search failed. Please try again.');
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
        const { data } = await adminApi.post('/products', {
          action: 'get-upload-url',
          fileName: imageFile.name,
          fileType: imageFile.type
        });

        await fetch(data.signedUrl, {
          method: 'PUT',
          body: imageFile,
          headers: { 'Content-Type': imageFile.type }
        });

        imageUrl = data.publicUrl;
      }

      const payload = {
        ...formData,
        imageUrl,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount),
        offerPrice: parseFloat(formData.offerPrice)
      };

      const wasAdding = view === 'add';

      if (wasAdding) {
        await adminApi.post('/products', { action: 'create', ...payload });
      } else {
        await adminApi.put(`/products?id=${editingId}`, payload);
      }

      resetForm();
      setView('list');
      fetchProducts(1);
      showToast('success', wasAdding ? 'Product added to the catalog.' : 'Product changes saved.');
    } catch (err) {
      console.error("Save failed:", err);
      showToast('error', err.response?.data?.error || "Save failed. Please try again.");
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

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget._id);
    try {
      await adminApi.delete(`/products?id=${deleteTarget._id}`);
      showToast('success', `"${deleteTarget.productName}" was deleted.`);
      setDeleteTarget(null);
      fetchProducts(page === 1 ? 1 : page);
    } catch (err) {
      console.error("Delete failed:", err);
      showToast('error', 'Delete failed. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setFormData({ productName: '', price: '', category: 'General', discount: 0, offerPrice: 0 });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
  };

  const visibleProducts = showOfferOnly ? products.filter(p => p.discount > 0) : products;
  const showSkeleton = loading && products.length === 0;
  const showEmpty = !loading && visibleProducts.length === 0;

  // --- RENDERING FORM VIEW (ADD / EDIT) ---
  if (view === 'add' || view === 'edit') {
    return (
      <div className="animate-in fade-in duration-500 pb-10 max-w-[600px] mx-auto">
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

        <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)] space-y-6">
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <h1 className="text-[20px] font-sans font-bold text-[#721c24] tracking-tight">Product Catalog</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            {totalCount > 0 ? `${totalCount} piece${totalCount === 1 ? '' : 's'} in your collection` : 'Manage your jewelry inventory'}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex gap-2">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#540411] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] focus:ring-1 focus:ring-[#540411] transition-all text-[14px] text-gray-900 placeholder:text-gray-400 shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 bg-[#540411] text-white rounded-lg hover:bg-[#400009] transition-all text-[13px] font-semibold flex items-center justify-center shadow-sm disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOfferOnly((prev) => !prev)}
            aria-pressed={showOfferOnly}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-colors font-semibold text-[13px] shadow-sm border ${
              showOfferOnly
                ? 'bg-[#ffecec] border-[#f3c9c9] text-[#540411]'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Tag size={16} />
            On Offer
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
      {showSkeleton ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : showEmpty ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-[24px] border border-dashed border-gray-200">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
            <PackageSearch size={26} />
          </div>
          <p className="text-[14px] text-gray-700 font-semibold">
            {isSearching
              ? `No products match "${searchQuery}"`
              : showOfferOnly
                ? 'No products currently on offer'
                : 'Your catalog is empty'}
          </p>
          <p className="text-[13px] text-gray-400 mt-1 max-w-xs">
            {isSearching || showOfferOnly
              ? 'Try a different search term or clear the filter.'
              : 'Add your first piece to get started.'}
          </p>
          {!isSearching && !showOfferOnly && (
            <button
              onClick={() => { resetForm(); setView('add'); }}
              className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-[#540411] text-white rounded-lg shadow-md hover:bg-[#400009] transition-all font-semibold text-[13px]"
            >
              <Plus size={16} />
              Add Product
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {visibleProducts.map((product) => (
            <div key={product._id} className="flex flex-col group transition-all duration-300">

              {/* Asset Image Layer */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[24px] bg-[#fdfbf7]">
                {product.imageUrl ? (
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-102 transition-transform duration-700 ease-out"
                    style={{ backgroundImage: `url(${product.imageUrl})` }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 font-sans text-[11px] font-bold uppercase tracking-widest">
                    No Asset Render
                  </div>
                )}
                {product.discount > 0 && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 rounded-full backdrop-blur-md bg-white/90 text-[#b03038] font-sans text-[10px] font-bold tracking-widest uppercase shadow-sm">
                      {product.discount}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Product Description Text */}
              <div className="pt-4 flex flex-col flex-1 text-center">
                <div className="mb-1.5">
                  <h3 className="text-[17px] text-[#222222] font-serif font-medium tracking-wide group-hover:text-[#540411] transition-colors duration-300 truncate px-1">
                    {product.productName}
                  </h3>
                  <p className="text-[11px] text-[#888888] font-sans font-semibold uppercase tracking-widest mt-0.5">
                    {product.category || 'General'}
                  </p>
                </div>

                {/* Pricing & Admin Controls */}
                <div className="flex flex-col items-center gap-2.5 mt-auto">
                  <div>
                    {product.offerPrice > 0 && product.offerPrice !== product.price ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-[13px] text-gray-400 line-through font-medium">${parseFloat(product.price).toFixed(2)}</span>
                        <span className="text-[15px] text-[#222222] font-sans font-semibold">${parseFloat(product.offerPrice).toFixed(2)}</span>
                      </div>
                    ) : (
                      <p className="text-[15px] text-[#222222] font-sans font-semibold">${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}</p>
                    )}
                  </div>

                  <div className="flex gap-1.5 pt-0.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => startEdit(product)}
                      className="flex items-center gap-1 px-2.5 py-1 text-gray-500 hover:text-[#540411] hover:bg-[#ffecec]/40 transition-all rounded-md border border-gray-100 text-[11px] font-medium"
                    >
                      <Edit2 size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="flex items-center gap-1 px-2.5 py-1 text-gray-500 hover:text-[#b03038] hover:bg-red-50/50 transition-all rounded-md border border-gray-100 text-[11px] font-medium"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Conditionally hide the Add button placeholder during active searches/filters */}
          {!isSearching && !showOfferOnly && (
            <button
              onClick={() => { resetForm(); setView('add'); }}
              className="flex flex-col items-center justify-center border border-dashed border-gray-200 bg-white rounded-[24px] aspect-[3/4] group hover:border-[#540411] hover:bg-[#ffecec]/10 transition-all duration-500 w-full"
            >
              <div className="w-11 h-11 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#540411] group-hover:text-white text-gray-400 transition-colors duration-300 mb-2">
                <Plus size={18} />
              </div>
              <p className="text-[14px] text-gray-900 font-medium tracking-tight">Add Entry</p>
            </button>
          )}
        </div>
      )}

      {/* Append Pagination Load More Controls */}
      {hasMore && !showSkeleton && !showEmpty && !showOfferOnly && (
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#b03038] mb-4">
              <Trash2 size={22} />
            </div>
            <h3 className="text-[16px] font-bold text-gray-900 mb-1">Delete Product?</h3>
            <p className="text-[13px] text-gray-500 mb-6">
              “{deleteTarget.productName}” will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={!!deletingId}
                className="px-4 py-2.5 border border-gray-200 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors font-semibold text-[13px] shadow-sm disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={!!deletingId}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#b03038] text-white rounded-lg shadow-md hover:bg-[#8f262c] disabled:opacity-70 transition-all font-semibold text-[13px]"
              >
                {deletingId && <Loader2 size={14} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-300 ${
            toast.type === 'success' ? 'bg-[#1b3a2f] text-white' : 'bg-[#5c1a1a] text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-[13px] font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
