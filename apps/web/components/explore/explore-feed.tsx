"use client";

import { cn } from "@/lib/utils";
import type { Event } from "@/types/event";
import {
  ExploreEventListCard,
  ExploreEventGridCard,
} from "./explore-event-card";
import { LayoutGrid, List, ChevronDown } from "lucide-react";

export type SortOption = "latest" | "evidence" | "contributors";
export type ViewMode = "list" | "grid";

export interface ExploreFeedHeaderProps {
  total: number;
  sort: SortOption;
  viewMode: ViewMode;
  onSortChange: (sort: SortOption) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ExploreFeedHeader({
  total,
  sort,
  viewMode,
  onSortChange,
  onViewModeChange,
}: ExploreFeedHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <p className="text-sm sm:text-base font-medium text-white">
        <span className="tabular-nums">{total.toLocaleString()}</span> Events
        Found
      </p>
      <div className="flex items-center gap-2 sm:gap-3">
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="hidden sm:inline">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="rounded-lg border border-white/12 bg-black/40 px-2.5 py-1.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            <option value="latest" className="bg-[#121214]">
              Latest
            </option>
            <option value="evidence" className="bg-[#121214]">
              Most Evidence
            </option>
            <option value="contributors" className="bg-[#121214]">
              Contributors
            </option>
          </select>
        </label>
        <div
          className="inline-flex rounded-lg border border-white/12 bg-black/40 p-0.5"
          role="group"
          aria-label="View mode"
        >
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "list"
                ? "bg-[#3B82F6] text-white"
                : "text-zinc-400 hover:text-white"
            )}
            aria-pressed={viewMode === "list"}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "grid"
                ? "bg-[#3B82F6] text-white"
                : "text-zinc-400 hover:text-white"
            )}
            aria-pressed={viewMode === "grid"}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export interface ExploreFeedProps {
  events: Event[];
  total: number;
  viewMode: ViewMode;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function ExploreFeed({
  events,
  total,
  viewMode,
  hasMore,
  onLoadMore,
}: ExploreFeedProps) {
  if (total === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/30 px-6 py-16 text-center">
        <p className="text-zinc-300 font-medium">No events match your filters</p>
        <p className="text-sm text-zinc-500 mt-1">
          Try clearing filters or choosing another category.
        </p>
      </div>
    );
  }

  return (
    <div>
      {viewMode === "list" ? (
        <div className="space-y-3">
          {events.map((event) => (
            <ExploreEventListCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {events.map((event) => (
            <ExploreEventGridCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-6 py-3 text-sm font-medium text-zinc-200 hover:bg-white/10 hover:text-white transition-colors"
          >
            Load More Events
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
