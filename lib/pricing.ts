// Shared price calculation for formula-priced products.
//
//   price = (metal rate/gram × purity factor × weight) + labour cost
//
// The admin sets the gold, silver and platinum rates by hand in Admin → Metal
// Rates. Products on 'manual' mode keep whatever price was typed in and ignore
// all of this.

export interface MetalRates {
  goldRatePerGram?: number;
  silverRatePerGram?: number;
  platinumRatePerGram?: number;
}

export interface PricedProduct {
  pricingMode?: string;
  metal?: string;
  metalWeight?: number | string;
  labourCost?: number | string;
  purity?: string;
  price?: number;
  discount?: number;
  offerPrice?: number;
  [key: string]: unknown;
}

// Metal rates are quoted for pure metal, but jewellery is alloyed. These factors
// convert a pure rate to the real value of the alloy, read from the product's
// existing purity label so the admin doesn't have to enter it twice.
const PURITY_FACTORS: { match: RegExp; factor: number }[] = [
  { match: /24\s*k/i, factor: 1 },
  { match: /22\s*k/i, factor: 0.916 },
  { match: /18\s*k/i, factor: 0.75 },
  { match: /14\s*k/i, factor: 0.585 },
  { match: /925/, factor: 0.925 },   // sterling silver
  { match: /999/, factor: 0.999 },   // fine silver
  { match: /950/, factor: 0.95 },    // PT950 platinum
  { match: /900/, factor: 0.9 },     // PT900 platinum
];

// Which rate on the shared rate document prices a given metal. Rows saved before
// Platinum existed can still have a blank metal; they were priced off gold, so
// that stays the fallback rather than silently unpricing them.
const RATE_FIELD_BY_METAL: Record<string, keyof MetalRates> = {
  Gold: 'goldRatePerGram',
  Silver: 'silverRatePerGram',
  Platinum: 'platinumRatePerGram',
};

export function rateFieldFor(metal?: string): keyof MetalRates {
  return RATE_FIELD_BY_METAL[metal ?? ''] ?? 'goldRatePerGram';
}

export function purityFactor(purity?: string): number {
  if (!purity) return 1;
  const hit = PURITY_FACTORS.find((p) => p.match.test(purity));
  return hit ? hit.factor : 1;
}

// Returns a number, or null when the product isn't formula-priced or is missing
// the inputs needed to price it (so callers can fall back to the manual price).
export function computeFormulaPrice(product: PricedProduct | null | undefined, rates?: MetalRates | null): number | null {
  if (!product || product.pricingMode !== 'formula') return null;

  const weight = Number(product.metalWeight) || 0;
  const labour = Number(product.labourCost) || 0;
  if (weight <= 0) return null;

  const perGram = Number(rates?.[rateFieldFor(product.metal)]) || 0;
  if (perGram <= 0) return null;

  const metalValue = perGram * purityFactor(product.purity) * weight;
  return Math.round(metalValue + labour);
}

// Applies the formula price onto a product (or list) so everything downstream —
// cards, detail pages, structured data — keeps reading a plain `price` field and
// needs no knowledge of how it was derived.
export function applyPricing<T extends PricedProduct>(product: T, rates?: MetalRates | null): T {
  if (!product) return product;
  const computed = computeFormulaPrice(product, rates);
  if (computed === null) return product;

  // offerPrice is a manual override; when a discount % is set instead, re-derive
  // it from the freshly computed price so discounts track the live metal rate.
  const discount = Number(product.discount) || 0;
  const offerPrice = discount > 0
    ? Math.round(computed * (1 - discount / 100))
    : Number(product.offerPrice) || 0;

  return { ...product, price: computed, offerPrice };
}

export function applyPricingToList<T extends PricedProduct>(products: T[], rates?: MetalRates | null): T[] {
  if (!Array.isArray(products)) return products;
  return products.map((p) => applyPricing(p, rates));
}
