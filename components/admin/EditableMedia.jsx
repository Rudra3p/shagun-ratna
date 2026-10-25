"use client";

import React from 'react';
import { Camera } from 'lucide-react';
import { useAdminEditor } from '@/components/admin/AdminEditorContext';

export function EditableMedia({
  slotKey,
  label = '',
  defaultSrc = '',
  className = '',
  children,
}) {
  const { isAdmin, editMode, openMediaEdit } = useAdminEditor();

  if (!isAdmin || !editMode) {
    return <div className={className}>{children}</div>;
  }

  const handleMediaClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openMediaEdit(slotKey, label || slotKey, defaultSrc);
  };

  return (
    <div
      className={`relative group/media hover:ring-2 hover:ring-[#C5A059] rounded-2xl transition-all duration-200 ${className}`}
    >
      {children}

      {/* Floating Action Badge */}
      <button
        type="button"
        onClick={handleMediaClick}
        title={`Change media for ${label || slotKey}`}
        className="absolute top-3 right-3 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium text-white bg-[#90060c]/95 hover:bg-[#730509] border border-[#C5A059] rounded-full shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Camera size={13} className="text-[#C5A059]" />
        <span>Change Media</span>
      </button>
    </div>
  );
}

