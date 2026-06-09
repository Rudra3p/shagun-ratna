"use client";

import React, { useState } from 'react';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Feedback:", feedback);
    setFeedback("");
    alert("Thank you for your valuable feedback.");
  };

  return (
    <section className="py-24 px-6 bg-[#90060c] text-[#faf3e5]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-4xl mb-6 text-[#C5A059]">Your Thoughts</h2>
        <p className="opacity-80 mb-10 text-sm tracking-[0.1em]">
          Help us refine our legacy. Share your thoughts or suggestions on your experience with Shagun Ratna.
        </p>
        
        <form className="flex flex-col md:flex-row gap-4 justify-center" onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your experience..." 
            className="bg-[#faf3e5]/10 border border-[#C5A059]/50 px-6 py-4 w-full md:w-80 outline-none focus:border-white transition-colors text-white"
          />
          <button 
            type="submit"
            className="bg-[#C5A059] text-[#90060c] px-10 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-white transition-colors"
          >
            Send Feedback
          </button>
        </form>
      </div>
    </section>
  );
}