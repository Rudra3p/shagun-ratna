import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const OtpVerifySchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  token: z.string().length(6, "OTP must be exactly 6 characters").toUpperCase().trim(),
});

// New Unified Profile Update Schema
export const UpdateProfileSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  mobile: z.number({
    message: "Mobile number is required",
  }),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal('')),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type OtpInput = z.infer<typeof OtpVerifySchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;