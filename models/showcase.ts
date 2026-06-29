import mongoose, { Schema, Document } from "mongoose";

export interface IShowcase extends Document {
  productRefId: mongoose.Types.ObjectId;
  isPopularHomepage: boolean; // True if it's one of the 6 featured home cards
  targetGender: "Male" | "Female" | "Unisex" | "All";
  targetAgeGroup: "Kids" | "Teens" | "Young Adult" | "Adult" | "Senior" | "All";
  createdAt: Date;
  updatedAt: Date;
}

const ShowcaseSchema: Schema = new Schema(
  {
    productRefId: { 
      type: Schema.Types.ObjectId, 
      ref: "Product", 
      required: true,
      unique: true // One product can only have one configuration entry here
    },
    isPopularHomepage: { 
      type: Boolean, 
      default: false 
    },
    targetGender: { 
      type: String, 
      enum: ["Male", "Female", "Unisex", "All"], 
      default: "All" 
    },
    targetAgeGroup: { 
      type: String, 
      enum: ["Kids", "Teens", "Young Adult", "Adult", "Senior", "All"], 
      default: "All" 
    }
  },
  { timestamps: true }
);

// Indexing for blazing-fast CDN queries later
ShowcaseSchema.index({ isPopularHomepage: 1 });
ShowcaseSchema.index({ targetGender: 1, targetAgeGroup: 1 });

export default mongoose.models.Showcase || mongoose.model<IShowcase>("Showcase", ShowcaseSchema);