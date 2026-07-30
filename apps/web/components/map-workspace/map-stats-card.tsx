"use client";

import { cn } from "@/lib/utils";
import { MAP_STATS } from "@/data/map-workspace-data";

export interface MapStatsCardProps {
  totalActive?: number;
  weekDelta?: number;
  sparkline?: readonly number[];
  className?: string;
}

export function MapStatsCard({
  totalActive = MAP_STATS.totalActive,
  weekDelta = MAP_STATS.weekDelta,
  sparkline = MAP_STATS.sparkline,
  className,
}: MapStatsCardProps) {
  const max = Math.max(...sparkline, 1);
  const w = 120;
  const h = 36;
  const points = sparkline
    .map((v, i) => {
      const x = (i / (sparkline.length - 1)) * w;
      const y = h - (v / max) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/12 bg-[#121214]/90 p-4 backdrop-blur-md",
        className
      )}
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Active Events
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-white">
            {totalActive.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-emerald-400">
            +{weekDelta} this week
          </p>
        </div>
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          className="shrink-0 opacity-90"
          aria-hidden="true"
        >
          <polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>
      </div>
    </div>
  );
}
