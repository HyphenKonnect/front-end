export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

export type SessionUser = {
  _id: string;
  id?: string;
  email: string;
  name: string;
  role: "client" | "professional" | "admin";
  phone?: string;
  avatar?: string;
  onboardingComplete?: boolean;
  emailVerified?: boolean;
  createdAt?: string;
  profile?: {
    bio?: string;
    specialisation?: string;
    serviceCategory?: "therapist" | "doctor" | "legal" | "wellness";
    licenseNumber?: string;
    yearsExperience?: number;
    qualifications?: string[];
    expertise?: string[];
    sessionPrice?: number;
    verified?: boolean;
  };
  availability?: {
    timezone?: string;
    workingHours?: Record<
      string,
      {
        start?: string;
        end?: string;
        slots?: { start: string; end: string }[];
      }
    >;
    blockedDates?: string[];
    specialDates?: {
      date: string;
      type: "special_hours" | "off_day" | "emergency_leave";
      start?: string;
      end?: string;
      note?: string;
    }[];
  };
};

export type NotificationItem = {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | "booking_created"
    | "booking_confirmed"
    | "booking_rescheduled"
    | "booking_cancelled"
    | "booking_completed"
    | "payment_received"
    | "session_ready"
    | "admin_update";
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    bookingId?: string;
    paymentId?: string;
    sessionId?: string;
  };
};

export type ChatSessionSummary = {
  bookingId: string;
  scheduledAt: string;
  status: string;
  serviceId?: string;
  clientName?: string;
  professionalName?: string;
  hasSession: boolean;
  messageCount: number;
  lastMessageAt?: string | null;
  lastMessagePreview?: string;
  unreadCount: number;
};

export type ChatMessage = {
  senderId: string;
  senderRole: "client" | "professional" | "admin";
  senderName: string;
  content: string;
  createdAt: string;
};

export type ChatSessionRecord = {
  _id: string;
  bookingId: string;
  clientId: string;
  professionalId: string;
  status: "active" | "closed";
  messageCount: number;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  unreadCounts?: {
    client?: number;
    professional?: number;
    admin?: number;
  };
  messages: ChatMessage[];
};

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setStoredToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
}

export function clearStoredToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });
}

export async function parseJsonResponse<T>(response: Response): Promise<T> {
  const fallbackText = await response
    .clone()
    .text()
    .catch(() => "");

  const data = (await response.json().catch(() => null)) as
    | T
    | { error?: string; message?: string }
    | null;

  if (!response.ok) {
    const message =
      (data &&
        typeof data === "object" &&
        ("error" in data || "message" in data) &&
        (data.error || data.message)) ||
      (fallbackText && !["{}", "null"].includes(fallbackText.trim())
        ? fallbackText
        : "") ||
      "Something went wrong while talking to the server.";
    throw new Error(message);
  }

  return data as T;
}
