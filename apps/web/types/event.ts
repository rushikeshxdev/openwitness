/**
 * Event-related TypeScript interfaces
 */

export type EventCategory =
  | "protest"
  | "disaster"
  | "accident"
  | "gathering"
  | "other";

export type ExploreStatus =
  | "live"
  | "trending"
  | "verified"
  | "under_review";

export type EventRegion =
  | "asia"
  | "europe"
  | "americas"
  | "africa"
  | "oceania";

export interface Event {
  id: string;
  title: string;
  description?: string;
  location: {
    city: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  thumbnailUrl: string;
  evidenceCount: number;
  verificationStatus: "verified" | "pending" | "unverified";
  timestamp: Date;
  isActive: boolean;
  /** Optional status badge shown on landing event cards */
  badge?: "live" | "trending";
  /** Explore page fields */
  category?: EventCategory;
  status?: ExploreStatus;
  tags?: string[];
  startedAt?: Date;
  verifiedCount?: number;
  contributorCount?: number;
  region?: EventRegion;
}

export interface EvidenceItem {
  id: string;
  eventId: string;
  type: "photo" | "video" | "text";
  url?: string;
  content?: string;
  uploadedBy: string;
  timestamp: Date;
  verified: boolean;
}
