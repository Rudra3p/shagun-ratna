"use client";

import { Star, Filter, Upload, ChevronDown } from 'lucide-react';

const mockReviews = [
  { id: 1, name: 'Marcus Thorne', product: 'Royal Sapphire Halo', text: 'The sapphire halo ring is absolutely stunning. The craftsmanship is world-class.', rating: 5 },
  { id: 2, name: 'Julianne Moore', product: 'Verdant Aura Emerald', text: 'The emerald cut was perfect. It caught the light beautifully at the gala.', rating: 5 },
  { id: 3, name: 'Eleanor Laurent', product: 'Crimson Heart Ruby', text: 'The ruby\'s depth of color is mesmerizing. A truly regal piece for my collection.', rating: 5 },
  { id: 4, name: 'Isabella Thorne', product: 'Midnight Crimson Necklace', text: 'The depth of color in the ruby is breathtaking. Truly a statement piece.', rating: 5 },
  { id: 5, name: 'Liam Sterling', product: 'Imperial Violet Amethyst', text: 'Outstanding craftsmanship. The stone is even more vibrant in person.', rating: 5 },
  { id: 6, name: 'Sophia Loren', product: 'Tahitian Midnight Pearls', text: 'Elegant and sophisticated. Exactly what I was looking for.', rating: 5 },
];

export default function ReviewsView() {
  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">Customer Reviews</h2>
          <p className="text-secondary">Monitor and manage client feedback across all collections.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 bg-surface-container-lowest p-2 rounded-xl shadow-sm border border-outline-variant/30">
          <div className="px-4 py-2 flex items-center gap-2 border-r border-outline-variant/50">
            <Filter size={20} className="text-secondary" />
            <span className="font-label text-xs text-secondary tracking-widest uppercase">Filter By</span>
          </div>
          <FilterSelect options={['All Ratings', '5 Stars', '4 Stars']} />
          <FilterSelect options={['Most Recent', 'Oldest First', 'Highest Rated']} />
          <FilterSelect options={['All Products', 'Rings', 'Pendants']} />
        </div>
      </header>

      <div className="w-full mb-10 bg-primary-container text-on-primary-container p-8 md:p-10 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 border-4 border-white rounded-full -mr-32 -mt-32" />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-8">Review Insights</h3>
          <div className="flex flex-col md:flex-row md:items-center gap-10">
            <div className="flex items-center gap-6">
              <span className="text-6xl font-bold">4.8</span>
              <div>
                <p className="text-sm mb-1 opacity-90">Average Rating</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-current text-on-primary-container" />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-on-primary-container h-full" style={{ width: '92%' }} />
              </div>
              <p className="text-xs font-label opacity-80 uppercase tracking-wider">92% of customers recommend our bespoke jewelry services.</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-primary">Customer Feedback</h3>
          <button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg font-semibold text-sm hover:bg-primary-fixed transition-colors">
            <Upload size={18} />
            Upload to Web
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockReviews.map((review) => (
            <div key={review.id} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-4 group hover:shadow-md transition-all hover:border-primary/50 relative">
              <div className="absolute top-6 right-6">
                <input type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer transition-colors" />
              </div>
              <div className="flex justify-between items-start pr-8">
                <div className="flex flex-col">
                  <span className="font-bold text-primary">{review.name}</span>
                  <span className="text-xs text-secondary mt-0.5">{review.product}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < review.rating ? "fill-primary text-primary" : "text-outline-variant"} />
                ))}
              </div>
              <p className="text-sm italic text-on-surface-variant leading-relaxed">"{review.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ options }) {
  return (
    <div className="relative flex items-center group">
      <select className="appearance-none bg-transparent border-none focus:ring-0 text-sm font-semibold text-on-surface-variant cursor-pointer pr-8 py-2 outline-none">
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-2 text-secondary pointer-events-none group-hover:text-primary transition-colors" />
    </div>
  );
}