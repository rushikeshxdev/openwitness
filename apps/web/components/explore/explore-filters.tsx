"use client";

import { cn } from "@/lib/utils";
import type { EventRegion, ExploreStatus } from "@/types/event";
import {
  REGION_OPTIONS,
  DATE_RANGE_OPTIONS,
  type DateRangeValue,
} from "@/data/explore-events-data";
import { RotateCcw, Calendar } from "lucide-react";
import { GlassCard } from "../glass-card";

export interface ExploreFiltersState {
  region: EventRegion | "all";
  country: string;
  statuses: ExploreStatus[];
  dateRange: DateRangeValue;
  minEvidence: number;
}

export const defaultExploreFilters: ExploreFiltersState = {
  region: "all",
  country: "all",
  statuses: [],
  dateRange: "any",
  minEvidence: 0,
};

const STATUS_META: {
  id: ExploreStatus;
  label: string;
  color: string;
}[] = [
  { id: "live", label: "Live", color: "bg-red-500" },
  { id: "trending", label: "Trending", color: "bg-orange-500" },
  { id: "verified", label: "Verified", color: "bg-emerald-500" },
  { id: "under_review", label: "Under Review", color: "bg-sky-500" },
];

export interface ExploreFiltersProps {
  filters: ExploreFiltersState;
  countries: string[];
  statusCounts: Record<ExploreStatus, number>;
  onChange: (next: ExploreFiltersState) => void;
  onClear: () => void;
  className?: string;
}

const selectClass =
  "w-full rounded-lg border border-white/12 bg-black/40 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] appearance-none";

export function ExploreFilters({
  filters,
  countries,
  statusCounts,
  onChange,
  onClear,
  className,
}: ExploreFiltersProps) {
  const toggleStatus = (status: ExploreStatus) => {
    const has = filters.statuses.includes(status);
    onChange({
      ...filters,
      statuses: has
        ? filters.statuses.filter((s) => s !== status)
        : [...filters.statuses, status],
    });
  };

  return (
    <GlassCard
      className={cn(
        "p-4 sm:p-5 bg-black/45 border-white/[0.12] h-fit",
        className
      )}
    >
      <h2 className="text-base font-semibold text-white mb-4">Filters</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Region
          </label>
          <select
            className={selectClass}
            value={filters.region}
            onChange={(e) =>
              onChange({
                ...filters,
                region: e.target.value as EventRegion | "all",
                country: "all",
              })
            }
          >
            {REGION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#121214]">
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Country
          </label>
          <select
            className={selectClass}
            value={filters.country}
            onChange={(e) =>
              onChange({ ...filters, country: e.target.value })
            }
          >
            <option value="all" className="bg-[#121214]">
              All Countries
            </option>
            {countries.map((c) => (
              <option key={c} value={c} className="bg-[#121214]">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-400 mb-2">Status</p>
          <ul className="space-y-2">
            {STATUS_META.map(({ id, label, color }) => {
              const checked = filters.statuses.includes(id);
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => toggleStatus(id)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors",
                      checked
                        ? "bg-white/10 text-white"
                        : "text-zinc-300 hover:bg-white/5"
                    )}
                    aria-pressed={checked}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <span
                        className={cn("w-2 h-2 rounded-full", color)}
                        aria-hidden="true"
                      />
                      {label}
                    </span>
                    <span className="text-zinc-500 tabular-nums text-xs">
                      {statusCounts[id]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Date Range
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none"
              aria-hidden="true"
            />
            <select
              className={cn(selectClass, "pl-9")}
              value={filters.dateRange}
              onChange={(e) =>
                onChange({
                  ...filters,
                  dateRange: e.target.value as DateRangeValue,
                })
              }
            >
              {DATE_RANGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#121214]">
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="evidence-slider"
              className="text-xs font-medium text-zinc-400"
            >
              Evidence Count
            </label>
            <span className="text-xs text-zinc-500 tabular-nums">
              {filters.minEvidence}+ files
            </span>
          </div>
          <input
            id="evidence-slider"
            type="range"
            min={0}
            max={1000}
            step={50}
            value={filters.minEvidence}
            onChange={(e) =>
              onChange({
                ...filters,
                minEvidence: Number(e.target.value),
              })
            }
            className="w-full accent-[#3B82F6]"
          />
          <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
            <span>0+</span>
            <span>1000+</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Clear Filters
        </button>
      </div>
    </GlassCard>
  );
}
