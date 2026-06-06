"use client";

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-[#faf3e5] py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Info */}
        <div className="col-span-1 md:col-span-1">
          <h3 className="font-serif text-2xl mb-6 text-[#C5A059]">Shagun Ratna</h3>
          <p className="text-sm opacity-60 leading-relaxed">
            Transcending the ordinary since 1980. Crafting legacies in gold and stone.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="uppercase text-xs tracking-[0.2em] text-[#C5A059] mb-6">Explore</h4>
          <ul className="space-y-4 text-sm opacity-80">
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Collections</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Our Story</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Craftsmanship</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="uppercase text-xs tracking-[0.2em] text-[#C5A059] mb-6">Support</h4>
          <ul className="space-y-4 text-sm opacity-80">
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Find a Boutique</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">FAQ</a></li>
          </ul>
        </div>

        {/* Legal/Social */}
        <div>
          <h4 className="uppercase text-xs tracking-[0.2em] text-[#C5A059] mb-6">Connect</h4>
          <ul className="space-y-4 text-sm opacity-80">
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Facebook</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Pinterest</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#C5A059]/20 text-center text-xs opacity-40">
        © 2026 Shagun Ratna. All rights reserved.
      </div>
    </footer>
  );
}