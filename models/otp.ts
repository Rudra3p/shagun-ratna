import mongoose, { Schema, Document, Model } from 'mongoose';
import { z } from 'zod';

export interface IOtp extends Document {
  email: string;
  code: string;
  createdAt: Date;
}

// 1. Zod Schema
export const OtpZodSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "OTP must be 6 digits"),
});

// 2. Mongoose Schema
const otpSchema = new Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } 
});

// 3. Gatekeeper Middleware
(otpSchema as any).pre('validate', function (this: Document, next: (err?: Error) => void) {
  const obj = (this as any).toObject ? (this as any).toObject() : this;
  const result = OtpZodSchema.safeParse(obj);
  if (!result.success) {
    return next(new Error(`OTP Validation Failed: ${result.error?.issues?.[0]?.message || 'Unknown error'}`));
  }
  next();
});

const OTP: Model<IOtp> = mongoose.models.OTP || mongoose.model<IOtp>('OTP', otpSchema);

export default OTP;