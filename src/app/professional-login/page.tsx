import { Suspense } from "react";
import { AuthForm } from "../../components/auth/AuthForm";
import { buildNoIndexMetadata } from "../../lib/seo";

export const metadata = buildNoIndexMetadata(
  "Professional Login",
  "Secure professional login for The Hyphen Konnect practitioners and service partners.",
  "/professional-login",
);

export default function ProfessionalLoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="login" audience="professional" />
    </Suspense>
  );
}
