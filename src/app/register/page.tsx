import { Suspense } from "react";
import { AuthForm } from "../../components/auth/AuthForm";
import { buildNoIndexMetadata } from "../../lib/seo";

export const metadata = buildNoIndexMetadata(
  "Create Your Account",
  "Create a secure The Hyphen Konnect account to manage bookings, professionals, and support access.",
  "/register",
);

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="register" />
    </Suspense>
  );
}
