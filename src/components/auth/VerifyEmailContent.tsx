"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { StatusBanner } from "../ui/StatusBanner";
import { apiFetch, parseJsonResponse } from "../../lib/api";

type VerificationState = "idle" | "verifying" | "success" | "error";

export default function VerifyEmailContent() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState<VerificationState>("idle");
  const [message, setMessage] = useState("");

  const safeToken = useMemo(() => token.trim(), [token]);

  useEffect(() => {
    if (!safeToken) {
      setState("error");
      setMessage("Verification token is missing.");
      return;
    }

    let cancelled = false;
    const verify = async () => {
      try {
        setState("verifying");
        const response = await apiFetch(
          `/api/auth/verify-email?token=${encodeURIComponent(safeToken)}`,
        );
        const data = await parseJsonResponse<{ message?: string }>(response);
        if (cancelled) return;
        setState("success");
        setMessage(data.message || "Email verified successfully.");
      } catch (error) {
        if (cancelled) return;
        setState("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Verification link is invalid or expired.",
        );
      }
    };

    void verify();
    return () => {
      cancelled = true;
    };
  }, [safeToken]);

  return (
    <div className="min-h-screen bg-[#f7f5f4] px-6 py-16">
      <div className="mx-auto w-full max-w-xl rounded-[32px] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#2b2b2b]">Email verification</h1>
        <p className="mt-2 text-sm text-[#7e7e7e]">
          We are verifying your email address.
        </p>

        {state === "verifying" ? (
          <StatusBanner tone="info" className="mt-6" title="Verifying">
            Please wait while we confirm your email.
          </StatusBanner>
        ) : null}

        {state === "success" ? (
          <StatusBanner tone="success" className="mt-6" title="Verified">
            {message}
          </StatusBanner>
        ) : null}

        {state === "error" ? (
          <StatusBanner tone="error" className="mt-6" title="Verification failed">
            {message}
          </StatusBanner>
        ) : null}

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/login"
            className="rounded-full bg-[#2b2b2b] px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Go to Login
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[#2b2b2b] px-5 py-3 text-center text-sm font-medium text-[#2b2b2b]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
