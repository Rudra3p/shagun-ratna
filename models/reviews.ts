import mongoose, { Schema } from "mongoose";
import { z } from "zod";

export const ReviewZodSchema = z.object({
  name: z.string().min(2, "Name is required").trim(),
  product: z.string().min(2, "Product is required").trim(),
  text: z.string().min(5, "Review text is required").trim(),
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  approved: z.boolean().optional().default(false),
});

const reviewSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    product: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    approved: { type: Boolean, default: false },
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