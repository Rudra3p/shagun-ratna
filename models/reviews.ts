import mongoose, { Schema } from "mongoose";
import { z } from "zod";

export const ReviewZodSchema = z.object({
  name: z.string().min(2, "Name is required").trim(),
  product: z.string().min(2, "Product is required").trim(),
  text: z.string().min(5, "Review text is required").trim(),
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  approved: z.boolean().optional().default(false),
  authorImage: z.string().url().optional().or(z.literal("")),
});

const reviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    product: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    approved: { type: Boolean, default: false },
    featured: { type: Boolean, default: false }, // shown in the homepage Testimonials section
    // The reviewer's photo, uploaded through the admin panel. This is what fills the
    // avatar circle — it used to hold a product shot, which read as if the jewellery
    // were the person who left the review. Blank falls back to their initials.
    authorImage: { type: String, trim: true },
  },
  { timestamps: true }
);

reviewSchema.pre("validate", async function () {
  const plain = typeof this.toObject === "function" ? this.toObject() : this;
  const result = ReviewZodSchema.safeParse(plain);

  if (!result.success) {
    const errorDetails = result.error.issues.map((issue) => `${issue.path}: ${issue.message}`).join(", ");
    throw new Error(`Validation Error: ${errorDetails}`);
  }
});

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;
