import React from 'react';
import Link from 'next/link';

export default function BoutiqueVisit() {
  return (
    <section className="py-24 px-6 bg-[#faf3e5] text-[#90060c] text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-4xl mb-6">Visit Our Boutique</h2>
        <p className="text-sm opacity-80 mb-10 leading-relaxed tracking-[0.05em]">
          Experience the weight of gold and the brilliance of our stones in person. 
          Step into a world where tradition meets timeless design at our flagship location.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/find-a-boutique" 
            className="bg-[#90060c] text-[#faf3e5] px-10 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-[#C5A059] transition-all"
          >
            Find a Boutique
          </Link>
          <Link 
            href="/contact" 
            className="border border-[#90060c] px-10 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-[#90060c] hover:text-[#faf3e5] transition-all"
          >
            Schedule a Visit
          </Link>
        </div>
      </div>
    </section>
  );
}