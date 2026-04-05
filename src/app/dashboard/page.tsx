"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/auth/AuthProvider";
import { roleToDashboard } from "../../components/auth/ProtectedRoute";

export default function DashboardIndexPage() {
  const { isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    router.replace(user ? roleToDashboard(user.role) : "/login?next=/dashboard");
  }, [isLoading, router, user]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6">
      <div className="rounded-full bg-[#f7f5f4] px-6 py-3 text-sm text-[#7e7e7e]">
        Routing you to the right dashboard...
      </div>
    </div>
  );
}
