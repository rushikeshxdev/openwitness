"use client";

import { cn } from "@/lib/utils";
import type { QueueStats } from "@/data/verification-queue-data";
import { CircleHelp } from "lucide-react";

const STAT_CARDS: Array<{
  key: keyof QueueStats;
  label: string;
  bar: string;
  valueClass: string;
}> = [
  {
    key: "pending",
    label: "Pending Review",
    bar: "bg-amber-400",
    valueClass: "text-amber-300",
  },
  {
    key: "underReview",
    label: "Under Review",
    bar: "bg-sky-400",
    valueClass: "text-sky-300",
  },
  {
    key: "verifiedToday",
    label: "Verified Today",
    bar: "bg-emerald-400",
    valueClass: "text-emerald-300",
  },
  {
    key: "rejectedToday",
    label: "Rejected Today",
    bar: "bg-rose-400",
    valueClass: "text-rose-300",
  },
];

export function VerificationQueueHeader({ stats }: { stats: QueueStats }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Community Verification
          </h1>
          <p className="mt-1 max-w-xl text-sm text-zinc-400">
            Review submitted evidence and help keep the OpenWitness record
            accurate and trustworthy.
          </p>
        </div>
        <a
          href="#how-it-works"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#60A5FA] hover:text-white"
        >
          <CircleHelp className="h-4 w-4" aria-hidden="true" />
          How it works
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3"
          >
            <div
              className={cn("absolute left-0 top-0 h-full w-1", card.bar)}
              aria-hidden="true"
            />
            <p className="text-xs text-zinc-500">{card.label}</p>
            <p className={cn("mt-1 text-2xl font-semibold tabular-nums", card.valueClass)}>
              {stats[card.key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
