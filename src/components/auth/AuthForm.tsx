"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { SessionUser } from "../../lib/api";
import { useAuth } from "./AuthProvider";
import { roleToDashboard } from "./ProtectedRoute";

const registrationRoles: { label: string; value: SessionUser["role"] }[] = [
  { label: "Client", value: "client" },
  { label: "Professional", value: "professional" },
];

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client" as SessionUser["role"],
  });

  const next = searchParams.get("next");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const user =
        mode === "login"
          ? await signIn({ email: form.email, password: form.password })
          : await register({
              name: form.name,
              email: form.email,
              password: form.password,
              role: form.role,
            });

      router.push(next || roleToDashboard(user.role));
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not complete that request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-white via-[#f7f5f4] to-white px-6 py-24 lg:px-[120px]">
      <div className="mx-auto grid max-w-[1120px] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] bg-[#2b2b2b] p-8 text-white lg:p-12">
          <p className="mb-4 text-sm uppercase tracking-[0.24em] text-[#fcb4b3]">
            Phase 1 Access
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl">
            {mode === "login"
              ? "Welcome back to your care workspace."
              : "Create your Hyphen Konnect account."}
          </h1>
          <p className="max-w-[520px] text-base leading-7 text-white/75">
            Start with secure authentication, role-based dashboards, and the
            foundations we need for bookings, payments, video sessions, and
            messaging.
          </p>

          <div className="mt-10 grid gap-4">
            {[
              "Clients can view appointments, payments, and care updates.",
              "Professionals get scheduling, availability, and earnings visibility.",
              "Admins get one place to monitor users, bookings, and growth.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-[20px] bg-white/8 p-4"
              >
                <ShieldCheck className="mt-0.5 h-5 w-5 text-[#fcb4b3]" />
                <p className="text-sm leading-6 text-white/85">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm lg:p-12">
          <p className="mb-2 text-sm font-medium text-[#f56969]">
            {mode === "login" ? "Sign In" : "Register"}
          </p>
          <h2 className="mb-2 text-3xl font-bold text-[#2b2b2b]">
            {mode === "login" ? "Continue your progress" : "Open your account"}
          </h2>
          <p className="mb-8 text-sm leading-6 text-[#7e7e7e]">
            {mode === "login"
              ? "Use the account connected to the Railway backend."
              : "Choose the role you want to start with. Admin access should be issued separately, not through the public form."}
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === "register" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#2b2b2b]">
                  Full name
                </span>
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-[18px] border border-[#ead9e8] bg-[#fcfbfb] px-4 py-3 outline-none transition focus:border-[#f56969]"
                  placeholder="Your full name"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#2b2b2b]">
                Email address
              </span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className="w-full rounded-[18px] border border-[#ead9e8] bg-[#fcfbfb] px-4 py-3 outline-none transition focus:border-[#f56969]"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#2b2b2b]">
                Password
              </span>
              <input
                required
                minLength={6}
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                className="w-full rounded-[18px] border border-[#ead9e8] bg-[#fcfbfb] px-4 py-3 outline-none transition focus:border-[#f56969]"
                placeholder="Minimum 6 characters"
              />
            </label>

            {mode === "register" ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#2b2b2b]">
                  Account type
                </span>
                <select
                  value={form.role}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      role: event.target.value as SessionUser["role"],
                    }))
                  }
                  className="w-full rounded-[18px] border border-[#ead9e8] bg-[#fcfbfb] px-4 py-3 outline-none transition focus:border-[#f56969]"
                >
                  {registrationRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            {error ? (
              <div className="rounded-[18px] bg-[#fff0f0] px-4 py-3 text-sm text-[#c84b4b]">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-6 py-3.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Please wait..."
                : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-sm text-[#7e7e7e]">
            {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
            <Link
              href={mode === "login" ? "/register" : "/login"}
              className="font-medium text-[#f56969]"
            >
              {mode === "login" ? "Register here" : "Sign in here"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
