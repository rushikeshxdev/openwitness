"use client";

import Link from "next/link";
import Image from "next/image";
import type { ProfileListItem, ProfileNotification } from "@/data/profile-data";
import { ProfilePanel } from "./profile-gate";
import { FileText } from "lucide-react";

export function ProfileListSection({
  title,
  items,
  emptyTitle,
  emptyHint,
  emptyCta,
}: {
  title: string;
  items: ProfileListItem[];
  emptyTitle: string;
  emptyHint: string;
  emptyCta?: { label: string; href: string };
}) {
  return (
    <ProfilePanel title={title}>
      {items.length === 0 ? (
        <div className="px-4 py-12 text-center sm:px-5">
          <FileText className="mx-auto h-8 w-8 text-zinc-600" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-zinc-300">{emptyTitle}</p>
          <p className="mt-1 text-xs text-zinc-500">{emptyHint}</p>
          {emptyCta ? (
            <Link
              href={emptyCta.href}
              className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2563EB]"
            >
              {emptyCta.label}
            </Link>
          ) : null}
        </div>
      ) : (
        <ul className="divide-y divide-white/10">
          {items.map((item) => {
            const inner = (
              <>
                {item.thumbnailUrl ? (
                  <div className="relative h-14 w-[72px] shrink-0 overflow-hidden rounded-lg border border-white/10">
                    <Image
                      src={item.thumbnailUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white line-clamp-1">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">{item.meta}</p>
                </div>
                {item.status ? (
                  <span className="shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-zinc-300">
                    {item.status}
                  </span>
                ) : null}
              </>
            );

            return (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.03] sm:px-5"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </ProfilePanel>
  );
}

export function ProfileNotificationsList({
  items,
  onMarkAllRead,
}: {
  items: ProfileNotification[];
  onMarkAllRead?: () => void;
}) {
  const unread = items.filter((n) => n.unread).length;

  return (
    <ProfilePanel
      title="Notifications"
      action={
        unread > 0 && onMarkAllRead ? (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-xs font-medium text-[#60A5FA] hover:text-[#93C5FD]"
          >
            Mark all read
          </button>
        ) : null
      }
    >
      <ul className="divide-y divide-white/10">
        {items.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-zinc-500 sm:px-5">
            You&apos;re all caught up.
          </li>
        ) : (
          items.map((n) => (
            <li
              key={n.id}
              className="flex gap-3 px-4 py-3.5 sm:px-5"
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  n.unread ? "bg-[#3B82F6]" : "bg-transparent"
                }`}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-white">{n.title}</p>
                  <span className="text-[11px] text-zinc-500">{n.timeLabel}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  {n.body}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </ProfilePanel>
  );
}
