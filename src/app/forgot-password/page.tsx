import { ForgotPasswordForm } from "../../components/auth/ForgotPasswordForm";
import { buildNoIndexMetadata } from "../../lib/seo";

export const metadata = buildNoIndexMetadata(
  "Forgot Password",
  "Reset access to your The Hyphen Konnect account through the secure password recovery flow.",
  "/forgot-password",
);

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
