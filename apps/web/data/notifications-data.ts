/**
 * Notifications Center view-model + seed data.
 */

export type NotificationCategory =
  | "mentions"
  | "verification"
  | "updates"
  | "comments"
  | "follows"
  | "system";

export type NotificationCategoryFilter = "all" | NotificationCategory;

export interface NotificationReviewer {
  id: string;
  name: string;
  trustScore: number;
  initials: string;
}

export interface NotificationEvidenceCard {
  title: string;
  mediaLabel: string;
  uploadedLabel: string;
  thumbnailUrl: string;
  href: string;
}

export interface NotificationCta {
  label: string;
  href: string;
}

export type NotificationDetail =
  | {
      kind: "verification";
      headline: string;
      summary: string;
      verifiedLabel: string;
      reviewCount: number;
      evidence: NotificationEvidenceCard;
      reviewers: NotificationReviewer[];
      primaryCta: NotificationCta;
      secondaryCta?: NotificationCta;
    }
  | {
      kind: "generic";
      headline: string;
      summary: string;
      primaryCta?: NotificationCta;
      secondaryCta?: NotificationCta;
    };

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  /** Short body with optional markdown-ish link segments rendered in UI */
  body: string;
  /** Linked phrase highlighted in body (optional) */
  highlight?: string;
  highlightHref?: string;
  timeLabel: string;
  /** ISO timestamp for sort + day grouping */
  createdAt: string;
  unread: boolean;
  thumbnailUrl?: string;
  detail: NotificationDetail;
}

export const NOTIFICATIONS_PATH = "/notifications";
export const NOTIFICATION_SETTINGS_PATH =
  "/profile/settings?section=notifications";
export const LOGIN_NEXT_NOTIFICATIONS = `/login?next=${encodeURIComponent(NOTIFICATIONS_PATH)}`;
export const REGISTER_NEXT_NOTIFICATIONS = `/register?next=${encodeURIComponent(NOTIFICATIONS_PATH)}`;

export const NOTIFICATION_CATEGORIES: {
  id: NotificationCategoryFilter;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "mentions", label: "Mentions" },
  { id: "verification", label: "Verification" },
  { id: "updates", label: "Updates" },
  { id: "comments", label: "Comments" },
  { id: "follows", label: "Follows" },
  { id: "system", label: "System" },
];

const EVIDENCE_HREF = "/events/1/evidence/EVT-2024-0517-0001";
const EVENT_HREF = "/events/1";

function atHoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function atDaysAgo(days: number, hour = 14): string {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

/** Seed notifications (~12) matching the Notifications Center mockup. */
export function getSeedNotifications(): AppNotification[] {
  return [
    {
      id: "ntf-v1",
      category: "verification",
      body: "Your evidence 'Student Speech at Delhi University' has been verified by the community.",
      highlight: "Student Speech at Delhi University",
      highlightHref: EVIDENCE_HREF,
      timeLabel: "10:24 AM",
      createdAt: atHoursAgo(2),
      unread: true,
      thumbnailUrl: "/images/events/event2.jpg",
      detail: {
        kind: "verification",
        headline: "Your evidence has been verified!",
        summary:
          "Great news — your uploaded evidence meets our authenticity standards and has been marked verified by the community.",
        verifiedLabel: "Verified By Community",
        reviewCount: 5,
        evidence: {
          title: "Student Speech at Delhi University",
          mediaLabel: "Video · 01:23",
          uploadedLabel: "Uploaded May 17, 2024 · 11:42 AM",
          thumbnailUrl: "/images/events/event2.jpg",
          href: EVIDENCE_HREF,
        },
        reviewers: [
          { id: "r1", name: "Ananya Verma", trustScore: 96, initials: "AV" },
          { id: "r2", name: "Arjun Mehta", trustScore: 94, initials: "AM" },
          { id: "r3", name: "Neha Gupta", trustScore: 93, initials: "NG" },
        ],
        primaryCta: { label: "View Evidence", href: EVIDENCE_HREF },
        secondaryCta: {
          label: "Open Verification Dashboard",
          href: "/verification",
        },
      },
    },
    {
      id: "ntf-u1",
      category: "updates",
      body: "Human Rights Watch started following your contributions.",
      highlight: "Human Rights Watch",
      highlightHref: "/organizations",
      timeLabel: "9:05 AM",
      createdAt: atHoursAgo(4),
      unread: true,
      thumbnailUrl: "/images/events/event4.jpg",
      detail: {
        kind: "generic",
        headline: "New organization follow",
        summary:
          "Human Rights Watch is now following your contributions. Keep documenting — your work is reaching more organizations.",
        primaryCta: { label: "View Profile", href: "/profile" },
      },
    },
    {
      id: "ntf-c1",
      category: "comments",
      body: "Priya Sharma commented on your evidence from CJP Protest – New Delhi.",
      highlight: "CJP Protest – New Delhi",
      highlightHref: EVENT_HREF,
      timeLabel: "8:12 AM",
      createdAt: atHoursAgo(5),
      unread: true,
      thumbnailUrl: "/images/events/event1.jpg",
      detail: {
        kind: "generic",
        headline: "New comment on your evidence",
        summary:
          "Priya Sharma left a comment on your evidence related to CJP Protest – New Delhi.",
        primaryCta: { label: "View Event", href: EVENT_HREF },
      },
    },
    {
      id: "ntf-m1",
      category: "mentions",
      body: "You were mentioned in a timeline note on Farmers Protest – Noida.",
      highlight: "Farmers Protest – Noida",
      highlightHref: "/events/2",
      timeLabel: "7:40 AM",
      createdAt: atHoursAgo(6),
      unread: true,
      thumbnailUrl: "/images/events/event3.jpg",
      detail: {
        kind: "generic",
        headline: "You were mentioned",
        summary:
          "A contributor mentioned you in a timeline note for Farmers Protest – Noida.",
        primaryCta: { label: "Open Timeline", href: "/events/2/timeline" },
      },
    },
    {
      id: "ntf-v2",
      category: "verification",
      body: "Your report 'Flood Relief – Assam' received 2 new verification reviews.",
      highlight: "Flood Relief – Assam",
      highlightHref: "/events/3",
      timeLabel: "Yesterday",
      createdAt: atDaysAgo(1, 16),
      unread: true,
      thumbnailUrl: "/images/events/event5.jpg",
      detail: {
        kind: "verification",
        headline: "New verification reviews",
        summary:
          "Two community reviewers completed authenticity checks on Flood Relief – Assam.",
        verifiedLabel: "Under Community Review",
        reviewCount: 2,
        evidence: {
          title: "Flood Relief – Assam",
          mediaLabel: "Photo · Evidence set",
          uploadedLabel: "Uploaded May 21, 2024",
          thumbnailUrl: "/images/events/event5.jpg",
          href: "/events/3",
        },
        reviewers: [
          { id: "r4", name: "Kabir Singh", trustScore: 91, initials: "KS" },
          { id: "r5", name: "Meera Iyer", trustScore: 89, initials: "MI" },
        ],
        primaryCta: { label: "View Event", href: "/events/3" },
      },
    },
    {
      id: "ntf-m2",
      category: "mentions",
      body: "@rushikesh_dev was tagged in an organization update from Civic Watch.",
      highlight: "Civic Watch",
      highlightHref: "/organizations",
      timeLabel: "Yesterday",
      createdAt: atDaysAgo(1, 11),
      unread: true,
      detail: {
        kind: "generic",
        headline: "Mention in organization update",
        summary:
          "Civic Watch tagged you in an update about community verification coverage.",
        primaryCta: { label: "Explore Organizations", href: "/organizations" },
      },
    },
    {
      id: "ntf-u2",
      category: "updates",
      body: "Status update: CJP Protest – New Delhi moved to Verified.",
      highlight: "CJP Protest – New Delhi",
      highlightHref: EVENT_HREF,
      timeLabel: "Yesterday",
      createdAt: atDaysAgo(1, 9),
      unread: true,
      thumbnailUrl: "/images/events/event1.jpg",
      detail: {
        kind: "generic",
        headline: "Event status updated",
        summary:
          "CJP Protest – New Delhi is now marked Verified after community consensus.",
        primaryCta: { label: "View Event", href: EVENT_HREF },
      },
    },
    {
      id: "ntf-f1",
      category: "follows",
      body: "Ananya Verma started following you.",
      highlight: "Ananya Verma",
      timeLabel: "2d ago",
      createdAt: atDaysAgo(2, 18),
      unread: true,
      detail: {
        kind: "generic",
        headline: "New follower",
        summary: "Ananya Verma started following your contributions on OpenWitness.",
        primaryCta: { label: "View Following", href: "/profile/following" },
      },
    },
    {
      id: "ntf-v3",
      category: "verification",
      body: "Evidence 'March toward India Gate' passed authenticity checks.",
      highlight: "March toward India Gate",
      highlightHref: EVENT_HREF,
      timeLabel: "3d ago",
      createdAt: atDaysAgo(3, 15),
      unread: true,
      thumbnailUrl: "/images/events/event6.jpg",
      detail: {
        kind: "verification",
        headline: "Evidence authenticity confirmed",
        summary:
          "March toward India Gate evidence passed authenticity checks and is now trusted in the timeline.",
        verifiedLabel: "Verified By Community",
        reviewCount: 4,
        evidence: {
          title: "March toward India Gate",
          mediaLabel: "Video · 00:48",
          uploadedLabel: "Uploaded May 23, 2024",
          thumbnailUrl: "/images/events/event6.jpg",
          href: EVENT_HREF,
        },
        reviewers: [
          { id: "r1", name: "Ananya Verma", trustScore: 96, initials: "AV" },
          { id: "r6", name: "Rohan Desai", trustScore: 88, initials: "RD" },
        ],
        primaryCta: { label: "View Event", href: EVENT_HREF },
      },
    },
    {
      id: "ntf-m3",
      category: "mentions",
      body: "You were mentioned in a report discussion thread.",
      timeLabel: "4d ago",
      createdAt: atDaysAgo(4, 12),
      unread: true,
      detail: {
        kind: "generic",
        headline: "Mention in discussion",
        summary:
          "A contributor mentioned you while discussing report sources and corroboration.",
        primaryCta: { label: "Open Reports", href: "/profile/reports" },
      },
    },
    {
      id: "ntf-u3",
      category: "updates",
      body: "Weekly digest: 3 events near you had new evidence this week.",
      timeLabel: "5d ago",
      createdAt: atDaysAgo(5, 10),
      unread: true,
      detail: {
        kind: "generic",
        headline: "Weekly evidence digest",
        summary:
          "Three events near your followed regions received new community evidence this week.",
        primaryCta: { label: "Explore Map", href: "/map" },
      },
    },
    {
      id: "ntf-v4",
      category: "verification",
      body: "Badge progress: you're 1 verification away from Top Contributor.",
      timeLabel: "6d ago",
      createdAt: atDaysAgo(6, 8),
      unread: true,
      detail: {
        kind: "generic",
        headline: "Verification streak update",
        summary:
          "Complete one more community verification to unlock the Top Contributor badge.",
        primaryCta: { label: "View Contributions", href: "/profile/contributions" },
      },
    },
  ];
}

export function filterNotifications(
  items: AppNotification[],
  category: NotificationCategoryFilter
): AppNotification[] {
  if (category === "all") return items;
  return items.filter((n) => n.category === category);
}

export function countByCategory(
  items: AppNotification[]
): Record<NotificationCategoryFilter, number> {
  const counts: Record<NotificationCategoryFilter, number> = {
    all: items.length,
    mentions: 0,
    verification: 0,
    updates: 0,
    comments: 0,
    follows: 0,
    system: 0,
  };
  for (const n of items) {
    counts[n.category] += 1;
  }
  return counts;
}

export function unreadCount(items: AppNotification[]): number {
  return items.filter((n) => n.unread).length;
}

export type DayGroupId = "today" | "yesterday" | "earlier";

export function groupNotificationsByDay(
  items: AppNotification[]
): { id: DayGroupId; label: string; items: AppNotification[] }[] {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const buckets: Record<DayGroupId, AppNotification[]> = {
    today: [],
    yesterday: [],
    earlier: [],
  };

  const sorted = [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  for (const n of sorted) {
    const t = new Date(n.createdAt).getTime();
    if (t >= startOfToday.getTime()) buckets.today.push(n);
    else if (t >= startOfYesterday.getTime()) buckets.yesterday.push(n);
    else buckets.earlier.push(n);
  }

  const labels: Record<DayGroupId, string> = {
    today: "Today",
    yesterday: "Yesterday",
    earlier: "Earlier",
  };

  return (["today", "yesterday", "earlier"] as DayGroupId[])
    .filter((id) => buckets[id].length > 0)
    .map((id) => ({ id, label: labels[id], items: buckets[id] }));
}

export function categoryLabel(category: NotificationCategory): string {
  const found = NOTIFICATION_CATEGORIES.find((c) => c.id === category);
  return found?.label ?? category;
}
