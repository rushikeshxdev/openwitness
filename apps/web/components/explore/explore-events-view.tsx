"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ExploreHero, type CategoryFilter } from "./explore-hero";
import {
  ExploreFilters,
  defaultExploreFilters,
  type ExploreFiltersState,
} from "./explore-filters";
import {
  ExploreFeed,
  ExploreFeedHeader,
  type SortOption,
  type ViewMode,
} from "./explore-feed";
import {
  LiveEventMapWidget,
  TrendingNowWidget,
  PopularTagsWidget,
} from "./explore-widgets";
import {
  exploreEventsData,
  EXPLORE_PAGE_SIZE,
  exploreMapStats,
  getStatusCounts,
  getTrendingEvents,
  getPopularTags,
  getCountriesForRegion,
  type DateRangeValue,
} from "@/data/explore-events-data";
import { LANDING_REFERENCE_TIME } from "@/data/events-data";
import type { Event } from "@/types/event";
import { SlidersHorizontal, X } from "lucide-react";

function matchesDateRange(event: Event, range: DateRangeValue): boolean {
  if (range === "any") return true;
  const started = event.startedAt ?? event.timestamp;
  const ageMs = LANDING_REFERENCE_TIME.getTime() - started.getTime();
  if (range === "24h") return ageMs <= 24 * 60 * 60 * 1000;
  if (range === "7d") return ageMs <= 7 * 24 * 60 * 60 * 1000;
  if (range === "30d") return ageMs <= 30 * 24 * 60 * 60 * 1000;
  return true;
}

function filterEvents(
  events: Event[],
  category: CategoryFilter,
  filters: ExploreFiltersState,
  tag: string | null,
  query: string
): Event[] {
  const q = query.trim().toLowerCase();
  return events.filter((e) => {
    if (category !== "all" && e.category !== category) return false;
    if (filters.region !== "all" && e.region !== filters.region) return false;
    if (filters.country !== "all" && e.location.country !== filters.country)
      return false;
    if (
      filters.statuses.length > 0 &&
      (!e.status || !filters.statuses.includes(e.status))
    )
      return false;
    if (e.evidenceCount < filters.minEvidence) return false;
    if (!matchesDateRange(e, filters.dateRange)) return false;
    if (tag && !(e.tags ?? []).includes(tag)) return false;
    if (q) {
      const hay = [
        e.title,
        e.description ?? "",
        e.location.city,
        e.location.country,
        ...(e.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function sortEvents(events: Event[], sort: SortOption): Event[] {
  const copy = [...events];
  if (sort === "latest") {
    copy.sort(
      (a, b) =>
        (b.startedAt ?? b.timestamp).getTime() -
        (a.startedAt ?? a.timestamp).getTime()
    );
  } else if (sort === "evidence") {
    copy.sort((a, b) => b.evidenceCount - a.evidenceCount);
  } else {
    copy.sort(
      (a, b) => (b.contributorCount ?? 0) - (a.contributorCount ?? 0)
    );
  }
  return copy;
}

export function ExploreEventsView() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [filters, setFilters] = useState<ExploreFiltersState>(
    defaultExploreFilters
  );
  const [sort, setSort] = useState<SortOption>("latest");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [visibleCount, setVisibleCount] = useState(EXPLORE_PAGE_SIZE);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
  }, [searchParams]);

  const statusCounts = useMemo(
    () => getStatusCounts(exploreEventsData),
    []
  );
  const trending = useMemo(() => getTrendingEvents(exploreEventsData, 3), []);
  const popularTags = useMemo(() => getPopularTags(exploreEventsData), []);
  const countries = useMemo(
    () => getCountriesForRegion(filters.region),
    [filters.region]
  );

  const filtered = useMemo(
    () =>
      sortEvents(
        filterEvents(exploreEventsData, category, filters, activeTag, query),
        sort
      ),
    [category, filters, activeTag, sort, query]
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = useCallback((value: CategoryFilter) => {
    setCategory(value);
    setVisibleCount(EXPLORE_PAGE_SIZE);
  }, []);

  const handleFiltersChange = useCallback((next: ExploreFiltersState) => {
    setFilters(next);
    setVisibleCount(EXPLORE_PAGE_SIZE);
  }, []);

  const handleClear = useCallback(() => {
    setFilters(defaultExploreFilters);
    setActiveTag(null);
    setVisibleCount(EXPLORE_PAGE_SIZE);
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    if (!tag) {
      setActiveTag(null);
    } else {
      setActiveTag((prev) => (prev === tag ? null : tag));
    }
    setVisibleCount(EXPLORE_PAGE_SIZE);
  }, []);

  const filtersPanel = (
    <ExploreFilters
      filters={filters}
      countries={countries}
      statusCounts={statusCounts}
      onChange={handleFiltersChange}
      onClear={handleClear}
    />
  );

  return (
    <>
      <ExploreHero
        category={category}
        onCategoryChange={handleCategoryChange}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 -mt-2">
        {/* Mobile filters toggle */}
        <div className="lg:hidden mb-4">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm font-medium text-zinc-200"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-start">
          {/* Left filters — desktop */}
          <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24">
            {filtersPanel}
          </aside>

          {/* Center feed */}
          <div className="lg:col-span-6 min-w-0">
            <ExploreFeedHeader
              total={filtered.length}
              sort={sort}
              viewMode={viewMode}
              onSortChange={(s) => {
                setSort(s);
                setVisibleCount(EXPLORE_PAGE_SIZE);
              }}
              onViewModeChange={setViewMode}
            />
            <ExploreFeed
              events={visible}
              total={filtered.length}
              viewMode={viewMode}
              hasMore={hasMore}
              onLoadMore={() =>
                setVisibleCount((n) => n + EXPLORE_PAGE_SIZE)
              }
            />
          </div>

          {/* Right widgets */}
          <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-24">
            <LiveEventMapWidget
              events={filtered}
              activeEvents={exploreMapStats.activeEvents}
              cities={exploreMapStats.cities}
              countries={exploreMapStats.countries}
            />
            <TrendingNowWidget events={trending} />
            <PopularTagsWidget
              tags={popularTags}
              activeTag={activeTag}
              onTagClick={handleTagClick}
            />
          </aside>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(100%,320px)] overflow-y-auto bg-[#0B0E11] border-r border-white/10 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filtersPanel}
          </div>
        </div>
      )}
    </>
  );
}
