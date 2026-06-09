"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [feedback, setFeedback] = useState("");

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Feedback submitted:", feedback);
    setFeedback(""); // Clear input after "submission"
    alert("Thank you for your feedback!");
  };

  return (
    <footer className="bg-[#90060c] text-[#faf3e5] py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Info */}
        <div className="col-span-1 md:col-span-1">
          <h3 className="font-serif text-2xl mb-6 text-[#C5A059]">Shagun Ratna</h3>
          <p className="text-sm opacity-80 leading-relaxed">
            Transcending the ordinary since 1980. Crafting legacies in gold and stone.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="uppercase text-xs tracking-[0.2em] text-[#C5A059] mb-6">Explore</h4>
          <ul className="space-y-4 text-sm opacity-90">
            <li><Link href="/collections" className="hover:text-white transition-colors">Collections</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
            <li><Link href="/craftsmanship" className="hover:text-white transition-colors">Craftsmanship</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="uppercase text-xs tracking-[0.2em] text-[#C5A059] mb-6">Support</h4>
          <ul className="space-y-4 text-sm opacity-90">
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/find-a-boutique" className="hover:text-white transition-colors">Find a Boutique</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Feedback Input */}
        <div>
          <h4 className="uppercase text-xs tracking-[0.2em] text-[#C5A059] mb-6">Feedback</h4>
          <form onSubmit={handleFeedback} className="flex flex-col gap-3">
            <input
              type="text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your thoughts..."
              className="bg-[#faf3e5]/10 border border-[#C5A059]/30 px-3 py-2 text-sm text-[#faf3e5] placeholder-[#faf3e5]/50 focus:outline-none focus:border-[#C5A059]"
            />
            <button 
              type="submit" 
              className="bg-[#C5A059] text-[#90060c] py-2 text-xs uppercase tracking-[0.1em] font-bold hover:bg-white transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#C5A059]/20 text-center text-xs opacity-60">
        © 2026 Shagun Ratna. All rights reserved.
      </div>
    </footer>
  );
}