import { Suspense } from "react";
import VerifyEmailContent from "../../components/auth/VerifyEmailContent";
import { buildNoIndexMetadata } from "../../lib/seo";

export const metadata = buildNoIndexMetadata(
  "Verify Email",
  "Complete email verification for your The Hyphen Konnect account.",
  "/verify-email",
);

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
