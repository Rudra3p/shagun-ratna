"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import adminApi from '@/lib/adminApi';

const METAL_FIELDS = [
  { key: 'gold', field: 'goldRatePerGram', label: 'Gold' },
  { key: 'silver', field: 'silverRatePerGram', label: 'Silver' },
  { key: 'platinum', field: 'platinumRatePerGram', label: 'Platinum' },
];

// Rates are a once-a-day job, so staleness is measured in calendar days rather
// than elapsed hours — a rate set at 9pm yesterday is still yesterday's rate.
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function daysSince(updatedAt, now = new Date()) {
  if (!updatedAt) return null;
  const then = new Date(updatedAt);
  if (Number.isNaN(then.getTime())) return null;
  return Math.round((startOfDay(now) - startOfDay(then)) / 86400000);
}

/**
 * Warns when the metal rates haven't been set today, so formula-priced pieces
 * aren't quietly selling at an old rate. Renders nothing when no product is
 * actually priced from a rate — there's nothing to go stale.
 */
export default function MetalRateStatus({ className = '' }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    let cancelled = false;
    adminApi.get('/metal-rates')
      .then(({ data }) => {
        if (!cancelled) setState({ rates: data.rates || {}, affected: data.affected || {} });
      })
      .catch((err) => console.error('Failed to load metal rates:', err));
    return () => { cancelled = true; };
  }, []);

  if (!state) return null;

  const { rates, affected } = state;
  const priced = METAL_FIELDS.reduce((sum, m) => sum + (Number(affected[m.key]) || 0), 0);
  if (priced === 0) return null;

  // A metal only matters here if something is actually priced from it.
  const unset = METAL_FIELDS.filter(
    (m) => (Number(affected[m.key]) || 0) > 0 && !(Number(rates[m.field]) > 0)
  );
  const age = daysSince(rates.updatedAt);
  const stale = age === null || age > 0;

  const piece = `${priced} piece${priced === 1 ? '' : 's'}`;

  let tone, Icon, message;
  if (unset.length > 0) {
    tone = 'border-red-200 bg-red-50 text-red-800';
    Icon = AlertTriangle;
    message = `No ${unset.map((m) => m.label).join(' or ')} rate is set, so those pieces are still showing their last saved price.`;
  } else if (stale) {
    tone = 'border-amber-200 bg-amber-50 text-amber-900';
    Icon = AlertTriangle;
    message = age === null
      ? `Metal rates have never been set — ${piece} are priced from them.`
      : `Metal rates were last set ${age === 1 ? 'yesterday' : `${age} days ago`}. ${piece} are priced from them.`;
  } else {
    tone = 'border-emerald-200 bg-emerald-50 text-emerald-900';
    Icon = CheckCircle2;
    message = `Today's rates are set — ${piece} priced from them.`;
  }

  return (
    <div className={`flex items-center justify-between gap-3 flex-wrap px-4 py-3 rounded-xl border ${tone} ${className}`}>
      <p className="flex items-center gap-2 text-[12.5px] font-medium leading-relaxed">
        <Icon size={15} className="shrink-0" />
        {message}
      </p>
      <Link
        href="/admin/metal-rates"
        className="flex items-center gap-1.5 shrink-0 text-[12px] font-bold underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-current rounded"
      >
        <TrendingUp size={13} />
        {stale || unset.length > 0 ? "Set today's rates" : 'Update'}
      </Link>
    </div>
  );
}
