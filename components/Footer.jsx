import React from 'react';
import Link from 'next/link';

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
        </div>

        {/* Explore */}
        <div>
          <h4 className="uppercase text-xs tracking-[0.2em] text-[#C5A059] mb-6">Explore</h4>
          <ul className="space-y-4 text-sm opacity-90">
            <li><Link href="/my-collection" className="hover:text-[#C5A059] transition-colors">Collections</Link></li>
            <li><Link href="/about" className="hover:text-[#C5A059] transition-colors">Our Story</Link></li>
            <li><Link href="/craftsmanship" className="hover:text-[#C5A059] transition-colors">Craftsmanship</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="uppercase text-xs tracking-[0.2em] text-[#C5A059] mb-6">Support</h4>
          <ul className="space-y-4 text-sm opacity-90">
            <li><Link href="/contact" className="hover:text-[#C5A059] transition-colors">Contact Us</Link></li>
            <li><Link href="/find-a-boutique" className="hover:text-[#C5A059] transition-colors">Find a Boutique</Link></li>
            <li><Link href="/faq" className="hover:text-[#C5A059] transition-colors">FAQ</Link></li>
            {/* Added Link Here */}
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