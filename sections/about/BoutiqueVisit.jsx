"use client";

export default function BoutiqueVisit() {
  return (
    <section className="py-24 px-6 text-center">
      <div className="max-w-xl mx-auto">
        <h2 className="font-serif text-3xl mb-8">Visit Our Boutique</h2>
        <p className="text-[#1a1a1a]/70 mb-10 leading-relaxed">
          Experience the collection in person at our Ahmedabad showroom. 
          Our consultants are ready to assist you in finding your next heirloom.
        </p>
        <button 
          onClick={() => window.location.href = '/contact'}
          className="px-8 py-4 border border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#faf3e5] transition-all uppercase text-xs tracking-[0.2em]"
        >
          Book Appointment
        </button>
      </div>
    </section>
  );
}