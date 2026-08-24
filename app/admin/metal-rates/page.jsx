"use client";

import { useEffect, useState } from 'react';
import adminApi from '@/lib/adminApi';
import { Loader2, CheckCircle2, AlertCircle, TrendingUp, Info } from 'lucide-react';

export default function MetalRatesPage() {
  const [gold, setGold] = useState('');
  const [silver, setSilver] = useState('');
  const [saved, setSaved] = useState({ gold: 0, silver: 0 });
  const [affected, setAffected] = useState({ gold: 0, silver: 0 });
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    try {
      const { data } = await adminApi.get('/metal-rates');
      const r = data.rates || {};
      setGold(String(r.goldRatePerGram ?? 0));
      setSilver(String(r.silverRatePerGram ?? 0));
      setSaved({ gold: r.goldRatePerGram ?? 0, silver: r.silverRatePerGram ?? 0 });
      setUpdatedAt(r.updatedAt || null);
      setAffected(data.affected || { gold: 0, silver: 0 });
    } catch (err) {
      console.error('Failed to load metal rates:', err);
      showToast('error', 'Could not load current rates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.put('/metal-rates', {
        goldRatePerGram: Number(gold) || 0,
        silverRatePerGram: Number(silver) || 0,
      });
      await load();
      showToast('success', 'Rates updated — every formula-priced piece now uses them.');
    } catch (err) {
      console.error('Failed to update metal rates:', err);
      showToast('error', err.response?.data?.error || 'Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const isDirty = Number(gold) !== saved.gold || Number(silver) !== saved.silver;

  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-[720px] mx-auto px-4 pt-6">
      <div className="border-b border-gray-100 pb-6 mb-8">
        <h1 className="text-[22px] font-sans font-bold text-primary-container tracking-tight">Metal Rates</h1>
        <p className="text-[13px] text-on-surface-variant mt-0.5">
          Set today&rsquo;s gold and silver rate. Every formula-priced piece reprices instantly — no need to edit products one by one.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2.5 py-24 text-on-surface-variant font-sans text-[13px]">
          <Loader2 size={16} className="animate-spin" />
          Loading current rates…
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-[20px] p-8 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label htmlFor="gold-rate" className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider font-sans">
                Gold — ₹ per gram
              </label>
              <input
                id="gold-rate"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={gold}
                onChange={(e) => setGold(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-outline rounded-lg text-[18px] font-bold text-gray-900 shadow-sm transition-all focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
              />
              <p className="text-[11px] text-on-surface-variant">
                Rate for pure (24K) gold — purity is applied per piece from its own label.
              </p>
              <p className="text-[11px] font-semibold text-primary">
                {affected.gold} piece{affected.gold === 1 ? '' : 's'} priced from this
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="silver-rate" className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider font-sans">
                Silver — ₹ per gram
              </label>
              <input
                id="silver-rate"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={silver}
                onChange={(e) => setSilver(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-outline rounded-lg text-[18px] font-bold text-gray-900 shadow-sm transition-all focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
              />
              <p className="text-[11px] text-on-surface-variant">
                Rate for pure silver — 925 sterling is calculated at 92.5% of it.
              </p>
              <p className="text-[11px] font-semibold text-primary">
                {affected.silver} piece{affected.silver === 1 ? '' : 's'} priced from this
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 mt-7 p-4 rounded-xl bg-surface-container/60 border border-outline/20">
            <Info size={15} className="text-primary shrink-0 mt-0.5" />
            <p className="text-[12px] text-on-surface-variant leading-relaxed">
              Each piece&rsquo;s price is <strong>metal rate × purity × weight + labour cost</strong>.
              Products set to <strong>Manual</strong> pricing keep the price you typed and are not affected.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-gray-100">
            <p className="text-[11px] text-on-surface-variant">
              {updatedAt ? `Last updated ${new Date(updatedAt).toLocaleString('en-IN')}` : 'Not set yet'}
            </p>
            <button
              type="submit"
              disabled={saving || !isDirty}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg shadow-md hover:bg-on-primary-fixed disabled:bg-gray-300 disabled:shadow-none transition-all font-semibold text-[13px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <TrendingUp size={14} />}
              {saving ? 'Applying…' : 'Apply New Rates'}
            </button>
          </div>
        </form>
      )}

      {toast && (
        <div
          aria-live="polite"
          className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-[13px] font-semibold z-50 ${
            toast.type === 'success' ? 'bg-primary text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
