import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteContent extends Document {
  key: string;
  value: string;
  page?: string;
  section?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteContentSchema: Schema<ISiteContent> = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: String, required: true },
    page: { type: String, trim: true },
    section: { type: String, trim: true },
  },
  { timestamps: true }
);

const SiteContent: Model<ISiteContent> =
  mongoose.models.SiteContent || mongoose.model<ISiteContent>("SiteContent", SiteContentSchema);

export default SiteContent;

