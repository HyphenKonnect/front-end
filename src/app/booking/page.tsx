"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
import {
  openRazorpayCheckout,
  type RazorpayOrderPayload,
} from "../../lib/razorpay";
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

const localDirectory: DirectoryProfessional[] = professionals.map(
  (professional) => ({
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
  }),
);

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
  const [selectedProfessional, setSelectedProfessional] = useState<
    string | number | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSecondDate, setSelectedSecondDate] = useState<Date | null>(
    null,
  );
  const [selectedSecondTime, setSelectedSecondTime] = useState("");
  const [activePackageSlot, setActivePackageSlot] = useState<1 | 2>(1);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [directory, setDirectory] =
    useState<DirectoryProfessional[]>(localDirectory);
  const [usingLiveData, setUsingLiveData] = useState(false);
  const [availabilityData, setAvailabilityData] =
    useState<LiveAvailabilityResponse | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingRescheduleBooking, setLoadingRescheduleBooking] =
    useState(false);
  const [bookingError, setBookingError] = useState("");
  const [paymentOrder, setPaymentOrder] = useState<RazorpayOrderPayload | null>(
    null,
  );
  const [paymentError, setPaymentError] = useState("");
  const [creatingPaymentOrder, setCreatingPaymentOrder] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<{
    bookingId: string;
    scheduledAt: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [rescheduleBooking, setRescheduleBooking] =
    useState<BookingDetailsResponse | null>(null);
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
        const data =
          await parseJsonResponse<BackendProfessionalRecord[]>(response);
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
      professionalRecord?._id ||
      professionalRecord?.id ||
      rescheduleBooking.professionalId;
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
      setSelectedTime(
        formatMinutes(
          scheduledDate.getHours() * 60 + scheduledDate.getMinutes(),
        ),
      );
      setVisibleMonth(
        new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), 1),
      );
    }
    setStep(3);
  }, [directory, rescheduleBooking]);

  const professionalOptions = useMemo(() => {
    return directory.filter((item) => {
      if (!selectedService) return false;
      if (selectedService === "mental-wellness")
        return item.category === "therapist";
      if (selectedService === "medical-consultation")
        return item.category === "doctor";
      if (selectedService === "legal-guidance")
        return item.category === "legal";
      return item.category === "wellness";
    });
  }, [directory, selectedService]);

  const selectedPro = useMemo(
    () =>
      professionalOptions.find((item) => item.id === selectedProfessional) ??
      null,
    [professionalOptions, selectedProfessional],
  );

  const fallbackProfile = useMemo(() => {
    if (!selectedPro) return null;
    return (
      professionals.find(
        (item) =>
          item.slug === selectedPro.slug || item.name === selectedPro.name,
      ) ?? null
    );
  }, [selectedPro]);

  useEffect(() => {
    if (
      !initialProfessionalSlug ||
      !professionalOptions.length ||
      selectedProfessional
    )
      return;
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
      message:
        fallbackProfile?.category === "legal"
          ? "I would like support with a legal consultation."
          : "",
    });
  }, [fallbackProfile?.category, user?.email, user?.name, user?.phone]);

  const bookingMode =
    fallbackProfile?.bookingMode || selectedPro?.bookingMode || "standard";
  const isRequestOnly = bookingMode === "request";
  const isPackageBooking = bookingMode === "package";
  const calendarTargetDate =
    isPackageBooking && activePackageSlot === 2
      ? selectedSecondDate
      : selectedDate;
  const calendarTargetTime =
    isPackageBooking && activePackageSlot === 2
      ? selectedSecondTime
      : selectedTime;

  const fallbackSchedule = useMemo(
    () =>
      fallbackProfile
        ? buildFallbackAvailabilitySchedule(fallbackProfile)
        : null,
    [fallbackProfile],
  );

  const calendarDays = useMemo(
    () => buildCalendarDays(visibleMonth),
    [visibleMonth],
  );

  const availableSlots = useMemo(() => {
    if (!calendarTargetDate || !selectedPro) return [];

    if (selectedPro.backendId && availabilityData?.availability) {
      return getLiveSlotsForDate(calendarTargetDate, availabilityData);
    }

    if (fallbackProfile && fallbackSchedule) {
      return getFallbackSlotsForDate(
        calendarTargetDate,
        fallbackProfile,
        fallbackSchedule,
      );
    }

    return [];
  }, [
    availabilityData,
    calendarTargetDate,
    fallbackProfile,
    fallbackSchedule,
    selectedPro,
  ]);

  const canMoveToStepFour = isRequestOnly
    ? Boolean(requestForm.name && requestForm.email && requestForm.message)
    : isPackageBooking
      ? Boolean(
          selectedDate &&
          selectedTime &&
          selectedSecondDate &&
          selectedSecondTime,
        )
      : Boolean(selectedDate && selectedTime);

  const scrollToTimeSlots = () => {
    window.requestAnimationFrame(() => {
      timeSlotsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const scrollToContinueActions = () => {
    window.setTimeout(() => {
      continueButtonRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);
  };

  useEffect(() => {
    if (!selectedPro?.backendId) {
      setAvailabilityData(null);
      return;
    }

    let cancelled = false;
    setLoadingAvailability(true);

    const monthStart = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      1,
    );
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

        const data =
          await parseJsonResponse<LiveAvailabilityResponse>(response);
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

    const monthStart = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      1,
    );
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
        error instanceof Error
          ? error.message
          : "We could not create the booking right now.",
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

          const confirmResponse = await apiFetch(
            `/api/bookings/${order.bookingId}/confirm`,
            {
              method: "PATCH",
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                paymentMethod: verification.method || "upi",
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              }),
            },
          );
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
        error instanceof Error
          ? error.message
          : "We could not start Razorpay checkout.",
      );
    }
  };

  const handleContinueLegalRequest = () => {
    if (!selectedPro) return;

    const params = new URLSearchParams({
      service:
        serviceCatalog.find((service) => service.slug === selectedService)
          ?.title || selectedService,
      professional: selectedPro.name,
      mode: isPackageBooking ? "package-request" : "request",
    });

    if (requestForm.name) params.set("name", requestForm.name);
    if (requestForm.email) params.set("email", requestForm.email);
    if (requestForm.phone) params.set("phone", requestForm.phone);
    if (requestForm.message) params.set("message", requestForm.message);
    if (selectedDate && selectedTime) {
      params.set(
        "slotOne",
        `${formatLongDate(selectedDate)} at ${selectedTime}`,
      );
    }
    if (selectedSecondDate && selectedSecondTime) {
      params.set(
        "slotTwo",
        `${formatLongDate(selectedSecondDate)} at ${selectedSecondTime}`,
      );
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
            <h2 className="mb-3 text-[36px] font-bold text-[#2b2b2b]">
              Select Your Service
            </h2>
            <p className="mb-8 text-[16px] text-[#7e7e7e]">
              Choose the type of support you need.
            </p>
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
                    setVisibleMonth(
                      new Date(today.getFullYear(), today.getMonth(), 1),
                    );
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
                          selectedService === service.slug
                            ? "text-white"
                            : "text-[#f56969]"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[20px] font-bold text-[#2b2b2b]">
                        {service.title}
                      </h3>
                      <p className="text-[14px] text-[#7e7e7e]">
                        {service.tagline}
                      </p>
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
            <h2 className="mb-3 text-[36px] font-bold text-[#2b2b2b]">
              Choose Your Professional
            </h2>
            <p className="mb-3 text-[16px] text-[#7e7e7e]">
              Select a professional who fits your needs.
            </p>
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
                    setSelectedSecondDate(null);
                    setSelectedSecondTime("");
                    setActivePackageSlot(1);
                    setBookingError("");
                    setBookingSuccess(null);
                    setRequestSuccessMessage("");
                    setVisibleMonth(
                      new Date(today.getFullYear(), today.getMonth(), 1),
                    );
                  }}
                  className={`overflow-hidden rounded-[24px] bg-white text-left transition-all ${
                    selectedProfessional === pro.id
                      ? "border-2 border-[#f56969] shadow-lg"
                      : "border border-[#e9e2df] shadow-[0_14px_36px_rgba(29,25,22,0.06)]"
                  }`}
                >
                  <div className="bg-[#f4efeb] p-3">
                    <Image
                      src={pro.image}
                      alt={pro.name}
                      width={900}
                      height={600}
                      className="h-[220px] w-full rounded-[18px] object-cover object-[center_20%]"
                    />
                  </div>
                  <div className="p-6 pt-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[22px] font-bold text-[#2b2b2b]">
                          {pro.name}
                        </h3>
                        <p className="mt-2 text-[14px] font-medium text-[#f56969]">
                          {pro.specialty}
                        </p>
                      </div>
                      <span className="rounded-full border border-[#ffd5cf] px-3 py-1 text-[12px] font-medium text-[#f56969]">
                        {pro.bookingMode === "request"
                          ? "On request"
                          : pro.bookingMode === "package"
                            ? "2-session package"
                            : "Online"}
                      </span>
                    </div>
                    <div className="grid gap-2 text-[14px] text-[#6f6f6f]">
                      <div className="flex items-center justify-between gap-3">
                        <span>{pro.experience} of experience</span>
                        <span className="font-semibold text-[#2b2b2b]">
                          {pro.rate}
                        </span>
                      </div>
                      {pro.location ? (
                        <div className="flex items-center justify-between gap-3">
                          <span>{pro.location}</span>
                          <span className="text-[#7e7e7e]">
                            Verified profile
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : null}
        {step === 3 ? (
          <>
            <h2 className="mb-3 text-[36px] font-bold text-[#2b2b2b]">
              {isRequestOnly
                ? "Request Your Legal Session"
                : isPackageBooking
                  ? "Pick Your Two Legal Sessions"
                  : isRescheduleMode
                    ? "Reschedule Date &amp; Time"
                    : "Pick Date &amp; Time"}
            </h2>
            <p className="mb-8 text-[16px] text-[#7e7e7e]">
              {isRequestOnly
                ? "This lawyer is available on request. Share your details and our team will coordinate the session."
                : isPackageBooking
                  ? "Choose two preferred legal session slots based on the professional’s availability."
                  : "Choose a time that works for you."}
            </p>
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.95fr] xl:gap-8">
              <div className="rounded-[28px] bg-white p-4 shadow-[0_18px_45px_rgba(29,25,22,0.06)] sm:rounded-[32px] sm:p-8">
                <div className="mb-5 flex flex-wrap items-center gap-3 sm:mb-6">
                  <MonthSelect
                    value={visibleMonth.getMonth()}
                    onChange={(month) =>
                      setVisibleMonth(
                        new Date(visibleMonth.getFullYear(), month, 1),
                      )
                    }
                  />
                  <MonthSelect
                    value={visibleMonth.getFullYear()}
                    onChange={(year) =>
                      setVisibleMonth(
                        new Date(year, visibleMonth.getMonth(), 1),
                      )
                    }
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
                          new Date(
                            visibleMonth.getFullYear(),
                            visibleMonth.getMonth() - 1,
                            1,
                          ),
                        )
                      }
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </CalendarNavButton>
                    <div className="w-px bg-[#ffd3d1]" />
                    <CalendarNavButton
                      onClick={() =>
                        setVisibleMonth(
                          new Date(
                            visibleMonth.getFullYear(),
                            visibleMonth.getMonth() + 1,
                            1,
                          ),
                        )
                      }
                    >
                      <ChevronRight className="h-5 w-5" />
                    </CalendarNavButton>
                  </div>
                </div>

                <div className="mb-5 inline-flex rounded-full bg-[#fff1f0] px-4 py-1 text-sm font-medium text-[#6a6a6a] sm:mb-6">
                  {selectedPro?.backendAvailability?.timezone ||
                    availabilityData?.availability?.timezone ||
                    "Asia/Calcutta"}
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-[13px] font-medium text-[#344256] sm:gap-3 sm:text-[15px]">
                  {WEEKDAY_LABELS.map((label) => (
                    <div key={label} className="py-2">
                      {label}
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2 sm:gap-3">
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
                    const selected = calendarTargetDate
                      ? isSameDay(day, calendarTargetDate)
                      : false;

                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        disabled={!selectable}
                        onClick={() => {
                          if (isPackageBooking && activePackageSlot === 2) {
                            setSelectedSecondDate(day);
                            setSelectedSecondTime("");
                          } else {
                            setSelectedDate(day);
                            setSelectedTime("");
                          }
                          setBookingError("");
                          setBookingSuccess(null);
                          setRequestSuccessMessage("");
                          scrollToTimeSlots();
                        }}
                        className={`relative min-h-[52px] rounded-[14px] border text-[24px] font-medium transition sm:min-h-[72px] sm:rounded-[12px] sm:text-[28px] ${
                          selected
                            ? "border-[#f56a6a] bg-[#f56a6a] text-white"
                            : selectable
                              ? "border-[#ff9d96] bg-[#fff8f8] text-[#243447] hover:bg-[#fff0ef]"
                              : "border-transparent bg-[#eceef4] text-[#c2c8d2]"
                        } ${!inCurrentMonth ? "opacity-70" : ""}`}
                      >
                        <span className="text-[17px] sm:text-[18px]">
                          {day.getDate()}
                        </span>
                        {selected ? (
                          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-white/80" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-5 sm:space-y-6">
                {selectedPro ? (
                  <div className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(29,25,22,0.06)] sm:rounded-[32px] sm:p-6">
                    <div className="flex items-center gap-4">
                      <Image
                        src={selectedPro.image}
                        alt={selectedPro.name}
                        width={128}
                        height={128}
                        className="h-16 w-16 rounded-[20px] object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#f56969]">
                          {selectedPro.specialty}
                        </p>
                        <h3 className="text-xl font-bold text-[#2b2b2b]">
                          {selectedPro.name}
                        </h3>
                        <p className="text-sm text-[#7e7e7e]">
                          {selectedPro.experience} · {selectedPro.rate}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div
                  ref={timeSlotsRef}
                  className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(29,25,22,0.06)] sm:rounded-[32px] sm:p-8"
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-[22px] font-bold text-[#2b2b2b] sm:text-[28px]">
                        Available Time Slots
                      </h3>
                      <p className="text-sm leading-6 text-[#7e7e7e]">
                        {isRequestOnly
                          ? "Tell us what you need and we’ll route it to the legal team."
                          : calendarTargetDate
                            ? formatLongDate(calendarTargetDate)
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

                  {isPackageBooking ? (
                    <div className="mb-6 flex flex-wrap gap-3">
                      {[1, 2].map((slotIndex) => {
                        const slotNumber = slotIndex as 1 | 2;
                        const slotDate =
                          slotNumber === 1 ? selectedDate : selectedSecondDate;
                        const slotTime =
                          slotNumber === 1 ? selectedTime : selectedSecondTime;

                        return (
                          <button
                            key={slotIndex}
                            type="button"
                            onClick={() => setActivePackageSlot(slotNumber)}
                            className={`min-w-[180px] rounded-[18px] border px-4 py-4 text-left transition ${
                              activePackageSlot === slotNumber
                                ? "border-[#f56a6a] bg-[#fff3f2] shadow-sm"
                                : "border-[#eadfda] bg-[#fcfaf9]"
                            }`}
                          >
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7e7e7e]">
                              {slotIndex === 1
                                ? "First session"
                                : "Second session"}
                            </p>
                            <p className="mt-2 text-sm font-medium text-[#2b2b2b]">
                              {slotDate
                                ? formatLongDate(slotDate)
                                : "Select a date"}
                            </p>
                            <p className="mt-1 text-sm text-[#7e7e7e]">
                              {slotTime || "Select a time"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {isRequestOnly ? (
                    <div className="space-y-4">
                      <RequestField
                        label="Full Name *"
                        value={requestForm.name}
                        onChange={(value) =>
                          setRequestForm((current) => ({
                            ...current,
                            name: value,
                          }))
                        }
                      />
                      <RequestField
                        label="Email *"
                        type="email"
                        value={requestForm.email}
                        onChange={(value) =>
                          setRequestForm((current) => ({
                            ...current,
                            email: value,
                          }))
                        }
                      />
                      <RequestField
                        label="Phone"
                        value={requestForm.phone}
                        onChange={(value) =>
                          setRequestForm((current) => ({
                            ...current,
                            phone: value,
                          }))
                        }
                      />
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2b2b2b]">
                          What support do you need? *
                        </label>
                        <textarea
                          value={requestForm.message}
                          onChange={(event) =>
                            setRequestForm((current) => ({
                              ...current,
                              message: event.target.value,
                            }))
                          }
                          className="min-h-[140px] w-full rounded-[18px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 text-sm outline-none"
                          placeholder="Tell us briefly about the legal help you are seeking."
                        />
                      </div>
                    </div>
                  ) : calendarTargetDate && availableSlots.length ? (
                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            if (isPackageBooking && activePackageSlot === 2) {
                              setSelectedSecondTime(slot);
                            } else {
                              setSelectedTime(slot);
                            }
                            setBookingError("");
                            setBookingSuccess(null);
                            setRequestSuccessMessage("");
                            scrollToContinueActions();
                          }}
                          className={`rounded-[18px] border px-4 py-3 text-center text-[18px] font-medium transition sm:px-5 sm:py-4 sm:text-[24px] ${
                            calendarTargetTime === slot
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
                      {calendarTargetDate
                        ? "No slots are available for this day. Please choose another date."
                        : isRequestOnly
                          ? "Complete the request form and continue to send your legal session request."
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
            <h2 className="mb-3 text-[36px] font-bold text-[#2b2b2b]">
              {isRequestOnly
                ? "Review Your Session Request"
                : isPackageBooking
                  ? "Review Your Legal Package"
                  : isRescheduleMode
                    ? "Confirm Your Reschedule"
                    : "Confirm Your Booking"}
            </h2>
            <p className="mb-8 text-[16px] text-[#7e7e7e]">
              {isRequestOnly
                ? "Review the details you want us to send to the legal team."
                : isPackageBooking
                  ? "Review both requested legal consultation slots before sending your package request."
                  : isRescheduleMode
                    ? "Review the updated session details and confirm your new appointment time."
                    : "Review your session details and confirm your appointment."}
            </p>
            <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
              <div className="rounded-[32px] bg-white p-8 shadow-[0_18px_45px_rgba(29,25,22,0.06)]">
                <div className="mb-6 flex items-center gap-4">
                  {selectedPro ? (
                    <Image
                      src={selectedPro.image}
                      alt={selectedPro.name}
                      width={160}
                      height={160}
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
                    <p className="text-sm text-[#7e7e7e]">
                      {selectedPro?.specialty}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] bg-[#f7f5f4] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7e7e7e]">
                      Service
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#2b2b2b]">
                      {serviceCatalog.find(
                        (service) => service.slug === selectedService,
                      )?.title || "Not selected"}
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
                      {isRequestOnly ? "Request mode" : "Date"}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#2b2b2b]">
                      {isRequestOnly
                        ? "Manual coordination"
                        : selectedDate
                          ? formatLongDate(selectedDate)
                          : "Not selected"}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-[#f7f5f4] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7e7e7e]">
                      {isRequestOnly ? "Support note" : "Time"}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#2b2b2b]">
                      {isRequestOnly
                        ? "Request form submitted below"
                        : selectedTime || "Not selected"}
                    </p>
                  </div>
                  {isPackageBooking ? (
                    <>
                      <div className="rounded-[24px] bg-[#f7f5f4] p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7e7e7e]">
                          Second session date
                        </p>
                        <p className="mt-2 text-lg font-semibold text-[#2b2b2b]">
                          {selectedSecondDate
                            ? formatLongDate(selectedSecondDate)
                            : "Not selected"}
                        </p>
                      </div>
                      <div className="rounded-[24px] bg-[#f7f5f4] p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7e7e7e]">
                          Second session time
                        </p>
                        <p className="mt-2 text-lg font-semibold text-[#2b2b2b]">
                          {selectedSecondTime || "Not selected"}
                        </p>
                      </div>
                    </>
                  ) : null}
                  {isRequestOnly ? (
                    <div className="rounded-[24px] bg-[#f7f5f4] p-5 md:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7e7e7e]">
                        Request details
                      </p>
                      <p className="mt-2 text-base leading-7 text-[#2b2b2b]">
                        {requestForm.message || "No details added yet."}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[32px] bg-white p-8 shadow-[0_18px_45px_rgba(29,25,22,0.06)]">
                <h3 className="text-[28px] font-bold text-[#2b2b2b]">
                  {isRequestOnly || isPackageBooking
                    ? "Ready to send?"
                    : "Ready to confirm?"}
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-[#7e7e7e]">
                  {isRequestOnly
                    ? "We&apos;ll take this request to our legal support team and help coordinate the next step with the professional."
                    : isPackageBooking
                      ? "We&apos;ll send both requested legal package slots to our team for confirmation based on the professional&apos;s availability."
                      : isRescheduleMode
                        ? "We&apos;ll update your session on the live backend and refresh it in your client dashboard right after confirmation."
                        : "We&apos;ll create your session on the live backend and surface it in your client dashboard right after confirmation."}
                </p>

                {!isAuthenticated && !authLoading ? (
                  <div className="mt-6 rounded-[24px] border border-[#ffe0de] bg-[#fff4f3] p-5 text-sm text-[#694646]">
                    Please{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-[#f56969] underline"
                    >
                      log in
                    </Link>{" "}
                    as a client before confirming your booking.
                  </div>
                ) : null}

                {requestSuccessMessage ? (
                  <StatusBanner
                    tone="info"
                    className="mt-6"
                    title="Request ready"
                  >
                    {requestSuccessMessage}
                  </StatusBanner>
                ) : null}

                {bookingError ? (
                  <StatusBanner
                    tone="error"
                    className="mt-6"
                    title="Booking issue"
                  >
                    {bookingError}
                  </StatusBanner>
                ) : null}

                {bookingSuccess ? (
                  <StatusBanner
                    tone="success"
                    className="mt-6"
                    title={
                      isRescheduleMode
                        ? "Booking rescheduled"
                        : "Booking created"
                    }
                  >
                    <p>
                      {isRescheduleMode
                        ? "Booking rescheduled"
                        : "Booking created"}
                    </p>
                    <p className="mt-1">
                      Reference: {bookingSuccess.bookingId}
                    </p>
                    <p className="mt-1">
                      Scheduled for{" "}
                      {formatLongDate(new Date(bookingSuccess.scheduledAt))} at{" "}
                      {selectedTime}
                    </p>
                    {!isRescheduleMode ? (
                      <p className="mt-1">
                        Complete payment to automatically confirm this session.
                      </p>
                    ) : null}
                  </StatusBanner>
                ) : null}

                {paymentSuccessMessage ? (
                  <StatusBanner
                    tone="success"
                    className="mt-6"
                    title="Payment completed"
                  >
                    {paymentSuccessMessage}
                  </StatusBanner>
                ) : null}

                {!isRequestOnly &&
                !isRescheduleMode &&
                pricingBreakdown.basePrice ? (
                  <div className="mt-6 rounded-[24px] bg-[#f7f5f4] p-5">
                    <p className="text-sm font-semibold text-[#2b2b2b]">
                      Payment summary
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-[#6f6f6f]">
                      <div className="flex items-center justify-between">
                        <span>Session fee</span>
                        <span className="font-medium text-[#2b2b2b]">
                          {formatInr(pricingBreakdown.basePrice)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>GST (18%)</span>
                        <span className="font-medium text-[#2b2b2b]">
                          {formatInr(pricingBreakdown.gstAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#e7dfdc] pt-3 text-base">
                        <span className="font-semibold text-[#2b2b2b]">
                          Total due
                        </span>
                        <span className="font-semibold text-[#2b2b2b]">
                          {formatInr(pricingBreakdown.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}

                {paymentOrder ? (
                  <StatusBanner
                    tone="info"
                    className="mt-6"
                    title="Payment order initialized"
                  >
                    <p>Order ID: {paymentOrder.orderId}</p>
                    <p className="mt-1">
                      Amount: {formatInr(paymentOrder.amount / 100)}{" "}
                      {paymentOrder.currency}
                    </p>
                    <p className="mt-1">
                      Your Razorpay order is ready for secure checkout.
                    </p>
                  </StatusBanner>
                ) : null}

                {paymentError ? (
                  <StatusBanner
                    tone="error"
                    className="mt-6"
                    title="Payment setup unavailable"
                  >
                    {paymentError}
                  </StatusBanner>
                ) : null}

                <div className="mt-8 flex flex-col gap-4">
                  {isRequestOnly || isPackageBooking ? (
                    <button
                      type="button"
                      onClick={handleContinueLegalRequest}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-6 py-4 text-sm font-semibold text-white"
                    >
                      {isPackageBooking
                        ? "Continue To Package Request"
                        : "Send Session Request"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleConfirmBooking()}
                      disabled={
                        submitting || Boolean(bookingSuccess) || authLoading
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-6 py-4 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {submitting ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : null}
                      {bookingSuccess
                        ? isRescheduleMode
                          ? "Reschedule Confirmed"
                          : "Booking Created"
                        : isRescheduleMode
                          ? "Confirm Reschedule"
                          : "Confirm Booking"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={submitting}
                    className="rounded-full border border-[#2b2b2b] px-6 py-4 text-sm font-medium text-[#2b2b2b] disabled:opacity-40"
                  >
                    Back To Date &amp; Time
                  </button>
                  {!isRequestOnly &&
                  !isPackageBooking &&
                  !isRescheduleMode &&
                  bookingSuccess ? (
                    <button
                      type="button"
                      onClick={() => void handleStartPayment()}
                      disabled={creatingPaymentOrder}
                      className="rounded-full border border-[#ead9e8] px-6 py-4 text-sm font-medium text-[#2b2b2b] disabled:opacity-50"
                    >
                      {creatingPaymentOrder
                        ? "Preparing payment..."
                        : "Pay with Razorpay"}
                    </button>
                  ) : null}
                  {!isRequestOnly && !isPackageBooking && bookingSuccess ? (
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

        <div
          ref={continueActionsRef}
          className="mt-8 flex items-center justify-between gap-4 sm:mt-10"
        >
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(1, current - 1))}
            disabled={step === 1 || submitting || loadingRescheduleBooking}
            className="rounded-full border border-[#2b2b2b] px-5 py-3 text-sm font-medium text-[#2b2b2b] disabled:opacity-40 sm:px-6"
          >
            Back
          </button>
          <button
            ref={continueButtonRef}
            type="button"
            onClick={() => setStep((current) => Math.min(4, current + 1))}
            disabled={
              submitting ||
              loadingRescheduleBooking ||
              (step === 1 && !selectedService) ||
              (step === 2 && !selectedProfessional) ||
              (step === 3 && !canMoveToStepFour) ||
              step === 4
            }
            className="rounded-full bg-[#2b2b2b] px-5 py-3 text-sm font-medium text-white disabled:opacity-40 sm:px-6"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingPageFallback() {
  return (
    <div className="bg-[#f7f5f4] px-6 pb-24 pt-36 lg:px-[120px]">
      <div className="mx-auto flex min-h-[320px] max-w-[1440px] items-center justify-center rounded-[32px] bg-white shadow-sm">
        <div className="flex items-center gap-3 text-[#7e7e7e]">
          <LoaderCircle className="h-5 w-5 animate-spin text-[#f56969]" />
          <span className="text-sm font-medium">Loading booking flow...</span>
        </div>
      </div>
    </div>
  );
}

function RequestField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#2b2b2b]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[18px] border border-[#ead9e8] bg-[#f7f5f4] px-4 py-3 text-sm outline-none"
      />
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
  const firstDay = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1,
  );
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
    return (
      getFallbackSlotsForDate(date, fallbackProfile, fallbackSchedule).length >
      0
    );
  }

  return professional ? true : false;
}

function getLiveSlotsForDate(
  date: Date,
  availabilityData: LiveAvailabilityResponse,
) {
  const workingHours = availabilityData.availability?.workingHours;
  const blockedDates = availabilityData.availability?.blockedDates || [];
  const specialDates = availabilityData.availability?.specialDates || [];
  const bookedSlots = availabilityData.bookedSlots || [];

  if (!workingHours) return [];
  if (blockedDates.some((value) => isSameDay(new Date(value), date))) return [];

  const matchingSpecialDate = specialDates.find((entry) =>
    isSameDay(new Date(entry.date), date),
  );
  if (
    matchingSpecialDate &&
    ["off_day", "emergency_leave"].includes(matchingSpecialDate.type)
  ) {
    return [];
  }

  const dayKey = DAY_NAMES[date.getDay()].toLowerCase();
  const window =
    matchingSpecialDate?.type === "special_hours"
      ? {
          start: matchingSpecialDate.start,
          end: matchingSpecialDate.end,
        }
      : workingHours[dayKey];
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

  return buildSlotsFromRanges(
    ranges,
    date,
    bookedSlots.map((slot) => new Date(slot.start)),
  );
}

function buildFallbackAvailabilitySchedule(
  professional: ProfessionalProfile,
): AvailabilitySchedule {
  const base: AvailabilitySchedule = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };
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
    for (
      let minute = range.startMinutes;
      minute < range.endMinutes;
      minute += 60
    ) {
      const slotDate = new Date(date);
      slotDate.setHours(Math.floor(minute / 60), minute % 60, 0, 0);

      if (isTodayDate && slotDate <= now) continue;
      if (
        bookedStarts.some((booked) => booked.getTime() === slotDate.getTime())
      )
        continue;

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
  const matches = DAY_NAMES.map((name, index) => ({
    name: name.toLowerCase(),
    index,
  })).filter((day) => beforeColon.includes(day.name));

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
