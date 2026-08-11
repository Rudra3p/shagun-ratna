"use client";

import { useEffect, useRef, useState } from 'react';
import adminApi from '@/lib/adminApi';
import Badge from '@/components/Badge';
import {
  Search, Tag, Plus, Edit2, Trash2, ArrowLeft, ArrowRight, Upload, Loader2,
  CheckCircle2, AlertCircle, PackageSearch, ImageOff, ChevronDown
} from 'lucide-react';

const PURITY_PRESETS = ['22K Pure Gold', '18K Gold', '14K Gold', '925 Silver', 'Platinum'];

const CATEGORY_PRESETS = [
  'General', 'Gold', 'Silver', 'Platinum', 'Diamond', 'Gemstone',
  'Ruby', 'Emerald', 'Sapphire', 'Bridal', 'Heirloom', 'Contemporary',
  'Traditional', 'Rings', 'Necklaces', 'Earrings', 'Bangles', 'Bracelets', 'Pendants'
];

// Shared field styling so every input in the form meets WCAG AA contrast and gets a
// consistent keyboard focus-visible ring (see :root tokens in app/globals.css)
const FIELD_LABEL = "text-[12px] font-bold text-on-surface-variant uppercase tracking-wider font-sans";
const FIELD_INPUT = "w-full px-4 py-2.5 bg-white border border-outline rounded-lg text-[14px] text-gray-900 placeholder:text-on-surface-variant shadow-sm transition-all focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1";
const SECTION_GROUP = "space-y-5 pb-6 border-b border-outline/15";
const BUTTON_FOCUS = "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white";

// Decorative required-field marker — the native `required` attribute already announces
// "required" to screen readers, so the asterisk itself is hidden from assistive tech.
function Required() {
  return <span className="text-primary font-bold ml-0.5" aria-hidden="true">*</span>;
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-transparent p-0 animate-pulse">
      <div className="aspect-[3/4] w-full bg-gray-100 rounded-xl mb-3" />
      <div className="h-2.5 bg-gray-100 w-1/4 rounded-md mb-2 ml-0.5" />
      <div className="h-4 bg-gray-100 w-3/4 rounded-md mb-2.5 ml-0.5" />
      <div className="h-4 bg-gray-100 w-1/3 rounded-md ml-0.5" />
    </div>
  );
}

function ProductCard({ product, onEdit, onDelete }) {
  const hasValidPrice = typeof product?.price === 'number' && product.price > 0;
  const hasDiscount = hasValidPrice && product.offerPrice > 0 && product.offerPrice !== product.price;

  return (
    <div className="group flex flex-col bg-transparent border-none p-0 transition-transform duration-500 ease-out hover:-translate-y-1.5">
      {/* Asset Image Layer */}
      <div className="relative aspect-[3/4] w-full mb-3 overflow-hidden rounded-xl bg-gradient-to-b from-[#fdfbf7] to-[#f5efe6] ring-1 ring-gray-100 group-hover:ring-[#540411]/25 shadow-sm group-hover:shadow-[0_18px_38px_rgba(84,4,17,0.14)] transition-all duration-500">
        {product.imageUrl ? (
          <div
            className="w-full h-full bg-cover bg-center group-hover:scale-[1.07] transition-transform duration-700 ease-out"
            style={{ backgroundImage: `url(${product.imageUrl})` }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-300">
            <ImageOff size={22} strokeWidth={1.5} />
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest">No Asset</span>
          </div>
        )}

        {/* Soft scrim so the floating controls stay legible over any image */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {product.discount > 0 && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col items-start gap-1.5">
            <Badge variant="discount">{product.discount}% Off</Badge>
          </div>
        )}

        {/* Floating admin controls (icon-only) */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(product)}
            aria-label="Edit product"
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/85 backdrop-blur-md ring-1 ring-black/[0.04] shadow-sm text-gray-600 hover:text-[#540411] hover:bg-white hover:scale-110 active:scale-90 transition-all duration-300 cursor-pointer"
          >
            <Edit2 size={13} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            aria-label="Delete product"
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/85 backdrop-blur-md ring-1 ring-black/[0.04] shadow-sm text-gray-600 hover:text-[#b03038] hover:bg-white hover:scale-110 active:scale-90 transition-all duration-300 cursor-pointer"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Product info — eyebrow category → title → price hierarchy */}
      <div className="flex flex-col flex-grow px-0.5 pt-1">
        <p className="text-[9.5px] sm:text-[10.5px] font-sans font-bold uppercase tracking-[0.14em] text-gray-400 mb-1.5 truncate">
          {product.category || 'General'}
          {product.purity && ` • ${product.purity}`}
        </p>
        <h3 className="text-sm sm:text-base font-serif font-semibold text-[#1a1a1a] group-hover:text-[#540411] transition-colors duration-300 truncate mb-2 leading-snug">
          {product.productName}
        </h3>
        <div className="h-px w-6 bg-[#540411]/25 mb-2.5 group-hover:w-10 transition-all duration-500" />
        <div className="flex items-baseline gap-2 mt-auto">
          {hasDiscount ? (
            <>
              <span className="text-base sm:text-lg font-sans font-bold text-[#540411]">₹{parseFloat(product.offerPrice).toFixed(2)}</span>
              <span className="text-xs text-gray-400 font-medium line-through">₹{parseFloat(product.price).toFixed(2)}</span>
            </>
          ) : (
            <span className="text-base sm:text-lg font-sans font-bold text-[#1a1a1a]">₹{product.price ? parseFloat(product.price).toFixed(2) : '0.00'}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Converts a stored ISO date into the local "YYYY-MM-DDTHH:mm" shape <input type="datetime-local"> expects
function toDatetimeLocalValue(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function Products() {
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'
  const [step, setStep] = useState(1); // 1 = required fields, 2 = optional fields
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [formData, setFormData] = useState({
    productName: '', price: '', category: 'General', purity: '', description: '', discount: 0, offerPrice: 0, offertime: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [categoryOther, setCategoryOther] = useState(false); // true when Category is set to a custom (non-preset) value

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

  // Handle local image preview generation (shared by native picker and drag-and-drop)
  const applyImageFile = (file) => {
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleFileChange = (e) => applyImageFile(e.target.files[0]);

  const handleNextStep = () => {
    if (!formData.productName.trim() || !formData.category.trim() || !formData.price || !formData.description.trim()) {
      showToast('error', 'Please fill in all required fields before continuing.');
      return;
    }
    if (!imageFile && !formData.imageUrl) {
      showToast('error', 'Please upload a product image.');
      return;
    }
    setStep(2);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.productName.trim() || !formData.category.trim() || !formData.price || !formData.description.trim()) {
      showToast('error', 'Please fill in all required fields before continuing.');
      setStep(1);
      return;
    }

    if (!imageFile && !formData.imageUrl) {
      showToast('error', 'Please upload a product image.');
      setStep(1);
      return;
    }

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
        offerPrice: parseFloat(formData.offerPrice),
        offertime: formData.offertime ? new Date(formData.offertime).toISOString() : null
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
      purity: product.purity || '',
      description: product.description || '',
      discount: product.discount,
      offerPrice: product.offerPrice,
      offertime: toDatetimeLocalValue(product.offertime),
      imageUrl: product.imageUrl || ''
    });
    setImagePreview(product.imageUrl || null);
    setCategoryOther(!!product.category && !CATEGORY_PRESETS.includes(product.category));
    setEditingId(product._id);
    setStep(1);
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
    setFormData({ productName: '', price: '', category: 'General', purity: '', description: '', discount: 0, offerPrice: 0, offertime: '' });
    setImageFile(null);
    setImagePreview(null);
    setCategoryOther(false);
    setEditingId(null);
    setStep(1);
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
            <p className="text-[13px] text-on-surface-variant mt-0.5">
              {step === 1 ? 'Step 1 of 2 — Required details' : 'Step 2 of 2 — Optional details'}
            </p>
          </div>
        </div>

        {/* Step indicator — inactive step keeps a readable (not faint) label/number via the
            on-surface-variant token, hierarchy comes from the filled vs. outlined badge, not from washing the text out */}
        <div className="flex items-center gap-2 mb-6 px-1">
          <div className={`flex items-center gap-2 text-[12px] font-bold ${step === 1 ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] ${step === 1 ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant ring-1 ring-outline/30'}`}>1</span>
            Required
          </div>
          <div className="flex-1 h-px bg-outline/20" />
          <div className={`flex items-center gap-2 text-[12px] font-bold ${step === 2 ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] ${step === 2 ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant ring-1 ring-outline/30'}`}>2</span>
            Optional
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)] space-y-6">
          {step === 1 ? (
            <>
              {/* Basic info */}
              <div className={SECTION_GROUP}>
                <div className="space-y-1.5">
                  <label className={FIELD_LABEL}>Product Name<Required /></label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Sapphire Halo"
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    required
                    className={FIELD_INPUT}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={FIELD_LABEL}>Category<Required /></label>
                  <div className="relative">
                    <select
                      value={categoryOther ? 'other' : (formData.category || 'General')}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === 'other') {
                          setCategoryOther(true);
                          setFormData({ ...formData, category: '' });
                        } else {
                          setCategoryOther(false);
                          setFormData({ ...formData, category: value });
                        }
                      }}
                      required
                      className={`${FIELD_INPUT} appearance-none pr-10 cursor-pointer`}
                    >
                      {CATEGORY_PRESETS.map((preset) => (
                        <option key={preset} value={preset}>{preset}</option>
                      ))}
                      <option value="other">Other (type custom)</option>
                    </select>
                    <ChevronDown size={16} strokeWidth={2.5} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  </div>
                  {categoryOther && (
                    <input
                      type="text"
                      placeholder="Type a custom category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className={`${FIELD_INPUT} mt-1.5`}
                    />
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className={SECTION_GROUP}>
                <div className="space-y-1.5">
                  <label className={FIELD_LABEL}>Original Price (₹)<Required /></label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                    className={FIELD_INPUT}
                  />
                </div>
              </div>

              {/* Description */}
              <div className={SECTION_GROUP}>
                <div className="space-y-1.5">
                  <label className={FIELD_LABEL}>Details<Required /></label>
                  <textarea
                    rows={4}
                    placeholder="Craftsmanship notes, materials, or anything else shown on the product's detail page"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    className={`${FIELD_INPUT} resize-none`}
                  />
                </div>
              </div>

              {/* Media */}
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className={FIELD_LABEL}>Product Asset Image<Required /></label>
                  <div
                    className={`relative w-full h-40 rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden has-focus-visible:ring-2 has-focus-visible:ring-primary has-focus-visible:ring-offset-2 ${
                      isDragOver
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-outline/60 bg-white has-hover:border-primary has-hover:bg-primary/3'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      onDragEnter={() => setIsDragOver(true)}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={() => setIsDragOver(false)}
                      aria-label="Upload product image"
                      className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="pointer-events-none flex flex-col items-center justify-center w-full h-full">
                      {imagePreview ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${imagePreview})` }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center px-4">
                          <Upload className="w-8 h-8 text-primary/70 mb-2" />
                          <p className="text-[13px] text-gray-900 font-bold">Click to upload, or drag & drop</p>
                          <p className="text-[11px] text-on-surface-variant mt-0.5">PNG, JPG or WEBP formats allowed</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { resetForm(); setView('list'); }}
                  className={`px-5 py-2.5 border border-outline text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors font-semibold text-[13px] shadow-sm ${BUTTON_FOCUS}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className={`flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg shadow-md hover:bg-on-primary-fixed transition-all font-semibold text-[13px] ${BUTTON_FOCUS}`}
                >
                  Next: Optional Details
                  <ArrowRight size={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Material */}
              <div className={SECTION_GROUP}>
                <div className="space-y-1.5">
                  <label className={FIELD_LABEL}>Purity / Material</label>
                  <div className="flex flex-wrap gap-2">
                    {PURITY_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setFormData({...formData, purity: preset})}
                        className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${BUTTON_FOCUS} ${
                          formData.purity === preset
                            ? 'bg-primary border-primary text-white'
                            : 'bg-white border-outline text-gray-600 hover:border-primary/50'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Or type a custom purity/material — leave blank to show none"
                    value={formData.purity}
                    onChange={(e) => setFormData({...formData, purity: e.target.value})}
                    className={FIELD_INPUT}
                  />
                  <p className="text-[11px] text-on-surface-variant">Only shows on the product card and detail page if set — leaving it blank shows no purity label at all.</p>
                </div>
              </div>

              {/* Pricing */}
              <div className={SECTION_GROUP}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={FIELD_LABEL}>Discount (%)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.discount}
                      onChange={(e) => setFormData({...formData, discount: e.target.value})}
                      className={FIELD_INPUT}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={FIELD_LABEL}>Offer Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.offerPrice}
                      onChange={(e) => setFormData({...formData, offerPrice: e.target.value})}
                      className={FIELD_INPUT}
                    />
                  </div>
                </div>
              </div>

              {/* Scheduling */}
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className={FIELD_LABEL}>Offer Ends At</label>
                  <input
                    type="datetime-local"
                    value={formData.offertime}
                    onChange={(e) => setFormData({...formData, offertime: e.target.value})}
                    className={FIELD_INPUT}
                  />
                  <p className="text-[11px] text-on-surface-variant">Shows a live countdown badge on the storefront card until this time. Leave blank for no countdown.</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`flex items-center gap-2 px-5 py-2.5 border border-outline text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors font-semibold text-[13px] shadow-sm ${BUTTON_FOCUS}`}
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-5 py-2.5 border border-outline text-gray-700 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-60 transition-colors font-semibold text-[13px] shadow-sm ${BUTTON_FOCUS}`}
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg shadow-md hover:bg-on-primary-fixed disabled:bg-gray-400 transition-all font-semibold text-[13px] ${BUTTON_FOCUS}`}
                  >
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    {view === 'add' ? 'Create Product' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </>
          )}
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
            className="px-4 bg-[#540411] text-white rounded-lg hover:bg-on-primary-fixed transition-all text-[13px] font-semibold flex items-center justify-center shadow-sm disabled:opacity-60"
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
            className="flex items-center gap-2 px-5 py-2.5 bg-[#540411] text-white rounded-lg shadow-md hover:bg-on-primary-fixed transition-all font-semibold text-[13px]"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Main Grid View Dashboard Container */}
      {showSkeleton ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-12">
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
              className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-[#540411] text-white rounded-lg shadow-md hover:bg-on-primary-fixed transition-all font-semibold text-[13px]"
            >
              <Plus size={16} />
              Add Product
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-12">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={startEdit}
              onDelete={setDeleteTarget}
            />
          ))}

          {/* Conditionally hide the Add button placeholder during active searches/filters */}
          {!isSearching && !showOfferOnly && (
            <button
              onClick={() => { resetForm(); setView('add'); }}
              className="flex flex-col items-center justify-center border border-dashed border-gray-200 bg-white rounded-[20px] aspect-[3/4] group hover:border-[#540411] hover:bg-[#ffecec]/10 transition-all duration-500 w-full"
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
