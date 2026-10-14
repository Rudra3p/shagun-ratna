import mongoose, { Schema } from 'mongoose';

// Single shared document holding the shop's current metal rates. The daily
// GoldAPI cron updates these values and formula-priced products read them live.
const metalRateSchema = new Schema({
  // Marks the one-and-only rate document, so updates can upsert against it.
  singleton: { type: String, default: 'current', unique: true, immutable: true },
  goldRatePerGram: { type: Number, required: true, default: 0, min: 0 },
  silverRatePerGram: { type: Number, required: true, default: 0, min: 0 },
  platinumRatePerGram: { type: Number, required: true, default: 0, min: 0 },
  source: { type: String, trim: true, default: 'goldapi' },
  updatedBy: { type: String, trim: true },
}, { timestamps: true });

const MetalRate = mongoose.models.MetalRate || mongoose.model('MetalRate', metalRateSchema);
export default MetalRate;
