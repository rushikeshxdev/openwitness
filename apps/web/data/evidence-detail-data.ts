/**
 * Evidence file detail payloads for /events/[id]/evidence/[evidenceId]
 * Built dynamically from event + evidence highlight catalogs.
 */

import { getEventById, exploreEventsData } from "./explore-events-data";
import { buildEventDetail, getAllEventDetailIds } from "./event-detail-data";
import type { Event } from "@/types/event";

export type EvidenceNavSection =
  | "details"
  | "verifications"
  | "timeline"
  | "location"
  | "related"
  | "reports"
  | "comments"
  | "history";

export type EvidenceContentTab =
  | "description"
  | "context"
  | "metadata"
  | "verifications"
  | "comments";

export type EvidenceStatus = "verified" | "pending" | "unverified";

export interface EvidenceComment {
  id: string;
  author: string;
  initials: string;
  color: string;
  body: string;
  timeLabel: string;
}

export interface EvidenceFileInfo {
  fileId: string;
  fileType: string;
  duration: string;
  size: string;
  resolution: string;
  uploadedBy: string;
  uploadedAt: string;
  sourceDevice: string;
}

export interface EvidenceFilmstripFrame {
  id: string;
  timeLabel: string;
  thumbnailUrl: string;
  seconds: number;
}

export interface EvidenceRelatedItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  typeLabel: string;
  duration: string;
  verified: boolean;
}

export interface EvidenceVerifier {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface EvidenceDetailViewModel {
  id: string;
  eventId: string;
  eventTitle: string;
  title: string;
  status: EvidenceStatus;
  capturedAtLabel: string;
  locationLabel: string;
  sourceLabel: string;
  mediaTypeLabel: string;
  thumbnailUrl: string;
  mapThumbnailUrl: string;
  currentTimeSeconds: number;
  durationSeconds: number;
  description: string;
  context: string;
  tags: string[];
  notes: string;
  fileInfo: EvidenceFileInfo;
  navCounts: Record<
    Exclude<EvidenceNavSection, "details" | "verifications" | "location">,
    number
  >;
  filmstrip: EvidenceFilmstripFrame[];
  verification: {
    statusLabel: string;
    verifiedAtLabel: string;
    communityLabel: string;
    extraCount: number;
    verifiers: EvidenceVerifier[];
  };
  location: {
    placeName: string;
    coordinatesLabel: string;
    address: string;
    accuracyMeters: number;
    mapPinX: number;
    mapPinY: number;
  };
  related: EvidenceRelatedItem[];
  comments: EvidenceComment[];
  integrityMessage: string;
}

const PRIMARY_ID = "EVT-2024-0517-0001";

const VERIFIER_PALETTE = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
] as const;

const DEVICE_POOL = [
  "iPhone 14 Pro",
  "Pixel 8",
  "Samsung Galaxy S23",
  "iPhone 13",
  "OnePlus 11",
] as const;

const FILMSTRIP_INTERVAL_SEC = 20;

function parseDurationToSeconds(duration: string): number {
  const parts = duration.split(":").map((p) => Number(p));
  if (parts.some((n) => Number.isNaN(n))) return 83;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 83;
}

export function formatTimecode(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h || 1;
}

function formatCoords(lat: number, lng: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lng).toFixed(4)}° ${ew}`;
}

function buildFilmstrip(
  durationSeconds: number,
  thumbs: string[],
  evidenceId: string
): EvidenceFilmstripFrame[] {
  const frames: EvidenceFilmstripFrame[] = [];
  const last = Math.max(0, durationSeconds - 3);

  for (
    let seconds = 0, i = 0;
    seconds <= last;
    seconds += FILMSTRIP_INTERVAL_SEC, i++
  ) {
    frames.push({
      id: `${evidenceId}-f${i}`,
      timeLabel: formatTimecode(seconds),
      thumbnailUrl: thumbs[i % thumbs.length],
      seconds,
    });
    if (frames.length >= 8) break;
  }

  if (frames.length === 0) {
    frames.push({
      id: `${evidenceId}-f0`,
      timeLabel: "00:00",
      thumbnailUrl: thumbs[0],
      seconds: 0,
    });
  }

  return frames;
}

function buildVerifiers(seed: number, count = 4): EvidenceVerifier[] {
  const names = [
    ["Asha K.", "AK"],
    ["Rohan M.", "RM"],
    ["Priya S.", "PS"],
    ["Dev N.", "DN"],
    ["Maya L.", "ML"],
    ["Omar H.", "OH"],
  ];
  return Array.from({ length: count }, (_, i) => {
    const [name, initials] = names[(seed + i) % names.length];
    return {
      id: `v${i + 1}`,
      name,
      initials,
      color: VERIFIER_PALETTE[(seed + i) % VERIFIER_PALETTE.length],
    };
  });
}

type EvidenceSeed = {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  verified: boolean;
  relativeLabel?: string;
};

const EVENT_EVIDENCE_OVERRIDES: Record<string, EvidenceSeed[]> = {
  "1": [
    {
      id: PRIMARY_ID,
      title: "Protest at India Gate",
      thumbnailUrl: "/images/hero-bg.png",
      duration: "01:23",
      verified: true,
      relativeLabel: "3m ago",
    },
    {
      id: "eh2",
      title: "Student Speeches",
      thumbnailUrl: "/images/events/event2.jpg",
      duration: "00:54",
      verified: true,
    },
    {
      id: "eh3",
      title: "Crowd near India Gate",
      thumbnailUrl: "/images/events/event5.jpg",
      duration: "02:01",
      verified: true,
    },
    {
      id: "eh4",
      title: "Police Deployment",
      thumbnailUrl: "/images/events/event4.jpg",
      duration: "01:12",
      verified: true,
    },
    {
      id: "eh5",
      title: "Crowd density overview",
      thumbnailUrl: "/images/events/event3.jpg",
      duration: "00:41",
      verified: true,
    },
  ],
};

export function listEvidenceForEvent(eventId: string): EvidenceSeed[] {
  const override = EVENT_EVIDENCE_OVERRIDES[eventId];
  if (override) return override;

  const detail = buildEventDetail(eventId);
  if (!detail) return [];
  return detail.evidenceHighlights.map((h) => ({
    id: h.id,
    title: h.title,
    thumbnailUrl: h.thumbnailUrl,
    duration: h.duration,
    verified: h.verified,
    relativeLabel: h.relativeLabel,
  }));
}

function resolveEvidence(
  eventId: string,
  evidenceId: string
): EvidenceSeed | null {
  const list = listEvidenceForEvent(eventId);
  return (
    list.find(
      (e) =>
        e.id === evidenceId || (evidenceId === "eh1" && e.id === PRIMARY_ID)
    ) ?? null
  );
}

function buildViewModel(
  event: Event,
  evidence: EvidenceSeed
): EvidenceDetailViewModel {
  const seed = hashSeed(`${event.id}:${evidence.id}`);
  const durationSeconds = parseDurationToSeconds(evidence.duration);
  const previewSeconds = Math.min(
    Math.floor(durationSeconds * 0.4),
    Math.max(0, durationSeconds - 1)
  );
  const coords = event.location.coordinates ?? {
    latitude: 28.6129,
    longitude: 77.2295,
  };
  const placeName =
    event.id === "1" && evidence.id === PRIMARY_ID
      ? "India Gate"
      : event.location.city;
  const locationLabel =
    event.id === "1" && evidence.id === PRIMARY_ID
      ? "India Gate, New Delhi"
      : `${event.location.city}, ${event.location.country}`;

  const thumbs = [
    evidence.thumbnailUrl,
    "/images/events/event1.jpg",
    "/images/events/event5.jpg",
    "/images/events/event2.jpg",
    "/images/events/event4.jpg",
    "/images/events/event3.jpg",
  ];

  const catalog = listEvidenceForEvent(event.id);
  const related = catalog
    .filter((item) => item.id !== evidence.id)
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      title: item.title,
      thumbnailUrl: item.thumbnailUrl,
      typeLabel: "Video",
      duration: item.duration,
      verified: item.verified,
    }));

  const status: EvidenceStatus = evidence.verified
    ? "verified"
    : event.verificationStatus === "unverified"
      ? "unverified"
      : "pending";

  const tags = Array.from(
    new Set([
      ...(event.tags ?? []).map(
        (t) => t.charAt(0).toUpperCase() + t.slice(1)
      ),
      event.category
        ? event.category.charAt(0).toUpperCase() + event.category.slice(1)
        : "Evidence",
      event.location.city,
      placeName,
    ])
  ).slice(0, 8);

  const sizeMb = (8 + (seed % 40) + durationSeconds / 10).toFixed(1);
  const uploadedHour = 12 + (seed % 6);
  const uploadedMin = String((seed * 7) % 60).padStart(2, "0");

  return {
    id: evidence.id,
    eventId: event.id,
    eventTitle: event.title.replace(/\u2013|\u2014/g, "-"),
    title: evidence.title,
    status,
    capturedAtLabel: "May 17, 2024 · 12:00 PM",
    locationLabel,
    sourceLabel: "OpenWitness Community",
    mediaTypeLabel: "Video",
    thumbnailUrl: evidence.thumbnailUrl,
    mapThumbnailUrl: thumbs[1] ?? evidence.thumbnailUrl,
    currentTimeSeconds: previewSeconds,
    durationSeconds,
    description: `${evidence.title} — community-submitted footage from ${event.location.city}. The recording documents activity around ${placeName} during ${event.title}.`,
    context: `Captured as part of ongoing documentation for ${event.title}. Corroborates on-ground reports near ${placeName} and supports timeline reconstruction for this event.`,
    tags,
    notes: `Field notes for ${evidence.id}. Review audio clarity and cross-check with related angles before including in reports.`,
    fileInfo: {
      fileId: evidence.id.toUpperCase().startsWith("EVT")
        ? evidence.id
        : `EVT-${event.id}-${evidence.id.toUpperCase()}`,
      fileType: "Video (MP4)",
      duration: evidence.duration,
      size: `${sizeMb} MB`,
      resolution: seed % 2 === 0 ? "1920 × 1080" : "1280 × 720",
      uploadedBy: seed % 3 === 0 ? "Citizen Reporter" : "Field Contributor",
      uploadedAt: `May 17, 2024 · ${uploadedHour}:${uploadedMin} PM`,
      sourceDevice: DEVICE_POOL[seed % DEVICE_POOL.length],
    },
    navCounts: {
      timeline: 8 + (seed % 10),
      related: Math.max(related.length, catalog.length - 1),
      reports: 1 + (seed % 5),
      comments: 6 + (seed % 30),
      history: 2 + (seed % 8),
    },
    filmstrip: buildFilmstrip(durationSeconds, thumbs, evidence.id),
    verification: {
      statusLabel:
        status === "verified"
          ? "Verified"
          : status === "pending"
            ? "Pending review"
            : "Unverified",
      verifiedAtLabel:
        status === "verified"
          ? "Verified on May 17, 2024 at 2:30 PM"
          : "Awaiting community verification",
      communityLabel: "OpenWitness Community",
      extraCount: status === "verified" ? 8 + (seed % 20) : 0,
      verifiers: status === "verified" ? buildVerifiers(seed) : [],
    },
    location: {
      placeName,
      coordinatesLabel: formatCoords(coords.latitude, coords.longitude),
      address: `${placeName}, ${event.location.city}, ${event.location.country}`,
      accuracyMeters: 10 + (seed % 25),
      mapPinX: 45 + (seed % 20),
      mapPinY: 40 + (seed % 20),
    },
    related,
    comments: [
      {
        id: `c1-${evidence.id}`,
        author: "Priya S.",
        initials: "PS",
        color: "#8B5CF6",
        body: "Matches other angles from the same corridor around this timestamp.",
        timeLabel: "2h ago",
      },
      {
        id: `c2-${evidence.id}`,
        author: "Rohan M.",
        initials: "RM",
        color: "#10B981",
        body: "Audio is clear enough to identify chants — useful for timeline notes.",
        timeLabel: "5h ago",
      },
      {
        id: `c3-${evidence.id}`,
        author: "Maya L.",
        initials: "ML",
        color: "#F59E0B",
        body: "Can we cross-check the placard text with stills in related evidence?",
        timeLabel: "1d ago",
      },
    ],
    integrityMessage:
      "This file is hashed and integrity-protected. Any modification will invalidate the cryptographic signature.",
  };
}

function applyPrimaryDemoPolish(
  model: EvidenceDetailViewModel
): EvidenceDetailViewModel {
  if (model.eventId !== "1" || model.id !== PRIMARY_ID) return model;

  return {
    ...model,
    description:
      "Video footage capturing the gathering of protesters at India Gate during the CJP protest. The crowd is peaceful and includes students, activists, and citizens holding placards calling for justice and transparency.",
    context:
      "Captured during the march toward India Gate as part of CJP Protest - New Delhi. Corroborates crowd size estimates and confirms a peaceful assembly near the eastern approach.",
    notes:
      "This footage was captured from the eastern side of India Gate. Audio quality is clear; crowd chants are audible throughout. Multiple camera angles available in related evidence.",
    tags: [
      "Protest",
      "CJP Decision",
      "Students",
      "India Gate",
      "New Delhi",
      "Peaceful",
    ],
    currentTimeSeconds: 34,
    durationSeconds: 83,
    location: {
      ...model.location,
      placeName: "India Gate",
      coordinatesLabel: "28.6129° N, 77.2295° E",
      address: "Rajpath, India Gate, New Delhi, Delhi 110001, India",
      accuracyMeters: 15,
      mapPinX: 58,
      mapPinY: 48,
    },
    fileInfo: {
      ...model.fileInfo,
      fileId: PRIMARY_ID,
      size: "24.8 MB",
      resolution: "1920 × 1080",
      uploadedBy: "Citizen Reporter",
      uploadedAt: "May 17, 2024 · 12:45 PM",
      sourceDevice: "iPhone 14 Pro",
    },
    navCounts: {
      timeline: 12,
      related: 8,
      reports: 3,
      comments: 24,
      history: 6,
    },
  };
}

export function buildEvidenceDetail(
  eventId: string,
  evidenceId: string
): EvidenceDetailViewModel | null {
  const event = getEventById(eventId);
  if (!event) return null;

  const evidence = resolveEvidence(eventId, evidenceId);
  if (!evidence) return null;

  return applyPrimaryDemoPolish(buildViewModel(event, evidence));
}

export function getEvidenceStaticParams(): {
  id: string;
  evidenceId: string;
}[] {
  const seen = new Set<string>();
  const params: { id: string; evidenceId: string }[] = [];

  const push = (id: string, evidenceId: string) => {
    const key = `${id}:${evidenceId}`;
    if (seen.has(key)) return;
    seen.add(key);
    params.push({ id, evidenceId });
  };

  for (const eventId of getAllEventDetailIds()) {
    for (const evidence of listEvidenceForEvent(eventId)) {
      push(eventId, evidence.id);
    }
  }

  for (const event of exploreEventsData) {
    const detail = buildEventDetail(event.id);
    if (!detail) continue;
    for (const h of detail.evidenceHighlights) {
      push(event.id, h.id);
    }
  }

  return params;
}

export { PRIMARY_ID as EVIDENCE_PRIMARY_ID };
