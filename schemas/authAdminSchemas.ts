import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const OtpVerifySchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  token: z.string().length(6, "OTP must be exactly 6 characters").toUpperCase().trim(),
});

export const UpdateNameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
});

export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});


// Export types so you can use them in your functions
export type LoginInput = z.infer<typeof LoginSchema>;
export type OtpInput = z.infer<typeof OtpVerifySchema>;
export type UpdateNameInput = z.infer<typeof UpdateNameSchema>;
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;