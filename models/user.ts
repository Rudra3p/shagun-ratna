import mongoose from 'mongoose';
import { z } from 'zod';

// 1. Zod Schema with rules for gender and age
export const UserZodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  age: z.coerce.number().int().min(1, "Age is required").max(120, "Please enter a valid age"),
  gender: z.enum(["Male", "Female", "Other"]),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// 2. Mongoose Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] }, // 🧠 Added dynamic gender mapping field
  password: { type: String, required: true },
  loginAttempts: { type: Number, default: 0 }, // 🧠 Added tracking for brute-force safety block metrics
  refreshToken: { type: String },
}, { timestamps: true });

// 3. Gatekeeper Pre-Save Middleware Hook
UserSchema.pre('save', async function () {
  // Convert mongoose doc to standard object for Zod validation check
  const obj = this.toObject();

  // Validate full schema structure rules using Zod. Throwing an error inside
  // an async pre hook will abort the save operation in Mongoose.
  const result = UserZodSchema.safeParse(obj);
  if (!result.success) {
    throw new Error(`User Validation Failed: ${result.error.issues[0]?.message}`);
  }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;