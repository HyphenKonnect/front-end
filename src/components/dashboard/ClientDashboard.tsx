"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  CreditCard,
  MessageSquare,
  Receipt,
  Video,
} from "lucide-react";
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
  loadRazorpayScript,
  openRazorpayCheckout,
  type RazorpayOrderPayload,
} from "../../lib/razorpay";
import { StatusBanner } from "../ui/StatusBanner";
import { DashboardChatPanel } from "./DashboardChatPanel";
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
  bookingId?: string;
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

type PaymentHistoryRecord = {
  _id: string;
  amount: number;
  currency?: string;
  status: string;
  invoiceNumber?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  method?: string;
  timestamps?: {
    createdAt?: string;
    capturedAt?: string;
  };
  bookingId?: {
    serviceId?: string;
    scheduledAt?: string;
    status?: string;
  };
  professionalId?: {
    name?: string;
    profile?: {
      specialisation?: string;
    };
  };
};

type ClientNavSection = {
  id: string;
  label: string;
  description: string;
  icon: typeof CalendarDays;
};

const clientNavSections: ClientNavSection[] = [
  {
    id: "appointments",
    label: "Schedule",
    description: "Upcoming sessions and current booking details",
    icon: CalendarDays,
  },
  {
    id: "billing",
    label: "Payments",
    description: "Invoices, captured payments, and checkout follow-up",
    icon: CreditCard,
  },
  {
    id: "history",
    label: "History",
    description: "Past and completed client sessions",
    icon: Clock3,
  },
  {
    id: "messages",
    label: "Messages",
    description: "Conversation and document exchange with your professional",
    icon: MessageSquare,
  },
];

export function ClientDashboard() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const requestedBookingId = searchParams.get("bookingId");
  const requestedAction = searchParams.get("action");
  const requestedStatus = searchParams.get("status");
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [payments, setPayments] = useState<PaymentHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionBookingId, setActionBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [paymentState, setPaymentState] = useState<{
    bookingId: string;
    loading: boolean;
    order?: RazorpayOrderPayload;
    error?: string;
  } | null>(null);
  const [activeSection, setActiveSection] = useState("appointments");

  useEffect(() => {
    void loadRazorpayScript();
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadBookings = async () => {
      try {
        if (!ignore) setLoading(true);
        const [bookingsResponse, paymentsResponse] = await Promise.all([
          apiFetch("/api/bookings"),
          apiFetch("/api/payments/history"),
        ]);
        const [bookingData, paymentData] = await Promise.all([
          parseJsonResponse<BookingRecord[]>(bookingsResponse),
          parseJsonResponse<PaymentHistoryRecord[]>(paymentsResponse),
        ]);
        if (!ignore) {
          setBookings(bookingData);
          setPayments(paymentData);
          setSelectedBookingId((current) => current || bookingData[0]?._id || null);
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

  useEffect(() => {
    if (!bookings.length) return;

    if (requestedBookingId) {
      const targetBooking = bookings.find((booking) => booking._id === requestedBookingId);
      if (targetBooking) {
        setSelectedBookingId(targetBooking._id);
      }
    }
  }, [bookings, requestedBookingId]);

  useEffect(() => {
    if (requestedStatus !== "booked" || !requestedBookingId || requestedAction !== "pay") {
      return;
    }

    const targetBooking = bookings.find((booking) => booking._id === requestedBookingId);
    if (!targetBooking) return;
    if (targetBooking.paymentStatus === "captured") return;
    if (paymentState?.bookingId === requestedBookingId) return;

    setSuccessMessage("Booking created. Complete payment to confirm your session.");
    void handleCreatePaymentOrder(requestedBookingId);
  }, [bookings, paymentState?.bookingId, requestedAction, requestedBookingId, requestedStatus]);

  useEffect(() => {
    if (!selectedBookingId) return;

    const booking = bookings.find((item) => item._id === selectedBookingId);
    if (!booking) return;
    if (booking.paymentStatus === "captured") return;
    if (["cancelled", "completed"].includes(booking.status)) return;
    if (paymentState?.bookingId === selectedBookingId) return;

    void handleCreatePaymentOrder(selectedBookingId);
  }, [bookings, paymentState?.bookingId, selectedBookingId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = clientNavSections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.2, 0.4, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const refreshBookings = async () => {
    const [bookingsResponse, paymentsResponse] = await Promise.all([
      apiFetch("/api/bookings"),
      apiFetch("/api/payments/history"),
    ]);
    const [bookingData, paymentData] = await Promise.all([
      parseJsonResponse<BookingRecord[]>(bookingsResponse),
      parseJsonResponse<PaymentHistoryRecord[]>(paymentsResponse),
    ]);
    setBookings(bookingData);
    setPayments(paymentData);
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
      setSuccessMessage("Booking cancelled successfully.");
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

  const handleCreatePaymentOrder = async (bookingId: string) => {
    try {
      setPaymentState({ bookingId, loading: true });
      const response = await apiFetch("/api/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ bookingId }),
      });
      const data = await parseJsonResponse<{
        bookingId: string | null;
        orderId: string;
        amount: number;
        currency: string;
        key: string;
      }>(response);
      setPaymentState({
        bookingId,
        loading: false,
        order: {
          bookingId: data.bookingId || bookingId,
          orderId: data.orderId,
          amount: data.amount,
          currency: data.currency,
          key: data.key,
        },
      });
      return {
        bookingId: data.bookingId || bookingId,
        orderId: data.orderId,
        amount: data.amount,
        currency: data.currency,
        key: data.key,
      };
    } catch (paymentError) {
      setPaymentState({
        bookingId,
        loading: false,
        error:
          paymentError instanceof Error
            ? paymentError.message
            : "We could not initialize payment right now.",
      });
      return null;
    }
  };

  const handlePayNow = async (bookingId: string) => {
    const booking = bookings.find((item) => item._id === bookingId);
    if (!booking) return;

    setError(null);
    setSuccessMessage(null);

    const order =
      paymentState?.bookingId === bookingId && paymentState.order
        ? paymentState.order
        : await handleCreatePaymentOrder(bookingId);

    if (!order) return;

    try {
      await openRazorpayCheckout({
        order,
        name: "The Hyphen Konnect",
        description: `${getServiceLabel(booking.serviceId)} session`,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        onSuccess: async (response) => {
          const verifyResponse = await apiFetch("/api/payments/verify", {
            method: "POST",
            body: JSON.stringify({
              bookingId,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          const verification = await parseJsonResponse<{
            success: boolean;
            invoiceNumber?: string;
            method?: string;
          }>(verifyResponse);

          const confirmResponse = await apiFetch(`/api/bookings/${bookingId}/confirm`, {
            method: "PATCH",
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              paymentMethod: verification.method || "upi",
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            }),
          });
          await parseJsonResponse(confirmResponse);
          await refreshBookings();
          setSuccessMessage(
            verification.invoiceNumber
              ? `Payment captured and booking confirmed. Invoice ${verification.invoiceNumber} is now in your history.`
              : "Payment captured and booking confirmed.",
          );
        },
        onFailure: (message) => {
          setError(message);
        },
        onDismiss: () => {
          setError("Payment window closed before completion.");
        },
      });
    } catch (paymentError) {
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : "We could not start Razorpay checkout.",
      );
    }
  };

  const stopCardClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const upcomingCount = bookings.filter((item) =>
    ["pending", "confirmed", "active"].includes(item.status),
  ).length;
  const capturedPayments = bookings.filter((item) => item.paymentStatus === "captured").length;
  const completedBookings = bookings.filter((item) =>
    ["completed", "cancelled"].includes(item.status),
  );
  const selectedBooking =
    bookings.find((booking) => booking._id === selectedBookingId) || bookings[0] || null;

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <DashboardShell
        accent="Client Dashboard"
        title={`Hello${user?.name ? `, ${user.name}` : ""}`}
        description="Track appointments, payments, and session details in one place."
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
                note: user?.onboardingComplete
                  ? "Your account is ready for booking."
                  : "Complete your account details to get started.",
              },
              {
                label: "Payments",
                value: capturedPayments ? `${capturedPayments} captured` : "Pending",
                note: "Captured sessions and pending payment follow-up",
              },
            ]}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-32 xl:self-start">
            <div className="rounded-[28px] bg-[#2b2b2b] p-3 text-white shadow-sm sm:p-4 xl:max-h-[calc(100vh-9rem)] xl:overflow-y-auto xl:p-4">
              <nav
                className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 xl:mx-0 xl:block xl:space-y-1.5 xl:overflow-visible xl:px-0 xl:pb-0"
                aria-label="Client dashboard sections"
              >
                {clientNavSections.map((section) => {
                  const isActive = activeSection === section.id;

                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={() => setActiveSection(section.id)}
                      className={`min-w-[190px] shrink-0 rounded-[18px] border px-3.5 py-2.5 transition xl:block xl:min-w-0 ${
                        isActive
                          ? "border-[#fcb4b3] bg-white text-[#2b2b2b]"
                          : "border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <section.icon
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            isActive ? "text-[#f56969]" : "text-white/70"
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-[15px] font-semibold leading-5">{section.label}</p>
                          <p
                            className={`mt-0.5 line-clamp-2 text-[11px] leading-4 ${
                              isActive ? "text-[#7e7e7e]" : "text-white/60"
                            }`}
                          >
                            {section.description}
                          </p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          <DashboardGrid>
            <DashboardCard
              title="Your appointments"
              sectionId="appointments"
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
                  const canPay =
                    booking.paymentStatus !== "captured" &&
                    booking.status !== "cancelled" &&
                    booking.status !== "completed";

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
                            onClick={(event) => {
                              stopCardClick(event);
                              void handleCancelBooking(booking._id);
                            }}
                            disabled={actionBookingId === booking._id}
                            className="rounded-full border border-[#f4c7c4] px-3 py-1 text-xs font-medium text-[#f56969] disabled:opacity-50"
                          >
                            {actionBookingId === booking._id ? "Cancelling..." : "Cancel"}
                          </button>
                        ) : null}
                        {canPay ? (
                          <button
                            type="button"
                            onClick={(event) => {
                              stopCardClick(event);
                              void handlePayNow(booking._id);
                            }}
                            disabled={paymentState?.loading && paymentState.bookingId === booking._id}
                            className="rounded-full bg-[#2b2b2b] px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
                          >
                            {paymentState?.loading && paymentState.bookingId === booking._id
                              ? "Preparing..."
                              : "Pay now"}
                          </button>
                        ) : null}
                        {["confirmed", "completed"].includes(booking.status) ? (
                          <Link
                            href={`/consultation/${booking._id}`}
                            className="rounded-full border border-[#ead9e8] px-3 py-1 text-xs font-medium text-[#2b2b2b]"
                          >
                            Join session
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
              title={selectedBooking ? "Booking details" : "Helpful information"}
              className="lg:col-span-4"
              eyebrow={selectedBooking ? "Selected session" : "Guide"}
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
                  {["confirmed", "completed"].includes(selectedBooking.status) ? (
                    <Link
                      href={`/consultation/${selectedBooking._id}`}
                      className="mt-4 inline-flex rounded-full border border-[#ead9e8] px-4 py-2 text-xs font-medium text-[#2b2b2b]"
                    >
                      Open session room
                    </Link>
                  ) : null}
                  {selectedBooking.paymentStatus !== "captured" &&
                  !["cancelled", "completed"].includes(selectedBooking.status) ? (
                    <button
                      type="button"
                      onClick={() => void handlePayNow(selectedBooking._id)}
                      disabled={
                        paymentState?.loading &&
                        paymentState.bookingId === selectedBooking._id
                      }
                      className="mt-4 inline-flex rounded-full bg-[#2b2b2b] px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
                    >
                      {paymentState?.loading &&
                      paymentState.bookingId === selectedBooking._id
                        ? "Preparing..."
                        : "Pay now"}
                    </button>
                  ) : null}
                  {paymentState?.bookingId === selectedBooking._id && paymentState.order ? (
                    <StatusBanner tone="info" className="mt-4" title="Payment order ready">
                      Razorpay order ID: {paymentState.order.orderId}
                    </StatusBanner>
                  ) : null}
                  {paymentState?.bookingId === selectedBooking._id && paymentState.error ? (
                    <StatusBanner tone="error" className="mt-4" title="Payment setup unavailable">
                      {paymentState.error}
                    </StatusBanner>
                  ) : null}
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
                    title: "Bookings",
                    text: "Review your upcoming and past sessions here, along with their current status.",
                  },
                  {
                    icon: Video,
                    title: "Online sessions",
                    text: "Join your confirmed sessions from the dashboard when your meeting room is ready.",
                  },
                  {
                    icon: MessageSquare,
                    title: "Messages",
                    text: "Use your session conversation space to stay in touch with your professional.",
                  },
                  {
                    icon: CreditCard,
                    title: "Invoices",
                    text: "View payment history and invoices for completed transactions.",
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
              title="Payments and invoices"
              sectionId="billing"
              className="lg:col-span-12"
              eyebrow="Billing history"
            >
            {payments.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {payments.slice(0, 8).map((payment) => (
                  <div key={payment._id} className="rounded-[22px] bg-[#f7f5f4] p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#2b2b2b]">
                          {payment.professionalId?.name || "Assigned professional"}
                        </p>
                        <p className="mt-1 text-sm text-[#7e7e7e]">
                          {getServiceLabel(payment.bookingId?.serviceId)}
                        </p>
                        <p className="mt-1 text-sm text-[#7e7e7e]">
                          {payment.timestamps?.capturedAt || payment.timestamps?.createdAt
                            ? formatDateTime(
                                payment.timestamps?.capturedAt || payment.timestamps?.createdAt || "",
                              )
                            : "Awaiting capture"}
                        </p>
                        {payment.invoiceNumber ? (
                          <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-[#f56969]">
                            Invoice {payment.invoiceNumber}
                          </p>
                        ) : null}
                      </div>
                      <div className="text-right">
                        <p className="text-base font-semibold text-[#2b2b2b]">
                          {formatInr(payment.amount || 0)}
                        </p>
                        <p className="mt-1 text-sm capitalize text-[#7e7e7e]">
                          {payment.method || "online payment"}
                        </p>
                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${getBookingStatusTone(
                            payment.status === "captured" ? "confirmed" : payment.status,
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/dashboard/client/invoices/${payment._id}`}
                        className="inline-flex items-center gap-2 rounded-full border border-[#ead9e8] px-4 py-2 text-sm font-medium text-[#2b2b2b]"
                      >
                        <Receipt className="h-4 w-4" />
                        View invoice
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No payment history yet"
                description="Captured payments and invoice references will appear here once you complete checkout."
              />
            )}
            </DashboardCard>

            <DashboardCard
              title="Past and completed bookings"
              sectionId="history"
              className="lg:col-span-12"
              eyebrow="History"
            >
            {completedBookings.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {completedBookings.slice(0, 6).map((booking) => {
                  const professionalName =
                    typeof booking.professionalId === "object"
                      ? booking.professionalId?.name || "Assigned professional"
                      : "Assigned professional";

                  return (
                    <div key={booking._id} className="rounded-[22px] bg-[#f7f5f4] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#2b2b2b]">{professionalName}</p>
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
                            {formatInr(booking.totalAmount || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No past bookings yet"
                description="Completed or cancelled sessions will appear here once your booking history starts growing."
              />
            )}
            </DashboardCard>

            <DashboardCard
              title="Messages"
              sectionId="messages"
              className="lg:col-span-12"
              eyebrow="Client-professional chat"
            >
            <DashboardChatPanel
              title="Session conversations"
              description="Use this space to share practical updates with your professional before or after a confirmed session."
              emptyDescription="Your booking-related chats will appear here once you start messaging around a session."
            />
            </DashboardCard>
          </DashboardGrid>
        </div>
      </DashboardShell>
    </ProtectedRoute>
  );
}
