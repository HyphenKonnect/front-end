"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { StatusBanner } from "../../components/ui/StatusBanner";
import { apiFetch, parseJsonResponse } from "../../lib/api";
import { formatInr } from "../../lib/formatting";
import { openRazorpayCheckout, type RazorpayOrderPayload } from "../../lib/razorpay";
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

type BookingDetailsResponse = {
  _id: string;
  serviceId?: string;
  scheduledAt: string;
  status: string;
  professionalId?:
    | string
    | {
        _id?: string;
        id?: string;
        name?: string;
      };
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
  bookingMode: professional.bookingMode,
  packageSessions: professional.packageSessions,
}));

export default function BookingPage() {
  return (
    <Suspense fallback={<BookingPageFallback />}>
      <BookingPageContent />
    </Suspense>
  );
}

function BookingPageContent() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const today = useMemo(() => startOfDay(new Date()), []);
  const timeSlotsRef = useRef<HTMLDivElement | null>(null);
  const continueActionsRef = useRef<HTMLDivElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);
  const initialService = searchParams.get("service") || "";
  const initialProfessionalSlug = searchParams.get("professional") || "";
  const bookingIdFromQuery = searchParams.get("bookingId") || "";
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedProfessional, setSelectedProfessional] = useState<string | number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSecondDate, setSelectedSecondDate] = useState<Date | null>(null);
  const [selectedSecondTime, setSelectedSecondTime] = useState("");
  const [activePackageSlot, setActivePackageSlot] = useState<1 | 2>(1);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [directory, setDirectory] = useState<DirectoryProfessional[]>(localDirectory);
  const [usingLiveData, setUsingLiveData] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<LiveAvailabilityResponse | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingRescheduleBooking, setLoadingRescheduleBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [paymentOrder, setPaymentOrder] = useState<RazorpayOrderPayload | null>(null);
  const [paymentError, setPaymentError] = useState("");
  const [creatingPaymentOrder, setCreatingPaymentOrder] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<{
    bookingId: string;
    scheduledAt: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [rescheduleBooking, setRescheduleBooking] = useState<BookingDetailsResponse | null>(null);
  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [requestSuccessMessage, setRequestSuccessMessage] = useState("");

  const isRescheduleMode = Boolean(bookingIdFromQuery);

  useEffect(() => {
    const nextService = searchParams.get("service") || "";
    const nextProfessionalSlug = searchParams.get("professional") || "";
    if (!nextService) return;
    if (!serviceCatalog.some((service) => service.slug === nextService)) return;

    setSelectedService(nextService);
    setSelectedProfessional(null);
    setSelectedDate(null);
    setSelectedTime("");
    setSelectedSecondDate(null);
    setSelectedSecondTime("");
    setBookingError("");
    setBookingSuccess(null);
    setPaymentOrder(null);
    setPaymentError("");
    setPaymentSuccessMessage("");
    setRequestSuccessMessage("");
    setStep(nextProfessionalSlug ? 3 : 2);
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  }, [searchParams, today]);

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

  useEffect(() => {
    if (!bookingIdFromQuery || authLoading || !isAuthenticated) return;

    let cancelled = false;

    const loadBooking = async () => {
      try {
        setLoadingRescheduleBooking(true);
        const response = await apiFetch(`/api/bookings/${bookingIdFromQuery}`);
        const data = await parseJsonResponse<BookingDetailsResponse>(response);
        if (!cancelled) {
          setRescheduleBooking(data);
        }
      } catch (error) {
        if (!cancelled) {
          setBookingError(
            error instanceof Error
              ? error.message
              : "We could not load the booking you want to reschedule.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingRescheduleBooking(false);
        }
      }
    };

    void loadBooking();

    return () => {
      cancelled = true;
    };
  }, [authLoading, bookingIdFromQuery, isAuthenticated]);

  useEffect(() => {
    if (!rescheduleBooking || !directory.length) return;

    const professionalRecord =
      typeof rescheduleBooking.professionalId === "object"
        ? rescheduleBooking.professionalId
        : null;
    const professionalId =
      professionalRecord?._id || professionalRecord?.id || rescheduleBooking.professionalId;
    const matchedProfessional = directory.find(
      (item) =>
        item.backendId === professionalId ||
        String(item.id) === String(professionalId) ||
        item.name === professionalRecord?.name,
    );
    const scheduledDate = new Date(rescheduleBooking.scheduledAt);

    if (rescheduleBooking.serviceId) {
      setSelectedService(rescheduleBooking.serviceId);
    }
    if (matchedProfessional) {
      setSelectedProfessional(matchedProfessional.id);
    }
    if (!Number.isNaN(scheduledDate.getTime())) {
      setSelectedDate(scheduledDate);
      setSelectedTime(formatMinutes(scheduledDate.getHours() * 60 + scheduledDate.getMinutes()));
      setVisibleMonth(new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), 1));
    }
    setStep(3);
  }, [directory, rescheduleBooking]);

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

  useEffect(() => {
    if (!initialProfessionalSlug || !professionalOptions.length || selectedProfessional) return;
    const matchedProfessional = professionalOptions.find(
      (item) => item.slug === initialProfessionalSlug,
    );
    if (!matchedProfessional) return;
    setSelectedProfessional(matchedProfessional.id);
    setBookingError("");
    setBookingSuccess(null);
    setPaymentOrder(null);
    setPaymentError("");
    setPaymentSuccessMessage("");
    setRequestSuccessMessage("");
    setStep(3);
  }, [initialProfessionalSlug, professionalOptions, selectedProfessional]);

  useEffect(() => {
    setRequestForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      message: fallbackProfile?.category === "legal"
        ? "I would like support with a legal consultation."
        : "",
    });
  }, [fallbackProfile?.category, user?.email, user?.name, user?.phone]);

  const bookingMode = fallbackProfile?.bookingMode || selectedPro?.bookingMode || "standard";
  const isRequestOnly = bookingMode === "request";
  const isPackageBooking = bookingMode === "package";
    const calendarTargetDate =
      isPackageBooking && activePackageSlot === 2 ? selectedSecondDate : selectedDate;
  const calendarTargetTime =
    isPackageBooking && activePackageSlot === 2 ? selectedSecondTime : selectedTime;

  const fallbackSchedule = useMemo(
    () => (fallbackProfile ? buildFallbackAvailabilitySchedule(fallbackProfile) : null),
    [fallbackProfile],
  );

  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);

  const availableSlots = useMemo(() => {
    if (!calendarTargetDate || !selectedPro) return [];

    if (selectedPro.backendId && availabilityData?.availability) {
      return getLiveSlotsForDate(calendarTargetDate, availabilityData);
    }

    if (fallbackProfile && fallbackSchedule) {
      return getFallbackSlotsForDate(calendarTargetDate, fallbackProfile, fallbackSchedule);
    }

    return [];
  }, [availabilityData, calendarTargetDate, fallbackProfile, fallbackSchedule, selectedPro]);

  const canMoveToStepFour = isRequestOnly
    ? Boolean(requestForm.name && requestForm.email && requestForm.message)
    : isPackageBooking
      ? Boolean(selectedDate && selectedTime && selectedSecondDate && selectedSecondTime)
      : Boolean(selectedDate && selectedTime);

  const scrollToTimeSlots = () => {
    window.requestAnimationFrame(() => {
      timeSlotsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const scrollToContinueActions = () => {
    window.setTimeout(() => {
      continueButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  };

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

  const refreshAvailability = async () => {
    if (!selectedPro?.backendId) return;

    const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const monthEnd = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
    );

    try {
      setLoadingAvailability(true);
      const response = await apiFetch(
        `/api/professionals/${selectedPro.backendId}/availability?startDate=${encodeURIComponent(
          monthStart.toISOString(),
        )}&endDate=${encodeURIComponent(monthEnd.toISOString())}`,
      );
      const data = await parseJsonResponse<LiveAvailabilityResponse>(response);
      setAvailabilityData(data);
    } catch {
      setAvailabilityData(null);
    } finally {
      setLoadingAvailability(false);
    }
  };

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
      setPaymentOrder(null);
      setPaymentError("");
      setPaymentSuccessMessage("");

      const scheduledAt = combineDateAndTime(selectedDate, selectedTime);
      const response = await apiFetch(
        isRescheduleMode && bookingIdFromQuery
          ? `/api/bookings/${bookingIdFromQuery}/reschedule`
          : "/api/bookings",
        {
          method: isRescheduleMode && bookingIdFromQuery ? "PATCH" : "POST",
          body: JSON.stringify({
            professionalId: selectedPro.backendId,
            serviceId: selectedService,
            scheduledAt: scheduledAt.toISOString(),
          }),
        },
      );

      const data = await parseJsonResponse<{
        bookingId?: string;
        message?: string;
        booking?: { _id?: string; scheduledAt?: string };
        _id?: string;
      }>(response);

      setBookingSuccess({
        bookingId: data.bookingId || data.booking?._id || bookingIdFromQuery,
        scheduledAt: data.booking?.scheduledAt || scheduledAt.toISOString(),
      });
      await refreshAvailability();
    } catch (error) {
      setBookingError(
        error instanceof Error ? error.message : "We could not create the booking right now.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const pricingBreakdown = useMemo(() => {
    const rateText = selectedPro?.rate || "";
    const numericMatch = rateText.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
    const basePrice = numericMatch ? Number(numericMatch[1]) : 0;
    const gstAmount = Number((basePrice * 0.18).toFixed(2));
    const total = Number((basePrice + gstAmount).toFixed(2));

    return {
      basePrice,
      gstAmount,
      total,
    };
  }, [selectedPro?.rate]);

  const handleCreatePaymentOrder = async () => {
    if (!bookingSuccess?.bookingId) return;

    try {
      setCreatingPaymentOrder(true);
      setPaymentError("");
      setPaymentSuccessMessage("");
      const response = await apiFetch("/api/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ bookingId: bookingSuccess.bookingId }),
      });
      const data = await parseJsonResponse<{
        bookingId: string | null;
        orderId: string;
        amount: number;
        currency: string;
        key: string;
      }>(response);
      const nextOrder = {
        bookingId: data.bookingId || bookingSuccess.bookingId,
        orderId: data.orderId,
        amount: data.amount,
        currency: data.currency,
        key: data.key,
      };
      setPaymentOrder(nextOrder);
      return nextOrder;
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "We could not initialize payment right now.",
      );
      return null;
    } finally {
      setCreatingPaymentOrder(false);
    }
  };

  const handleStartPayment = async () => {
    if (!bookingSuccess?.bookingId || !selectedPro) return;

    const order = paymentOrder || (await handleCreatePaymentOrder());
    if (!order) return;

    try {
      setPaymentError("");
      setPaymentSuccessMessage("");

      await openRazorpayCheckout({
        order,
        name: "The Hyphen Konnect",
        description: `${selectedPro.name} session`,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        onSuccess: async (response) => {
          const verifyResponse = await apiFetch("/api/payments/verify", {
            method: "POST",
            body: JSON.stringify({
              bookingId: order.bookingId,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          const verification = await parseJsonResponse<{
            success: boolean;
            message: string;
            paymentId: string;
            method?: string;
            invoiceNumber?: string;
          }>(verifyResponse);

          const confirmResponse = await apiFetch(`/api/bookings/${order.bookingId}/confirm`, {
            method: "PATCH",
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              paymentMethod: verification.method || "upi",
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            }),
          });
          await parseJsonResponse(confirmResponse);

          setPaymentSuccessMessage(
            verification.invoiceNumber
              ? `Payment completed and booking confirmed. Invoice ${verification.invoiceNumber} is now available in your dashboard.`
              : "Payment completed and booking confirmed. Your updated receipt is now available in the client dashboard.",
          );
          await refreshAvailability();
        },
        onFailure: (message) => {
          setPaymentError(message);
        },
        onDismiss: () => {
          setPaymentError("Payment window closed before completion.");
        },
      });
    } catch (error) {
      setPaymentError(
        error instanceof Error ? error.message : "We could not start Razorpay checkout.",
      );
    }
  };

  const handleContinueLegalRequest = () => {
    if (!selectedPro) return;

    const params = new URLSearchParams({
      service:
        serviceCatalog.find((service) => service.slug === selectedService)?.title ||
        selectedService,
      professional: selectedPro.name,
      mode: isPackageBooking ? "package-request" : "request",
    });

    if (requestForm.name) params.set("name", requestForm.name);
    if (requestForm.email) params.set("email", requestForm.email);
    if (requestForm.phone) params.set("phone", requestForm.phone);
    if (requestForm.message) params.set("message", requestForm.message);
    if (selectedDate && selectedTime) {
      params.set("slotOne", `${formatLongDate(selectedDate)} at ${selectedTime}`);
    }
    if (selectedSecondDate && selectedSecondTime) {
      params.set("slotTwo", `${formatLongDate(selectedSecondDate)} at ${selectedSecondTime}`);
    }

    setRequestSuccessMessage(
      isPackageBooking
        ? "Your preferred legal package slots are ready to send to our support team."
        : "Your legal session request is ready to send to our support team.",
    );
    window.location.href = `/contact?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-[#f7f5f4] pt-28">
      <div className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
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

      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
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
                    setSelectedSecondDate(null);
                    setSelectedSecondTime("");
                    setActivePackageSlot(1);
                    setBookingError("");
                    setBookingSuccess(null);
                    setPaymentOrder(null);
                    setPaymentError("");
                    setPaymentSuccessMessage("");
                    setRequestSuccessMessage("");
                    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                    scrollToContinueActions();
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
          