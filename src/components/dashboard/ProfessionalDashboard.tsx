"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, CalendarClock, IndianRupee, UserRound } from "lucide-react";
import { useAuth } from "../auth/AuthProvider";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { apiFetch, parseJsonResponse } from "../../lib/api";
import {
  getBookingStatusTone,
  getBookingTimeline,
  getServiceLabel,
} from "../../lib/booking-helpers";
import { formatDateTime, formatInr } from "../../lib/formatting";
import { StatusBanner } from "../ui/StatusBanner";
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
  serviceId?: string;
  paymentStatus?: string;
  timestamps?: {
    createdAt?: string;
    confirmedAt?: string;
    cancelledAt?: string;
    completedAt?: string;
    rescheduledAt?: string;
  };
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [actionBookingId, setActionBookingId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        if (!ignore) setLoading(true);
        const response = await apiFetch("/api/bookings");
        const data = await parseJsonResponse<ProfessionalBooking[]>(response);
        if (!ignore) {
          setBookings(data);
          setSelectedBookingId((current) => current || data[0]?._id || null);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We could not load your sessions yet.",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const refreshBookings = async () => {
    const response = await apiFetch("/api/bookings");
    const data = await parseJsonResponse<ProfessionalBooking[]>(response);
    setBookings(data);
  };

  const handleBookingAction = async (
    bookingId: string,
    action: "confirm" | "complete",
  ) => {
    try {
      setActionBookingId(bookingId);
      setError(null);
      const response = await apiFetch(`/api/bookings/${bookingId}/${action}`, {
        method: "PATCH",
        body:
          action === "confirm"
            ? JSON.stringify({ paymentMethod: "manual" })
            : undefined,
      });
      await parseJsonResponse(response);
      await refreshBookings();
      setSuccessMessage(
        action === "confirm"
          ? "Booking confirmed successfully."
          : "Booking marked as completed.",
      );
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "We could not update the booking right now.",
      );
    } finally {
      setActionBookingId(null);
    }
  };

  const upcoming = bookings.filter((item) =>
    ["pending", "confirmed", "active"].includes(item.status),
  );

  const projectedEarnings = bookings.reduce(
    (sum, booking) => sum + (booking.professionalFee || 0),
    0,
  );
  const capturedEarnings = bookings
    .filter((booking) => booking.paymentStatus === "captured")
    .reduce((sum, booking) => sum + (booking.professionalFee || 0), 0);
  const selectedBooking =
    upcoming.find((booking) => booking._id === selectedBookingId) ||
    upcoming[0] ||
    null;
  const completedBookings = bookings.filter((item) =>
    ["completed", "cancelled"].includes(item.status),
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
        {error ? (
          <StatusBanner tone="error" className="mb-6" title="Something needs attention">
            {error}
          </StatusBanner>
        ) : null}
        {successMessage ? (
          <StatusBanner tone="success" className="mb-6" title="Updated">
            {successMessage}
          </StatusBanner>
        ) : null}
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
                value: formatInr(projectedEarnings),
                note: `Captured so far ${formatInr(capturedEarnings)}`,
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
                      onClick={() => setSelectedBookingId(booking._id)}
                      className="rounded-[22px] bg-[#f7f5f4] p-5"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-[#2b2b2b]">
                            {clientName}
                          </p>
                          <p className="mt-1 text-sm text-[#7e7e7e]">
                            {formatDateTime(booking.scheduledAt)}
                          </p>
                          {typeof booking.clientId === "object" && booking.clientId?.email ? (
                            <p className="mt-1 text-sm text-[#7e7e7e]">{booking.clientId.email}</p>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize text-[#f56969]">
                            {booking.status}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize text-[#2b2b2b]">
                            {booking.paymentStatus || "payment pending"}
                          </span>
                          <span className="text-sm font-medium text-[#2b2b2b]">
                            {formatInr(booking.professionalFee || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title={loading ? "Loading your sessions" : "No professional sessions yet"}
                description={
                  error ||
                  "Once clients begin booking through the new platform, your upcoming sessions will appear here."
                }
              />
            )}
          </DashboardCard>

          <DashboardCard
            title={selectedBooking ? "Session details" : "Practice setup"}
            className="lg:col-span-5"
            eyebrow={selectedBooking ? "Selected booking" : "Readiness"}
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
                  <div className="mt-4 flex flex-wrap gap-3">
                    {selectedBooking.status === "pending" ? (
                      <button
                        type="button"
                        onClick={() => void handleBookingAction(selectedBooking._id, "confirm")}
                        disabled={actionBookingId === selectedBooking._id}
                        className="rounded-full bg-[#2b2b2b] px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
                      >
                        {actionBookingId === selectedBooking._id ? "Updating..." : "Confirm session"}
                      </button>
                    ) : null}
                    {selectedBooking.status === "confirmed" ? (
                      <button
                        type="button"
                        onClick={() => void handleBookingAction(selectedBooking._id, "complete")}
                        disabled={actionBookingId === selectedBooking._id}
                        className="rounded-full border border-[#ead9e8] px-4 py-2 text-xs font-medium text-[#2b2b2b] disabled:opacity-50"
                      >
                        {actionBookingId === selectedBooking._id ? "Updating..." : "Mark completed"}
                      </button>
                    ) : null}
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
                    icon: BadgeCheck,
                    title: "Credential verification",
                    text: user?.profile?.verified
                      ? "Your profile is marked as verified."
                      : "Admin review is still needed before public approval is complete.",
                  },
                  {
                    icon: CalendarClock,
                    title: "Availability",
                    text: "Your saved working hours are already feeding the booking calendar. Editable blocking can be next.",
                  },
                  {
                    icon: IndianRupee,
                    title: "Pricing and payouts",
                    text: "Commission split and GST logic are now in backend pricing; payout views can expand next.",
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
            )}
          </DashboardCard>

          <DashboardCard
            title="Past and completed sessions"
            className="lg:col-span-12"
            eyebrow="History"
          >
            {completedBookings.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {completedBookings.slice(0, 6).map((booking) => {
                  const clientName =
                    typeof booking.clientId === "object"
                      ? booking.clientId?.name || "Client"
                      : "Client";

                  return (
                    <div key={booking._id} className="rounded-[22px] bg-[#f7f5f4] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#2b2b2b]">{clientName}</p>
                          <p className="mt-1 text-sm text-[#7e7e7e]">
                            {getServiceLabel(booking.serviceId)}
                          </p>
                          <p className="mt-1 text-sm text-[#7e7e7e]">
                            {formatDateTime(booking.scheduledAt)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getBookingStatusTone(
                              booking.status,
                            )}`}
                          >
                            {booking.status}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#2b2b2b]">
                            {formatInr(booking.professionalFee || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No completed sessions yet"
                description="Completed or cancelled sessions will show here once your schedule history grows."
              />
            )}
          </DashboardCard>
        </DashboardGrid>
      </DashboardShell>
    </ProtectedRoute>
  );
}
