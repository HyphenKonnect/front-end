"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { apiFetch, parseJsonResponse } from "../../lib/api";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const data = await parseJsonResponse<{ message: string }>(response);
      setSuccess(data.message);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not send the reset email right now.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-white via-[#f7f5f4] to-white px-6 pb-16 pt-28 lg:px-[120px] lg:pb-20 lg:pt-32">
      <div className="mx-auto grid max-w-[1120px] gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="rounded-[32px] bg-[#2b2b2b] p-8 text-white lg:p-10">
          <p className="mb-4 text-sm uppercase tracking-[0.24em] text-[#fcb4b3]">
            Account Recovery
          </p>
          <h1 className="mb-5 text-4xl font-bold leading-tight lg:text-[54px]">
            Reset your password securely.
          </h1>
          <p className="max-w-[520px] text-base leading-7 text-white/75">
            Enter the email address linked to your account and we will send you a secure password reset link.
          </p>

          <div className="mt-10 rounded-[20px] bg-white/8 p-5">
            <Mail className="h-5 w-5 text-[#fcb4b3]" />
            <p className="mt-3 text-sm leading-6 text-white/85">
              For security, the link expires automatically after 15 minutes.
            </p>
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-sm lg:p-10">
          <p className="mb-2 text-sm font-medium text-[#f56969]">Forgot Password</p>
          <h2 className="mb-2 text-3xl font-bold text-[#2b2b2b]">
            Send reset link
          </h2>
          <p className="mb-8 text-sm leading-6 text-[#7e7e7e]">
            We will email a one-time password reset link if your account exists.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#2b2b2b]">
                Email address
              </span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-[18px] border border-[#ead9e8] bg-[#fcfbfb] px-4 py-3 outline-none transition focus:border-[#f56969]"
                placeholder="you@example.com"
              />
            </label>

            {error ? (
              <div className="rounded-[18px] bg-[#fff0f0] px-4 py-3 text-sm text-[#c84b4b]">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-[18px] bg-[#eefaf1] px-4 py-3 text-sm text-[#2f6f43]">
                {success}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f5912d] via-[#f56969] to-[#e6b9e6] px-6 py-3.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Sending..." : "Send reset link"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-sm text-[#7e7e7e]">
            Remembered your password?{" "}
            <Link href="/login" className="font-medium text-[#f56969]">
              Return to sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
