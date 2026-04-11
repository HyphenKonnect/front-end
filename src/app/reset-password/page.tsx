import { Suspense } from "react";
import { ResetPasswordForm } from "../../components/auth/ResetPasswordForm";
import { buildNoIndexMetadata } from "../../lib/seo";

export const metadata = buildNoIndexMetadata(
  "Reset Password",
  "Set a new secure password for your The Hyphen Konnect account.",
  "/reset-password",
);

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
