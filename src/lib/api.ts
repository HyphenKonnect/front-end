export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://hyphenkonnect-production.up.railway.app";

export type SessionUser = {
  _id: string;
  id?: string;
  email: string;
  name: string;
  role: "client" | "professional" | "admin";
  phone?: string;
  avatar?: string;
  onboardingComplete?: boolean;
  profile?: {
    bio?: string;
    specialisation?: string;
    licenseNumber?: string;
    yearsExperience?: number;
    qualifications?: string[];
    verified?: boolean;
  };
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
      "Something went wrong while talking to the server.";
    throw new Error(message);
  }

  return data as T;
}
