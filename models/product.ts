import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

// Define the Schema
export const ProductZodSchema = z.object({
  productName: z.string().min(1, "Name is required").trim(),
  price: z.number().positive("Price must be greater than 0"),
  imageUrl: z.string().url("A valid product image is required"),
  category: z.array(z.string().trim().min(1)).min(1, "At least one category is required"),
  purity: z.string().trim().optional(),
  description: z.string().min(1, "Details are required").trim(),
  discount: z.number().default(0).optional(),
  offerPrice: z.number().default(0).optional(),
  offertime: z.coerce.date().nullable().optional(),
  // Formula pricing (see lib/pricing.js)
  pricingMode: z.enum(['manual', 'formula']).default('manual').optional(),
  metal: z.enum(['Gold', 'Silver', '']).optional(),
  metalWeight: z.number().min(0).default(0).optional(),
  labourCost: z.number().min(0).default(0).optional(),
});

const productSchema = new Schema({
  productName: { type: String, required: true, trim: true },
  // For formula-priced pieces this holds the value computed at save time; reads
  // recompute it from the current metal rates so it never goes stale.
  price: { type: Number, required: true },
  category: { type: [String], required: true, validate: [(v: string[]) => v.length > 0, "At least one category is required"] },
  purity: { type: String, trim: true }, // left unset shows no purity label, rather than falsely claiming a default
  description: { type: String, required: true, trim: true },
  discount: { type: Number, default: 0 },
  offerPrice: { type: Number, default: 0 },
  offertime: { type: Date, default: null },
  imageUrl: { type: String, required: true },
  featured: { type: Boolean, default: false }, // shown in the homepage Product Grid section

  // --- Pricing mode ---------------------------------------------------------
  // 'manual'  — admin types the price directly (full control, one-off pieces)
  // 'formula' — price derives from metal weight × current rate + labour, so
  //             updating the gold/silver rate reprices every piece at once.
  pricingMode: { type: String, enum: ['manual', 'formula'], default: 'manual' },
  metal: { type: String, enum: ['Gold', 'Silver', ''], default: '' },
  metalWeight: { type: Number, default: 0, min: 0 }, // grams
  labourCost: { type: Number, default: 0, min: 0 },  // making charges etc, flat ₹
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