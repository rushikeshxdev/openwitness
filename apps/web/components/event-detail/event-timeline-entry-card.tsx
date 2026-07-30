"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ACCENT_HEX,
  formatViews,
  type EventTimelineEntry,
  type TimelineAccent,
} from "@/data/event-timeline-data";
import {
  BadgeCheck,
  FileText,
  Megaphone,
  MoreHorizontal,
  Play,
  Radio,
  Shield,
  Video,
} from "lucide-react";

function CategoryIcon({
  category,
  accent,
}: {
  category: EventTimelineEntry["category"];
  accent: TimelineAccent;
}) {
  const color = ACCENT_HEX[accent];
  const cls = "h-4 w-4";
  const style = { color };
  switch (category) {
    case "evidence":
      return <FileText className={cls} style={style} aria-hidden="true" />;
    case "official":
      return <Shield className={cls} style={style} aria-hidden="true" />;
    case "media":
      return <Video className={cls} style={style} aria-hidden="true" />;
    case "report":
      return <Radio className={cls} style={style} aria-hidden="true" />;
    default:
      return <Megaphone className={cls} style={style} aria-hidden="true" />;
  }
}

export interface EventTimelineEntryCardProps {
  entry: EventTimelineEntry;
  className?: string;
}

export function EventTimelineEntryCard({
  entry,
  className,
}: EventTimelineEntryCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-white/12 bg-[#121214]/90 p-4 backdrop-blur-md sm:p-5",
        className
      )}
    >
      <div className="flex gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2.5">
            <span
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]"
              aria-hidden="true"
            >
              <CategoryIcon category={entry.category} accent={entry.accent} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold leading-snug text-white sm:text-base">
                  {entry.title}
                </h3>
                <button
                  type="button"
                  className="shrink-0 rounded-md p-1 text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-1.5">
                {entry.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#3B82F6]/15 px-2 py-0.5 text-[11px] font-semibold text-[#60A5FA]">
                    <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
                    Unverified
                  </span>
                )}
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
                {entry.summary}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                <span>Source: {entry.sourceLabel}</span>
                <span className="text-zinc-700" aria-hidden="true">
                  ·
                </span>
                <span>{formatViews(entry.views)} views</span>
              </div>
            </div>
          </div>
        </div>

        {entry.media && (
          <div className="relative hidden h-[88px] w-[120px] shrink-0 overflow-hidden rounded-xl border border-white/10 sm:block">
            <Image
              src={entry.media.thumbnailUrl}
              alt=""
              fill
              className="object-cover"
              sizes="120px"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/35">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black">
                <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              </span>
            </div>
            <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white tabular-nums">
              {entry.media.duration}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
