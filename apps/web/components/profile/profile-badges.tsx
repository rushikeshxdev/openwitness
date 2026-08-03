"use client";

import { cn } from "@/lib/utils";
import type { ProfileActivityItem, ProfileBadge } from "@/data/profile-data";
import { ProfilePanel } from "./profile-gate";
import { Award, BadgeCheck } from "lucide-react";

const TONE: Record<ProfileBadge["tone"], string> = {
  blue: "bg-[#3B82F6]/15 text-[#60A5FA]",
  emerald: "bg-emerald-500/15 text-emerald-400",
  amber: "bg-amber-500/15 text-amber-400",
  violet: "bg-violet-500/15 text-violet-400",
  cyan: "bg-cyan-500/15 text-cyan-400",
  rose: "bg-rose-500/15 text-rose-400",
};

export function ProfileBadges({ badges }: { badges: ProfileBadge[] }) {
  return (
    <ProfilePanel title="Recent Badges">
      <ul className="divide-y divide-white/10">
        {badges.map((b) => (
          <li key={b.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
            <span
              className={cn(
                "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                TONE[b.tone]
              )}
            >
              <Award className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{b.title}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{b.earnedLabel}</p>
            </div>
          </li>
        ))}
      </ul>
    </ProfilePanel>
  );
}

export function ProfileActivityFeed({
  items,
}: {
  items: ProfileActivityItem[];
}) {
  return (
    <ProfilePanel title="Recent Activity">
      <ul className="divide-y divide-white/10">
        {items.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-zinc-500 sm:px-5">
            No recent activity yet.
          </li>
        ) : (
          items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200">{item.title}</p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {item.subtitle} · {item.dateLabel}
                </p>
              </div>
              {item.verified ? (
                <span className="inline-flex items-center gap-1 self-start rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-400">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Verified
                </span>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </ProfilePanel>
  );
}
