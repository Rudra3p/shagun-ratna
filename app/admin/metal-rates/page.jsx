"use client";

import { useEffect, useState } from 'react';
import adminApi from '@/lib/adminApi';
import { daysSince } from '@/components/MetalRateStatus';
import { purityFactor } from '@/lib/pricing';
import { Loader2, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, Info, RotateCcw, Minus } from 'lucide-react';

// One entry per priced metal — the form, the payload and the dirty check are all
// derived from this, so adding a metal means adding a row here (plus its rate
// field on the MetalRate model and in lib/pricing.ts).
//
// `purities` are the labels the admin can actually pick on a product; each one is
// run through purityFactor() so the breakdown shown here can never drift from the
// number the catalog is really priced with. Accent colours are inline styles, not
// class names, so Tailwind never has to see a class built at runtime.
const METALS = [
  {
    key: 'gold',
    field: 'goldRatePerGram',
    label: 'Gold',
    symbol: 'Au',
    hint: 'Quoted for pure 24K. Each piece applies its own purity.',
    accent: { line: '#EBD9AE', ink: '#8A6A1F', chip: 'linear-gradient(135deg,#E9C46A,#C08A22)' },
    purities: [
      { label: '24K', value: '24K' },
      { label: '22K', value: '22K' },
      { label: '18K', value: '18K' },
      { label: '14K', value: '14K' },
    ],
  },
  {
    key: 'silver',
    field: 'silverRatePerGram',
    label: 'Silver',
    symbol: 'Ag',
    hint: 'Quoted for pure silver. Sterling is billed at 92.5% of it.',
    accent: { line: '#D6DDE6', ink: '#4A5568', chip: 'linear-gradient(135deg,#DCE3EB,#98A4B2)' },
    purities: [
      { label: '999 Fine', value: '999' },
      { label: '925 Sterling', value: '925' },
    ],
  },
  {
    key: 'platinum',
    field: 'platinumRatePerGram',
    label: 'Platinum',
    symbol: 'Pt',
    hint: 'Quoted for pure platinum. PT950 is billed at 95% of it.',
    accent: { line: '#CBD8E3', ink: '#3D5468', chip: 'linear-gradient(135deg,#CFE0EC,#7B98B1)' },
    purities: [
      { label: 'PT950', value: 'PT950' },
      { label: 'PT900', value: 'PT900' },
    ],
  },
];

const ZEROED = Object.fromEntries(METALS.map((m) => [m.key, 0]));

const inr = (n) => `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n))}`;

export default function MetalRatesPage() {
  const [rates, setRates] = useState(() => Object.fromEntries(METALS.map((m) => [m.key, ''])));
  const [saved, setSaved] = useState(ZEROED);
  const [affected, setAffected] = useState(ZEROED);
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
      setRates(Object.fromEntries(METALS.map((m) => [m.key, String(r[m.field] ?? 0)])));
      setSaved(Object.fromEntries(METALS.map((m) => [m.key, r[m.field] ?? 0])));
      setUpdatedAt(r.updatedAt || null);
      setAffected({ ...ZEROED, ...(data.affected || {}) });
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
      await adminApi.put('/metal-rates', Object.fromEntries(
        METALS.map((m) => [m.field, Number(rates[m.key]) || 0])
      ));
      await load();
      showToast('success', 'Rates updated — every formula-priced piece now uses them.');
    } catch (err) {
      console.error('Failed to update metal rates:', err);
      showToast('error', err.response?.data?.error || 'Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const reset = () => setRates(Object.fromEntries(METALS.map((m) => [m.key, String(saved[m.key])])));

  const isDirty = METALS.some((m) => (Number(rates[m.key]) || 0) !== saved[m.key]);
  const totalAffected = METALS.reduce((sum, m) => sum + (Number(affected[m.key]) || 0), 0);

  // Rates are a once-a-day job, so surface the age in days rather than a bare
  // timestamp the admin has to date-compare in their head.
  const age = daysSince(updatedAt);
  const status = !updatedAt
    ? { tone: '#B42318', bg: '#FEF3F2', line: '#FECDCA', Icon: AlertCircle, text: 'Rates never set' }
    : age > 0
      ? { tone: '#B54708', bg: '#FFFAEB', line: '#FEDF89', Icon: AlertCircle, text: `Last set ${age === 1 ? 'yesterday' : `${age} days ago`}` }
      : { tone: '#027A48', bg: '#ECFDF3', line: '#A6F4C5', Icon: CheckCircle2, text: `Set today at ${new Date(updatedAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}` };

  return (
    <div className="max-w-[1100px] space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[18px] font-sans font-bold text-[#721c24] tracking-tight leading-tight">
            Metal Rates
          </h1>
          <p className="text-[13px] text-gray-500 font-sans mt-1 max-w-[560px] leading-relaxed">
            Set today&rsquo;s rate once — every formula-priced piece reprices instantly.
          </p>
        </div>

        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-[12.5px] font-sans font-bold shrink-0"
          style={{ color: status.tone, background: status.bg, borderColor: status.line }}
        >
          <status.Icon size={15} />
          {status.text}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2.5 py-32 text-gray-500 font-sans text-[13px]">
          <Loader2 size={16} className="animate-spin" />
          Loading current rates…
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* One card per metal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {METALS.map((metal) => {
              const typed = Number(rates[metal.key]) || 0;
              const delta = typed - saved[metal.key];
              const count = Number(affected[metal.key]) || 0;
              const unpriced = count > 0 && typed <= 0;

              return (
                <div
                  key={metal.key}
                  className="bg-white rounded-[20px] border border-gray-50 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col"
                >
                  {/* Metal-coloured hairline keeps the three cards apart at a glance */}
                  <div className="h-1" style={{ background: metal.accent.chip }} />

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-[14px] flex items-center justify-center font-brand font-bold text-[17px] text-white shadow-sm"
                          style={{ background: metal.accent.chip }}
                        >
                          {metal.symbol}
                        </div>
                        <div>
                          <h2 className="text-[15px] font-sans font-bold text-gray-900 leading-none">{metal.label}</h2>
                          <p className="text-[11px] font-sans font-bold text-gray-400 mt-1.5 uppercase tracking-wider">
                            {count} piece{count === 1 ? '' : 's'}
                          </p>
                        </div>
                      </div>

                      {/* Only worth showing once the number has actually moved */}
                      {delta !== 0 && (
                        <span
                          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-sans font-bold ${
                            delta > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {delta > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {delta > 0 ? '+' : '−'}{inr(Math.abs(delta))}
                        </span>
                      )}
                    </div>

                    <div className="relative mt-5">
                      <label htmlFor={`${metal.key}-rate`} className="sr-only">
                        {metal.label} rate in rupees per gram
                      </label>
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] font-sans font-bold text-gray-300 pointer-events-none">
                        ₹
                      </span>
                      <input
                        id={`${metal.key}-rate`}
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        value={rates[metal.key]}
                        onChange={(e) => setRates({ ...rates, [metal.key]: e.target.value })}
                        className="w-full pl-9 pr-[62px] py-3.5 bg-gray-50/70 border border-gray-200 rounded-xl text-[22px] font-sans font-bold text-gray-900 tabular-nums transition-all focus:outline-none focus:bg-white focus:border-[#721c24] focus-visible:ring-2 focus-visible:ring-[#721c24]/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-sans font-bold text-gray-400 pointer-events-none">
                        / gram
                      </span>
                    </div>

                    <p className="text-[11.5px] text-gray-400 font-sans leading-relaxed mt-2.5">{metal.hint}</p>

                    {/* The rate is quoted pure but nothing is sold pure — showing the
                        per-purity rate turns the formula into a number the admin can
                        sanity-check against the market before saving. */}
                    <div
                      className="mt-5 pt-4 border-t border-dashed space-y-2"
                      style={{ borderColor: metal.accent.line }}
                    >
                      <p
                        className="text-[10px] font-sans font-bold uppercase tracking-widest"
                        style={{ color: metal.accent.ink }}
                      >
                        Works out to
                      </p>
                      {metal.purities.map((p) => (
                        <div key={p.value} className="flex items-baseline justify-between gap-2">
                          <span className="text-[12px] font-sans font-semibold text-gray-500">{p.label}</span>
                          <span className="text-[13px] font-sans font-bold text-gray-900 tabular-nums">
                            {typed > 0
                              ? `${inr(typed * purityFactor(p.value))}/g`
                              : <Minus size={13} className="text-gray-300" />}
                          </span>
                        </div>
                      ))}
                    </div>

                    {unpriced && (
                      <p className="flex items-start gap-1.5 mt-4 text-[11.5px] font-sans font-semibold text-red-700 leading-relaxed">
                        <AlertCircle size={13} className="shrink-0 mt-0.5" />
                        No rate set — these pieces still show their last saved price.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* How the number is built, in the dashboard's banner language */}
          <div className="bg-[#721c24] rounded-[20px] p-8 relative overflow-hidden text-white flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-md">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] border border-white/10 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] border border-white/5 rounded-full translate-y-1/2 pointer-events-none" />

            <div className="relative z-10 max-w-xl">
              <h2 className="text-[20px] font-sans font-bold tracking-tight mb-3 text-white flex items-center gap-2">
                <Info size={18} />
                How each price is built
              </h2>
              <p className="text-[#dcc0bf] text-[14px] leading-relaxed font-sans font-medium">
                Pieces set to <strong className="text-white">Manual</strong> pricing keep the price you typed and are
                never touched by this screen.
              </p>
            </div>

            <div className="relative z-10 shrink-0 w-full lg:w-auto">
              <div className="bg-white/10 border border-white/20 px-6 py-5 rounded-[16px]">
                <p className="text-[13px] font-sans font-bold text-white leading-relaxed">
                  metal rate <span className="text-[#dcc0bf]">×</span> purity <span className="text-[#dcc0bf]">×</span>{' '}
                  weight <span className="text-[#dcc0bf]">+</span> labour
                </p>
                <p className="text-[11.5px] text-[#dcc0bf] font-sans font-medium mt-2">
                  {totalAffected} piece{totalAffected === 1 ? '' : 's'} priced this way right now
                </p>
              </div>
            </div>
          </div>

          {/* Sticky so all three cards can be edited and Apply is still in reach */}
          {isDirty && (
            <div className="sticky bottom-4 z-40 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between gap-4 flex-wrap bg-white/95 backdrop-blur border border-gray-100 rounded-[16px] px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                <p className="text-[12.5px] font-sans font-semibold text-gray-600">
                  Unsaved changes — {totalAffected} piece{totalAffected === 1 ? '' : 's'} will reprice.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={reset}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-sans font-bold text-gray-500 hover:bg-gray-50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                  >
                    <RotateCcw size={14} />
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#721c24] text-white rounded-lg shadow-md hover:bg-[#540411] disabled:bg-gray-300 disabled:shadow-none transition-all font-sans font-bold text-[13px] tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-[#721c24] focus-visible:ring-offset-2"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <TrendingUp size={14} />}
                    {saving ? 'Applying…' : 'Apply New Rates'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      )}

      {toast && (
        <div
          aria-live="polite"
          className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-[13px] font-sans font-semibold z-50 animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'success' ? 'bg-[#721c24] text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
