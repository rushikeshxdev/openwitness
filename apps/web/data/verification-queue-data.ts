/**
 * Community Verification queue — client-side catalog + review persistence.
 */

import { evidenceExplorerData, evidenceDetailHref } from "./evidence-explorer-data";
import {
  buildEvidenceDetail,
  type EvidenceFilmstripFrame,
} from "./evidence-detail-data";

export const VERIFICATION_PATH = "/verification";
export const LOGIN_NEXT_VERIFICATION = `/login?next=${encodeURIComponent(VERIFICATION_PATH)}`;
export const REGISTER_NEXT_VERIFICATION = `/register?next=${encodeURIComponent(VERIFICATION_PATH)}`;
export const VERIFICATION_REVIEWS_KEY = "ow-verification-reviews";

export type VerificationStatus =
  | "pending"
  | "under_review"
  | "verified"
  | "rejected";

export type VerificationMediaTab =
  | "all"
  | "image"
  | "video"
  | "audio"
  | "document"
  | "other";

export type VerificationSort = "newest" | "oldest";

export type ChecklistAnswer = "yes" | "no" | "unsure" | null;

export type ChecklistCategoryId =
  | "authenticity"
  | "timestamp"
  | "location"
  | "integrity"
  | "context";

export interface ChecklistCategory {
  id: ChecklistCategoryId;
  label: string;
}

export const CHECKLIST_CATEGORIES: ChecklistCategory[] = [
  { id: "authenticity", label: "Authenticity" },
  { id: "timestamp", label: "Timestamp" },
  { id: "location", label: "Location" },
  { id: "integrity", label: "Integrity" },
  { id: "context", label: "Context" },
];

export interface VerificationActivityItem {
  id: string;
  name: string;
  initials: string;
  accent: string;
  action: string;
  timeLabel: string;
}

export interface VerificationMetadata {
  dateTime: string;
  device: string;
  fileSize: string;
  resolution: string;
  format: string;
  sha256: string;
  gpsLabel: string;
  mapHref: string;
  duration?: string;
}

export interface VerificationQueueItem {
  id: string;
  eventId: string;
  evidenceId: string;
  title: string;
  location: string;
  dateLabel: string;
  ageHours: number;
  mediaType: "video" | "image" | "audio" | "document";
  status: VerificationStatus;
  reviewsDone: number;
  reviewsNeeded: number;
  uploaderName: string;
  uploaderVerified: boolean;
  evidenceCode: string;
  thumbnailUrl: string;
  detailHref: string;
  filmstrip: EvidenceFilmstripFrame[];
  metadata: VerificationMetadata;
  activity: VerificationActivityItem[];
  /** Seed flag — true if marked verified today for stats */
  verifiedToday?: boolean;
  rejectedToday?: boolean;
}

export interface VerificationUserStats {
  reviewsCompleted: number;
  accuracyRate: number;
  streakDays: number;
  trustScore: number;
}

export interface StoredReviewAction {
  itemId: string;
  action: "approve" | "reject" | "skip" | "request_info";
  status: VerificationStatus;
  notes?: string;
  at: string;
}

export const USER_VERIFICATION_STATS: VerificationUserStats = {
  reviewsCompleted: 128,
  accuracyRate: 96,
  streakDays: 14,
  trustScore: 92,
};

const UPLOADER_POOL = [
  { name: "Neha Gupta", verified: true },
  { name: "Arjun Mehta", verified: true },
  { name: "Priya Sharma", verified: true },
  { name: "Rahul Verma", verified: false },
  { name: "Maya Lopez", verified: true },
  { name: "Omar Hassan", verified: true },
  { name: "Dev Nair", verified: false },
  { name: "Asha Krishnan", verified: true },
];

const ACTIVITY_NAMES = [
  { name: "Arjun Mehta", initials: "AM", accent: "#3B82F6" },
  { name: "Priya S.", initials: "PS", accent: "#10B981" },
  { name: "Rohan M.", initials: "RM", accent: "#F59E0B" },
  { name: "Maya L.", initials: "ML", accent: "#8B5CF6" },
  { name: "Omar H.", initials: "OH", accent: "#06B6D4" },
];

const STATUS_CYCLE: VerificationStatus[] = [
  "pending",
  "under_review",
  "pending",
  "verified",
  "pending",
  "under_review",
  "rejected",
  "pending",
  "under_review",
  "verified",
  "pending",
  "under_review",
  "pending",
  "verified",
  "rejected",
  "pending",
];

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h || 1;
}

function fakeSha256(seed: string): string {
  const h = hashSeed(seed).toString(16).padStart(8, "0");
  return `${h}${"a1b2c3d4e5f6".slice(0, 8)}…${h.slice(0, 4)}`;
}

function buildActivity(seed: string): VerificationActivityItem[] {
  const n = hashSeed(seed);
  const count = 2 + (n % 3);
  const actions = [
    "reviewed — Approved",
    "reviewed — Requested info",
    "flagged context mismatch",
    "confirmed location",
    "reviewed — Rejected",
  ];
  const times = ["2m ago", "18m ago", "1h ago", "3h ago", "5h ago"];
  return Array.from({ length: count }, (_, i) => {
    const person = ACTIVITY_NAMES[(n + i) % ACTIVITY_NAMES.length];
    return {
      id: `${seed}-act-${i}`,
      name: person.name,
      initials: person.initials,
      accent: person.accent,
      action: actions[(n + i) % actions.length],
      timeLabel: times[i % times.length],
    };
  });
}

function buildSeedQueue(): VerificationQueueItem[] {
  return evidenceExplorerData.map((item, index) => {
    const detail = buildEvidenceDetail(item.eventId, item.evidenceId);
    const status = STATUS_CYCLE[index % STATUS_CYCLE.length];
    const uploader = UPLOADER_POOL[index % UPLOADER_POOL.length];
    const reviewsNeeded = 5;
    const reviewsDone =
      status === "verified"
        ? reviewsNeeded
        : status === "rejected"
          ? Math.min(reviewsNeeded, 2 + (index % 3))
          : status === "under_review"
            ? 1 + (index % 4)
            : index % 4;

    const codeNum = String(100000 + index * 17 + hashSeed(item.id) % 900).padStart(6, "0");
    const evidenceCode = `EV-2024-05-17-${codeNum.slice(0, 6)}`;

    const filmstrip =
      detail?.filmstrip?.length
        ? detail.filmstrip
        : [
            {
              id: `${item.id}-f0`,
              timeLabel: "00:00",
              thumbnailUrl: item.thumbnailUrl,
              seconds: 0,
            },
          ];

    return {
      id: item.id,
      eventId: item.eventId,
      evidenceId: item.evidenceId,
      title: item.title,
      location: item.location,
      dateLabel: item.dateLabel,
      ageHours: item.ageHours,
      mediaType: item.mediaType,
      status,
      reviewsDone: Math.min(reviewsDone, reviewsNeeded),
      reviewsNeeded,
      uploaderName: detail?.fileInfo.uploadedBy ?? uploader.name,
      uploaderVerified: uploader.verified,
      evidenceCode: detail?.fileInfo.fileId ?? evidenceCode,
      thumbnailUrl: item.thumbnailUrl,
      detailHref: evidenceDetailHref(item.eventId, item.evidenceId, true),
      filmstrip,
      metadata: {
        dateTime: detail?.capturedAtLabel ?? item.dateLabel,
        device: detail?.fileInfo.sourceDevice ?? "iPhone 14 Pro",
        fileSize: detail?.fileInfo.size ?? "24.8 MB",
        resolution: detail?.fileInfo.resolution ?? "1920×1080",
        format: detail?.fileInfo.fileType ?? (item.mediaType === "image" ? "JPEG" : "MP4"),
        sha256: fakeSha256(item.id),
        gpsLabel: detail?.location.coordinatesLabel ?? "28.6280° N, 77.2410° E",
        mapHref: `/map?event=${item.eventId}`,
        duration: detail?.fileInfo.duration ?? item.duration,
      },
      activity: buildActivity(item.id),
      verifiedToday: status === "verified",
      rejectedToday: status === "rejected",
    };
  });
}

const SEED_QUEUE = buildSeedQueue();

export function getSeedVerificationQueue(): VerificationQueueItem[] {
  return SEED_QUEUE.map((item) => ({ ...item }));
}

function readStoredReviews(): StoredReviewAction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VERIFICATION_REVIEWS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredReviewAction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredReviews(actions: StoredReviewAction[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VERIFICATION_REVIEWS_KEY, JSON.stringify(actions));
  } catch {
    /* ignore */
  }
}

/** Apply localStorage overrides onto the seed queue */
export function loadVerificationQueue(): VerificationQueueItem[] {
  const seed = getSeedVerificationQueue();
  const reviews = readStoredReviews();
  if (reviews.length === 0) return seed;

  const byId = new Map(reviews.map((r) => [r.itemId, r]));
  return seed.map((item) => {
    const override = byId.get(item.id);
    if (!override) return item;
    return {
      ...item,
      status: override.status,
      reviewsDone:
        override.action === "approve" || override.action === "reject"
          ? Math.min(item.reviewsNeeded, item.reviewsDone + 1)
          : item.reviewsDone,
      verifiedToday: override.action === "approve" ? true : item.verifiedToday,
      rejectedToday: override.action === "reject" ? true : item.rejectedToday,
    };
  });
}

export function saveVerificationReview(
  itemId: string,
  action: StoredReviewAction["action"],
  notes?: string
): VerificationQueueItem[] {
  const status: VerificationStatus =
    action === "approve"
      ? "verified"
      : action === "reject"
        ? "rejected"
        : action === "request_info"
          ? "under_review"
          : "under_review";

  const nextAction: StoredReviewAction = {
    itemId,
    action,
    status: action === "skip" ? "pending" : status,
    notes,
    at: new Date().toISOString(),
  };

  const prev = readStoredReviews().filter((r) => r.itemId !== itemId);
  writeStoredReviews([nextAction, ...prev]);
  return loadVerificationQueue();
}

export interface QueueStats {
  pending: number;
  underReview: number;
  verifiedToday: number;
  rejectedToday: number;
}

export function queueStats(items: VerificationQueueItem[]): QueueStats {
  return {
    pending: items.filter((i) => i.status === "pending").length,
    underReview: items.filter((i) => i.status === "under_review").length,
    verifiedToday: items.filter((i) => Boolean(i.verifiedToday)).length,
    rejectedToday: items.filter((i) => Boolean(i.rejectedToday)).length,
  };
}

export function countByMediaTab(
  items: VerificationQueueItem[]
): Record<VerificationMediaTab, number> {
  const counts: Record<VerificationMediaTab, number> = {
    all: items.length,
    image: 0,
    video: 0,
    audio: 0,
    document: 0,
    other: 0,
  };
  for (const item of items) {
    if (item.mediaType in counts) {
      counts[item.mediaType as Exclude<VerificationMediaTab, "all" | "other">] += 1;
    } else {
      counts.other += 1;
    }
  }
  return counts;
}

export function filterVerificationQueue(
  items: VerificationQueueItem[],
  media: VerificationMediaTab,
  sort: VerificationSort = "newest"
): VerificationQueueItem[] {
  let result =
    media === "all"
      ? items
      : media === "other"
        ? items.filter(
            (i) =>
              i.mediaType !== "image" &&
              i.mediaType !== "video" &&
              i.mediaType !== "audio" &&
              i.mediaType !== "document"
          )
        : items.filter((i) => i.mediaType === media);

  result = [...result].sort((a, b) =>
    sort === "oldest" ? b.ageHours - a.ageHours : a.ageHours - b.ageHours
  );
  return result;
}

export function statusLabel(status: VerificationStatus): string {
  if (status === "pending") return "Pending Review";
  if (status === "under_review") return "Under Review";
  if (status === "verified") return "Verified";
  return "Rejected";
}

export function statusTone(status: VerificationStatus): string {
  if (status === "pending") return "bg-amber-500/15 text-amber-300 border-amber-500/30";
  if (status === "under_review") return "bg-sky-500/15 text-sky-300 border-sky-500/30";
  if (status === "verified") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  return "bg-rose-500/15 text-rose-300 border-rose-500/30";
}
