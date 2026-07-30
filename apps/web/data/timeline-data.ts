/**
 * Timeline data with typed activity metadata and fixed timestamps
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
      metadata: { evidenceCount: number };
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
    eventName: "Farmers March – Punjab",
    activityType: "event_created",
    summary: "New event created: Farmers March – Punjab",
    metadata: {},
  },
  {
    id: "tl-4",
    timestamp: minutesBefore(22),
    eventName: "Student Sit-in – Mumbai",
    activityType: "evidence_added",
    summary: "Photo evidence uploaded to Student Sit-in – Mumbai",
    metadata: { evidenceCount: 4 },
  },
  {
    id: "tl-5",
    timestamp: minutesBefore(36),
    eventName: "Hyderabad Assembly",
    activityType: "verification_updated",
    summary: "Evidence flagged in Hyderabad Assembly",
    metadata: { verificationStatus: "pending" },
  },
  {
    id: "tl-6",
    timestamp: minutesBefore(48),
    eventName: "Workers Rally – Chennai",
    activityType: "evidence_added",
    summary: "Video evidence added to Workers Rally – Chennai",
    metadata: { evidenceCount: 7 },
  },
];

export const recentTimelineData = timelineData.slice(0, 5);
