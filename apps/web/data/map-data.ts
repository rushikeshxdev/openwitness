import type { MapEvent } from "@/components/map-section";
import { exploreEventsData } from "@/data/explore-events-data";

/**
 * Landing Global Reach markers — real explore events with coordinates.
 */
export const mapEventsData: MapEvent[] = exploreEventsData
  .filter((e) => e.location.coordinates)
  .map((e) => ({
    id: e.id,
    latitude: e.location.coordinates!.latitude,
    longitude: e.location.coordinates!.longitude,
    title: e.title,
    location: `${e.location.city}, ${e.location.country}`,
    evidenceCount: e.evidenceCount,
    status: e.status,
  }));
