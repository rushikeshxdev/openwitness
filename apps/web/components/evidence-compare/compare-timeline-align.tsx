"use client";

import { cn } from "@/lib/utils";
import type {
  CompareTimeline,
  CompareTimelinePointKind,
} from "@/data/compare-evidence-data";

const POINT_CLASS: Record<CompareTimelinePointKind, string> = {
  recording: "bg-[#3B82F6]",
  key: "bg-emerald-400",
  missing: "bg-orange-400",
};

export function CompareTimelineAlign({
  timeline,
}: {
  timeline: CompareTimeline;
}) {
  return (
    <section
      className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5"
      aria-labelledby="timeline-align-heading"
    >
      <h2
        id="timeline-align-heading"
        className="text-base font-semibold text-white sm:text-lg"
      >
        Timeline Alignment
      </h2>

      <div className="mt-5 space-y-4">
        {timeline.tracks.map((track) => (
          <div key={track.letter} className="flex items-center gap-3">
            <span className="w-5 shrink-0 text-center text-xs font-bold text-zinc-400">
              {track.letter}
            </span>
            <div className="relative h-2 flex-1 rounded-full bg-white/[0.06]">
              <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-[#3B82F6]/25" />
              {track.points.map((p, i) => (
                <span
                  key={`${track.letter}-${i}`}
                  className={cn(
                    "absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[#121214]",
                    POINT_CLASS[p.kind]
                  )}
                  style={{ left: `${p.at}%` }}
                  title={p.kind}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="relative ml-8 h-6">
          <div
            className="absolute top-0 bottom-0 w-px bg-white"
            style={{ left: `${timeline.currentAt}%` }}
            aria-hidden="true"
          />
          <span
            className="absolute top-0 -translate-x-1/2 rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-black"
            style={{ left: `${timeline.currentAt}%` }}
          >
            {timeline.currentLabel}
          </span>
        </div>

        <div className="ml-8 flex justify-between text-[10px] text-zinc-500 sm:text-xs">
          {timeline.axisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-4 border-t border-white/10 pt-3 text-xs text-zinc-400">
        {timeline.legend.map((item) => (
          <li key={item.kind} className="inline-flex items-center gap-1.5">
            <span
              className={cn("h-2 w-2 rounded-full", POINT_CLASS[item.kind])}
            />
            {item.label}
          </li>
        ))}
        <li className="inline-flex items-center gap-1.5">
          <span className="h-3 w-px bg-white" />
          Current time
        </li>
      </ul>
    </section>
  );
}
