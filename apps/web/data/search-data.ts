/**
 * Client-side search catalog for the global Search Modal
 */

import { exploreEventsData } from "./explore-events-data";
import {
  evidenceDetailHref,
  evidenceExplorerData,
} from "./evidence-explorer-data";
import { trustedOrganizationsData } from "./trusted-organizations-data";
import { reportsData } from "./reports-data";

export type SearchType =
  | "all"
  | "events"
  | "evidence"
  | "organizations"
  | "people"
  | "reports"
  | "tags";

export const SEARCH_TYPE_OPTIONS: Array<{ id: SearchType; label: string }> = [
  { id: "all", label: "All" },
  { id: "events", label: "Events" },
  { id: "evidence", label: "Evidence" },
  { id: "organizations", label: "Organizations" },
  { id: "people", label: "People" },
  { id: "reports", label: "Reports" },
  { id: "tags", label: "Tags" },
];

export type SearchResultKind =
  | "event"
  | "evidence"
  | "organization"
  | "person"
  | "report"
  | "tag";

export interface SearchResultItem {
  id: string;
  kind: SearchResultKind;
  title: string;
  href: string;
  meta?: string;
  tags?: string[];
  badge?: string;
  badgeTone?: "live" | "trending" | "verified" | "pending";
  thumbnailUrl?: string;
  initials?: string;
  accent?: string;
  stats?: string;
  subtitle?: string;
}

export interface SearchGroupedResults {
  events: SearchResultItem[];
  evidence: SearchResultItem[];
  organizations: SearchResultItem[];
  people: SearchResultItem[];
  reports: SearchResultItem[];
  tags: SearchResultItem[];
}

export interface RecentSearchItem {
  query: string;
  typeLabel: string;
  href?: string;
}

export interface TrendingSearchItem {
  query: string;
}

export interface QuickActionItem {
  id: string;
  label: string;
  href: string;
  shortcut: string;
}

export const RECENT_SEARCHES_KEY = "ow-recent-searches";
const RECENT_MAX = 8;

export const TRENDING_SEARCHES: TrendingSearchItem[] = [
  { query: "Elections 2024" },
  { query: "Israel Palestine" },
  { query: "Wildfires Canada" },
  { query: "Ukraine War" },
  { query: "Climate Change Report" },
];

export const QUICK_ACTIONS: QuickActionItem[] = [
  { id: "report", label: "Report an Incident", href: "/report", shortcut: "R" },
  {
    id: "upload",
    label: "Upload Evidence",
    href: "/evidence/new",
    shortcut: "U",
  },
  { id: "create-report", label: "Create Report", href: "/reports", shortcut: "N" },
  { id: "map", label: "Explore Map", href: "/map", shortcut: "M" },
];

export const DEFAULT_RECENT_SEARCHES: RecentSearchItem[] = [
  { query: "CJP Protest Delhi", typeLabel: "Event", href: "/events/1" },
  { query: "India Gate protest", typeLabel: "Event", href: "/events/1" },
  { query: "Police action ITO", typeLabel: "Event", href: "/events/1" },
  { query: "Floods in Assam", typeLabel: "Event", href: "/events/3" },
  { query: "Reuters", typeLabel: "Organization", href: "/organizations" },
];

const PEOPLE_SEED: SearchResultItem[] = [
  {
    id: "p-asha",
    kind: "person",
    title: "Asha K.",
    href: "/profile",
    initials: "AK",
    accent: "#3B82F6",
    meta: "Contributor · Verifications",
  },
  {
    id: "p-rohan",
    kind: "person",
    title: "Rohan M.",
    href: "/profile",
    initials: "RM",
    accent: "#10B981",
    meta: "Contributor · Evidence",
  },
  {
    id: "p-priya",
    kind: "person",
    title: "Priya S.",
    href: "/profile",
    initials: "PS",
    accent: "#8B5CF6",
    meta: "Contributor · Discussions",
  },
  {
    id: "p-maya",
    kind: "person",
    title: "Maya L.",
    href: "/profile",
    initials: "ML",
    accent: "#F59E0B",
    meta: "Contributor · Reports",
  },
  {
    id: "p-omar",
    kind: "person",
    title: "Omar H.",
    href: "/profile",
    initials: "OH",
    accent: "#06B6D4",
    meta: "Contributor · Field notes",
  },
  {
    id: "p-dev",
    kind: "person",
    title: "Dev N.",
    href: "/profile",
    initials: "DN",
    accent: "#EC4899",
    meta: "Contributor · Timeline",
  },
];

function matchesQuery(hay: string, q: string): boolean {
  return hay.toLowerCase().includes(q.toLowerCase());
}

function buildEventResults(): SearchResultItem[] {
  return exploreEventsData.map((e) => ({
    id: `event-${e.id}`,
    kind: "event" as const,
    title: e.title,
    href: `/events/${e.id}`,
    meta: `${e.location.city}, ${e.location.country}`,
    subtitle: e.startedAt
      ? e.startedAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : undefined,
    tags: e.tags,
    badge:
      e.status === "live"
        ? "LIVE"
        : e.status === "trending"
          ? "TRENDING"
          : e.status === "verified"
            ? "VERIFIED"
            : undefined,
    badgeTone:
      e.status === "live"
        ? ("live" as const)
        : e.status === "trending"
          ? ("trending" as const)
          : e.status === "verified"
            ? ("verified" as const)
            : undefined,
    thumbnailUrl: e.thumbnailUrl,
    stats: `${e.evidenceCount.toLocaleString()} Evidence · ${e.contributorCount?.toLocaleString() ?? 0} Contributors`,
  }));
}

function buildEvidenceResults(): SearchResultItem[] {
  return evidenceExplorerData.map((e) => ({
    id: `evidence-${e.id}`,
    kind: "evidence" as const,
    title: e.title,
    href: evidenceDetailHref(e.eventId, e.evidenceId, true),
    meta: [
      e.mediaType.charAt(0).toUpperCase() + e.mediaType.slice(1),
      e.duration,
      e.dateLabel,
      e.location,
    ]
      .filter(Boolean)
      .join(" · "),
    tags: e.tags,
    badge: e.verified ? "Verified By Community" : "Under Review",
    badgeTone: e.verified ? ("verified" as const) : ("pending" as const),
    thumbnailUrl: e.thumbnailUrl,
  }));
}

function buildOrgResults(): SearchResultItem[] {
  return trustedOrganizationsData.map((o) => ({
    id: `org-${o.id}`,
    kind: "organization" as const,
    title: o.name,
    href: "/organizations",
    meta: o.category,
    initials: o.initials,
    accent: o.accent,
    badge: o.verified ? "Verified" : undefined,
    badgeTone: o.verified ? ("verified" as const) : undefined,
    stats: `${o.eventCount} Events`,
  }));
}

function buildReportResults(): SearchResultItem[] {
  return reportsData.map((r) => ({
    id: `report-${r.id}`,
    kind: "report" as const,
    title: r.title,
    href: r.eventId ? `/events/${r.eventId}` : "/reports",
    meta: `${r.author} · ${r.dateLabel}`,
    subtitle: r.summary,
    badge: r.status === "published" ? "Published" : "Under Review",
    badgeTone:
      r.status === "published" ? ("verified" as const) : ("pending" as const),
  }));
}

function buildTagResults(): SearchResultItem[] {
  const tags = new Set<string>();
  for (const e of exploreEventsData) {
    for (const t of e.tags ?? []) tags.add(t);
  }
  for (const e of evidenceExplorerData) {
    for (const t of e.tags) tags.add(t);
  }
  return [...tags].sort().map((tag) => ({
    id: `tag-${tag}`,
    kind: "tag" as const,
    title: `#${tag}`,
    href: `/events?tag=${encodeURIComponent(tag)}`,
    meta: "Tag",
  }));
}

const ALL_EVENTS = buildEventResults();
const ALL_EVIDENCE = buildEvidenceResults();
const ALL_ORGS = buildOrgResults();
const ALL_REPORTS = buildReportResults();
const ALL_TAGS = buildTagResults();

export function getTopPreviewResults() {
  return {
    events: ALL_EVENTS.slice(0, 3),
    evidence: ALL_EVIDENCE.slice(0, 2),
    organizations: ALL_ORGS.slice(0, 6),
  };
}

function filterList(items: SearchResultItem[], q: string): SearchResultItem[] {
  if (!q.trim()) return items;
  return items.filter((item) => {
    const hay = [
      item.title,
      item.meta,
      item.subtitle,
      item.stats,
      ...(item.tags ?? []),
    ]
      .filter(Boolean)
      .join(" ");
    return matchesQuery(hay, q);
  });
}

export function searchCatalog(
  query: string,
  type: SearchType = "all"
): SearchGroupedResults {
  const q = query.trim();
  const empty: SearchGroupedResults = {
    events: [],
    evidence: [],
    organizations: [],
    people: [],
    reports: [],
    tags: [],
  };

  if (!q) return empty;

  const include = (t: SearchType) => type === "all" || type === t;

  return {
    events: include("events") ? filterList(ALL_EVENTS, q).slice(0, 8) : [],
    evidence: include("evidence")
      ? filterList(ALL_EVIDENCE, q).slice(0, 8)
      : [],
    organizations: include("organizations")
      ? filterList(ALL_ORGS, q).slice(0, 8)
      : [],
    people: include("people") ? filterList(PEOPLE_SEED, q).slice(0, 8) : [],
    reports: include("reports") ? filterList(ALL_REPORTS, q).slice(0, 8) : [],
    tags: include("tags") ? filterList(ALL_TAGS, q).slice(0, 12) : [],
  };
}

export function countGroupedResults(g: SearchGroupedResults): number {
  return (
    g.events.length +
    g.evidence.length +
    g.organizations.length +
    g.people.length +
    g.reports.length +
    g.tags.length
  );
}

export function flattenGroupedResults(
  g: SearchGroupedResults
): SearchResultItem[] {
  return [
    ...g.events,
    ...g.evidence,
    ...g.organizations,
    ...g.people,
    ...g.reports,
    ...g.tags,
  ];
}

export function loadRecentSearches(): RecentSearchItem[] {
  if (typeof window === "undefined") return DEFAULT_RECENT_SEARCHES;
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return DEFAULT_RECENT_SEARCHES;
    const parsed = JSON.parse(raw) as RecentSearchItem[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed.slice(0, RECENT_MAX)
      : DEFAULT_RECENT_SEARCHES;
  } catch {
    return DEFAULT_RECENT_SEARCHES;
  }
}

export function saveRecentSearch(item: RecentSearchItem): RecentSearchItem[] {
  const q = item.query.trim();
  if (!q || typeof window === "undefined") return loadRecentSearches();
  const prev = loadRecentSearches().filter(
    (r) => r.query.toLowerCase() !== q.toLowerCase()
  );
  const next = [{ ...item, query: q }, ...prev].slice(0, RECENT_MAX);
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify([]));
  } catch {
    /* ignore */
  }
}
