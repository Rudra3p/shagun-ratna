"use client";

import React from 'react';
import Link from 'next/link';
import { Eye, Edit3, Sliders, ExternalLink, Sparkles } from 'lucide-react';
import { useAdminEditor } from '@/components/admin/AdminEditorContext';

export function AdminEditorToolbar() {
  const { page, editMode, setEditMode, setDrawerOpen } = useAdminEditor();
  const publicHref = page === 'About' ? '/about' : '/';

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#C5A059]/30 py-3.5 px-4 sm:px-8 mb-6 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#90060c] to-[#730509] flex items-center justify-center text-[#C5A059] shadow-sm">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-serif font-bold text-[#1A1A1A] tracking-wide">
                {page} Page Studio
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-sans font-bold uppercase tracking-widest text-[#90060c] bg-[#90060c]/10 rounded-full border border-[#90060c]/20">
                Live CMS
              </span>
            </div>
            <p className="text-[11px] font-sans text-gray-500 hidden sm:block">
              {editMode
                ? 'Click any heading, paragraph, or media badge on the page below to edit.'
                : 'Previewing page layout as visitors see it.'}
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2.5">
          {/* Edit Mode Switch */}
          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-sans font-semibold tracking-wider uppercase transition-all shadow-sm ${
              editMode
                ? 'bg-[#90060c] text-white hover:bg-[#730509]'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {editMode ? <Edit3 size={13} className="text-[#C5A059]" /> : <Eye size={13} />}
            <span>{editMode ? 'Edit Mode: ON' : 'Preview Mode'}</span>
          </button>

          {/* All Fields Drawer Button */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF7F2] border border-[#C5A059]/50 rounded-full text-xs font-sans font-medium text-[#1A1A1A] shadow-sm transition-all"
          >
            <Sliders size={13} className="text-[#90060c]" />
            <span className="hidden sm:inline">All Page Fields</span>
          </button>

          {/* Public Page Link */}
          <Link
            href={publicHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-medium text-gray-500 hover:text-[#90060c] transition-colors"
            title="Open live public page in new tab"
          >
            <span className="hidden md:inline">View Public</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>
    </header>
  );
}

