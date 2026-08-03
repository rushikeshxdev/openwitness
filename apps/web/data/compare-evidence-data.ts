/**
 * Compare Evidence workspace — corroboration scores across 2–5 items.
 * Scores answer "same incident?" not "which clip is true."
 */

import {
  buildEvidenceDetail,
  listEvidenceForEvent,
} from "./evidence-detail-data";
import {
  evidenceDetailHref,
  evidenceExplorerData,
} from "./evidence-explorer-data";

export const MAX_COMPARE_SLOTS = 5;
export const MIN_COMPARE_SLOTS = 2;

export type CompareTabId =
  | "overview"
  | "visual"
  | "location"
  | "metadata"
  | "audio"
  | "verification"
  | "details";

export type CompareMetricKey =
  | "visual"
  | "location"
  | "time"
  | "context"
  | "audio";

export type CompareHighlightTone = "success" | "warning" | "info";

export type CompareTimelinePointKind = "recording" | "key" | "missing";

export interface CompareIdPair {
  eventId: string;
  evidenceId: string;
}

export interface CompareSlot {
  letter: string;
  eventId: string;
  evidenceId: string;
  title: string;
  mediaType: string;
  duration: string;
  uploader: string;
  uploaderInitials: string;
  uploaderAccent: string;
  verified: boolean;
  thumbnailUrl: string;
  detailHref: string;
  type: string;
  resolution: string;
  fileSize: string;
  uploadedAt: string;
  statusLabel: string;
}

export interface CompareMetric {
  key: CompareMetricKey;
  label: string;
  percent: number;
  qualitative: string;
}

export interface CompareScores {
  overall: number;
  overallLabel: string;
  metrics: CompareMetric[];
}

export interface CompareTimelinePoint {
  kind: CompareTimelinePointKind;
  /** 0–100 position along the axis */
  at: number;
}

export interface CompareTimelineTrack {
  letter: string;
  points: CompareTimelinePoint[];
}

export interface CompareTimeline {
  axisLabels: string[];
  currentAt: number;
  currentLabel: string;
  tracks: CompareTimelineTrack[];
  legend: Array<{ kind: CompareTimelinePointKind; label: string }>;
}

export interface CompareHighlight {
  id: string;
  tone: CompareHighlightTone;
  text: string;
}

export interface CompareAiInsight {
  summary: string;
  keyObjects: string[];
  reportHref: string;
}

export interface CompareAction {
  id: string;
  label: string;
  href: string;
}

export interface ComparePickerItem {
  eventId: string;
  evidenceId: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  verified: boolean;
  location: string;
}

export interface CompareViewModel {
  slots: CompareSlot[];
  scores: CompareScores;
  timeline: CompareTimeline;
  highlights: CompareHighlight[];
  ai: CompareAiInsight;
  actions: CompareAction[];
  primaryEventId: string;
}

const SLOT_LETTERS = ["A", "B", "C", "D", "E"] as const;

const UPLOADER_OVERRIDES: Record<
  string,
  { name: string; initials: string; accent: string }
> = {
  "EVT-2024-0517-0001": {
    name: "Neha Gupta",
    initials: "NG",
    accent: "#3B82F6",
  },
  eh2: { name: "Arjun Mehta", initials: "AM", accent: "#10B981" },
  eh3: { name: "Kavya Iyer", initials: "KI", accent: "#F59E0B" },
  eh4: { name: "Rohan Das", initials: "RD", accent: "#8B5CF6" },
  eh5: { name: "Priya Nair", initials: "PN", accent: "#EC4899" },
};

const TITLE_OVERRIDES: Record<string, string> = {
  "EVT-2024-0517-0001": "Protest at India Gate",
  eh2: "India Gate Protest - Angle 2",
  eh3: "Distant View - Drone",
};

const DURATION_OVERRIDES: Record<string, string> = {
  "EVT-2024-0517-0001": "0:45",
  eh2: "0:38",
  eh3: "0:59",
};

const RESOLUTION_BY_INDEX = [
  "1920×1080",
  "1920×1080",
  "3840×2160",
  "1280×720",
  "1920×1080",
];
const SIZE_BY_INDEX = ["24.2 MB", "18.6 MB", "86.4 MB", "12.1 MB", "31.0 MB"];

/** Default India Gate three-angle comparison matching the mock */
export const DEFAULT_COMPARE_IDS: CompareIdPair[] = [
  { eventId: "1", evidenceId: "EVT-2024-0517-0001" },
  { eventId: "1", evidenceId: "eh2" },
  { eventId: "1", evidenceId: "eh3" },
];

export const COMPARE_TABS: Array<{ id: CompareTabId; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "visual", label: "Visual Match" },
  { id: "location", label: "Location & Time" },
  { id: "metadata", label: "Metadata" },
  { id: "audio", label: "Audio" },
  { id: "verification", label: "Verification" },
  { id: "details", label: "Details" },
];

export function formatCompareIds(ids: CompareIdPair[]): string {
  return ids.map((p) => `${p.eventId}:${p.evidenceId}`).join(",");
}

export function parseCompareIds(
  raw: string | null | undefined
): CompareIdPair[] {
  if (!raw?.trim()) return [];
  const seen = new Set<string>();
  const out: CompareIdPair[] = [];
  for (const part of raw.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const colon = trimmed.indexOf(":");
    if (colon <= 0) continue;
    const eventId = trimmed.slice(0, colon);
    const evidenceId = decodeURIComponent(trimmed.slice(colon + 1));
    if (!eventId || !evidenceId) continue;
    const key = `${eventId}:${evidenceId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ eventId, evidenceId });
    if (out.length >= MAX_COMPARE_SLOTS) break;
  }
  return out;
}

function qualitative(percent: number): string {
  if (percent >= 90) return "Very High";
  if (percent >= 80) return "High";
  if (percent >= 65) return "Medium";
  if (percent >= 40) return "Low";
  return "Very Low";
}

function overallLabel(percent: number): string {
  if (percent >= 85) return "High Match";
  if (percent >= 70) return "Moderate Match";
  if (percent >= 50) return "Weak Match";
  return "Conflict Likely";
}

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function buildScores(ids: CompareIdPair[]): CompareScores {
  const seed = hashSeed(formatCompareIds(ids));
  const isDefault =
    ids.length === 3 &&
    ids[0]?.evidenceId === "EVT-2024-0517-0001" &&
    ids[1]?.evidenceId === "eh2" &&
    ids[2]?.evidenceId === "eh3";

  const metrics: CompareMetric[] = isDefault
    ? [
        {
          key: "visual",
          label: "Visual Similarity",
          percent: 94,
          qualitative: "Very High",
        },
        {
          key: "location",
          label: "Location Match",
          percent: 96,
          qualitative: "Very High",
        },
        {
          key: "time",
          label: "Time Consistency",
          percent: 91,
          qualitative: "High",
        },
        {
          key: "context",
          label: "Context Match",
          percent: 90,
          qualitative: "High",
        },
        {
          key: "audio",
          label: "Audio Similarity",
          percent: 72,
          qualitative: "Medium",
        },
      ]
    : (
        [
          {
            key: "visual" as const,
            label: "Visual Similarity",
            percent: 70 + (seed % 25),
          },
          {
            key: "location" as const,
            label: "Location Match",
            percent: 75 + (seed % 20),
          },
          {
            key: "time" as const,
            label: "Time Consistency",
            percent: 68 + (seed % 22),
          },
          {
            key: "context" as const,
            label: "Context Match",
            percent: 65 + (seed % 28),
          },
          {
            key: "audio" as const,
            label: "Audio Similarity",
            percent: 55 + (seed % 30),
          },
        ] as const
      ).map((m) => ({ ...m, qualitative: qualitative(m.percent) }));

  const overall = Math.round(
    metrics.reduce((sum, m) => sum + m.percent, 0) / metrics.length
  );

  return {
    overall: isDefault ? 92 : overall,
    overallLabel: isDefault ? "High Match" : overallLabel(overall),
    metrics,
  };
}

function buildTimeline(slots: CompareSlot[]): CompareTimeline {
  const tracks: CompareTimelineTrack[] = slots.map((slot, i) => {
    const base: CompareTimelinePoint[] = [
      { kind: "recording", at: 8 + i * 4 },
      { kind: "key", at: 28 + i * 6 },
      { kind: "key", at: 48 + (i % 2) * 8 },
      { kind: "recording", at: 72 + i * 3 },
    ];
    if (i === 2) base.push({ kind: "missing", at: 58 });
    return { letter: slot.letter, points: base };
  });

  return {
    axisLabels: ["11:14 AM", "11:15 AM", "11:16 AM", "11:17 AM", "11:18 AM"],
    currentAt: 48,
    currentLabel: "11:16 AM",
    tracks,
    legend: [
      { kind: "recording", label: "Recording exists" },
      { kind: "key", label: "Key moments" },
      { kind: "missing", label: "Missing segment" },
    ],
  };
}

function buildSlot(pair: CompareIdPair, index: number): CompareSlot | null {
  const detail = buildEvidenceDetail(pair.eventId, pair.evidenceId);
  if (!detail) return null;

  const uploader = UPLOADER_OVERRIDES[pair.evidenceId] ?? {
    name: detail.fileInfo.uploadedBy,
    initials: detail.fileInfo.uploadedBy
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    accent: "#3B82F6",
  };

  return {
    letter: SLOT_LETTERS[index] ?? String(index + 1),
    eventId: pair.eventId,
    evidenceId: pair.evidenceId,
    title: TITLE_OVERRIDES[pair.evidenceId] ?? detail.title,
    mediaType: "Video",
    duration: DURATION_OVERRIDES[pair.evidenceId] ?? detail.fileInfo.duration,
    uploader: uploader.name,
    uploaderInitials: uploader.initials,
    uploaderAccent: uploader.accent,
    verified: detail.status === "verified",
    thumbnailUrl: detail.thumbnailUrl,
    detailHref: evidenceDetailHref(pair.eventId, pair.evidenceId, true),
    type: detail.fileInfo.fileType || "MP4",
    resolution: RESOLUTION_BY_INDEX[index] ?? detail.fileInfo.resolution,
    fileSize: SIZE_BY_INDEX[index] ?? detail.fileInfo.size,
    uploadedAt: detail.fileInfo.uploadedAt,
    statusLabel: detail.verification.statusLabel,
  };
}

export function resolveCompareIds(ids: CompareIdPair[]): CompareIdPair[] {
  const valid = ids.filter((p) =>
    buildEvidenceDetail(p.eventId, p.evidenceId)
  );
  if (valid.length >= MIN_COMPARE_SLOTS) return valid.slice(0, MAX_COMPARE_SLOTS);
  return DEFAULT_COMPARE_IDS;
}

export function buildCompareViewModel(ids: CompareIdPair[]): CompareViewModel {
  const resolved = resolveCompareIds(ids);
  const slots = resolved
    .map((p, i) => buildSlot(p, i))
    .filter((s): s is CompareSlot => s != null);

  const scores = buildScores(resolved);
  const primaryEventId = slots[0]?.eventId ?? "1";
  const isDefaultHigh = scores.overall >= 85;

  return {
    slots,
    scores,
    timeline: buildTimeline(slots),
    highlights: isDefaultHigh
      ? [
          {
            id: "h1",
            tone: "success",
            text: "Visual landmarks and crowd layout align across all angles.",
          },
          {
            id: "h2",
            tone: "success",
            text: "Capture windows overlap between 11:14–11:18 AM.",
          },
          {
            id: "h3",
            tone: "warning",
            text: "Audio on the drone angle is distant — treat audio score with caution.",
          },
          {
            id: "h4",
            tone: "info",
            text: "Slot C is a wider drone context shot; expected lower close-up match.",
          },
        ]
      : [
          {
            id: "h1",
            tone: "info",
            text: "Compare agreement signals before merging into a single report.",
          },
          {
            id: "h2",
            tone: scores.overall >= 70 ? "success" : "warning",
            text:
              scores.overall >= 70
                ? "Partial corroboration detected across selected evidence."
                : "Low overall match — items may describe different incidents.",
          },
        ],
    ai: {
      summary: isDefaultHigh
        ? "These clips are likely from the same India Gate protest. Visual landmarks, overlapping timestamps, and shared crowd context strongly corroborate one another. Audio is weaker on the distant angle and should not alone decide authenticity."
        : "Corroboration is mixed. Review location, time, and visual tabs before attaching these items to the same event claim.",
      keyObjects: isDefaultHigh
        ? [
            "India Gate",
            "Indian Flag",
            "Crowd",
            "Banners",
            "Police Line",
            "Protest Signs",
          ]
        : ["Crowd", "Street", "Buildings"],
      reportHref: "/reports",
    },
    actions: [
      { id: "report", label: "Create Combined Report", href: "/reports" },
      {
        id: "event",
        label: "Add to Existing Event",
        href: `/events/${primaryEventId}`,
      },
      { id: "share", label: "Share Comparison", href: "#share" },
    ],
    primaryEventId,
  };
}

export function listComparableEvidence(
  preferEventId?: string
): ComparePickerItem[] {
  const fromEvent =
    preferEventId != null
      ? listEvidenceForEvent(preferEventId).map((e) => ({
          eventId: preferEventId,
          evidenceId: e.id,
          title: TITLE_OVERRIDES[e.id] ?? e.title,
          thumbnailUrl: e.thumbnailUrl,
          duration: DURATION_OVERRIDES[e.id] ?? e.duration,
          verified: e.verified,
          location: "Same event",
        }))
      : [];

  const fromExplorer = evidenceExplorerData
    .filter((item) => item.mediaType === "video")
    .map((item) => ({
      eventId: item.eventId,
      evidenceId: item.evidenceId,
      title: TITLE_OVERRIDES[item.evidenceId] ?? item.title,
      thumbnailUrl: item.thumbnailUrl,
      duration: item.duration ?? "—",
      verified: item.verified,
      location: item.location,
    }));

  const seen = new Set<string>();
  const merged: ComparePickerItem[] = [];
  for (const item of [...fromEvent, ...fromExplorer]) {
    const key = `${item.eventId}:${item.evidenceId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }
  return merged;
}

export function compareHref(ids: CompareIdPair[]): string {
  return `/evidence/compare?ids=${encodeURIComponent(formatCompareIds(ids))}`;
}
