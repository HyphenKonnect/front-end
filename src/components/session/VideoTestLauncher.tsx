"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { apiFetch, parseJsonResponse } from "../../lib/api";
import { PageHero } from "../site/page-primitives";
import { StatusBanner } from "../ui/StatusBanner";

type ProfessionalOption = {
  _id: string;
  id?: string;
  name: string;
  specialisation?: string;
  sessionPrice?: number;
};

type TestBookingResponse = {
  message: string;
  consultationUrl: string;
  booking: {
    _id: string;
    scheduledAt: string;
    videoSession?: {
      roomUrl?: string;
      roomName?: string;
    };
    professionalId?: {
      name?: string;
      specialisation?: string;
    };
  };
};

function buildDefaultScheduledAt() {
  const date = new Date(Date.now() + 20 * 60 * 1000);
  date.setSeconds(0, 0);

  const timezoneOffset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

export function VideoTestLauncher() {
  const [professionals, setProfessionals] = useState<ProfessionalOption[]>([]);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState("");
  const [scheduledAt, setScheduledAt] = useState(buildDefaultScheduledAt);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<TestBookingResponse | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadProfessionals = async () => {
      try {
        const response = await apiFetch("/api/professionals");
        const data = await parseJsonResponse<ProfessionalOption[]>(response);

        if (ignore) return;

        setProfessionals(data);
        if (data[0]) {
          setSelectedProfessionalId(String(data[0].id || data[0]._id));
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We could not load professionals for the Daily test.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadProfessionals();

    return () => {
      ignore = true;
    };
  }, []);

  const handleCreateTest = async () => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await apiFetch("/api/bookings/test-session", {
        method: "POST",
        body: JSON.stringify({
          professionalId: selectedProfessionalId,
          scheduledAt: new Date(scheduledAt).toISOString(),
          serviceId: "therapy-session",
        }),
      });

      const data = await parseJsonResponse<TestBookingResponse>(response);
      setSuccess(data);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not create the test booking.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["client", "admin"]}>
      <div className="pt-20">
        <PageHero
          eyebrow="Daily Test"
          title="Create A"
          highlight="Dummy Video Booking"
          description="Spin up a manual test booking, mark the payment as captured, and attach a Daily room so you can verify the client-professional session flow."
        />

        <section className="bg-white px-6 py-16 lg:px-[120px]">
          <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[28px] bg-[#f7f5f4] p-7 shadow-sm">
              <h2 className="text-2xl font-bold text-[#2b2b2b]">
                Test booking setup
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#6f6b68]">
                This skips Razorpay and creates a manual captured payment record
                only for testing. The booking is confirmed immediately so the
                Daily room can be joined right away.
              </p>

              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="text-sm font-medium text-[#2b2b2b]">
                    Professional
                  </span>
                  <select
                    value={selectedProfessionalId}
                    onChange={(event) => setSelectedProfessionalId(event.target.value)}
                    disabled={loading || submitting || professionals.length === 0}
                    className="mt-2 w-full rounded-[16px] border border-[#ddd4d1] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none transition focus:border-[#f56969]"
                  >
                    {professionals.map((professional) => {
                      const id = String(professional.id || professional._id);
                      const subtitle = professional.specialisation
                        ? ` - ${professional.specialisation}`
                        : "";

                      return (
                        <option key={id} value={id}>
                          {professional.name}
                          {subtitle}
                        </option>
                      );
                    })}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-[#2b2b2b]">
                    Session time
                  </span>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(event) => setScheduledAt(event.target.value)}
                    disabled={submitting}
                    className="mt-2 w-full rounded-[16px] border border-[#ddd4d1] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none transition focus:border-[#f56969]"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCreateTest}
                  disabled={
                    loading ||
                    submitting ||
                    !selectedProfessionalId ||
                    !scheduledAt
                  }
                  className="rounded-full bg-[#2b2b2b] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Creating test booking..." : "Create Daily test"}
                </button>
                <Link
                  href="/dashboard/client"
                  className="rounded-full border border-[#ddd4d1] px-6 py-3 text-sm font-medium text-[#2b2b2b]"
                >
                  Back to dashboard
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] bg-[#f7f5f4] p-7 shadow-sm">
              <h2 className="text-2xl font-bold text-[#2b2b2b]">
                What you get
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-6 text-[#6f6b68]">
                <p>A confirmed booking with a manual captured payment.</p>
                <p>A Daily private room attached to that booking.</p>
                <p>A consultation URL you can open as the client.</p>
                <p>
                  A matching booking in the professional dashboard so the second
                  user can join from their side too.
                </p>
              </div>

              {error ? (
                <div className="mt-6">
                  <StatusBanner tone="error" title="Test setup failed">
                    {error}
                  </StatusBanner>
                </div>
              ) : null}

              {success ? (
                <div className="mt-6 rounded-[24px] bg-white p-5">
                  <p className="text-sm font-semibold text-[#2b2b2b]">
                    {success.message}
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-[#4d4b49]">
                    <p>Booking ID: {success.booking._id}</p>
                    <p>Scheduled at: {new Date(success.booking.scheduledAt).toLocaleString()}</p>
                    <p>Consultation path: {success.consultationUrl}</p>
                    {success.booking.videoSession?.roomName ? (
                      <p>Daily room: {success.booking.videoSession.roomName}</p>
                    ) : null}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={success.consultationUrl}
                      className="rounded-full bg-[#f56969] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#e55656]"
                    >
                      Open consultation room
                    </Link>
                    {success.booking.videoSession?.roomUrl ? (
                      <a
                        href={success.booking.videoSession.roomUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-[#ddd4d1] px-6 py-3 text-sm font-medium text-[#2b2b2b]"
                      >
                        Open Daily room
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
