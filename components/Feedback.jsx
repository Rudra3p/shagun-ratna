import React from 'react';
import Link from 'next/link';

export default function FeedbackSection() {
  return (
    <section className="py-24 px-6 bg-[#90060c] text-[#faf3e5] text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl mb-6 text-[#C5A059]">Your Thoughts</h2>
        <p className="opacity-80 mb-10 text-sm tracking-[0.1em] max-w-xl mx-auto">
          Help us refine our legacy. We would love to hear about your experience with Shagun Ratna.
        </p>
        
        <Link 
          href="/reviews" 
          className="inline-block border border-[#C5A059] text-[#C5A059] px-12 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-[#C5A059] hover:text-[#90060c] transition-all"
        >
          Leave a Review
        </Link>
      </div>
    </section>
  );
}