"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function NewsletterSignup() {
  return (
    <section className="py-24 px-6 bg-[#1a1a1a] text-[#faf3e5]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-4xl mb-6">Join the Circle</h2>
        <p className="opacity-70 mb-10 text-sm tracking-[0.1em]">Be the first to know about new collections, private previews, and exclusive invitations.</p>
        
        <form className="flex flex-col md:flex-row gap-4 justify-center" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="bg-transparent border border-[#C5A059]/50 px-6 py-4 w-full md:w-80 outline-none focus:border-[#C5A059] transition-colors"
          />
          <button className="bg-[#C5A059] text-[#1a1a1a] px-10 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-[#faf3e5] transition-colors">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}