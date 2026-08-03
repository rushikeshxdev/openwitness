/**
 * Evidence Explorer catalog — items link to existing evidence detail routes.
 */

import { exploreEventsData } from "./explore-events-data";
import { listEvidenceForEvent } from "./evidence-detail-data";

export type EvidenceMediaType = "video" | "image" | "audio" | "document";
export type EvidenceTimeRange = "any" | "24h" | "7d" | "30d";
export type EvidenceSort = "newest" | "oldest" | "verified";

export interface EvidenceExplorerItem {
  id: string;
  eventId: string;
  evidenceId: string;
  title: string;
  mediaType: EvidenceMediaType;
  verified: boolean;
  dateLabel: string;
  /** Hours ago from a fixed reference for filtering */
  ageHours: number;
  location: string;
  tags: string[];
  duration?: string;
  thumbnailUrl: string;
  sourceLabel: string;
}

export interface EvidenceExplorerFilters {
  mediaType: EvidenceMediaType | "all";
  eventId: string | "all";
  timeRange: EvidenceTimeRange;
  query: string;
  verifiedOnly: boolean;
  tag: string | null;
  sort: EvidenceSort;
}

export const defaultEvidenceFilters: EvidenceExplorerFilters = {
  mediaType: "all",
  eventId: "all",
  timeRange: "any",
  query: "",
  verifiedOnly: false,
  tag: null,
  sort: "newest",
};

const MEDIA_CYCLE: EvidenceMediaType[] = [
  "video",
  "video",
  "image",
  "video",
  "audio",
  "document",
];

const TAG_POOL = [
  ["Protest", "Crowd"],
  ["Police", "Security"],
  ["Speech", "Campus"],
  ["March", "Streets"],
  ["Media", "Press"],
];

function buildCatalog(): EvidenceExplorerItem[] {
  const items: EvidenceExplorerItem[] = [];
  let i = 0;

  // Prefer events that have rich evidence lists
  const eventIds = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    ...exploreEventsData.slice(8, 14).map((e) => e.id),
  ];

  for (const eventId of eventIds) {
    const event = exploreEventsData.find((e) => e.id === eventId);
    if (!event) continue;
    const list = listEvidenceForEvent(eventId);
    for (const ev of list.slice(0, 3)) {
      const mediaType = MEDIA_CYCLE[i % MEDIA_CYCLE.length];
      const tags = TAG_POOL[i % TAG_POOL.length];
      items.push({
        id: `${eventId}-${ev.id}`,
        eventId,
        evidenceId: ev.id,
        title: ev.title,
        mediaType,
        verified: ev.verified,
        dateLabel: ev.relativeLabel ?? `${(i % 12) + 1}h ago`,
        ageHours: ev.relativeLabel?.includes("m")
          ? 0.1
          : (i % 40) + 1,
        location: `${event.location.city}, ${event.location.country}`,
        tags,
        duration: mediaType === "video" ? ev.duration : undefined,
        thumbnailUrl: ev.thumbnailUrl,
        sourceLabel: i % 3 === 0 ? "The Hindu" : i % 3 === 1 ? "Community" : "Wire",
      });
      i += 1;
      if (items.length >= 16) return items;
    }
  }
  return items;
}

export const evidenceExplorerData: EvidenceExplorerItem[] = buildCatalog();

export const evidenceExplorerStats = {
  totalEvidence: 27842,
  verified: 3921,
  sources: 1204,
  events: 482,
} as const;

export function getEvidenceEventOptions() {
  const ids = new Set(evidenceExplorerData.map((e) => e.eventId));
  return exploreEventsData
    .filter((e) => ids.has(e.id))
    .map((e) => ({ id: e.id, label: e.title }));
}

export function getEvidenceTagOptions(): string[] {
  const tags = new Set<string>();
  for (const item of evidenceExplorerData) {
    for (const t of item.tags) tags.add(t);
  }
  return [...tags].sort();
}

export function filterEvidenceItems(
  items: EvidenceExplorerItem[],
  filters: EvidenceExplorerFilters
): EvidenceExplorerItem[] {
  const q = filters.query.trim().toLowerCase();
  let result = items.filter((item) => {
    if (filters.mediaType !== "all" && item.mediaType !== filters.mediaType) {
      return false;
    }
    if (filters.eventId !== "all" && item.eventId !== filters.eventId) {
      return false;
    }
    if (filters.verifiedOnly && !item.verified) return false;
    if (filters.tag && !item.tags.includes(filters.tag)) return false;
    if (filters.timeRange === "24h" && item.ageHours > 24) return false;
    if (filters.timeRange === "7d" && item.ageHours > 24 * 7) return false;
    if (filters.timeRange === "30d" && item.ageHours > 24 * 30) return false;
    if (q) {
      const hay = [item.title, item.location, item.tags.join(" "), item.sourceLabel]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  result = [...result].sort((a, b) => {
    if (filters.sort === "verified") {
      return Number(b.verified) - Number(a.verified) || a.ageHours - b.ageHours;
    }
    if (filters.sort === "oldest") return b.ageHours - a.ageHours;
    return a.ageHours - b.ageHours;
  });

  return result;
}

export function evidenceDetailHref(
  eventId: string,
  evidenceId: string,
  fromExplorer = true
): string {
  const base = `/events/${eventId}/evidence/${encodeURIComponent(evidenceId)}`;
  return fromExplorer ? `${base}?from=explorer` : base;
}
