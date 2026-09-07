// Vedic (sidereal) gemstone logic for the "For You" form.
//
// The traditional Jyotish basis for a gemstone is the janma rashi — the zodiac
// sign the Moon occupied at the moment of birth — whose ruling planet decides
// the stone. That is why the form asks for a birth date, a birth time and a
// birth place: the Moon crosses a sign roughly every 2 1/4 days and moves about
// 0.55 degrees an hour, so the time genuinely changes the answer, and the place
// is what tells us which clock that time was read from.
//
// Everything here is pure arithmetic — no ephemeris file, no network call — so
// it runs identically on the server and in the browser.

// --- Angle helpers ---------------------------------------------------------

const DEG = Math.PI / 180;

const norm360 = (deg: number): number => ((deg % 360) + 360) % 360;

const sinDeg = (deg: number): number => Math.sin(deg * DEG);

// --- Time ------------------------------------------------------------------

const J2000 = 2451545.0;
const MS_PER_DAY = 86400000;

/** Julian Day for a UTC instant. */
export const julianDay = (utcMillis: number): number => utcMillis / MS_PER_DAY + 2440587.5;

// Meeus' lunar series is expressed in Terrestrial Time, while a birth record
// holds civil (UT) time. The difference is about a minute across the range of
// dates a customer could plausibly have been born in — worth correcting for,
// though it stays well under the precision of a birth time anyone remembers.
// Polynomials from Espenak & Meeus, "Polynomial Expressions for Delta T".
const deltaTSeconds = (year: number): number => {
  if (year >= 2005) {
    const t = year - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  }
  if (year >= 1986) {
    const t = year - 2000;
    return 63.86 + 0.3345 * t - 0.060374 * t * t + 0.0017275 * t ** 3
      + 0.000651814 * t ** 4 + 0.00002373599 * t ** 5;
  }
  if (year >= 1961) {
    const t = year - 1975;
    return 45.45 + 1.067 * t - (t * t) / 260 - (t ** 3) / 718;
  }
  if (year >= 1941) {
    const t = year - 1950;
    return 29.07 + 0.407 * t - (t * t) / 233 + (t ** 3) / 2547;
  }
  // Before 1941 the correction grows, but those birth records are rare; the
  // 1920 polynomial is a reasonable floor.
  const t = year - 1920;
  return 21.2 + 0.84493 * t - 0.0761 * t * t + 0.0020936 * t ** 3;
};

// --- Moon's longitude (Meeus, Astronomical Algorithms ch. 47) ---------------

// [D, M, M', F, coefficient in 1e-6 degrees] — the 59 non-zero longitude terms
// of table 47.A. Truncating there leaves an error near 0.001 degrees, which is
// about seven seconds of the Moon's motion.
const LONGITUDE_TERMS: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [0, 0, 1, 0, 6288774], [2, 0, -1, 0, 1274027], [2, 0, 0, 0, 658314],
  [0, 0, 2, 0, 213618], [0, 1, 0, 0, -185116], [0, 0, 0, 2, -114332],
  [2, 0, -2, 0, 58793], [2, -1, -1, 0, 57066], [2, 0, 1, 0, 53322],
  [2, -1, 0, 0, 45758], [0, 1, -1, 0, -40923], [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383], [2, 0, 0, -2, 15327], [0, 0, 1, 2, -12528],
  [0, 0, 1, -2, 10980], [4, 0, -1, 0, 10675], [0, 0, 3, 0, 10034],
  [4, 0, -2, 0, 8548], [2, 1, -1, 0, -7888], [2, 1, 0, 0, -6766],
  [1, 0, -1, 0, -5163], [1, 1, 0, 0, 4987], [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994], [4, 0, 0, 0, 3861], [2, 0, -3, 0, 3665],
  [0, 1, -2, 0, -2689], [2, 0, -1, 2, -2602], [2, -1, -2, 0, 2390],
  [1, 0, 1, 0, -2348], [2, -2, 0, 0, 2236], [0, 1, 2, 0, -2120],
  [0, 2, 0, 0, -2069], [2, -2, -1, 0, 2048], [2, 0, 1, -2, -1773],
  [2, 0, 0, 2, -1595], [4, -1, -1, 0, 1215], [0, 0, 2, 2, -1110],
  [3, 0, -1, 0, -892], [2, 1, 1, 0, -810], [4, -1, -2, 0, 759],
  [0, 2, -1, 0, -713], [2, 2, -1, 0, -700], [2, 1, -2, 0, 691],
  [2, -1, 0, -2, 596], [4, 0, 1, 0, 549], [0, 0, 4, 0, 537],
  [4, -1, 0, 0, 520], [1, 0, -2, 0, -487], [2, 1, 0, -2, -399],
  [0, 0, 2, -2, -381], [1, 1, 1, 0, 351], [3, 0, -2, 0, -340],
  [4, 0, -3, 0, 330], [2, -1, 2, 0, 327], [0, 2, 1, 0, -323],
  [1, 1, -1, 0, 299], [2, 0, 3, 0, 294],
];

/** Geocentric tropical ecliptic longitude of the Moon, in degrees. */
export const moonTropicalLongitude = (jdTT: number): number => {
  const T = (jdTT - J2000) / 36525;

  // Moon's mean longitude, mean elongation, the Sun's and the Moon's mean
  // anomalies, and the Moon's argument of latitude.
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T
    + (T ** 3) / 538841 - (T ** 4) / 65194000;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T
    + (T ** 3) / 545868 - (T ** 4) / 113065000;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + (T ** 3) / 24490000;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T
    + (T ** 3) / 69699 - (T ** 4) / 14712000;
  const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T * T
    - (T ** 3) / 3526000 + (T ** 4) / 863310000;

  const A1 = 119.75 + 131.849 * T;
  const A2 = 53.09 + 479264.29 * T;

  // The Sun's orbital eccentricity drifts, so terms driven by the Sun's anomaly
  // are scaled by E once for each power of M they carry.
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;

  let sum = 0;
  for (const [cD, cM, cMp, cF, coefficient] of LONGITUDE_TERMS) {
    const argument = cD * D + cM * M + cMp * Mp + cF * F;
    const eccentricity = cM === 0 ? 1 : E ** Math.abs(cM);
    sum += coefficient * eccentricity * sinDeg(argument);
  }

  // Additive corrections for Venus, Jupiter and the flattening of the Earth.
  sum += 3958 * sinDeg(A1) + 1962 * sinDeg(Lp - F) + 318 * sinDeg(A2);

  return norm360(Lp + sum / 1000000);
};

// --- Ayanamsa --------------------------------------------------------------

// Lahiri (Chitrapaksha) is the ayanamsa India's calendar reform committee
// settled on and the one virtually every Indian almanac uses, so it is what a
// customer's family panditji would have worked from too.
export const lahiriAyanamsa = (jdTT: number): number => {
  const T = (jdTT - J2000) / 36525;
  return 23.85304 + 1.39689 * T + 0.0003 * T * T;
};

/** The Moon's sidereal longitude — what a rashi is actually measured against. */
export const moonSiderealLongitude = (utcMillis: number): number => {
  const jdUT = julianDay(utcMillis);
  const year = new Date(utcMillis).getUTCFullYear();
  const jdTT = jdUT + deltaTSeconds(year) / 86400;
  return norm360(moonTropicalLongitude(jdTT) - lahiriAyanamsa(jdTT));
};

// --- Rashis and their stones ----------------------------------------------

export type PlanetKey = 'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn';

export interface Rashi {
  sanskrit: string;
  english: string;
  lord: PlanetKey;
}

export const RASHIS: readonly Rashi[] = [
  { sanskrit: 'Mesha', english: 'Aries', lord: 'mars' },
  { sanskrit: 'Vrishabha', english: 'Taurus', lord: 'venus' },
  { sanskrit: 'Mithuna', english: 'Gemini', lord: 'mercury' },
  { sanskrit: 'Karka', english: 'Cancer', lord: 'moon' },
  { sanskrit: 'Simha', english: 'Leo', lord: 'sun' },
  { sanskrit: 'Kanya', english: 'Virgo', lord: 'mercury' },
  { sanskrit: 'Tula', english: 'Libra', lord: 'venus' },
  { sanskrit: 'Vrishchika', english: 'Scorpio', lord: 'mars' },
  { sanskrit: 'Dhanu', english: 'Sagittarius', lord: 'jupiter' },
  { sanskrit: 'Makara', english: 'Capricorn', lord: 'saturn' },
  { sanskrit: 'Kumbha', english: 'Aquarius', lord: 'saturn' },
  { sanskrit: 'Meena', english: 'Pisces', lord: 'jupiter' },
];

export interface Gemstone {
  planet: string;
  stone: string;
  hindi: string;
  metal: string;
  finger: string;
  day: string;
  weight: string;
  /** Upratna — the accepted lighter substitutes when the primary stone is out of reach. */
  alternatives: string[];
  /** Words to search the catalogue with, most specific first. */
  searchTerms: string[];
}

export const GEMSTONES: Readonly<Record<PlanetKey, Gemstone>> = {
  sun: {
    planet: 'Surya (Sun)', stone: 'Ruby', hindi: 'Manik',
    metal: 'Gold or copper', finger: 'Ring finger', day: 'Sunday, at sunrise',
    weight: '3 to 6 ratti', alternatives: ['Red Garnet', 'Red Spinel'],
    searchTerms: ['Ruby', 'Manik'],
  },
  moon: {
    planet: 'Chandra (Moon)', stone: 'Pearl', hindi: 'Moti',
    metal: 'Silver', finger: 'Little finger', day: 'Monday, in the evening',
    weight: '4 to 7 ratti', alternatives: ['Moonstone'],
    searchTerms: ['Pearl', 'Moti'],
  },
  mars: {
    planet: 'Mangal (Mars)', stone: 'Red Coral', hindi: 'Moonga',
    metal: 'Gold or copper', finger: 'Ring finger', day: 'Tuesday, in the morning',
    weight: '6 to 9 ratti', alternatives: ['Carnelian'],
    searchTerms: ['Red Coral', 'Coral', 'Moonga'],
  },
  mercury: {
    planet: 'Budh (Mercury)', stone: 'Emerald', hindi: 'Panna',
    metal: 'Gold', finger: 'Little finger', day: 'Wednesday, in the morning',
    weight: '3 to 6 ratti', alternatives: ['Peridot', 'Green Tourmaline'],
    searchTerms: ['Emerald', 'Panna'],
  },
  jupiter: {
    planet: 'Guru (Jupiter)', stone: 'Yellow Sapphire', hindi: 'Pukhraj',
    metal: 'Gold', finger: 'Index finger', day: 'Thursday, in the morning',
    weight: '5 to 8 ratti', alternatives: ['Citrine', 'Yellow Topaz'],
    searchTerms: ['Yellow Sapphire', 'Pukhraj', 'Sapphire'],
  },
  venus: {
    planet: 'Shukra (Venus)', stone: 'Diamond', hindi: 'Heera',
    metal: 'Silver, platinum or white gold', finger: 'Middle finger',
    day: 'Friday, in the morning', weight: 'half to one carat',
    alternatives: ['White Sapphire', 'White Zircon'],
    searchTerms: ['Diamond', 'Heera'],
  },
  saturn: {
    planet: 'Shani (Saturn)', stone: 'Blue Sapphire', hindi: 'Neelam',
    metal: 'Silver or panchdhatu', finger: 'Middle finger',
    day: 'Saturday, in the evening', weight: '4 to 7 ratti',
    alternatives: ['Amethyst', 'Blue Zircon'],
    searchTerms: ['Blue Sapphire', 'Neelam', 'Sapphire'],
  },
};

export const rashiAt = (utcMillis: number): Rashi =>
  RASHIS[Math.floor(moonSiderealLongitude(utcMillis) / 30)];

// --- The public entry point ------------------------------------------------

export interface BirthDetails {
  /** Date of birth as "YYYY-MM-DD", read on the birth place's own clock. */
  date: string;
  /** Clock time of birth as "HH:MM", or null when it isn't known. */
  time?: string | null;
  /** Minutes the birth place's clock runs ahead of UTC (India = 330). */
  utcOffsetMinutes: number;
}

export interface GemstoneReading {
  rashi: Rashi;
  gemstone: Gemstone;
  /** Degrees into the sign, 0 to 30 — how far along the Moon had travelled. */
  degreeInSign: number;
  /**
   * True when the birth time was left out and the Moon changed sign that day, so
   * the answer genuinely depends on a time we weren't given.
   */
  ambiguous: boolean;
  /** The other candidate sign when `ambiguous`; never presented as the answer. */
  alternateRashi: Rashi | null;
  /**
   * True when the Moon crossed into this sign within half an hour of the stated
   * birth time. Birth times are usually remembered to the nearest quarter hour,
   * so this is worth flagging rather than quietly asserting.
   */
  nearBoundary: boolean;
  timeKnown: boolean;
}

/** Local wall-clock fields at a known UTC offset, as a UTC millisecond instant. */
const localToUtcMillis = (
  date: string,
  hours: number,
  minutes: number,
  utcOffsetMinutes: number,
): number | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const asIfUtc = Date.UTC(year, month - 1, day, hours, minutes);
  // Date.UTC rolls invalid dates over (31 February becomes 2 or 3 March), which
  // would silently answer a question nobody asked.
  const rolled = new Date(asIfUtc);
  if (rolled.getUTCMonth() !== month - 1 || rolled.getUTCDate() !== day) return null;
  return asIfUtc - utcOffsetMinutes * 60000;
};

const HALF_HOUR_MS = 30 * 60000;

/**
 * Works out the janma rashi and its gemstone. Returns null only when the date is
 * unusable — a missing time is handled rather than rejected.
 */
export const readGemstone = (
  { date, time, utcOffsetMinutes }: BirthDetails,
): GemstoneReading | null => {
  const parsedTime = time ? /^(\d{1,2}):(\d{2})$/.exec(time) : null;
  const hours = parsedTime ? Number(parsedTime[1]) : 12;
  const minutes = parsedTime ? Number(parsedTime[2]) : 0;
  const timeKnown = Boolean(parsedTime) && hours < 24 && minutes < 60;

  // Without a time, noon is the midpoint that minimises how far off we can be.
  const instant = localToUtcMillis(
    date,
    timeKnown ? hours : 12,
    timeKnown ? minutes : 0,
    utcOffsetMinutes,
  );
  if (instant === null) return null;

  const rashi = rashiAt(instant);

  // A rashi covers about 2 1/4 days, so most days sit entirely inside one sign;
  // only the days the Moon actually crosses over are ambiguous without a time.
  let ambiguous = false;
  let alternateRashi: Rashi | null = null;
  if (!timeKnown) {
    const dayStart = localToUtcMillis(date, 0, 0, utcOffsetMinutes);
    const dayEnd = localToUtcMillis(date, 23, 59, utcOffsetMinutes);
    if (dayStart !== null && dayEnd !== null) {
      const first = rashiAt(dayStart);
      const last = rashiAt(dayEnd);
      if (first.sanskrit !== last.sanskrit) {
        ambiguous = true;
        alternateRashi = first.sanskrit === rashi.sanskrit ? last : first;
      }
    }
  }

  const nearBoundary = timeKnown
    && (rashiAt(instant - HALF_HOUR_MS).sanskrit !== rashi.sanskrit
      || rashiAt(instant + HALF_HOUR_MS).sanskrit !== rashi.sanskrit);

  return {
    rashi,
    gemstone: GEMSTONES[rashi.lord],
    degreeInSign: moonSiderealLongitude(instant) % 30,
    ambiguous,
    alternateRashi,
    nearBoundary,
    timeKnown,
  };
};

/** Age in whole years, so the form can stop asking for it separately. */
export const ageFromBirthDate = (date: string, today: Date = new Date()): number | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  let age = today.getFullYear() - year;
  const hasHadBirthday = today.getMonth() + 1 > month
    || (today.getMonth() + 1 === month && today.getDate() >= day);
  if (!hasHadBirthday) age -= 1;
  return age;
};
