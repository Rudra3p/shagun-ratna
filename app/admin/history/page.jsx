"use client";

import { useEffect, useState, useCallback } from 'react';
import { Eye, Inbox, MessageSquare, UserPlus } from 'lucide-react';
import adminApi from '@/lib/adminApi';

const parseDateKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const formatDay = (key, index) => {
  if (index === 0) return 'Today';
  if (index === 1) return 'Yesterday';
  return parseDateKey(key).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};

const formatWeekRange = (startKey, endKey, index) => {
  const start = parseDateKey(startKey);
  const end = parseDateKey(endKey);
  const range = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  return index === 0 ? `This Week (${range})` : range;
};

const METRICS = [
  { key: 'visitors', label: 'Visitors', icon: Eye },
  { key: 'inquiries', label: 'Inquiries', icon: Inbox },
  { key: 'reviews', label: 'Reviews', icon: MessageSquare },
  { key: 'newUsers', label: 'New Users', icon: UserPlus },
];

export default function HistoryPage() {
  const [range, setRange] = useState('daily');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async (selectedRange) => {
    try {
      setLoading(true);
      setError(null);
      const { data: res } = await adminApi.get(`/history?range=${selectedRange}`);
      setData(res.data || []);
    } catch (err) {
      console.error('Failed to fetch history stats:', err);
      setError('Failed to load history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(range);
  }, [range, fetchHistory]);

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-xl font-bold text-primary">Activity History</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Visitors, inquiries, reviews, and new users over time.
          </p>
        </div>

        <div className="flex bg-surface-container-high p-1 rounded-lg">
          <button
            onClick={() => setRange('daily')}
            className={`px-4 py-1.5 rounded-md font-label text-xs font-bold transition-all ${
              range === 'daily'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-secondary hover:bg-surface-variant/50'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setRange('weekly')}
            className={`px-4 py-1.5 rounded-md font-label text-xs font-bold transition-all ${
              range === 'weekly'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-secondary hover:bg-surface-variant/50'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      ) : error ? (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-10 text-center text-on-surface-variant">
          {error}
        </div>
      ) : data.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-10 text-center text-on-surface-variant">
          No activity recorded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((period, index) => (
            <div
              key={period.date || period.startDate}
              className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm font-bold text-on-surface">
                  {/* Keyed off the period's own shape, not the `range` toggle state — right
                      after switching ranges, `data` can still hold the previous range's
                      shape for one render while the new fetch is in flight. */}
                  {period.startDate
                    ? formatWeekRange(period.startDate, period.endDate, index)
                    : formatDay(period.date, index)}
                </span>
                <div className="flex-1 h-px bg-outline-variant/30" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {METRICS.map(({ key, label, icon: Icon }) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 bg-surface-container-low rounded-xl p-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-bold text-on-surface leading-none">
                        {period[key]}
                      </p>
                      <p className="text-xs text-secondary font-label mt-1 truncate">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
