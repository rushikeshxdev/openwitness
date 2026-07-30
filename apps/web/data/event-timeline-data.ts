/**
 * Rich per-event timeline payloads for /events/[id]/timeline
 */

import { getEventById } from "./explore-events-data";
import {
  buildEventDetail,
  formatStat,
  type EventDetailViewModel,
} from "./event-detail-data";
import { LANDING_REFERENCE_TIME } from "./events-data";

export type TimelineEntryCategory =
  | "update"
  | "evidence"
  | "report"
  | "official"
  | "media";

export type TimelineAccent =
  | "blue"
  | "emerald"
  | "amber"
  | "rose"
  | "violet"
  | "sky";

export interface EventTimelineEntryMedia {
  thumbnailUrl: string;
  duration: string;
}

export interface EventTimelineEntry {
  id: string;
  occurredAt: Date;
  timeLabel: string;
  dateKey: string;
  dateLabel: string;
  category: TimelineEntryCategory;
  title: string;
  summary: string;
  verified: boolean;
  sourceLabel: string;
  views: number;
  accent: TimelineAccent;
  media?: EventTimelineEntryMedia;
}

export interface TimelineContributor {
  id: string;
  name: string;
  initials: string;
  contributionCount: number;
}

export interface TimelineTopSource {
  id: string;
  name: string;
  abbrev: string;
  itemCount: number;
}

export interface EventTimelineStats {
  totalUpdates: number;
  evidenceItems: number;
  sources: number;
  contributors: number;
}

export interface EventTimelineOverview {
  id: string;
  title: string;
  thumbnailUrl: string;
  city: string;
  country: string;
  status: EventDetailViewModel["status"];
  startedLabel: string;
  verifiedCount: number;
  sourceCount: number;
  contributorCount: number;
  liveLabel: string;
}

export interface EventTimelinePageModel {
  overview: EventTimelineOverview;
  entries: EventTimelineEntry[];
  stats: EventTimelineStats;
  contributors: TimelineContributor[];
  topSources: TimelineTopSource[];
  calendarYear: number;
  calendarMonth: number; // 0-indexed
  activeDates: string[]; // YYYY-MM-DD
}

export const TIMELINE_CATEGORY_FILTERS: {
  id: TimelineEntryCategory | "all";
  label: string;
}[] = [
  { id: "all", label: "All Updates" },
  { id: "evidence", label: "Evidence" },
  { id: "report", label: "Reports" },
  { id: "official", label: "Official Statements" },
  { id: "media", label: "Media" },
];

export const TIMELINE_PAGE_SIZE = 6;

export const ACCENT_HEX: Record<TimelineAccent, string> = {
  blue: "#3B82F6",
  emerald: "#22C55E",
  amber: "#F59E0B",
  rose: "#F43F5E",
  violet: "#A78BFA",
  sky: "#38BDF8",
};

function dateKeyFrom(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function dateLabelFrom(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function atUtc(
  year: number,
  monthIndex: number,
  day: number,
  hour: number,
  minute: number
): Date {
  return new Date(Date.UTC(year, monthIndex, day, hour, minute, 0));
}

function entry(
  partial: Omit<EventTimelineEntry, "dateKey" | "dateLabel" | "timeLabel"> & {
    timeLabel?: string;
  }
): EventTimelineEntry {
  const occurredAt = partial.occurredAt;
  const timeLabel =
    partial.timeLabel ??
    occurredAt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  return {
    ...partial,
    timeLabel,
    dateKey: dateKeyFrom(occurredAt),
    dateLabel: dateLabelFrom(occurredAt),
  };
}

const MOCKUP_ENTRIES: EventTimelineEntry[] = [
  entry({
    id: "e1-1",
    occurredAt: atUtc(2024, 4, 17, 10, 30),
    category: "update",
    title: "Protest Begins at Delhi University",
    summary:
      "Students gather at North Campus gates. Initial crowd estimated at 500+ people. Peaceful assembly with placards and speeches.",
    verified: true,
    sourceLabel: "NDTV",
    views: 3600,
    accent: "blue",
    media: {
      thumbnailUrl: "/images/events/event1.jpg",
      duration: "01:23",
    },
  }),
  entry({
    id: "e1-2",
    occurredAt: atUtc(2024, 4, 17, 11, 15),
    category: "evidence",
    title: "Crowd Size Increases Significantly",
    summary:
      "Multiple eyewitness reports confirm crowd has grown to approximately 2,000 people. March preparation underway toward India Gate.",
    verified: true,
    sourceLabel: "The Hindu",
    views: 2800,
    accent: "emerald",
    media: {
      thumbnailUrl: "/images/events/event2.jpg",
      duration: "00:48",
    },
  }),
  entry({
    id: "e1-3",
    occurredAt: atUtc(2024, 4, 17, 12, 0),
    category: "update",
    title: "March Towards India Gate Begins",
    summary:
      "Organized procession leaves North Campus. Route confirmed via Ring Road. Traffic diversions reported by local police.",
    verified: true,
    sourceLabel: "ANI",
    views: 5100,
    accent: "violet",
    media: {
      thumbnailUrl: "/images/events/event5.jpg",
      duration: "02:01",
    },
  }),
  entry({
    id: "e1-4",
    occurredAt: atUtc(2024, 4, 17, 13, 30),
    category: "official",
    title: "Police Presence Increases",
    summary:
      "Delhi Police deploy additional units near India Gate and Connaught Place. Barricades set up on approach roads.",
    verified: true,
    sourceLabel: "Delhi Police",
    views: 4200,
    accent: "rose",
    media: {
      thumbnailUrl: "/images/events/event4.jpg",
      duration: "01:05",
    },
  }),
  entry({
    id: "e1-5",
    occurredAt: atUtc(2024, 4, 17, 14, 45),
    category: "media",
    title: "Live Broadcast Coverage Begins",
    summary:
      "Major news networks begin continuous live coverage from India Gate. Aerial footage shows scale of gathering.",
    verified: true,
    sourceLabel: "India Today",
    views: 8900,
    accent: "sky",
    media: {
      thumbnailUrl: "/images/events/event3.jpg",
      duration: "03:12",
    },
  }),
  entry({
    id: "e1-6",
    occurredAt: atUtc(2024, 4, 17, 15, 20),
    category: "report",
    title: "Unconfirmed Road Closure Report",
    summary:
      "Social posts claim full closure of Rajpath. Not yet corroborated by traffic authorities or verified contributors.",
    verified: false,
    sourceLabel: "Citizen Report",
    views: 940,
    accent: "amber",
  }),
  entry({
    id: "e1-7",
    occurredAt: atUtc(2024, 4, 17, 16, 10),
    category: "evidence",
    title: "Evening Speeches at Central Plaza",
    summary:
      "Organizers address the crowd. Verified audio and multi-angle video uploaded by campus correspondents.",
    verified: true,
    sourceLabel: "The Wire",
    views: 2300,
    accent: "emerald",
    media: {
      thumbnailUrl: "/images/events/event1.jpg",
      duration: "04:20",
    },
  }),
  entry({
    id: "e1-8",
    occurredAt: atUtc(2024, 4, 17, 18, 0),
    category: "update",
    title: "Crowd Begins Dispersal",
    summary:
      "Peaceful dispersal underway. Metro stations report elevated outbound traffic. No major incidents confirmed.",
    verified: true,
    sourceLabel: "NDTV",
    views: 3100,
    accent: "blue",
    media: {
      thumbnailUrl: "/images/events/event2.jpg",
      duration: "01:40",
    },
  }),
  entry({
    id: "e1-9",
    occurredAt: atUtc(2024, 4, 18, 9, 30),
    category: "report",
    title: "Overnight Documentation Summary",
    summary:
      "Community curators publish overnight digest: 84 new evidence items queued for verification.",
    verified: true,
    sourceLabel: "OpenWitness",
    views: 1500,
    accent: "violet",
  }),
  entry({
    id: "e1-10",
    occurredAt: atUtc(2024, 4, 16, 19, 0),
    category: "official",
    title: "Pre-Event Advisory Issued",
    summary:
      "University administration advises students on assembly guidelines and campus access routes for the next day.",
    verified: true,
    sourceLabel: "DU Admin",
    views: 2100,
    accent: "rose",
  }),
];

const MOCKUP_CONTRIBUTORS: TimelineContributor[] = [
  { id: "c1", name: "Priya Sharma", initials: "PS", contributionCount: 47 },
  { id: "c2", name: "Arjun Mehta", initials: "AM", contributionCount: 38 },
  { id: "c3", name: "Neha Kapoor", initials: "NK", contributionCount: 29 },
  { id: "c4", name: "Rahul Verma", initials: "RV", contributionCount: 24 },
  { id: "c5", name: "Sara Khan", initials: "SK", contributionCount: 18 },
];

const MOCKUP_SOURCES: TimelineTopSource[] = [
  { id: "s1", name: "The Hindu", abbrev: "TH", itemCount: 28 },
  { id: "s2", name: "NDTV", abbrev: "ND", itemCount: 22 },
  { id: "s3", name: "The Wire", abbrev: "TW", itemCount: 17 },
  { id: "s4", name: "ANI", abbrev: "AN", itemCount: 14 },
  { id: "s5", name: "India Today", abbrev: "IT", itemCount: 11 },
];

function generatedEntries(
  detail: EventDetailViewModel,
  seed: number
): EventTimelineEntry[] {
  const started = new Date(LANDING_REFERENCE_TIME);
  started.setUTCDate(started.getUTCDate() - (2 + (seed % 3)));
  started.setUTCHours(10, 0, 0, 0);

  const titles = [
    `${detail.title.split("–")[0]?.trim() || "Event"} gathering begins`,
    "Evidence surge from on-ground contributors",
    "Official advisory posted for the area",
    "Media outlets expand live coverage",
    "Unverified claim under community review",
    "Verified perimeter documentation uploaded",
    "Status update from coordinators",
    "Evening situation summary published",
  ];
  const categories: TimelineEntryCategory[] = [
    "update",
    "evidence",
    "official",
    "media",
    "report",
    "evidence",
    "update",
    "report",
  ];
  const accents: TimelineAccent[] = [
    "blue",
    "emerald",
    "rose",
    "sky",
    "amber",
    "emerald",
    "violet",
    "blue",
  ];
  const sources = ["Local Desk", "Community", "Official", "Press Wire", "Citizen"];

  return titles.map((title, i) => {
    const occurredAt = new Date(started);
    occurredAt.setUTCHours(10 + i, (i * 17) % 60, 0, 0);
    if (i >= 6) {
      occurredAt.setUTCDate(occurredAt.getUTCDate() + 1);
      occurredAt.setUTCHours(9 + (i - 6), 15, 0, 0);
    }
    const verified = i !== 4;
    return entry({
      id: `${detail.id}-t${i}`,
      occurredAt,
      category: categories[i],
      title,
      summary: `${detail.description.slice(0, 140)}${detail.description.length > 140 ? "…" : ""}`,
      verified,
      sourceLabel: sources[i % sources.length],
      views: 400 + seed * 80 + i * 310,
      accent: accents[i],
      media:
        i % 2 === 0
          ? {
              thumbnailUrl: detail.thumbnailUrl,
              duration: ["01:12", "00:44", "02:05", "01:33"][i % 4],
            }
          : undefined,
    });
  });
}

function generatedContributors(seed: number): TimelineContributor[] {
  const names = [
    ["Alex Rivera", "AR"],
    ["Jordan Lee", "JL"],
    ["Sam Okonkwo", "SO"],
    ["Mia Chen", "MC"],
    ["Chris Patel", "CP"],
  ];
  return names.map(([name, initials], i) => ({
    id: `gc-${seed}-${i}`,
    name,
    initials,
    contributionCount: 40 - i * 5 + (seed % 7),
  }));
}

function generatedSources(seed: number): TimelineTopSource[] {
  const list = [
    ["Reuters", "RE"],
    ["AP News", "AP"],
    ["Local Press", "LP"],
    ["Community Hub", "CH"],
    ["Wire Service", "WS"],
  ];
  return list.map(([name, abbrev], i) => ({
    id: `gs-${seed}-${i}`,
    name,
    abbrev,
    itemCount: 30 - i * 4 + (seed % 5),
  }));
}

export function buildEventTimeline(id: string): EventTimelinePageModel | null {
  const detail = buildEventDetail(id);
  const event = getEventById(id);
  if (!detail || !event) return null;

  const seed = Number(id) || 1;
  const entries =
    id === "1"
      ? MOCKUP_ENTRIES
      : generatedEntries(detail, seed).sort(
          (a, b) => a.occurredAt.getTime() - b.occurredAt.getTime()
        );

  const sorted = [...entries].sort(
    (a, b) => a.occurredAt.getTime() - b.occurredAt.getTime()
  );

  const activeDates = [...new Set(sorted.map((e) => e.dateKey))];
  const first = sorted[0]?.occurredAt ?? LANDING_REFERENCE_TIME;

  const contributors = id === "1" ? MOCKUP_CONTRIBUTORS : generatedContributors(seed);
  const topSources = id === "1" ? MOCKUP_SOURCES : generatedSources(seed);

  return {
    overview: {
      id: detail.id,
      title: detail.title,
      thumbnailUrl: detail.thumbnailUrl,
      city: detail.city,
      country: detail.country,
      status: detail.status,
      startedLabel: detail.startedLabel,
      verifiedCount: detail.verifiedCount,
      sourceCount: detail.mediaOutlets,
      contributorCount: detail.followerCount,
      liveLabel: detail.status === "live" ? "Ongoing" : "Inactive",
    },
    entries: sorted,
    stats: {
      totalUpdates: id === "1" ? 48 : sorted.length * 4 + seed,
      evidenceItems: detail.verifiedCount,
      sources: detail.mediaOutlets,
      contributors: detail.followerCount,
    },
    contributors,
    topSources,
    calendarYear: first.getUTCFullYear(),
    calendarMonth: first.getUTCMonth(),
    activeDates,
  };
}

export function formatViews(n: number): string {
  return formatStat(n);
}

export function filterTimelineEntries(
  entries: EventTimelineEntry[],
  category: TimelineEntryCategory | "all",
  dateKey: string | null
): EventTimelineEntry[] {
  return entries.filter((e) => {
    if (category !== "all" && e.category !== category) return false;
    if (dateKey && e.dateKey !== dateKey) return false;
    return true;
  });
}

export function groupEntriesByDate(entries: EventTimelineEntry[]) {
  const map = new Map<string, { dateLabel: string; items: EventTimelineEntry[] }>();
  for (const e of entries) {
    const bucket = map.get(e.dateKey);
    if (bucket) bucket.items.push(e);
    else map.set(e.dateKey, { dateLabel: e.dateLabel, items: [e] });
  }
  return [...map.entries()].map(([dateKey, { dateLabel, items }]) => ({
    dateKey,
    dateLabel,
    items,
  }));
}
