"use client";

import { useEffect, useState } from 'react';
import { Inbox, Phone, CheckCircle2, Trash2, MessageSquare } from 'lucide-react';

const WhatsAppIcon = ({ size = 14, ...props }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);
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

              {/* Quick Reply Channels */}
              <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/15">
                {(() => {
                  const rawPhone = inquiry.phone ? String(inquiry.phone).replace(/[^0-9]/g, '') : '';
                  const waNumber = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
                  const replyText = encodeURIComponent(`Namaste ${inquiry.name}, thank you for reaching out to Shagun Ratna regarding "${inquiry.productName}". We would love to assist you.`);
                  return (
                    <>
                      <a
                        href={`https://wa.me/${waNumber}?text=${replyText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#075e54] text-xs font-semibold transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <WhatsAppIcon size={13} />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors"
                        title="Call Customer"
                      >
                        <Phone size={13} />
                        <span>Call</span>
                      </a>
                      <a
                        href={`sms:${inquiry.phone}`}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-secondary text-xs font-semibold transition-colors"
                        title="Send SMS"
                      >
                        <MessageSquare size={13} />
                        <span>SMS</span>
                      </a>
                    </>
                  );
                })()}
              </div>

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
