"use client";

import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Event } from "@/types/event";
import { LANDING_REFERENCE_TIME } from "@/data/events-data";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

function formatUpdatedAt(
  timestamp: Date,
  now: Date = LANDING_REFERENCE_TIME
): string {
  const seconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
  if (seconds < 60) return "Updated just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Updated ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  return `Updated ${Math.floor(hours / 24)}d ago`;
}

const BADGE: Record<string, { label: string; className: string }> = {
  live: { label: "LIVE", className: "bg-[#3B82F6] text-white" },
  trending: { label: "TRENDING", className: "bg-orange-500 text-white" },
  verified: { label: "VERIFIED", className: "bg-emerald-500 text-white" },
  under_review: { label: "REVIEW", className: "bg-sky-600 text-white" },
};

export interface MapActivityStripProps {
  events: Event[];
  selectedEventId: string | null;
  onSelect: (eventId: string) => void;
  className?: string;
}

export function MapActivityStrip({
  events,
  selectedEventId,
  onSelect,
  className,
}: MapActivityStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, events]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section
      className={cn(
        "rounded-2xl border border-white/12 bg-[#121214]/90 p-3.5 backdrop-blur-md sm:p-4 lg:p-5",
        className
      )}
      aria-label="Recent global activity"
    >
      <div className="mb-3.5 flex items-center justify-between gap-3 sm:mb-4">
        <h2 className="text-base font-semibold text-white sm:text-lg">
          Recent Global Activity
        </h2>
        <a
          href="/events"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#60A5FA] hover:text-[#93C5FD]"
        >
          View all
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      <div className="relative">
        {canLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute -left-1 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/15 bg-[#121214] p-2 text-zinc-300 shadow-lg sm:flex"
            aria-label="Scroll activity left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {canRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute -right-1 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/15 bg-[#121214] p-2 text-zinc-300 shadow-lg sm:flex"
            aria-label="Scroll activity right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto overscroll-x-contain pb-1 scrollbar-hide sm:gap-4"
        >
          {events.length === 0 ? (
            <p className="py-8 text-sm text-zinc-500">
              No events match the current filters.
            </p>
          ) : (
            events.map((event) => {
              const statusKey = event.status ?? (event.badge === "live" ? "live" : "under_review");
              const badge = BADGE[statusKey] ?? BADGE.under_review;
              const selected = selectedEventId === event.id;
              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => onSelect(event.id)}
                  className={cn(
                    "w-[240px] shrink-0 overflow-hidden rounded-xl border text-left transition-colors sm:w-[260px] md:w-[280px]",
                    selected
                      ? "border-[#3B82F6] bg-[#3B82F6]/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                  )}
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={event.thumbnailUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 240px, 280px"
                    />
                    <span
                      className={cn(
                        "absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold",
                        badge.className
                      )}
                    >
                      {badge.label === "LIVE" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white motion-safe:animate-pulse" />
                      )}
                      {badge.label}
                    </span>
                  </div>
                  <div className="space-y-1.5 p-3 sm:p-3.5">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-white sm:text-[15px]">
                      {event.title}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">
                        {event.location.city}, {event.location.country}
                      </span>
                    </p>
                    <p className="text-xs text-zinc-600">
                      {formatUpdatedAt(event.startedAt ?? event.timestamp)}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
