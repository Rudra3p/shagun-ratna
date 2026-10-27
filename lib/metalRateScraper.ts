export interface ScrapedMetalRates {
  goldRatePerGram: number; // 24K pure per gram
  silverRatePerGram: number; // 999 fine silver per gram
  platinumRatePerGram: number; // per gram
  goldRate22k?: number;
  goldRate18k?: number;
  source: string;
}

function cleanPrice(str?: string | null): number | null {
  if (!str) return null;
  const decoded = str
    .replace(/&#x20b9;/gi, '')
    .replace(/&#8377;/gi, '')
    .replace(/&[a-z0-9#]+;/gi, '')
    .replace(/[₹,\s]/g, '')
    .trim();
  const num = parseFloat(decoded);
  return Number.isFinite(num) && num > 0 ? num : null;
}

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

function extractPlatinumRate(html?: string | null): number | null {
  if (!html) return null;

  // Pattern 1: Table with <th>1 gram</th> followed by <td>Date</td><td>&#x20b9;4,624</td>
  const tableIdx = html.indexOf('<th>1 gram</th>');
  if (tableIdx !== -1) {
    const tableSlice = html.slice(tableIdx, tableIdx + 2000);
    const rowMatch = tableSlice.match(/<tr>\s*<td>[^<]+<\/td>\s*<td>([^<]+)<\/td>/i);
    if (rowMatch) {
      const price = cleanPrice(rowMatch[1]);
      if (price && price > 1000 && price < 20000) return Math.round(price);
    }
  }

  // Pattern 2: Generic row with date and rupee prices
  const regex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    const row = m[1];
    if (row.includes('&#x20b9;') || row.includes('₹')) {
      const cells = (row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [])
        .map((c) => c.replace(/<[^>]+>/g, '').trim())
        .filter(Boolean);
      if (cells.length >= 2) {
        const p1 = cleanPrice(cells[1]);
        if (p1 && p1 > 1000 && p1 < 20000) return Math.round(p1);
      }
    }
  }

  return null;
}

// 1. Scrapes Ahmedabad, Gujarat live daily bullion rates (Gold, Silver, Platinum)
async function scrapeAhmedabadBullion(): Promise<ScrapedMetalRates> {
  const [goldRes, silverRes, platRes] = await Promise.all([
    fetch('https://www.goodreturns.in/gold-rates/ahmedabad.html', {
      headers: BROWSER_HEADERS,
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    }),
    fetch('https://www.goodreturns.in/silver-rates/ahmedabad.html', {
      headers: BROWSER_HEADERS,
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    }),
    fetch('https://www.goodreturns.in/platinum-rate-in-ahmedabad.html', {
      headers: BROWSER_HEADERS,
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    }).catch(() => null),
  ]);

  if (!goldRes.ok || !silverRes.ok) {
    throw new Error(`Ahmedabad bullion HTTP failure: gold=${goldRes.status}, silver=${silverRes.status}`);
  }

  const [goldHtml, silverHtml, platHtml] = await Promise.all([
    goldRes.text(),
    silverRes.text(),
    platRes && platRes.ok ? platRes.text() : Promise.resolve(''),
  ]);

  const match24k = goldHtml.match(/id="24K-price"[^>]*>([^<]+)</i);
  const match22k = goldHtml.match(/id="22K-price"[^>]*>([^<]+)</i);
  const match18k = goldHtml.match(/id="18K-price"[^>]*>([^<]+)</i);

  const gold24k = cleanPrice(match24k?.[1]);
  const gold22k = cleanPrice(match22k?.[1]);
  const gold18k = cleanPrice(match18k?.[1]);

  const matchSilver1g = silverHtml.match(/id="silver-1g-price"[^>]*>([^<]+)</i);
  const matchSilver1kg = silverHtml.match(/id="silver-1kg-price"[^>]*>([^<]+)</i);

  let silverPerGram = cleanPrice(matchSilver1g?.[1]);
  if (!silverPerGram && matchSilver1kg) {
    const silver1kg = cleanPrice(matchSilver1kg[1]);
    if (silver1kg) silverPerGram = Math.round(silver1kg / 1000);
  }

  // Live Ahmedabad Platinum Rate
  const scrapedPlatinum = extractPlatinumRate(platHtml);
  const platinumPerGram = scrapedPlatinum || 4624;

  if (!gold24k || !silverPerGram) {
    throw new Error('Failed to parse valid gold/silver prices from Ahmedabad bullion feed');
  }

  return {
    goldRatePerGram: Math.round(gold24k),
    silverRatePerGram: Math.round(silverPerGram),
    platinumRatePerGram: platinumPerGram,
    goldRate22k: gold22k ? Math.round(gold22k) : Math.round(gold24k * 0.916),
    goldRate18k: gold18k ? Math.round(gold18k) : Math.round(gold24k * 0.75),
    source: 'Ahmedabad (Gujarat) Daily Bullion Rates',
  };
}

// 2. Fallback: Official IBJA Direct Table Scraper (ibjarates.com)
async function scrapeIbjaOfficial(): Promise<ScrapedMetalRates> {
  const res = await fetch('https://www.ibjarates.com/', {
    headers: BROWSER_HEADERS,
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    throw new Error(`IBJA official site returned status ${res.status}`);
  }

  const html = await res.text();
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch: RegExpExecArray | null;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const cells = (rowMatch[1].match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [])
      .map((c) => c.replace(/<[^>]+>/g, '').trim())
      .filter(Boolean);

    // Look for date pattern DD/MM/YYYY
    if (cells.length >= 7 && /\d{2}\/\d{2}\/\d{4}/.test(cells[0])) {
      const g999 = cleanPrice(cells[1]);
      const g916 = cleanPrice(cells[3]);
      const g750 = cleanPrice(cells[4]);
      const s999 = cleanPrice(cells[6]);
      const p999 = cleanPrice(cells[7]);

      if (g999 && s999) {
        return {
          goldRatePerGram: Math.round(g999 / 10),
          silverRatePerGram: Math.round(s999 / 1000),
          platinumRatePerGram: p999 ? Math.round(p999 / 10) : 5500,
          goldRate22k: g916 ? Math.round(g916 / 10) : Math.round((g999 / 10) * 0.916),
          goldRate18k: g750 ? Math.round(g750 / 10) : Math.round((g999 / 10) * 0.75),
          source: `IBJA Benchmark Rates (${cells[0]})`,
        };
      }
    }
  }

  throw new Error('Could not parse rates from official IBJA table');
}

// Master Scraper: tries Ahmedabad local rate first, falls back to IBJA national rates
export async function scrapeDailyMetalRates(): Promise<ScrapedMetalRates> {
  try {
    const ahmedabadRates = await scrapeAhmedabadBullion();
    return ahmedabadRates;
  } catch (ahmedabadErr) {
    console.warn('Ahmedabad bullion scraper fallback triggered:', ahmedabadErr);
    return await scrapeIbjaOfficial();
  }
}

