import { Suspense } from "react";
import { AuthForm } from "../../components/auth/AuthForm";
import { buildNoIndexMetadata } from "../../lib/seo";

export const metadata = buildNoIndexMetadata(
  "Client Login",
  "Secure client login for The Hyphen Konnect account access, bookings, and dashboard tools.",
  "/login",
);

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
