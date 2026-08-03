"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/app-shell/app-shell";
import { EvidenceExplorerCard } from "./evidence-explorer-card";
import {
  defaultEvidenceFilters,
  evidenceExplorerData,
  evidenceExplorerStats,
  filterEvidenceItems,
  getEvidenceEventOptions,
  getEvidenceTagOptions,
  type EvidenceExplorerFilters,
  type EvidenceMediaType,
  type EvidenceSort,
  type EvidenceTimeRange,
} from "@/data/evidence-explorer-data";
import {
  compareHref,
  MAX_COMPARE_SLOTS,
  MIN_COMPARE_SLOTS,
  type CompareIdPair,
} from "@/data/compare-evidence-data";
import { GitCompareArrows, Plus, SlidersHorizontal, X } from "lucide-react";

const MEDIA_OPTIONS: Array<{ id: EvidenceMediaType | "all"; label: string }> = [
  { id: "all", label: "All media" },
  { id: "video", label: "Video" },
  { id: "image", label: "Image" },
  { id: "audio", label: "Audio" },
  { id: "document", label: "Document" },
];

const TIME_OPTIONS: Array<{ id: EvidenceTimeRange; label: string }> = [
  { id: "any", label: "Any time" },
  { id: "24h", label: "Last 24h" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
];

const SORT_OPTIONS: Array<{ id: EvidenceSort; label: string }> = [
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "verified", label: "Verified first" },
];

const selectClass =
  "rounded-xl border border-white/12 bg-[#0B0E11] px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-[#3B82F6]/50";

export function EvidenceExplorerView() {
  const [filters, setFilters] =
    useState<EvidenceExplorerFilters>(defaultEvidenceFilters);
  const [moreOpen, setMoreOpen] = useState(false);
  const [selected, setSelected] = useState<CompareIdPair[]>([]);
  const eventOptions = useMemo(() => getEvidenceEventOptions(), []);
  const tagOptions = useMemo(() => getEvidenceTagOptions(), []);

  const filtered = useMemo(
    () => filterEvidenceItems(evidenceExplorerData, filters),
    [filters]
  );

  const selectedKeys = useMemo(
    () => new Set(selected.map((p) => `${p.eventId}:${p.evidenceId}`)),
    [selected]
  );

  const toggleSelect = (pair: CompareIdPair) => {
    const key = `${pair.eventId}:${pair.evidenceId}`;
    setSelected((prev) => {
      if (prev.some((p) => `${p.eventId}:${p.evidenceId}` === key)) {
        return prev.filter((p) => `${p.eventId}:${p.evidenceId}` !== key);
      }
      if (prev.length >= MAX_COMPARE_SLOTS) return prev;
      return [...prev, pair];
    });
  };

  const canCompareSelected = selected.length >= MIN_COMPARE_SLOTS;

  const patch = (p: Partial<EvidenceExplorerFilters>) =>
    setFilters((f) => ({ ...f, ...p }));

  const clear = () => {
    setFilters(defaultEvidenceFilters);
    setMoreOpen(false);
  };

  const hasActive =
    filters.mediaType !== "all" ||
    filters.eventId !== "all" ||
    filters.timeRange !== "any" ||
    filters.query.trim() !== "" ||
    filters.verifiedOnly ||
    filters.tag != null ||
    filters.sort !== "newest";

  const stats = [
    {
      label: "Total Evidence",
      value: evidenceExplorerStats.totalEvidence.toLocaleString(),
    },
    {
      label: "Verified",
      value: evidenceExplorerStats.verified.toLocaleString(),
    },
    {
      label: "Sources",
      value: evidenceExplorerStats.sources.toLocaleString(),
    },
    {
      label: "Events",
      value: evidenceExplorerStats.events.toLocaleString(),
    },
  ];

  return (
    <AppShell breadcrumb={[{ label: "Home", href: "/" }, { label: "Evidence" }]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Evidence Explorer
            </h1>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {stats.map((s) => (
                <div key={s.label} className="text-sm">
                  <span className="font-semibold text-white tabular-nums">
                    {s.value}
                  </span>{" "}
                  <span className="text-zinc-500">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link
              href={
                canCompareSelected ? compareHref(selected) : "/evidence/compare"
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/[0.08]"
            >
              <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
              {canCompareSelected
                ? `Compare selected (${selected.length})`
                : "Compare Evidence"}
            </Link>
            <Link
              href="/evidence/new"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB] transition-colors"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add New Evidence
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/12 bg-[#121214]/90 p-3 sm:p-4 space-y-3">
          <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center">
            <input
              type="search"
              value={filters.query}
              onChange={(e) => patch({ query: e.target.value })}
              placeholder="Search evidence..."
              className={cn(selectClass, "w-full lg:min-w-[200px] lg:flex-1")}
            />
            <select
              className={selectClass}
              value={filters.mediaType}
              onChange={(e) =>
                patch({
                  mediaType: e.target.value as EvidenceMediaType | "all",
                })
              }
              aria-label="Media types"
            >
              {MEDIA_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              className={cn(selectClass, "max-w-full lg:max-w-[220px]")}
              value={filters.eventId}
              onChange={(e) => patch({ eventId: e.target.value })}
              aria-label="Events"
            >
              <option value="all">All events</option>
              {eventOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              className={selectClass}
              value={filters.timeRange}
              onChange={(e) =>
                patch({ timeRange: e.target.value as EvidenceTimeRange })
              }
              aria-label="Time"
            >
              {TIME_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                moreOpen || filters.verifiedOnly || filters.tag
                  ? "border-[#3B82F6]/50 bg-[#3B82F6]/15 text-white"
                  : "border-white/12 text-zinc-300 hover:bg-white/5"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              More Filters
            </button>
            <select
              className={selectClass}
              value={filters.sort}
              onChange={(e) => patch({ sort: e.target.value as EvidenceSort })}
              aria-label="Sort"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            {hasActive ? (
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Clear
              </button>
            ) : null}
          </div>

          {moreOpen ? (
            <div className="flex flex-wrap items-center gap-3 border-t border-white/8 pt-3">
              <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => patch({ verifiedOnly: e.target.checked })}
                  className="rounded border-white/20 bg-black/40"
                />
                Verified only
              </label>
              <select
                className={selectClass}
                value={filters.tag ?? ""}
                onChange={(e) =>
                  patch({ tag: e.target.value ? e.target.value : null })
                }
                aria-label="Tag"
              >
                <option value="">All tags</option>
                {tagOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-zinc-500">
            Showing{" "}
            <span className="tabular-nums text-zinc-300">{filtered.length}</span>{" "}
            item{filtered.length === 1 ? "" : "s"}
            {selected.length > 0 ? (
              <>
                {" "}
                ·{" "}
                <span className="tabular-nums text-[#93C5FD]">
                  {selected.length}
                </span>{" "}
                selected for compare
              </>
            ) : (
              <span className="text-zinc-600">
                {" "}
                · select 2–{MAX_COMPARE_SLOTS} to compare
              </span>
            )}
          </p>
          {selected.length > 0 ? (
            <button
              type="button"
              onClick={() => setSelected([])}
              className="text-sm text-zinc-400 hover:text-white"
            >
              Clear selection
            </button>
          ) : null}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => {
              const key = `${item.eventId}:${item.evidenceId}`;
              return (
                <EvidenceExplorerCard
                  key={item.id}
                  item={item}
                  selectable
                  selected={selectedKeys.has(key)}
                  onToggleSelect={() =>
                    toggleSelect({
                      eventId: item.eventId,
                      evidenceId: item.evidenceId,
                    })
                  }
                />
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-black/35 px-6 py-16 text-center">
            <p className="text-lg font-medium text-white">No evidence found</p>
            <p className="mt-2 text-sm text-zinc-400">
              Try adjusting filters or clearing your search.
            </p>
            <button
              type="button"
              onClick={clear}
              className="mt-5 text-sm font-medium text-[#60A5FA] hover:text-white"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
