// Probe for the Navamsha Vedic astrology API (https://api.navamsha.in).
//
// Run it once, on a machine with internet, to answer the two things that can't
// be settled from their docs: what request shape the endpoints actually accept,
// and what the response JSON looks like. It also cross-checks our own offline
// moon calculation in lib/jyotish.ts against their chart for the same birth.
//
//   npm run astro:probe
//
// It is a development tool, not part of the site. Nothing here runs in the app.

import * as dotenv from 'dotenv';
import { readGemstone, moonSiderealLongitude, RASHIS } from './lib/jyotish';

dotenv.config({ path: '.env.local' });
dotenv.config();

const API_KEY = process.env.NAVAMSHA_API_KEY;
const BASE = 'https://api.navamsha.in';

// A birth with a well-known chart, so a wrong answer is obvious: India's
// independence moment — Moon in Karka (Cancer), Pushya nakshatra.
const SAMPLE = {
  label: '15 Aug 1947, 00:00 IST, Delhi',
  date: '1947-08-15',
  time: '00:00',
  lat: 28.61,
  lon: 77.21,
  tzHours: 5.5,
};

// Their docs show "dob, tob, lat, lng as query params" but never spell out the
// formats, so we try the plausible spellings and report which one answers.
const buildQueries = (): Array<{ name: string; params: Record<string, string> }> => {
  const { date, time, lat, lon, tzHours } = SAMPLE;
  const [y, m, d] = date.split('-');
  return [
    { name: 'dob=YYYY-MM-DD, tz', params: { dob: date, tob: time, lat: String(lat), lng: String(lon), tz: String(tzHours) } },
    { name: 'dob=YYYY-MM-DD, no tz', params: { dob: date, tob: time, lat: String(lat), lng: String(lon) } },
    { name: 'dob=DD/MM/YYYY, tz', params: { dob: `${d}/${m}/${y}`, tob: time, lat: String(lat), lng: String(lon), tz: String(tzHours) } },
    { name: 'date/time naming, tz', params: { date, time, latitude: String(lat), longitude: String(lon), timezone: String(tzHours) } },
  ];
};

const ENDPOINTS = [
  '/api/v1/kundali/basic',
  '/api/v1/kundali/chandra-chart',
  '/api/v1/astrology/kundli',
  '/api/v1/planets',
];

const call = async (path: string, params: Record<string, string>) => {
  const url = `${BASE}${path}?${new URLSearchParams(params)}`;
  try {
    const res = await fetch(url, { headers: { 'X-API-Key': API_KEY as string } });
    const text = await res.text();
    let body: unknown;
    try { body = JSON.parse(text); } catch { body = text.slice(0, 400); }
    return { status: res.status, body };
  } catch (error) {
    return { status: 0, body: `network error: ${(error as Error).message}` };
  }
};

const main = async () => {
  if (!API_KEY) {
    console.error('NAVAMSHA_API_KEY is not set in .env.local');
    process.exit(1);
  }

  // What we believe the answer is, computed locally with no network.
  const ours = readGemstone({ date: SAMPLE.date, time: SAMPLE.time, utcOffsetMinutes: SAMPLE.tzHours * 60 });
  const utc = Date.UTC(1947, 7, 15, 0, 0) - SAMPLE.tzHours * 3600000;
  console.log('=== Our offline calculation (lib/jyotish.ts) ===');
  console.log(`${SAMPLE.label}`);
  console.log(`  moon sidereal longitude : ${moonSiderealLongitude(utc).toFixed(4)} deg`);
  console.log(`  rashi                   : ${ours?.rashi.sanskrit} (${ours?.rashi.english})`);
  console.log(`  gemstone                : ${ours?.gemstone.stone}`);
  console.log(`  expected from published charts: Karka (Cancer), Pushya nakshatra\n`);

  console.log('=== Probing Navamsha ===');
  for (const path of ENDPOINTS) {
    let answered = false;
    for (const query of buildQueries()) {
      const { status, body } = await call(path, query.params);
      if (status === 200) {
        console.log(`\nOK  ${path}  [${query.name}]`);
        console.log(JSON.stringify(body, null, 2).slice(0, 2500));
        answered = true;
        break;
      }
      // 401/403 means the key or header is wrong — no point trying more shapes.
      if (status === 401 || status === 403) {
        console.log(`\nAUTH FAILED ${path} -> ${status}`);
        console.log(JSON.stringify(body).slice(0, 300));
        return;
      }
      if (status === 0) {
        console.log(`\n${path} [${query.name}] -> ${body}`);
      }
    }
    if (!answered) console.log(`\n--  ${path}: no request shape accepted (see statuses above)`);
  }

  console.log('\nCompare the rashi/nakshatra in the JSON above against our offline values.');
  console.log(`Rashi order used locally: ${RASHIS.map((r) => r.sanskrit).join(', ')}`);
};

main();
