"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, CalendarClock, Clock, IndianRupee, UserRound } from "lucide-react";
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
import { DashboardChatPanel } from "./DashboardChatPanel";
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
  basePrice?: number;
  gstAmount?: number;
  totalAmount?: number;
  platformCommission?: number;
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

type SpecialDateEntry = {
  date: string;
  type: "special_hours" | "off_day" | "emergency_leave";
  start: string;
  end: string;
  note: string;
};

const weekdayLabels = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type DaySlot = { start: string; end: string; confirmed?: boolean };
type DayAvailability = { start: string; end: string; slots: DaySlot[] };

function normaliseDayWindow(slot?: {
  start?: string;
  end?: string;
  slots?: DaySlot[];
}) {
  const baseSlots =
    Array.isArray(slot?.slots) && slot?.slots.length
      ? slot!.slots.map((item) => ({ ...item, confirmed: true }))
      : slot?.start && slot?.end
        ? [{ start: slot.start, end: slot.end, confirmed: true }]
        : [];
  return {
    start: slot?.start || "",
    end: slot?.end || "",
    slots: baseSlots,
  };
}

function isSlotValid(slot: DaySlot, minStart?: string) {
  if (!slot.start || !slot.end) return false;
  if (minStart && slot.start < minStart) return false;
  return slot.end > slot.start;
}

function addMinutesToTime(value: string, minutes: number) {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return "";
  const total = hour * 60 + minute + minutes;
  if (total < 0 || total > 24 * 60 - 1) return "";
  const nextHour = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const nextMinute = (total % 60).toString().padStart(2, "0");
  return `${nextHour}:${nextMinute}`;
}

function getMinEndTime(start: string, extraMinutes = 30) {
  return start ? addMinutesToTime(start, extraMinutes) : "";
}

function getMaxStartTime(minDurationMinutes = 30) {
  return addMinutesToTime("23:59", -minDurationMinutes) || "23:29";
}


function buildBlockedDateRange(start: string, end: string) {
  if (!start || !end) return [];
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return [];
  }
  const forward = startDate.getTime() <= endDate.getTime();
  const from = forward ? startDate : endDate;
  const to = forward ? endDate : startDate;
  const days: string[] = [];
  const cursor = new Date(from.getTime());
  while (cursor.getTime() <= to.getTime()) {
    const year = cursor.getFullYear();
    const month = String(cursor.getMonth() + 1).padStart(2, "0");
    const day = String(cursor.getDate()).padStart(2, "0");
    days.push(`${year}-${month}-${day}`);
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function timeToMinutes(value: string) {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return hour * 60 + minute;
}

function toTimeLabel(value: string) {
  return value || "--:--";
}

function CustomTimePicker({
  value,
  onChange,
  min,
  max,
  disabled = false,
  placeholder = "--:--",
}: {
  value: string;
  onChange: (nextValue: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [tempHour, setTempHour] = useState<string>("");
  const [tempMinute, setTempMinute] = useState<string>("");

  const minMinutes = min ? timeToMinutes(min) : null;
  const maxMinutes = max ? timeToMinutes(max) : null;

  const syncTempTime = (nextOpen: boolean) => {
    if (!nextOpen) return;
    if (value) {
      const [hourText, minuteText] = value.split(":");
      setTempHour(hourText || "");
      setTempMinute(minuteText || "");
    } else {
      setTempHour("");
      setTempMinute("");
    }
  };

  const isCandidateValid = (hour: string, minute: string) => {
    const candidate = timeToMinutes(`${hour}:${minute}`);
    if (candidate === null) return false;
    if (minMinutes !== null && candidate < minMinutes) return false;
    if (maxMinutes !== null && candidate > maxMinutes) return false;
    return true;
  };

  const hours = Array.from({ length: 24 }, (_, idx) =>
    String(idx).padStart(2, "0"),
  );
  const minutes = Array.from({ length: 60 }, (_, idx) =>
    String(idx).padStart(2, "0"),
  );

  const canConfirm =
    Boolean(tempHour && tempMinute) && isCandidateValid(tempHour, tempMinute);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          setOpen((current) => {
            const nextOpen = !current;
            syncTempTime(nextOpen);
            return nextOpen;
          })
        }
        className="flex w-full items-center justify-between rounded-[14px] border border-[#ead9e8] bg-white px-3 py-2 text-sm text-[#2b2b2b] outline-none disabled:bg-[#f7f5f4] disabled:text-[#9b9b9b]"
      >
        <span>{value ? toTimeLabel(value) : placeholder}</span>
        <Clock className="h-4 w-4 text-[#7e7e7e]" />
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-[220px] rounded-[16px] border border-[#ead9e8] bg-white p-3 shadow-lg">
          <div className="grid grid-cols-2 gap-3">
            <div className="max-h-[180px] overflow-y-auto rounded-[12px] border border-[#f1e6ef]">
              {hours.map((hour) => {
                const hasValidMinute = minutes.some((minute) =>
                  isCandidateValid(hour, minute),
                );
                const isSelected = tempHour === hour;
                return (
                  <button
                    key={hour}
                    type="button"
                    disabled={!hasValidMinute}
                    onClick={() => {
                      setTempHour(hour);
                      if (tempMinute && !isCandidateValid(hour, tempMinute)) {
                        setTempMinute("");
                      }
                    }}
                    className={`flex w-full items-center justify-center px-3 py-2 text-sm font-medium ${
                      isSelected
                        ? "bg-[#f56969] text-white"
                        : "text-[#2b2b2b]"
                    } disabled:text-[#c1b8be]`}
                  >
                    {hour}
                  </button>
                );
              })}
            </div>
            <div className="max-h-[180px] overflow-y-auto rounded-[12px] border border-[#f1e6ef]">
              {minutes.map((minute) => {
                const isSelected = tempMinute === minute;
                const isDisabled = !tempHour || !isCandidateValid(tempHour, minute);
                return (
                  <button
                    key={minute}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setTempMinute(minute)}
                    className={`flex w-full items-center justify-center px-3 py-2 text-sm font-medium ${
                      isSelected
                        ? "bg-[#f56969] text-white"
                        : "text-[#2b2b2b]"
                    } disabled:text-[#c1b8be]`}
                  >
                    {minute}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-[#ead9e8] px-3 py-1.5 text-xs font-semibold text-[#2b2b2b]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canConfirm}
              onClick={() => {
                if (!canConfirm) return;
                onChange(`${tempHour}:${tempMinute}`);
                setOpen(false);
              }}
              className="rounded-full bg-[#f56969] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
            >
              Confirm
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ProfessionalDashboard() {
  const { user, refreshSession } = useAuth();
  const [bookings, setBookings] = useState<ProfessionalBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [earningsDateFrom, setEarningsDateFrom] = useState("");
  const [earningsDateTo, setEarningsDateTo] = useState("");
  const [earningsSort, setEarningsSort] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [actionBookingId, setActionBookingId] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    bio: "",
    specialisation: "",
    serviceCategory: "therapist",
    yearsExperience: "",
    sessionPrice: "",
    qualifications: "",
    expertise: "",
  });
  const [availabilityForm, setAvailabilityForm] = useState<
    Record<(typeof weekdayLabels)[number], DayAvailability>
  >({
    monday: { start: "", end: "", slots: [] },
    tuesday: { start: "", end: "", slots: [] },
    wednesday: { start: "", end: "", slots: [] },
    thursday: { start: "", end: "", slots: [] },
    friday: { start: "", end: "", slots: [] },
    saturday: { start: "", end: "", slots: [] },
    sunday: { start: "", end: "", slots: [] },
  });
  const [blockedDateStart, setBlockedDateStart] = useState("");
  const [blockedDateEnd, setBlockedDateEnd] = useState("");
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [specialDateForm, setSpecialDateForm] = useState<SpecialDateEntry>({
    date: "",
    type: "off_day",
    start: "",
    end: "",
    note: "",
  });
  const [specialDates, setSpecialDates] = useState<SpecialDateEntry[]>([]);
  const [holidayFlashDay, setHolidayFlashDay] = useState<
    (typeof weekdayLabels)[number] | null
  >(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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

  useEffect(() => {
    if (!user) return;

    setProfileForm({
      name: user.name || "",
      phone: user.phone || "",
      bio: user.profile?.bio || "",
      specialisation: user.profile?.specialisation || "",
      serviceCategory: user.profile?.serviceCategory || "therapist",
      yearsExperience:
        typeof user.profile?.yearsExperience === "number"
          ? String(user.profile.yearsExperience)
          : "",
      sessionPrice:
        typeof user.profile?.sessionPrice === "number"
          ? String(user.profile.sessionPrice)
          : "",
      qualifications: (user.profile?.qualifications || []).join(", "),
      expertise: (user.profile?.expertise || []).join(", "),
    });

    setAvailabilityForm({
      monday: normaliseDayWindow(user.availability?.workingHours?.monday),
      tuesday: normaliseDayWindow(user.availability?.workingHours?.tuesday),
      wednesday: normaliseDayWindow(user.availability?.workingHours?.wednesday),
      thursday: normaliseDayWindow(user.availability?.workingHours?.thursday),
      friday: normaliseDayWindow(user.availability?.workingHours?.friday),
      saturday: normaliseDayWindow(user.availability?.workingHours?.saturday),
      sunday: normaliseDayWindow(user.availability?.workingHours?.sunday),
    });
    setBlockedDates(user.availability?.blockedDates || []);
    setSpecialDates(
      (user.availability?.specialDates || []).map((entry) => ({
        date: entry.date ? entry.date.slice(0, 10) : "",
        type: entry.type || "off_day",
        start: entry.start || "",
        end: entry.end || "",
        note: entry.note || "",
      })),
    );
  }, [user]);

  const refreshBookings = async () => {
    const response = await apiFetch("/api/bookings");
    const data = await parseJsonResponse<ProfessionalBooking[]>(response);
    setBookings(data);
  };

  const handleBookingAction = async (
    bookingId: string,
    action: "confirm" | "complete" | "cancel",
  ) => {
    try {
      setActionBookingId(bookingId);
      setError(null);
      const response = await apiFetch(
        `/api/bookings/${bookingId}/${action === "cancel" ? "cancel" : action}`,
        {
          method: "PATCH",
          body:
            action === "confirm"
              ? JSON.stringify({ paymentMethod: "manual" })
              : action === "cancel"
                ? JSON.stringify({ reason: "Cancelled by professional" })
                : undefined,
        },
      );
      await parseJsonResponse(response);
      await refreshBookings();
      setSuccessMessage(
        action === "confirm"
          ? "Booking confirmed successfully."
          : action === "cancel"
            ? "Booking cancelled successfully."
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

  const handleProfileSave = async () => {
    try {
      setSavingProfile(true);
      setError(null);
      const workingHoursPayload = weekdayLabels.reduce(
        (acc, day) => {
          const entry = availabilityForm[day];
          const cleanedSlots = entry.slots.filter(
            (slot) => slot.start && slot.end,
          );
          acc[day] = cleanedSlots.length
            ? {
                start: entry.start || cleanedSlots[0].start,
                end: entry.end || cleanedSlots[cleanedSlots.length - 1].end,
                slots: cleanedSlots.map(({ start, end }) => ({ start, end })),
              }
            : { start: entry.start, end: entry.end };
          return acc;
        },
        {} as Record<
          (typeof weekdayLabels)[number],
          { start: string; end: string; slots?: DaySlot[] }
        >,
      );
      const response = await apiFetch("/api/auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: profileForm.name,
          phone: profileForm.phone,
          profile: {
            bio: profileForm.bio,
            specialisation: profileForm.specialisation,
            serviceCategory: profileForm.serviceCategory,
            yearsExperience: profileForm.yearsExperience
              ? Number(profileForm.yearsExperience)
              : undefined,
            sessionPrice: profileForm.sessionPrice
              ? Number(profileForm.sessionPrice)
              : undefined,
            qualifications: profileForm.qualifications
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            expertise: profileForm.expertise
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          },
          availability: {
            timezone: "Asia/Kolkata",
            workingHours: workingHoursPayload,
            blockedDates,
            specialDates,
          },
        }),
      });
      await parseJsonResponse(response);
      await refreshSession();
      setSuccessMessage("Profile and availability updated successfully.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "We could not save your profile right now.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setChangingPassword(true);
      setError(null);

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error("New password and confirmation do not match.");
      }

      const response = await apiFetch("/api/auth/change-password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await parseJsonResponse<{ message: string }>(response);
      setSuccessMessage(data.message);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (passwordError) {
      setError(
        passwordError instanceof Error
          ? passwordError.message
          : "We could not change your password right now.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const upcoming = useMemo(
    () => bookings.filter((item) => ["pending", "confirmed", "active"].includes(item.status)),
    [bookings],
  );

  const earningsBookings = useMemo(() => {
    const filtered = bookings.filter((booking) =>
      isWithinDateRange(booking.scheduledAt, earningsDateFrom, earningsDateTo),
    );

    return filtered.sort((first, second) => {
      if (earningsSort === "oldest") {
        return new Date(first.scheduledAt).getTime() - new Date(second.scheduledAt).getTime();
      }
      if (earningsSort === "highest") {
        return (second.professionalFee || 0) - (first.professionalFee || 0);
      }
      if (earningsSort === "lowest") {
        return (first.professionalFee || 0) - (second.professionalFee || 0);
      }
      return new Date(second.scheduledAt).getTime() - new Date(first.scheduledAt).getTime();
    });
  }, [bookings, earningsDateFrom, earningsDateTo, earningsSort]);

  const earningsSnapshot = useMemo(() => {
    const gross = earningsBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    const gst = earningsBookings.reduce((sum, booking) => sum + (booking.gstAmount || 0), 0);
    const base = earningsBookings.reduce((sum, booking) => sum + (booking.basePrice || 0), 0);
    const platform = earningsBookings.reduce(
      (sum, booking) => sum + (booking.platformCommission || 0),
      0,
    );
    const professional = earningsBookings.reduce(
      (sum, booking) => sum + (booking.professionalFee || 0),
      0,
    );
    const captured = earningsBookings
      .filter((booking) => booking.paymentStatus === "captured")
      .reduce((sum, booking) => sum + (booking.professionalFee || 0), 0);

    return { gross, gst, base, platform, professional, captured };
  }, [earningsBookings]);

  const selectedBooking =
    upcoming.find((booking) => booking._id === selectedBookingId) ||
    upcoming[0] ||
    null;
  const completedBookings = useMemo(
    () => bookings.filter((item) => ["completed", "cancelled"].includes(item.status)),
    [bookings],
  );
  const canAddSpecialDate =
    Boolean(specialDateForm.date) &&
    (specialDateForm.type !== "special_hours" ||
      Boolean(specialDateForm.start && specialDateForm.end));

  return (
    <ProtectedRoute allowedRoles={["professional"]}>
      <DashboardShell
        accent="Professional Dashboard"
        title={user?.name || "Professional workspace"}
        description="Manage your profile, bookings, availability, and earnings in one place."
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
                value: formatInr(earningsSnapshot.professional),
                note: `Captured so far ${formatInr(earningsSnapshot.captured)}`,
              },
              {
                label: "Verification",
                value: user?.profile?.verified ? "Approved" : "Review",
                note: "Verification status is managed by the admin team.",
              },
              {
                label: "Specialization",
                value: user?.profile?.specialisation || "Pending",
                note: "Keep your public profile details current.",
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
                    {["pending", "confirmed"].includes(selectedBooking.status) ? (
                      <button
                        type="button"
                        onClick={() => void handleBookingAction(selectedBooking._id, "cancel")}
                        disabled={actionBookingId === selectedBooking._id}
                        className="rounded-full border border-[#ead9e8] px-4 py-2 text-xs font-medium text-[#2b2b2b] disabled:opacity-50"
                      >
                        {actionBookingId === selectedBooking._id ? "Updating..." : "Cancel booking"}
                      </button>
                    ) : null}
                    {["pending", "confirmed"].includes(selectedBooking.status) ? (
                      <Link
                        href={`/booking?bookingId=${selectedBooking._id}`}
                        className="rounded-full border border-[#ead9e8] px-4 py-2 text-xs font-medium text-[#2b2b2b]"
                      >
                        Reschedule
                      </Link>
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
                        Join session room
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
                    text: "Keep your bio, specialisation, and qualifications updated for clients.",
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

          <DashboardCard
            title="Payment split log"
            className="lg:col-span-12"
            eyebrow="Earnings"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#2b2b2b]">Your payout breakdown</p>
                <p className="mt-1 text-sm text-[#7e7e7e]">
                  GST is deducted first. From the remaining base amount, The Hyphen Konnect keeps
                  25% and you receive 75% for each order.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <label className="text-sm text-[#7e7e7e]">
                  From
                  <input
                    type="date"
                    value={earningsDateFrom}
                    onChange={(event) => setEarningsDateFrom(event.target.value)}
                    className="mt-2 w-full rounded-[14px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-2.5 text-[#2b2b2b] outline-none"
                  />
                </label>
                <label className="text-sm text-[#7e7e7e]">
                  To
                  <input
                    type="date"
                    value={earningsDateTo}
                    onChange={(event) => setEarningsDateTo(event.target.value)}
                    className="mt-2 w-full rounded-[14px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-2.5 text-[#2b2b2b] outline-none"
                  />
                </label>
                <label className="text-sm text-[#7e7e7e]">
                  Sort
                  <select
                    value={earningsSort}
                    onChange={(event) =>
                      setEarningsSort(
                        event.target.value as "newest" | "oldest" | "highest" | "lowest",
                      )
                    }
                    className="mt-2 w-full rounded-[14px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-2.5 text-[#2b2b2b] outline-none"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="highest">Highest payout</option>
                    <option value="lowest">Lowest payout</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {[
                {
                  label: "Client paid",
                  value: formatInr(earningsSnapshot.gross),
                },
                {
                  label: "GST deducted",
                  value: formatInr(earningsSnapshot.gst),
                },
                {
                  label: "After GST",
                  value: formatInr(earningsSnapshot.base),
                },
                {
                  label: "THK 25%",
                  value: formatInr(earningsSnapshot.platform),
                },
                {
                  label: "Your total earnings",
                  value: formatInr(earningsSnapshot.professional),
                },
              ].map((item) => (
                <div key={item.label} className="rounded-[18px] bg-[#f7f5f4] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7e7e7e]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#2b2b2b]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {earningsBookings.length ? (
                earningsBookings.map((booking) => {
                  const clientName =
                    typeof booking.clientId === "object"
                      ? booking.clientId?.name || "Client"
                      : "Client";

                  return (
                    <div key={booking._id} className="rounded-[18px] bg-[#f7f5f4] p-4">
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div>
                          <p className="font-semibold text-[#2b2b2b]">{clientName}</p>
                          <p className="mt-1 text-sm text-[#7e7e7e]">
                            {getServiceLabel(booking.serviceId)}
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
                            <p className="uppercase tracking-[0.16em]">Your 75%</p>
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
                  description="Try widening the date range to inspect your payout history."
                />
              )}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Profile editor"
            className="lg:col-span-7"
            eyebrow="Self management"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-[#7e7e7e]">
                Display name
                <input
                  value={profileForm.name}
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, name: event.target.value }))
                  }
                  className="mt-2 w-full rounded-[16px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 text-[#2b2b2b] outline-none"
                />
              </label>
              <label className="text-sm text-[#7e7e7e]">
                Phone
                <input
                  value={profileForm.phone}
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, phone: event.target.value }))
                  }
                  className="mt-2 w-full rounded-[16px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 text-[#2b2b2b] outline-none"
                />
              </label>
              <label className="text-sm text-[#7e7e7e]">
                Specialisation
                <input
                  value={profileForm.specialisation}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      specialisation: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-[16px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 text-[#2b2b2b] outline-none"
                />
              </label>
              <label className="text-sm text-[#7e7e7e]">
                Service line
                <select
                  value={profileForm.serviceCategory}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      serviceCategory: event.target.value as
                        | "therapist"
                        | "doctor"
                        | "legal"
                        | "wellness",
                    }))
                  }
                  className="mt-2 w-full rounded-[16px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 text-[#2b2b2b] outline-none"
                >
                  <option value="therapist">Mental Wellness</option>
                  <option value="doctor">Medical Consultation</option>
                  <option value="legal">Legal Guidance</option>
                  <option value="wellness">Wellness Programs</option>
                </select>
              </label>
              <label className="text-sm text-[#7e7e7e]">
                Years of experience
                <input
                  value={profileForm.yearsExperience}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      yearsExperience: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-[16px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 text-[#2b2b2b] outline-none"
                />
              </label>
              <label className="text-sm text-[#7e7e7e]">
                Session price (INR)
                <input
                  value={profileForm.sessionPrice}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      sessionPrice: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-[16px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 text-[#2b2b2b] outline-none"
                />
              </label>
              <label className="text-sm text-[#7e7e7e] md:col-span-2">
                Qualifications
                <input
                  value={profileForm.qualifications}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      qualifications: event.target.value,
                    }))
                  }
                  placeholder="Comma separated qualifications"
                  className="mt-2 w-full rounded-[16px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 text-[#2b2b2b] outline-none"
                />
              </label>
              <label className="text-sm text-[#7e7e7e] md:col-span-2">
                Areas of expertise
                <input
                  value={profileForm.expertise}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      expertise: event.target.value,
                    }))
                  }
                  placeholder="Comma separated expertise"
                  className="mt-2 w-full rounded-[16px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 text-[#2b2b2b] outline-none"
                />
              </label>
              <label className="text-sm text-[#7e7e7e] md:col-span-2">
                Bio
                <textarea
                  value={profileForm.bio}
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, bio: event.target.value }))
                  }
                  rows={5}
                  className="mt-2 w-full rounded-[16px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 text-[#2b2b2b] outline-none"
                />
              </label>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Availability manager"
            className="lg:col-span-5"
            eyebrow="Calendar setup"
          >
            <div className="space-y-4">
              {weekdayLabels.map((day) => (
                <div
                  key={day}
                  className={`rounded-[20px] p-4 ${
                    availabilityForm[day].slots.length === 0
                      ? "border border-[#f5c2c7] bg-[#fff7f7]"
                      : "bg-[#f7f5f4]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold capitalize text-[#2b2b2b]">{day}</p>
                    {availabilityForm[day].slots.length === 0 ? (
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#f56969]">
                        Holiday
                      </span>
                    ) : null}
                  </div>
                  {holidayFlashDay === day ? (
                    <p className="mt-2 text-xs font-medium text-[#f56969]">
                      Marked as holiday.
                    </p>
                  ) : null}
                  <div className="mt-3 space-y-3">
                    {(availabilityForm[day].slots.length
                      ? availabilityForm[day].slots
                      : [{ start: "", end: "", confirmed: false }]
                    ).map((slot, index) => {
                      const minStart =
                        index > 0
                          ? availabilityForm[day].slots[index - 1]?.end || ""
                          : "";
                      const maxStart = getMaxStartTime(30);
                      const minEnd = getMinEndTime(slot.start, 30);
                      const slotIsValid =
                        isSlotValid(slot, minStart || undefined) &&
                        (!minEnd || slot.end >= minEnd);
                      return (
                        <div
                          key={`${day}-slot-${index}`}
                          className="grid grid-cols-[1fr_1fr_auto] items-center gap-2"
                        >
                          <CustomTimePicker
                            value={slot.start}
                            min={minStart || undefined}
                            max={maxStart}
                            disabled={index > 0 && !minStart}
                            onChange={(nextValue) => {
                              const nextMinEnd = getMinEndTime(nextValue, 30);
                              setAvailabilityForm((current) => {
                                const nextSlots = current[day].slots.length
                                  ? current[day].slots.map((item, slotIndex) =>
                                      slotIndex === index
                                        ? {
                                            ...item,
                                            start: nextValue,
                                            confirmed: false,
                                            end:
                                              item.end &&
                                              nextMinEnd &&
                                              item.end <= nextMinEnd
                                                ? ""
                                                : item.end,
                                          }
                                        : item,
                                    )
                                  : [{ start: nextValue, end: "", confirmed: false }];
                                return {
                                  ...current,
                                  [day]: { ...current[day], slots: nextSlots },
                                };
                              });
                            }}
                          />
                          <CustomTimePicker
                            value={slot.end}
                            min={minEnd || undefined}
                            max="23:59"
                            disabled={!slot.start || !minEnd}
                            onChange={(nextValue) =>
                              setAvailabilityForm((current) => {
                                const nextSlots = current[day].slots.length
                                  ? current[day].slots.map((item, slotIndex) =>
                                      slotIndex === index
                                        ? { ...item, end: nextValue, confirmed: false }
                                        : item,
                                    )
                                  : [{ start: slot.start, end: nextValue, confirmed: false }];
                                return {
                                  ...current,
                                  [day]: { ...current[day], slots: nextSlots },
                                };
                              })
                            }
                          />
                          <div className="flex items-center gap-2">
                            {!slot.confirmed ? (
                              <button
                                type="button"
                                disabled={!slotIsValid}
                                onClick={() =>
                                  setAvailabilityForm((current) => {
                                    const nextSlots = current[day].slots.length
                                      ? current[day].slots.map((item, slotIndex) =>
                                          slotIndex === index
                                            ? { ...item, confirmed: true }
                                            : item,
                                        )
                                      : [{ ...slot, confirmed: true }];
                                    return {
                                      ...current,
                                      [day]: { ...current[day], slots: nextSlots },
                                    };
                                  })
                                }
                                className="rounded-full bg-[#f56969] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                              >
                                Confirm
                              </button>
                            ) : (
                              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#2b2b2b]">
                                Confirmed
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                setAvailabilityForm((current) => {
                                  const nextSlots = current[day].slots.filter(
                                    (_, slotIndex) => slotIndex !== index,
                                  );
                                  return {
                                    ...current,
                                    [day]: {
                                      ...current[day],
                                      slots: nextSlots,
                                      start: nextSlots.length ? current[day].start : "",
                                      end: nextSlots.length ? current[day].end : "",
                                    },
                                  };
                                })
                              }
                              className="rounded-full border border-[#ead9e8] bg-white px-3 py-1.5 text-xs font-medium text-[#2b2b2b]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setAvailabilityForm((current) => {
                          const entry = current[day];
                          const nextSlots = entry.slots.length
                            ? [...entry.slots, { start: "", end: "", confirmed: false }]
                            : entry.start || entry.end
                              ? [
                                  { start: entry.start, end: entry.end, confirmed: true },
                                  { start: "", end: "", confirmed: false },
                                ]
                              : [{ start: "", end: "", confirmed: false }];
                          return {
                            ...current,
                            [day]: { ...entry, slots: nextSlots },
                          };
                        })
                      }
                      className="rounded-full border border-[#2b2b2b] bg-white px-3 py-1.5 text-xs font-semibold text-[#2b2b2b]"
                    >
                      Add time window
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAvailabilityForm((current) => ({
                          ...current,
                          [day]: { start: "", end: "", slots: [] },
                        }));
                        setHolidayFlashDay(day);
                        setTimeout(() => {
                          setHolidayFlashDay((current) => (current === day ? null : current));
                        }, 2200);
                      }}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        !availabilityForm[day].start &&
                        !availabilityForm[day].end &&
                        availabilityForm[day].slots.length === 0
                          ? "bg-[#f56969] text-white"
                          : "border border-[#ead9e8] bg-white text-[#2b2b2b]"
                      }`}
                    >
                      Mark holiday
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAvailabilityForm((current) => ({
                          ...current,
                          [day]: { start: "09:00", end: "17:00", slots: [] },
                        }))
                      }
                      className="rounded-full border border-[#ead9e8] bg-white px-3 py-1.5 text-xs font-medium text-[#2b2b2b]"
                    >
                      Use 9:00-17:00
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-[#7e7e7e]">
                    Add one or more windows to allow breaks between sessions.
                  </p>
                </div>
              ))}

              <div className="rounded-[20px] bg-[#f7f5f4] p-4">
                <p className="text-sm font-semibold text-[#2b2b2b]">Blocked dates</p>
                <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    type="date"
                    value={blockedDateStart}
                    onChange={(event) => setBlockedDateStart(event.target.value)}
                    className="rounded-[14px] border border-[#ead9e8] bg-white px-3 py-2 text-sm text-[#2b2b2b] outline-none"
                  />
                  <input
                    type="date"
                    value={blockedDateEnd}
                    min={blockedDateStart || undefined}
                    onChange={(event) => setBlockedDateEnd(event.target.value)}
                    className="rounded-[14px] border border-[#ead9e8] bg-white px-3 py-2 text-sm text-[#2b2b2b] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const range = buildBlockedDateRange(
                        blockedDateStart,
                        blockedDateEnd || blockedDateStart,
                      );
                      if (!range.length) return;
                      setBlockedDates((current) =>
                        Array.from(new Set([...current, ...range])).sort(),
                      );
                      setBlockedDateStart("");
                      setBlockedDateEnd("");
                    }}
                    className="rounded-full bg-[#2b2b2b] px-4 py-2 text-sm font-medium text-white"
                  >
                    Block range
                  </button>
                </div>
                <p className="mt-2 text-xs text-[#7e7e7e]">
                  Select a start and end date to block the full interval.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {blockedDates.length ? (
                    blockedDates.map((date) => (
                      <button
                        key={date}
                        type="button"
                        onClick={() =>
                          setBlockedDates((current) => current.filter((item) => item !== date))
                        }
                        className="rounded-full bg-white px-3 py-2 text-xs font-medium text-[#2b2b2b]"
                      >
                        {date} ×
                      </button>
                    ))
                  ) : (
                    <span className="text-sm text-[#7e7e7e]">
                      No blocked dates added yet.
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-[20px] bg-[#f7f5f4] p-4">
                <p className="text-sm font-semibold text-[#2b2b2b]">Special schedule changes</p>
                <p className="mt-2 text-sm leading-6 text-[#7e7e7e]">
                  Add one-off special hours, emergency leave, or a full off day to block or adjust a specific date quickly.
                </p>
                <div className="mt-4 grid gap-3">
                  <input
                    type="date"
                    value={specialDateForm.date}
                    onChange={(event) =>
                      setSpecialDateForm((current) => ({ ...current, date: event.target.value }))
                    }
                    className="rounded-[14px] border border-[#ead9e8] bg-white px-3 py-2 text-sm text-[#2b2b2b] outline-none"
                  />
                  <select
                    value={specialDateForm.type}
                    onChange={(event) =>
                      setSpecialDateForm((current) => ({
                        ...current,
                        type: event.target.value as SpecialDateEntry["type"],
                        start: event.target.value === "special_hours" ? current.start : "",
                        end: event.target.value === "special_hours" ? current.end : "",
                      }))
                    }
                    className="rounded-[14px] border border-[#ead9e8] bg-white px-3 py-2 text-sm text-[#2b2b2b] outline-none"
                  >
                    <option value="off_day">Off day</option>
                    <option value="emergency_leave">Emergency leave</option>
                    <option value="special_hours">Special hours</option>
                  </select>
                  {specialDateForm.type === "special_hours" ? (
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="time"
                        value={specialDateForm.start}
                        onChange={(event) =>
                          setSpecialDateForm((current) => ({
                            ...current,
                            start: event.target.value,
                          }))
                        }
                        className="rounded-[14px] border border-[#ead9e8] bg-white px-3 py-2 text-sm text-[#2b2b2b] outline-none"
                      />
                      <input
                        type="time"
                        value={specialDateForm.end}
                        onChange={(event) =>
                          setSpecialDateForm((current) => ({
                            ...current,
                            end: event.target.value,
                          }))
                        }
                        className="rounded-[14px] border border-[#ead9e8] bg-white px-3 py-2 text-sm text-[#2b2b2b] outline-none"
                      />
                    </div>
                  ) : null}
                  <input
                    value={specialDateForm.note}
                    onChange={(event) =>
                      setSpecialDateForm((current) => ({ ...current, note: event.target.value }))
                    }
                    placeholder="Optional note, e.g. conference, family emergency, shorter clinic window"
                    className="rounded-[14px] border border-[#ead9e8] bg-white px-3 py-2 text-sm text-[#2b2b2b] outline-none"
                  />
                  <button
                    type="button"
                    disabled={!canAddSpecialDate}
                    onClick={() => {
                      if (!canAddSpecialDate) return;
                      setSpecialDates((current) =>
                        [...current.filter((item) => item.date !== specialDateForm.date), specialDateForm]
                          .sort((left, right) => left.date.localeCompare(right.date)),
                      );
                      setSpecialDateForm({
                        date: "",
                        type: "off_day",
                        start: "",
                        end: "",
                        note: "",
                      });
                    }}
                    className="rounded-full bg-[#2b2b2b] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    Save special date
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {specialDates.length ? (
                    specialDates.map((entry) => (
                      <div key={`${entry.date}-${entry.type}`} className="rounded-[16px] bg-white p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[#2b2b2b]">{entry.date}</p>
                            <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#f56969]">
                              {entry.type.replace("_", " ")}
                            </p>
                            {entry.type === "special_hours" ? (
                              <p className="mt-2 text-sm text-[#7e7e7e]">
                                {entry.start} - {entry.end}
                              </p>
                            ) : null}
                            {entry.note ? (
                              <p className="mt-2 text-sm text-[#7e7e7e]">{entry.note}</p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setSpecialDates((current) =>
                                current.filter(
                                  (item) =>
                                    !(
                                      item.date === entry.date &&
                                      item.type === entry.type &&
                                      item.start === entry.start &&
                                      item.end === entry.end &&
                                      item.note === entry.note
                                    ),
                                ),
                              )
                            }
                            className="rounded-full border border-[#ead9e8] px-3 py-1.5 text-xs font-medium text-[#2b2b2b]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-[#7e7e7e]">
                      No special schedule changes added yet.
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#7e7e7e]">
                Availability updates are applied when you click Save profile and availability.
              </p>

              <button
                type="button"
                onClick={() => void handleProfileSave()}
                disabled={savingProfile}
                className="w-full rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {savingProfile ? "Saving..." : "Save profile and availability"}
              </button>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Password & security"
            className="lg:col-span-5"
            eyebrow="Account access"
          >
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[#7e7e7e]">
                Update your password here anytime to keep your professional account secure.
              </p>
              <label className="block text-sm text-[#7e7e7e]">
                Current password
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      currentPassword: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-[16px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 text-[#2b2b2b] outline-none"
                />
              </label>
              <label className="block text-sm text-[#7e7e7e]">
                New password
                <input
                  type="password"
                  minLength={6}
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      newPassword: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-[16px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 text-[#2b2b2b] outline-none"
                />
              </label>
              <label className="block text-sm text-[#7e7e7e]">
                Confirm new password
                <input
                  type="password"
                  minLength={6}
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({
                      ...current,
                      confirmPassword: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-[16px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 text-[#2b2b2b] outline-none"
                />
              </label>
              <button
                type="button"
                onClick={() => void handlePasswordChange()}
                disabled={changingPassword}
                className="w-full rounded-full bg-[#2b2b2b] px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {changingPassword ? "Updating password..." : "Update password"}
              </button>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Messages"
            className="lg:col-span-12"
            eyebrow="Client communication"
          >
            <DashboardChatPanel
              title="Session chats"
              description="Stay in touch with clients around confirmed bookings without moving the conversation outside the platform."
              emptyDescription="Client conversations will appear here once a booking chat is opened."
            />
          </DashboardCard>
        </DashboardGrid>
      </DashboardShell>
    </ProtectedRoute>
  );
}
