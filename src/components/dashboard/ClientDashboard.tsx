"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, CreditCard, MessageSquare, Video } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { apiFetch, parseJsonResponse } from "../../lib/api";
import {
  getBookingStatusTone,
  getBookingTimeline,
  getServiceLabel,
} from "../../lib/booking-helpers";
import { formatDateTime, formatInr } from "../../lib/formatting";
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
  serviceId?: string;
  timestamps?: {
    createdAt?: string;
    confirmedAt?: string;
    cancelledAt?: string;
    completedAt?: string;
    rescheduledAt?: string;
  };
  professionalId?:
    | string
    | {
        name?: string;
        specialties?: string[];
        profile?: {
          specialisation?: string;
        };
      };
};

export function ClientDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionBookingId, setActionBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadBookings = async () => {
      try {
        if (!ignore) setLoading(true);
        const response = await apiFetch("/api/bookings");
        const data = await parseJsonResponse<BookingRecord[]>(response);
        if (!ignore) {
          setBookings(data);
          setSelectedBookingId((current) => current || data[0]?._id || null);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We could not load your bookings yet.",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void loadBookings();

    return () => {
      ignore = true;
    };
  }, []);

  const refreshBookings = async () => {
    const response = await apiFetch("/api/bookings");
    const data = await parseJsonResponse<BookingRecord[]>(response);
    setBookings(data);
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setActionBookingId(bookingId);
      setError(null);
      const response = await apiFetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        body: JSON.stringify({
          reason: "Cancelled by client from dashboard",
        }),
      });
      await parseJsonResponse(response);
      await refreshBookings();
    } catch (cancelError) {
      setError(
        cancelError instanceof Error
          ? cancelError.message
          : "We could not cancel the booking right now.",
      );
    } finally {
      setActionBookingId(null);
    }
  };

  const upcomingCount = bookings.filter((item) =>
    ["pending", "confirmed", "active"].includes(item.status),
  ).length;
  const capturedPayments = bookings.filter((item) => item.paymentStatus === "captured").length;
  const selectedBooking =
    bookings.find((booking) => booking._id === selectedBookingId) || bookings[0] || null;

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
                value: capturedPayments ? `${capturedPayments} captured` : "Pending",
                note: "Captured sessions and pending payment follow-up",
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
                  const specialization =
                    typeof booking.professionalId === "object"
                      ? booking.professionalId?.profile?.specialisation ||
                        booking.professionalId?.specialties?.[0]
                      : null;
                  const canCancel =
                    ["pending", "confirmed"].includes(booking.status) &&
                    new Date(booking.scheduledAt).getTime() > Date.now();

                  return (
                    <div
                      key={booking._id}
                      onClick={() => setSelectedBookingId(booking._id)}
                      className="flex flex-col gap-4 rounded-[22px] bg-[#f7f5f4] p-5 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div>
                        <p className="text-lg font-semibold text-[#2b2b2b]">
                          {professionalName}
                        </p>
                        {specialization ? (
                          <p className="mt-1 text-sm text-[#f56969]">{specialization}</p>
                        ) : null}
                        <p className="mt-1 text-sm text-[#7e7e7e]">
                          {formatDateTime(booking.scheduledAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize text-[#f56969]">
                          {booking.status}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize text-[#2b2b2b]">
                          {booking.paymentStatus || "payment pending"}
                        </span>
                        <span className="text-sm font-medium text-[#2b2b2b]">
                          {booking.totalAmount ? formatInr(booking.totalAmount) : "Payment pending"}
                        </span>
                        {canCancel ? (
                          <button
                            type="button"
                            onClick={() => void handleCancelBooking(booking._id)}
                            disabled={actionBookingId === booking._id}
                            className="rounded-full border border-[#f4c7c4] px-3 py-1 text-xs font-medium text-[#f56969] disabled:opacity-50"
                          >
                            {actionBookingId === booking._id ? "Cancelling..." : "Cancel"}
                          </button>
                        ) : null}
                        {canCancel ? (
                          <Link
                            href={`/booking?service=${booking.serviceId || ""}&bookingId=${booking._id}`}
                            className="rounded-full border border-[#ead9e8] px-3 py-1 text-xs font-medium text-[#2b2b2b]"
                          >
                            Reschedule
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title={loading ? "Loading your bookings" : "No bookings yet"}
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
            title={selectedBooking ? "Booking details" : "What comes next"}
            className="lg:col-span-4"
            eyebrow={selectedBooking ? "Selected session" : "Roadmap"}
          >
            {selectedBooking ? (
              <div className="space-y-4">
                <div className="rounded-[22px] bg-[#f7f5f4] p-5">
                  <p className="text-sm text-[#7e7e7e]">Service</p>
                  <p className="mt-2 text-lg font-semibold text-[#2b2b2b]">
                    {getServiceLabel(selectedBooking.serviceId)}
                  </p>
                  <p className="mt-3 text-sm text-[#7e7e7e]">
                    {formatDateTime(selectedBooking.scheduledAt)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getBookingStatusTone(
                        selectedBooking.status,
                      )}`}
                    >
                      {selectedBooking.status}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#2b2b2b]">
                      {selectedBooking.paymentStatus || "payment pending"}
                    </span>
                  </div>
                </div>
                <div className="rounded-[22px] bg-[#f7f5f4] p-5">
                  <p className="text-sm font-semibold text-[#2b2b2b]">Timeline</p>
                  <div className="mt-4 space-y-3">
                    {getBookingTimeline(
                      selectedBooking.status,
                      selectedBooking.scheduledAt,
                      selectedBooking.timestamps,
                    ).map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <span
                          className={`mt-1 h-2.5 w-2.5 rounded-full ${
                            item.active ? "bg-[#f56969]" : "bg-[#d8d3d0]"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium text-[#2b2b2b]">{item.label}</p>
                          <p className="text-sm text-[#7e7e7e]">
                            {item.value ? formatDateTime(item.value) : "Not reached yet"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  {
                    icon: CalendarDays,
                    title: "Booking flow",
                    text: "Bookings now save live. Next we can add rescheduling and richer session states.",
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
                    text: "Payment history is beginning to surface here and can expand after Razorpay screens land.",
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
            )}
          </DashboardCard>
        </DashboardGrid>
      </DashboardShell>
    </ProtectedRoute>
  );
}
