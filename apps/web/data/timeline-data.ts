/**
 * Timeline data matching the dashboard mockup
 */

import { LANDING_REFERENCE_TIME } from "./events-data";

export type TimelineActivityType =
  | "evidence_added"
  | "event_created"
  | "verification_updated";

export interface TimelineEntryBase {
  id: string;
  timestamp: Date;
  eventName: string;
  summary: string;
}

export type TimelineEntry =
  | (TimelineEntryBase & {
      activityType: "evidence_added";
      metadata: { evidenceCount?: number; flagged?: boolean };
    })
  | (TimelineEntryBase & {
      activityType: "event_created";
      metadata: Record<string, never>;
    })
  | (TimelineEntryBase & {
      activityType: "verification_updated";
      metadata: { verificationStatus: "verified" | "pending" | "unverified" };
    });

const minutesBefore = (m: number) =>
  new Date(LANDING_REFERENCE_TIME.getTime() - m * 60 * 1000);

export const timelineData: TimelineEntry[] = [
  {
    id: "tl-1",
    timestamp: minutesBefore(3),
    eventName: "CJP Protest – New Delhi",
    activityType: "evidence_added",
    summary: "New evidence added to CJP Protest – New Delhi",
    metadata: { evidenceCount: 12 },
  },
  {
    id: "tl-2",
    timestamp: minutesBefore(8),
    eventName: "Pune, Maharashtra",
    activityType: "verification_updated",
    summary: "Verified incident in Pune, Maharashtra",
    metadata: { verificationStatus: "verified" },
  },
  {
    id: "tl-3",
    timestamp: minutesBefore(15),
    eventName: "Lucknow, Uttar Pradesh",
    activityType: "event_created",
    summary: "New event trending in Lucknow, Uttar Pradesh",
    metadata: {},
  },
  {
    id: "tl-4",
    timestamp: minutesBefore(22),
    eventName: "Hyderabad, Telangana",
    activityType: "evidence_added",
    summary: "Evidence flagged in Hyderabad, Telangana",
    metadata: { flagged: true },
  },
];

export const recentTimelineData = timelineData;
