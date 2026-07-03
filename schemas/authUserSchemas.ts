import { z } from "zod";

export const UserRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").trim(),
  birthdate: z.string().min(1, "Birthdate is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const UserLoginSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});