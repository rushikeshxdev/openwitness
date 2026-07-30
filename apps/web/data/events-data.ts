/**
 * Static event data — fixed ISO timestamps (hydration-safe)
 */

import { Event } from "@/types/event";

/** Fixed reference "now" for relative time demos (stable across SSR/CSR) */
export const LANDING_REFERENCE_TIME = new Date("2026-07-30T06:00:00.000Z");

const minutesBefore = (m: number) =>
  new Date(LANDING_REFERENCE_TIME.getTime() - m * 60 * 1000);

export const activeEventsData: Event[] = [
  {
    id: "1",
    title: "CJP Protest – New Delhi",
    description: "Citizens documenting a large public demonstration",
    location: {
      city: "New Delhi",
      country: "India",
      coordinates: { latitude: 28.6139, longitude: 77.209 },
    },
    thumbnailUrl: "/images/events/event1.jpg",
    evidenceCount: 482,
    verificationStatus: "verified",
    timestamp: minutesBefore(12),
    isActive: true,
    badge: "live",
  },
  {
    id: "2",
    title: "Farmers March – Punjab",
    description: "Ongoing documentation of the farmers' march",
    location: {
      city: "Amritsar",
      country: "India",
      coordinates: { latitude: 31.634, longitude: 74.8723 },
    },
    thumbnailUrl: "/images/events/event2.jpg",
    evidenceCount: 318,
    verificationStatus: "verified",
    timestamp: minutesBefore(28),
    isActive: true,
    badge: "trending",
  },
  {
    id: "3",
    title: "Student Sit-in – Mumbai",
    description: "Campus sit-in with community-sourced evidence",
    location: {
      city: "Mumbai",
      country: "India",
      coordinates: { latitude: 19.076, longitude: 72.8777 },
    },
    thumbnailUrl: "/images/events/event3.jpg",
    evidenceCount: 156,
    verificationStatus: "pending",
    timestamp: minutesBefore(45),
    isActive: true,
    badge: "live",
  },
  {
    id: "4",
    title: "Civic Assembly – Bengaluru",
    description: "Public assembly documenting civic demands",
    location: {
      city: "Bengaluru",
      country: "India",
      coordinates: { latitude: 12.9716, longitude: 77.5946 },
    },
    thumbnailUrl: "/images/events/event4.jpg",
    evidenceCount: 209,
    verificationStatus: "verified",
    timestamp: minutesBefore(90),
    isActive: false,
    badge: "trending",
  },
  {
    id: "5",
    title: "Workers Rally – Chennai",
    description: "Labor rally with verified photo and video evidence",
    location: {
      city: "Chennai",
      country: "India",
      coordinates: { latitude: 13.0827, longitude: 80.2707 },
    },
    thumbnailUrl: "/images/events/event5.jpg",
    evidenceCount: 274,
    verificationStatus: "verified",
    timestamp: minutesBefore(120),
    isActive: false,
  },
  {
    id: "6",
    title: "Community Vigil – Kolkata",
    description: "Candlelight vigil preserved by local contributors",
    location: {
      city: "Kolkata",
      country: "India",
      coordinates: { latitude: 22.5726, longitude: 88.3639 },
    },
    thumbnailUrl: "/images/events/event6.jpg",
    evidenceCount: 141,
    verificationStatus: "pending",
    timestamp: minutesBefore(180),
    isActive: false,
  },
];
