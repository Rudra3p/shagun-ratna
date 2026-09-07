// Places the visitor's recommended pieces into the opening cards of the catalogue.
//
// The pieces keep their badge but sit among ordinary products rather than in a
// shelf of their own, so the grid still reads as one catalogue. Their positions
// are drawn at random from the first few cards — high enough to be seen without
// scrolling, scattered enough that the page doesn't look laid out to a formula.

// How far into the grid a recommended piece may land, and how many may be woven.
export const RECOMMENDED_WINDOW = 4;
export const MAX_WOVEN = 3;

// Seeded so an arrangement is fixed for given inputs: re-rendering, or scrolling
// the next batch in, must never reshuffle the cards already under the reader's
// thumb. Mulberry32's first couple of outputs stay close together for seeds that
// are themselves close together, and we only ever draw three or four numbers —
// so the generator is advanced past them before it is handed out, otherwise
// every stone lands on nearly the same pair of slots.
const WARMUP_DRAWS = 8;

export const seededRandom = (seed) => {
  let state = seed | 0;
  const next = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = 0; i < WARMUP_DRAWS; i++) next();
  return next;
};

/** `count` distinct positions inside the opening window, in ascending order. */
export const pickSlots = (count, random, window = RECOMMENDED_WINDOW) => {
  const slots = [...Array(window).keys()];
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  return slots.slice(0, Math.min(count, window)).sort((a, b) => a - b);
};

// FNV-1a over the ids being placed. Deriving the seed from the data rather than
// from Math.random keeps this a pure function of its inputs — so it is safe to
// call during render, it can't reshuffle the grid on a re-render, and a reader
// who refreshes finds the cards where they left them. Two visitors with
// different stones still get different layouts, which is the point.
const seedFrom = (ids) => {
  let hash = 0x811c9dc5;
  for (const id of ids) {
    for (let i = 0; i < id.length; i++) {
      hash ^= id.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
  }
  return hash >>> 0;
};

/**
 * Returns `products` with up to MAX_WOVEN recommended pieces moved into
 * scattered slots near the front. A recommended piece already present in
 * `products` is moved rather than duplicated; one that hasn't been paged in yet
 * is injected. Pass `seed` only to pin the arrangement in a test.
 */
export const weaveRecommended = (products, recommended, seed) => {
  if (!products?.length || !recommended?.length) return products || [];

  const recommendedIds = new Set(recommended.map((p) => p._id));
  const loadedIds = new Set(products.map((p) => p._id));

  const picks = [
    ...products.filter((p) => recommendedIds.has(p._id)),
    ...recommended.filter((p) => !loadedIds.has(p._id)),
  ].slice(0, MAX_WOVEN);

  if (picks.length === 0) return products;

  const pickedIds = new Set(picks.map((p) => p._id));
  const arranged = products.filter((p) => !pickedIds.has(p._id));

  const pickedIdList = picks.map((p) => String(p._id));
  const random = seededRandom(seed ?? seedFrom(pickedIdList));

  // Ascending, so each insert lands on the index it was actually dealt.
  pickSlots(picks.length, random).forEach((slot, i) => {
    arranged.splice(Math.min(slot, arranged.length), 0, picks[i]);
  });

  return arranged;
};
