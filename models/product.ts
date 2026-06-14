import mongoose, { Schema, Model } from 'mongoose';
import { z } from 'zod';

// 1. Zod Schema with Coercion
export const ProductZodSchema = z.object({
  productName: z.string().min(1, "Name is required").trim(),
  price: z.number().positive("Price must be greater than 0"),
  imageUrl: z.string().url().nullable().optional().or(z.literal("")),
  category: z.string().default('General').optional(),
  discount: z.number().default(0).optional(),
  offerPrice: z.number().default(0).optional(),
  // Coerce handles string-to-date conversion automatically
  offertime: z.coerce.date().nullable().optional(),
});

// 2. Mongoose Schema
const productSchema = new Schema({
  productName: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  category: { type: String, default: 'General' },
  discount: { type: Number, default: 0 },
  offerPrice: { type: Number, default: 0 },
  offertime: { type: Date, default: null },
  imageUrl: { type: String, default: null },
}, { timestamps: true });

// 3. Gatekeeper Middleware
((productSchema as any).pre)('validate', function (this: any, next: (err?: Error) => void) {
  // Convert doc to plain object if possible to avoid Mongoose internals
  const plain = typeof this.toObject === 'function' ? this.toObject() : this;

  const result = ProductZodSchema.safeParse(plain);

  if (!result.success) {
    return next(new Error(`Validation Failed: ${JSON.stringify(result.error.issues)}`));
  }
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;