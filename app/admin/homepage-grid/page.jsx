"use client";

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Upload, Loader2, ImageOff, Search } from 'lucide-react';
import adminApi from '@/lib/adminApi';

const MAX_SLOTS = 6;

export default function HomepageGridPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get('/products?limit=500');
      const list = data.products || [];
      setProducts(list);
      // Checkboxes reflect what's currently live on the homepage grid
      setSelectedIds(new Set(list.filter((p) => p.featured).map((p) => p._id)));
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      if (prev.has(id)) {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }
      if (prev.size >= MAX_SLOTS) {
        showToast('error', `You can only feature up to ${MAX_SLOTS} products on the homepage grid.`);
        return prev;
      }
      return new Set(prev).add(id);
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.put('/products', { featuredIds: Array.from(selectedIds) });
      await fetchProducts();
      showToast('success', `Homepage grid updated with ${selectedIds.size} product${selectedIds.size === 1 ? '' : 's'}.`);
    } catch (err) {
      console.error("Failed to update homepage grid:", err);
      showToast('error', 'Failed to update homepage grid. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const visibleProducts = searchQuery.trim()
    ? products.filter((p) => p.productName.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : products;

  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-[1200px] mx-auto px-4 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-8">
        <div>
          <h1 className="text-[22px] font-sans font-bold text-[#540411] tracking-tight">Homepage Product Grid</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Pick exactly which products appear in the &ldquo;Selected Masterpieces&rdquo; section on the homepage.
            Unpicked slots automatically fill in with your newest products.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#540411] text-white rounded-lg shadow-md hover:bg-[#400009] transition-all font-semibold text-[13px] disabled:opacity-70 shrink-0"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          Save Homepage Grid ({selectedIds.size}/{MAX_SLOTS})
        </button>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] focus:ring-1 focus:ring-[#540411] transition-all text-[14px] text-gray-900 placeholder:text-gray-400 shadow-sm"
        />
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading products...</p>
      ) : visibleProducts.length === 0 ? (
        <p className="text-sm text-gray-400">
          {searchQuery.trim() ? `No products match "${searchQuery}"` : 'No products yet. Add some from the Product Catalog first.'}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visibleProducts.map((product) => {
            const isChecked = selectedIds.has(product._id);
            return (
              <label
                key={product._id}
                className={`relative flex flex-col border rounded-[20px] p-3 cursor-pointer select-none transition-all duration-300 ${
                  isChecked ? 'border-[#540411] bg-[#ffecec]/10 ring-1 ring-[#540411]' : 'border-gray-100 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSelect(product._id)}
                  className="absolute top-3 right-3 z-10 w-5 h-5 accent-[#540411] cursor-pointer"
                />
                <div className="relative aspect-square w-full overflow-hidden rounded-[14px] bg-gray-50 mb-3">
                  {product.imageUrl ? (
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.imageUrl})` }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageOff size={22} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <h4 className="text-[14px] text-gray-900 font-sans font-bold tracking-tight truncate px-1">{product.productName}</h4>
                <p className="text-[12px] text-gray-400 font-sans mt-0.5">₹{parseFloat(product.price).toFixed(2)}</p>
              </label>
            );
          })}
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-semibold z-50 ${
          toast.type === 'success' ? 'bg-[#1b3a2f] text-white' : 'bg-[#5c1a1a] text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
