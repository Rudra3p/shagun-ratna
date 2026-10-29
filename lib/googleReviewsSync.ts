import { createHash } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ApifyClient } from "apify-client";
import Review from "@/models/reviews";
import { s3Client } from "@/lib/r2";

const DAILY_REVIEW_LIMIT = 15;
const DEFAULT_APIFY_ACTOR = "compass/google-maps-reviews-scraper";
const DEFAULT_PLACE_ID = "ChIJCXuSoJGbXjkRpYb16Lvjb4o";
const GOOGLE_REVIEW_LOCATION = "Shagunratna Gems & Jewellers, Shivranjani Cross Road, Satellite, Ahmedabad, Gujarat 380015, India";

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
  let text = stringValue(review.reviewText, review.review_text, review.text, review.content);
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

  // If reviewer left stars only without text, assign a clean, compliant summary string
  if (!text && rating >= 1 && rating <= 5) {
    text = `Rated ${rating} stars on Google Reviews`;
  }

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

async function uploadAuthorImage(imageUrl: string, sourceReviewId: string): Promise<string> {
  if (!imageUrl) return "";

  const publicDomain = process.env.R2_PUBLIC_DOMAIN;
  if (!publicDomain || !process.env.R2_BUCKET_NAME) {
    return imageUrl;
  }

  // Already uploaded to R2
  if (imageUrl.startsWith(publicDomain)) {
    return imageUrl;
  }

  try {
    const response = await fetch(imageUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return imageUrl;

    const contentType = response.headers.get("content-type")?.split(";")[0] || "image/jpeg";
    if (!contentType.startsWith("image/")) return imageUrl;

    const ext = contentType.split("/")[1] || "jpg";
    const key = `reviews/google/${sourceReviewId}.${ext}`;
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(await response.arrayBuffer()),
      ContentType: contentType,
    }));

    return `${publicDomain.replace(/\/$/, "")}/${key}`;
  } catch (err) {
    console.warn(`[Review Sync] Could not mirror avatar to R2 for ${sourceReviewId}, retaining original URL:`, err);
    return imageUrl;
  }
}

async function removeExistingExactDuplicates(): Promise<number> {
  const duplicateGroups = await Review.aggregate([
    { $group: { _id: { name: "$name" }, ids: { $push: "$_id" }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);

  let removed = 0;
  for (const group of duplicateGroups) {
    const docs = await Review.find({ _id: { $in: group.ids } }).lean();
    docs.sort((a, b) => {
      const aScore = (a.sourceReviewId && a.sourceReviewId !== "NONE") ? 1 : 0;
      const bScore = (b.sourceReviewId && b.sourceReviewId !== "NONE") ? 1 : 0;
      return bScore - aScore;
    });

    const toDelete = docs.slice(1).map((d) => d._id);
    if (toDelete.length > 0) {
      const result = await Review.deleteMany({ _id: { $in: toDelete } });
      removed += result.deletedCount;
    }
  }

  return removed;
}

export async function syncGoogleReviews(limit = DAILY_REVIEW_LIMIT) {
  const apiKey = process.env.APIFY_API_KEY;
  const placeId = process.env.GOOGLE_REVIEW_PLACE_ID?.trim() || DEFAULT_PLACE_ID;

  if (!apiKey) {
    throw new Error("APIFY_API_KEY must be configured");
  }

  const client = new ApifyClient({ token: apiKey });
  const actorId = process.env.APIFY_GOOGLE_REVIEWS_ACTOR || DEFAULT_APIFY_ACTOR;
  const placeUrl = process.env.GOOGLE_REVIEW_PLACE_URL ||
    `https://www.google.com/maps/search/?api=1&query=Shagunratna%20Gems%20%26%20Jewellers&query_place_id=${encodeURIComponent(placeId)}`;
  const comparisonKey = placeId || GOOGLE_REVIEW_LOCATION;

  const run = await client.actor(actorId).call({
    startUrls: [{ url: placeUrl }],
    maxReviews: limit,
    reviewsSort: "newest",
    reviewsOrigin: "google",
  });

  const dataset = await client.dataset(run.defaultDatasetId).listItems();
  const rawReviews = collectReviews(dataset.items);
  const reviews = rawReviews
    .map((review) => normalizeReview(review, comparisonKey))
    .filter((review): review is NonNullable<typeof review> => review !== null)
    .slice(0, limit);

  const duplicatesRemoved = await removeExistingExactDuplicates();
  let inserted = 0;
  let updated = 0;

  for (const review of reviews) {
    const uploadedImage = review.authorImage ? await uploadAuthorImage(review.authorImage, review.sourceReviewId) : "";
    const reviewData = { ...review, authorImage: uploadedImage };

    // 1. Check if a review with this exact sourceReviewId exists
    const existingById = await Review.findOne({ sourceReviewId: review.sourceReviewId });
    if (existingById) {
      await Review.updateOne(
        { _id: existingById._id },
        {
          $set: {
            rating: reviewData.rating,
            reviewDate: reviewData.reviewDate || existingById.reviewDate,
            reviewUrl: reviewData.reviewUrl || existingById.reviewUrl,
            authorImage: reviewData.authorImage || existingById.authorImage,
            text: reviewData.text,
            approved: true,
          },
        }
      );
      updated++;
      continue;
    }

    // 2. Check if an existing review matches the reviewer's name
    const namePattern = new RegExp(`^${escapeRegex(review.name)}$`, "i");
    const existingByName = await Review.findOne({ name: namePattern });

    if (existingByName) {
      // Connect existing review to this sourceReviewId and update its metadata
      await Review.updateOne(
        { _id: existingByName._id },
        {
          $set: {
            sourceReviewId: reviewData.sourceReviewId,
            rating: reviewData.rating,
            reviewDate: reviewData.reviewDate || existingByName.reviewDate,
            reviewUrl: reviewData.reviewUrl || existingByName.reviewUrl,
            authorImage: reviewData.authorImage || existingByName.authorImage,
            text: reviewData.text,
            approved: true,
          },
        }
      );
      updated++;
      continue;
    }

    // 3. Brand new review: insert
    await Review.create(reviewData);
    inserted++;
  }

  // Deduplicate any remaining duplicate names
  const postDuplicatesRemoved = await removeExistingExactDuplicates();

  return {
    fetched: reviews.length,
    inserted,
    updated,
    duplicatesRemoved: duplicatesRemoved + postDuplicatesRemoved,
  };
}
