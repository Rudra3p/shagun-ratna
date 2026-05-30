import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const OtpVerifySchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  token: z.string().length(6, "OTP must be exactly 6 characters").toUpperCase().trim(),
});

// Export types so you can use them in your functions
export type LoginInput = z.infer<typeof LoginSchema>;
export type OtpInput = z.infer<typeof OtpVerifySchema>;