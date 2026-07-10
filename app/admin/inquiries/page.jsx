"use client";

import { useEffect, useState } from 'react';
import { Inbox, Phone, CheckCircle2, Trash2 } from 'lucide-react';
import adminApi from '@/lib/adminApi';

export default function InquiriesView() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const { data } = await adminApi.get('/inquiries?limit=100');
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDone = async (id) => {
    if (!confirm("Mark this inquiry as done? It will be archived out of this pending list.")) return;
    try {
      setBusyId(id);
      await adminApi.put(`/inquiries?id=${id}`);
      setInquiries((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this inquiry?")) return;
    try {
      setBusyId(id);
      await adminApi.delete(`/inquiries?id=${id}`);
      setInquiries((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <header className="w-full mb-10 bg-primary-container text-on-primary-container p-8 md:p-10 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 border-4 border-white rounded-full -mr-32 -mt-32" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/20">
            <Inbox size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Customer Inquiries</h3>
            <p className="text-sm opacity-90">{inquiries.length} inquiry{inquiries.length === 1 ? '' : 'ies'} awaiting review.</p>
          </div>
        </div>
      </header>

      {loading ? (
        <p className="text-sm text-on-surface-variant">Loading inquiries...</p>
      ) : inquiries.length === 0 ? (
        <p className="text-sm text-on-surface-variant">No inquiries yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {inquiries.map((inquiry) => (
            <div key={inquiry._id} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-4 hover:shadow-md transition-all hover:border-primary/50">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-bold text-primary">{inquiry.name}</span>
                  <span className="text-xs text-secondary mt-0.5 flex items-center gap-1">
                    <Phone size={12} /> {inquiry.phone}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 self-start px-2 py-0.5 rounded-full">
                {inquiry.productName}
              </span>

              {inquiry.customizationNotes && (
                <p className="text-sm italic text-on-surface-variant leading-relaxed">"{inquiry.customizationNotes}"</p>
              )}

              <div className="flex items-center gap-3 mt-auto pt-2 border-t border-outline-variant/20">
                <button
                  onClick={() => handleDone(inquiry._id)}
                  disabled={busyId === inquiry._id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-sm font-semibold disabled:opacity-50"
                >
                  <CheckCircle2 size={16} />
                  Done
                </button>
                <button
                  onClick={() => handleDelete(inquiry._id)}
                  disabled={busyId === inquiry._id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-sm font-semibold disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
