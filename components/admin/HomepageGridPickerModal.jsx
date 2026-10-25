"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, ImageOff, Loader2, Sparkles } from 'lucide-react';
import adminApi from '@/lib/adminApi';

const MAX_SLOTS = 6;
const CATEGORIES = ['All', 'Gold', 'Silver', 'Diamond', 'Gemstone'];

export function HomepageGridPickerModal({ isOpen, onClose, onSaved }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    setLoading(true);
    setErrorMessage('');
    setSearchQuery('');
    setActiveCategory('All');

    adminApi.get('/products?limit=500')
      .then((res) => {
        if (cancelled) return;
        const list = res.data?.products || [];
        setProducts(list);
        setSelectedIds(new Set(list.filter((p) => p.featured).map((p) => p._id)));
      })
      .catch((err) => {
        if (!cancelled) setErrorMessage('Failed to load products. Please try again.');
        console.error(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= MAX_SLOTS) {
          setErrorMessage(`You can select at most ${MAX_SLOTS} pieces for the homepage masterpieces grid.`);
          return prev;
        }
        setErrorMessage('');
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage('');
    try {
      await adminApi.put('/products', { featuredIds: Array.from(selectedIds) });
      if (onSaved) await onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to save homepage masterpieces. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = !searchQuery.trim() ||
      p.productName?.toLowerCase().includes(searchQuery.trim().toLowerCase());
    
    if (activeCategory === 'All') return matchesSearch;
    const cats = Array.isArray(p.category) ? p.category : [p.category].filter(Boolean);
    const matchesCat = cats.some((c) => String(c).toLowerCase().includes(activeCategory.toLowerCase()));
    return matchesSearch && matchesCat;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[88vh] bg-[#FDFBF7] border border-[#C5A059]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#C5A059]/20 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#90060c]/10 text-[#90060c] border border-[#C5A059]/30 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="font-serif text-xl md:text-2xl text-[#1a1a1a]">
                  Manage Selected Masterpieces (6 Slots)
                </h3>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  Pick the exact jewelry pieces showcased on the homepage. Unpicked slots automatically show newest pieces.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-sans font-bold border ${
                selectedIds.size === MAX_SLOTS
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-[#90060c]/5 text-[#90060c] border-[#C5A059]/40'
              }`}>
                {selectedIds.size} of {MAX_SLOTS} selected
              </span>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="px-6 py-3.5 bg-[#FAF7F2] border-b border-[#C5A059]/20 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search pieces by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-sans bg-white border border-[#C5A059]/30 rounded-lg focus:outline-none focus:border-[#90060c] focus:ring-1 focus:ring-[#90060c] transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-sans font-medium uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-[#90060c] text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-[#C5A059]/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="px-6 py-2.5 bg-red-50 border-b border-red-200 text-red-700 text-xs font-sans font-medium">
              {errorMessage}
            </div>
          )}

          {/* Product Grid Area */}
          <div className="p-6 overflow-y-auto flex-1 min-h-[300px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                <Loader2 size={24} className="animate-spin text-[#90060c]" />
                <p className="text-xs font-sans">Loading pieces catalog...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm font-sans">
                No jewelry pieces match your search or filter.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {filteredProducts.map((p) => {
                  const isSelected = selectedIds.has(p._id);
                  return (
                    <div
                      key={p._id}
                      onClick={() => toggleSelect(p._id)}
                      className={`relative flex flex-col p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'border-[#90060c] bg-[#90060c]/5 ring-2 ring-[#90060c]/30 shadow-md'
                          : 'border-[#C5A059]/25 hover:border-[#90060c]/60 bg-white'
                      }`}
                    >
                      {/* Checkbox indicator */}
                      <div
                        className={`absolute top-2 right-2 z-10 w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#90060c] text-white shadow-sm'
                            : 'bg-black/30 text-transparent border border-white'
                        }`}
                      >
                        <Check size={12} strokeWidth={3} />
                      </div>

                      {/* Thumbnail */}
                      <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-gray-100 mb-2">
                        {p.imageUrl ? (
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${p.imageUrl})` }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageOff size={20} />
                          </div>
                        )}
                      </div>

                      {/* Title & Price */}
                      <h4 className="font-brand text-xs font-medium text-[#1a1a1a] truncate" title={p.productName}>
                        {p.productName}
                      </h4>
                      <p className="text-[11px] font-sans font-semibold text-[#90060c] mt-0.5">
                        ₹{new Intl.NumberFormat('en-IN').format(Math.round(p.price || 0))}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-white border-t border-[#C5A059]/20 flex items-center justify-between shrink-0">
            <span className="text-xs text-gray-500 font-sans">
              Click any card to select or deselect. Maximum {MAX_SLOTS} featured pieces.
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-sans font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#90060c] hover:bg-[#730509] text-white text-xs font-sans font-semibold tracking-wider uppercase rounded-full shadow-md transition-all disabled:opacity-50 cursor-pointer active:scale-95"
              >
                {saving ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Masterpieces ({selectedIds.size}/{MAX_SLOTS})</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

