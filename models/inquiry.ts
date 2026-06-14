import mongoose, { Schema, Document, models } from "mongoose";

// Define the interface for TypeScript
export interface IInquiry extends Document {
  customerName: string;
  customerPhone: string;
  productName: string; // The item they liked or inquired about
  customizationNotes?: string; // Optional: for specific requests
  status: "NEW" | "CONTACTED" | "VISIT_PLANNED" | "CLOSED";
  createdAt: Date;
}

const inquirySchema = new Schema<IInquiry>(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    customizationNotes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "VISIT_PLANNED", "CLOSED"],
      default: "NEW",
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Prevent re-compiling the model if it already exists (common in Next.js)
const Inquiry = models.Inquiry || mongoose.model<IInquiry>("Inquiry", inquirySchema);

export default Inquiry;