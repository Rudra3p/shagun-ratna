import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

// Define the Schema
export const ProductZodSchema = z.object({
  productName: z.string().min(1, "Name is required").trim(),
  price: z.number().positive("Price must be greater than 0"),
  imageUrl: z.string().url().nullable().optional().or(z.literal("")),
  category: z.string().default('General').optional(),
  discount: z.number().default(0).optional(),
  offerPrice: z.number().default(0).optional(),
  offertime: z.coerce.date().nullable().optional(),
});

const productSchema = new Schema({
  productName: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  category: { type: String, default: 'General' },
  discount: { type: Number, default: 0 },
  offerPrice: { type: Number, default: 0 },
  offertime: { type: Date, default: null },
  imageUrl: { type: String, default: null },
}, { timestamps: true });

// Gatekeeper: Asynchronous and uses throw for automatic error handling
productSchema.pre('validate', async function () {
  const plain = typeof this.toObject === 'function' ? this.toObject() : this;
  const result = ProductZodSchema.safeParse(plain);

  if (!result.success) {
    const errorDetails = result.error.issues.map(i => `${i.path}: ${i.message}`).join(', ');
    throw new Error(`Validation Error: ${errorDetails}`);
  }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;