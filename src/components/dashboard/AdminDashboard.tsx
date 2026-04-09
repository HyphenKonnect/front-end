"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRightLeft,
  BellRing,
  CalendarClock,
  ChartColumnIncreasing,
  ClipboardList,
  CreditCard,
  IndianRupee,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { apiFetch, parseJsonResponse } from "../../lib/api";
import {
  getBookingStatusTone,
  getBookingTimeline,
  getServiceLabel,
} from "../../lib/booking-helpers";
import { formatDateTime, formatInr } from "../../lib/formatting";
import { professionals } from "../site/data";
import { StatusBanner } from "../ui/StatusBanner";
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
  avatar?: string;
  isActive?: boolean;
  onboardingComplete?: boolean;
  phone?: string;
  profile?: {
    verified?: boolean;
    specialisation?: string;
    serviceCategory?: "therapist" | "doctor" | "legal" | "wellness";
    yearsExperience?: number;
    sessionPrice?: number;
  };
};

type AdminBooking = {
  _id: string;
  scheduledAt: string;
  status: string;
  serviceId?: string;
  paymentStatus?: string;
  basePrice?: number;
  gstAmount?: number;
  totalAmount?: number;
  platformCommission?: number;
  professionalFee?: number;
  timestamps?: {
    createdAt?: string;
    confirmedAt?: string;
    cancelledAt?: string;
    completedAt?: string;
    rescheduledAt?: string;
  };
  professionalId?: string | { name?: string; email?: string };
  clientId?: string | { name?: string; email?: string };
};

function isWithinDateRange(value: string, from: string, to: string) {
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return false;

  if (from) {
    const start = new Date(`${from}T00:00:00`);
    if (target < start) return false;
  }

  if (to) {
    const end = new Date(`${to}T23:59:59.999`);
    if (target > end) return false;
  }

  return true;
}

const serviceLabels = {
  therapist: "Mental Wellness",
  doctor: "Medical Consultation",
  legal: "Legal Guidance",
  wellness: "Wellness Programs",
  all: "General",
} as const;

const serviceOrder = ["therapist", "doctor", "legal", "wellness"] as const;
const adminMenu = [
  { label: "Overview", href: "#admin-overview", icon: ChartColumnIncreasing },
  { label: "Operations", href: "#admin-operations", icon: ClipboardList },
  { label: "Team", href: "#admin-team", icon: Users },
  { label: "Manual booking", href: "#manual-booking", icon: IndianRupee },
  { label: "Bookings", href: "#admin-bookings", icon: CalendarClock },
  { label: "Finance", href: "#admin-finance", icon: CreditCard },
  { label: "History", href: "#admin-history", icon: BellRing },
];

export function AdminDashboard() {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [actionBookingId, setActionBookingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [creatingProfessional, setCreatingProfessional] = useState(false);
  const [avatarDrafts, setAvatarDrafts] = useState<Record<string, string>>({});
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [newProfessional, setNewProfessional] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    avatar: "",
    specialisation: "",
    serviceCategory: "therapist",
    yearsExperience: "",
    sessionPrice: "",
  });
  const [creatingBooking, setCreatingBooking] = useState(false);
  const [financeDateFrom, setFinanceDateFrom] = useState("");
  const [financeDateTo, setFinanceDateTo] = useState("");
  const [financeSort, setFinanceSort] = useState<"newest" | "oldest" | "highest" | "lowest">(
    "newest",
  );
  const [manualBooking, setManualBooking] = useState({
    clientId: "",
    professionalId: "",
    scheduledAt: "",
    sendPaymentRequest: false,
  });

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      const results = await Promise.allSettled([
        apiFetch("/api/admin/summary").then((response) =>
          parseJsonResponse<AdminSummary>(response),
        ),
        apiFetch("/api/admin/users").then((response) =>
          parseJsonResponse<AdminUser[]>(response),
        ),
        apiFetch("/api/admin/bookings").then((response) =>
          parseJsonResponse<AdminBooking[]>(response),
        ),
      ]);

      if (ignore) return;

      const [summaryResult, usersResult, bookingsResult] = results;

      if (summaryResult.status === "fulfilled") {
        setSummary(summaryResult.value);
      }

      if (usersResult.status === "fulfilled") {
        setUsers(usersResult.value);
      }

      if (bookingsResult.status === "fulfilled") {
        setBookings(bookingsResult.value);
        setSelectedBookingId((current) => current || bookingsResult.value[0]?._id || null);
      }

      if (results.every((result) => result.status === "rejected")) {
        setError("We could not load admin analytics yet.");
      }
    };

    void loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const refreshBookings = async () => {
    const response = await apiFetch("/api/admin/bookings");
    const data = await parseJsonResponse<AdminBooking[]>(response);
    setBookings(data);
  };

  const refreshUsersAndSummary = async () => {
    const [summaryResponse, usersResponse] = await Promise.all([
      apiFetch("/api/admin/summary"),
      apiFetch("/api/admin/users"),
    ]);
    const [summaryData, usersData] = await Promise.all([
      parseJsonResponse<AdminSummary>(summaryResponse),
      parseJsonResponse<AdminUser[]>(usersResponse),
    ]);
    setSummary(summaryData);
    setUsers(usersData);
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

  const handleUserAction = async (
    userId: string,
    action: "approve" | "suspend" | "reactivate",
  ) => {
    try {
      setSavingUserId(userId);
      setError(null);
      const response = await apiFetch(`/api/admin/users/${userId}/${action}`, {
        method: "PATCH",
      });
      await parseJsonResponse(response);
      await refreshUsersAndSummary();
      setSuccessMessage(
        action === "approve"
          ? "Professional approved successfully."
          : action === "suspend"
            ? "User suspended successfully."
            : "User reactivated successfully.",
      );
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "We could not update the user right now.",
      );
    } finally {
      setSavingUserId(null);
    }
  };

  const handleServiceAssignment = async (
    userId: string,
    serviceCategory: "therapist" | "doctor" | "legal" | "wellness",
  ) => {
    try {
      setSavingUserId(userId);
      setError(null);
      const targetUser = users.find((user) => user._id === userId);
      const response = await apiFetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          profile: {
            ...targetUser?.profile,
            serviceCategory,
          },
        }),
      });
      await parseJsonResponse(response);
      await refreshUsersAndSummary();
      setSuccessMessage("Service assignment updated successfully.");
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "We could not update the service assignment right now.",
      );
    } finally {
      setSavingUserId(null);
    }
  };

  const handleAvatarUpdate = async (userId: string) => {
    try {
      setSavingUserId(userId);
      setError(null);
      const response = await apiFetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          avatar: (avatarDrafts[userId] ?? "").trim(),
        }),
      });
      const data = await parseJsonResponse<{ user?: AdminUser }>(response);
      await refreshUsersAndSummary();
      setAvatarDrafts((current) => ({
        ...current,
        [userId]: data.user?.avatar || "",
      }));
      setSuccessMessage("Professional profile picture updated successfully.");
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "We could not update the professional profile picture right now.",
      );
    } finally {
      setSavingUserId(null);
    }
  };

  const handleAvatarFileChange = async (userId: string, file?: File | null) => {
    if (!file) return;

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(new Error("Could not read the selected image."));
      reader.readAsDataURL(file);
    });

    setAvatarDrafts((current) => ({
      ...current,
      [userId]: dataUrl,
    }));
  };

  const handleNewProfessionalPhotoChange = async (file?: File | null) => {
    if (!file) return;

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => reject(new Error("Could not read the selected image."));
      reader.readAsDataURL(file);
    });

    setNewProfessional((current) => ({
      ...current,
      avatar: dataUrl,
    }));
  };

  const handleSessionPriceUpdate = async (userId: string) => {
    try {
      setSavingUserId(userId);
      setError(null);
      const targetUser = users.find((user) => user._id === userId);
      const rawValue = (priceDrafts[userId] ?? "").trim();
      const response = await apiFetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          profile: {
            ...targetUser?.profile,
            sessionPrice: rawValue ? Number(rawValue) : 0,
          },
        }),
      });
      await parseJsonResponse(response);
      await refreshUsersAndSummary();
      setSuccessMessage("Professional session price updated successfully.");
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "We could not update the professional session price right now.",
      );
    } finally {
      setSavingUserId(null);
    }
  };

  const handleDeleteProfessional = async (userId: string, name: string) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) {
      return;
    }

    try {
      setSavingUserId(userId);
      setError(null);
      const response = await apiFetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      await parseJsonResponse(response);
      await refreshUsersAndSummary();
      setSuccessMessage("Professional deleted successfully.");
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "We could not delete the professional right now.",
      );
    } finally {
      setSavingUserId(null);
    }
  };

  const handleCreateProfessional = async () => {
    try {
      setCreatingProfessional(true);
      setError(null);
      const response = await apiFetch("/api/admin/professionals", {
        method: "POST",
        body: JSON.stringify({
          name: newProfessional.name,
          email: newProfessional.email,
          password: newProfessional.password,
          phone: newProfessional.phone,
          avatar: newProfessional.avatar,
          profile: {
            specialisation: newProfessional.specialisation,
            serviceCategory: newProfessional.serviceCategory,
            yearsExperience: newProfessional.yearsExperience
              ? Number(newProfessional.yearsExperience)
              : undefined,
            sessionPrice: newProfessional.sessionPrice
              ? Number(newProfessional.sessionPrice)
              : undefined,
          },
        }),
      });
      await parseJsonResponse(response);
      await refreshUsersAndSummary();
      setSuccessMessage("New professional added successfully.");
      setNewProfessional({
        name: "",
        email: "",
        password: "",
        phone: "",
        avatar: "",
        specialisation: "",
        serviceCategory: "therapist",
        yearsExperience: "",
        sessionPrice: "",
      });
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "We could not create the professional right now.",
      );
    } finally {
      setCreatingProfessional(false);
    }
  };

  const handleCreateManualBooking = async () => {
    try {
      setCreatingBooking(true);
      setError(null);
      const response = await apiFetch("/api/admin/bookings/manual", {
        method: "POST",
        body: JSON.stringify({
          clientId: manualBooking.clientId,
          professionalId: manualBooking.professionalId,
          scheduledAt: manualBooking.scheduledAt,
        }),
      });
      await parseJsonResponse(response);
      await refreshBookings();
      setSuccessMessage("Free manual booking created and confirmed.");
      setManualBooking({
        clientId: "",
        professionalId: "",
        scheduledAt: "",
        sendPaymentRequest: false,
      });
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "We could not create the booking right now.",
      );
    } finally {
      setCreatingBooking(false);
    }
  };

  const professionalUsers = useMemo(
    () => users.filter((user) => user.role === "professional"),
    [users],
  );
  const clientUsers = useMemo(
    () => users.filter((user) => user.role === "client"),
    [users],
  );

  const employeeRoster = useMemo(() => {
    const normalizeName = (value: string) => value.trim().toLowerCase();
    const curatedByName = new Map(
      professionals.map((professional) => [normalizeName(professional.name), professional]),
    );
    const roster = new Map<string, {
      id: string;
      name: string;
      email: string;
      service: string;
      serviceKey: "therapist" | "doctor" | "legal" | "wellness" | "all";
      specialty: string;
      rate: string;
      sessionPriceValue: string;
      experience: string;
      status: string;
      verification: string;
      avatar: string;
      hasLiveRecord: boolean;
    }>();

    for (const professional of professionals) {
      const linkedUser = professionalUsers.find(
        (user) => normalizeName(user.name) === normalizeName(professional.name),
      );
      const serviceKey =
        linkedUser?.profile?.serviceCategory || professional.category;

      roster.set(normalizeName(professional.name), {
        id: linkedUser?._id || String(professional.id),
        name: linkedUser?.name || professional.name,
        email: linkedUser?.email || "Profile email pending",
        service: serviceLabels[serviceKey as keyof typeof serviceLabels] || serviceLabels.all,
        serviceKey,
        specialty: linkedUser?.profile?.specialisation || professional.specialty,
        rate:
          linkedUser?.profile?.sessionPrice != null
            ? `Rs. ${linkedUser.profile.sessionPrice}/session`
            : professional.rate,
        sessionPriceValue:
          linkedUser?.profile?.sessionPrice != null
            ? String(linkedUser.profile.sessionPrice)
            : "",
        experience:
          linkedUser?.profile?.yearsExperience != null
            ? `${linkedUser.profile.yearsExperience} years`
            : professional.experience,
        status: linkedUser?.isActive === false ? "Paused" : "Active",
        verification:
          linkedUser?.profile?.verified || professional.available ? "Verified" : "Reviewing",
        avatar: linkedUser?.avatar || professional.image || "/brand-logo.png",
        hasLiveRecord: Boolean(linkedUser?._id),
      });
    }

    for (const user of professionalUsers) {
      const key = normalizeName(user.name);
      const localMatch = curatedByName.get(key);
      const serviceKey = user.profile?.serviceCategory || localMatch?.category || "all";

      roster.set(key, {
        id: user._id,
        name: user.name,
        email: user.email,
        service: serviceLabels[serviceKey as keyof typeof serviceLabels] || serviceLabels.all,
        serviceKey,
        specialty: user.profile?.specialisation || localMatch?.specialty || "Specialist",
        rate:
          user.profile?.sessionPrice != null
            ? `Rs. ${user.profile.sessionPrice}/session`
            : localMatch?.rate || "Rate pending",
        sessionPriceValue:
          user.profile?.sessionPrice != null ? String(user.profile.sessionPrice) : "",
        experience:
          user.profile?.yearsExperience != null
            ? `${user.profile.yearsExperience} years`
            : localMatch?.experience || "Experience pending",
        status: user.isActive === false ? "Paused" : "Active",
        verification: user.profile?.verified ? "Verified" : "Reviewing",
        avatar: user.avatar || localMatch?.image || "/brand-logo.png",
        hasLiveRecord: true,
      });
    }

    return Array.from(roster.values());
  }, [professionalUsers]);

  const bookingInsights = useMemo(() => {
    const pending = bookings.filter((booking) =>
      ["pending", "requested"].includes(booking.status),
    ).length;
    const confirmed = bookings.filter((booking) =>
      ["confirmed", "active"].includes(booking.status),
    ).length;
    const completed = bookings.filter((booking) => booking.status === "completed").length;
    const paymentPending = bookings.filter(
      (booking) => booking.paymentStatus && booking.paymentStatus !== "captured",
    ).length;

    return { pending, confirmed, completed, paymentPending };
  }, [bookings]);

  const revenueSnapshot = useMemo(() => {
    const gross = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    const platform = bookings.reduce((sum, booking) => sum + (booking.platformCommission || 0), 0);
    const professional = bookings.reduce((sum, booking) => sum + (booking.professionalFee || 0), 0);

    return {
      gross,
      platform,
      professional,
    };
  }, [bookings]);

  const serviceCoverage = useMemo(() => {
    return serviceOrder.map((category) => {
      const team = employeeRoster.filter((employee) => {
        return serviceLabels[category] === employee.service;
      });

      return {
        category,
        label: serviceLabels[category],
        count: team.length,
        members: team.slice(0, 4),
      };
    });
  }, [employeeRoster]);

  const financeBookings = useMemo(() => {
    const filtered = bookings.filter((booking) =>
      isWithinDateRange(booking.scheduledAt, financeDateFrom, financeDateTo),
    );

    return filtered.sort((first, second) => {
      if (financeSort === "oldest") {
        return new Date(first.scheduledAt).getTime() - new Date(second.scheduledAt).getTime();
      }
      if (financeSort === "highest") {
        return (second.totalAmount || 0) - (first.totalAmount || 0);
      }
      if (financeSort === "lowest") {
        return (first.totalAmount || 0) - (second.totalAmount || 0);
      }
      return new Date(second.scheduledAt).getTime() - new Date(first.scheduledAt).getTime();
    });
  }, [bookings, financeDateFrom, financeDateTo, financeSort]);

  const financeSnapshot = useMemo(() => {
    const gross = financeBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    const gst = financeBookings.reduce((sum, booking) => sum + (booking.gstAmount || 0), 0);
    const base = financeBookings.reduce((sum, booking) => sum + (booking.basePrice || 0), 0);
    const platform = financeBookings.reduce(
      (sum, booking) => sum + (booking.platformCommission || 0),
      0,
    );
    const professional = financeBookings.reduce(
      (sum, booking) => sum + (booking.professionalFee || 0),
      0,
    );

    return { gross, gst, base, platform, professional };
  }, [financeBookings]);

  const upcomingAppointments = useMemo(() => {
    return bookings
      .filter((booking) => ["pending", "confirmed", "active"].includes(booking.status))
      .sort(
        (first, second) =>
          new Date(first.scheduledAt).getTime() - new Date(second.scheduledAt).getTime(),
      )
      .slice(0, 6);
  }, [bookings]);
  const selectedBooking =
    bookings.find((booking) => booking._id === selectedBookingId) || upcomingAppointments[0] || null;
  const completedBookings = bookings.filter((booking) =>
    ["completed", "cancelled"].includes(booking.status),
  );

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardShell
        accent="Admin Dashboard"
        title="Platform operations control"
        description="Manage bookings, payments, appointments, employee onboarding, and service coverage from one clear admin workspace built for the new Hyphen Konnect platform."
        actions={
          <>
            <Link
              href="/professionals"
              className="rounded-full border border-[#ead9e8] px-5 py-2.5 text-sm font-medium text-[#2b2b2b]"
            >
              View public directory
            </Link>
            <Link
              href="/dashboard/admin#manual-booking"
              className="rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-5 py-2.5 text-sm font-medium text-white"
            >
              Create manual booking
            </Link>
          </>
        }
      >
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-[140px] rounded-[24px] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f56969]">
                Admin Menu
              </p>
              <nav className="mt-4 space-y-2">
                {adminMenu.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-[14px] px-3 py-2 text-sm font-medium text-[#2b2b2b] transition hover:bg-[#f7f5f4]"
                  >
                    <item.icon className="h-4 w-4 text-[#f56969]" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="space-y-8">
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

            <section id="admin-overview">
              <StatList
                items={[
                  {
                    label: "Platform users",
                    value: String(summary?.users.total || users.length || 0),
                    note: summary
                      ? `${summary.users.clients} clients and ${summary.users.professionals} professionals`
                      : "Live user breakdown will populate from admin endpoints",
                  },
                  {
                    label: "Bookings in system",
                    value: String(summary?.bookings.total || bookings.length || 0),
                    note: `${bookingInsights.pending} pending and ${bookingInsights.confirmed} confirmed`,
                  },
                  {
                    label: "Payments processed",
                    value: formatInr(summary?.revenue.totalProcessed || revenueSnapshot.gross),
                    note: `${bookingInsights.paymentPending} payment records still need follow-up`,
                  },
                  {
                    label: "Platform commission",
                    value: formatInr(summary?.revenue.platformCommission || revenueSnapshot.platform),
                    note: summary
                      ? `GST collected ${formatInr(summary.revenue.gstCollected)}`
                      : "Finance totals expand as booking records grow",
                  },
                ]}
              />
            </section>

            <section id="admin-operations">
              <DashboardGrid>
                <DashboardCard title="Operations lanes" className="lg:col-span-12" eyebrow="Overview">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  icon: ClipboardList,
                  title: "Bookings",
                  text: `${bookingInsights.pending} requests need review, reassignment, or confirmation.`,
                },
                {
                  icon: CreditCard,
                  title: "Payments",
                  text: `${bookingInsights.paymentPending} bookings still need payment reconciliation or invoice follow-up.`,
                },
                {
                  icon: CalendarClock,
                  title: "Appointments",
                  text: `${bookingInsights.confirmed} live appointments are currently scheduled across the platform.`,
                },
                {
                  icon: Users,
                  title: "Employee management",
                  text: `${employeeRoster.length} team profiles are mapped into your four service categories.`,
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[22px] bg-[#f7f5f4] p-5">
                  <item.icon className="h-5 w-5 text-[#f56969]" />
                  <p className="mt-3 font-semibold text-[#2b2b2b]">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#7e7e7e]">{item.text}</p>
                </div>
              ))}
            </div>
                </DashboardCard>

                <div id="admin-team" className="lg:col-span-8">
                  <DashboardCard title="Employee management" eyebrow="Team">
                    {employeeRoster.length ? (
                      <div className="space-y-4">
                        {employeeRoster.map((employee) => (
                          <div
                            key={employee.id}
                            className="rounded-[24px] bg-[#f7f5f4] p-5"
                          >
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                              <div className="flex gap-4">
                                <img
                                  src={employee.avatar}
                                  alt={`${employee.name} profile`}
                                  className="h-16 w-16 rounded-[20px] object-cover"
                                />
                                <div>
                                  <div className="flex flex-wrap items-center gap-3">
                                    <p className="text-lg font-semibold text-[#2b2b2b]">{employee.name}</p>
                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#f56969]">
                                      {employee.service}
                                    </span>
                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#2b2b2b]">
                                      {employee.verification}
                                    </span>
                                  </div>
                                  <p className="mt-2 text-sm text-[#7e7e7e]">{employee.specialty}</p>
                                  <p className="mt-1 text-sm text-[#7e7e7e]">{employee.email}</p>
                                </div>
                              </div>
                              <div className="grid gap-2 text-sm text-[#7e7e7e] sm:grid-cols-3">
                                <div className="rounded-[18px] bg-white px-4 py-3">
                                  <p className="text-xs uppercase tracking-[0.18em]">Rate</p>
                                  <p className="mt-2 font-medium text-[#2b2b2b]">{employee.rate}</p>
                                </div>
                                <div className="rounded-[18px] bg-white px-4 py-3">
                                  <p className="text-xs uppercase tracking-[0.18em]">Experience</p>
                                  <p className="mt-2 font-medium text-[#2b2b2b]">{employee.experience}</p>
                                </div>
                                <div className="rounded-[18px] bg-white px-4 py-3">
                                  <p className="text-xs uppercase tracking-[0.18em]">Status</p>
                                  <p className="mt-2 font-medium text-[#2b2b2b]">{employee.status}</p>
                                </div>
                              </div>
                            </div>
                            {users.find((user) => user._id === employee.id)?.role === "professional" ? (
                              <div className="mt-4 space-y-3 border-t border-[#ead9e8] pt-4">
                                <div className="grid gap-3 xl:grid-cols-[1.15fr_0.85fr_auto]">
                                  <label className="block text-xs font-medium uppercase tracking-[0.16em] text-[#7e7e7e]">
                                    Upload main profile picture
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(event) =>
                                        void handleAvatarFileChange(
                                          employee.id,
                                          event.target.files?.[0],
                                        )
                                      }
                                      className="mt-2 block w-full rounded-[16px] border border-[#ead9e8] bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#2b2b2b] outline-none file:mr-3 file:rounded-full file:border-0 file:bg-[#f7f5f4] file:px-3 file:py-2 file:text-sm file:font-medium"
                                    />
                                  </label>
                                  <label className="block text-xs font-medium uppercase tracking-[0.16em] text-[#7e7e7e]">
                                    Session price
                                    <input
                                      type="number"
                                      min="0"
                                      value={priceDrafts[employee.id] ?? employee.sessionPriceValue}
                                      onChange={(event) =>
                                        setPriceDrafts((current) => ({
                                          ...current,
                                          [employee.id]: event.target.value,
                                        }))
                                      }
                                      placeholder="0"
                                      className="mt-2 w-full rounded-[16px] border border-[#ead9e8] bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#2b2b2b] outline-none"
                                    />
                                  </label>
                                  <div className="flex flex-col gap-2 xl:justify-end">
                                    <button
                                      type="button"
                                      onClick={() => void handleAvatarUpdate(employee.id)}
                                      disabled={savingUserId === employee.id}
                                      className="rounded-full border border-[#ead9e8] px-4 py-3 text-xs font-medium text-[#2b2b2b] disabled:opacity-50"
                                    >
                                      Save photo
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => void handleSessionPriceUpdate(employee.id)}
                                      disabled={savingUserId === employee.id}
                                      className="rounded-full border border-[#ead9e8] px-4 py-3 text-xs font-medium text-[#2b2b2b] disabled:opacity-50"
                                    >
                                      Save price
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => void handleDeleteProfessional(employee.id, employee.name)}
                                      disabled={savingUserId === employee.id}
                                      className="rounded-full border border-[#f4c7c4] px-4 py-3 text-xs font-medium text-[#f56969] disabled:opacity-50"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                  <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => void handleUserAction(employee.id, "approve")}
                                    disabled={savingUserId === employee.id}
                                    className="rounded-full border border-[#ead9e8] px-4 py-2 text-xs font-medium text-[#2b2b2b] disabled:opacity-50"
                                  >
                                    Approve
                                  </button>
                                  {employee.status === "Paused" ? (
                                    <button
                                      type="button"
                                      onClick={() => void handleUserAction(employee.id, "reactivate")}
                                      disabled={savingUserId === employee.id}
                                      className="rounded-full border border-[#ead9e8] px-4 py-2 text-xs font-medium text-[#2b2b2b] disabled:opacity-50"
                                    >
                                      Reactivate
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => void handleUserAction(employee.id, "suspend")}
                                      disabled={savingUserId === employee.id}
                                      className="rounded-full border border-[#f4c7c4] px-4 py-2 text-xs font-medium text-[#f56969] disabled:opacity-50"
                                    >
                                      Suspend
                                    </button>
                                  )}
                                  </div>
                                  <label className="text-xs font-medium uppercase tracking-[0.16em] text-[#7e7e7e]">
                                    Service assignment
                                    <select
                                      value={employee.serviceKey}
                                      onChange={(event) =>
                                        void handleServiceAssignment(
                                          employee.id,
                                          event.target.value as
                                            | "therapist"
                                            | "doctor"
                                            | "legal"
                                            | "wellness",
                                        )
                                      }
                                      className="ml-0 mt-2 block rounded-full border border-[#ead9e8] bg-white px-4 py-2 text-sm font-medium normal-case tracking-normal text-[#2b2b2b] outline-none lg:ml-3 lg:inline-flex lg:mt-0"
                                    >
                                      <option value="therapist">Mental Wellness</option>
                                      <option value="doctor">Medical Consultation</option>
                                      <option value="legal">Legal Guidance</option>
                                      <option value="wellness">Wellness Programs</option>
                                    </select>
                                  </label>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="No employees surfaced yet"
                        description={
                          error ||
                          "As professional records sync cleanly through the backend and admin endpoints, your team roster will become fully manageable from here."
                        }
                      />
                    )}
                  </DashboardCard>
                </div>
            <DashboardCard title="Admin actions" className="lg:col-span-4" eyebrow="Playbook">
            <div className="space-y-4">
              <div id="manual-booking" className="rounded-[22px] bg-[#f7f5f4] p-5">
                <IndianRupee className="h-5 w-5 text-[#f56969]" />
                <p className="mt-3 font-semibold text-[#2b2b2b]">Create free manual booking</p>
                <p className="mt-2 text-sm leading-6 text-[#7e7e7e]">
                  Test mode is active here, so admin bookings are created as free and confirmed.
                </p>
                <div className="mt-4 space-y-3">
                  <select
                    value={manualBooking.clientId}
                    onChange={(event) =>
                      setManualBooking((current) => ({
                        ...current,
                        clientId: event.target.value,
                      }))
                    }
                    className="w-full rounded-[16px] border border-[#ead9e8] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none"
                  >
                    <option value="">Select client</option>
                    {clientUsers.map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.name} ({client.email})
                      </option>
                    ))}
                  </select>
                  <select
                    value={manualBooking.professionalId}
                    onChange={(event) =>
                      setManualBooking((current) => ({
                        ...current,
                        professionalId: event.target.value,
                      }))
                    }
                    className="w-full rounded-[16px] border border-[#ead9e8] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none"
                  >
                    <option value="">Select professional</option>
                    {professionalUsers.map((professional) => (
                      <option key={professional._id} value={professional._id}>
                        {professional.name} ({professional.email})
                      </option>
                    ))}
                  </select>
                  <input
                    type="datetime-local"
                    value={manualBooking.scheduledAt}
                    onChange={(event) =>
                      setManualBooking((current) => ({
                        ...current,
                        scheduledAt: event.target.value,
                      }))
                    }
                    className="w-full rounded-[16px] border border-[#ead9e8] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => void handleCreateManualBooking()}
                    disabled={
                      creatingBooking ||
                      !manualBooking.clientId ||
                      !manualBooking.professionalId ||
                      !manualBooking.scheduledAt
                    }
                    className="w-full rounded-full bg-[#2b2b2b] px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {creatingBooking ? "Creating..." : "Create free booking"}
                  </button>
                </div>
              </div>
              <div className="rounded-[22px] bg-[#f7f5f4] p-5">
                <UserPlus className="h-5 w-5 text-[#f56969]" />
                <p className="mt-3 font-semibold text-[#2b2b2b]">Add new employee</p>
                <div className="mt-4 space-y-3">
                  <input
                    value={newProfessional.name}
                    onChange={(event) =>
                      setNewProfessional((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Full name"
                    className="w-full rounded-[16px] border border-[#ead9e8] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none"
                  />
                  <input
                    value={newProfessional.email}
                    onChange={(event) =>
                      setNewProfessional((current) => ({ ...current, email: event.target.value }))
                    }
                    placeholder="Email"
                    className="w-full rounded-[16px] border border-[#ead9e8] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none"
                  />
                  <input
                    value={newProfessional.password}
                    onChange={(event) =>
                      setNewProfessional((current) => ({ ...current, password: event.target.value }))
                    }
                    placeholder="Temporary password"
                    className="w-full rounded-[16px] border border-[#ead9e8] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none"
                  />
                  <input
                    value={newProfessional.phone}
                    onChange={(event) =>
                      setNewProfessional((current) => ({ ...current, phone: event.target.value }))
                    }
                    placeholder="Phone"
                    className="w-full rounded-[16px] border border-[#ead9e8] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none"
                  />
                  <label className="block text-sm text-[#7e7e7e]">
                    <span className="sr-only">Upload main profile picture</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        void handleNewProfessionalPhotoChange(event.target.files?.[0])
                      }
                      className="block w-full rounded-[16px] border border-[#ead9e8] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none file:mr-3 file:rounded-full file:border-0 file:bg-[#f7f5f4] file:px-3 file:py-2 file:text-sm file:font-medium"
                    />
                  </label>
                  <input
                    value={newProfessional.specialisation}
                    onChange={(event) =>
                      setNewProfessional((current) => ({
                        ...current,
                        specialisation: event.target.value,
                      }))
                    }
                    placeholder="Specialisation"
                    className="w-full rounded-[16px] border border-[#ead9e8] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={newProfessional.serviceCategory}
                      onChange={(event) =>
                        setNewProfessional((current) => ({
                          ...current,
                          serviceCategory: event.target.value,
                        }))
                      }
                      className="rounded-[16px] border border-[#ead9e8] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none"
                    >
                      <option value="therapist">Mental Wellness</option>
                      <option value="doctor">Medical Consultation</option>
                      <option value="legal">Legal Guidance</option>
                      <option value="wellness">Wellness Programs</option>
                    </select>
                    <input
                      value={newProfessional.sessionPrice}
                      onChange={(event) =>
                        setNewProfessional((current) => ({
                          ...current,
                          sessionPrice: event.target.value,
                        }))
                      }
                      placeholder="Session price"
                      className="rounded-[16px] border border-[#ead9e8] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleCreateProfessional()}
                    disabled={creatingProfessional}
                    className="w-full rounded-full bg-[#2b2b2b] px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {creatingProfessional ? "Creating..." : "Create professional"}
                  </button>
                </div>
              </div>
              {[
                {
                  icon: ArrowRightLeft,
                  title: "Assign to services",
                  text: "Move professionals between the four care verticals directly from the employee roster.",
                },
                {
                  icon: IndianRupee,
                  title: "Create free bookings",
                  text: "Manual admin bookings are temporarily set to zero cost for testing and are confirmed immediately.",
                },
                {
                  icon: BellRing,
                  title: "Notify teams",
                  text: "Coordinate onboarding reminders, schedule changes, and important platform updates.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[22px] bg-[#f7f5f4] p-5">
                  <item.icon className="h-5 w-5 text-[#f56969]" />
                  <p className="mt-3 font-semibold text-[#2b2b2b]">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#7e7e7e]">{item.text}</p>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Service assignment board" className="lg:col-span-6" eyebrow="Coverage">
            <div className="space-y-4">
              {serviceCoverage.map((service) => (
                <div key={service.category} className="rounded-[22px] bg-[#f7f5f4] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#2b2b2b]">{service.label}</p>
                      <p className="mt-1 text-sm text-[#7e7e7e]">
                        {service.count} professionals currently assigned
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#f56969]">
                      Active roster
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.members.length ? (
                      service.members.map((member) => (
                        <span
                          key={member.name}
                          className="rounded-full bg-white px-3 py-2 text-xs font-medium text-[#2b2b2b]"
                        >
                          {member.name}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-full bg-white px-3 py-2 text-xs font-medium text-[#7e7e7e]">
                        No team assigned yet
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          <div id="admin-bookings" className="lg:col-span-6">
            <DashboardCard title="Bookings, payments, and appointments" eyebrow="Queue">
            {upcomingAppointments.length ? (
              <div className="space-y-4">
                {upcomingAppointments.map((booking) => {
                  const professionalName =
                    typeof booking.professionalId === "object"
                      ? booking.professionalId?.name || "Assigned professional"
                      : "Assigned professional";
                  const clientName =
                    typeof booking.clientId === "object"
                      ? booking.clientId?.name || "Client"
                      : "Client";

                  return (
                    <div key={booking._id} className="rounded-[22px] bg-[#f7f5f4] p-5">
                      <div
                        onClick={() => setSelectedBookingId(booking._id)}
                        className="flex cursor-pointer flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div>
                          <p className="text-lg font-semibold text-[#2b2b2b]">{professionalName}</p>
                          <p className="mt-1 text-sm text-[#7e7e7e]">
                            Client: {clientName}
                          </p>
                          <p className="mt-1 text-sm text-[#7e7e7e]">
                            {formatDateTime(booking.scheduledAt)}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="rounded-full bg-white px-3 py-1 font-medium capitalize text-[#f56969]">
                            {booking.status}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 font-medium text-[#2b2b2b]">
                            {booking.paymentStatus || "payment pending"}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 font-medium text-[#2b2b2b]">
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
                title="No live queue yet"
                description="As bookings grow, this queue will become the place where admin tracks appointment status, payment follow-up, and professional assignment in one glance."
              />
            )}
            </DashboardCard>
          </div>

          <div id="admin-finance" className="lg:col-span-12">
              <DashboardCard
              title={selectedBooking ? "Booking detail panel" : "Finance and governance"}
              eyebrow={selectedBooking ? "Selected booking" : "Leadership"}
            >
            {selectedBooking ? (
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
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
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#2b2b2b]">
                      {formatInr(selectedBooking.totalAmount || 0)}
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
                        {actionBookingId === selectedBooking._id ? "Updating..." : "Confirm booking"}
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
                    {["confirmed", "completed"].includes(selectedBooking.status) ? (
                      <Link
                        href={`/consultation/${selectedBooking._id}`}
                        className="rounded-full border border-[#ead9e8] px-4 py-2 text-xs font-medium text-[#2b2b2b]"
                      >
                        Open session room
                      </Link>
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
            ) : null}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  icon: CreditCard,
                  title: "Gross booking value",
                  value: formatInr(financeSnapshot.gross),
                  note: "Total client amount across the filtered payment log.",
                },
                {
                  icon: IndianRupee,
                  title: "Professional payouts",
                  value: formatInr(financeSnapshot.professional),
                  note: "75% share after GST is removed from each filtered order.",
                },
                {
                  icon: ChartColumnIncreasing,
                  title: "THK earnings",
                  value: formatInr(financeSnapshot.platform),
                  note: "25% share after GST deduction across filtered orders.",
                },
                {
                  icon: Shield,
                  title: "GST collected",
                  value: formatInr(financeSnapshot.gst),
                  note: "Tax amount separated before the 25/75 platform split.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[22px] bg-[#f7f5f4] p-5">
                  <item.icon className="h-5 w-5 text-[#f56969]" />
                  <p className="mt-3 text-sm text-[#7e7e7e]">{item.title}</p>
                  <p className="mt-3 text-2xl font-bold text-[#2b2b2b]">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-[#7e7e7e]">{item.note}</p>
                </div>
              ))}
              </div>
              <div className="mt-6 rounded-[22px] bg-[#f7f5f4] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#2b2b2b]">Payment split log</p>
                    <p className="mt-1 text-sm text-[#7e7e7e]">
                      GST is separated first, then the remaining base amount is split 25% to The
                      Hyphen Konnect and 75% to the professional for every order.
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <label className="text-sm text-[#7e7e7e]">
                      From
                      <input
                        type="date"
                        value={financeDateFrom}
                        onChange={(event) => setFinanceDateFrom(event.target.value)}
                        className="mt-2 w-full rounded-[14px] border border-[#ead9e8] bg-white px-4 py-2.5 text-[#2b2b2b] outline-none"
                      />
                    </label>
                    <label className="text-sm text-[#7e7e7e]">
                      To
                      <input
                        type="date"
                        value={financeDateTo}
                        onChange={(event) => setFinanceDateTo(event.target.value)}
                        className="mt-2 w-full rounded-[14px] border border-[#ead9e8] bg-white px-4 py-2.5 text-[#2b2b2b] outline-none"
                      />
                    </label>
                    <label className="text-sm text-[#7e7e7e]">
                      Sort
                      <select
                        value={financeSort}
                        onChange={(event) =>
                          setFinanceSort(
                            event.target.value as "newest" | "oldest" | "highest" | "lowest",
                          )
                        }
                        className="mt-2 w-full rounded-[14px] border border-[#ead9e8] bg-white px-4 py-2.5 text-[#2b2b2b] outline-none"
                      >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="highest">Highest amount</option>
                        <option value="lowest">Lowest amount</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {financeBookings.length ? (
                    financeBookings.map((booking) => {
                      const professionalName =
                        typeof booking.professionalId === "object"
                          ? booking.professionalId?.name || "Assigned professional"
                          : "Assigned professional";
                      const clientName =
                        typeof booking.clientId === "object"
                          ? booking.clientId?.name || "Client"
                          : "Client";

                      return (
                        <div key={booking._id} className="rounded-[18px] bg-white p-4">
                          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                            <div>
                              <p className="font-semibold text-[#2b2b2b]">
                                {professionalName} with {clientName}
                              </p>
                              <p className="mt-1 text-sm text-[#7e7e7e]">
                                {formatDateTime(booking.scheduledAt)}
                              </p>
                              <p className="mt-1 text-sm text-[#7e7e7e]">
                                Status: {booking.status} | Payment:{" "}
                                {booking.paymentStatus || "payment pending"}
                              </p>
                            </div>
                            <div className="grid gap-2 text-sm text-[#7e7e7e] sm:grid-cols-2 xl:grid-cols-5">
                              <div>
                                <p className="uppercase tracking-[0.16em]">Client paid</p>
                                <p className="mt-1 font-semibold text-[#2b2b2b]">
                                  {formatInr(booking.totalAmount || 0)}
                                </p>
                              </div>
                              <div>
                                <p className="uppercase tracking-[0.16em]">GST</p>
                                <p className="mt-1 font-semibold text-[#2b2b2b]">
                                  {formatInr(booking.gstAmount || 0)}
                                </p>
                              </div>
                              <div>
                                <p className="uppercase tracking-[0.16em]">After GST</p>
                                <p className="mt-1 font-semibold text-[#2b2b2b]">
                                  {formatInr(booking.basePrice || 0)}
                                </p>
                              </div>
                              <div>
                                <p className="uppercase tracking-[0.16em]">THK 25%</p>
                                <p className="mt-1 font-semibold text-[#2b2b2b]">
                                  {formatInr(booking.platformCommission || 0)}
                                </p>
                              </div>
                              <div>
                                <p className="uppercase tracking-[0.16em]">Professional 75%</p>
                                <p className="mt-1 font-semibold text-[#2b2b2b]">
                                  {formatInr(booking.professionalFee || 0)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <EmptyState
                      title="No payment records in this range"
                      description="Try widening the date range to inspect more order splits."
                    />
                  )}
                </div>
              </div>
            </DashboardCard>
          </div>

          <div id="admin-history" className="lg:col-span-12">
            <DashboardCard title="Past and completed bookings" eyebrow="History">
            {completedBookings.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {completedBookings.slice(0, 8).map((booking) => {
                  const professionalName =
                    typeof booking.professionalId === "object"
                      ? booking.professionalId?.name || "Assigned professional"
                      : "Assigned professional";
                  const clientName =
                    typeof booking.clientId === "object"
                      ? booking.clientId?.name || "Client"
                      : "Client";

                  return (
                    <div key={booking._id} className="rounded-[22px] bg-[#f7f5f4] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#2b2b2b]">{professionalName}</p>
                          <p className="mt-1 text-sm text-[#7e7e7e]">Client: {clientName}</p>
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
                title="No completed bookings yet"
                description="Completed or cancelled bookings will appear here as your live operations history grows."
              />
            )}
          </DashboardCard>
          </div>
              </DashboardGrid>
            </section>
          </div>
        </div>
      </DashboardShell>
    </ProtectedRoute>
  );
}
