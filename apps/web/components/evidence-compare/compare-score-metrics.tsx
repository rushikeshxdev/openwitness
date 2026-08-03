"use client";

import type { CompareScores } from "@/data/compare-evidence-data";

export function CompareScoreRing({ scores }: { scores: CompareScores }) {
  const pct = Math.min(100, Math.max(0, scores.overall));
  const r = 48;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="flex flex-col items-center rounded-2xl border border-white/12 bg-[#121214]/90 px-5 py-6 sm:min-w-[180px]">
      <p className="text-sm font-medium text-zinc-400">Overall Comparison Score</p>
      <div className="relative mt-3 h-[128px] w-[128px]">
        <svg
          viewBox="0 0 120 120"
          className="h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums text-white">
            {scores.overall}%
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm font-semibold text-emerald-400">
        {scores.overallLabel}
      </p>
    </div>
  );
}

export function CompareMetricCards({ scores }: { scores: CompareScores }) {
  return (
    <div className="grid flex-1 grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
      {scores.metrics.map((m) => (
        <div
          key={m.key}
          className="rounded-2xl border border-white/12 bg-[#121214]/90 p-3.5"
        >
          <p className="text-xl font-bold tabular-nums text-white">{m.percent}%</p>
          <p className="mt-1 text-xs font-medium text-zinc-300">{m.label}</p>
          <p className="mt-0.5 text-[11px] text-zinc-500">{m.qualitative}</p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-[#3B82F6]"
              style={{ width: `${m.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
