/**
 * Map workspace data: GeoJSON + filter helpers derived from explore events
 */

import type {
  Event,
  EventCategory,
  EventRegion,
  ExploreStatus,
} from "@/types/event";
import {
  exploreEventsData,
  exploreMapStats,
  DATE_RANGE_OPTIONS,
  REGION_OPTIONS,
  type DateRangeValue,
} from "./explore-events-data";
import { CATEGORY_LABEL } from "./event-detail-data";
import { LANDING_REFERENCE_TIME } from "./events-data";

export { DATE_RANGE_OPTIONS, REGION_OPTIONS, CATEGORY_LABEL };
export type { DateRangeValue };

export const DEFAULT_MAP_STYLE =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL ??
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export const MAP_STATS = {
  totalActive: exploreMapStats.activeEvents,
  weekDelta: 18,
  sparkline: [42, 48, 45, 62, 58, 71, 68, 82, 79, 91, 88, 104],
} as const;

export const EVENT_TYPE_OPTIONS: {
  id: EventCategory | "all";
  label: string;
}[] = [
  { id: "all", label: "All Types" },
  { id: "protest", label: "Protests" },
  { id: "disaster", label: "Natural Disasters" },
  { id: "accident", label: "Accidents" },
  { id: "gathering", label: "Humanitarian" },
  { id: "other", label: "Other" },
];

export const MAP_STATUS_OPTIONS: {
  id: ExploreStatus;
  label: string;
  color: string;
  dot: string;
}[] = [
  { id: "live", label: "Live", color: "text-emerald-400", dot: "#22C55E" },
  { id: "trending", label: "Trending", color: "text-orange-400", dot: "#F97316" },
  { id: "verified", label: "Verified", color: "text-sky-400", dot: "#3B82F6" },
];

export interface MapFiltersState {
  categories: EventCategory[];
  dateRange: DateRangeValue;
  locationQuery: string;
  region: EventRegion | "all";
  statuses: ExploreStatus[];
}

export const defaultMapFilters: MapFiltersState = {
  categories: [],
  dateRange: "any",
  locationQuery: "",
  region: "all",
  statuses: [],
};

export type MapEventFeatureProperties = {
  id: string;
  title: string;
  status: ExploreStatus;
  category: EventCategory;
  city: string;
  country: string;
  evidenceCount: number;
};

export type MapEventFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: MapEventFeatureProperties;
};

export type MapEventFeatureCollection = {
  type: "FeatureCollection";
  features: MapEventFeature[];
};

function withCoordinates(event: Event): Event | null {
  const coords = event.location.coordinates;
  if (!coords) return null;
  return event;
}

export function eventsToGeoJSON(
  events: Event[] = exploreEventsData
): MapEventFeatureCollection {
  const features: MapEventFeature[] = [];
  for (const event of events) {
    const ok = withCoordinates(event);
    if (!ok?.location.coordinates) continue;
    const { latitude, longitude } = ok.location.coordinates;
    features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      properties: {
        id: event.id,
        title: event.title,
        status: event.status ?? "under_review",
        category: event.category ?? "other",
        city: event.location.city,
        country: event.location.country,
        evidenceCount: event.evidenceCount,
      },
    });
  }
  return { type: "FeatureCollection", features };
}

export function getCategoryCounts(events: Event[] = exploreEventsData) {
  const counts: Record<EventCategory | "all", number> = {
    all: events.length,
    protest: 0,
    disaster: 0,
    accident: 0,
    gathering: 0,
    other: 0,
  };
  for (const e of events) {
    const cat = e.category ?? "other";
    counts[cat] += 1;
  }
  return counts;
}

export function getRegionCounts(events: Event[] = exploreEventsData) {
  const counts: Record<EventRegion, number> = {
    asia: 0,
    europe: 0,
    americas: 0,
    africa: 0,
    oceania: 0,
  };
  for (const e of events) {
    if (e.region) counts[e.region] += 1;
  }
  return counts;
}

function matchesDateRange(event: Event, range: DateRangeValue): boolean {
  if (range === "any") return true;
  const started = event.startedAt ?? event.timestamp;
  const ageMs = LANDING_REFERENCE_TIME.getTime() - started.getTime();
  if (range === "24h") return ageMs <= 24 * 60 * 60 * 1000;
  if (range === "7d") return ageMs <= 7 * 24 * 60 * 60 * 1000;
  if (range === "30d") return ageMs <= 30 * 24 * 60 * 60 * 1000;
  return true;
}

export function filterMapEvents(
  events: Event[],
  filters: MapFiltersState
): Event[] {
  const q = filters.locationQuery.trim().toLowerCase();
  return events.filter((e) => {
    if (
      filters.categories.length > 0 &&
      (!e.category || !filters.categories.includes(e.category))
    ) {
      return false;
    }
    if (filters.region !== "all" && e.region !== filters.region) return false;
    if (
      filters.statuses.length > 0 &&
      (!e.status || !filters.statuses.includes(e.status))
    ) {
      return false;
    }
    if (!matchesDateRange(e, filters.dateRange)) return false;
    if (q) {
      const hay = [
        e.location.city,
        e.location.country,
        e.region ?? "",
        e.title,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return Boolean(e.location.coordinates);
  });
}

export function getMapEvents(): Event[] {
  return exploreEventsData.filter((e) => e.location.coordinates);
}

export function getEventCoordinates(
  eventId: string,
  events: Event[] = exploreEventsData
): { latitude: number; longitude: number } | null {
  const event = events.find((e) => e.id === eventId);
  return event?.location.coordinates ?? null;
}
