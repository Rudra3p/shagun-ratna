import mongoose, { Schema, Document, Model } from 'mongoose';
import { z } from 'zod';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  refreshToken?: string;
  createdAt: Date;
}

// 1. Zod Schema with specific rules for jewelry buyers
export const UserZodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address"),
  // Regex to ensure phone number format (e.g., +1234567890)
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// 2. Mongoose Schema
const UserSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
}, { timestamps: true });

// 3. Gatekeeper Middleware
UserSchema.pre<IUser>('save', async function (this: IUser) {
  const result = UserZodSchema.safeParse(this.toObject());
  if (!result.success) {
    throw new Error(`User Validation Failed: ${result.error.issues[0]?.message}`);
  }
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;