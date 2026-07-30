"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  TIMELINE_CATEGORY_FILTERS,
  TIMELINE_PAGE_SIZE,
  filterTimelineEntries,
  type EventTimelinePageModel,
  type TimelineEntryCategory,
} from "@/data/event-timeline-data";
import { EventTimelineOverviewCard } from "./event-timeline-overview-card";
import { EventTimelineCalendar } from "./event-timeline-calendar";
import { EventTimelineFeed } from "./event-timeline-feed";
import { EventTimelineSidebar } from "./event-timeline-sidebar";
import {
  ChevronRight,
  Download,
  Filter,
  Share2,
  X,
} from "lucide-react";

export interface EventDetailTimelineViewProps {
  model: EventTimelinePageModel;
}

export function EventDetailTimelineView({ model }: EventDetailTimelineViewProps) {
  const [category, setCategory] = useState<TimelineEntryCategory | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(TIMELINE_PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterTimelineEntries(model.entries, category, selectedDate),
    [model.entries, category, selectedDate]
  );

  useEffect(() => {
    setVisibleCount(TIMELINE_PAGE_SIZE);
  }, [category, selectedDate]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const onSelectDate = useCallback((dateKey: string | null) => {
    setSelectedDate(dateKey);
    if (dateKey) {
      window.requestAnimationFrame(() => {
        document
          .getElementById(`timeline-date-${dateKey}`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: `${model.overview.title} Timeline`, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        showToast("Link copied to clipboard");
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-zinc-400 sm:text-sm"
      >
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
        <Link href="/events" className="hover:text-white transition-colors">
          Explore Events
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
        <Link
          href={`/events/${model.overview.id}`}
          className="truncate max-w-[10rem] hover:text-white transition-colors sm:max-w-xs"
        >
          {model.overview.title}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
        <span className="text-zinc-200">Timeline</span>
      </nav>

      <header className="mb-6 sm:mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Timeline
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
          Complete chronological timeline of the event with verified evidence and
          updates.
        </p>

        <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
            role="tablist"
            aria-label="Timeline categories"
          >
            {TIMELINE_CATEGORY_FILTERS.map((f) => {
              const active = category === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(f.id)}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                    active
                      ? "bg-[#3B82F6] text-white"
                      : "border border-white/12 bg-white/[0.03] text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-transparent px-3.5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 lg:hidden"
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              Filters
            </button>
            <button
              type="button"
              onClick={() => showToast("Advanced filters coming soon")}
              className="hidden items-center gap-2 rounded-xl border border-white/12 bg-transparent px-3.5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 lg:inline-flex"
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              Filters
            </button>
            <button
              type="button"
              onClick={() => showToast("Timeline export coming soon")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-transparent px-3.5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export Timeline
            </button>
            <button
              type="button"
              onClick={() => void share()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-transparent px-3.5 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_280px]">
        {/* Left */}
        <div className="hidden space-y-4 lg:block">
          <EventTimelineOverviewCard overview={model.overview} />
          <EventTimelineCalendar
            year={model.calendarYear}
            month={model.calendarMonth}
            activeDates={model.activeDates}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
          />
        </div>

        {/* Center */}
        <div className="min-w-0">
          <EventTimelineFeed
            entries={visible}
            hasMore={hasMore}
            onLoadMore={() =>
              setVisibleCount((n) => n + TIMELINE_PAGE_SIZE)
            }
          />
        </div>

        {/* Right */}
        <EventTimelineSidebar
          stats={model.stats}
          contributors={model.contributors}
          topSources={model.topSources}
        />
      </div>

      {/* Mobile filters drawer: overview + calendar */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          filtersOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!filtersOpen}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity",
            filtersOpen ? "opacity-100" : "opacity-0"
          )}
          aria-label="Close filters"
          onClick={() => setFiltersOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col gap-3 overflow-y-auto bg-[#0B0E11] p-3 shadow-2xl transition-transform duration-300",
            filtersOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-semibold text-white">Event context</span>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <EventTimelineOverviewCard overview={model.overview} />
          <EventTimelineCalendar
            year={model.calendarYear}
            month={model.calendarMonth}
            activeDates={model.activeDates}
            selectedDate={selectedDate}
            onSelectDate={(d) => {
              onSelectDate(d);
              setFiltersOpen(false);
            }}
          />
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-white/12 bg-[#121214] px-4 py-2.5 text-sm text-zinc-200 shadow-xl"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
