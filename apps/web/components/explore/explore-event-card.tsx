"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Event, ExploreStatus } from "@/types/event";
import { LANDING_REFERENCE_TIME } from "@/data/events-data";
import {
  MapPin,
  Clock,
  FileText,
  BadgeCheck,
  Users,
  ChevronRight,
} from "lucide-react";
import { GlassCard } from "../glass-card";

function formatStartedAt(
  date: Date,
  now: Date = LANDING_REFERENCE_TIME
): string {
  const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  if (hours < 1) return "Started just now";
  if (hours < 24) return `Started ${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Started 1 day ago";
  return `Started ${days} days ago`;
}

const BADGE_STYLES: Record<
  ExploreStatus,
  { label: string; className: string }
> = {
  live: { label: "LIVE", className: "bg-[#3B82F6] text-white" },
  trending: { label: "TRENDING", className: "bg-orange-500 text-white" },
  verified: { label: "VERIFIED", className: "bg-emerald-500 text-white" },
  under_review: {
    label: "UNDER REVIEW",
    className: "bg-sky-600 text-white",
  },
};

export interface ExploreEventListCardProps {
  event: Event;
  className?: string;
}

export function ExploreEventListCard({
  event,
  className,
}: ExploreEventListCardProps) {
  const status = event.status ?? "under_review";
  const badge = BADGE_STYLES[status];
  const started = event.startedAt ?? event.timestamp;

  return (
    <Link
      href={`/events/${event.id}`}
      className={cn(
        "block group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded-xl",
        className
      )}
      aria-label={`View event: ${event.title}`}
    >
      <GlassCard
        variant="hover-lift"
        className="p-3 sm:p-4 bg-black/45 border-white/[0.12] overflow-hidden"
      >
        <div className="flex gap-3 sm:gap-4 items-stretch">
          {/* Thumbnail */}
          <div className="relative w-[100px] sm:w-[120px] md:w-[132px] shrink-0 rounded-lg overflow-hidden aspect-[4/3] self-start">
            <Image
              src={event.thumbnailUrl}
              alt=""
              fill
              className="object-cover"
              sizes="132px"
            />
            <div className="absolute top-2 left-2">
              <span
                className={cn(
                  "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide",
                  badge.className
                )}
              >
                {badge.label}
              </span>
            </div>
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1 flex flex-col">
            <h3 className="text-base sm:text-lg font-semibold text-white leading-snug group-hover:text-[#60A5FA] transition-colors line-clamp-1">
              {event.title}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-zinc-400">
              <span className="inline-flex items-center gap-1 min-w-0">
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {event.location.city}, {event.location.country}
                </span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {formatStartedAt(started)}
              </span>
            </div>
            {event.description && (
              <p className="mt-2 text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                {event.description}
              </p>
            )}
            {(event.tags?.length ?? 0) > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {event.tags!.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[11px] text-zinc-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stats column */}
          <div className="hidden sm:flex flex-col justify-center gap-2.5 shrink-0 w-[118px] border-l border-white/8 pl-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <FileText className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
              <div>
                <div className="text-white font-semibold tabular-nums text-sm">
                  {event.evidenceCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-500">Evidence Files</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-500/80" aria-hidden="true" />
              <div>
                <div className="text-white font-semibold tabular-nums text-sm">
                  {(event.verifiedCount ?? 0).toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-500">Verified</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Users className="w-3.5 h-3.5 text-zinc-500" aria-hidden="true" />
              <div>
                <div className="text-white font-semibold tabular-nums text-sm">
                  {(event.contributorCount ?? 0).toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-500">Contributors</div>
              </div>
            </div>
          </div>

          <div className="flex items-center shrink-0 text-zinc-500 group-hover:text-[#60A5FA] transition-colors">
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

export function ExploreEventGridCard({
  event,
  className,
}: ExploreEventListCardProps) {
  const status = event.status ?? "under_review";
  const badge = BADGE_STYLES[status];

  return (
    <Link
      href={`/events/${event.id}`}
      className={cn(
        "block group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded-xl h-full",
        className
      )}
      aria-label={`View event: ${event.title}`}
    >
      <GlassCard
        variant="hover-lift"
        className="overflow-hidden h-full bg-black/45 border-white/[0.12] flex flex-col"
      >
        <div className="relative aspect-[16/10]">
          <Image
            src={event.thumbnailUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <span
            className={cn(
              "absolute top-2.5 left-2.5 inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold",
              badge.className
            )}
          >
            {badge.label}
          </span>
        </div>
        <div className="p-3.5 flex-1 flex flex-col">
          <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-[#60A5FA]">
            {event.title}
          </h3>
          <p className="mt-1.5 text-xs text-zinc-400 line-clamp-1">
            {event.location.city}, {event.location.country}
          </p>
          <p className="mt-auto pt-3 text-xs text-zinc-500 tabular-nums">
            {event.evidenceCount.toLocaleString()} evidence files
          </p>
        </div>
      </GlassCard>
    </Link>
  );
}
