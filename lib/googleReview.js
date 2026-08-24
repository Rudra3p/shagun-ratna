// Where "write a review" sends visitors. Reviews are no longer collected on the
// site — they're left on the Google Business listing instead.
//
// ⚠️ REPLACE THIS with the boutique's own short review link for a one-tap flow.
// Get it from Google Business Profile → Read reviews → "Get more reviews" → copy
// link. It looks like: https://g.page/r/CxxxxxxxxxxxxxEBM/review
//
// Until then this falls back to a Maps search for the listing, which works but
// costs the visitor an extra tap ("Reviews" → "Write a review") once it opens.
export const GOOGLE_REVIEW_URL =
  'https://www.google.com/maps/search/?api=1&query=Shagunratna+Gems+%26+Jewellers%2C+Shivranjani+Cross+Road%2C+Satellite%2C+Ahmedabad';
