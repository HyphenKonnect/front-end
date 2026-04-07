"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, LoaderCircle } from "lucide-react";
import {
  professionals,
  serviceCatalog,
  type ProfessionalProfile,
} from "../../components/site/data";
import { StatusBanner } from "../../components/ui/StatusBanner";
import { apiFetch, parseJsonResponse } from "../../lib/api";
import { formatInr } from "../../lib/formatting";
import { loadRazorpayScript, openRazorpayCheckout } from "../../lib/razorpay";
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

type TimeSlot = { start: string; end: string };
type WorkingHours = { start: string; end: string; slots?: TimeSlot[] };
type Availability = {
  timezone?: string;
  workingHours?: Record<string, WorkingHours>;
  blockedDates?: string[];
  specialDates?: Array<{
    date: string;
    type: "special_hours" | "off_day" | "emergency_leave";
    start?: string;
    end?: string;
  }>;
};

type ProfessionalData = ProfessionalProfile & {
  availability?: Availability;
  backendId?: string;
};

type BackendProfessionalRecord = {
  _id?: string;
  id?: string;
  name?: string;
  profile?: {
    specialisation?: string;
    serviceCategory?: ProfessionalProfile["category"];
  };
  availability?: Availability;
};

type BookingCreationResponse = {
  _id?: string;
  bookingId?: string;
  scheduledAt?: string;
};

type BookedSlotRecord = {
  start: string;
  end: string;
};

type BookingDetailsResponse = {
  _id: string;
  serviceId?: string;
  scheduledAt: string;
  professionalId?:
    | string
    | {
        _id?: string;
        id?: string;
        name?: string;
      };
};

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export default function BookingPage() {
  return (
    <Suspense fallback={<BookingPageFallback />}>
      <BookingPageContent />
    </Suspense>
  );
}

function BookingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const today = useMemo(() => startOfDay(new Date()), []);
  const timeSlotsRef = useRef<HTMLDivElement | null>(null);
  const continueButtonRef = useRef<HTMLButtonElement | null>(null);

  const initialService = searchParams.get("service") || "";
  const requestedProfessional = searchParams.get("professional") || "";
  const requestedBookingId = searchParams.get("bookingId") || "";

  // State
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedProfessional, setSelectedProfessional] = useState<
    string | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [directoryProfessionals, setDirectoryProfessionals] = useState<
    ProfessionalData[]
  >([]);
  const [loadingProfessionals, setLoadingProfessionals] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<{
    bookingId: string;
    scheduledAt: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<BookedSlotRecord[]>([]);
  const [requestedBooking, setRequestedBooking] =
    useState<BookingDetailsResponse | null>(null);

  const expectedCategory = useMemo(() => {
    if (selectedService === "mental-wellness") return "therapist";
    if (selectedService === "medical-consultation") return "doctor";
    if (selectedService === "legal-guidance") return "legal";
    if (selectedService === "wellness-programs") return "wellness";
    return null;
  }, [selectedService]);

  console.log("🎯 Booking Page Loaded");
  console.log("Selected Professional:", selectedProfessional);
  console.log(
    "Selected Professional Data:",
    selectedProfessional
      ? directoryProfessionals.find(
          (p) => String(p.id) === selectedProfessional,
        )
      : null,
  );

  // ============================================================
  // FETCH PROFESSIONALS WITH AVAILABILITY
  // ============================================================
  useEffect(() => {
    if (!selectedService) return;

    let cancelled = false;
    setLoadingProfessionals(true);

    const loadProfessionals = async () => {
      try {
        // Get local professionals first
        const localProfs = professionals
          .filter((prof) => {
          if (selectedService === "mental-wellness")
            return prof.category === "therapist";
          if (selectedService === "medical-consultation")
            return prof.category === "doctor";
          if (selectedService === "legal-guidance")
            return prof.category === "legal";
          if (selectedService === "wellness-programs")
            return prof.category === "wellness";
          return false;
          })
          .map((prof) => ({
            ...prof,
            availability: createAvailabilityFromProfile(prof),
          })) as ProfessionalData[];

        // Service to backend category mapping
        const serviceMap: Record<string, string> = {
          "mental-wellness": "therapist",
          "medical-consultation": "doctor",
          "legal-guidance": "legal",
          "wellness-programs": "wellness",
        };

        const category = serviceMap[selectedService];
        if (!category) {
          if (!cancelled)
            setDirectoryProfessionals(localProfs);
          return;
        }

        try {
          // Fetch from backend
          const response = await apiFetch(
            `/api/professionals?category=${category}`,
          );
          const backendData =
            await parseJsonResponse<BackendProfessionalRecord[]>(response);

          console.log("📊 Backend Data Received:", backendData);

          if (
            !cancelled &&
            Array.isArray(backendData) &&
            backendData.length > 0
          ) {
            // Merge live backend records into the curated local directory so
            // partial backend data does not replace the full catalogue.
            const mappedProfs = backendData
              .map((prof) => {
                const localMatch = professionals.find(
                  (p) => p.name.toLowerCase() === prof.name?.toLowerCase(),
                );

                const normalizedAvailability =
                  normalizeAvailability(prof.availability) ||
                  (localMatch
                    ? createAvailabilityFromProfile(localMatch)
                    : undefined);

                console.log(`🔍 Professional: ${prof.name}`);
                console.log(
                  `   Availability:`,
                  normalizedAvailability?.workingHours,
                );

                return {
                  ...(localMatch || {
                    id: prof._id || prof.id,
                    slug: prof.name?.toLowerCase().replace(/\s+/g, "-"),
                    name: prof.name || "Unknown",
                    specialty: prof.profile?.specialisation || "Specialist",
                    category: prof.profile?.serviceCategory || category,
                    image: "/brand-logo.png",
                    rating: 0,
                    reviews: 0,
                    experience: "Professional",
                    rate: "Contact for pricing",
                    available: true,
                    intro: "Professional",
                    about: [],
                    qualifications: [],
                    expertise: [],
                    approach: "Professional approach",
                    languages: ["English", "Hindi"],
                  }),
                  backendId: prof._id,
                  availability: normalizedAvailability,
                } as ProfessionalData;
              })
              .filter(Boolean);

            const mergedByName = new Map<string, ProfessionalData>();

            for (const professional of localProfs) {
              mergedByName.set(
                normalizeProfessionalName(professional.name),
                professional,
              );
            }

            for (const professional of mappedProfs) {
              mergedByName.set(
                normalizeProfessionalName(professional.name),
                professional,
              );
            }

            setDirectoryProfessionals(Array.from(mergedByName.values()));
          } else {
            setDirectoryProfessionals(localProfs);
          }
        } catch {
          console.log("API error, using local professionals");
          setDirectoryProfessionals(localProfs);
        }
      } finally {
        if (!cancelled) setLoadingProfessionals(false);
      }
    };

    loadProfessionals();
    return () => {
      cancelled = true;
    };
  }, [selectedService]);

  const professionalOptions = useMemo(() => {
    if (!expectedCategory) return directoryProfessionals;

    return directoryProfessionals.filter(
      (professional) => professional.category === expectedCategory,
    );
  }, [directoryProfessionals, expectedCategory]);

  const selectedPro = useMemo(
    () =>
      professionalOptions.find((p) => String(p.id) === selectedProfessional) ??
      null,
    [professionalOptions, selectedProfessional],
  );

  useEffect(() => {
    if (!requestedProfessional || !professionalOptions.length || selectedProfessional) {
      return;
    }

    const normalizedRequested = normalizeProfessionalName(requestedProfessional);
    const matchedProfessional = professionalOptions.find(
      (professional) =>
        professional.slug === requestedProfessional ||
        normalizeProfessionalName(professional.name) === normalizedRequested,
    );

    if (!matchedProfessional) return;

    setSelectedProfessional(String(matchedProfessional.id));
    setStep(2);
  }, [professionalOptions, requestedProfessional, selectedProfessional]);

  useEffect(() => {
    if (!requestedBooking || !professionalOptions.length) return;

    const requestedProfessionalId =
      typeof requestedBooking.professionalId === "object"
        ? requestedBooking.professionalId?._id ||
          requestedBooking.professionalId?.id
        : requestedBooking.professionalId;

    if (!requestedProfessionalId) return;

    const matchedProfessional = professionalOptions.find(
      (professional) => professional.backendId === requestedProfessionalId,
    );

    if (!matchedProfessional) return;

    const scheduledAt = new Date(requestedBooking.scheduledAt);

    setSelectedProfessional(String(matchedProfessional.id));
    setSelectedDate(startOfDay(scheduledAt));
    setSelectedTime(formatTime(scheduledAt.getHours(), scheduledAt.getMinutes()));
    setVisibleMonth(new Date(scheduledAt.getFullYear(), scheduledAt.getMonth(), 1));
    setStep(3);
  }, [professionalOptions, requestedBooking]);

  console.log("Selected Professional Object:", selectedPro);
  console.log("Availability Data:", selectedPro?.availability);

  const calendarDays = useMemo(
    () => buildCalendarDays(visibleMonth),
    [visibleMonth],
  );

  useEffect(() => {
    if (!selectedPro?.backendId) {
      setBookedSlots([]);
      return;
    }

    let cancelled = false;

    const calendarStart = calendarDays[0];
    const calendarEnd = calendarDays[calendarDays.length - 1];
    if (!calendarStart || !calendarEnd) return;

    const loadBookedSlots = async () => {
      try {
        const params = new URLSearchParams({
          startDate: calendarStart.toISOString(),
          endDate: new Date(
            calendarEnd.getFullYear(),
            calendarEnd.getMonth(),
            calendarEnd.getDate(),
            23,
            59,
            59,
            999,
          ).toISOString(),
        });

        if (requestedBookingId) {
          params.set("excludeBookingId", requestedBookingId);
        }

        const response = await apiFetch(
          `/api/professionals/${selectedPro.backendId}/availability?${params.toString()}`,
        );
        const data = await parseJsonResponse<{
          bookedSlots?: BookedSlotRecord[];
        }>(response);

        if (!cancelled) {
          setBookedSlots(data.bookedSlots || []);
        }
      } catch {
        if (!cancelled) {
          setBookedSlots([]);
        }
      }
    };

    void loadBookedSlots();

    return () => {
      cancelled = true;
    };
  }, [calendarDays, requestedBookingId, selectedPro?.backendId]);

  useEffect(() => {
    if (step === 4 && isAuthenticated) {
      void loadRazorpayScript();
    }
  }, [isAuthenticated, step]);

  useEffect(() => {
    if (!requestedBookingId || !isAuthenticated) return;

    let cancelled = false;

    const loadRequestedBooking = async () => {
      try {
        const response = await apiFetch(`/api/bookings/${requestedBookingId}`);
        const booking = await parseJsonResponse<BookingDetailsResponse>(response);

        if (cancelled) return;

        setRequestedBooking(booking);
        if (booking.serviceId) {
          setSelectedService(booking.serviceId);
        }
      } catch (error) {
        if (!cancelled) {
          setBookingError(
            error instanceof Error
              ? error.message
              : "Could not load the booking you are trying to reschedule.",
          );
        }
      }
    };

    void loadRequestedBooking();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, requestedBookingId]);

  // ============================================================
  // CHECK IF DATE IS WORKING DAY - THIS IS THE KEY FUNCTION
  // ============================================================
  const isDateWorkingDay = (date: Date): boolean => {
    // Can't book in the past
    if (date < today) {
      console.log(`❌ ${formatLongDate(date)}: In the past`);
      return false;
    }

    // If no professional selected, can't determine
    if (!selectedPro) {
      console.log(`❌ ${formatLongDate(date)}: No professional selected`);
      return false;
    }

    // If no availability data, allow all days
    if (!selectedPro.availability?.workingHours) {
      console.log(`⚠️ ${formatLongDate(date)}: No availability data, allowing`);
      return true;
    }

    const availability = selectedPro.availability;
    const dayName = DAY_NAMES[date.getDay()].toLowerCase();

    console.log(
      `📅 Checking ${formatLongDate(date)} (${DAY_NAMES[date.getDay()]})`,
    );
    console.log(`   Day name to check: "${dayName}"`);
    console.log(
      `   Available days:`,
      Object.keys(availability.workingHours || {}),
    );

    const workingHours = availability.workingHours?.[dayName];

    // If no working hours for this day, it's not a working day
    if (!hasWorkingWindow(workingHours)) {
      console.log(`❌ No working hours for ${dayName}`);
      return false;
    }

    console.log(`✅ ${dayName} has working hours:`, workingHours);

    const dateAvailableSlots = getAvailableSlotsForDate(
      date,
      availability,
      bookedSlots,
    );
    if (dateAvailableSlots.length === 0) {
      console.log(`❌ ${formatLongDate(date)}: No remaining bookable slots`);
      return false;
    }

    // Check blocked dates
    if (availability.blockedDates) {
      const dateStr = date.toISOString().split("T")[0];
      if (availability.blockedDates.includes(dateStr)) {
        console.log(`❌ Date is blocked: ${dateStr}`);
        return false;
      }
    }

    // Check special dates (off days)
    if (availability.specialDates) {
      const dateStr = date.toISOString().split("T")[0];
      const specialDate = availability.specialDates.find(
        (sd) => sd.date === dateStr,
      );
      if (
        specialDate?.type === "off_day" ||
        specialDate?.type === "emergency_leave"
      ) {
        console.log(`❌ Special off day: ${dateStr}`);
        return false;
      }
    }

    console.log(`✅ ${formatLongDate(date)} is a working day!`);
    return true;
  };

  // ============================================================
  // GET TIME SLOTS FOR SELECTED DATE
  // ============================================================
  const availableSlots = useMemo(() => {
    if (!selectedDate || !selectedPro?.availability) {
      console.log("No date or availability selected");
      return [];
    }

    return getAvailableSlotsForDate(
      selectedDate,
      selectedPro.availability,
      bookedSlots,
    );
  }, [bookedSlots, selectedDate, selectedPro?.availability]);

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleConfirmBooking = async () => {
    if (!selectedPro || !selectedDate || !selectedTime) return;

    if (!isAuthenticated) {
      setBookingError("Please log in before confirming.");
      return;
    }

    try {
      setSubmitting(true);
      setBookingError("");
      setBookingSuccess(null);

      const scheduledAt = combineDateAndTime(selectedDate, selectedTime);
      if (!selectedPro.backendId) {
        throw new Error(
          `${selectedPro.name} is not yet available for live booking. Please choose a professional with live availability.`,
        );
      }

      if (requestedBookingId) {
        const rescheduleResponse = await apiFetch(
          `/api/bookings/${requestedBookingId}/reschedule`,
          {
            method: "PATCH",
            body: JSON.stringify({
              professionalId: selectedPro.backendId,
              serviceId: selectedService,
              scheduledAt: scheduledAt.toISOString(),
            }),
          },
        );

        const rescheduled = await parseJsonResponse<{
          booking?: { _id?: string; scheduledAt?: string };
        }>(rescheduleResponse);
        const bookingId = rescheduled.booking?._id || requestedBookingId;

        setBookingSuccess({
          bookingId,
          scheduledAt:
            rescheduled.booking?.scheduledAt || scheduledAt.toISOString(),
        });
        router.push(
          `/dashboard/client?bookingId=${encodeURIComponent(bookingId)}&status=rescheduled`,
        );
        return;
      }

      const response = await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          professionalId: selectedPro.backendId,
          serviceId: selectedService,
          scheduledAt: scheduledAt.toISOString(),
        }),
      });

      const data = await parseJsonResponse<BookingCreationResponse>(response);
      const bookingId = data.bookingId || data._id;
      if (!bookingId) {
        throw new Error("Booking was created but no booking ID was returned.");
      }

      try {
        const orderResponse = await apiFetch("/api/payments/create-order", {
          method: "POST",
          body: JSON.stringify({ bookingId }),
        });

        const order = await parseJsonResponse<{
          bookingId: string | null;
          orderId: string;
          amount: number;
          currency: string;
          key: string;
        }>(orderResponse);

        await openRazorpayCheckout({
          order: {
            bookingId: order.bookingId || bookingId,
            orderId: order.orderId,
            amount: order.amount,
            currency: order.currency,
            key: order.key,
          },
          name: "The Hyphen Konnect",
          description: `${
            serviceCatalog.find((service) => service.slug === selectedService)
              ?.title || "Session"
          } session`,
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.phone,
          },
          onSuccess: async (paymentResponse) => {
            const verifyResponse = await apiFetch("/api/payments/verify", {
              method: "POST",
              body: JSON.stringify({
                bookingId,
                orderId: paymentResponse.razorpay_order_id,
                paymentId: paymentResponse.razorpay_payment_id,
                signature: paymentResponse.razorpay_signature,
              }),
            });

            const verification = await parseJsonResponse<{
              success: boolean;
              method?: string;
            }>(verifyResponse);

            const confirmResponse = await apiFetch(`/api/bookings/${bookingId}/confirm`, {
              method: "PATCH",
              body: JSON.stringify({
                paymentId: paymentResponse.razorpay_payment_id,
                paymentMethod: verification.method || "upi",
                orderId: paymentResponse.razorpay_order_id,
                signature: paymentResponse.razorpay_signature,
              }),
            });
            await parseJsonResponse(confirmResponse);

            setBookingSuccess({
              bookingId,
              scheduledAt: data.scheduledAt || scheduledAt.toISOString(),
            });
            router.push(
              `/dashboard/client?bookingId=${encodeURIComponent(bookingId)}&status=confirmed`,
            );
          },
          onFailure: (message) => {
            setBookingError(message);
          },
          onDismiss: () => {
            setBookingError(
              "Payment window closed before completion. Your booking is pending payment in the dashboard.",
            );
            router.push(
              `/dashboard/client?bookingId=${encodeURIComponent(bookingId)}&action=pay&status=booked`,
            );
          },
        });
      } catch (paymentError) {
        const message =
          paymentError instanceof Error
            ? paymentError.message
            : "Payment setup failed. Continue payment from the dashboard.";

        setBookingError(message);
        router.push(
          `/dashboard/client?bookingId=${encodeURIComponent(bookingId)}&action=pay&status=booked`,
        );
      }
    } catch (error) {
      setBookingError(
        error instanceof Error ? error.message : "Could not create booking.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToTimeSlots = () => {
    timeSlotsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToContinueButton = () => {
    continueButtonRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const pricingBreakdown = useMemo(() => {
    const rateText = selectedPro?.rate || "";
    const numericMatch = rateText.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
    const basePrice = numericMatch ? Number(numericMatch[1]) : 0;
    const gstAmount = Number((basePrice * 0.18).toFixed(2));
    const total = Number((basePrice + gstAmount).toFixed(2));
    return { basePrice, gstAmount, total };
  }, [selectedPro?.rate]);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-[#f7f5f4] pt-28">
      {/* Step Indicator */}
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

      {/* Main Content */}
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-12">
        {/* Step 1: Select Service */}
        {step === 1 ? (
          <>
            <h2 className="mb-3 text-[36px] font-bold text-[#2b2b2b]">
              Select Your Service
            </h2>
            <p className="mb-8 text-[16px] text-[#7e7e7e]">
              Choose what you need.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {serviceCatalog.map((service) => (
                <button
                  key={service.slug}
                  onClick={() => {
                    setSelectedService(service.slug);
                    setSelectedProfessional(null);
                    setSelectedDate(null);
                    setSelectedTime("");
                    setBookingError("");
                    setBookingSuccess(null);
                    requestAnimationFrame(scrollToContinueButton);
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

        {/* Step 2: Choose Professional */}
        {step === 2 ? (
          <>
            <h2 className="mb-3 text-[36px] font-bold text-[#2b2b2b]">
              Choose Professional
            </h2>
            <p className="mb-3 text-[16px] text-[#7e7e7e]">
              Select a professional.
            </p>
            {loadingProfessionals ? (
              <div className="flex items-center justify-center gap-3 py-12">
                <LoaderCircle className="h-5 w-5 animate-spin text-[#f56969]" />
                <span className="text-sm text-[#7e7e7e]">
                  Loading professionals...
                </span>
              </div>
            ) : professionalOptions.length === 0 ? (
              <div className="rounded-[24px] border-2 border-dashed border-[#ecd8d5] bg-[#fcf9f8] px-6 py-12 text-center text-[#7e7e7e]">
                No professionals available.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {professionalOptions.map((pro) => (
                  <button
                    key={pro.id}
                    disabled={!pro.backendId}
                    onClick={() => {
                      console.log("Selected professional:", pro.name);
                      console.log(
                        "Professional availability:",
                        pro.availability,
                      );
                      setSelectedProfessional(String(pro.id));
                      setSelectedDate(null);
                      setSelectedTime("");
                      requestAnimationFrame(scrollToContinueButton);
                    }}
                    className={`overflow-hidden rounded-[24px] bg-white text-left transition-all ${
                      selectedProfessional === String(pro.id)
                        ? "border-2 border-[#f56969] shadow-lg"
                        : "border border-[#e9e2df]"
                    } ${!pro.backendId ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    <div className="bg-[#f4efeb] p-3">
                      {pro.image && !pro.image.includes("brand-logo") ? (
                        <Image
                          src={pro.image}
                          alt={pro.name}
                          width={900}
                          height={600}
                          className="h-[220px] w-full rounded-[18px] object-cover"
                        />
                      ) : (
                        <div className="h-[220px] w-full rounded-[18px] bg-gradient-to-br from-[#f5912d] via-[#f56969] to-[#e6b9e6] flex items-center justify-center">
                          <span className="text-[80px] font-bold text-white opacity-80">
                            {pro.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 pt-5">
                      <h3 className="text-[22px] font-bold text-[#2b2b2b]">
                        {pro.name}
                      </h3>
                      <p className="mt-2 text-[14px] font-medium text-[#f56969]">
                        {pro.specialty}
                      </p>
                      <p className="mt-2 text-[14px] text-[#7e7e7e]">
                        {pro.experience}
                      </p>
                      <p className="mt-1 font-semibold text-[#2b2b2b]">
                        {pro.rate}
                      </p>
                      {!pro.backendId ? (
                        <p className="mt-3 text-[12px] font-medium text-[#b36b62]">
                          Booking not live yet for this professional.
                        </p>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : null}

        {/* Step 3: Pick Date & Time */}
        {step === 3 ? (
          <>
            <h2 className="mb-8 text-[36px] font-bold text-[#2b2b2b]">
              Pick Date & Time
            </h2>
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.95fr] xl:gap-8">
              {/* Calendar */}
              <div className="rounded-[28px] bg-white p-4 shadow-sm sm:rounded-[32px] sm:p-8">
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
                    options={Array.from({ length: 3 }, (_, i) => ({
                      label: String(today.getFullYear() + i),
                      value: today.getFullYear() + i,
                    }))}
                  />
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium sm:gap-3">
                  {WEEKDAY_LABELS.map((label) => (
                    <div key={label} className="py-2 text-[#344256]">
                      {label}
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-7 gap-2 sm:gap-3">
                  {calendarDays.map((day) => {
                    const inMonth = isSameMonth(day, visibleMonth);
                    const isSelectable = isDateWorkingDay(day);
                    const isSelected = selectedDate
                      ? isSameDay(day, selectedDate)
                      : false;

                    return (
                      <button
                        key={day.toISOString()}
                        disabled={!isSelectable}
                        onClick={() => {
                          setSelectedDate(day);
                          setSelectedTime("");
                          requestAnimationFrame(scrollToTimeSlots);
                        }}
                        className={`relative rounded-[14px] border text-[22px] font-medium transition h-[52px] sm:h-[72px] ${
                          isSelected
                            ? "border-[#f56a6a] bg-[#f56a6a] text-white"
                            : isSelectable
                              ? "border-[#ff9d96] bg-[#fff8f8] text-[#243447] hover:bg-[#fff0ef] cursor-pointer"
                              : "border-transparent bg-[#e8e8e8] text-[#a0a0a0] cursor-not-allowed"
                        } ${!inMonth ? "opacity-40" : ""}`}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div
                ref={timeSlotsRef}
                className="rounded-[28px] bg-white p-5 shadow-sm sm:rounded-[32px] sm:p-8"
              >
                <h3 className="text-[22px] font-bold text-[#2b2b2b] sm:text-[28px]">
                  Available Time Slots
                </h3>
                <p className="mt-2 text-sm text-[#7e7e7e]">
                  {selectedDate
                    ? formatLongDate(selectedDate)
                    : "Select a working day."}
                </p>

                {selectedDate && availableSlots.length > 0 ? (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => {
                          setSelectedTime(slot);
                          requestAnimationFrame(scrollToContinueButton);
                        }}
                        className={`rounded-[18px] border px-4 py-3 text-center font-medium transition ${
                          selectedTime === slot
                            ? "border-[#f56a6a] bg-[#f56a6a] text-white"
                            : "border-transparent bg-[#f4f0ee] text-[#1f2d3d] hover:bg-[#ffe9e7] cursor-pointer"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : selectedDate ? (
                  <div className="mt-6 rounded-[24px] border border-dashed border-[#ecd8d5] bg-[#fcf9f8] px-6 py-8 text-center text-[#7e7e7e]">
                    No available slots for this day.
                  </div>
                ) : (
                  <div className="mt-6 rounded-[24px] border border-dashed border-[#ecd8d5] bg-[#fcf9f8] px-6 py-8 text-center text-[#7e7e7e]">
                    Choose a working day to see available times.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}

        {/* Step 4: Confirm */}
        {step === 4 ? (
          <>
            <h2 className="mb-8 text-[36px] font-bold text-[#2b2b2b]">
              Confirm Booking
            </h2>
            <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
              <div className="rounded-[32px] bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-4">
                  {selectedPro ? (
                    selectedPro.image &&
                    !selectedPro.image.includes("brand-logo") ? (
                      <Image
                        src={selectedPro.image}
                        alt={selectedPro.name}
                        width={160}
                        height={160}
                        className="h-20 w-20 rounded-[24px] object-cover"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-[24px] bg-gradient-to-br from-[#f5912d] via-[#f56969] to-[#e6b9e6] flex items-center justify-center">
                        <span className="text-[32px] font-bold text-white">
                          {selectedPro.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    )
                  ) : null}
                  <div>
                    <p className="text-sm font-medium text-[#f56969]">
                      Summary
                    </p>
                    <h3 className="text-[28px] font-bold text-[#2b2b2b]">
                      {selectedPro?.name}
                    </h3>
                    <p className="text-sm text-[#7e7e7e]">
                      {selectedPro?.specialty}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] bg-[#f7f5f4] p-5">
                    <p className="text-xs font-semibold text-[#7e7e7e]">
                      Service
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[#2b2b2b]">
                      {
                        serviceCatalog.find((s) => s.slug === selectedService)
                          ?.title
                      }
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-[#f7f5f4] p-5">
                    <p className="text-xs font-semibold text-[#7e7e7e]">Fee</p>
                    <p className="mt-2 text-lg font-semibold text-[#2b2b2b]">
                      {selectedPro?.rate}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-[#f7f5f4] p-5">
                    <p className="text-xs font-semibold text-[#7e7e7e]">Date</p>
                    <p className="mt-2 text-lg font-semibold text-[#2b2b2b]">
                      {selectedDate
                        ? formatLongDate(selectedDate)
                        : "Not selected"}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-[#f7f5f4] p-5">
                    <p className="text-xs font-semibold text-[#7e7e7e]">Time</p>
                    <p className="mt-2 text-lg font-semibold text-[#2b2b2b]">
                      {selectedTime || "Not selected"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] bg-white p-8 shadow-sm">
                <h3 className="text-[28px] font-bold text-[#2b2b2b]">Ready?</h3>

                {!isAuthenticated && !authLoading ? (
                  <div className="mt-6 rounded-[24px] border border-[#ffe0de] bg-[#fff4f3] p-5 text-sm text-[#694646]">
                    Please{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-[#f56969]"
                    >
                      log in
                    </Link>{" "}
                    first.
                  </div>
                ) : null}

                {bookingError ? (
                  <StatusBanner tone="error" className="mt-6" title="Error">
                    {bookingError}
                  </StatusBanner>
                ) : null}

                {bookingSuccess ? (
                  <StatusBanner
                    tone="success"
                    className="mt-6"
                    title="Success!"
                  >
                    <p>
                      {requestedBookingId
                        ? "Booking rescheduled!"
                        : "Booking confirmed!"}{" "}
                      ID: {bookingSuccess.bookingId}
                    </p>
                  </StatusBanner>
                ) : null}

                {pricingBreakdown.basePrice > 0 ? (
                  <div className="mt-6 rounded-[24px] bg-[#f7f5f4] p-5">
                    <p className="text-sm font-semibold text-[#2b2b2b]">
                      Payment
                    </p>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#6f6f6f]">Session</span>
                        <span className="font-medium">
                          {formatInr(pricingBreakdown.basePrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6f6f6f]">GST (18%)</span>
                        <span className="font-medium">
                          {formatInr(pricingBreakdown.gstAmount)}
                        </span>
                      </div>
                      <div className="border-t border-[#e7dfdc] pt-3 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatInr(pricingBreakdown.total)}</span>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-col gap-4">
                  <button
                    onClick={() => void handleConfirmBooking()}
                    disabled={submitting || !!bookingSuccess || authLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-6 py-4 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {submitting ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : null}
                    {bookingSuccess
                      ? requestedBookingId
                        ? "Rescheduled"
                        : "Confirmed"
                      : requestedBookingId
                        ? "Reschedule Booking"
                        : "Proceed to Pay"}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="rounded-full border border-[#2b2b2b] px-6 py-4 text-sm font-medium text-[#2b2b2b]"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-4 sm:mt-10">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1 || submitting}
            className="rounded-full border border-[#2b2b2b] px-5 py-3 text-sm font-medium text-[#2b2b2b] disabled:opacity-40"
          >
            Back
          </button>
          <button
            ref={continueButtonRef}
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            disabled={
              submitting ||
              (step === 1 && !selectedService) ||
              (step === 2 && !selectedProfessional) ||
              (step === 3 && (!selectedDate || !selectedTime)) ||
              step === 4
            }
            className="rounded-full bg-[#2b2b2b] px-5 py-3 text-sm font-medium text-white disabled:opacity-40"
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
    <div className="min-h-screen flex items-center justify-center bg-[#f7f5f4]">
      <div className="flex gap-3">
        <LoaderCircle className="h-5 w-5 animate-spin text-[#f56969]" />
        <span className="text-[#7e7e7e]">Loading...</span>
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
  const defaultOptions = MONTH_NAMES.map((label, idx) => ({
    label,
    value: idx,
  }));

  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="rounded-[14px] border border-[#d9dde7] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none"
    >
      {(options || defaultOptions).map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

// Utilities
function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function buildCalendarDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7));

  return Array.from({ length: 42 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return day;
  });
}

function formatTime(hour: number, min: number = 0): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  const m = String(min).padStart(2, "0");
  return `${h}:${m} ${period}`;
}

function formatLongDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function combineDateAndTime(date: Date, time: string): Date {
  const [timeStr, period] = time.split(" ");
  const [h, m] = timeStr.split(":").map(Number);
  let hour24 = h;

  if (period === "PM" && h !== 12) hour24 += 12;
  if (period === "AM" && h === 12) hour24 = 0;

  const result = new Date(date);
  result.setHours(hour24, m, 0, 0);
  return result;
}

function normalizeAvailability(
  availability?: Availability | null,
): Availability | undefined {
  if (!availability) return undefined;

  return {
    timezone: availability.timezone,
    workingHours: availability.workingHours || {},
    blockedDates:
      availability.blockedDates?.map((value) => normalizeDateString(value)) ||
      [],
    specialDates:
      availability.specialDates?.map((entry) => ({
        ...entry,
        date: normalizeDateString(entry.date),
      })) || [],
  };
}

function createAvailabilityFromProfile(
  professional: ProfessionalProfile,
): Availability | undefined {
  const workingHours = buildWorkingHoursFromText(
    professional.workingHours,
    professional.daysOff,
  );

  if (!workingHours) return undefined;

  return {
    timezone: "Asia/Kolkata",
    workingHours,
    blockedDates: [],
    specialDates: [],
  };
}

function buildWorkingHoursFromText(
  workingHoursText?: string,
  daysOffText?: string,
): Record<string, WorkingHours> | undefined {
  if (!workingHoursText?.trim()) return undefined;

  const workingHours: Record<string, WorkingHours> = {};
  const allowedDays = new Set<number>([0, 1, 2, 3, 4, 5, 6]);

  for (const day of parseDaysOffText(daysOffText)) {
    allowedDays.delete(day);
  }

  const segments = workingHoursText
    .split(";")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (!segments.length) return undefined;

  let hasExplicitDays = false;

  for (const segment of segments) {
    const slots = parseTimeRangesFromText(segment);
    if (!slots.length) continue;

    const days = parseDaysFromSegmentText(segment, allowedDays);
    if (days.length) {
      hasExplicitDays = true;
      for (const day of days) {
        workingHours[DAY_KEYS[day]] = createWorkingWindow(slots);
      }
      continue;
    }

    for (const day of allowedDays) {
      workingHours[DAY_KEYS[day]] = createWorkingWindow(slots);
    }
  }

  if (!hasExplicitDays && segments.length === 1) {
    const slots = parseTimeRangesFromText(segments[0]);
    for (const day of allowedDays) {
      workingHours[DAY_KEYS[day]] = createWorkingWindow(slots);
    }
  }

  return Object.keys(workingHours).length ? workingHours : undefined;
}

function createWorkingWindow(slots: TimeSlot[]): WorkingHours {
  return {
    start: slots[0].start,
    end: slots[slots.length - 1].end,
    slots,
  };
}

function hasWorkingWindow(workingHours?: WorkingHours | null) {
  if (!workingHours) return false;
  if (workingHours.slots?.length) return true;

  return Boolean(workingHours.start && workingHours.end);
}

function getAvailableSlotsForDate(
  date: Date,
  availability: Availability,
  bookedSlots: BookedSlotRecord[],
) {
  const dayName = DAY_NAMES[date.getDay()].toLowerCase();
  const workingHours = availability.workingHours?.[dayName];

  console.log(`🕐 Getting slots for ${DAY_NAMES[date.getDay()]}:`);
  console.log("   Working hours:", workingHours);

  if (!workingHours || !hasWorkingWindow(workingHours)) {
    console.log("No working hours found");
    return [];
  }

  const slots: string[] = [];
  const now = new Date();
  const isToday = isSameDay(date, now);
  const blockedSlotTimes = new Set(
    bookedSlots
      .map((slot) => new Date(slot.start))
      .filter((slotDate) => !Number.isNaN(slotDate.getTime()) && isSameDay(slotDate, date))
      .map((slotDate) => formatTime(slotDate.getHours(), slotDate.getMinutes())),
  );

  if (workingHours.slots && workingHours.slots.length > 0) {
    console.log("Using predefined slots:", workingHours.slots);

    workingHours.slots.forEach((slot) => {
      const [startHour, startMin] = slot.start.split(":").map(Number);
      const [endHour, endMin] = slot.end.split(":").map(Number);

      let currentHour = startHour;
      let currentMin = startMin;

      while (
        currentHour < endHour ||
        (currentHour === endHour && currentMin < endMin)
      ) {
        const slotTime = formatTime(currentHour, currentMin);
        const slotDate = new Date(date);
        slotDate.setHours(currentHour, currentMin, 0, 0);

        if (isToday && slotDate <= now) {
          currentMin += 60;
          if (currentMin >= 60) {
            currentMin -= 60;
            currentHour += 1;
          }
          continue;
        }

        if (!blockedSlotTimes.has(slotTime)) {
          slots.push(slotTime);
          console.log(`   ✅ Added slot: ${slotTime}`);
        }

        currentMin += 60;
        if (currentMin >= 60) {
          currentMin -= 60;
          currentHour += 1;
        }
      }
    });

    console.log(`Total slots: ${slots.length}`);
    return slots;
  }

  const [startHour] = workingHours.start.split(":").map(Number);
  const [endHour] = workingHours.end.split(":").map(Number);

  console.log(
    `Generating hourly slots from ${workingHours.start} to ${workingHours.end}`,
  );

  for (let hour = startHour; hour < endHour; hour++) {
    const slotTime = formatTime(hour, 0);
    const slotDate = new Date(date);
    slotDate.setHours(hour, 0, 0, 0);

    if (isToday && slotDate <= now) continue;
    if (blockedSlotTimes.has(slotTime)) continue;

    slots.push(slotTime);
    console.log(`   ✅ Added slot: ${slotTime}`);
  }

  console.log(`Total slots: ${slots.length}`);
  return slots;
}

function parseDaysOffText(input = "") {
  const normalized = input.toLowerCase();
  const days = new Set<number>();

  if (normalized.includes("weekends")) {
    days.add(0);
    days.add(6);
  }

  DAY_KEYS.forEach((name, index) => {
    if (normalized.includes(name)) {
      days.add(index);
    }
  });

  return Array.from(days);
}

function parseDaysFromSegmentText(
  segment: string,
  allowedDays: Set<number>,
) {
  const normalized = segment.toLowerCase();

  if (normalized.includes("weekdays")) {
    return [1, 2, 3, 4, 5].filter((day) => allowedDays.has(day));
  }

  if (normalized.includes("weekends")) {
    return [0, 6].filter((day) => allowedDays.has(day));
  }

  const beforeColon = segment.split(":")[0]?.toLowerCase() || normalized;
  const matches = DAY_KEYS.map((name, index) => ({ name, index })).filter(
    (day) => beforeColon.includes(day.name),
  );

  if (matches.length >= 2 && beforeColon.includes("to")) {
    const start = matches[0].index;
    const end = matches[matches.length - 1].index;
    return expandDayRange(start, end).filter((day) => allowedDays.has(day));
  }

  return matches
    .map((item) => item.index)
    .filter((day) => allowedDays.has(day));
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

function parseTimeRangesFromText(segment: string): TimeSlot[] {
  const pattern =
    /(\d{1,2}(?::\d{2})?\s*[APap][Mm])\s*-\s*(\d{1,2}(?::\d{2})?\s*[APap][Mm])/g;
  const ranges: TimeSlot[] = [];
  let match = pattern.exec(segment);

  while (match) {
    ranges.push({
      start: normalizeClockTime(match[1]),
      end: normalizeClockTime(match[2]),
    });
    match = pattern.exec(segment);
  }

  return ranges;
}

function normalizeClockTime(value: string) {
  const match = value.trim().match(/(\d{1,2})(?::(\d{2}))?\s*([APap][Mm])/);
  if (!match) return value;

  const hour = Number(match[1]) % 12;
  const minute = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3].toUpperCase();
  const normalizedHour = hour + (meridiem === "PM" ? 12 : 0);

  return `${String(normalizedHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function normalizeDateString(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
}

function normalizeProfessionalName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
