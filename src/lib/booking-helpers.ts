type BookingTimestamps = {
  createdAt?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  rescheduledAt?: string;
};

const serviceLabels: Record<string, string> = {
  "mental-wellness": "Mental Wellness",
  "medical-consultation": "Medical Consultation",
  "legal-guidance": "Legal Guidance",
  "wellness-programs": "Wellness Programs",
};

export function getServiceLabel(serviceId?: string) {
  if (!serviceId) return "General Session";
  return serviceLabels[serviceId] || "General Session";
}

export function getBookingStatusTone(status?: string) {
  if (status === "confirmed" || status === "completed") {
    return "bg-[#eef8f1] text-[#2f6a43]";
  }

  if (status === "cancelled" || status === "no-show") {
    return "bg-[#fff1f0] text-[#a94a46]";
  }

  return "bg-white text-[#f56969]";
}

export function getBookingTimeline(
  status: string,
  scheduledAt: string,
  timestamps?: BookingTimestamps,
) {
  return [
    {
      label: "Created",
      value: timestamps?.createdAt,
      active: Boolean(timestamps?.createdAt),
    },
    {
      label: "Confirmed",
      value: timestamps?.confirmedAt,
      active: status === "confirmed" || status === "completed" || Boolean(timestamps?.confirmedAt),
    },
    {
      label: "Rescheduled",
      value: timestamps?.rescheduledAt,
      active: Boolean(timestamps?.rescheduledAt),
    },
    {
      label: "Scheduled Session",
      value: scheduledAt,
      active: true,
    },
    {
      label: "Completed / Cancelled",
      value: timestamps?.completedAt || timestamps?.cancelledAt,
      active: status === "completed" || status === "cancelled",
    },
  ];
}
