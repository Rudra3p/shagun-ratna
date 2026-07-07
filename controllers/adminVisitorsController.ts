import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import ClarityStat from "@/models/ClarityStat";

const CLARITY_ENDPOINT = process.env.CLARITY_API_ENDPOINT;
const CLARITY_TOKEN = process.env.CLARITY_API_TOKEN;

// Clarity's Data Export API allows ~10 requests/day/project. Syncing at most
// once every 3 hours keeps us at 8 calls/day, safely under that cap.
const MIN_SYNC_INTERVAL_MS = 3 * 60 * 60 * 1000;
const HISTORY_DAYS = 10;

const toDateKey = (d: Date): string => d.toISOString().slice(0, 10);

interface ClarityTotals {
  sessions: number;
  visitors: number;
  botSessions: number;
}

function extractTrafficTotals(payload: unknown): ClarityTotals {
  const totals: ClarityTotals = { sessions: 0, visitors: 0, botSessions: 0 };
  const metrics = Array.isArray(payload) ? payload : [];

  const traffic = metrics.find(
    (m) => typeof m?.metricName === "string" && m.metricName.toLowerCase() === "traffic"
  );

  for (const row of traffic?.information || []) {
    totals.sessions += Number(row.totalSessionCount) || 0;
    totals.visitors += Number(row.distinctUserCount) || 0;
    totals.botSessions += Number(row.totalBotSessionCount) || 0;
  }

  return totals;
}

async function syncClarityStats(): Promise<void> {
  if (!CLARITY_ENDPOINT || !CLARITY_TOKEN) {
    console.warn("Clarity sync skipped: CLARITY_API_ENDPOINT/CLARITY_API_TOKEN not configured");
    return;
  }

  const todayKey = toDateKey(new Date());
  const existing = await ClarityStat.findOne({ date: todayKey });

  if (existing?.lastSyncedAt && Date.now() - existing.lastSyncedAt.getTime() < MIN_SYNC_INTERVAL_MS) {
    return;
  }

  const res = await fetch(`${CLARITY_ENDPOINT}?numOfDays=1`, {
    headers: { Authorization: `Bearer ${CLARITY_TOKEN}` },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Clarity API request failed:", res.status, await res.text());
    return;
  }

  const payload = await res.json();
  const totals = extractTrafficTotals(payload);

  await ClarityStat.findOneAndUpdate(
    { date: todayKey },
    { ...totals, lastSyncedAt: new Date() },
    { upsert: true }
  );
}

export const getVisitorStats = async (): Promise<NextResponse> => {
  try {
    await dbConnect();

    try {
      await syncClarityStats();
    } catch (error) {
      console.error("Clarity sync failed, serving cached data:", error);
    }

    const since = toDateKey(new Date(Date.now() - (HISTORY_DAYS - 1) * 24 * 60 * 60 * 1000));
    const rows = await ClarityStat.find({ date: { $gte: since } })
      .sort({ date: 1 })
      .select("date sessions visitors")
      .lean();

    const chart = rows.map((r) => ({ date: r.date, visitors: r.visitors, sessions: r.sessions }));
    const today = chart[chart.length - 1] || { date: toDateKey(new Date()), visitors: 0, sessions: 0 };
    const yesterday = chart.length > 1 ? chart[chart.length - 2] : null;

    const changePercent = yesterday && yesterday.visitors > 0
      ? Number((((today.visitors - yesterday.visitors) / yesterday.visitors) * 100).toFixed(1))
      : null;

    return NextResponse.json(
      { success: true, today, changePercent, chart },
      { status: 200 }
    );
  } catch (error) {
    console.error("Visitor Stats API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch visitor stats" },
      { status: 500 }
    );
  }
};
