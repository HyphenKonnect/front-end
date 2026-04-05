"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SessionUser } from "../../lib/api";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: SessionUser["role"][];
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace(roleToDashboard(user.role));
    }
  }, [allowedRoles, isAuthenticated, isLoading, pathname, router, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6">
        <div className="rounded-full bg-[#f7f5f4] px-6 py-3 text-sm text-[#7e7e7e]">
          Loading your workspace...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}

export function roleToDashboard(role: SessionUser["role"]) {
  if (role === "professional") return "/dashboard/professional";
  if (role === "admin") return "/dashboard/admin";
  return "/dashboard/client";
}
