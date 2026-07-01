"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Folder, Users, Home, X, ArrowRight, Loader2 } from 'lucide-react';
import adminApi from '@/lib/adminApi';

export default function ProductMappingDashboard() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  
  const [modalForm, setModalForm] = useState({
    title: '',
    gender: 'All',
    minAge: '18',
    maxAge: '60',
    homepageZone: 'None', 
    description: ''
  });

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

  const handleCreateMapping = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminApi.post('/products-mapping', modalForm);
      setShowModal(false);
      setModalForm({ title: '', gender: 'All', minAge: '18', maxAge: '60', homepageZone: 'None', description: '' });
      fetchCollections();
    } catch (err) {
      console.error("Creation mapping asset error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-[1200px] mx-auto px-4 pt-6">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-8">
        <div>
          <h1 className="text-[22px] font-sans font-bold text-[#540411] tracking-tight">Smart Demographics Repositories</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Manage grouped targeting inventory folders mapped by consumer rules.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#540411] text-white rounded-lg shadow-md hover:bg-[#400009] transition-all font-semibold text-[13px]"
        >
          <Plus size={16} />
          Create New Mapping
        </button>
      </div>

      {/* Main Grid Deck */}
      {collections.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[24px] border border-dashed border-gray-200 text-gray-400 font-sans text-[14px]">
          No dynamic smart collection folders mapped yet. Click "Create New Mapping" above to spawn your first profile structure folder.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((folder) => (
            <div 
              key={folder._id}
              onClick={() => router.push(`/admin/product-mapping/${folder._id}`)}
              className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(84,4,17,0.06)] hover:border-[#540411]/20 cursor-pointer group transition-all duration-300 relative flex flex-col min-h-[200px]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-[#ffecec] text-[#540411] group-hover:bg-[#540411] group-hover:text-white transition-colors duration-300">
                  <Folder size={24} />
                </div>
                
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex gap-1.5">
                    <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 font-sans text-[11px] font-semibold rounded-md flex items-center gap-1">
                      <Users size={12} /> {folder.gender}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 font-sans text-[11px] font-semibold rounded-md">
                      Age {folder.minAge}-{folder.maxAge}
                    </span>
                  </div>

                  {folder.homepageZone && folder.homepageZone !== "None" && (
                    <span className="px-2.5 py-0.5 bg-[#540411] text-white font-sans text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 shadow-sm">
                      <Home size={10} /> {folder.homepageZone}
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-[17px] text-gray-900 font-sans font-bold tracking-tight mb-1 group-hover:text-[#540411] transition-colors">{folder.title}</h2>
              <p className="text-[13px] text-gray-500 line-clamp-2 font-sans mb-4">{folder.description || 'No custom description attached.'}</p>
              
              <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-[12px] font-bold text-[#540411] tracking-wide uppercase font-sans">
                <span>View Assigned Items ({folder.productIds?.length || 0})</span>
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
                <h3 className="text-[18px] font-sans font-bold text-gray-900 tracking-tight">Setup Demographics Rules</h3>
                <p className="text-[12px] text-gray-500">Inject automated target scopes into custom folder repositories.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateMapping} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Repository Title *</label>
                <input 
                  type="text" required placeholder="e.g. Generation Z Summer Trend"
                  value={modalForm.title} onChange={(e) => setModalForm({...modalForm, title: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] text-[14px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Link to Homepage Feature Slot</label>
                <select 
                  value={modalForm.homepageZone} onChange={(e) => setModalForm({...modalForm, homepageZone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] text-[14px] font-medium text-gray-700"
                >
                  <option value="None">None (Standard Collection Folder)</option>
                  <option value="Card 1">Homepage Feature Spot 1</option>
                  <option value="Card 2">Homepage Feature Spot 2</option>
                  <option value="Card 3">Homepage Feature Spot 3</option>
                  <option value="Card 4">Homepage Feature Spot 4</option>
                  <option value="Card 5">Homepage Feature Spot 5</option>
                  <option value="Card 6">Homepage Feature Spot 6</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Target Audience Segment</label>
                <select 
                  value={modalForm.gender} onChange={(e) => setModalForm({...modalForm, gender: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] text-[14px]"
                >
                  <option value="All">All Audiences</option>
                  <option value="Male">Male Segments</option>
                  <option value="Female">Female Segments</option>
                  <option value="Unisex">Unisex Lineup</option>
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
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description Space</label>
                <textarea 
                  rows={2} placeholder="Optional profiling context text details..."
                  value={modalForm.description} onChange={(e) => setModalForm({...modalForm, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#540411] text-[14px] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button 
                  type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-[13px] font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 bg-[#540411] text-white rounded-lg hover:bg-[#400009] text-[13px] font-semibold transition-colors"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  Create Folder
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}