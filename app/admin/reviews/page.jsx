"use client";

import { useEffect, useState } from 'react';
import { Star, Filter, Upload, ChevronDown, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import adminApi from '@/lib/adminApi';

export default function ReviewsView() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get('/reviews?limit=100');
      const list = data.reviews || [];
      setReviews(list);
      // Checkboxes reflect what's currently live on the homepage
      setSelectedIds(new Set(list.filter((r) => r.featured).map((r) => r._id)));
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUploadToWeb = async () => {
    setUploading(true);
    try {
      await adminApi.put('/reviews', { featuredIds: Array.from(selectedIds) });
      await fetchReviews();
      showToast('success', `Homepage updated with ${selectedIds.size} review${selectedIds.size === 1 ? '' : 's'}.`);
    } catch (err) {
      console.error("Failed to update homepage reviews:", err);
      showToast('error', 'Failed to update homepage. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      setDeletingId(id);
      await adminApi.delete(`/reviews?id=${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <header className="w-full mb-10 bg-primary-container text-on-primary-container p-8 md:p-10 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 border-4 border-white rounded-full -mr-32 -mt-32" />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-8">Review Insights</h3>
          <div className="flex flex-col md:flex-row md:items-center gap-10">
            <div className="flex items-center gap-6">
              <span className="text-6xl font-bold">{averageRating}</span>
              <div>
                <p className="text-sm mb-1 opacity-90">Average Rating</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-[#C5A059] text-[#C5A059]" />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <p className="text-xs font-label opacity-80 uppercase tracking-wider">{reviews.length} total review{reviews.length === 1 ? '' : 's'} collected.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full">
          <div className="w-full sm:w-auto">
            <FilterSelect
              options={['All Ratings', '5 Stars', '4 Stars']}
            />
          </div>

          <div className="w-full sm:w-auto">
            <FilterSelect
              options={['Most Recent', 'Oldest First', 'Highest Rated']}
            />
          </div>

          <div className="w-full sm:w-auto">
            <FilterSelect
              options={['All Products', 'Rings', 'Pendants']}
            />
          </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-primary">Customer Feedback</h3>
          <button
            onClick={handleUploadToWeb}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg font-semibold text-sm hover:bg-primary-fixed transition-colors disabled:opacity-60"
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            Upload to Web {selectedIds.size > 0 && `(${selectedIds.size})`}
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-on-surface-variant">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-4 group hover:shadow-md transition-all hover:border-primary/50 relative">
                <div className="absolute top-6 right-6">
                  <button
                    onClick={() => handleDelete(review._id)}
                    disabled={deletingId === review._id}
                    className="p-1.5 rounded-lg text-secondary hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Delete review"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex justify-between items-start pr-8">
                  <div className="flex flex-col">
                    <span className="font-bold text-primary">{review.name}</span>
                    <span className="text-xs text-secondary mt-0.5">{review.product}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < review.rating ? "fill-[#C5A059] text-[#C5A059]" : "text-outline-variant"} />
                  ))}
                </div>
                <p className="text-sm italic text-on-surface-variant leading-relaxed">"{review.text}"</p>

                <div className="flex items-center gap-2 flex-wrap">
                  {!review.approved && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary bg-outline-variant/20 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                  {review.featured && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-on-primary bg-primary px-2 py-0.5 rounded-full">
                      Live on Homepage
                    </span>
                  )}
                </div>

                <label className="flex items-center gap-2 pt-3 mt-auto border-t border-outline-variant/20 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(review._id)}
                    onChange={() => toggleSelect(review._id)}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-secondary">Show on Homepage</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-semibold z-50 ${
          toast.type === 'success' ? 'bg-primary text-on-primary' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}

function FilterSelect({ options }) {
  return (
    <div className="text-primary border-primary relative flex items-center group">
      <select className="appearance-none bg-transparent border-none focus:ring-0 text-sm font-semibold text-on-surface-variant cursor-pointer pr-8 py-2 outline-none">
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-2 text-secondary pointer-events-none group-hover:text-primary transition-colors" />
    </div>
  );
}
