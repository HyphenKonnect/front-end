"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, CreditCard, MessageSquare, Video } from "lucide-react";
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

type BookingRecord = {
  _id: string;
  scheduledAt: string;
  status: string;
  paymentStatus?: string;
  totalAmount?: number;
  professionalId?:
    | string
    | {
        name?: string;
        specialties?: string[];
      };
};

export function ClientDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadBookings = async () => {
      try {
        const response = await apiFetch("/api/bookings");
        const data = await parseJsonResponse<BookingRecord[]>(response);
        if (!ignore) setBookings(data);
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We could not load your bookings yet.",
          );
        }
      }
    };

    void loadBookings();

    return () => {
      ignore = true;
    };
  }, []);

  const upcomingCount = bookings.filter((item) =>
    ["pending", "confirmed", "active"].includes(item.status),
  ).length;

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <DashboardShell
        accent="Client Dashboard"
        title={`Hello${user?.name ? `, ${user.name}` : ""}`}
        description="Track appointments, payments, and next steps in one place while we replace the old WordPress and Amelia flow with a platform that is fully yours."
        actions={
          <>
            <Link
              href="/professionals"
              className="rounded-full border border-[#ead9e8] px-5 py-2.5 text-sm font-medium text-[#2b2b2b]"
            >
              Explore professionals
            </Link>
            <Link
              href="/booking"
              className="rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-5 py-2.5 text-sm font-medium text-white"
            >
              Book a session
            </Link>
          </>
        }
      >
        <div className="mb-6">
          <StatList
            items={[
              {
                label: "Upcoming sessions",
                value: String(upcomingCount),
                note: "Pending, confirmed, and active appointments",
              },
              {
                label: "Total bookings",
                value: String(bookings.length),
                note: "All sessions tied to your account",
              },
              {
                label: "Profile status",
                value: user?.onboardingComplete ? "Ready" : "Setup",
                note: "We can add profile completion later in Phase 2",
              },
              {
                label: "Payments",
                value: bookings.some((item) => item.paymentStatus === "completed")
                  ? "Active"
                  : "Pending",
                note: "Razorpay and Stripe come next",
              },
            ]}
          />
        </div>

        <DashboardGrid>
          <DashboardCard
            title="Your appointments"
            className="lg:col-span-8"
            eyebrow="Bookings"
          >
            {bookings.length ? (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => {
                  const professionalName =
                    typeof booking.professionalId === "object"
                      ? booking.professionalId?.name || "Assigned professional"
                      : "Assigned professional";

                  return (
                    <div
                      key={booking._id}
                      className="flex flex-col gap-4 rounded-[22px] bg-[#f7f5f4] p-5 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div>
                        <p className="text-lg font-semibold text-[#2b2b2b]">
                          {professionalName}
                        </p>
                        <p className="mt-1 text-sm text-[#7e7e7e]">
                          {new Date(booking.scheduledAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize text-[#f56969]">
                          {booking.status}
                        </span>
                        <span className="text-sm font-medium text-[#2b2b2b]">
                          {booking.totalAmount
                            ? `Rs. ${booking.totalAmount / 100}`
                            : "Payment pending"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No bookings yet"
                description={
                  error ||
                  "As soon as you book your first session, it will appear here with payment and meeting details."
                }
                href="/professionals"
                label="Browse experts"
              />
            )}
          </DashboardCard>

          <DashboardCard
            title="What comes next"
            className="lg:col-span-4"
            eyebrow="Roadmap"
          >
            <div className="space-y-4">
              {[
                {
                  icon: CalendarDays,
                  title: "Booking flow",
                  text: "Real slot selection and rescheduling are the next layer after auth.",
                },
                {
                  icon: Video,
                  title: "Video room",
                  text: "Daily.co is the cleanest v1 option for client-professional calls.",
                },
                {
                  icon: MessageSquare,
                  title: "Messaging",
                  text: "Socket.io chat can sit on top once sessions and roles are stable.",
                },
                {
                  icon: CreditCard,
                  title: "Invoices",
                  text: "Payment history will connect after Razorpay and Stripe screens land.",
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
