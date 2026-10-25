"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, RotateCcw, Check, AlertCircle, Loader2, Sparkles, Image as ImageIcon, Video } from 'lucide-react';
import { useAdminEditor } from '@/components/admin/AdminEditorContext';
import { useSiteText } from '@/components/SiteTextsProvider';
import { useSiteMedia } from '@/components/SiteImagesProvider';

export function AdminEditModals() {
  const {
    textModal,
    closeTextEdit,
    saveText,
    resetText,
    mediaModal,
    closeMediaEdit,
    uploadMedia,
    resetMedia,
    busyKey,
    toast,
  } = useAdminEditor();

  return (
    <>
      {textModal && (
        <TextDialog
          modal={textModal}
          onClose={closeTextEdit}
          onSave={saveText}
          onReset={resetText}
          isBusy={busyKey === textModal.key}
        />
      )}

      {mediaModal && (
        <MediaDialog
          modal={mediaModal}
          onClose={closeMediaEdit}
          onUpload={uploadMedia}
          onReset={resetMedia}
          isBusy={busyKey === mediaModal.slotKey}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#1A1A1A] text-white rounded-xl shadow-2xl border border-[#C5A059]/40 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {toast.type === 'error' ? (
            <AlertCircle size={18} className="text-red-400 shrink-0" />
          ) : (
            <Check size={18} className="text-[#C5A059] shrink-0" />
          )}
          <span className="text-sm font-sans">{toast.message}</span>
        </div>
      )}
    </>
  );
}

function TextDialog({ modal, onClose, onSave, onReset, isBusy }) {
  const currentLive = useSiteText(modal.key, modal.defaultText);
  const [value, setValue] = useState(currentLive);

  useEffect(() => {
    setValue(currentLive);
  }, [currentLive]);

  const handleSave = () => {
    onSave(modal.key, value, modal.section);
  };

  const handleReset = () => {
    if (confirm(`Reset "${modal.label}" back to its original default copy?`)) {
      onReset(modal.key, modal.defaultText);
    }
  };

  const isChanged = value !== currentLive;
  const isDefault = value === modal.defaultText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FDFBF7] border border-[#C5A059]/50 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-[#1A1A1A]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#C5A059]/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#90060c] font-bold">
                {modal.section || 'Content Field'}
              </span>
              <span className="text-[10px] text-gray-400">•</span>
              <span className="text-[10px] font-mono text-gray-400">{modal.key}</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#1A1A1A] font-medium">
              {modal.label}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="py-6 space-y-4">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-gray-500 mb-2">
              Content Text
            </label>
            {modal.type === 'textarea' ? (
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={5}
                className="w-full p-3.5 bg-white border border-gray-200 rounded-xl font-sans text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#90060c]/30 focus:border-[#90060c] transition-all resize-y"
                placeholder="Enter text..."
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-3.5 bg-white border border-gray-200 rounded-xl font-sans text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#90060c]/30 focus:border-[#90060c] transition-all"
                placeholder="Enter text..."
              />
            )}
            <div className="flex justify-between items-center text-[11px] text-gray-400 mt-1.5 px-1 font-sans">
              <span>{value.length} characters</span>
              {isDefault && <span className="text-[#C5A059] font-medium">Original default</span>}
            </div>
          </div>

          {/* Default Preview Info */}
          {!isDefault && (
            <div className="p-3 bg-[#FAF7F2] border border-[#C5A059]/30 rounded-xl text-xs text-gray-600 font-sans">
              <span className="font-bold text-[#90060c] uppercase text-[10px] tracking-wider block mb-1">
                Original Default:
              </span>
              <p className="line-clamp-2 italic">{modal.defaultText}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#C5A059]/20 gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isBusy || isDefault}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-sans text-gray-600 hover:text-[#90060c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="px-4 py-2 text-xs font-sans uppercase tracking-wider text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isBusy || !isChanged}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-sans uppercase tracking-[0.2em] font-semibold text-white bg-[#90060c] hover:bg-[#730509] disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-md transition-all active:scale-95"
            >
              {isBusy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              <span>Save Text</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaDialog({ modal, onClose, onUpload, onReset, isBusy }) {
  const currentMedia = useSiteMedia(modal.slotKey, modal.defaultSrc);
  const fileInputRef = useRef(null);
  const isStorySlot = modal.slotKey === 'home-story';

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) {
      onUpload(modal.slotKey, file);
    }
  };

  const handleReset = () => {
    if (confirm(`Reset "${modal.label}" to the default media?`)) {
      onReset(modal.slotKey);
    }
  };

  const isCustom = currentMedia.url !== modal.defaultSrc;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FDFBF7] border border-[#C5A059]/50 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-[#1A1A1A]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#C5A059]/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#90060c] font-bold">
                Site Media Slot
              </span>
              <span className="text-[10px] text-gray-400">•</span>
              <span className="text-[10px] font-mono text-gray-400">{modal.slotKey}</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#1A1A1A] font-medium">
              {modal.label}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Media Preview */}
        <div className="py-6 space-y-4">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/5 border border-gray-200 shadow-inner flex items-center justify-center">
            {currentMedia.type === 'video' ? (
              <video
                src={currentMedia.url}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentMedia.url}
                alt={modal.label}
                className="w-full h-full object-contain bg-[#FAF7F2]"
              />
            )}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-sans font-medium uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm flex items-center gap-1">
              {currentMedia.type === 'video' ? <Video size={11} /> : <ImageIcon size={11} />}
              <span>{currentMedia.type}</span>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={isStorySlot ? 'image/*,video/mp4' : 'image/*'}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Upload Button Box */}
          <div
            onClick={() => !isBusy && fileInputRef.current?.click()}
            className={`border-2 border-dashed border-[#C5A059]/60 hover:border-[#90060c] rounded-xl p-6 text-center cursor-pointer transition-all bg-white hover:bg-[#FAF7F2] ${
              isBusy ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            {isBusy ? (
              <div className="flex flex-col items-center justify-center gap-2 text-gray-500 py-2">
                <Loader2 size={24} className="animate-spin text-[#90060c]" />
                <span className="text-xs font-sans font-medium">Uploading &amp; optimizing media...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-[#90060c]/10 flex items-center justify-center text-[#90060c] mb-1">
                  <Upload size={18} />
                </div>
                <span className="text-xs font-sans font-semibold text-[#1A1A1A]">
                  Click to select new {isStorySlot ? 'Image or MP4 Video' : 'Image'}
                </span>
                <span className="text-[11px] font-sans text-gray-400">
                  {isStorySlot ? 'Supports PNG, JPG, WebP, or MP4 (max 100MB)' : 'Supports WebP, PNG, JPG (recommended high-res)'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#C5A059]/20 gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isBusy || !isCustom}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-sans text-gray-600 hover:text-[#90060c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset to Default</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="px-5 py-2 text-xs font-sans uppercase tracking-wider text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

