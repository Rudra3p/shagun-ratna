"use client";

import { useEffect, useRef, useState } from 'react';
import adminApi from '@/lib/adminApi';
import { SITE_IMAGE_SLOTS } from '@/lib/siteImageSlots';
import { Upload, Loader2, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SiteImagesPage() {
  const [overrides, setOverrides] = useState({}); // { key: imageUrl }
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState(null); // key currently uploading/resetting
  const [toast, setToast] = useState(null);
  const fileInputRefs = useRef({});

  const fetchOverrides = async () => {
    try {
      const res = await adminApi.get('/site-images');
      const map = {};
      for (const doc of res.data.images || []) map[doc.key] = doc.imageUrl;
      setOverrides(map);
    } catch (err) {
      console.error("Failed to load site images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverrides();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = async (slotKey, e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    setBusyKey(slotKey);
    try {
      const { data } = await adminApi.post('/site-images', {
        action: 'get-upload-url',
        fileName: file.name,
        fileType: file.type
      });

      await fetch(data.signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      });

      await adminApi.post('/site-images', { key: slotKey, imageUrl: data.publicUrl });

      setOverrides((prev) => ({ ...prev, [slotKey]: data.publicUrl }));
      showToast('success', 'Image updated.');
    } catch (err) {
      console.error("Site image upload failed:", err);
      showToast('error', 'Upload failed. Please try again.');
    } finally {
      setBusyKey(null);
    }
  };

  const handleReset = async (slotKey) => {
    setBusyKey(slotKey);
    try {
      await adminApi.delete(`/site-images?key=${encodeURIComponent(slotKey)}`);
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[slotKey];
        return next;
      });
      showToast('success', 'Reset to default image.');
    } catch (err) {
      console.error("Site image reset failed:", err);
      showToast('error', 'Reset failed. Please try again.');
    } finally {
      setBusyKey(null);
    }
  };

  const pages = [...new Set(SITE_IMAGE_SLOTS.map((s) => s.page))];

  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-[1200px] mx-auto px-4 pt-6">

      <div className="border-b border-gray-100 pb-6 mb-8">
        <h1 className="text-[22px] font-sans font-bold text-[#540411] tracking-tight">Site Images</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Change any image shown on the homepage or about page.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2.5 py-24 text-gray-400 font-sans text-[13px]">
          <Loader2 size={16} className="animate-spin" />
          Loading images...
        </div>
      ) : (
        pages.map((pageName) => (
          <div key={pageName} className="mb-10">
            <h2 className="text-[15px] font-sans font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-4 mb-6">
              {pageName} Page
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SITE_IMAGE_SLOTS.filter((s) => s.page === pageName).map((slot) => {
                const currentSrc = overrides[slot.key] || slot.defaultSrc;
                const isOverridden = Boolean(overrides[slot.key]);
                const isBusy = busyKey === slot.key;

                return (
                  <div
                    key={slot.key}
                    className="bg-white border border-gray-100 rounded-[20px] p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex flex-col"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] bg-[#fdfbf7] mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentSrc}
                        alt={slot.label}
                        className="w-full h-full object-cover"
                      />
                      {isBusy && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 size={22} className="animate-spin text-white" />
                        </div>
                      )}
                      <span className={`absolute top-2.5 right-2.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm ${
                        isOverridden ? 'bg-[#540411] text-white' : 'bg-white/90 text-gray-500'
                      }`}>
                        {isOverridden ? 'Custom' : 'Default'}
                      </span>
                    </div>

                    <h3 className="text-[13px] text-gray-900 font-sans font-bold tracking-tight mb-3">{slot.label}</h3>

                    <div className="mt-auto flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={(el) => { fileInputRefs.current[slot.key] = el; }}
                        onChange={(e) => handleFileChange(slot.key, e)}
                      />
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => fileInputRefs.current[slot.key]?.click()}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#540411] text-white rounded-lg hover:bg-[#400009] transition-all font-semibold text-[12px] disabled:opacity-60"
                      >
                        <Upload size={13} />
                        Change
                      </button>
                      {isOverridden && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleReset(slot.key)}
                          title="Reset to default"
                          className="flex items-center justify-center p-2 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-100 transition-all disabled:opacity-60"
                        >
                          <RotateCcw size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-[13px] font-semibold z-50 ${
          toast.type === 'success' ? 'bg-[#540411] text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
