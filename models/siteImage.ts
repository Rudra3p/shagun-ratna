import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteImage extends Document {
  key: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteImageSchema: Schema<ISiteImage> = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const SiteImage: Model<ISiteImage> =
  mongoose.models.SiteImage || mongoose.model<ISiteImage>("SiteImage", SiteImageSchema);

export default SiteImage;
