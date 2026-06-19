import mongoose, { Schema, Document, Model } from 'mongoose';
import { z } from 'zod';


export interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;
  
  loginAttempts: number;         // Tracks wrong password attempts on Path 1
  lockUntil: Date | null;        // Standard MongoDB fallback lockout reference
  lastOtpSentAt?: Date | null;    // Timestamp of last OTP sent for cooldown logic

  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 1. Define the Zod Schema
export const AdminZodSchema = z.object({
  username: z.string().min(3).trim(),
  email: z.string().email(),
  password: z.string().min(8),
  loginAttempts: z.number().default(0),
  lockUntil: z.date().nullable().optional(),
  lastOtpSentAt: z.date().nullable().optional(), 
  refreshToken: z.string().nullable().optional(),          
});

// 2. Define the Mongoose Schema
const AdminSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Date, default: null },
  lastOtpSentAt: { type: Date, default: null },
  refreshToken: { type: String },
}, { timestamps: true });

// 3. The "Gatekeeper" Middleware
AdminSchema.pre('validate', async function () {
  // We use 'validate' hook so we check BEFORE mongoose internal validation
  const result = AdminZodSchema.safeParse(this.toObject());
  
  if (!result.success) {
    // This stops the save operation and returns a Mongoose validation error
    throw new Error(`Zod Validation Failed: ${result.error.message}`);
  }
});

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;