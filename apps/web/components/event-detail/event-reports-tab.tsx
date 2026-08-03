"use client";

import { useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/glass-card";
import { getReportsForEvent } from "@/data/reports-data";
import type { EventDetailViewModel } from "@/data/event-detail-data";
import { ExternalLink, FileText, Users } from "lucide-react";

export function EventReportsTab({
  detail,
}: {
  detail: EventDetailViewModel;
}) {
  const reports = useMemo(
    () => getReportsForEvent(detail.id, detail.title),
    [detail.id, detail.title]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Reports</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Community and official reports linked to {detail.title}
          </p>
        </div>
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 px-3.5 py-2.5 text-sm font-medium text-zinc-200 hover:bg-white/5"
        >
          All reports
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <ul className="space-y-3">
        {reports.map((report) => (
          <li key={report.id}>
            <GlassCard className="p-4 sm:p-5 bg-[#121214]/90 border-white/[0.12]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-base font-semibold text-white">
                      {report.title}
                    </h3>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                        report.status === "published"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-300"
                      )}
                    >
                      {report.status === "published"
                        ? "Published"
                        : "Under Review"}
                    </span>
                    <span className="rounded-md border border-white/10 px-2 py-0.5 text-[11px] text-zinc-400 capitalize">
                      {report.kind === "mine" ? "My report" : report.kind}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {report.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                    <span>{report.author}</span>
                    <span>{report.dateLabel}</span>
                    <span className="inline-flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      {report.evidenceCount} evidence
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" aria-hidden="true" />
                      {report.contributorCount} contributors
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </li>
        ))}
      </ul>
    </div>
  );
}
