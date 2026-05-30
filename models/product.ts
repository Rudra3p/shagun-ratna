import mongoose, { Schema, Document, Model } from 'mongoose';
import { z } from 'zod';

export interface IProduct extends Document {
  productName: string;
  price: number;
  imageUrl?: string | null;
  createdAt: Date;
}

// 1. Zod Schema
export const ProductZodSchema = z.object({
  productName: z.string().min(1, "Name is required").trim(),
  price: z.number().positive("Price must be greater than 0"),
  imageUrl: z.string().url().nullable().optional(),
});

// 2. Mongoose Schema
const productSchema = new Schema({
  productName: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, default: null },
}, { timestamps: true }); // Use timestamps for createdAt/updatedAt

// 3. Gatekeeper Middleware
(productSchema as any).pre('validate', function (this: any, next: (err?: Error) => void) {
  const result = ProductZodSchema.safeParse(this.toObject());
  if (!result.success) {
    return next(new Error(`Product Validation Failed: ${result.error.message}`));
  }
  next();
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;