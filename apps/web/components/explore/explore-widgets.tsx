"use client";

import Link from "next/link";
import { GlassCard } from "../glass-card";
import { cn } from "@/lib/utils";
import { ArrowRight, TrendingUp } from "lucide-react";
import type { Event } from "@/types/event";

const HOTSPOTS = [
  { cx: 22, cy: 34, r: 2.4 },
  { cx: 28, cy: 52, r: 1.8 },
  { cx: 48, cy: 28, r: 2.2 },
  { cx: 52, cy: 48, r: 1.7 },
  { cx: 72, cy: 34, r: 2.6 },
  { cx: 80, cy: 42, r: 1.9 },
] as const;

function buildWorldDots() {
  const dots: Array<{ x: number; y: number }> = [];
  for (let y = 8; y <= 78; y += 3.2) {
    for (let x = 4; x <= 96; x += 3.2) {
      const inAmericas =
        x >= 8 &&
        x <= 36 &&
        y >= 14 &&
        y <= 70 &&
        Math.sin((y - 16) * 0.09) * 5 + 18 > x - 10;
      const inEuropeAfrica =
        x >= 40 && x <= 58 && y >= 14 && y <= 68 && !(x > 54 && y < 22);
      const inAsia =
        x >= 58 && x <= 92 && y >= 14 && y <= 54 && (x < 86 || y < 44);
      const inOceania = x >= 78 && x <= 94 && y >= 56 && y <= 74;
      if (
        (inAmericas || inEuropeAfrica || inAsia || inOceania) &&
        Math.round(x * 7 + y * 13) % 3 !== 0
      ) {
        dots.push({ x, y });
      }
    }
  }
  return dots;
}

const WORLD_DOTS = buildWorldDots();

export interface LiveEventMapWidgetProps {
  activeEvents: number;
  cities: number;
  countries: number;
  href?: string;
  className?: string;
}

export function LiveEventMapWidget({
  activeEvents,
  cities,
  countries,
  href = "/#map",
  className,
}: LiveEventMapWidgetProps) {
  return (
    <GlassCard
      className={cn("p-4 bg-black/45 border-white/[0.12]", className)}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Live Event Map</h3>
        <Link
          href={href}
          className="inline-flex items-center text-xs font-medium text-[#60A5FA] hover:text-white transition-colors"
        >
          View Full Map
          <ArrowRight className="ml-1 w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
      <div className="h-[120px] rounded-lg overflow-hidden mb-3 bg-black/30">
        <svg
          viewBox="0 0 100 80"
          className="w-full h-full"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid meet"
        >
          {WORLD_DOTS.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={0.5}
              className="fill-white/25"
            />
          ))}
          {HOTSPOTS.map((h, i) => (
            <g key={i}>
              <circle
                cx={h.cx}
                cy={h.cy}
                r={h.r * 2.4}
                className="fill-[#3B82F6]/20 motion-safe:animate-pulse"
              />
              <circle
                cx={h.cx}
                cy={h.cy}
                r={h.r}
                className="fill-[#3B82F6]"
                style={{
                  filter: "drop-shadow(0 0 4px rgba(59,130,246,0.9))",
                }}
              />
            </g>
          ))}
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Active Events", value: activeEvents },
          { label: "Cities", value: cities },
          { label: "Countries", value: countries },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-sm font-bold text-white tabular-nums">
              {s.value.toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-500 leading-tight mt-0.5">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export interface TrendingNowWidgetProps {
  events: Event[];
  className?: string;
}

export function TrendingNowWidget({
  events,
  className,
}: TrendingNowWidgetProps) {
  return (
    <GlassCard
      className={cn("p-4 bg-black/45 border-white/[0.12]", className)}
    >
      <h3 className="text-sm font-semibold text-white mb-3">Trending Now</h3>
      <ol className="space-y-3">
        {events.map((event, i) => (
          <li key={event.id}>
            <Link
              href={`/events/${event.id}`}
              className="flex items-start gap-2.5 group"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5 text-xs font-bold text-zinc-400">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-zinc-200 group-hover:text-[#60A5FA] transition-colors line-clamp-2 leading-snug">
                  {event.title}
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-zinc-500">
                  <TrendingUp
                    className="w-3 h-3 text-orange-400"
                    aria-hidden="true"
                  />
                  {event.evidenceCount.toLocaleString()} files
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </GlassCard>
  );
}

export interface PopularTagsWidgetProps {
  tags: Array<{ tag: string; count: number }>;
  activeTag?: string | null;
  onTagClick?: (tag: string) => void;
  className?: string;
}

export function PopularTagsWidget({
  tags,
  activeTag,
  onTagClick,
  className,
}: PopularTagsWidgetProps) {
  return (
    <GlassCard
      className={cn("p-4 bg-black/45 border-white/[0.12]", className)}
    >
      <h3 className="text-sm font-semibold text-white mb-3">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => {
          const active = activeTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick?.(tag)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
                active
                  ? "border-[#3B82F6] bg-[#3B82F6]/20 text-white"
                  : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/10"
              )}
            >
              <span>#{tag}</span>
              <span className="text-zinc-500 tabular-nums">{count}</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="mt-3 text-xs font-medium text-[#60A5FA] hover:text-white transition-colors"
        onClick={() => onTagClick?.("")}
      >
        View All Tags
      </button>
    </GlassCard>
  );
}
