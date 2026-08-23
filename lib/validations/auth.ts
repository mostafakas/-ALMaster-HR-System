import * as z from "zod";
import { emailField, matchingFields } from "./base";

const passwordField = z
  .string()
  .min(6, "Password must be at least 6 characters");

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = matchingFields(
  z.object({
    password: passwordField,
    confirmPassword: passwordField,
  }),
  "password",
  "confirmPassword",
  "Passwords don't match"
);

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: emailField,
  password: passwordField,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
