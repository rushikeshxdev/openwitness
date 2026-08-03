"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MapFilters } from "./map-filters";
import { MapStatsCard } from "./map-stats-card";
import { MapIncidentPanel } from "./map-incident-panel";
import { MapActivityStrip } from "./map-activity-strip";

const MapCanvas = dynamic(
  () => import("./map-canvas").then((m) => m.MapCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-full min-h-[320px] w-full items-center justify-center bg-[#0B0E11] text-sm text-zinc-500"
        aria-hidden
      >
        Loading map…
      </div>
    ),
  }
);
import {
  defaultMapFilters,
  eventsToGeoJSON,
  filterMapEvents,
  getCategoryCounts,
  getEventCoordinates,
  getMapEvents,
  getRegionCounts,
  type MapFiltersState,
} from "@/data/map-workspace-data";
import { getStatusCounts } from "@/data/explore-events-data";
import { cn } from "@/lib/utils";
import { Filter, PanelRight, X } from "lucide-react";

export function MapWorkspaceView() {
  const allEvents = useMemo(() => getMapEvents(), []);
  const [filters, setFilters] = useState<MapFiltersState>(defaultMapFilters);
  const [selectedEventId, setSelectedEventId] = useState<string | null>("1");
  const [flyTo, setFlyTo] = useState<{
    longitude: number;
    latitude: number;
    zoom?: number;
  } | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const categoryCounts = useMemo(
    () => getCategoryCounts(allEvents),
    [allEvents]
  );
  const regionCounts = useMemo(() => getRegionCounts(allEvents), [allEvents]);
  const statusCounts = useMemo(() => getStatusCounts(allEvents), [allEvents]);

  const filtered = useMemo(
    () => filterMapEvents(allEvents, filters),
    [allEvents, filters]
  );

  const geojson = useMemo(() => eventsToGeoJSON(filtered), [filtered]);

  const recentEvents = useMemo(() => {
    return [...filtered]
      .sort(
        (a, b) =>
          (b.startedAt ?? b.timestamp).getTime() -
          (a.startedAt ?? a.timestamp).getTime()
      )
      .slice(0, 12);
  }, [filtered]);

  const selectEvent = useCallback((eventId: string) => {
    setSelectedEventId(eventId);
    setPanelOpen(true);
    const coords = getEventCoordinates(eventId);
    if (coords) {
      setFlyTo({
        longitude: coords.longitude,
        latitude: coords.latitude,
        zoom: 7,
      });
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEventId(null);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultMapFilters);
  }, []);

  const effectiveSelected = useMemo(() => {
    if (!selectedEventId) return null;
    return filtered.some((e) => e.id === selectedEventId)
      ? selectedEventId
      : null;
  }, [selectedEventId, filtered]);

  return (
    <div className="relative flex h-dvh min-h-[640px] flex-col gap-2.5 px-2 pb-2.5 pt-[4.75rem] sm:gap-3 sm:px-3 sm:pb-3 sm:pt-20 md:px-4 lg:gap-3.5 lg:px-4 xl:px-5">
      {/* Mobile toolbar */}
      <div className="flex shrink-0 gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/12 bg-[#121214]/90 px-3 py-2.5 text-sm text-zinc-200"
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          Filters
        </button>
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/12 bg-[#121214]/90 px-3 py-2.5 text-sm text-zinc-200"
        >
          <PanelRight className="h-4 w-4" aria-hidden="true" />
          Details
        </button>
      </div>

      <div
        className={cn(
          "grid min-h-0 flex-1 grid-cols-1 gap-2.5 sm:gap-3 lg:gap-3.5",
          "lg:grid-cols-[minmax(280px,300px)_minmax(0,1fr)_minmax(340px,380px)]",
          "xl:grid-cols-[minmax(300px,340px)_minmax(0,1fr)_minmax(380px,420px)]",
          "2xl:grid-cols-[340px_minmax(0,1fr)_440px]"
        )}
      >
        {/* Left filters — desktop */}
        <div className="hidden min-h-0 flex-col gap-3 lg:flex">
          <MapFilters
            filters={filters}
            categoryCounts={categoryCounts}
            regionCounts={regionCounts}
            statusCounts={statusCounts}
            onChange={setFilters}
            onClear={clearFilters}
            className="min-h-0 flex-1"
          />
          <MapStatsCard className="shrink-0" />
        </div>

        {/* Center map + activity — map dominates vertical space */}
        <div className="flex min-h-0 min-w-0 flex-col gap-2.5 sm:gap-3">
          <div className="relative min-h-[360px] flex-[1.65] overflow-hidden rounded-2xl border border-white/12 sm:min-h-[420px] lg:min-h-[320px]">
            <MapCanvas
              geojson={geojson}
              selectedEventId={effectiveSelected}
              flyTo={flyTo}
              onSelect={selectEvent}
            />
          </div>
          <MapActivityStrip
            events={recentEvents}
            selectedEventId={effectiveSelected}
            onSelect={selectEvent}
            className="shrink-0"
          />
        </div>

        {/* Right panel — desktop */}
        <div className="hidden min-h-0 lg:block">
          <MapIncidentPanel
            eventId={effectiveSelected}
            onClose={clearSelection}
            className="h-full"
          />
        </div>
      </div>

      {/* Filters drawer (mobile) */}
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
            "absolute inset-y-0 left-0 flex w-[min(100%,360px)] flex-col gap-3 bg-[#0B0E11] p-3 shadow-2xl transition-transform duration-300",
            filtersOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-semibold text-white">Filters</span>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="rounded-lg p-2.5 text-zinc-400 hover:bg-white/5 hover:text-white"
              aria-label="Close filters drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <MapFilters
            filters={filters}
            categoryCounts={categoryCounts}
            regionCounts={regionCounts}
            statusCounts={statusCounts}
            onChange={setFilters}
            onClear={clearFilters}
            className="min-h-0 flex-1"
          />
          <MapStatsCard />
        </div>
      </div>

      {/* Panel drawer (mobile) */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          panelOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!panelOpen}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity",
            panelOpen ? "opacity-100" : "opacity-0"
          )}
          aria-label="Close details"
          onClick={() => setPanelOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-[min(100%,420px)] bg-[#0B0E11] p-3 shadow-2xl transition-transform duration-300",
            panelOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <MapIncidentPanel
            eventId={effectiveSelected}
            onClose={() => {
              clearSelection();
              setPanelOpen(false);
            }}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
