import * as z from "zod";
import { emailField, matchingFields } from "./base";

// Used at registration/reset time — enforces the stronger minimum that the
// server also requires (see app/api/auth/register/route.ts).
const newPasswordField = z
  .string()
  .min(8, "Password must be at least 8 characters");

// Used at LOGIN time only — deliberately just "non-empty", not a minimum
// length. Existing accounts may have been created before this length rule
// existed; login must not reject a correct, already-set password just
// because it's shorter than today's minimum. The server is the source of
// truth for whether the password is actually correct.
const existingPasswordField = z.string().min(1, "Password is required");

export const loginSchema = z.object({
  email: emailField,
  password: existingPasswordField,
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = matchingFields(
  z.object({
    password: newPasswordField,
    confirmPassword: newPasswordField,
  }),
  "password",
  "confirmPassword",
  "Passwords don't match"
);

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: emailField,
  password: newPasswordField,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
