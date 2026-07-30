"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatStat } from "@/data/event-detail-data";
import type {
  EventTimelineStats,
  TimelineContributor,
  TimelineTopSource,
} from "@/data/event-timeline-data";
import { Download, FileDown } from "lucide-react";

export interface EventTimelineSidebarProps {
  stats: EventTimelineStats;
  contributors: TimelineContributor[];
  topSources: TimelineTopSource[];
  className?: string;
}

export function EventTimelineSidebar({
  stats,
  contributors,
  topSources,
  className,
}: EventTimelineSidebarProps) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const statItems = [
    { label: "Total Updates", value: formatStat(stats.totalUpdates) },
    { label: "Evidence Items", value: formatStat(stats.evidenceItems) },
    { label: "Sources", value: formatStat(stats.sources) },
    { label: "Contributors", value: formatStat(stats.contributors) },
  ];

  return (
    <aside className={cn("space-y-4", className)}>
      <section className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 backdrop-blur-md">
        <h3 className="mb-3 text-sm font-semibold text-white">Timeline Stats</h3>
        <div className="grid grid-cols-2 gap-2">
          {statItems.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
            >
              <p className="text-lg font-bold tabular-nums text-white">{s.value}</p>
              <p className="mt-0.5 text-[10px] text-zinc-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-white">Contributors</h3>
          <button
            type="button"
            onClick={() => showToast("Full contributors list coming soon")}
            className="text-[11px] font-medium text-[#60A5FA] hover:text-white"
          >
            View all
          </button>
        </div>
        <ul className="space-y-2.5">
          {contributors.map((c) => (
            <li key={c.id} className="flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/20 text-xs font-semibold text-[#93C5FD]"
                aria-hidden="true"
              >
                {c.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-zinc-200">{c.name}</p>
                <p className="text-[11px] text-zinc-500">
                  {c.contributionCount} contributions
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 backdrop-blur-md">
        <h3 className="mb-3 text-sm font-semibold text-white">Top Sources</h3>
        <ul className="space-y-2.5">
          {topSources.map((s) => (
            <li key={s.id} className="flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[10px] font-bold text-zinc-300"
                aria-hidden="true"
              >
                {s.abbrev}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-zinc-200">{s.name}</p>
              </div>
              <span className="tabular-nums text-xs text-zinc-500">
                {s.itemCount}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 backdrop-blur-md">
        <h3 className="mb-2 text-sm font-semibold text-white">Download Timeline</h3>
        <p className="mb-3 text-xs text-zinc-500">
          Export a portable copy of this event chronology.
        </p>
        <button
          type="button"
          onClick={() => showToast("PDF export coming soon")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10"
        >
          <FileDown className="h-4 w-4" aria-hidden="true" />
          Download as PDF
        </button>
      </section>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-white/12 bg-[#121214] px-4 py-2.5 text-sm text-zinc-200 shadow-xl lg:left-auto lg:right-6 lg:translate-x-0"
        >
          <Download className="h-4 w-4 text-[#60A5FA]" aria-hidden="true" />
          {toast}
        </div>
      )}
    </aside>
  );
}
