"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatStat } from "@/data/event-detail-data";
import type { EventTimelineOverview } from "@/data/event-timeline-data";
import { BadgeCheck, MapPin, Radio, Users } from "lucide-react";
import type { ReactNode } from "react";

const STATUS_BADGE: Record<
  EventTimelineOverview["status"],
  { label: string; className: string }
> = {
  live: { label: "LIVE", className: "bg-[#3B82F6] text-white" },
  trending: { label: "TRENDING", className: "bg-orange-500 text-white" },
  verified: { label: "VERIFIED", className: "bg-emerald-500 text-white" },
  under_review: { label: "UNDER REVIEW", className: "bg-sky-600 text-white" },
};

export interface EventTimelineOverviewCardProps {
  overview: EventTimelineOverview;
  className?: string;
}

export function EventTimelineOverviewCard({
  overview,
  className,
}: EventTimelineOverviewCardProps) {
  const badge = STATUS_BADGE[overview.status];

  const rows: {
    label: string;
    value: string;
    dot: string;
    icon: ReactNode;
  }[] = [
    {
      label: "Live",
      value: overview.liveLabel,
      dot: "bg-emerald-400",
      icon: null,
    },
    {
      label: "Verified",
      value: `${formatStat(overview.verifiedCount)} items`,
      dot: "bg-[#3B82F6]",
      icon: <BadgeCheck className="h-3.5 w-3.5 text-[#3B82F6]" aria-hidden="true" />,
    },
    {
      label: "Sources",
      value: String(overview.sourceCount),
      dot: "bg-violet-400",
      icon: <Radio className="h-3.5 w-3.5 text-violet-400" aria-hidden="true" />,
    },
    {
      label: "Contributors",
      value: formatStat(overview.contributorCount),
      dot: "bg-sky-400",
      icon: <Users className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />,
    },
  ];

  return (
    <Link
      href={`/events/${overview.id}`}
      className={cn(
        "block overflow-hidden rounded-2xl border border-white/12 bg-[#121214]/90 backdrop-blur-md transition-colors hover:border-white/20",
        className
      )}
    >
      <div className="relative aspect-[16/10]">
        <Image
          src={overview.thumbnailUrl}
          alt=""
          fill
          className="object-cover"
          sizes="280px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent" />
        <span
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold tracking-wide",
            badge.className
          )}
        >
          {overview.status === "live" && (
            <span className="h-1.5 w-1.5 rounded-full bg-white motion-safe:animate-pulse" />
          )}
          {badge.label}
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h2 className="text-base font-semibold leading-snug text-white">
            {overview.title}
          </h2>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-400">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {overview.city}, {overview.country}
          </p>
          <p className="mt-1 text-xs text-zinc-500">{overview.startedLabel}</p>
        </div>
        <ul className="space-y-2 border-t border-white/10 pt-3">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="inline-flex items-center gap-2 text-zinc-400">
                {row.icon ?? (
                  <span
                    className={cn("h-2 w-2 rounded-full", row.dot)}
                    aria-hidden="true"
                  />
                )}
                {row.label}
              </span>
              <span className="tabular-nums text-zinc-200">{row.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
