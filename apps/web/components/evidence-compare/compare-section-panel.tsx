"use client";

import type { ReactNode } from "react";
import type {
  CompareTabId,
  CompareViewModel,
} from "@/data/compare-evidence-data";
import {
  CompareMetricCards,
  CompareScoreRing,
} from "./compare-score-metrics";
import { CompareTimelineAlign } from "./compare-timeline-align";
import { CompareDetailsTable } from "./compare-details-table";

function Panel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5">
      <h2 className="text-base font-semibold text-white sm:text-lg">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function CompareSectionPanel({
  tab,
  model,
}: {
  tab: CompareTabId;
  model: CompareViewModel;
}) {
  switch (tab) {
    case "overview":
      return null;
    case "visual": {
      const visual = model.scores.metrics.find((m) => m.key === "visual");
      return (
        <Panel title="Visual Match">
          <p className="text-sm text-zinc-300">
            Visual similarity measures shared landmarks and scene layout across
            angles. High scores support corroboration; they do not prove a
            single clip is authentic by itself.
          </p>
          {visual ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-3xl font-bold tabular-nums text-white">
                {visual.percent}%
              </p>
              <p className="mt-1 text-sm text-zinc-400">{visual.qualitative}</p>
            </div>
          ) : null}
        </Panel>
      );
    }
    case "location":
      return (
        <div className="space-y-5">
          <Panel title="Location & Time">
            <p className="text-sm text-zinc-300">
              Location and time consistency check whether captures overlap in
              place and window — the strongest corroboration signals for same
              incident.
            </p>
          </Panel>
          <div className="flex flex-col gap-3 lg:flex-row">
            <CompareScoreRing scores={model.scores} />
            <CompareMetricCards
              scores={{
                ...model.scores,
                metrics: model.scores.metrics.filter(
                  (m) => m.key === "location" || m.key === "time"
                ),
              }}
            />
          </div>
          <CompareTimelineAlign timeline={model.timeline} />
        </div>
      );
    case "metadata":
      return <CompareDetailsTable slots={model.slots} />;
    case "audio": {
      const audio = model.scores.metrics.find((m) => m.key === "audio");
      return (
        <Panel title="Audio">
          <p className="text-sm text-zinc-300">
            Audio similarity is often weaker across distant or drone angles.
            Treat it as supporting context, not a sole authenticity signal.
          </p>
          {audio ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-3xl font-bold tabular-nums text-white">
                {audio.percent}%
              </p>
              <p className="mt-1 text-sm text-zinc-400">{audio.qualitative}</p>
            </div>
          ) : null}
        </Panel>
      );
    }
    case "verification":
      return (
        <Panel title="Verification">
          <ul className="divide-y divide-white/10">
            {model.slots.map((slot) => (
              <li
                key={slot.letter}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {slot.letter}. {slot.title}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">{slot.uploader}</p>
                </div>
                <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-400">
                  {slot.statusLabel}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-zinc-500">
            Per-item verification is independent of the overall match score.
          </p>
        </Panel>
      );
    case "details":
      return <CompareDetailsTable slots={model.slots} />;
    default:
      return null;
  }
}
