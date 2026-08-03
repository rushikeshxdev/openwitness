"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Share2,
  Bookmark,
  Bell,
  ChevronRight,
} from "lucide-react";
import type { EventDetailViewModel } from "@/data/event-detail-data";
import { formatStat } from "@/data/event-detail-data";
import { EventDetailOverview } from "./event-detail-overview";
import { EventEvidenceTab } from "./event-evidence-tab";
import { EventReportsTab } from "./event-reports-tab";
import { EventDiscussionsTab } from "./event-discussions-tab";
import { LeafletEventMapClient } from "@/components/map/leaflet-event-map-client";
import type { LeafletMapMarker } from "@/components/map/leaflet-event-map";
import { GlassCard } from "@/components/glass-card";
import { useRouter } from "next/navigation";

export type EventDetailTab =
  | "overview"
  | "timeline"
  | "evidence"
  | "map"
  | "reports"
  | "discussions";

const STATUS_BADGE: Record<
  EventDetailViewModel["status"],
  { label: string; className: string }
> = {
  live: { label: "LIVE", className: "bg-[#3B82F6] text-white" },
  trending: { label: "TRENDING", className: "bg-orange-500 text-white" },
  verified: { label: "VERIFIED", className: "bg-emerald-500 text-white" },
  under_review: { label: "UNDER REVIEW", className: "bg-sky-600 text-white" },
};

export interface EventDetailViewProps {
  detail: EventDetailViewModel;
}

export function EventDetailView({ detail }: EventDetailViewProps) {
  const router = useRouter();
  const [tab, setTab] = useState<EventDetailTab>("overview");
  const [following, setFollowing] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const badge = STATUS_BADGE[detail.status];

  const mapMarkers = useMemo<LeafletMapMarker[]>(() => {
    if (!detail.coordinates) return [];
    return [
      {
        id: detail.id,
        latitude: detail.coordinates.latitude,
        longitude: detail.coordinates.longitude,
        title: detail.title,
        status: detail.status,
      },
    ];
  }, [detail]);

  const openTab = useCallback(
    (next: EventDetailTab) => {
      if (next === "timeline") {
        router.push(`/events/${detail.id}/timeline`);
        return;
      }
      setTab(next);
    },
    [detail.id, router]
  );

  const tabs: { id: EventDetailTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "timeline", label: "Timeline" },
    { id: "evidence", label: `Evidence (${detail.evidenceCount})` },
    { id: "map", label: "Map" },
    { id: "reports", label: "Reports" },
    { id: "discussions", label: `Discussions (${detail.discussionCount})` },
  ];

  const stats = [
    { value: formatStat(detail.evidenceCount), label: "Evidence Files" },
    { value: formatStat(detail.verifiedCount), label: "Verified" },
    { value: formatStat(detail.contributorCount), label: "Contributors" },
    { value: formatStat(detail.mediaOutlets), label: "Media Outlets" },
  ];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={detail.thumbnailUrl}
            alt=""
            fill
            priority
            quality={75}
            className="object-cover object-[50%_35%] brightness-[0.4] contrast-[1.05]"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#0B0E11]/85 via-[#0B0E11]/55 to-[#0B0E11]/35"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#0B0E11]/30 via-transparent to-[#0B0E11]"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-zinc-400"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" aria-hidden="true" />
            <Link href="/events" className="hover:text-white transition-colors">
              Explore Events
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" aria-hidden="true" />
            <span className="text-zinc-200 truncate max-w-[12rem] sm:max-w-md">
              {detail.title}
            </span>
          </nav>

          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide mb-4",
              badge.className
            )}
          >
            {detail.status === "live" && (
              <span className="w-1.5 h-1.5 rounded-full bg-white motion-safe:animate-pulse" />
            )}
            {badge.label}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-bold text-white tracking-tight max-w-4xl leading-[1.1]">
            {detail.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-300">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 shrink-0 text-zinc-400" aria-hidden="true" />
              {detail.city}, {detail.country}
            </span>
            <span className="text-zinc-600" aria-hidden="true">
              •
            </span>
            <span>{detail.startedLabel}</span>
          </div>

          <p className="mt-4 max-w-3xl text-sm sm:text-base text-zinc-300 leading-relaxed">
            {detail.description}
          </p>

          {/* Stats + actions */}
          <div className="mt-7 flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 flex-1 min-w-0">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/12 bg-black/40 backdrop-blur-md px-3.5 py-3.5 sm:px-4 flex flex-col justify-center"
                >
                  <div className="text-xl sm:text-2xl font-bold text-white tabular-nums leading-none">
                    {value}
                  </div>
                  <div className="mt-1.5 text-[11px] sm:text-xs text-zinc-400">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 shrink-0 lg:self-end">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 backdrop-blur-md px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-white/10 transition-colors"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.share) {
                    void navigator.share({
                      title: detail.title,
                      url:
                        typeof window !== "undefined"
                          ? window.location.href
                          : "",
                    });
                  } else if (typeof navigator !== "undefined" && navigator.clipboard) {
                    void navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                <Share2 className="w-4 h-4" aria-hidden="true" />
                Share
              </button>
              <button
                type="button"
                aria-pressed={bookmarked}
                onClick={() => setBookmarked((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors backdrop-blur-md",
                  bookmarked
                    ? "border-[#3B82F6] bg-[#3B82F6]/20 text-white"
                    : "border-white/15 bg-black/40 text-zinc-200 hover:bg-white/10"
                )}
              >
                <Bookmark className="w-4 h-4" aria-hidden="true" />
                Bookmark
              </button>
              <button
                type="button"
                aria-pressed={following}
                onClick={() => setFollowing((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                  following
                    ? "bg-white/15 text-white border border-white/20"
                    : "bg-[#3B82F6] text-white hover:bg-[#2563EB] border border-transparent"
                )}
              >
                <Bell className="w-4 h-4" aria-hidden="true" />
                {following ? "Following" : "Follow"}
                <span className="opacity-90 tabular-nums font-medium">
                  {formatStat(detail.followerCount)}
                </span>
              </button>
            </div>
          </div>

          {/* Tabs flush under hero */}
          <div
            className="mt-8 flex gap-0.5 overflow-x-auto border-b border-white/10 scrollbar-hide"
            role="tablist"
            aria-label="Event sections"
          >
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => openTab(t.id)}
                  className={cn(
                    "relative shrink-0 px-3.5 sm:px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                    active ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  {t.label}
                  {active && (
                    <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#3B82F6]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-9">
        {tab === "overview" && (
          <EventDetailOverview detail={detail} onOpenTab={openTab} />
        )}
        {tab === "evidence" && <EventEvidenceTab detail={detail} />}
        {tab === "reports" && <EventReportsTab detail={detail} />}
        {tab === "discussions" && <EventDiscussionsTab detail={detail} />}
        {tab === "map" && (
          <GlassCard className="p-4 sm:p-5 bg-[#121214]/90 border-white/[0.12]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Event Map</h2>
                <p className="mt-1 text-sm text-zinc-400 inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#60A5FA]" aria-hidden="true" />
                  {detail.city}, {detail.country}
                  {detail.coordinates && (
                    <span className="tabular-nums text-zinc-600">
                      · {detail.coordinates.latitude.toFixed(4)},{" "}
                      {detail.coordinates.longitude.toFixed(4)}
                    </span>
                  )}
                </p>
              </div>
              <Link
                href="/map"
                className="text-sm font-medium text-[#60A5FA] hover:text-white"
              >
                Open Live Map
              </Link>
            </div>
            <div className="relative h-[420px] sm:h-[520px] rounded-xl overflow-hidden border border-white/8 bg-[#0a1220]">
              {mapMarkers.length > 0 ? (
                <LeafletEventMapClient
                  markers={mapMarkers}
                  center={{
                    latitude: detail.coordinates!.latitude,
                    longitude: detail.coordinates!.longitude,
                    zoom: 12,
                  }}
                  selectedId={detail.id}
                  cluster={false}
                  interactive
                  showZoomControls
                  showAttribution
                  ariaLabel={`Full map of ${detail.title}`}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                  No coordinates available for this event
                </div>
              )}
            </div>
          </GlassCard>
        )}
        {tab !== "overview" &&
          tab !== "map" &&
          tab !== "evidence" &&
          tab !== "reports" &&
          tab !== "discussions" && (
          <div className="rounded-2xl border border-white/10 bg-black/35 px-6 py-16 text-center">
            <p className="text-lg font-medium text-white capitalize">{tab}</p>
            <p className="mt-2 text-sm text-zinc-400 max-w-md mx-auto">
              This section is coming next. Overview is fully available for{" "}
              {detail.title}.
            </p>
            <button
              type="button"
              onClick={() => setTab("overview")}
              className="mt-5 text-sm font-medium text-[#60A5FA] hover:text-white"
            >
              Back to Overview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
