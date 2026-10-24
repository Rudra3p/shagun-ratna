import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

const InstagramIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 18, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#90060c] text-[#faf3e5] pt-10 pb-20 px-6 border-t border-[#C5A059]/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand Info */}
        <div className="col-span-1 md:col-span-1">
          <h3 className="font-serif text-2xl mb-6 text-[#C5A059]">Shagun Ratna</h3>
          <p className="text-sm opacity-70 leading-relaxed">
            Transcending the ordinary since 1980. Crafting legacies in gold and stone.
          </p>
          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[#C5A059]/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-[#C5A059]">
            <ShieldCheck size={13} strokeWidth={2} />
            BIS Hallmarked
          </div>
          <div className="mt-5 flex items-center gap-3" aria-label="Social media links">
            <a href="https://www.instagram.com/shagunratnagemsjewellers/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A059]/40 text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-[#90060c]">
              <InstagramIcon size={18} />
            </a>
            <a href="https://www.facebook.com/SHAGUNRATNA/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A059]/40 text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-[#90060c]">
              <FacebookIcon size={18} />
            </a>
            <a href="https://wa.me/919558888754" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A059]/40 text-[#C5A059] transition-colors hover:bg-[#C5A059] hover:text-[#90060c]">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="uppercase text-xs tracking-[0.2em] text-[#C5A059] mb-6">Explore</h4>
          <ul className="space-y-4 text-sm opacity-90">
            <li><Link href="/collection" className="hover:text-[#C5A059] transition-colors">Collections</Link></li>
            <li><Link href="/about" className="hover:text-[#C5A059] transition-colors">Our Story</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="uppercase text-xs tracking-[0.2em] text-[#C5A059] mb-6">Support</h4>
          <ul className="space-y-4 text-sm opacity-90">
            <li><Link href="/contact" className="hover:text-[#C5A059] transition-colors">Contact Us</Link></li>
            <li><Link href="/reviews" className="hover:text-[#C5A059] transition-colors">Customer Reviews</Link></li>
          </ul>
        </div>

        {/* Footer Credits */}
        <div className="flex flex-col justify-end">
          <p className="text-xs opacity-50">© 2026 Shagun Ratna. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}