import mongoose, { Schema } from 'mongoose';

// Single shared document holding the shop's current metal rates. The admin sets
// these by hand (no external price feed) and every formula-priced product picks
// them up automatically the next time it's read.
const metalRateSchema = new Schema({
  // Marks the one-and-only rate document, so updates can upsert against it.
  singleton: { type: String, default: 'current', unique: true, immutable: true },
  goldRatePerGram: { type: Number, required: true, default: 0, min: 0 },
  silverRatePerGram: { type: Number, required: true, default: 0, min: 0 },
  updatedBy: { type: String, trim: true },
}, { timestamps: true });

const MetalRate = mongoose.models.MetalRate || mongoose.model('MetalRate', metalRateSchema);
export default MetalRate;
