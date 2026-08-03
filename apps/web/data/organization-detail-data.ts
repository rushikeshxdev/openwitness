/**
 * Rich organization profile payloads for /organizations/[id]
 */

import {
  trustedOrganizationsData,
  type TrustedOrganization,
} from "./trusted-organizations-data";

export type OrgProfileSection =
  | "overview"
  | "events"
  | "reports"
  | "evidence"
  | "activity"
  | "team"
  | "followers"
  | "endorsements"
  | "about";

export type OrgEventStatus = "live" | "ongoing" | "archived";

export interface OrgActiveEvent {
  id: string;
  title: string;
  location: string;
  dateLabel: string;
  status: OrgEventStatus;
  thumbnailUrl: string;
  evidenceCount: number;
  contributorCount: number;
}

export interface OrgImpactStat {
  id: string;
  label: string;
  value: number;
}

export type OrgActivityKind =
  | "endorsement"
  | "evidence"
  | "report"
  | "event"
  | "follow";

export interface OrgActivityItem {
  id: string;
  kind: OrgActivityKind;
  text: string;
  linkLabel?: string;
  linkHref?: string;
  relativeLabel: string;
}

export interface OrgEndorsement {
  id: string;
  name: string;
  initials: string;
  accent: string;
  verified: boolean;
  dateLabel: string;
}

export interface OrgRecentReport {
  id: string;
  title: string;
  dateLabel: string;
  status: "published" | "draft";
  thumbnailUrl: string;
  href?: string;
}

export interface OrganizationDetailViewModel {
  id: string;
  fullName: string;
  tagline: string;
  bio: string;
  aboutText: string;
  location: string;
  website: string;
  websiteLabel: string;
  coverUrl: string;
  initials: string;
  accent: string;
  verified: boolean;
  verifiedAt: string;
  category: TrustedOrganization["category"];
  founded: string;
  type: string;
  focusAreas: string[];
  region: string;
  counts: {
    followers: number;
    reports: number;
    evidence: number;
    endorsements: number;
    events: number;
    team: number;
  };
  impactPeriod: string;
  impactStats: OrgImpactStat[];
  activeEvents: OrgActiveEvent[];
  recentActivity: OrgActivityItem[];
  topEndorsements: OrgEndorsement[];
  recentReports: OrgRecentReport[];
}

const SHARED_EVENTS: OrgActiveEvent[] = [
  {
    id: "cjp-protest-delhi",
    title: "CJP Protest Delhi",
    location: "New Delhi, India",
    dateLabel: "Mar 12, 2024",
    status: "live",
    thumbnailUrl: "/images/events/event1.jpg",
    evidenceCount: 48,
    contributorCount: 12,
  },
  {
    id: "manipur-violence",
    title: "Manipur Violence",
    location: "Imphal, Manipur",
    dateLabel: "Feb 28, 2024",
    status: "ongoing",
    thumbnailUrl: "/images/events/event2.jpg",
    evidenceCount: 312,
    contributorCount: 64,
  },
  {
    id: "assam-floods-2024",
    title: "Assam Floods 2024",
    location: "Guwahati, Assam",
    dateLabel: "Jun 4, 2024",
    status: "ongoing",
    thumbnailUrl: "/images/events/event3.jpg",
    evidenceCount: 89,
    contributorCount: 27,
  },
];

const SHARED_ENDORSEMENTS: OrgEndorsement[] = [
  {
    id: "the-wire",
    name: "The Wire",
    initials: "TW",
    accent: "#EF4444",
    verified: true,
    dateLabel: "Jan 2024",
  },
  {
    id: "article-19-india",
    name: "Article 19 India",
    initials: "A19",
    accent: "#EC4899",
    verified: true,
    dateLabel: "Feb 2024",
  },
  {
    id: "pucl",
    name: "PUCL",
    initials: "P",
    accent: "#06B6D4",
    verified: true,
    dateLabel: "Mar 2024",
  },
  {
    id: "human-rights",
    name: "HRW",
    initials: "HR",
    accent: "#3B82F6",
    verified: true,
    dateLabel: "Mar 2024",
  },
  {
    id: "reuters",
    name: "Reuters",
    initials: "R",
    accent: "#F59E0B",
    verified: true,
    dateLabel: "Apr 2024",
  },
];

const SHARED_REPORTS: OrgRecentReport[] = [
  {
    id: "internet-shutdowns-2024",
    title: "Internet Shutdowns in India 2024",
    dateLabel: "Apr 2, 2024",
    status: "published",
    thumbnailUrl: "/images/events/event4.jpg",
    href: "/reports",
  },
  {
    id: "protest-policing-delhi",
    title: "Protest Policing in Delhi",
    dateLabel: "Mar 18, 2024",
    status: "published",
    thumbnailUrl: "/images/events/event5.jpg",
    href: "/reports",
  },
  {
    id: "manipur-rights-brief",
    title: "Manipur Rights Brief",
    dateLabel: "Mar 1, 2024",
    status: "published",
    thumbnailUrl: "/images/events/event6.jpg",
    href: "/reports",
  },
  {
    id: "assam-flood-response",
    title: "Assam Flood Response Audit",
    dateLabel: "Feb 12, 2024",
    status: "published",
    thumbnailUrl: "/images/events/event2.jpg",
    href: "/reports",
  },
];

const AMNESTY_DETAIL: OrganizationDetailViewModel = {
  id: "amnesty",
  fullName: "Amnesty International India",
  tagline: "Verified Organization",
  bio: "A global movement of more than 10 million people who take injustice personally. We campaign for a world where human rights are enjoyed by all.",
  aboutText:
    "Amnesty International India documents human rights abuses, advocates for accountability, and mobilizes public pressure for justice across India and South Asia. Our investigators, researchers, and campaigners work with communities to preserve evidence and amplify verified truth.",
  location: "New Delhi, India",
  website: "https://www.amnesty.org.in",
  websiteLabel: "amnesty.org.in",
  coverUrl: "/images/events/event1.jpg",
  initials: "A",
  accent: "#F59E0B",
  verified: true,
  verifiedAt: "Apr 12, 2024",
  category: "Human Rights Organization",
  founded: "1961",
  type: "NGO",
  focusAreas: ["Human Rights", "Civil Liberties", "Accountability"],
  region: "India & South Asia",
  counts: {
    followers: 8600,
    reports: 17,
    evidence: 1200,
    endorsements: 156,
    events: 28,
    team: 42,
  },
  impactPeriod: "This Year",
  impactStats: [
    { id: "events-monitored", label: "Events Monitored", value: 28 },
    { id: "reports-published", label: "Reports Published", value: 17 },
    { id: "evidence-verified", label: "Evidence Verified", value: 1200 },
    { id: "endorsements", label: "Endorsements", value: 156 },
  ],
  activeEvents: SHARED_EVENTS,
  recentActivity: [
    {
      id: "a1",
      kind: "endorsement",
      text: "Endorsed report",
      linkLabel: "Internet Shutdowns in India 2024",
      linkHref: "/reports",
      relativeLabel: "2 hours ago",
    },
    {
      id: "a2",
      kind: "evidence",
      text: "Added new evidence to",
      linkLabel: "Manipur Violence",
      linkHref: "/events/manipur-violence",
      relativeLabel: "5 hours ago",
    },
    {
      id: "a3",
      kind: "report",
      text: "Published",
      linkLabel: "Protest Policing in Delhi",
      linkHref: "/reports",
      relativeLabel: "1 day ago",
    },
    {
      id: "a4",
      kind: "event",
      text: "Started monitoring",
      linkLabel: "Assam Floods 2024",
      linkHref: "/events/assam-floods-2024",
      relativeLabel: "3 days ago",
    },
    {
      id: "a5",
      kind: "follow",
      text: "Gained 240 new followers",
      relativeLabel: "1 week ago",
    },
  ],
  topEndorsements: SHARED_ENDORSEMENTS,
  recentReports: SHARED_REPORTS,
};

function scaleCounts(
  base: OrganizationDetailViewModel["counts"],
  factor: number
): OrganizationDetailViewModel["counts"] {
  return {
    followers: Math.max(120, Math.round(base.followers * factor)),
    reports: Math.max(3, Math.round(base.reports * factor)),
    evidence: Math.max(40, Math.round(base.evidence * factor)),
    endorsements: Math.max(8, Math.round(base.endorsements * factor)),
    events: Math.max(4, Math.round(base.events * factor)),
    team: Math.max(6, Math.round(base.team * factor)),
  };
}

function buildFallbackDetail(
  org: TrustedOrganization
): OrganizationDetailViewModel {
  const factor = Math.min(1, org.eventCount / 120);
  const counts = scaleCounts(AMNESTY_DETAIL.counts, factor);
  return {
    id: org.id,
    fullName: org.name,
    tagline: org.verified ? "Verified Organization" : "Organization",
    bio:
      org.description ??
      `${org.name} documents public events and evidence on OpenWitness.`,
    aboutText:
      org.description ??
      `${org.name} works on transparency, accountability, and verified documentation across civic events.`,
    location: "India",
    website: org.website ?? "https://openwitness.org",
    websiteLabel: org.website
      ? org.website.replace(/^https?:\/\//, "").replace(/\/$/, "")
      : "openwitness.org",
    coverUrl: "/images/events/event2.jpg",
    initials: org.initials,
    accent: org.accent,
    verified: org.verified,
    verifiedAt: "Jan 8, 2024",
    category: org.category,
    founded: "—",
    type: org.category.includes("Media") ? "Media" : "NGO",
    focusAreas: [org.category.split(" ")[0] ?? "Rights", "Documentation"],
    region: "India",
    counts: { ...counts, events: org.eventCount },
    impactPeriod: "This Year",
    impactStats: [
      { id: "events-monitored", label: "Events Monitored", value: org.eventCount },
      { id: "reports-published", label: "Reports Published", value: counts.reports },
      {
        id: "evidence-verified",
        label: "Evidence Verified",
        value: counts.evidence,
      },
      {
        id: "endorsements",
        label: "Endorsements",
        value: counts.endorsements,
      },
    ],
    activeEvents: SHARED_EVENTS.slice(0, 2).map((e, i) => ({
      ...e,
      id: `${org.id}-${e.id}`,
      title: i === 0 ? `${org.name} Field Monitor` : e.title,
    })),
    recentActivity: [
      {
        id: `${org.id}-a1`,
        kind: "report",
        text: "Published a new report",
        relativeLabel: "2 days ago",
      },
      {
        id: `${org.id}-a2`,
        kind: "evidence",
        text: "Verified new evidence",
        relativeLabel: "5 days ago",
      },
      {
        id: `${org.id}-a3`,
        kind: "event",
        text: "Joined monitoring for an active event",
        relativeLabel: "1 week ago",
      },
    ],
    topEndorsements: SHARED_ENDORSEMENTS.filter((e) => e.id !== org.id).slice(
      0,
      4
    ),
    recentReports: SHARED_REPORTS.slice(0, 3),
  };
}

const DETAIL_OVERRIDES: Record<string, OrganizationDetailViewModel> = {
  amnesty: AMNESTY_DETAIL,
};

export function formatOrgStat(n: number): string {
  if (n >= 1000) {
    const v = n / 1000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}K`;
  }
  return n.toLocaleString();
}

export function getOrganizationDetail(
  id: string
): OrganizationDetailViewModel | null {
  if (DETAIL_OVERRIDES[id]) return DETAIL_OVERRIDES[id];
  const org = trustedOrganizationsData.find((o) => o.id === id);
  if (!org) return null;
  return buildFallbackDetail(org);
}

export function getAllOrganizationDetailIds(): string[] {
  return trustedOrganizationsData.map((o) => o.id);
}

export const ORG_PROFILE_NAV: Array<{
  id: OrgProfileSection;
  label: string;
  countKey?: keyof OrganizationDetailViewModel["counts"];
}> = [
  { id: "overview", label: "Overview" },
  { id: "events", label: "Events", countKey: "events" },
  { id: "reports", label: "Reports", countKey: "reports" },
  { id: "evidence", label: "Evidence", countKey: "evidence" },
  { id: "activity", label: "Activity" },
  { id: "team", label: "Team", countKey: "team" },
  { id: "followers", label: "Followers", countKey: "followers" },
  { id: "endorsements", label: "Endorsements", countKey: "endorsements" },
  { id: "about", label: "About" },
];
