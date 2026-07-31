"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  categoryLabel,
  type AppNotification,
  type NotificationCategory,
} from "@/data/notifications-data";
import {
  AtSign,
  BadgeCheck,
  Bell,
  MessageCircle,
  RefreshCw,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TYPE_ICON: Record<NotificationCategory, LucideIcon> = {
  mentions: AtSign,
  verification: BadgeCheck,
  updates: RefreshCw,
  comments: MessageCircle,
  follows: UserPlus,
  system: Bell,
};

const TYPE_ICON_CLASS: Record<NotificationCategory, string> = {
  mentions: "bg-sky-500/15 text-sky-400",
  verification: "bg-emerald-500/15 text-emerald-400",
  updates: "bg-violet-500/15 text-violet-400",
  comments: "bg-blue-500/15 text-blue-400",
  follows: "bg-orange-500/15 text-orange-400",
  system: "bg-zinc-500/15 text-zinc-400",
};

function NotificationBody({ item }: { item: AppNotification }) {
  if (!item.highlight || !item.body.includes(item.highlight)) {
    return <p className="text-sm leading-relaxed text-zinc-300">{item.body}</p>;
  }
  const [before, after] = item.body.split(item.highlight);
  const highlightNode = item.highlightHref ? (
    <Link
      href={item.highlightHref}
      className="font-medium text-[#60A5FA] hover:text-[#93C5FD]"
      onClick={(e) => e.stopPropagation()}
    >
      {item.highlight}
    </Link>
  ) : (
    <span className="font-medium text-[#60A5FA]">{item.highlight}</span>
  );
  return (
    <p className="text-sm leading-relaxed text-zinc-300">
      {before}
      {highlightNode}
      {after}
    </p>
  );
}

export function NotificationsFeedItem({
  item,
  selected,
  onSelect,
}: {
  item: AppNotification;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const Icon = TYPE_ICON[item.category];

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={cn(
        "flex w-full gap-3 rounded-xl border px-3 py-3 text-left transition-colors sm:px-3.5",
        selected
          ? "border-[#3B82F6]/40 bg-[#3B82F6]/10"
          : "border-transparent hover:bg-white/[0.04]",
        item.unread && !selected && "bg-white/[0.02]"
      )}
      aria-current={selected ? "true" : undefined}
    >
      <span
        className={cn(
          "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          TYPE_ICON_CLASS[item.category]
        )}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <NotificationBody item={item} />
        <span className="mt-2 inline-flex rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-zinc-400">
          {categoryLabel(item.category)}
        </span>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        {item.thumbnailUrl ? (
          <span className="relative h-11 w-11 overflow-hidden rounded-lg border border-white/10">
            <Image
              src={item.thumbnailUrl}
              alt=""
              fill
              className="object-cover"
              sizes="44px"
            />
          </span>
        ) : (
          <span className="h-11 w-11" aria-hidden="true" />
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-zinc-500">{item.timeLabel}</span>
          {item.unread ? (
            <span
              className="h-2 w-2 rounded-full bg-[#3B82F6]"
              aria-label="Unread"
            />
          ) : null}
        </div>
      </div>
    </button>
  );
}
