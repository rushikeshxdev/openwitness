/**
 * Rich detail payloads for /events/[id] overview mockup
 */

import type { Event, EventCategory, ExploreStatus } from "@/types/event";
import { getEventById, exploreEventsData } from "./explore-events-data";
import { LANDING_REFERENCE_TIME } from "./events-data";

export type TimelineSource = "telegram" | "twitter" | "instagram" | "facebook" | "news";

export interface EventTimelineItem {
  id: string;
  timeLabel: string;
  summary: string;
  source: TimelineSource;
}

export interface MapCluster {
  id: string;
  label: string;
  count: number;
  x: number; // % within map
  y: number;
}

export interface EvidenceHighlight {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  relativeLabel: string;
  verified: boolean;
}

export interface EventDetailViewModel {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  city: string;
  country: string;
  status: ExploreStatus;
  category: EventCategory;
  impactLevel: "low" | "medium" | "high";
  visibility: "public" | "restricted";
  startedLabel: string;
  startDateLabel: string;
  lastUpdatedLabel: string;
  evidenceCount: number;
  verifiedCount: number;
  contributorCount: number;
  mediaOutlets: number;
  followerCount: number;
  discussionCount: number;
  aiSummary: string;
  mapClusters: MapCluster[];
  timeline: EventTimelineItem[];
  evidenceHighlights: EvidenceHighlight[];
  sourceCount: number;
}

const SOURCE_LABEL: Record<TimelineSource, string> = {
  telegram: "TO",
  twitter: "TW",
  instagram: "IG",
  facebook: "FB",
  news: "NEWS",
};

export function sourceAbbrev(source: TimelineSource): string {
  return SOURCE_LABEL[source];
}

function formatStartedAgo(date: Date, now = LANDING_REFERENCE_TIME): string {
  const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  if (hours < 24) return `Started ${Math.max(1, hours)}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Started 1 day ago" : `Started ${days} days ago`;
}

function formatStartDate(date: Date): string {
  return (
    date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    }) + " UTC"
  );
}

function defaultClusters(seed: number): MapCluster[] {
  const base = [
    { id: "c1", label: "North", count: 156, x: 42, y: 28 },
    { id: "c2", label: "Center", count: 128, x: 55, y: 48 },
    { id: "c3", label: "East", count: 84, x: 72, y: 40 },
    { id: "c4", label: "South", count: 62, x: 48, y: 68 },
    { id: "c5", label: "West", count: 41, x: 28, y: 52 },
  ];
  return base.map((c, i) => ({
    ...c,
    count: c.count + ((seed + i * 7) % 40),
  }));
}

function defaultTimeline(title: string): EventTimelineItem[] {
  return [
    {
      id: "t1",
      timeLabel: "10:30 AM",
      summary: `${title.split("–")[0]?.trim() || "Event"} begins at primary location`,
      source: "telegram",
    },
    {
      id: "t2",
      timeLabel: "11:15 AM",
      summary: "Crowd size increases; documentation surge reported",
      source: "twitter",
    },
    {
      id: "t3",
      timeLabel: "12:00 PM",
      summary: "March / movement toward central landmark",
      source: "instagram",
    },
    {
      id: "t4",
      timeLabel: "01:30 PM",
      summary: "Speeches and public addresses underway",
      source: "facebook",
    },
    {
      id: "t5",
      timeLabel: "03:45 PM",
      summary: "Security presence increases in the area",
      source: "news",
    },
  ];
}

function defaultEvidence(event: Event): EvidenceHighlight[] {
  const thumbs = [
    event.thumbnailUrl,
    "/images/events/event2.jpg",
    "/images/events/event3.jpg",
    "/images/events/event4.jpg",
    "/images/events/event5.jpg",
  ];
  const titles = [
    "Primary gathering footage",
    "Crowd movement clip",
    "On-ground testimony",
    "Perimeter overview",
    "Evening update reel",
  ];
  return titles.map((title, i) => ({
    id: `ev-${event.id}-${i}`,
    title,
    thumbnailUrl: thumbs[i % thumbs.length],
    duration: ["01:23", "00:48", "02:10", "01:05", "00:36"][i],
    relativeLabel: ["3m ago", "12m ago", "28m ago", "1h ago", "2h ago"][i],
    verified: i < 4,
  }));
}

const OVERRIDES: Partial<
  Record<
    string,
    Partial<EventDetailViewModel> & {
      timeline?: EventTimelineItem[];
      evidenceHighlights?: EvidenceHighlight[];
    }
  >
> = {
  "1": {
    thumbnailUrl: "/images/hero-bg.png",
    description:
      "Students and citizens gather across New Delhi to protest the CJP decision, documenting speeches, marches, and police presence in real time.",
    verifiedCount: 127,
    contributorCount: 3200,
    mediaOutlets: 15,
    followerCount: 1200,
    discussionCount: 128,
    lastUpdatedLabel: "Last updated 3 minutes ago",
    startedLabel: "Started 3 days ago",
    startDateLabel: "May 17, 2024 – 10:30 AM",
    impactLevel: "high",
    sourceCount: 8,
    aiSummary:
      "Large peaceful protest focused on legal accountability. Heavy police presence near India Gate and campus corridors. Evidence volume is rising fastest from North Campus and central junctions.",
    mapClusters: [
      { id: "c1", label: "North Campus", count: 156, x: 38, y: 26 },
      { id: "c2", label: "India Gate", count: 128, x: 58, y: 52 },
      { id: "c3", label: "CP", count: 84, x: 68, y: 40 },
      { id: "c4", label: "ITO", count: 62, x: 72, y: 58 },
      { id: "c5", label: "South Ext.", count: 41, x: 48, y: 72 },
    ],
    timeline: [
      {
        id: "t1",
        timeLabel: "10:30 AM",
        summary: "Protest begins at Delhi University",
        source: "telegram",
      },
      {
        id: "t2",
        timeLabel: "11:15 AM",
        summary: "Gathering increases near North Campus",
        source: "twitter",
      },
      {
        id: "t3",
        timeLabel: "12:00 PM",
        summary: "March towards India Gate begins",
        source: "instagram",
      },
      {
        id: "t4",
        timeLabel: "01:30 PM",
        summary: "Speeches and addresses at central plaza",
        source: "facebook",
      },
      {
        id: "t5",
        timeLabel: "03:45 PM",
        summary: "Police presence increases around India Gate",
        source: "news",
      },
    ],
    evidenceHighlights: [
      {
        id: "EVT-2024-0517-0001",
        title: "Protest at India Gate",
        thumbnailUrl: "/images/hero-bg.png",
        duration: "01:23",
        relativeLabel: "3m ago",
        verified: true,
      },
      {
        id: "eh2",
        title: "Student Speeches",
        thumbnailUrl: "/images/events/event2.jpg",
        duration: "00:54",
        relativeLabel: "8m ago",
        verified: true,
      },
      {
        id: "eh3",
        title: "March toward India Gate",
        thumbnailUrl: "/images/events/event5.jpg",
        duration: "02:01",
        relativeLabel: "15m ago",
        verified: true,
      },
      {
        id: "eh4",
        title: "Police corridor footage",
        thumbnailUrl: "/images/events/event4.jpg",
        duration: "01:12",
        relativeLabel: "22m ago",
        verified: true,
      },
      {
        id: "eh5",
        title: "Crowd density overview",
        thumbnailUrl: "/images/events/event3.jpg",
        duration: "00:41",
        relativeLabel: "34m ago",
        verified: true,
      },
    ],
  },
};

function formatCompact(n: number): string {
  if (n >= 1000) {
    const v = n / 1000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}K`;
  }
  return n.toLocaleString();
}

export function formatStat(n: number): string {
  return formatCompact(n);
}

export function buildEventDetail(id: string): EventDetailViewModel | null {
  const event = getEventById(id);
  if (!event) return null;

  const override = OVERRIDES[id] ?? {};
  const started = event.startedAt ?? event.timestamp;
  const seed = Number(event.id) || 1;

  return {
    id: event.id,
    title: event.title,
    description:
      override.description ??
      event.description ??
      "Community-documented public event with ongoing evidence collection.",
    thumbnailUrl: override.thumbnailUrl ?? event.thumbnailUrl,
    city: event.location.city,
    country: event.location.country,
    status: event.status ?? "under_review",
    category: event.category ?? "other",
    impactLevel: override.impactLevel ?? (event.status === "live" ? "high" : "medium"),
    visibility: "public",
    startedLabel: override.startedLabel ?? formatStartedAgo(started),
    startDateLabel: override.startDateLabel ?? formatStartDate(started),
    lastUpdatedLabel: override.lastUpdatedLabel ?? "Last updated 12 minutes ago",
    evidenceCount: event.evidenceCount,
    verifiedCount: override.verifiedCount ?? event.verifiedCount ?? Math.floor(event.evidenceCount * 0.4),
    contributorCount:
      override.contributorCount ?? event.contributorCount ?? 40 + seed * 7,
    mediaOutlets: override.mediaOutlets ?? 4 + (seed % 12),
    followerCount: override.followerCount ?? 200 + seed * 37,
    discussionCount: override.discussionCount ?? 20 + seed * 5,
    aiSummary:
      override.aiSummary ??
      `${event.title} is being actively documented by contributors. Verification is in progress for new uploads. Cluster activity is concentrated near ${event.location.city}.`,
    mapClusters: override.mapClusters ?? defaultClusters(seed),
    timeline: override.timeline ?? defaultTimeline(event.title),
    evidenceHighlights: override.evidenceHighlights ?? defaultEvidence(event),
    sourceCount: override.sourceCount ?? 8,
  };
}

export function getAllEventDetailIds(): string[] {
  return exploreEventsData.map((e) => e.id);
}

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  protest: "Protest",
  disaster: "Disaster",
  accident: "Accident",
  gathering: "Gathering",
  other: "Other",
};
