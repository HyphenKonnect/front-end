"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import {
  apiFetch,
  ChatSessionRecord,
  ChatSessionSummary,
  parseJsonResponse,
} from "../../lib/api";
import { getServiceLabel } from "../../lib/booking-helpers";
import { formatDateTime } from "../../lib/formatting";
import { EmptyState } from "./dashboard-primitives";

export function DashboardChatPanel({
  title,
  description,
  emptyDescription,
}: {
  title: string;
  description: string;
  emptyDescription: string;
}) {
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<ChatSessionRecord | null>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSessions = async () => {
      try {
        const response = await apiFetch("/api/chat/sessions");
        const data = await parseJsonResponse<ChatSessionSummary[]>(response);
        if (!active) return;
        setSessions(data);
        setSelectedBookingId((current) => current || data[0]?.bookingId || null);
      } catch {
        if (active) setSessions([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadSessions();
    const interval = window.setInterval(loadSessions, 12000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!selectedBookingId) {
      setSelectedSession(null);
      return;
    }

    let active = true;
    const loadSession = async () => {
      try {
        const response = await apiFetch(`/api/chat/sessions/${selectedBookingId}`);
        const data = await parseJsonResponse<ChatSessionRecord>(response);
        if (active) setSelectedSession(data);
      } catch {
        if (active) setSelectedSession(null);
      }
    };

    void loadSession();
    const interval = window.setInterval(loadSession, 8000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [selectedBookingId]);

  const selectedSummary = useMemo(
    () => sessions.find((item) => item.bookingId === selectedBookingId) || null,
    [sessions, selectedBookingId],
  );

  const handleSend = async () => {
    if (!selectedBookingId || !draft.trim()) return;

    try {
      setSending(true);
      const response = await apiFetch(`/api/chat/sessions/${selectedBookingId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content: draft.trim() }),
      });
      const data = await parseJsonResponse<ChatSessionRecord>(response);
      setSelectedSession(data);
      setDraft("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[0.42fr_0.58fr]">
      <div className="rounded-[22px] bg-[#f7f5f4] p-5">
        <div className="mb-4">
          <p className="text-lg font-semibold text-[#2b2b2b]">{title}</p>
          <p className="mt-2 text-sm leading-6 text-[#7e7e7e]">{description}</p>
        </div>

        {sessions.length ? (
          <div className="space-y-3">
            {sessions.map((session) => (
              <button
                key={session.bookingId}
                type="button"
                onClick={() => setSelectedBookingId(session.bookingId)}
                className={`w-full rounded-[18px] border px-4 py-4 text-left transition-colors ${
                  selectedBookingId === session.bookingId
                    ? "border-[#f2becb] bg-white"
                    : "border-transparent bg-white/70"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#2b2b2b]">
                      {session.professionalName || session.clientName || "Booking chat"}
                    </p>
                    <p className="mt-1 text-sm text-[#7e7e7e]">
                      {getServiceLabel(session.serviceId)}
                    </p>
                  </div>
                  {session.unreadCount ? (
                    <span className="rounded-full bg-[#f56969] px-2 py-1 text-[11px] font-semibold text-white">
                      {session.unreadCount}
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-5 text-[#6c6270]">
                  {session.lastMessagePreview || "No messages yet."}
                </p>
                <p className="mt-3 text-xs text-[#9a9199]">
                  {formatDateTime(session.scheduledAt)}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState
            title={loading ? "Loading conversations" : "No chats yet"}
            description={emptyDescription}
          />
        )}
      </div>

      <div className="rounded-[22px] bg-[#f7f5f4] p-5">
        {selectedSummary ? (
          <>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-[#2b2b2b]">
                  {selectedSummary.professionalName || selectedSummary.clientName || "Conversation"}
                </p>
                <p className="mt-1 text-sm text-[#7e7e7e]">
                  {getServiceLabel(selectedSummary.serviceId)} · {formatDateTime(selectedSummary.scheduledAt)}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize text-[#2b2b2b]">
                {selectedSummary.status}
              </span>
            </div>

            <div className="h-[320px] space-y-3 overflow-y-auto rounded-[18px] bg-white p-4">
              {selectedSession?.messages.length ? (
                selectedSession.messages.map((message, index) => (
                  <div key={`${message.createdAt}-${index}`} className="rounded-[16px] bg-[#f7f5f4] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#2b2b2b]">
                        {message.senderName}
                      </p>
                      <p className="text-xs text-[#9a9199]">
                        {formatDateTime(message.createdAt)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#5f5f5f]">
                      {message.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-[#7e7e7e]">
                  <MessageSquare className="h-8 w-8 text-[#f56969]" />
                  <p className="mt-3 text-sm">Start the conversation for this session.</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={3}
                placeholder="Write a message..."
                className="flex-1 rounded-[18px] border border-[#ead9e8] bg-white px-4 py-3 text-sm text-[#2b2b2b] outline-none"
              />
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={sending || !draft.trim()}
                className="inline-flex h-fit items-center gap-2 rounded-full bg-[#2b2b2b] px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </>
        ) : (
          <EmptyState
            title="Select a conversation"
            description="Choose a booking from the left to view and send messages."
          />
        )}
      </div>
    </div>
  );
}
