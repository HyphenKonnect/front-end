import { Suspense } from "react";
import { AuthForm } from "../../components/auth/AuthForm";
import { buildNoIndexMetadata } from "../../lib/seo";

export const metadata = buildNoIndexMetadata(
  "Admin Login",
  "Secure admin login for The Hyphen Konnect platform operations.",
  "/admin",
);

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="login" audience="admin" />
    </Suspense>
  );
}
