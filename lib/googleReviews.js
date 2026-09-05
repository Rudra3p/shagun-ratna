// Reads the boutique's Google Business listing — its rating, its review count, and
// the reviews themselves, each with the reviewer's profile photo. This is the live
// source behind the reviews shown on the site; nobody has to copy anything across.
//
// Needs two env vars. Without them every call returns null and the site quietly
// falls back to whatever is in the database:
//   GOOGLE_PLACES_API_KEY — Places API (New) key, restricted to this server
//   GOOGLE_PLACE_ID       — the listing's place id (looks like "ChIJ...")
//
// Server-only — kept out of lib/googleReview.js so the API key never rides along
// into a client bundle that only wanted the "write a review" link.
//
// ⚠️ Google returns at most 5 reviews per place and offers no way to page further,
// so `reviews` is always a sample; `totalRatings` is the listing's real count.

const PLACES_ENDPOINT = 'https://places.googleapis.com/v1/places';
const FIELD_MASK = 'id,rating,userRatingCount,reviews';
const REVALIDATE_SECONDS = 60 * 60 * 6; // reviews trickle in — 4 calls a day is plenty

export const isGoogleReviewsConfigured = () =>
  Boolean(process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACE_ID);

// One Google review flattened into the shape the rest of the app speaks.
const normalize = (review) => {
  const author = review.authorAttribution || {};
  const body = review.originalText?.text || review.text?.text || '';

  return {
    // "places/<place>/reviews/<id>" — stable per review, so it doubles as a render key
    googleReviewId: review.name || '',
    name: (author.displayName || '').trim(),
    authorImage: author.photoUri || '', // the avatar circle
    authorUrl: author.uri || '',
    text: body.trim(),
    rating: Number(review.rating) || 0,
    relativeTime: review.relativePublishTimeDescription || '',
  };
};

// Returns null when Google can't be reached or isn't set up — which the callers
// treat as "use the database instead", not as an error worth showing a visitor.
export async function fetchGooglePlace() {
  if (!isGoogleReviewsConfigured()) return null;

  try {
    const res = await fetch(
      `${PLACES_ENDPOINT}/${process.env.GOOGLE_PLACE_ID}?languageCode=en`,
      {
        headers: {
          'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': FIELD_MASK,
        },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );

    if (!res.ok) {
      console.error('Google Places fetch failed:', res.status, await res.text());
      return null;
    }

    const data = await res.json();

    return {
      rating: Number(data.rating) || null,
      totalRatings: Number(data.userRatingCount) || 0,
      // Star-only reviews carry no text and read as empty cards, so they're dropped.
      reviews: (data.reviews || [])
        .map(normalize)
        .filter((r) => r.googleReviewId && r.name.length >= 2 && r.text.length >= 5 && r.rating >= 1),
    };
  } catch (error) {
    console.error('Google Places fetch threw:', error);
    return null;
  }
}
