"use client";

import Link from "next/link";
import { CheckCheck, Settings } from "lucide-react";
import { NOTIFICATION_SETTINGS_PATH } from "@/data/notifications-data";

export function NotificationsHeader({
  unread,
  onMarkAllRead,
}: {
  unread: number;
  onMarkAllRead: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Notifications Center
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Stay updated with what matters to you.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {unread > 0 ? (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#60A5FA] hover:text-[#93C5FD]"
          >
            <CheckCheck className="h-4 w-4" aria-hidden="true" />
            Mark all as read
          </button>
        ) : (
          <span className="text-sm text-zinc-500">All caught up</span>
        )}
        <Link
          href={NOTIFICATION_SETTINGS_PATH}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-200"
        >
          <Settings className="h-4 w-4" aria-hidden="true" />
          Notification Settings
        </Link>
      </div>
    </div>
  );
}
