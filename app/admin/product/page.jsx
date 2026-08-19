"use client";

import { useEffect, useRef, useState } from 'react';
import adminApi from '@/lib/adminApi';
import Badge from '@/components/Badge';
import { formatCategory, MATERIAL_CATEGORIES } from '@/lib/formatCategory';
import {
  Search, Tag, Plus, Edit2, Trash2, ArrowLeft, Upload, Loader2,
  CheckCircle2, AlertCircle, PackageSearch, ImageOff, ChevronDown, Sparkles, X
} from 'lucide-react';

const PURITY_PRESETS = ['22K Pure Gold', '18K Gold', '14K Gold', '925 Silver', 'Platinum'];

const CATEGORY_PRESETS = [
  'General', ...MATERIAL_CATEGORIES, 'Bridal', 'Heirloom', 'Contemporary',
  'Traditional', 'Rings', 'Necklaces', 'Earrings', 'Bangles', 'Bracelets', 'Pendants'
];

// Shared field styling so every input in the form meets WCAG AA contrast and gets a
// consistent keyboard focus-visible ring (see :root tokens in app/globals.css)
const FIELD_INPUT = "w-full px-4 py-2.5 bg-white border border-outline rounded-lg text-[14px] text-gray-900 placeholder:text-on-surface-variant shadow-sm transition-all focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1";
const BUTTON_FOCUS = "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white";

// The form is a live mirror of the real product page — these inputs are borderless until
// you interact with them (hover shows a faint dashed line, focus shows the brand color),
// so editing feels like clicking directly into the final page rather than filling a form.
const GHOST_INPUT = "bg-transparent border-b-2 border-dashed border-transparent hover:border-outline/40 focus:border-primary focus:outline-none transition-colors";

// Decorative required-field marker — the native `required` attribute already announces
// "required" to screen readers, so the asterisk itself is hidden from assistive tech.
function Required() {
  return <span className="text-primary font-bold ml-0.5" aria-hidden="true">*</span>;
}

// Small click-to-edit popover — closes on outside click. Used for Purity, Category, and
// Discount/Offer so the main view stays an exact, uncluttered mirror of the live product
// page, with the editing controls tucked behind a click rather than always on screen.
function EditPopover({ trigger, isOpen, onClose, children, width = 'w-64' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  return (
    <div className="relative inline-block" ref={ref}>
      {trigger}
      {isOpen && (
        <div className={`absolute z-30 top-full left-0 mt-2 ${width} bg-white rounded-xl shadow-xl border border-gray-100 p-4 animate-in fade-in zoom-in-95 duration-150`}>
          {children}
        </div>
      )}
    </div>
  );
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
          {formatCategory(product.category) || 'General'}
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [formData, setFormData] = useState({
    productName: '', price: '', category: ['General'], purity: '', description: '', discount: 0, offerPrice: 0, offertime: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState(''); // typing buffer for the "add your own category" field
  const [isAddingCategory, setIsAddingCategory] = useState(false); // true while the inline "+ Add" pill is showing its text input
  // Custom (non-preset) categories typed in this session — kept separate from formData.category
  // so deselecting one (the X button) just toggles it off instead of deleting it from the list.
  const [customCategoriesAdded, setCustomCategoriesAdded] = useState([]);
  const [openPopover, setOpenPopover] = useState(null); // 'purity' | 'category' | 'discount' | null

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

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.productName.trim() || !formData.category?.length || !formData.price || !formData.description.trim()) {
      showToast('error', 'Please fill in all required fields before saving.');
      return;
    }

    if (!imageFile && !formData.imageUrl) {
      showToast('error', 'Please upload a product image.');
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
    // Legacy documents may still hold a single string; normalize to an array either way.
    const categories = Array.isArray(product.category)
      ? product.category
      : (product.category ? [product.category] : ['General']);
    setFormData({
      productName: product.productName,
      price: product.price,
      category: categories,
      purity: product.purity || '',
      description: product.description || '',
      discount: product.discount,
      offerPrice: product.offerPrice,
      offertime: toDatetimeLocalValue(product.offertime),
      imageUrl: product.imageUrl || ''
    });
    setImagePreview(product.imageUrl || null);
    setCustomCategoryInput('');
    setCustomCategoriesAdded(categories.filter((c) => !CATEGORY_PRESETS.includes(c)));
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
    setFormData({ productName: '', price: '', category: ['General'], purity: '', description: '', discount: 0, offerPrice: 0, offertime: '' });
    setImageFile(null);
    setImagePreview(null);
    setCustomCategoryInput('');
    setIsAddingCategory(false);
    setCustomCategoriesAdded([]);
    setEditingId(null);
    setOpenPopover(null);
  };

  const visibleProducts = showOfferOnly ? products.filter(p => p.discount > 0) : products;
  const showSkeleton = loading && products.length === 0;
  const showEmpty = !loading && visibleProducts.length === 0;

  // Live discount preview for the form — mirrors the exact hasDiscount logic used on
  // the actual product page/card, so what the admin sees while editing matches reality.
  const formPrice = Number(formData.price) || 0;
  const formOfferPrice = Number(formData.offerPrice) || 0;
  const formDiscount = Number(formData.discount) || 0;
  const hasDiscountPreview = formPrice > 0 && (formOfferPrice > 0 || formDiscount > 0) && formOfferPrice !== formPrice;
  const effectivePrice = formOfferPrice > 0 ? formOfferPrice : formPrice * (1 - formDiscount / 100);

  // --- RENDERING FORM VIEW (ADD / EDIT) ---
  if (view === 'add' || view === 'edit') {
    return (
      <div className="animate-in fade-in duration-500 pb-10 max-w-[760px] mx-auto">
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
            <p className="flex items-center gap-1.5 text-[13px] text-on-surface-variant mt-0.5">
              <Sparkles size={12} className="text-primary" />
              This is exactly how it'll look on the site — edit it directly below
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-10">
            {/* Left: image, same frame/ratio/gradient as the live product page */}
            <div className="group/img space-y-1.5">
              <div
                className={`relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#F5EFE6] to-[#EDE2CC] ring-1 transition-all duration-300 has-focus-visible:ring-2 has-focus-visible:ring-primary has-focus-visible:ring-offset-2 ${
                  isDragOver ? 'ring-2 ring-primary' : 'ring-[#EBE3D5] has-hover:ring-primary/60'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  onDragEnter={() => setIsDragOver(true)}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={() => setIsDragOver(false)}
                  required={!imagePreview}
                  aria-label="Upload product image"
                  className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="pointer-events-none flex flex-col items-center justify-center w-full h-full">
                  {imagePreview ? (
                    <>
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imagePreview})` }} />
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-sm text-white text-[10px] font-sans font-semibold opacity-0 group-hover/img:opacity-100 transition-opacity">
                        Click to replace
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center px-6 text-[#B8A888]">
                      <Upload className="w-9 h-9 mb-3" strokeWidth={1.5} />
                      <p className="text-[13px] font-sans font-bold text-[#8a7a5f]">Click or drag a photo here</p>
                      <p className="text-[11px] font-sans mt-1">This becomes the main product photo<Required /></p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: editable content, same hierarchy as the live product page */}
            <div className="flex flex-col pt-1">
              {/* Purity, then Category — same order/format as the live eyebrow ("22K Gold • Necklaces"),
                  each a click-to-edit popover so the main view stays uncluttered */}
              <div className="flex items-center flex-wrap gap-1.5 mb-3 text-[11px] font-sans font-semibold uppercase tracking-wide text-[#9C8253]">
                <EditPopover
                  isOpen={openPopover === 'purity'}
                  onClose={() => setOpenPopover(null)}
                  trigger={
                    <button
                      type="button"
                      onClick={() => setOpenPopover(openPopover === 'purity' ? null : 'purity')}
                      className="border-b-2 border-dashed border-transparent hover:border-[#9C8253]/50 focus:outline-none focus-visible:border-primary transition-colors"
                    >
                      {formData.purity || '+ Add Purity'}
                    </button>
                  }
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-3">Purity / Material</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {PURITY_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => { setFormData({...formData, purity: preset}); setOpenPopover(null); }}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${BUTTON_FOCUS} ${
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
                    placeholder="Or type custom — leave blank for none"
                    value={formData.purity}
                    onChange={(e) => setFormData({...formData, purity: e.target.value})}
                    className={`${FIELD_INPUT} normal-case`}
                  />
                </EditPopover>

                {formData.purity && <span className="text-[#9C8253]/50">•</span>}

                <EditPopover
                  width="w-72"
                  isOpen={openPopover === 'category'}
                  onClose={() => setOpenPopover(null)}
                  trigger={
                    <button
                      type="button"
                      onClick={() => setOpenPopover(openPopover === 'category' ? null : 'category')}
                      className="flex items-center gap-0.5 border-b-2 border-dashed border-transparent hover:border-[#9C8253]/50 focus:outline-none focus-visible:border-primary transition-colors max-w-[220px] truncate"
                    >
                      {formatCategory(formData.category) || 'General'}
                      <ChevronDown size={10} strokeWidth={2.5} className="shrink-0" />
                    </button>
                  }
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Category<Required /></p>
                  <p className="text-[10px] text-on-surface-variant mb-3">Select as many as apply — e.g. Gold + Rings. Only materials show on the badge; type tags like Rings stay selected for search.</p>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {/* Presets plus every custom category added this session — options stay visible (and
                        re-selectable) even after being deselected, instead of disappearing when toggled off */}
                    {[...CATEGORY_PRESETS, ...customCategoriesAdded].map((option) => {
                      const isSelected = formData.category?.includes(option);
                      const toggle = () => {
                        const next = isSelected
                          ? formData.category.filter((c) => c !== option)
                          : [...(formData.category || []), option];
                        setFormData({ ...formData, category: next });
                      };
                      return isSelected ? (
                        <span
                          key={option}
                          className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full text-[11px] font-semibold bg-primary border border-primary text-white"
                        >
                          {option}
                          <button
                            type="button"
                            onClick={toggle}
                            aria-label={`Remove ${option}`}
                            className={`rounded-full hover:bg-white/20 p-0.5 ${BUTTON_FOCUS}`}
                          >
                            <X size={10} strokeWidth={3} />
                          </button>
                        </span>
                      ) : (
                        <button
                          key={option}
                          type="button"
                          onClick={toggle}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-white border-outline text-gray-600 hover:border-primary/50 transition-colors ${BUTTON_FOCUS}`}
                        >
                          {option}
                        </button>
                      );
                    })}

                    {/* Add-new lives right in the options row — click to reveal a tiny inline input */}
                    {isAddingCategory ? (
                      <input
                        type="text"
                        autoFocus
                        placeholder="New category"
                        value={customCategoryInput}
                        onChange={(e) => setCustomCategoryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setIsAddingCategory(false);
                            setCustomCategoryInput('');
                          }
                        }}
                        onBlur={() => {
                          const value = customCategoryInput.trim();
                          if (value) {
                            if (!formData.category?.includes(value)) {
                              setFormData({ ...formData, category: [...(formData.category || []), value] });
                            }
                            if (!customCategoriesAdded.includes(value) && !CATEGORY_PRESETS.includes(value)) {
                              setCustomCategoriesAdded([...customCategoriesAdded, value]);
                            }
                          }
                          setCustomCategoryInput('');
                          setIsAddingCategory(false);
                        }}
                        className="w-28 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-primary bg-white text-gray-900 focus:outline-none normal-case"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingCategory(true)}
                        className={`flex items-center gap-0.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-dashed border-outline text-gray-500 hover:border-primary hover:text-primary transition-colors ${BUTTON_FOCUS}`}
                      >
                        <Plus size={10} strokeWidth={3} />
                        Add
                      </button>
                    )}
                  </div>

                  <div className="flex justify-end pt-3 mt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setOpenPopover(null)}
                      className={`px-3 py-1.5 bg-primary text-white rounded-lg font-semibold text-[11px] ${BUTTON_FOCUS}`}
                    >
                      Done
                    </button>
                  </div>
                </EditPopover>
              </div>

              <input
                type="text"
                placeholder="Product Name"
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
                required
                aria-label="Product Name"
                className={`font-brand text-3xl sm:text-4xl text-[#1a1a1a] leading-tight placeholder:text-[#1a1a1a]/35 w-full mb-5 pb-1 ${GHOST_INPUT}`}
              />

              <div className="h-px w-12 bg-[#C5A059]/50 mb-6" />

              <div className="flex items-baseline gap-3 flex-wrap">
                {hasDiscountPreview && (
                  <span className="text-2xl sm:text-3xl font-sans font-bold text-primary">
                    ₹{effectivePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                )}
                <span className="flex items-baseline gap-1.5">
                  {!hasDiscountPreview && <span className="text-2xl sm:text-3xl font-sans font-bold text-[#2D2926]">₹</span>}
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                    aria-label="Original Price"
                    className={
                      hasDiscountPreview
                        ? `text-base text-gray-400 font-medium line-through placeholder:text-gray-300 w-20 pb-1 ${GHOST_INPUT}`
                        : `text-2xl sm:text-3xl font-sans font-bold text-[#2D2926] placeholder:text-[#2D2926]/35 w-36 pb-1 ${GHOST_INPUT}`
                    }
                  />
                </span>

                <EditPopover
                  width="w-72"
                  isOpen={openPopover === 'discount'}
                  onClose={() => setOpenPopover(null)}
                  trigger={
                    <button
                      type="button"
                      onClick={() => setOpenPopover(openPopover === 'discount' ? null : 'discount')}
                      className="text-[11px] font-sans font-semibold uppercase tracking-wide text-primary/70 hover:text-primary underline underline-offset-4 decoration-[#C5A059]/50 hover:decoration-primary transition-colors"
                    >
                      {hasDiscountPreview ? 'Edit discount' : '+ Add discount / offer'}
                    </button>
                  }
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-3">Discount & Offer</p>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Discount (%)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.discount}
                        onChange={(e) => setFormData({...formData, discount: e.target.value})}
                        className={FIELD_INPUT}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Offer Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.offerPrice}
                        onChange={(e) => setFormData({...formData, offerPrice: e.target.value})}
                        className={FIELD_INPUT}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Offer Ends At</label>
                      <input
                        type="datetime-local"
                        value={formData.offertime}
                        onChange={(e) => setFormData({...formData, offertime: e.target.value})}
                        className={FIELD_INPUT}
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({...formData, discount: 0, offerPrice: 0, offertime: ''});
                          setOpenPopover(null);
                        }}
                        className="text-[11px] font-semibold text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenPopover(null)}
                        className={`flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg font-semibold text-[11px] ${BUTTON_FOCUS}`}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </EditPopover>
              </div>

              <textarea
                rows={5}
                placeholder="Add a description — craftsmanship notes, materials, or anything else shown on the piece's detail page…"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                aria-label="Details"
                className="mt-6 text-sm leading-7 text-[#5f5a53] placeholder:text-[#5f5a53]/50 resize-none w-full rounded-lg -mx-2 px-2 py-1 border border-dashed border-transparent hover:border-outline/30 focus:border-primary/50 focus:outline-none bg-transparent transition-colors"
              />

              {/* Same two buttons as the live product page (Inquire / Save), repurposed
                  here as the form's real actions — visually identical, functionally admin */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#90060C] hover:bg-[#730509] text-white font-sans text-xs font-semibold uppercase tracking-[0.2em] rounded-full transition-colors duration-300 shadow-sm disabled:opacity-60"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {view === 'add' ? 'Create Product' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => { resetForm(); setView('list'); }}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 border border-[#EBE3D5] hover:border-[#90060C] text-[#2D2926] font-sans text-xs font-semibold uppercase tracking-[0.2em] rounded-full transition-colors duration-300 cursor-pointer"
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            </div>
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
