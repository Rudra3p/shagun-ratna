"use client";

import { useState } from 'react';
import { X, FileText } from 'lucide-react';

// "View sample certificate" trigger + lightbox modal, shared by the homepage
// Authenticity section and the About page Certification section. `image` should
// already be resolved (via useSiteImage/useSiteImages) so real uploads from
// Admin → Site Images take over from the bundled placeholder automatically.
export default function CertificatePreview({ title, image, description }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#90060c] hover:text-[#C5A059] transition-colors group"
      >
        <FileText size={12} />
        <span className="underline underline-offset-4 decoration-[#C5A059]/50 group-hover:decoration-[#C5A059]">
          View sample certificate
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#FDFBF7] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 text-[#90060c] hover:bg-white transition-colors shadow-sm"
            >
              <X size={16} />
            </button>

            <div className="relative w-full aspect-[4/3] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={`${title} — sample certificate`} className="w-full h-full object-contain" />
            </div>

            <div className="p-6 text-center">
              <h3 className="font-serif text-xl text-[#90060c] mb-1.5">{title}</h3>
              {description && (
                <p className="text-xs text-[#1a1a1a]/70 leading-relaxed font-light">{description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
