"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bell } from "lucide-react";
import {
  apiFetch,
  NotificationItem,
  parseJsonResponse,
} from "../../lib/api";

type NotificationsResponse = {
  items: NotificationItem[];
  unreadCount: number;
};

function formatRelative(value: string) {
  const diffMs = Date.now() - new Date(value).getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.round(diffMinutes / 60)}h ago`;
  return `${Math.round(diffMinutes / 1440)}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const visibleItems = useMemo(() => items.slice(0, 6), [items]);

  useEffect(() => {
    let active = true;

    const loadNotifications = async () => {
      try {
        setLoading(true);
        const response = await apiFetch("/api/notifications");
        const data = await parseJsonResponse<NotificationsResponse>(response);
        if (!active) return;
        setItems(data.items || []);
        setUnreadCount(data.unreadCount || 0);
        setError(null);
      } catch (fetchError) {
        if (!active) return;
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Could not load notifications.",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadNotifications();
    const interval = window.setInterval(loadNotifications, 45000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const markAsRead = async (notificationId: string) => {
    setItems((current) =>
      current.map((item) =>
        item._id === notificationId ? { ...item, read: true } : item,
      ),
    );
    setUnreadCount((current) => Math.max(0, current - 1));

    try {
      await apiFetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });
    } catch {
      // Keep UI optimistic to avoid a noisy nav experience.
    }
  };

  const markAllAsRead = async () => {
    setItems((current) => current.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);

    try {
      await apiFetch("/api/notifications/read-all", {
        method: "PATCH",
      });
    } catch {
      // Keep UI optimistic to avoid a noisy nav experience.
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative rounded-full border border-[#ead9e8] p-2 text-[#2b2b2b] transition-colors hover:text-[#f56969]"
        aria-label="Open notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-[#f56969] px-1.5 text-center text-[10px] font-semibold leading-[18px] text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-3 w-[320px] overflow-hidden rounded-[24px] border border-[#f0e8ef] bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#f4edf2] px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-[#2b2b2b]">
                Notifications
              </p>
              <p className="text-xs text-[#7e7e7e]">
                Booking, payment, and session updates
              </p>
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-medium text-[#f56969]"
              >
                Mark all read
              </button>
            ) : null}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="px-5 py-6 text-sm text-[#7e7e7e]">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="px-5 py-6 text-sm text-[#c45d5d]">{error}</div>
            ) : visibleItems.length === 0 ? (
              <div className="px-5 py-6 text-sm text-[#7e7e7e]">
                You are all caught up right now.
              </div>
            ) : (
              visibleItems.map((item) => (
                <Link
                  key={item._id}
                  href={item.actionUrl || "/dashboard"}
                  onClick={() => {
                    void markAsRead(item._id);
                    setOpen(false);
                  }}
                  className={`block border-b border-[#f7f1f4] px-5 py-4 transition-colors hover:bg-[#fcf9fb] ${
                    item.read ? "bg-white" : "bg-[#fff6fa]"
                  }`}
                >
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-[#2b2b2b]">
                      {item.title}
                    </p>
                    <span className="shrink-0 text-[11px] text-[#9b8d99]">
                      {formatRelative(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm leading-5 text-[#5c5560]">
                    {item.message}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
