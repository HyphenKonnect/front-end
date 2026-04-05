"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import {
  mapBackendProfessionalToDirectory,
  professionals,
  serviceCatalog,
  type BackendProfessionalRecord,
  type DirectoryProfessional,
  type ProfessionalProfile,
} from "../../components/site/data";
import { apiFetch, parseJsonResponse } from "../../lib/api";
import { useAuth } from "../../components/auth/AuthProvider";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

type TimeRange = {
  startMinutes: number;
  endMinutes: number;
};

type AvailabilitySchedule = Record<number, TimeRange[]>;

type LiveAvailabilityResponse = {
  availability?: BackendProfessionalRecord["availability"];
  bookedSlots?: { start: string; end: string }[];
  professional?: BackendProfessionalRecord;
};

const localDirectory: DirectoryProfessional[] = professionals.map((professional) => ({
  id: professional.id,
  slug: professional.slug,
  name: professional.name,
  specialty: professional.specialty,
  category: professional.category,
  image: professional.image,
  rating: professional.rating,
  reviews: professional.reviews,
  experience: professional.experience,
  rate: professional.rate,
  available: professional.available,
  location: professional.location,
  workingHours: professional.workingHours,
  daysOff: professional.daysOff,
}));

export default function BookingPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const today = useMemo(() => startOfDay(new Date()), []);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState<string | number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [directory, setDirectory] = useState<DirectoryProfessional[]>(localDirectory);
  const [usingLiveData, setUsingLiveData] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<LiveAvailabilityResponse | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<{
    bookingId: string;
    scheduledAt: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProfessionals = async () => {
      try {
        const response = await apiFetch("/api/professionals");
        const data = await parseJsonResponse<BackendProfessionalRecord[]>(response);
        if (!Array.isArray(data) || cancelled) return;

        setDirectory(data.map(mapBackendProfessionalToDirectory));
        setUsingLiveData(true);
      } catch {
        // Keep local fallback data.
      }
    };

    void loadProfessionals();

    return () => {
      cancelled = true;
    };
  }, []);

  const professionalOptions = useMemo(() => {
    return directory.filter((item) => {
      if (!selectedService) return false;
      if (selectedService === "mental-wellness") return item.category === "therapist";
      if (selectedService === "medical-consultation") return item.category === "doctor";
      if (selectedService === "legal-guidance") return item.category === "legal";
      return item.category === "wellness";
    });
  }, [directory, selectedService]);

  const selectedPro = useMemo(
    () => professionalOptions.find((item) => item.id === selectedProfessional) ?? null,
    [professionalOptions, selectedProfessional],
  );

  const fallbackProfile = useMemo(() => {
    if (!selectedPro) return null;
    return (
      professionals.find(
        (item) => item.slug === selectedPro.slug || item.name === selectedPro.name,
      ) ?? null
    );
  }, [selectedPro]);

  const fallbackSchedule = useMemo(
    () => (fallbackProfile ? buildFallbackAvailabilitySchedule(fallbackProfile) : null),
    [fallbackProfile],
  );

  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);

  const availableSlots = useMemo(() => {
    if (!selectedDate || !selectedPro) return [];

    if (selectedPro.backendId && availabilityData?.availability) {
      return getLiveSlotsForDate(selectedDate, availabilityData);
    }

    if (fallbackProfile && fallbackSchedule) {
      return getFallbackSlotsForDate(selectedDate, fallbackProfile, fallbackSchedule);
    }

    return [];
  }, [availabilityData, fallbackProfile, fallbackSchedule, selectedDate, selectedPro]);

  const canMoveToStepFour = Boolean(selectedDate && selectedTime);

  useEffect(() => {
    if (!selectedPro?.backendId) {
      setAvailabilityData(null);
      return;
    }

    let cancelled = false;
    setLoadingAvailability(true);

    const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const monthEnd = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    const loadAvailability = async () => {
      try {
        const response = await apiFetch(
          `/api/professionals/${selectedPro.backendId}/availability?startDate=${encodeURIComponent(
            monthStart.toISOString(),
          )}&endDate=${encodeURIComponent(monthEnd.toISOString())}`,
        );

        const data = await parseJsonResponse<LiveAvailabilityResponse>(response);
        if (cancelled) return;
        setAvailabilityData(data);
      } catch {
        if (!cancelled) {
          setAvailabilityData(null);
        }
      } finally {
        if (!cancelled) {
          setLoadingAvailability(false);
        }
      }
    };

    void loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [selectedPro?.backendId, visibleMonth]);

  const handleConfirmBooking = async () => {
    if (!selectedPro || !selectedDate || !selectedTime) return;

    if (!isAuthenticated) {
      setBookingError("Please log in as a client before confirming a booking.");
      return;
    }

    if (!selectedPro.backendId) {
      setBookingError(
        "This professional is not connected to the backend yet. Please choose a live backend profile.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setBookingError("");
      setBookingSuccess(null);

      const scheduledAt = combineDateAndTime(selectedDate, selectedTime);
      const response = await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          professionalId: selectedPro.backendId,
          serviceId: selectedService,
          scheduledAt: scheduledAt.toISOString(),
        }),
      });

      const data = await parseJsonResponse<{
        bookingId: string;
        booking?: { scheduledAt?: string };
      }>(response);

      setBookingSuccess({
        bookingId: data.bookingId,
        scheduledAt: data.booking?.scheduledAt || scheduledAt.toISOString(),
      });
    } catch (error) {
      setBookingError(
        error instanceof Error ? error.message : "We could not create the booking right now.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f4] pt-20">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            {[1, 2, 3, 4].map((current) => (
              <div key={current} className="flex flex-1 items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold ${
                    step >= current
                      ? "bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {current}
                </div>
                {current < 4 ? (
                  <div
                    className={`mx-2 h-1 flex-1 rounded ${
                      step > current
                        ? "bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6]"
                        : "bg-gray-200"
                    }`}
                  />
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[12px] font-medium text-[#7e7e7e]">
            <span>Select Service</span>
            <span>Choose Professional</span>
            <span>Pick Date & Time</span>
            <span>Confirm</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-12">
        {step === 1 ? (
          <>
            <h2 className="mb-3 text-[36px] font-bold text-[#2b2b2b]">Select Your Service</h2>
            <p className="mb-8 text-[16px] text-[#7e7e7e]">Choose the type of support you need.</p>
            <div className="grid gap-6 md:grid-cols-2">
              {serviceCatalog.map((service) => (
                <button
                  key={service.slug}
                  type="button"
                  onClick={() => {
                    setSelectedService(service.slug);
                    setSelectedProfessional(null);
                    setSelectedDate(null);
                    setSelectedTime("");
                    setBookingError("");
                    setBookingSuccess(null);
                    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                  }}
                  className={`rounded-[24px] bg-white p-8 text-left transition-all ${
                    selectedService === service.slug
                      ? "border-2 border-[#f56969] shadow-lg"
                      : "border-2 border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full ${
                        selectedService === service.slug
                          ? "bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6]"
                          : "bg-gradient-to-r from-[#f5912d]/10 via-[#f56969]/10 to-[#e6b9e6]/10"
                      }`}
                    >
                      <service.icon
                        className={`h-7 w-7 ${
                          selectedService === service.slug ? "text-white" : "text-[#f56969]"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[20px] font-bold text-[#2b2b2b]">{service.title}</h3>
                      <p className="text-[14px] text-[#7e7e7e]">{service.tagline}</p>
                    </div>
                    {selectedService === service.slug ? (
                      <CheckCircle className="h-6 w-6 text-[#f56969]" />
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <h2 className="mb-3 text-[36px] font-bold text-[#2b2b2b]">Choose Your Professional</h2>
            <p className="mb-3 text-[16px] text-[#7e7e7e]">Select a professional who fits your needs.</p>
            <p className="mb-8 text-sm text-[#7e7e7e]">
              {usingLiveData
                ? "Using live professionals from the backend."
                : "Using local fallback professionals while the backend data loads."}
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {professionalOptions.map((pro) => (
                <button
                  key={pro.id}
                  type="button"
                  onClick={() => {
                    setSelectedProfessional(pro.id);
                    setSelectedDate(null);
                    setSelectedTime("");
                    setBookingError("");
                    setBookingSuccess(null);
                    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                  }}
                  className={`overflow-hidden rounded-[24px] bg-white text-left transition-all ${
                    selectedProfessional === pro.id
                      ? "border-2 border-[#f56969] shadow-lg"
                      : "border-2 border-transparent"
                  }`}
                >
                  <img src={pro.image} alt={pro.name} className="h-[200px] w-full object-cover" />
                  <div className="p-6">
                    <h3 className="text-[18px] font-bold text-[#2b2b2b]">{pro.name}</h3>
                    <p className="mb-3 text-[14px] text-[#f56969]">{pro.specialty}</p>
                    <div className="flex items-center justify-between text-[13px] text-[#7e7e7e]">
                      <span>{pro.experience}</span>
                      <span>{pro.rate}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <h2 className="mb-3 text-[36px] font-bold text-[#2b2b2b]">Pick Date &amp; Time</h2>
            <p className="mb-8 text-[16px] text-[#7e7e7e]">Choose a time that works for you.</p>
            <div className="grid gap-8 xl:grid-cols-[1.1fr_0.95fr]">
              <div className="rounded-[32px] bg-white p-6 shadow-[0_18px_45px_rgba(29,25,22,0.06)] sm:p-8">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <MonthSelect
                    value={visibleMonth.getMonth()}
                    onChange={(month) =>
                      setVisibleMonth(new Date(visibleMonth.getFullYear(), month, 1))
                    }
                  />
                  <MonthSelect
                    value={visibleMonth.getFullYear()}
                    onChange={(year) => setVisibleMonth(new Date(year, visibleMonth.getMonth(), 1))}
                    options={buildYearOptions(today.getFullYear())}
                  />
                  <div className="ml-auto flex overflow-hidden rounded-[14px] border border-[#ffd3d1]">
                    <CalendarNavButton
                      disabled={
                        visibleMonth.getFullYear() === today.getFullYear() &&
                        visibleMonth.getMonth() === today.getMonth()
                      }
                      onClick={() =>
                        setVisibleMonth(
                          new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
                        )
                      }
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </CalendarNavButton>
                    <div className="w-px bg-[#ffd3d1]" />
                    <CalendarNavButton
                      onClick={() =>
                        setVisibleMonth(
                          new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
                        )
                      }
                    >
                      <ChevronRight className="h-5 w-5" />
                    </CalendarNavButton>
                  </div>
                </div>

                <div className="mb-6 inline-flex rounded-full bg-[#fff1f0] px-4 py-1 text-sm font-medium text-[#6a6a6a]">
                  {selectedPro?.backendAvailability?.timezone ||
                    availabilityData?.availability?.timezone ||
                    "Asia/Calcutta"}
                </div>

                <div className="grid grid-cols-7 gap-3 text-center text-[15px] font-medium text-[#344256]">
                  {WEEKDAY_LABELS.map((label) => (
                    <div key={label} className="py-2">
                      {label}
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-3">
                  {calendarDays.map((day) => {
                    const inCurrentMonth = isSameMonth(day, visibleMonth);
                    const selectable = isDateSelectable(
                      day,
                      today,
                      selectedPro,
                      availabilityData,
                      fallbackProfile,
                      fallbackSchedule,
                    );
                    const selected = selectedDate ? isSameDay(day, selectedDate) : false;

                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        disabled={!selectable}
                        onClick={() => {
                          setSelectedDate(day);
                          setSelectedTime("");
                          setBookingError("");
                          setBookingSuccess(null);
                        }}
                        className={`relative min-h-[58px] rounded-[12px] border text-[28px] font-medium transition sm:min-h-[72px] ${
                          selected
                            ? "border-[#f56a6a] bg-[#f56a6a] text-white"
                            : selectable
                              ? "border-[#ff9d96] bg-[#fff8f8] text-[#243447] hover:bg-[#fff0ef]"
                              : "border-transparent bg-[#eceef4] text-[#c2c8d2]"
                        } ${!inCurrentMonth ? "opacity-70" : ""}`}
                      >
                        <span className="text-[18px]">{day.getDate()}</span>
                        {selected ? (
                          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-white/80" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                {selectedPro ? (
                  <div className="rounded-[32px] bg-white p-6 shadow-[0_18px_45px_rgba(29,25,22,0.06)]">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedPro.image}
                        alt={selectedPro.name}
                        className="h-16 w-16 rounded-[20px] object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#f56969]">{selectedPro.specialty}</p>
                        <h3 className="text-xl font-bold text-[#2b2b2b]">{selectedPro.name}</h3>
                        <p className="text-sm text-[#7e7e7e]">
                          {selectedPro.experience} · {selectedPro.rate}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="rounded-[32px] bg-white p-6 shadow-[0_18px_45px_rgba(29,25,22,0.06)] sm:p-8">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-[28px] font-bold text-[#2b2b2b]">Available Time Slots</h3>
                      <p className="text-sm text-[#7e7e7e]">
                        {selectedDate
                          ? formatLongDate(selectedDate)
                          : "Select a date to see available session times."}
                      </p>
                    </div>
                    {loadingAvailability ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#fff3f2] px-4 py-2 text-sm font-medium text-[#f56969]">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Loading
                      </span>
                    ) : null}
                  </div>

                  {selectedDate && availableSlots.length ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setSelectedTime(slot);
                            setBookingError("");
                            setBookingSuccess(null);
                          }}
                          className={`rounded-[18px] border px-5 py-4 text-center text-[24px] font-medium transition ${
                            selectedTime === slot
                              ? "border-[#f56a6a] bg-[#f56a6a] text-white"
                              : "border-transparent bg-[#f4f0ee] text-[#1f2d3d] hover:bg-[#ffe9e7]"
                          }`}
                        >
                          <span className="text-[16px]">{slot}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-[#ecd8d5] bg-[#fcf9f8] px-6 py-8 text-center text-[#7e7e7e]">
                      {selectedDate
                        ? "No slots are available for this day. Please choose another date."
                        : "Choose a date from the calendar to unlock available slots."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
        {step === 4 ? (
          <>
            <h2 className="mb-3 text-[36px] font-bold text-[#2b2b2b]">Confirm Your Booking</h2>
            <p className="mb-8 text-[16px] text-[#7e7e7e]">
              Review your session details and confirm your appointment.
            </p>
            <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
              <div className="rounded-[32px] bg-white p-8 shadow-[0_18px_45px_rgba(29,25,22,0.06)]">
                <div className="mb-6 flex items-center gap-4">
                  {selectedPro ? (
                    <img
                      src={selectedPro.image}
                      alt={selectedPro.name}
                      className="h-20 w-20 rounded-[24px] object-cover"
                    />
                  ) : null}
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#f56969]">
                      Booking Summary
                    </p>
                    <h3 className="text-[28px] font-bold text-[#2b2b2b]">
                      {selectedPro?.name || "Choose a professional"}
                    </h3>
                    <p className="text-sm text-[#7e7e7e]">{selectedPro?.specialty}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] bg-[#f7f5f4] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7e7e7e]">
                      Service
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#2b2b2b]">
                      {serviceCatalog.find((service) => service.slug === selectedService)?.title ||
                        "Not selected"}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-[#f7f5f4] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7e7e7e]">
                      Session Fee
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#2b2b2b]">
                      {selectedPro?.rate || "TBD"}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-[#f7f5f4] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7e7e7e]">
                      Date
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#2b2b2b]">
                      {selectedDate ? formatLongDate(selectedDate) : "Not selected"}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-[#f7f5f4] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7e7e7e]">
                      Time
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#2b2b2b]">
                      {selectedTime || "Not selected"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] bg-white p-8 shadow-[0_18px_45px_rgba(29,25,22,0.06)]">
                <h3 className="text-[28px] font-bold text-[#2b2b2b]">Ready to confirm?</h3>
                <p className="mt-3 text-[15px] leading-7 text-[#7e7e7e]">
                  We&apos;ll create your session on the live backend and surface it in your client
                  dashboard right after confirmation.
                </p>

                {!isAuthenticated && !authLoading ? (
                  <div className="mt-6 rounded-[24px] border border-[#ffe0de] bg-[#fff4f3] p-5 text-sm text-[#694646]">
                    Please <Link href="/login" className="font-semibold text-[#f56969] underline">log in</Link> as a client before confirming your booking.
                  </div>
                ) : null}

                {bookingError ? (
                  <div className="mt-6 rounded-[24px] border border-[#ffd1cf] bg-[#fff3f2] p-5 text-sm text-[#8a3e3b]">
                    {bookingError}
                  </div>
                ) : null}

                {bookingSuccess ? (
                  <div className="mt-6 rounded-[24px] border border-[#d5efde] bg-[#f4fbf6] p-5 text-sm text-[#24543b]">
                    <p className="font-semibold">Booking confirmed</p>
                    <p className="mt-1">
                      Reference: {bookingSuccess.bookingId}
                    </p>
                    <p className="mt-1">
                      Scheduled for{" "}
                      {formatLongDate(new Date(bookingSuccess.scheduledAt))} at {selectedTime}
                    </p>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={() => void handleConfirmBooking()}
                    disabled={submitting || Boolean(bookingSuccess) || authLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-6 py-4 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                    {bookingSuccess ? "Booking Confirmed" : "Confirm Booking"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={submitting}
                    className="rounded-full border border-[#2b2b2b] px-6 py-4 text-sm font-medium text-[#2b2b2b] disabled:opacity-40"
                  >
                    Back To Date &amp; Time
                  </button>
                  {bookingSuccess ? (
                    <Link
                      href="/dashboard/client"
                      className="rounded-full border border-[#f4c7c4] px-6 py-4 text-center text-sm font-medium text-[#f56969]"
                    >
                      View In Client Dashboard
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        ) : null}

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(1, current - 1))}
            disabled={step === 1 || submitting}
            className="rounded-full border border-[#2b2b2b] px-6 py-3 text-sm font-medium text-[#2b2b2b] disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setStep((current) => Math.min(4, current + 1))}
            disabled={
              submitting ||
              (step === 1 && !selectedService) ||
              (step === 2 && !selectedProfessional) ||
              (step === 3 && !canMoveToStepFour) ||
              step === 4
            }
            className="rounded-full bg-[#2b2b2b] px-6 py-3 text-sm font-medium text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function MonthSelect({
  value,
  onChange,
  options,
}: {
  value: number;
  onChange: (value: number) => void;
  options?: { label: string; value: number }[];
}) {
  const resolvedOptions =
    options ||
    MONTH_NAMES.map((label, index) => ({
      label,
      value: index,
    }));

  return (
    <select
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="rounded-[14px] border border-[#d9dde7] bg-white px-4 py-3 text-[16px] text-[#2b2b2b] shadow-sm outline-none"
    >
      {resolvedOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function CalendarNavButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-[50px] w-[46px] items-center justify-center bg-white text-[#6a6a6a] transition hover:bg-[#fff3f2] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function buildYearOptions(startYear: number) {
  return Array.from({ length: 3 }, (_, index) => {
    const year = startYear + index;
    return { label: String(year), value: year };
  });
}

function buildCalendarDays(visibleMonth: Date) {
  const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const calendarStart = new Date(firstDay);
  const normalizedWeekday = (firstDay.getDay() + 6) % 7;
  calendarStart.setDate(firstDay.getDate() - normalizedWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(calendarStart);
    day.setDate(calendarStart.getDate() + index);
    return day;
  });
}

function isDateSelectable(
  date: Date,
  today: Date,
  professional: DirectoryProfessional | null,
  availabilityData: LiveAvailabilityResponse | null,
  fallbackProfile: ProfessionalProfile | null,
  fallbackSchedule: AvailabilitySchedule | null,
) {
  const normalized = startOfDay(date);
  if (normalized < today) return false;

  if (professional?.backendId && availabilityData?.availability) {
    return getLiveSlotsForDate(date, availabilityData).length > 0;
  }

  if (fallbackProfile && fallbackSchedule) {
    return getFallbackSlotsForDate(date, fallbackProfile, fallbackSchedule).length > 0;
  }

  return professional ? true : false;
}

function getLiveSlotsForDate(date: Date, availabilityData: LiveAvailabilityResponse) {
  const workingHours = availabilityData.availability?.workingHours;
  const blockedDates = availabilityData.availability?.blockedDates || [];
  const bookedSlots = availabilityData.bookedSlots || [];

  if (!workingHours) return [];
  if (blockedDates.some((value) => isSameDay(new Date(value), date))) return [];

  const dayKey = DAY_NAMES[date.getDay()].toLowerCase();
  const window = workingHours[dayKey];
  if (!window?.start || !window?.end) return [];

  const ranges = window.slots?.length
    ? window.slots.map((slot) => ({
        startMinutes: parse24HourTime(slot.start),
        endMinutes: parse24HourTime(slot.end),
      }))
    : [
        {
          startMinutes: parse24HourTime(window.start),
          endMinutes: parse24HourTime(window.end),
        },
      ];

  return buildSlotsFromRanges(ranges, date, bookedSlots.map((slot) => new Date(slot.start)));
}

function buildFallbackAvailabilitySchedule(professional: ProfessionalProfile): AvailabilitySchedule {
  const base: AvailabilitySchedule = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  const allowedDays = new Set([0, 1, 2, 3, 4, 5, 6]);

  for (const day of parseDaysOff(professional.daysOff)) {
    allowedDays.delete(day);
  }

  if (!professional.workingHours) {
    for (const day of allowedDays) {
      base[day] = [{ startMinutes: 9 * 60, endMinutes: 18 * 60 }];
    }
    return base;
  }

  const segments = professional.workingHours
    .split(";")
    .map((segment) => segment.trim())
    .filter(Boolean);

  let foundDaySpecificSegment = false;

  for (const segment of segments) {
    const days = parseDaysFromSegment(segment, allowedDays);
    const ranges = parseTimeRanges(segment);
    if (!ranges.length) continue;

    if (days.length) {
      foundDaySpecificSegment = true;
      for (const day of days) {
        if (allowedDays.has(day)) {
          base[day] = [...base[day], ...ranges];
        }
      }
    } else {
      for (const day of allowedDays) {
        base[day] = [...base[day], ...ranges];
      }
    }
  }

  if (!foundDaySpecificSegment && segments.length === 1) {
    const ranges = parseTimeRanges(segments[0]);
    for (const day of allowedDays) {
      base[day] = ranges;
    }
  }

  return base;
}

function getFallbackSlotsForDate(
  date: Date,
  professional: ProfessionalProfile,
  schedule: AvailabilitySchedule,
) {
  const ranges = schedule[date.getDay()] || [];
  if (!ranges.length) return [];
  return buildSlotsFromRanges(ranges, date, [], !professional.workingHours);
}

function buildSlotsFromRanges(
  ranges: TimeRange[],
  date: Date,
  bookedStarts: Date[],
  allowDefault = false,
) {
  const now = new Date();
  const isTodayDate = isSameDay(date, now);
  const uniqueSlots = new Set<string>();

  for (const range of ranges) {
    for (let minute = range.startMinutes; minute < range.endMinutes; minute += 60) {
      const slotDate = new Date(date);
      slotDate.setHours(Math.floor(minute / 60), minute % 60, 0, 0);

      if (isTodayDate && slotDate <= now) continue;
      if (bookedStarts.some((booked) => booked.getTime() === slotDate.getTime())) continue;

      uniqueSlots.add(formatMinutes(minute));
    }
  }

  if (!uniqueSlots.size && allowDefault) {
    return ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"];
  }

  return Array.from(uniqueSlots).sort(compareTimeStrings);
}

function parseDaysOff(input?: string) {
  if (!input) return [];
  const normalized = input.toLowerCase();
  const days = new Set<number>();

  if (normalized.includes("weekends")) {
    days.add(0);
    days.add(6);
  }

  for (const [index, name] of DAY_NAMES.entries()) {
    if (normalized.includes(name.toLowerCase())) {
      days.add(index);
    }
  }

  return Array.from(days);
}

function parseDaysFromSegment(segment: string, allowedDays: Set<number>) {
  const normalized = segment.toLowerCase();
  if (normalized.includes("weekdays")) {
    return [1, 2, 3, 4, 5].filter((day) => allowedDays.has(day));
  }

  if (normalized.includes("weekends")) {
    return [0, 6].filter((day) => allowedDays.has(day));
  }

  const beforeColon = segment.split(":")[0]?.toLowerCase() || normalized;
  const matches = DAY_NAMES.map((name, index) => ({ name: name.toLowerCase(), index })).filter(
    (day) => beforeColon.includes(day.name),
  );

  if (matches.length >= 2 && beforeColon.includes("to")) {
    const start = matches[0].index;
    const end = matches[matches.length - 1].index;
    return expandDayRange(start, end).filter((day) => allowedDays.has(day));
  }

  return matches.map((day) => day.index).filter((day) => allowedDays.has(day));
}

function expandDayRange(start: number, end: number) {
  if (start <= end) {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  return [
    ...Array.from({ length: 7 - start }, (_, index) => start + index),
    ...Array.from({ length: end + 1 }, (_, index) => index),
  ];
}

function parseTimeRanges(segment: string) {
  const ranges: TimeRange[] = [];
  const pattern =
    /(\d{1,2}(?::\d{2})?\s*[APap][Mm])\s*-\s*(\d{1,2}(?::\d{2})?\s*[APap][Mm])/g;
  let match: RegExpExecArray | null = pattern.exec(segment);

  while (match) {
    ranges.push({
      startMinutes: parseTwelveHourTime(match[1]),
      endMinutes: parseTwelveHourTime(match[2]),
    });
    match = pattern.exec(segment);
  }

  return ranges;
}

function parseTwelveHourTime(value: string) {
  const match = value.trim().match(/(\d{1,2})(?::(\d{2}))?\s*([APap][Mm])/);
  if (!match) return 0;

  const hour = Number(match[1]) % 12;
  const minute = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3].toUpperCase();

  return hour * 60 + minute + (meridiem === "PM" ? 12 * 60 : 0);
}

function parse24HourTime(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function formatMinutes(totalMinutes: number) {
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function compareTimeStrings(a: string, b: string) {
  return parseTwelveHourTime(a) - parseTwelveHourTime(b);
}

function combineDateAndTime(date: Date, time: string) {
  const totalMinutes = parseTwelveHourTime(time);
  const next = new Date(date);
  next.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0);
  return next;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function isSameMonth(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth()
  );
}

function formatLongDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
