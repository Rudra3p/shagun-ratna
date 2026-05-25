import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  code: string;
  createdAt: Date;
}

const OTPSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    uppercase: true, // Automatically normalizes codes to uppercase (e.g., 'r45ds9' -> 'R45DS9')
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // 🔥 BEYOND SMART: MongoDB automatically deletes this record after exactly 5 minutes (300 seconds)
  }
});

// Create an index for fast lookups by email and code combined
OTPSchema.index({ email: 1, code: 1 });

const OTP: Model<IOTP> = mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);

export default OTP;