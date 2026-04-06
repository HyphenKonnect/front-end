"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LoaderCircle, Video } from "lucide-react";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { apiFetch, parseJsonResponse } from "../../lib/api";
import { createDailyFrame } from "../../lib/daily-prebuilt";
import { getServiceLabel } from "../../lib/booking-helpers";
import { formatDateTime } from "../../lib/formatting";
import { PageHero } from "../site/page-primitives";
import { StatusBanner } from "../ui/StatusBanner";

type SessionPayload = {
  provider: string;
  roomName: string;
  roomUrl: string;
  roomExpiresAt?: string;
  token?: string;
  booking: {
    _id: string;
    status: string;
    scheduledAt: string;
    serviceId?: string;
    clientName?: string;
    professionalName?: string;
  };
};

export function ConsultationRoom({ sessionId }: { sessionId: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sessionData, setSessionData] = useState<SessionPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadSession = async () => {
      try {
        if (!ignore) setLoading(true);
        const response = await apiFetch(`/api/bookings/${sessionId}/session`);
        const data = await parseJsonResponse<SessionPayload>(response);
        if (!ignore) {
          setSessionData(data);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We could not prepare your session room.",
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    void loadSession();

    return () => {
      ignore = true;
    };
  }, [sessionId]);

  useEffect(() => {
    let destroyed = false;
    let frame: { destroy: () => void } | null = null;

    const mountFrame = async () => {
      if (!sessionData?.roomUrl || !containerRef.current) return;

      try {
        setJoining(true);
        frame = await createDailyFrame(containerRef.current, {
          url: sessionData.roomUrl,
          token: sessionData.token,
        });
      } catch (joinError) {
        if (!destroyed) {
          setError(
            joinError instanceof Error
              ? joinError.message
              : "We could not launch the session room.",
          );
        }
      } finally {
        if (!destroyed) {
          setJoining(false);
        }
      }
    };

    void mountFrame();

    return () => {
      destroyed = true;
      frame?.destroy();
    };
  }, [sessionData]);

  return (
    <ProtectedRoute allowedRoles={["client", "professional", "admin"]}>
      <div className="pt-20">
        <PageHero
          eyebrow="Video Consultation"
          title="Join Your"
          highlight="Session Room"
          description="Your confirmed appointment now includes a secure embedded Daily session so clients and professionals can meet without leaving Hyphen Konnect."
        />

        <section className="bg-white px-6 py-16 lg:px-[120px]">
          <div className="mx-auto max-w-[1440px]">
            {error ? (
              <StatusBanner tone="error" title="Session unavailable">
                {error}
              </StatusBanner>
            ) : null}

            {!error ? (
              <div className="grid gap-6 lg:grid-cols-[0.34fr_0.66fr]">
                <div className="rounded-[28px] bg-[#f7f5f4] p-7 shadow-sm">
                  <div className="inline-flex rounded-full bg-white p-3">
                    <Video className="h-5 w-5 text-[#f56969]" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold text-[#2b2b2b]">
                    {loading ? "Preparing room..." : "Session details"}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#7e7e7e]">
                    {loading
                      ? "We’re securely preparing the Daily room and your access token."
                      : "Use the embedded room on the right. If something goes wrong, you can retry from your dashboard or contact support."}
                  </p>

                  {sessionData ? (
                    <div className="mt-6 space-y-4">
                      <div className="rounded-[20px] bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7e7e7e]">
                          Service
                        </p>
                        <p className="mt-2 font-semibold text-[#2b2b2b]">
                          {getServiceLabel(sessionData.booking.serviceId)}
                        </p>
                      </div>
                      <div className="rounded-[20px] bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7e7e7e]">
                          Scheduled for
                        </p>
                        <p className="mt-2 font-semibold text-[#2b2b2b]">
                          {formatDateTime(sessionData.booking.scheduledAt)}
                        </p>
                      </div>
                      <div className="rounded-[20px] bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7e7e7e]">
                          Room
                        </p>
                        <p className="mt-2 break-all font-semibold text-[#2b2b2b]">
                          {sessionData.roomName}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-col gap-3">
                    {sessionData?.roomUrl ? (
                      <a
                        href={sessionData.roomUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-[#ead9e8] px-5 py-3 text-center text-sm font-medium text-[#2b2b2b]"
                      >
                        Open direct room
                      </a>
                    ) : null}
                    <Link
                      href="/dashboard/client"
                      className="rounded-full border border-[#ead9e8] px-5 py-3 text-center text-sm font-medium text-[#2b2b2b]"
                    >
                      Back to dashboard
                    </Link>
                  </div>
                </div>

                <div className="rounded-[28px] bg-[#f7f5f4] p-4 shadow-sm">
                  <div
                    ref={containerRef}
                    className="min-h-[720px] overflow-hidden rounded-[28px] bg-[#e9e2df]"
                  >
                    {loading || joining ? (
                      <div className="flex h-full min-h-[720px] items-center justify-center gap-3 text-[#2b2b2b]">
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        <span className="text-sm font-medium">
                          {loading ? "Loading session..." : "Joining room..."}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
