"use client";

import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "../glass-card";
import {
  CATEGORY_LABEL,
  sourceAbbrev,
  type EventDetailViewModel,
} from "@/data/event-detail-data";
import type { EventDetailTab } from "./event-detail-view";
import {
  BadgeCheck,
  Play,
  ArrowRight,
  MapPin,
  Send,
  Twitter,
  Instagram,
  Facebook,
  Newspaper,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { TimelineSource } from "@/data/event-detail-data";

function SourceIcon({ source }: { source: TimelineSource }) {
  const cls = "w-3 h-3";
  switch (source) {
    case "telegram":
      return <Send className={cls} aria-hidden="true" />;
    case "twitter":
      return <Twitter className={cls} aria-hidden="true" />;
    case "instagram":
      return <Instagram className={cls} aria-hidden="true" />;
    case "facebook":
      return <Facebook className={cls} aria-hidden="true" />;
    default:
      return <Newspaper className={cls} aria-hidden="true" />;
  }
}

export interface EventDetailOverviewProps {
  detail: EventDetailViewModel;
  onOpenTab?: (tab: EventDetailTab) => void;
}

export function EventDetailOverview({
  detail,
  onOpenTab,
}: EventDetailOverviewProps) {
  const [zoom, setZoom] = useState(1);
  const evidenceRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const impactColor =
    detail.impactLevel === "high"
      ? "bg-red-500"
      : detail.impactLevel === "medium"
        ? "bg-orange-400"
        : "bg-emerald-400";

  const checkEvidenceScroll = useCallback(() => {
    const el = evidenceRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = evidenceRef.current;
    if (!el) return;
    checkEvidenceScroll();
    el.addEventListener("scroll", checkEvidenceScroll);
    window.addEventListener("resize", checkEvidenceScroll);
    return () => {
      el.removeEventListener("scroll", checkEvidenceScroll);
      window.removeEventListener("resize", checkEvidenceScroll);
    };
  }, [checkEvidenceScroll, detail.evidenceHighlights]);

  const scrollEvidence = (dir: "left" | "right") => {
    evidenceRef.current?.scrollBy({
      left: dir === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  const markerScale = 0.85 + zoom * 0.2;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-start">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-5">
          {/* Interactive map */}
          <GlassCard className="p-4 sm:p-5 bg-[#121214]/90 border-white/[0.12]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-white">
                Interactive Map
              </h2>
              <button
                type="button"
                onClick={() => onOpenTab?.("map")}
                className="text-sm font-medium text-[#60A5FA] hover:text-white inline-flex items-center gap-1"
              >
                View full map
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="relative h-[240px] sm:h-[300px] rounded-xl overflow-hidden bg-[#0a1220] border border-white/8">
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full opacity-45"
                aria-hidden="true"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center",
                  transition: "transform 200ms ease",
                }}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    y1={8 + i * 8}
                    x2="100"
                    y2={8 + i * 8}
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="0.3"
                  />
                ))}
                {Array.from({ length: 14 }).map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={6 + i * 7}
                    y1="0"
                    x2={6 + i * 7}
                    y2="100"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="0.3"
                  />
                ))}
                <path
                  d="M10 70 Q 30 40 50 55 T 90 35"
                  fill="none"
                  stroke="rgba(59,130,246,0.4)"
                  strokeWidth="1.2"
                />
                <path
                  d="M5 30 Q 40 20 70 45 T 95 70"
                  fill="none"
                  stroke="rgba(148,163,184,0.3)"
                  strokeWidth="0.8"
                />
              </svg>
              {detail.mapClusters.map((c) => (
                <div
                  key={c.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
                  style={{
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    transform: `translate(-50%, -50%) scale(${markerScale})`,
                  }}
                  title={`${c.label}: ${c.count}`}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-12 h-12 rounded-full bg-[#3B82F6]/25 motion-safe:animate-pulse" />
                    <span className="relative z-10 min-w-[2rem] h-8 px-2 rounded-full bg-[#3B82F6] text-white text-xs font-bold flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.7)]">
                      {c.count}
                    </span>
                  </div>
                </div>
              ))}

              {/* Zoom controls */}
              <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-20">
                <button
                  type="button"
                  aria-label="Zoom in"
                  onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-black/60 text-white hover:bg-black/80 backdrop-blur-md"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Zoom out"
                  onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-black/60 text-white hover:bg-black/80 backdrop-blur-md"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Timeline overview */}
          <GlassCard className="p-4 sm:p-5 bg-[#121214]/90 border-white/[0.12]">
            <div className="flex items-center justify-between mb-4 gap-3">
              <h2 className="text-base font-semibold text-white">
                Timeline Overview
              </h2>
              <button
                type="button"
                onClick={() => onOpenTab?.("timeline")}
                className="text-sm font-medium text-[#60A5FA] hover:text-white inline-flex items-center gap-1 shrink-0"
              >
                View full timeline
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
            <ol className="relative space-y-0 list-none m-0 p-0">
              <div
                className="absolute left-[5px] top-2 bottom-2 w-px bg-white/10"
                aria-hidden="true"
              />
              {detail.timeline.map((item, index) => (
                <li
                  key={item.id}
                  className={cn(
                    "relative pl-7 py-3",
                    index === 0 && "pt-0",
                    index === detail.timeline.length - 1 && "pb-0"
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-0 w-2.5 h-2.5 rounded-full border-2 z-10",
                      index === 0 ? "top-1" : "top-[1.1rem]",
                      index === 0
                        ? "bg-[#3B82F6] border-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.7)]"
                        : "bg-[#0a0a0c] border-[#3B82F6]/80"
                    )}
                    aria-hidden="true"
                  />
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-zinc-500 mb-0.5">
                        {item.timeLabel}
                      </p>
                      <p className="text-sm text-zinc-200 leading-snug">
                        {item.summary}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-zinc-400 shrink-0">
                      <SourceIcon source={item.source} />
                      {sourceAbbrev(item.source)}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4 pt-3 border-t border-white/8 flex justify-end">
              <button
                type="button"
                onClick={() => onOpenTab?.("timeline")}
                className="text-sm font-medium text-[#60A5FA] hover:text-white inline-flex items-center gap-1"
              >
                View full timeline
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right sidebar */}
        <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          <GlassCard className="p-4 sm:p-5 bg-[#121214]/90 border-white/[0.12]">
            <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500 mb-2.5">
              Event Status
            </h3>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400 motion-safe:animate-ping opacity-60" />
                <span className="relative rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-base font-semibold text-white capitalize">
                {detail.status === "under_review"
                  ? "Under Review"
                  : detail.status === "live"
                    ? "Live"
                    : detail.status}
              </span>
            </div>
            <p className="mt-2.5 text-xs text-zinc-500">
              {detail.lastUpdatedLabel}
            </p>
          </GlassCard>

          <GlassCard className="p-4 sm:p-5 bg-[#121214]/90 border-white/[0.12]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B82F6]/15 text-[#3B82F6] shrink-0">
                <BadgeCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Verified</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  By OpenWitness Community
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Critical information for this event has been reviewed by the
              OpenWitness community.
            </p>
            <button
              type="button"
              className="mt-3 text-sm font-medium text-[#60A5FA] hover:text-white"
            >
              Learn about verification
            </button>
          </GlassCard>

          <GlassCard className="p-4 sm:p-5 bg-[#121214]/90 border-white/[0.12]">
            <h3 className="text-sm font-semibold text-white mb-3.5">
              Key Details
            </h3>
            <dl className="space-y-3.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Category</dt>
                <dd className="text-zinc-200 text-right">
                  {CATEGORY_LABEL[detail.category]}
                </dd>
              </div>
              <div className="flex justify-between gap-3 items-center">
                <dt className="text-zinc-500">Impact Level</dt>
                <dd className="inline-flex items-center gap-1.5 text-zinc-200 capitalize">
                  <span className={cn("w-2 h-2 rounded-full", impactColor)} />
                  {detail.impactLevel}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Visibility</dt>
                <dd className="text-zinc-200 capitalize">{detail.visibility}</dd>
              </div>
              <div className="flex justify-between gap-3 items-start">
                <dt className="text-zinc-500">Location</dt>
                <dd className="text-right">
                  <div className="text-zinc-200">
                    {detail.city}, {detail.country}
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenTab?.("map")}
                    className="inline-flex items-center gap-1 text-xs text-[#60A5FA] mt-0.5 hover:text-white"
                  >
                    <MapPin className="w-3 h-3" aria-hidden="true" />
                    View on map
                  </button>
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Start Date</dt>
                <dd className="text-zinc-200 text-right text-xs sm:text-sm">
                  {detail.startDateLabel}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Last Updated</dt>
                <dd className="text-zinc-200 text-right text-xs sm:text-sm">
                  {detail.lastUpdatedLabel.replace(/^Last updated /i, "")}
                </dd>
              </div>
              <div className="pt-1 border-t border-white/8">
                <dt className="text-zinc-500 mb-2.5 mt-3">Source</dt>
                <dd className="flex items-center gap-1.5">
                  {[Send, Twitter, Instagram, Facebook].map((Icon, i) => (
                    <span
                      key={i}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400"
                    >
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  ))}
                  <span className="text-xs text-zinc-500 ml-1">
                    +{detail.sourceCount}
                  </span>
                </dd>
              </div>
            </dl>
          </GlassCard>

          <GlassCard className="p-4 sm:p-5 bg-[#121214]/90 border-white/[0.12]">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-semibold text-white">AI Summary</h3>
              <span className="rounded-full bg-[#3B82F6]/15 text-[#60A5FA] text-[10px] font-bold px-2 py-0.5 tracking-wide">
                BETA
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {detail.aiSummary}
            </p>
            <button
              type="button"
              className="mt-3 text-sm font-medium text-[#60A5FA] hover:text-white inline-flex items-center gap-1"
            >
              View full AI report
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </GlassCard>
        </aside>
      </div>

      {/* Evidence highlights */}
      <section>
        <div className="flex items-center justify-between mb-4 gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Evidence Highlights
          </h2>
          <button
            type="button"
            onClick={() => onOpenTab?.("evidence")}
            className="text-sm font-medium text-[#60A5FA] hover:text-white whitespace-nowrap inline-flex items-center gap-1"
          >
            View all evidence ({detail.evidenceCount})
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative">
          {canScrollLeft && (
            <button
              type="button"
              aria-label="Scroll evidence left"
              onClick={() => scrollEvidence("left")}
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white backdrop-blur-md hover:bg-black/90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              aria-label="Scroll evidence right"
              onClick={() => scrollEvidence("right")}
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white backdrop-blur-md hover:bg-black/90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <div
            ref={evidenceRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
          >
            {detail.evidenceHighlights.map((item) => (
              <article
                key={item.id}
                className="w-[200px] sm:w-[220px] shrink-0 rounded-xl border border-white/12 bg-[#121214]/90 overflow-hidden group"
              >
                <div className="relative aspect-video">
                  <Image
                    src={item.thumbnailUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="220px"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
                  <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white tabular-nums">
                    {item.duration}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-lg">
                      <Play
                        className="w-4 h-4 fill-current ml-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-white line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <p className="text-[11px] text-zinc-500">
                      Video • {item.relativeLabel}
                    </p>
                    {item.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400">
                        <BadgeCheck
                          className="w-3.5 h-3.5"
                          aria-hidden="true"
                        />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
