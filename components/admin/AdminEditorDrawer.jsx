"use client";

import React, { useState } from 'react';
import { X, Sliders, Pencil, Camera, ChevronRight, Sparkles } from 'lucide-react';
import { useAdminEditor } from '@/components/admin/AdminEditorContext';
import { SITE_TEXT_SLOTS } from '@/lib/siteTextSlots';
import { SITE_IMAGE_SLOTS } from '@/lib/siteImageSlots';
import { useSiteText } from '@/components/SiteTextsProvider';
import { useSiteMedia } from '@/components/SiteImagesProvider';

export function AdminEditorDrawer() {
  const { page, drawerOpen, setDrawerOpen, openTextEdit, openMediaEdit } = useAdminEditor();
  const [activeTab, setActiveTab] = useState('all');

  if (!drawerOpen) return null;

  const pageTexts = SITE_TEXT_SLOTS.filter((s) => s.page === page);
  const pageImages = SITE_IMAGE_SLOTS.filter((s) => s.page === page);
  const sections = ['all', ...new Set(pageTexts.map((s) => s.section))];

  const filteredTexts =
    activeTab === 'all' ? pageTexts : pageTexts.filter((s) => s.section === activeTab);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-[#FDFBF7] border-l border-[#C5A059]/40 shadow-2xl flex flex-col text-[#1A1A1A]">
          {/* Header */}
          <div className="p-6 border-b border-[#C5A059]/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#90060c] flex items-center justify-center text-[#C5A059]">
                <Sliders size={16} />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  {page} Content &amp; Media
                </h2>
                <p className="text-xs font-sans text-gray-500">
                  {pageTexts.length} copy fields • {pageImages.length} media slots
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Section Filter Pills */}
          <div className="px-6 py-3 border-b border-gray-100 flex gap-2 overflow-x-auto no-scrollbar bg-white/60">
            {sections.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setActiveTab(sec)}
                className={`px-3 py-1 rounded-full text-xs font-sans whitespace-nowrap transition-all ${
                  activeTab === sec
                    ? 'bg-[#90060c] text-white font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {sec === 'all' ? 'All Sections' : sec}
              </button>
            ))}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Media Slots for this page */}
            {activeTab === 'all' && pageImages.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#90060c]">
                    Media &amp; Images ({pageImages.length})
                  </span>
                  <div className="h-px flex-1 bg-[#C5A059]/30" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {pageImages.map((slot) => (
                    <DrawerMediaItem
                      key={slot.key}
                      slot={slot}
                      onEdit={() => openMediaEdit(slot.key, slot.label, slot.defaultSrc)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Copy Fields */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#90060c]">
                  Text Content ({filteredTexts.length})
                </span>
                <div className="h-px flex-1 bg-[#C5A059]/30" />
              </div>

              <div className="space-y-3">
                {filteredTexts.map((slot) => (
                  <DrawerTextItem
                    key={slot.key}
                    slot={slot}
                    onEdit={() =>
                      openTextEdit(slot.key, slot.label, slot.defaultText, slot.type, slot.section)
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DrawerTextItem({ slot, onEdit }) {
  const currentText = useSiteText(slot.key, slot.defaultText);
  const isOverridden = currentText !== slot.defaultText;

  return (
    <div
      onClick={onEdit}
      className="p-3.5 bg-white border border-gray-100 hover:border-[#C5A059]/60 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
          {slot.label}
        </span>
        <div className="flex items-center gap-1.5">
          {isOverridden && (
            <span className="px-1.5 py-0.5 text-[9px] font-sans font-bold uppercase text-[#90060c] bg-[#90060c]/10 rounded-sm">
              Custom
            </span>
          )}
          <span className="p-1 rounded text-gray-400 group-hover:text-[#90060c] group-hover:bg-[#FAF7F2] transition-colors">
            <Pencil size={12} />
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-600 line-clamp-2 font-sans italic">
        &ldquo;{currentText}&rdquo;
      </p>
    </div>
  );
}

function DrawerMediaItem({ slot, onEdit }) {
  const currentMedia = useSiteMedia(slot.key, slot.defaultSrc);

  return (
    <div
      onClick={onEdit}
      className="bg-white border border-gray-100 hover:border-[#C5A059]/60 rounded-xl p-2.5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="relative aspect-4/3 w-full rounded-lg overflow-hidden bg-gray-50 mb-2">
        {currentMedia.type === 'video' ? (
          <video src={currentMedia.url} className="w-full h-full object-cover" muted />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentMedia.url} alt={slot.label} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera size={18} className="text-white" />
        </div>
      </div>
      <span className="text-[11px] font-sans font-medium text-gray-800 line-clamp-1 block">
        {slot.label}
      </span>
    </div>
  );
}

