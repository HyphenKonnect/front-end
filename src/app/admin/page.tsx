import { Suspense } from "react";
import { AuthForm } from "../../components/auth/AuthForm";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="login" audience="admin" />
    </Suspense>
  );
}
