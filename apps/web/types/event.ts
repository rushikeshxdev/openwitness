/**
 * Event-related TypeScript interfaces
 * Defines the data models for events, evidence items, and related entities
 */

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
