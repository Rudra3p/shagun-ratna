import mongoose, { Schema } from "mongoose";
import { z } from "zod";

export const InquiryZodSchema = z.object({
  name: z.string().min(2, "Name is required").trim(),
  phone: z.string().min(5, "Phone is required").trim(),
  productName: z.string().min(2, "Product name is required").trim(),
  customizationNotes: z.string().trim().optional().default(""),
});

const inquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    customizationNotes: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

inquirySchema.pre("validate", async function () {
  const plain = typeof this.toObject === "function" ? this.toObject() : this;
  const result = InquiryZodSchema.safeParse(plain);

  if (!result.success) {
    const errorDetails = result.error.issues.map((issue) => `${issue.path}: ${issue.message}`).join(", ");
    throw new Error(`Validation Error: ${errorDetails}`);
  }
});

const Inquiry = mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
