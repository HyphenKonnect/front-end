"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { professionals, serviceCatalog, type ProfessionalProfile } from "../../components/site/data";

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
];

type TimeRange = {
  start: number;
  end: number;
};

type AvailabilitySchedule = Record<number, TimeRange[]>;

const DEFAULT_TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

export default function BookingPage() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const professionalOptions = useMemo(() => {
    return professionals.filter((item) => {
      if (!selectedService) return false;
      if (selectedService === "mental-wellness") return item.category === "therapist";
      if (selectedService === "medical-consultation") return item.category === "doctor";
      if (selectedService === "legal-guidance") return item.category === "legal";
      return item.category === "wellness";
    });
  }, [selectedService]);

  const selectedPro = professionals.find((item) => item.id === selectedProfessional) ?? null;

  const availability = useMemo(
    () => (selectedPro ? buildAvailabilitySchedule(selectedPro) : null),
    [selectedPro],
  );

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    if (!selectedPro || !availability) return DEFAULT_TIME_SLOTS;
    return getSlotsForDate(selectedDate, selectedPro, availability);
  }, [availability, selectedDate, selectedPro]);

  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);

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
            <p className="mb-8 text-[16px] text-[#7e7e7e]">Select a professional who fits your needs.</p>
            <div className="grid gap-6 md:grid-cols-3">
              {professionalOptions.map((pro) => (
                <button
                  key={pro.id}
                  type="button"
                  onClick={() => {
                    setSelectedProfessional(pro.id);
                    setSelectedDate(null);
                    setSelectedTime("");
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
            <h2 className="mb-3 text-[36px] font-bold text-[#2b2b2b]">Pick Date & Time</h2>
            <p className="mb-8 text-[16px] text-[#7e7e7e]">Choose a time that works for you.</p>
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="rounded-[30px] bg-white p-8 shadow-sm">
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
                  <div className="ml-auto flex overflow-hidden rounded-[14px] border border-[#f5b3af]">
                    <CalendarNavButton
                      onClick={() =>
                        setVisibleMonth(
                          new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
                        )
                      }
                      disabled={isSameMonth(visibleMonth, today)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </CalendarNavButton>
                    <CalendarNavButton
                      onClick={() =>
                        setVisibleMonth(
                          new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
                        )
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </CalendarNavButton>
                  </div>
                </div>

                <div className="mb-5 inline-flex rounded-full bg-[#fff1f0] px-4 py-1.5 text-sm text-[#2b2b2b]">
                  Asia/Calcutta
                </div>

                <div className="grid grid-cols-7 gap-3">
                  {WEEKDAY_LABELS.map((label) => (
                    <div key={label} className="pb-1 text-center text-[14px] font-medium text-[#2b2b2b]">
                      {label}
                    </div>
                  ))}

                  {calendarDays.map((date) => {
                    const inCurrentMonth = date.getMonth() === visibleMonth.getMonth();
                    const selectable = isSelectableDate(date, today, selectedPro, availability);
                    const selected = selectedDate ? isSameDay(date, selectedDate) : false;
                    const isToday = isSameDay(date, today);

                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        disabled={!selectable}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime("");
                        }}
                        className={`relative h-11 rounded-[10px] border text-[16px] transition ${
                          selected
                            ? "border-[#ff8f89] bg-[#ff6b6b] text-white"
                            : selectable
                              ? "border-[#ffada8] bg-[#fff8f8] text-[#2b2b2b] hover:bg-[#fff0ef]"
                              : "border-transparent bg-[#eef0f6] text-[#c0c5cf]"
                        } ${!inCurrentMonth ? "opacity-70" : ""}`}
                      >
                        {date.getDate()}
                        {isToday && !selected ? (
                          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#2b2b2b]" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {selectedPro ? (
                  <div className="mt-6 rounded-[20px] bg-[#faf6f6] px-4 py-3 text-sm text-[#6f6f6f]">
                    <p className="font-medium text-[#2b2b2b]">{selectedPro.name}</p>
                    <p className="mt-1">
                      {selectedPro.workingHours || "Slots will be shown based on the professional's schedule."}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="rounded-[30px] bg-white p-8 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[#f56969]" />
                  <label className="text-[14px] font-medium text-[#2b2b2b]">Available Time Slots</label>
                </div>
                {selectedDate ? (
                  <p className="mb-5 text-[14px] text-[#7e7e7e]">
                    {formatLongDate(selectedDate)}
                  </p>
                ) : (
                  <p className="mb-5 text-[14px] text-[#7e7e7e]">
                    Select a date to view matching slots.
                  </p>
                )}

                {selectedDate && availableSlots.length ? (
                  <div className="grid grid-cols-2 gap-4">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`rounded-[18px] border px-4 py-4 text-base font-medium transition ${
                          selectedTime === slot
                            ? "border-[#ff8f89] bg-[#ff6b6b] text-white"
                            : "border-transparent bg-[#f5f0f0] text-[#2b2b2b] hover:bg-[#efe7e7]"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[22px] bg-[#faf6f6] p-6 text-sm leading-6 text-[#7e7e7e]">
                    {selectedDate
                      ? "No matching slots are available for that day. Please choose another date."
                      : "Once you pick a date, only the slots that match the selected professional's schedule will appear here."}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <div className="rounded-[28px] bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-[36px] font-bold text-[#2b2b2b]">Confirm Your Booking</h2>
            <div className="space-y-4 text-[16px] text-[#7e7e7e]">
              <p>
                <span className="font-semibold text-[#2b2b2b]">Service:</span>{" "}
                {serviceCatalog.find((item) => item.slug === selectedService)?.title}
              </p>
              <p>
                <span className="font-semibold text-[#2b2b2b]">Professional:</span> {selectedPro?.name}
              </p>
              <p>
                <span className="font-semibold text-[#2b2b2b]">Date:</span>{" "}
                {selectedDate ? formatLongDate(selectedDate) : ""}
              </p>
              <p>
                <span className="font-semibold text-[#2b2b2b]">Time:</span> {selectedTime}
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/consultation/demo-session"
                className="rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-8 py-4 text-center font-medium text-white"
              >
                Confirm & Continue
              </Link>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-full border border-[#2b2b2b] px-8 py-4 font-medium text-[#2b2b2b]"
              >
                Edit Details
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(1, current - 1))}
            disabled={step === 1}
            className="rounded-full border border-[#2b2b2b] px-6 py-3 text-sm font-medium text-[#2b2b2b] disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setStep((current) => Math.min(4, current + 1))}
            disabled={
              (step === 1 && !selectedService) ||
              (step === 2 && !selectedProfessional) ||
              (step === 3 && (!selectedDate || !selectedTime)) ||
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
  children: React.ReactNode;
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

function isSelectableDate(
  date: Date,
  today: Date,
  professional: ProfessionalProfile | null,
  schedule: AvailabilitySchedule | null,
) {
  const normalized = startOfDay(date);
  if (normalized < today) return false;
  if (!professional || !schedule) return true;
  const daySchedule = schedule[normalized.getDay()] || [];
  return daySchedule.length > 0;
}

function getSlotsForDate(date: Date, professional: ProfessionalProfile, schedule: AvailabilitySchedule) {
  const ranges = schedule[date.getDay()] || [];
  if (!ranges.length) return [];

  const now = new Date();
  const isTodayDate = isSameDay(date, now);
  const uniqueSlots = new Set<string>();

  for (const range of ranges) {
    const startHour = Math.ceil(range.start);
    const endHour = Math.floor(range.end);

    for (let hour = startHour; hour < endHour; hour += 1) {
      const slotDate = new Date(date);
      slotDate.setHours(hour, 0, 0, 0);
      if (isTodayDate && slotDate <= now) continue;
      uniqueSlots.add(formatTime(hour));
    }
  }

  if (!uniqueSlots.size && !professional.workingHours) {
    return DEFAULT_TIME_SLOTS;
  }

  return Array.from(uniqueSlots).sort(compareTimeStrings);
}

function buildAvailabilitySchedule(professional: ProfessionalProfile): AvailabilitySchedule {
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
      base[day] = [
        { start: 9, end: 18 },
      ];
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
  const allDays = DAY_NAMES.map((name, index) => ({ name: name.toLowerCase(), index }));
  const matches = allDays.filter((day) => beforeColon.includes(day.name));

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

  return [...Array.from({ length: 7 - start }, (_, index) => start + index), ...Array.from({ length: end + 1 }, (_, index) => index)];
}

function parseTimeRanges(segment: string) {
  const ranges: TimeRange[] = [];
  const pattern = /(\d{1,2}(?::\d{2})?\s*[APap][Mm])\s*-\s*(\d{1,2}(?::\d{2})?\s*[APap][Mm])/g;
  let match: RegExpExecArray | null = pattern.exec(segment);

  while (match) {
    ranges.push({
      start: parseTimeToHours(match[1]),
      end: parseTimeToHours(match[2]),
    });
    match = pattern.exec(segment);
  }

  return ranges;
}

function parseTimeToHours(value: string) {
  const match = value.trim().match(/(\d{1,2})(?::(\d{2}))?\s*([APap][Mm])/);
  if (!match) return 0;

  const hour = Number(match[1]) % 12;
  const minute = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3].toUpperCase();

  return hour + (meridiem === "PM" ? 12 : 0) + minute / 60;
}

function formatTime(hour24: number) {
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:00 ${suffix}`;
}

function compareTimeStrings(a: string, b: string) {
  return parseTimeToHours(a) - parseTimeToHours(b);
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
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth();
}

function formatLongDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
