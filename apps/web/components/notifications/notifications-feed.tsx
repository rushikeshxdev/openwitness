"use client";

import { Check } from "lucide-react";
import {
  groupNotificationsByDay,
  type AppNotification,
} from "@/data/notifications-data";
import { NotificationsFeedItem } from "./notifications-feed-item";

export function NotificationsFeed({
  items,
  selectedId,
  onSelect,
}: {
  items: AppNotification[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const groups = groupNotificationsByDay(items);

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-medium text-zinc-300">No notifications</p>
        <p className="mt-1 max-w-xs text-xs text-zinc-500">
          You&apos;re all caught up in this category. Check back when there&apos;s
          new activity.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-2 sm:p-3">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`notif-group-${group.id}`}>
          <h3
            id={`notif-group-${group.id}`}
            className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-zinc-500"
          >
            {group.label}
          </h3>
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => (
              <li key={item.id}>
                <NotificationsFeedItem
                  item={item}
                  selected={selectedId === item.id}
                  onSelect={onSelect}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="flex items-center justify-center gap-1.5 py-4 text-xs text-zinc-600">
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
        You&apos;ve reached the end.
      </p>
    </div>
  );
}
