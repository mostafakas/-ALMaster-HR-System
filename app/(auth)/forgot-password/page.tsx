import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Forgot Password | AlMaster HR System",
  description: "Request a password reset link for your account",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
