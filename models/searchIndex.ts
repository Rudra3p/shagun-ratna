    import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

// 1. ZOD VALIDATION SCHEMA (For Runtime Type Safety)
export const SearchIndexZodSchema = z.object({
  keyword: z.string().min(1, "Keyword is required").trim().toLowerCase(),
  category: z.string().default('General').optional(),
  productRefId: z.string().min(1, "Product reference ID is required"),
});

// 2. MONGOOSE SCHEMA DEFINITION
const searchIndexSchema = new Schema({
  // Normalized searchable text (e.g., "royal sapphire halo")
  keyword: { 
    type: String, 
    required: true, 
    trim: true, 
    lowercase: true, 
    index: true 
  },
  // Category for filtering verification
  category: { 
    type: String, 
    default: 'General', 
    trim: true 
  },
  // Direct relational pointer to your main heavy Product document
  productRefId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  }
}, { 
  timestamps: true 
});

// 3. GATEKEEPER: Run Zod safe-checking before running database writes
searchIndexSchema.pre('validate', async function () {
  const plain = typeof this.toObject === 'function' ? this.toObject() : this;
  
  // Convert ObjectId to string for Zod compatibility check
  if (plain.productRefId) {
    // cast via unknown to avoid TypeScript ObjectId vs string incompatibility
    (plain as unknown as { productRefId: string }).productRefId = (plain as any).productRefId.toString();
  }

  const result = SearchIndexZodSchema.safeParse(plain);

  if (!result.success) {
    const errorDetails = result.error.issues.map(i => `${i.path}: ${i.message}`).join(', ');
    throw new Error(`Search Index Validation Error: ${errorDetails}`);
  }
});

const SearchIndex = mongoose.models.SearchIndex || mongoose.model('SearchIndex', searchIndexSchema);
export default SearchIndex;