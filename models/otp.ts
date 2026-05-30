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
// 3. Gatekeeper Middleware (Modern Async Pattern)
otpSchema.pre('validate', async function () {
  // Use .toObject() but filter to only what you expect
  const data = {
    email: this.email,
    code: this.code
  };

  const result = OtpZodSchema.safeParse(data);
  
  if (!result.success) {
    // Simply throw; Mongoose handles the rejection
    throw new Error(`OTP Validation Failed: ${result.error.issues[0].message}`);
  }
  // No need to call next()!
});

const OTP: Model<IOtp> = mongoose.models.OTP || mongoose.model<IOtp>('OTP', otpSchema);

export default OTP;