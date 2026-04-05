"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, CalendarClock, IndianRupee, UserRound } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { apiFetch, parseJsonResponse } from "../../lib/api";
import {
  DashboardCard,
  DashboardGrid,
  DashboardShell,
  EmptyState,
  StatList,
} from "./dashboard-primitives";

type ProfessionalBooking = {
  _id: string;
  scheduledAt: string;
  status: string;
  clientId?:
    | string
    | {
        name?: string;
        email?: string;
      };
  professionalFee?: number;
};

export function ProfessionalDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<ProfessionalBooking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const response = await apiFetch("/api/bookings");
        const data = await parseJsonResponse<ProfessionalBooking[]>(response);
        if (!ignore) setBookings(data);
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We could not load your sessions yet.",
          );
        }
      }
    };

    void loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const upcoming = bookings.filter((item) =>
    ["pending", "confirmed", "active"].includes(item.status),
  );

  const projectedEarnings = bookings.reduce(
    (sum, booking) => sum + (booking.professionalFee || 0),
    0,
  );

  return (
    <ProtectedRoute allowedRoles={["professional"]}>
      <DashboardShell
        accent="Professional Dashboard"
        title={user?.name || "Professional workspace"}
        description="This is the foundation for profile setup, booking management, payout visibility, and later your calendar, video room, and secure messaging."
        actions={
          <>
            <Link
              href="/contact"
              className="rounded-full border border-[#ead9e8] px-5 py-2.5 text-sm font-medium text-[#2b2b2b]"
            >
              Support team
            </Link>
            <Link
              href="/professionals"
              className="rounded-full bg-[#2b2b2b] px-5 py-2.5 text-sm font-medium text-white"
            >
              Public directory
            </Link>
          </>
        }
      >
        <div className="mb-6">
          <StatList
            items={[
              {
                label: "Upcoming sessions",
                value: String(upcoming.length),
                note: "Pending and confirmed bookings",
              },
              {
                label: "Projected earnings",
                value: `Rs. ${projectedEarnings / 100}`,
                note: "Based on current booking records",
              },
              {
                label: "Verification",
                value: user?.profile?.verified ? "Approved" : "Review",
                note: "Admin approval flow is already accounted for in backend roles",
              },
              {
                label: "Specialization",
                value: user?.profile?.specialisation || "Pending",
                note: "Profile editor can be added in the next pass",
              },
            ]}
          />
        </div>

        <DashboardGrid>
          <DashboardCard
            title="Upcoming clients"
            className="lg:col-span-7"
            eyebrow="Schedule"
          >
            {upcoming.length ? (
              <div className="space-y-4">
                {upcoming.slice(0, 6).map((booking) => {
                  const clientName =
                    typeof booking.clientId === "object"
                      ? booking.clientId?.name || "Client"
                      : "Client";

                  return (
                    <div
                      key={booking._id}
                      className="rounded-[22px] bg-[#f7f5f4] p-5"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-[#2b2b2b]">
                            {clientName}
                          </p>
                          <p className="mt-1 text-sm text-[#7e7e7e]">
                            {new Date(booking.scheduledAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize text-[#f56969]">
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No professional sessions yet"
                description={
                  error ||
                  "Once clients begin booking through the new platform, your upcoming sessions will appear here."
                }
              />
            )}
          </DashboardCard>

          <DashboardCard
            title="Practice setup"
            className="lg:col-span-5"
            eyebrow="Readiness"
          >
            <div className="space-y-4">
              {[
                {
                  icon: BadgeCheck,
                  title: "Credential verification",
                  text: user?.profile?.verified
                    ? "Your profile is marked as verified."
                    : "Admin review is still needed before public approval is complete.",
                },
                {
                  icon: CalendarClock,
                  title: "Availability",
                  text: "We can add editable working hours and blocked dates next.",
                },
                {
                  icon: IndianRupee,
                  title: "Pricing and payouts",
                  text: "Razorpay and commission split can plug into this panel in Phase 3.",
                },
                {
                  icon: UserRound,
                  title: "Public profile",
                  text: "Bio, specialization, and qualifications can be surfaced here once profile editing is added.",
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
