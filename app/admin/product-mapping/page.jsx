"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Layers, Users, Home, X, ArrowRight, Loader2, Sparkles, Pencil, Trash2 } from 'lucide-react';
import adminApi from '@/lib/adminApi';

const EMPTY_FORM = { title: '', gender: 'All', minAge: '18', maxAge: '60', homepageZone: 'None', description: '' };

export default function ProductMappingDashboard() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [collections, setCollections] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [modalForm, setModalForm] = useState(EMPTY_FORM);

  const fetchCollections = async () => {
    try {
      const res = await adminApi.get('/products-mapping');
      setCollections(res.data.collections || []);
    } catch (err) {
      console.error("Failed to load repositories:", err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setModalForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (folder, e) => {
    e.stopPropagation();
    setEditingId(folder._id);
    setModalForm({
      title: folder.title || '',
      gender: folder.gender || 'All',
      minAge: String(folder.minAge ?? 18),
      maxAge: String(folder.maxAge ?? 60),
      homepageZone: folder.homepageZone || 'None',
      description: folder.description || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmitMapping = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await adminApi.put(`/products-mapping?id=${editingId}`, modalForm);
      } else {
        await adminApi.post('/products-mapping', modalForm);
      }
      setShowModal(false);
      setEditingId(null);
      setModalForm(EMPTY_FORM);
      fetchCollections();
    } catch (err) {
      console.error("Saving mapping asset error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMapping = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this collection? This cannot be undone.")) return;
    try {
      setDeletingId(id);
      await adminApi.delete(`/products-mapping?id=${id}`);
      setCollections((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete collection:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-[1200px] mx-auto px-4 pt-6">

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-8">
        <div>
          <h1 className="text-[22px] font-sans font-bold text-[#540411] tracking-tight">Product Collections</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Group products by gender and age, and feature them across the homepage.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#540411] text-white rounded-lg shadow-md hover:bg-[#400009] transition-all font-semibold text-[13px]"
        >
          <Plus size={16} />
          New Collection
        </button>
      </div>

      {/* Main Grid Deck */}
      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 bg-white rounded-[24px] border border-dashed border-gray-200">
          <div className="w-14 h-14 rounded-full bg-[#ffecec] flex items-center justify-center text-[#540411] mb-4">
            <Sparkles size={24} />
          </div>
          <p className="text-[14px] text-gray-700 font-semibold">No collections yet</p>
          <p className="text-[13px] text-gray-400 mt-1 max-w-xs">Create your first collection to start grouping products by audience.</p>
          <button
            onClick={openCreateModal}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-[#540411] text-white rounded-lg shadow-md hover:bg-[#400009] transition-all font-semibold text-[13px]"
          >
            <Plus size={16} />
            New Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((folder) => (
            <div
              key={folder._id}
              onClick={() => router.push(`/admin/product-mapping/${folder._id}`)}
              className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_28px_rgba(84,4,17,0.08)] hover:-translate-y-1 hover:border-[#540411]/20 cursor-pointer group transition-all duration-300 relative flex flex-col min-h-[200px]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-[#ffecec] text-[#540411] group-hover:bg-[#540411] group-hover:text-white transition-colors duration-300">
                  <Layers size={22} />
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 font-sans text-[11px] font-semibold rounded-full flex items-center gap-1">
                      <Users size={12} /> {folder.gender}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 font-sans text-[11px] font-semibold rounded-full">
                      Age {folder.minAge}-{folder.maxAge}
                    </span>
                  </div>

                  {folder.homepageZone && folder.homepageZone !== "None" && (
                    <span className="px-2.5 py-1 bg-[#540411] text-white font-sans text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 shadow-sm">
                      <Home size={10} /> {folder.homepageZone}
                    </span>
                  )}

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => openEditModal(folder, e)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#540411] hover:bg-[#ffecec] transition-colors"
                      title="Edit collection"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteMapping(folder._id, e)}
                      disabled={deletingId === folder._id}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Delete collection"
                    >
                      {deletingId === folder._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <h2 className="text-[17px] text-gray-900 font-sans font-bold tracking-tight mb-1 group-hover:text-[#540411] transition-colors">{folder.title}</h2>
              <p className="text-[13px] text-gray-500 line-clamp-2 font-sans mb-4">{folder.description || 'No description added yet.'}</p>

              <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-[12px] font-bold text-[#540411] tracking-wide uppercase font-sans">
                <span>{folder.productIds?.length || 0} Product{folder.productIds?.length === 1 ? '' : 's'}</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pop-up Modal Creation Engine */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl max-w-md w-full border border-gray-100 p-8 space-y-6 animate-in zoom-in-95 duration-300">

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-sans font-bold text-gray-900 tracking-tight">{editingId ? 'Edit Collection' : 'New Collection'}</h3>
                <p className="text-[12px] text-gray-500">
                  {editingId ? 'Update who this collection is for and where it appears.' : 'Define who this collection is for and where it appears.'}
                </p>
              </div>
              <button onClick={closeModal} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitMapping} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Collection Title *</label>
                <input
                  type="text" required placeholder="e.g. Bridal Edit for Gen Z"
                  value={modalForm.title} onChange={(e) => setModalForm({...modalForm, title: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] text-[14px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Homepage Placement</label>
                <select
                  value={modalForm.homepageZone} onChange={(e) => setModalForm({...modalForm, homepageZone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] text-[14px] font-medium text-gray-700"
                >
                  <option value="None">None (collection only)</option>
                  <optgroup label="New Launch Spotlight">
                    <option value="New Launch">New Launch Section</option>
                  </optgroup>
                  <optgroup label="Featured Collections">
                    <option value="Featured 1">Featured Collection 1</option>
                    <option value="Featured 2">Featured Collection 2</option>
                    <option value="Featured 3">Featured Collection 3</option>
                  </optgroup>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Target Gender</label>
                <select
                  value={modalForm.gender} onChange={(e) => setModalForm({...modalForm, gender: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] text-[14px]"
                >
                  <option value="All">Everyone</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Minimum Age</label>
                  <input
                    type="number" min="0" max="120" value={modalForm.minAge}
                    onChange={(e) => setModalForm({...modalForm, minAge: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] text-[14px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Maximum Age</label>
                  <input
                    type="number" min="0" max="120" value={modalForm.maxAge}
                    onChange={(e) => setModalForm({...modalForm, maxAge: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] text-[14px]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description</label>
                <textarea
                  rows={2} placeholder="Shown as the homepage copy if placed in New Launch or a Featured Collection spot"
                  value={modalForm.description} onChange={(e) => setModalForm({...modalForm, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] text-[14px] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button" onClick={closeModal}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-[13px] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 bg-[#540411] text-white rounded-lg hover:bg-[#400009] text-[13px] font-semibold transition-colors disabled:opacity-70"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create Collection'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
