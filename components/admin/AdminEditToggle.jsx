"use client";

import React from 'react';
import { Pencil } from 'lucide-react';
import { useAdminEditor } from '@/components/admin/AdminEditorContext';

export function AdminEditToggle() {
  const { editMode, setEditMode } = useAdminEditor();

  return (
    <button
      type="button"
      onClick={() => setEditMode(!editMode)}
      className={`fixed top-6 right-20 z-40 h-10 w-10 flex items-center justify-center rounded-md shadow-lg backdrop-blur-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 cursor-pointer ${
        editMode
          ? 'bg-[#90060c] text-[#faf3e5] border border-[#C5A059] shadow-[0_0_15px_rgba(144,6,12,0.4)] hover:bg-[#730509]'
          : 'bg-black/70 text-white hover:bg-black/90'
      }`}
      aria-label={editMode ? 'Disable Edit Mode (Switch to Preview)' : 'Enable Edit Mode'}
      title={editMode ? 'Edit Mode: ON — Click to switch to Preview' : 'Edit Mode: OFF — Click to edit content'}
    >
      <Pencil size={17} className={editMode ? 'text-[#C5A059]' : 'text-white'} />
    </button>
  );
}

