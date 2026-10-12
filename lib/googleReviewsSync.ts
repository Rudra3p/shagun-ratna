import { createHash } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ApifyClient } from "apify-client";
import Review from "@/models/reviews";
import { s3Client } from "@/lib/r2";

const DAILY_REVIEW_LIMIT = 15;
const DEFAULT_APIFY_ACTOR = "compass/google-maps-reviews-scraper";
const GOOGLE_REVIEW_LOCATION = "Shagunratna Gems & Jewellers, Satellite, Ahmedabad, India";

type OutscraperReview = Record<string, unknown>;

function stringValue(...values: unknown[]): string {
  return values.find((value): value is string => typeof value === "string" && value.trim().length > 0)?.trim() || "";
}

function numberValue(...values: unknown[]): number {
  for (const value of values) {
    const number = typeof value === "number" ? value : Number(value);
    if (Number.isFinite(number)) return number;
  }
  return 0;
}

function dateValue(...values: unknown[]): Date | undefined {
  for (const value of values) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
    if (typeof value !== "string" && typeof value !== "number") continue;

    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }

  return undefined;
}

function normalizeForComparison(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectReviews(value: unknown, reviews: OutscraperReview[] = []): OutscraperReview[] {
  if (Array.isArray(value)) {
    value.forEach((item) => collectReviews(item, reviews));
    return reviews;
  }

  if (value && typeof value === "object") {
    const record = value as OutscraperReview;
    const hasReviewFields = [
      "review_text", "review_rating", "review_id", "review_link",
      "reviewText", "rating", "reviewId", "reviewerName",
    ].some((key) => key in record);
    if (hasReviewFields) reviews.push(record);

    Object.values(record).forEach((item) => {
      if (item && typeof item === "object") collectReviews(item, reviews);
    });
  }

  return reviews;
}

function normalizeReview(review: OutscraperReview, placeId: string) {
  const name = stringValue(
    review.reviewerName,
    review.reviewer_name,
    review.author_title,
    review.author_name,
    review.name,
  );
  const text = stringValue(review.reviewText, review.review_text, review.text, review.content);
  const rating = numberValue(review.stars, review.review_rating, review.rating);
  const authorImage = stringValue(
    review.reviewerPhotoUrl,
    review.author_image,
    review.author_photo,
    review.profile_photo,
  );
  const reviewUrl = stringValue(review.reviewUrl, review.review_link);
  const externalId = stringValue(review.reviewId, review.review_id, review.google_id, reviewUrl);
  const reviewDate = dateValue(
    review.publishedAtDate,
    review.publishedAt,
    review.reviewDate,
    review.review_date,
  );

  if (!name || !text || rating < 1 || rating > 5) return null;

  const sourceReviewId = externalId || createHash("sha256")
    .update(`${placeId}|${name}|${text}|${rating}`)
    .digest("hex");

  return {
    sourceReviewId,
    name,
    product: "Google Review",
    text,
    rating,
    authorImage,
    reviewDate,
    reviewUrl,
    approved: true,
    featured: false,
  };
}

async function uploadAuthorImage(imageUrl: string, sourceReviewId: string) {
  if (!imageUrl) return "";

  const publicDomain = process.env.R2_PUBLIC_DOMAIN;
  if (!publicDomain || !process.env.R2_BUCKET_NAME) {
    throw new Error("R2_PUBLIC_DOMAIN and R2_BUCKET_NAME must be configured to store review images");
  }

  const response = await fetch(imageUrl, { cache: "no-store" });
  if (!response.ok) throw new Error(`Reviewer image request failed with status ${response.status}`);

  const contentType = response.headers.get("content-type")?.split(";")[0] || "image/jpeg";
  if (!contentType.startsWith("image/")) throw new Error("Reviewer image URL did not return an image");

  const key = `reviews/google/${sourceReviewId}.${contentType.split("/")[1] || "jpg"}`;
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: Buffer.from(await response.arrayBuffer()),
    ContentType: contentType,
  }));

  return `${publicDomain.replace(/\/$/, "")}/${key}`;
}

async function removeExistingExactDuplicates() {
  const duplicateGroups = await Review.aggregate([
    { $group: { _id: { name: "$name", text: "$text" }, ids: { $push: "$_id" }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);

  let removed = 0;
  for (const group of duplicateGroups) {
    const idsToDelete = group.ids.slice(1);
    if (idsToDelete.length > 0) {
      const result = await Review.deleteMany({ _id: { $in: idsToDelete } });
      removed += result.deletedCount;
    }
  }

  return removed;
}

export async function syncGoogleReviews() {
  const apiKey = process.env.APIFY_API_KEY;
  const placeId = process.env.GOOGLE_REVIEW_PLACE_ID;

  if (!apiKey || !placeId) {
    throw new Error("APIFY_API_KEY and GOOGLE_REVIEW_PLACE_ID must be configured");
  }

  const client = new ApifyClient({ token: apiKey });
  const actorId = process.env.APIFY_GOOGLE_REVIEWS_ACTOR || DEFAULT_APIFY_ACTOR;
  const placeUrl = process.env.GOOGLE_REVIEW_PLACE_URL ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(GOOGLE_REVIEW_LOCATION)}&query_place_id=${encodeURIComponent(placeId)}`;
  const run = await client.actor(actorId).call({
    startUrls: [{ url: placeUrl }],
    reviewsCount: DAILY_REVIEW_LIMIT,
    reviewsSort: "newest",
  });

  const dataset = await client.dataset(run.defaultDatasetId).listItems();
  const reviews = collectReviews(dataset.items)
    .map((review) => normalizeReview(review, placeId))
    .filter((review): review is NonNullable<typeof review> => review !== null)
    .slice(0, DAILY_REVIEW_LIMIT);

  const duplicatesRemoved = await removeExistingExactDuplicates();
  const uniqueReviews = [];

  for (const review of reviews) {
    const namePattern = new RegExp(`^${escapeRegex(review.name)}$`, "i");
    const sameNameReviews = await Review.find({ name: namePattern }).select("sourceReviewId text").lean();

    // Verification step 1: a new author can be inserted immediately.
    // Verification step 2: for an existing author, only a genuinely new review
    // may be inserted. This handles repeat reviewers without duplicating a daily run.
    const normalizedText = normalizeForComparison(review.text);
    const alreadyExists = sameNameReviews.some((existing) =>
      existing.sourceReviewId === review.sourceReviewId ||
      normalizeForComparison(existing.text) === normalizedText
    );
    if (alreadyExists) continue;

    const authorImage = await uploadAuthorImage(review.authorImage, review.sourceReviewId);
    uniqueReviews.push({ ...review, authorImage });
  }

  if (uniqueReviews.length === 0) {
    return { fetched: reviews.length, inserted: 0, duplicatesRemoved };
  }

  const result = await Review.bulkWrite(
    uniqueReviews.map((review) => ({
      updateOne: {
        filter: { sourceReviewId: review.sourceReviewId },
        update: { $setOnInsert: review },
        upsert: true,
      },
    })),
    { ordered: false }
  );

  return { fetched: reviews.length, inserted: result.upsertedCount, duplicatesRemoved };
}