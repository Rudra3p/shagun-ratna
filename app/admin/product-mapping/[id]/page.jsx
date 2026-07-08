"use client";

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, CheckCircle, Circle, Trash2, Layers, Save, Loader2, Users, PackageSearch, Home } from 'lucide-react';
import adminApi from '@/lib/adminApi';

export default function RepositoryDetailView({ params }) {
  const router = useRouter();
  const { id: folderId } = use(params);

  const [folder, setFolder] = useState(null);
  const [assignedProducts, setAssignedProducts] = useState([]);
  const [allInventory, setAllInventory] = useState([]);

  const [showSelectorModal, setShowSelectorModal] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [saving, setSaving] = useState(false);

  const loadFolderDetails = async () => {
    try {
      const [folderRes, productsRes] = await Promise.all([
        adminApi.get(`/products-mapping?id=${folderId}`),
        adminApi.get(`/products?limit=100`)
      ]);

      const targetFolder = folderRes.data.collection;
      setFolder(targetFolder);
      setAllInventory(productsRes.data.products || []);

      const assignedIds = targetFolder.productIds || [];
      setSelectedProductIds(assignedIds);

      const matched = (productsRes.data.products || []).filter((p) => assignedIds.includes(p._id));
      setAssignedProducts(matched);
    } catch (err) {
      console.error("Failed to load sub-repository map:", err);
    }
  };

  useEffect(() => {
    if (folderId) {
      loadFolderDetails();
    }
  }, [folderId]);

  const toggleProductSelection = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleRemoveProduct = async (productId) => {
    const updatedIds = selectedProductIds.filter((id) => id !== productId);
    try {
      await adminApi.put(`/products-mapping?id=${folderId}`, { productIds: updatedIds });
      setSelectedProductIds(updatedIds);
      setAssignedProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Failed to delete mapping entry index:", err);
    }
  };

  const handleSaveSelections = async () => {
    setSaving(true);
    try {
      await adminApi.put(`/products-mapping?id=${folderId}`, { productIds: selectedProductIds });
      setShowSelectorModal(false);
      loadFolderDetails();
    } catch (err) {
      console.error("Failed to commit selected mappings array updates:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!folder) {
    return (
      <div className="flex items-center justify-center gap-2.5 py-24 text-gray-400 font-sans text-[13px]">
        <Loader2 size={16} className="animate-spin" />
        Loading collection...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-[1200px] mx-auto px-4 pt-6">

      {/* Structural Back Navigation & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/product-mapping')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="p-2.5 rounded-xl bg-[#ffecec] text-[#540411] shrink-0">
            <Layers size={20} />
          </div>
          <div>
            <h1 className="text-[20px] font-sans font-bold text-gray-900 tracking-tight">{folder.title}</h1>
            <p className="text-[12px] text-gray-500 mt-0.5">{folder.description || 'No description added yet.'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:ml-auto">
          <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 font-sans text-[11px] font-semibold rounded-full flex items-center gap-1">
            <Users size={12} /> {folder.gender}
          </span>
          <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 font-sans text-[11px] font-semibold rounded-full">
            Age {folder.minAge}-{folder.maxAge}
          </span>
          {folder.homepageZone && folder.homepageZone !== "None" && (
            <span className="px-2.5 py-1 bg-[#540411] text-white font-sans text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 shadow-sm">
              <Home size={10} /> {folder.homepageZone}
            </span>
          )}
        </div>
      </div>

      {/* Grid Subheader Row */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-[15px] font-sans font-bold text-gray-800 uppercase tracking-wider">Products in This Collection ({assignedProducts.length})</h2>
        <button
          onClick={() => setShowSelectorModal(true)}
          className="flex items-center gap-2 px-4 py-2 border border-[#540411] text-[#540411] bg-white rounded-lg hover:bg-[#ffecec]/30 font-semibold text-[13px] transition-all shadow-sm"
        >
          <Plus size={14} />
          Add Products
        </button>
      </div>

      {/* Dynamic Products Display Deck */}
      {assignedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-[#fdfbf7] rounded-[24px] border border-dashed border-gray-200">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-gray-300 mb-4 shadow-sm">
            <PackageSearch size={24} />
          </div>
          <p className="text-[14px] text-gray-700 font-semibold">No products in this collection yet</p>
          <p className="text-[13px] text-gray-400 mt-1 max-w-xs">Add products to start showing them to this audience.</p>
          <button
            onClick={() => setShowSelectorModal(true)}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-[#540411] text-white rounded-lg shadow-md hover:bg-[#400009] transition-all font-semibold text-[13px]"
          >
            <Plus size={16} />
            Add Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {assignedProducts.map((product) => (
            <div key={product._id} className="flex flex-col group transition-all duration-300 bg-white border border-gray-100 rounded-[24px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[18px] bg-[#fdfbf7]">
                {product.imageUrl ? (
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    style={{ backgroundImage: `url(${product.imageUrl})` }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                    <PackageSearch size={22} strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="pt-4 flex flex-col flex-1 text-center items-center">
                <h3 className="text-[15px] text-[#222222] font-sans font-bold tracking-tight truncate w-full">{product.productName}</h3>
                <p className="text-[12px] text-gray-500 font-sans mt-0.5">${parseFloat(product.price).toFixed(2)}</p>

                <button
                  onClick={() => handleRemoveProduct(product._id)}
                  className="mt-4 flex items-center justify-center gap-1.5 w-full py-2 border border-gray-100 text-gray-500 hover:text-red-600 hover:bg-red-50/50 hover:border-red-100 transition-all rounded-xl text-[12px] font-semibold"
                >
                  <Trash2 size={12} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Visual Slid-out Selector Drawer overlay */}
      {showSelectorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-end animate-in fade-in duration-200">
          <div className="bg-white h-full max-w-2xl w-full border-l border-gray-100 p-8 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">

            <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-[18px] font-sans font-bold text-gray-900 tracking-tight">Add Products</h3>
                <p className="text-[12px] text-gray-500">Tap a product to add or remove it from this collection.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveSelections} disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#540411] text-white rounded-lg hover:bg-[#400009] text-[13px] font-semibold shadow-md transition-all disabled:opacity-70"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save Changes
                </button>
                <button
                  onClick={() => setShowSelectorModal(false)}
                  className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-[13px]"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 gap-4 pb-10">
              {allInventory.map((item) => {
                const isChecked = selectedProductIds.includes(item._id);
                return (
                  <div
                    key={item._id}
                    onClick={() => toggleProductSelection(item._id)}
                    className={`relative flex flex-col border rounded-[20px] p-3 cursor-pointer select-none transition-all duration-300 ${
                      isChecked ? 'border-[#540411] bg-[#ffecec]/10 ring-1 ring-[#540411]' : 'border-gray-100 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="absolute top-5 right-5 z-10">
                      {isChecked ? (
                        <CheckCircle size={22} className="text-[#540411] fill-white" />
                      ) : (
                        <Circle size={22} className="text-gray-300 bg-white rounded-full" />
                      )}
                    </div>

                    <div className="relative aspect-square w-full overflow-hidden rounded-[14px] bg-gray-50 mb-3">
                      {item.imageUrl && <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.imageUrl})` }} />}
                    </div>
                    <h4 className="text-[14px] text-gray-900 font-sans font-bold tracking-tight text-center truncate px-1">{item.productName}</h4>
                    <p className="text-[12px] text-gray-400 text-center font-sans mt-0.5">${parseFloat(item.price).toFixed(2)}</p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
