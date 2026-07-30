"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  buildEventDetail,
  CATEGORY_LABEL,
  formatStat,
  type EventDetailViewModel,
} from "@/data/event-detail-data";
import {
  ArrowRight,
  BadgeCheck,
  Expand,
  MapPin,
  Share2,
  Users,
  X,
} from "lucide-react";

type PanelTab = "overview" | "timeline" | "evidence" | "map" | "reports";

const STATUS_BADGE: Record<
  EventDetailViewModel["status"],
  { label: string; className: string }
> = {
  live: { label: "LIVE", className: "bg-[#3B82F6] text-white" },
  trending: { label: "TRENDING", className: "bg-orange-500 text-white" },
  verified: { label: "VERIFIED", className: "bg-emerald-500 text-white" },
  under_review: { label: "UNDER REVIEW", className: "bg-sky-600 text-white" },
};

const IMPACT_DOT: Record<EventDetailViewModel["impactLevel"], string> = {
  high: "bg-red-500",
  medium: "bg-orange-400",
  low: "bg-emerald-400",
};

export interface MapIncidentPanelProps {
  eventId: string | null;
  onClose: () => void;
  className?: string;
}

export function MapIncidentPanel({
  eventId,
  onClose,
  className,
}: MapIncidentPanelProps) {
  const [tab, setTab] = useState<PanelTab>("overview");
  const detail = eventId ? buildEventDetail(eventId) : null;

  useEffect(() => {
    setTab("overview");
  }, [eventId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!eventId || !detail) {
    return (
      <aside
        className={cn(
          "flex h-full flex-col items-center justify-center rounded-2xl border border-white/12 bg-[#121214]/90 p-6 text-center backdrop-blur-md",
          className
        )}
      >
        <MapPin className="mb-3 h-8 w-8 text-zinc-600" aria-hidden="true" />
        <p className="text-sm font-medium text-zinc-300">Select an incident</p>
        <p className="mt-1 max-w-[220px] text-xs text-zinc-500">
          Click a map marker or activity card to inspect details here.
        </p>
      </aside>
    );
  }

  const badge = STATUS_BADGE[detail.status];
  const tabs: { id: PanelTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "timeline", label: "Timeline" },
    { id: "evidence", label: `Evidence (${detail.evidenceCount})` },
    { id: "map", label: "Map" },
    { id: "reports", label: "Reports" },
  ];

  const metrics = [
    { label: "Evidence Files", value: formatStat(detail.evidenceCount) },
    { label: "Verified Items", value: formatStat(detail.verifiedCount) },
    { label: "Media Captured", value: formatStat(detail.contributorCount) },
    { label: "Sources", value: formatStat(detail.mediaOutlets) },
  ];

  return (
    <aside
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#121214]/95 backdrop-blur-md",
        className
      )}
      aria-label={`Incident details: ${detail.title}`}
    >
      <div className="relative aspect-[16/10] shrink-0">
        <Image
          src={detail.thumbnailUrl}
          alt=""
          fill
          className="object-cover"
          sizes="360px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-black/20" />
        <div className="absolute left-3 top-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold tracking-wide",
              badge.className
            )}
          >
            {detail.status === "live" && (
              <span className="h-1.5 w-1.5 rounded-full bg-white motion-safe:animate-pulse" />
            )}
            {badge.label}
          </span>
        </div>
        <div className="absolute right-2 top-2 flex gap-1">
          <Link
            href={`/events/${detail.id}`}
            className="rounded-lg border border-white/15 bg-black/40 p-1.5 text-zinc-200 backdrop-blur-sm transition-colors hover:bg-black/60"
            aria-label="Open full event page"
          >
            <Expand className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            className="rounded-lg border border-white/15 bg-black/40 p-1.5 text-zinc-200 backdrop-blur-sm transition-colors hover:bg-black/60"
            aria-label="Share"
            onClick={() => {
              void navigator.clipboard?.writeText(
                `${window.location.origin}/events/${detail.id}`
              );
            }}
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 bg-black/40 p-1.5 text-zinc-200 backdrop-blur-sm transition-colors hover:bg-black/60"
            aria-label="Close panel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
        <h2 className="text-lg font-semibold leading-snug text-white">
          {detail.title}
        </h2>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-400">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {detail.city}, {detail.country}
          <span className="text-zinc-600">·</span>
          {detail.startedLabel}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400 line-clamp-3">
          {detail.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-zinc-300">
            <BadgeCheck className="h-3 w-3 text-[#3B82F6]" aria-hidden="true" />
            Verified
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-zinc-300">
            <Users className="h-3 w-3" aria-hidden="true" />
            {formatStat(detail.followerCount)} Contributors
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
            >
              <p className="text-base font-bold tabular-nums text-white">
                {m.value}
              </p>
              <p className="mt-0.5 text-[10px] text-zinc-500">{m.label}</p>
            </div>
          ))}
        </div>

        <div
          className="mt-4 flex gap-1 overflow-x-auto border-b border-white/10 pb-px scrollbar-hide"
          role="tablist"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 border-b-2 px-2.5 py-2 text-xs font-medium transition-colors",
                tab === t.id
                  ? "border-[#3B82F6] text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex-1" role="tabpanel">
          {tab === "overview" ? (
            <OverviewBody detail={detail} />
          ) : (
            <p className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-3 py-6 text-center text-xs text-zinc-500">
              {tabs.find((t) => t.id === tab)?.label} coming next — open the
              full event page for more.
            </p>
          )}
        </div>

        <Link
          href={`/events/${detail.id}`}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2563EB]"
        >
          View Evidence
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}

function OverviewBody({ detail }: { detail: EventDetailViewModel }) {
  const rows: { label: string; value: ReactNode }[] = [
    { label: "Category", value: CATEGORY_LABEL[detail.category] },
    {
      label: "Impact Level",
      value: (
        <span className="inline-flex items-center gap-1.5 capitalize">
          <span
            className={cn("h-1.5 w-1.5 rounded-full", IMPACT_DOT[detail.impactLevel])}
          />
          {detail.impactLevel}
        </span>
      ),
    },
    { label: "Visibility", value: detail.visibility },
    {
      label: "Location",
      value: (
        <span>
          {detail.city}, {detail.country}
        </span>
      ),
    },
    { label: "Start Date", value: detail.startDateLabel },
    { label: "Last Updated", value: detail.lastUpdatedLabel },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <p className="text-[11px] uppercase tracking-wider text-zinc-500">
          Event Status
        </p>
        <p className="mt-1 text-sm text-zinc-200">
          <span className="capitalize text-white">{detail.status.replace("_", " ")}</span>
          <span className="text-zinc-600"> · </span>
          {detail.lastUpdatedLabel}
        </p>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <p className="text-[11px] uppercase tracking-wider text-zinc-500">
          Verification
        </p>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-zinc-200">
          <BadgeCheck className="h-3.5 w-3.5 text-[#3B82F6]" aria-hidden="true" />
          Verified by OpenWitness Community
        </p>
      </div>
      <dl className="space-y-2.5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-3 text-sm"
          >
            <dt className="text-zinc-500">{row.label}</dt>
            <dd className="text-right text-zinc-200">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
