import mongoose, { Schema, Document, Model } from 'mongoose';
import { z } from 'zod';

export interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;
  mobile: number; // Added as Number type
  loginAttempts: number;
  lockUntil: Date | null;
  lastOtpSentAt?: Date | null;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const AdminZodSchema = z.object({
  username: z.string().min(3).trim(),
  email: z.string().email(),
  password: z.string().min(8),
  mobile: z.number(), // Match type here
  loginAttempts: z.number().default(0),
  lockUntil: z.date().nullable().optional(),
  lastOtpSentAt: z.date().nullable().optional(), 
  refreshToken: z.string().nullable().optional(),          
});

const AdminSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  mobile: { type: Number, required: true }, // Added as Number type
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Date, default: null },
  lastOtpSentAt: { type: Date, default: null },
  refreshToken: { type: String },
}, { timestamps: true });

AdminSchema.pre('validate', async function () {
  const result = AdminZodSchema.safeParse(this.toObject());
  if (!result.success) {
    throw new Error(`Zod Validation Failed: ${result.error.message}`);
  }
});

const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;