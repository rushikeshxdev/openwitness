"use client";

import { cn } from "@/lib/utils";
import type { ProfileHeatmapStats } from "@/data/profile-data";
import { formatPoints } from "@/data/profile-data";

const LEVEL_CLASS = [
  "bg-white/[0.06]",
  "bg-[#1E3A8A]/60",
  "bg-[#2563EB]/70",
  "bg-[#3B82F6]",
  "bg-[#60A5FA]",
];

export function ContributorHeatmap({
  cells,
  year,
  stats,
}: {
  cells: number[];
  year: number;
  stats: ProfileHeatmapStats;
}) {
  const weeks: number[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const footer = [
    { label: "Days Active", value: stats.daysActive },
    { label: "Events Contributed", value: stats.eventsContributed },
    { label: "Organizations Worked With", value: stats.organizationsWorkedWith },
    { label: "Countries Contributed", value: stats.countriesContributed },
  ];

  return (
    <section
      className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5"
      aria-labelledby="contrib-heatmap-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          id="contrib-heatmap-heading"
          className="text-base font-semibold text-white sm:text-lg"
        >
          Contribution Activity
        </h2>
        <span className="text-xs text-zinc-500">{year}</span>
      </div>

      <div className="mt-4 overflow-x-auto pb-1">
        <div
          className="inline-flex gap-[3px]"
          role="img"
          aria-label={`Contribution heatmap for ${year}`}
        >
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((level, di) => (
                <span
                  key={`${wi}-${di}`}
                  className={cn(
                    "h-[11px] w-[11px] rounded-[2px]",
                    LEVEL_CLASS[level] ?? LEVEL_CLASS[0]
                  )}
                  title={`${level} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-zinc-500">
        <span>Less</span>
        {LEVEL_CLASS.map((cls, i) => (
          <span key={i} className={cn("h-2.5 w-2.5 rounded-[2px]", cls)} />
        ))}
        <span>More</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 sm:grid-cols-4">
        {footer.map((item) => (
          <div key={item.label} className="text-center sm:text-left">
            <p className="text-lg font-bold tabular-nums text-white">
              {formatPoints(item.value)}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
