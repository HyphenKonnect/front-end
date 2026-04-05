"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BellRing, ChartColumnIncreasing, Shield, Users } from "lucide-react";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { apiFetch, parseJsonResponse } from "../../lib/api";
import {
  DashboardCard,
  DashboardGrid,
  DashboardShell,
  EmptyState,
  StatList,
} from "./dashboard-primitives";

type AdminSummary = {
  users: {
    total: number;
    professionals: number;
    clients: number;
  };
  bookings: {
    total: number;
    completed: number;
    completionRate: string;
  };
  revenue: {
    platformCommission: number;
    gstCollected: number;
    totalProcessed: number;
  };
};

type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "client" | "professional" | "admin";
  isActive?: boolean;
  profile?: {
    verified?: boolean;
  };
};

export function AdminDashboard() {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const [summaryResponse, usersResponse] = await Promise.all([
          apiFetch("/api/admin/summary"),
          apiFetch("/api/admin/users"),
        ]);

        const [summaryData, usersData] = await Promise.all([
          parseJsonResponse<AdminSummary>(summaryResponse),
          parseJsonResponse<AdminUser[]>(usersResponse),
        ]);

        if (!ignore) {
          setSummary(summaryData);
          setUsers(usersData);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We could not load admin analytics yet.",
          );
        }
      }
    };

    void loadData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardShell
        accent="Admin Dashboard"
        title="Platform control center"
        description="This is the operational layer for approvals, user oversight, booking visibility, and revenue reporting as we move off the old WordPress-based setup."
        actions={
          <>
            <Link
              href="/contact"
              className="rounded-full border border-[#ead9e8] px-5 py-2.5 text-sm font-medium text-[#2b2b2b]"
            >
              Contact operations
            </Link>
            <Link
              href="/resources"
              className="rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-5 py-2.5 text-sm font-medium text-white"
            >
              Platform resources
            </Link>
          </>
        }
      >
        {summary ? (
          <div className="mb-6">
            <StatList
              items={[
                {
                  label: "Total users",
                  value: String(summary.users.total),
                  note: `${summary.users.clients} clients and ${summary.users.professionals} professionals`,
                },
                {
                  label: "Bookings",
                  value: String(summary.bookings.total),
                  note: `${summary.bookings.completed} completed sessions`,
                },
                {
                  label: "Completion rate",
                  value: summary.bookings.completionRate,
                  note: "Based on bookings in the backend",
                },
                {
                  label: "Platform revenue",
                  value: `Rs. ${summary.revenue.platformCommission / 100}`,
                  note: `GST collected Rs. ${summary.revenue.gstCollected / 100}`,
                },
              ]}
            />
          </div>
        ) : null}

        <DashboardGrid>
          <DashboardCard
            title="Recent users"
            className="lg:col-span-8"
            eyebrow="Directory"
          >
            {users.length ? (
              <div className="space-y-4">
                {users.slice(0, 8).map((user) => (
                  <div
                    key={user._id}
                    className="flex flex-col gap-3 rounded-[22px] bg-[#f7f5f4] p-5 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div>
                      <p className="text-lg font-semibold text-[#2b2b2b]">
                        {user.name}
                      </p>
                      <p className="mt-1 text-sm text-[#7e7e7e]">{user.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize text-[#f56969]">
                        {user.role}
                      </span>
                      <span className="text-sm text-[#7e7e7e]">
                        {user.isActive === false ? "Suspended" : "Active"}
                      </span>
                      {user.role === "professional" ? (
                        <span className="text-sm text-[#7e7e7e]">
                          {user.profile?.verified ? "Verified" : "Reviewing"}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No admin data yet"
                description={
                  error ||
                  "Once the admin endpoints are reachable with an admin token, user analytics and approvals will appear here."
                }
              />
            )}
          </DashboardCard>

          <DashboardCard
            title="Admin action lanes"
            className="lg:col-span-4"
            eyebrow="Operations"
          >
            <div className="space-y-4">
              {[
                {
                  icon: Users,
                  title: "Professional approvals",
                  text: "Approve or reject onboarding and keep credential quality high.",
                },
                {
                  icon: Shield,
                  title: "Compliance and trust",
                  text: "Suspend accounts, review access, and prepare audit-friendly workflows.",
                },
                {
                  icon: ChartColumnIncreasing,
                  title: "Analytics",
                  text: "Surface revenue, sessions, growth, and completion trends.",
                },
                {
                  icon: BellRing,
                  title: "Notifications",
                  text: "Broadcast platform updates once email and in-app notices are wired.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[22px] bg-[#f7f5f4] p-5">
                  <item.icon className="h-5 w-5 text-[#f56969]" />
                  <p className="mt-3 font-semibold text-[#2b2b2b]">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#7e7e7e]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </DashboardCard>
        </DashboardGrid>
      </DashboardShell>
    </ProtectedRoute>
  );
}
