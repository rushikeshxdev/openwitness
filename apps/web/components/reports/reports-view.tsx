"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/app-shell/app-shell";
import { GlassCard } from "@/components/glass-card";
import { getMockSession } from "@/lib/auth-session";
import {
  filterReports,
  reportsData,
  type ReportsTab,
} from "@/data/reports-data";
import { FileText, Users } from "lucide-react";

const TABS: Array<{ id: ReportsTab; label: string }> = [
  { id: "all", label: "All Reports" },
  { id: "community", label: "Community Reports" },
  { id: "official", label: "Official Statements" },
  { id: "mine", label: "My Reports" },
];

export function ReportsView() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as ReportsTab | null) ?? "all";
  const [tab, setTab] = useState<ReportsTab>(
    TABS.some((t) => t.id === initialTab) ? initialTab : "all"
  );
  const [sessionName, setSessionName] = useState<string | null>(null);

  useEffect(() => {
    const s = getMockSession();
    setSessionName(s?.name ?? null);
  }, []);

  useEffect(() => {
    const t = searchParams.get("tab") as ReportsTab | null;
    if (t && TABS.some((x) => x.id === t)) setTab(t);
  }, [searchParams]);

  const filtered = useMemo(
    () => filterReports(reportsData, tab, sessionName),
    [tab, sessionName]
  );

  return (
    <AppShell breadcrumb={[{ label: "Home", href: "/" }, { label: "Reports" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Reports
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Community reports and official statements linked to documented
            events.
          </p>
        </div>

        <div
          className="flex gap-0.5 overflow-x-auto border-b border-white/10 scrollbar-hide"
          role="tablist"
          aria-label="Report categories"
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative shrink-0 px-3.5 sm:px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                  active ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                {t.label}
                {active ? (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#3B82F6]" />
                ) : null}
              </button>
            );
          })}
        </div>

        {filtered.length > 0 ? (
          <ul className="space-y-3">
            {filtered.map((report) => (
              <li key={report.id}>
                <GlassCard className="p-4 sm:p-5 bg-[#121214]/90 border-white/[0.12]">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h2 className="text-base font-semibold text-white">
                          {report.title}
                        </h2>
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
                    {report.eventId ? (
                      <Link
                        href={`/events/${report.eventId}`}
                        className="shrink-0 text-sm font-medium text-[#60A5FA] hover:text-white"
                      >
                        View event
                      </Link>
                    ) : null}
                  </div>
                </GlassCard>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-black/35 px-6 py-16 text-center">
            <p className="text-lg font-medium text-white">No reports here yet</p>
            <p className="mt-2 text-sm text-zinc-400">
              {tab === "mine"
                ? "Submit an incident report to see it listed here."
                : "Try another tab."}
            </p>
            {tab === "mine" ? (
              <Link
                href="/report"
                className="mt-5 inline-flex text-sm font-medium text-[#60A5FA] hover:text-white"
              >
                Report Incident
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </AppShell>
  );
}
