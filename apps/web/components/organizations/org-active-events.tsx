"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  formatOrgStat,
  type OrgActiveEvent,
  type OrgEventStatus,
} from "@/data/organization-detail-data";
import { Bookmark, MapPin, Users } from "lucide-react";

const STATUS_BADGE: Record<
  OrgEventStatus,
  { label: string; className: string }
> = {
  live: { label: "LIVE", className: "bg-emerald-500 text-white" },
  ongoing: { label: "ONGOING", className: "bg-orange-500 text-white" },
  archived: { label: "ARCHIVED", className: "bg-zinc-600 text-white" },
};

function OrgEventCard({ event }: { event: OrgActiveEvent }) {
  const badge = STATUS_BADGE[event.status];

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex gap-3 rounded-xl border border-white/12 bg-black/30 p-3 transition-colors hover:border-white/20 hover:bg-black/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
    >
      <div className="relative aspect-[4/3] w-[88px] shrink-0 overflow-hidden rounded-lg sm:w-[100px]">
        <Image
          src={event.thumbnailUrl}
          alt=""
          fill
          className="object-cover"
          sizes="100px"
        />
        <span
          className={cn(
            "absolute left-1.5 top-1.5 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide",
            badge.className
          )}
        >
          {badge.label}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-white transition-colors group-hover:text-[#60A5FA] sm:text-[15px]">
            {event.title}
          </h3>
          <span className="shrink-0 text-zinc-500" aria-hidden="true">
            <Bookmark className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-zinc-400">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="truncate">{event.location}</span>
        </p>
        <p className="mt-0.5 text-xs text-zinc-500">{event.dateLabel}</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-zinc-400">
          <span className="tabular-nums">
            {formatOrgStat(event.evidenceCount)} Evidence
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Users className="h-3 w-3" aria-hidden="true" />
            {formatOrgStat(event.contributorCount)} Contributors
          </span>
        </div>
      </div>
    </Link>
  );
}

export function OrgActiveEvents({ events }: { events: OrgActiveEvent[] }) {
  return (
    <section
      className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5"
      aria-labelledby="org-events-heading"
    >
      <h2
        id="org-events-heading"
        className="text-base font-semibold text-white sm:text-lg"
      >
        Active Events
      </h2>
      <div className="mt-4 space-y-3">
        {events.map((event) => (
          <OrgEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
