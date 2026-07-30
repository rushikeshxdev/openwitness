/**
 * Static event data matching the dashboard mockup
 */

import { Event } from "@/types/event";

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
    timestamp: minutesBefore(3),
    isActive: true,
    badge: "live",
  },
  {
    id: "2",
    title: "Farmers Protest – Noida",
    description: "Ongoing documentation of the farmers' protest",
    location: {
      city: "Noida",
      country: "India",
      coordinates: { latitude: 28.5355, longitude: 77.391 },
    },
    thumbnailUrl: "/images/events/event2.jpg",
    evidenceCount: 318,
    verificationStatus: "verified",
    timestamp: minutesBefore(12),
    isActive: true,
    badge: "trending",
  },
  {
    id: "3",
    title: "Flood Relief – Assam",
    description: "Community-sourced flood relief documentation",
    location: {
      city: "Guwahati",
      country: "India",
      coordinates: { latitude: 26.1445, longitude: 91.7362 },
    },
    thumbnailUrl: "/images/events/event3.jpg",
    evidenceCount: 267,
    verificationStatus: "pending",
    timestamp: minutesBefore(28),
    isActive: true,
    badge: "live",
  },
  {
    id: "4",
    title: "Building Collapse – Mumbai",
    description: "Evidence preserved from structural collapse site",
    location: {
      city: "Mumbai",
      country: "India",
      coordinates: { latitude: 19.076, longitude: 72.8777 },
    },
    thumbnailUrl: "/images/events/event4.jpg",
    evidenceCount: 541,
    verificationStatus: "verified",
    timestamp: minutesBefore(45),
    isActive: false,
    badge: "trending",
  },
  {
    id: "5",
    title: "Campus Protest – Bengaluru",
    description: "Student protest documentation from campus",
    location: {
      city: "Bengaluru",
      country: "India",
      coordinates: { latitude: 12.9716, longitude: 77.5946 },
    },
    thumbnailUrl: "/images/events/event5.jpg",
    evidenceCount: 194,
    verificationStatus: "pending",
    timestamp: minutesBefore(62),
    isActive: true,
    badge: "live",
  },
];
