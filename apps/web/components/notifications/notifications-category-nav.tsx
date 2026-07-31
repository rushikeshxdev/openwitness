"use client";

import { cn } from "@/lib/utils";
import {
  NOTIFICATION_CATEGORIES,
  type NotificationCategoryFilter,
} from "@/data/notifications-data";
import {
  AtSign,
  BadgeCheck,
  Bell,
  MessageCircle,
  RefreshCw,
  UserPlus,
  Inbox,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<NotificationCategoryFilter, LucideIcon> = {
  all: Inbox,
  mentions: AtSign,
  verification: BadgeCheck,
  updates: RefreshCw,
  comments: MessageCircle,
  follows: UserPlus,
  system: Bell,
};

export function NotificationsCategoryNav({
  active,
  counts,
  onChange,
  className,
}: {
  active: NotificationCategoryFilter;
  counts: Record<NotificationCategoryFilter, number>;
  onChange: (id: NotificationCategoryFilter) => void;
  className?: string;
}) {
  return (
    <nav
      aria-label="Notification categories"
      className={cn("flex flex-col gap-0.5 p-2", className)}
    >
      {NOTIFICATION_CATEGORIES.map((cat) => {
        const Icon = ICONS[cat.id];
        const count = counts[cat.id] ?? 0;
        const selected = active === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={cn(
              "flex min-h-10 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors",
              selected
                ? "bg-[#3B82F6]/20 text-[#93C5FD]"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            )}
            aria-current={selected ? "page" : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 font-medium">{cat.label}</span>
            <span
              className={cn(
                "tabular-nums text-xs",
                selected ? "text-[#93C5FD]" : "text-zinc-500"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
