"use client";

import React from 'react';
import { Pencil } from 'lucide-react';
import { useSiteText } from '@/components/SiteTextsProvider';
import { useAdminEditor } from '@/components/admin/AdminEditorContext';

export function EditableText({
  textKey,
  defaultText = '',
  label = '',
  section = '',
  type = 'text',
  as: Component = 'span',
  className = '',
  children,
  ...rest
}) {
  const text = useSiteText(textKey, defaultText);
  const { isAdmin, editMode, openTextEdit } = useAdminEditor();

  if (!isAdmin || !editMode) {
    return (
      <Component className={className} {...rest}>
        {children !== undefined ? children : text}
      </Component>
    );
  }

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openTextEdit(textKey, label || textKey, defaultText, type, section);
  };

  return (
    <Component
      className={`relative group/editable transition-all duration-200 ${className} hover:outline hover:outline-1 hover:outline-[#C5A059]/70 hover:outline-dashed rounded cursor-pointer`}
      onClick={handleEditClick}
      title={`Click to edit: ${label || textKey}`}
      {...rest}
    >
      {children !== undefined ? children : text}

      {/* Floating subtle luxury edit indicator button */}
      <span
        onClick={handleEditClick}
        aria-label={`Edit ${label || textKey}`}
        className="inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 text-[10px] tracking-wider uppercase font-sans font-medium text-[#90060c] bg-[#FAF7F2] border border-[#C5A059]/50 rounded-full shadow-sm opacity-70 group-hover/editable:opacity-100 transition-opacity align-middle select-none"
      >
        <Pencil size={10} className="text-[#90060c]" />
        <span>Edit</span>
      </span>
    </Component>
  );
}

export function EditableTextWrapper({
  textKey,
  defaultText = '',
  label = '',
  section = '',
  type = 'text',
  className = '',
  children,
}) {
  const { isAdmin, editMode, openTextEdit } = useAdminEditor();

  if (!isAdmin || !editMode) {
    return <div className={className}>{children}</div>;
  }

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openTextEdit(textKey, label || textKey, defaultText, type, section);
  };

  return (
    <div
      className={`relative group/editable hover:outline hover:outline-1 hover:outline-[#C5A059]/70 hover:outline-dashed rounded transition-all duration-200 ${className}`}
    >
      {children}
      <button
        type="button"
        onClick={handleEditClick}
        title={`Edit ${label || textKey}`}
        className="absolute top-1 right-1 z-30 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase font-sans font-medium text-[#90060c] bg-white/95 border border-[#C5A059]/60 rounded-full shadow-md backdrop-blur-sm opacity-0 group-hover/editable:opacity-100 transition-opacity hover:bg-[#FAF7F2]"
      >
        <Pencil size={10} className="text-[#90060c]" />
        <span>Edit</span>
      </button>
    </div>
  );
}

