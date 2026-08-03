"use client";

import {
  formatOrgStat,
  type OrgImpactStat,
} from "@/data/organization-detail-data";
import { ChevronDown } from "lucide-react";

export function OrgImpactGlance({
  stats,
  period,
}: {
  stats: OrgImpactStat[];
  period: string;
}) {
  return (
    <section
      className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5"
      aria-labelledby="org-impact-heading"
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id="org-impact-heading"
          className="text-base font-semibold text-white sm:text-lg"
        >
          Impact at a Glance
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-xs font-medium text-zinc-300"
        >
          {period}
          <ChevronDown className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="rounded-xl border border-white/10 bg-black/30 px-3.5 py-3.5"
          >
            <div className="text-xl font-bold tabular-nums leading-none text-white">
              {formatOrgStat(stat.value)}
            </div>
            <div className="mt-1.5 text-[11px] text-zinc-400 sm:text-xs">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
