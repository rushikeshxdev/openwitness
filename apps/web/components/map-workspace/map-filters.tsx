"use client";

import { cn } from "@/lib/utils";
import type { EventCategory, EventRegion, ExploreStatus } from "@/types/event";
import {
  EVENT_TYPE_OPTIONS,
  DATE_RANGE_OPTIONS,
  MAP_STATUS_OPTIONS,
  REGION_OPTIONS,
  type MapFiltersState,
} from "@/data/map-workspace-data";
import { Calendar, MapPin, RotateCcw, Search } from "lucide-react";

export interface MapFiltersProps {
  filters: MapFiltersState;
  categoryCounts: Record<EventCategory | "all", number>;
  regionCounts: Record<EventRegion, number>;
  statusCounts: Record<ExploreStatus, number>;
  onChange: (next: MapFiltersState) => void;
  onClear: () => void;
  className?: string;
}

const selectClass =
  "w-full rounded-lg border border-white/12 bg-black/40 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] appearance-none";

export function MapFilters({
  filters,
  categoryCounts,
  regionCounts,
  statusCounts,
  onChange,
  onClear,
  className,
}: MapFiltersProps) {
  const allTypesChecked = filters.categories.length === 0;

  const toggleCategory = (id: EventCategory | "all") => {
    if (id === "all") {
      onChange({ ...filters, categories: [] });
      return;
    }
    const set = new Set(filters.categories);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onChange({ ...filters, categories: [...set] });
  };

  const toggleStatus = (status: ExploreStatus) => {
    const set = new Set(filters.statuses);
    if (set.has(status)) set.delete(status);
    else set.add(status);
    onChange({ ...filters, statuses: [...set] });
  };

  const topRegions = REGION_OPTIONS.filter((r) => r.value !== "all").map(
    (r) => ({
      value: r.value as EventRegion,
      label: r.label,
      count: regionCounts[r.value as EventRegion] ?? 0,
    })
  );

  return (
    <aside
      className={cn(
        "flex h-full flex-col gap-5 overflow-y-auto rounded-2xl border border-white/12 bg-[#121214]/90 p-4 backdrop-blur-md",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-white">
          Filters
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          Reset
        </button>
      </div>

      <section>
        <h3 className="mb-2.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Event Type
        </h3>
        <ul className="space-y-1.5">
          {EVENT_TYPE_OPTIONS.map((opt) => {
            const checked =
              opt.id === "all" ? allTypesChecked : filters.categories.includes(opt.id);
            const count = categoryCounts[opt.id] ?? 0;
            return (
              <li key={opt.id}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-white/[0.04]">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCategory(opt.id)}
                    className="h-3.5 w-3.5 rounded border-white/20 bg-black/40 text-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                  <span className="flex-1 truncate">{opt.label}</span>
                  <span className="tabular-nums text-xs text-zinc-500">
                    {count}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h3 className="mb-2.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Date Range
        </h3>
        <div className="relative">
          <Calendar
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          />
          <select
            value={filters.dateRange}
            onChange={(e) =>
              onChange({
                ...filters,
                dateRange: e.target.value as MapFiltersState["dateRange"],
              })
            }
            className={cn(selectClass, "pl-9")}
            aria-label="Date range"
          >
            {DATE_RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section>
        <h3 className="mb-2.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Location
        </h3>
        <div className="relative mb-2.5">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={filters.locationQuery}
            onChange={(e) =>
              onChange({ ...filters, locationQuery: e.target.value })
            }
            placeholder="Search locations..."
            className="w-full rounded-lg border border-white/12 bg-black/40 py-2.5 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
        </div>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => onChange({ ...filters, region: "all" })}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                filters.region === "all"
                  ? "bg-white/[0.06] text-white"
                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
              )}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="flex-1">All regions</span>
            </button>
          </li>
          {topRegions.map((r) => (
            <li key={r.value}>
              <button
                type="button"
                onClick={() => onChange({ ...filters, region: r.value })}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                  filters.region === r.value
                    ? "bg-white/[0.06] text-white"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                )}
              >
                <span className="flex-1 truncate">{r.label}</span>
                <span className="tabular-nums text-xs text-zinc-500">
                  {r.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Status
        </h3>
        <ul className="space-y-1.5">
          {MAP_STATUS_OPTIONS.map((opt) => {
            const checked = filters.statuses.includes(opt.id);
            return (
              <li key={opt.id}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-white/[0.04]">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleStatus(opt.id)}
                    className="h-3.5 w-3.5 rounded border-white/20 bg-black/40 text-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: opt.dot }}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{opt.label}</span>
                  <span className="tabular-nums text-xs text-zinc-500">
                    {statusCounts[opt.id] ?? 0}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
