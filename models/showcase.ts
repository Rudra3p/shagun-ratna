import mongoose, { Schema, Document, Model } from "mongoose";

export interface IShowcase extends Document {
  title: string;
  gender: string;
  minAge: number;
  maxAge: number;
  homepageZone: string; // 👈 "None" | "Card 1" | "Card 2" | ... | "Card 6"
  description?: string;
  productIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ShowcaseSchema: Schema<IShowcase> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    gender: { type: String, required: true, default: "All" },
    minAge: { type: Number, required: true, default: 18 },
    maxAge: { type: Number, required: true, default: 60 },
    homepageZone: { type: String, required: true, default: "None" }, // 👈 Tracking anchor spot
    description: { type: String, trim: true },
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product", default: [] }]
  },
  { timestamps: true }
);

const Showcase: Model<IShowcase> =
  mongoose.models.Showcase || mongoose.model<IShowcase>("Showcase", ShowcaseSchema);

export default Showcase;