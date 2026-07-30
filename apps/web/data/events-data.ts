/**
 * Static data for Active Events section
 * Contains sample events for the landing page
 */

import { Event } from "@/types/event";

export const activeEventsData: Event[] = [
  {
    id: "1",
    title: "Climate Action Rally - Downtown Seattle",
    description: "Thousands gather for climate awareness march",
    location: {
      city: "Seattle",
      country: "USA",
      coordinates: {
        latitude: 47.6062,
        longitude: -122.3321,
      },
    },
    thumbnailUrl: "/images/events/event1.jpg",
    evidenceCount: 247,
    verificationStatus: "verified",
    timestamp: new Date("2024-01-15T10:30:00"),
    isActive: true,
  },
  {
    id: "2",
    title: "Peaceful Protest for Human Rights",
    description: "Community members advocate for equality",
    location: {
      city: "London",
      country: "UK",
      coordinates: {
        latitude: 51.5074,
        longitude: -0.1278,
      },
    },
    thumbnailUrl: "/images/events/event2.jpg",
    evidenceCount: 392,
    verificationStatus: "verified",
    timestamp: new Date("2024-01-15T14:20:00"),
    isActive: true,
  },
  {
    id: "3",
    title: "Community Support Event - Aid Distribution",
    description: "Local volunteers distribute essential supplies",
    location: {
      city: "Tokyo",
      country: "Japan",
      coordinates: {
        latitude: 35.6762,
        longitude: 139.6503,
      },
    },
    thumbnailUrl: "/images/events/event3.jpg",
    evidenceCount: 156,
    verificationStatus: "pending",
    timestamp: new Date("2024-01-15T08:45:00"),
    isActive: false,
  },
  {
    id: "4",
    title: "Cultural Heritage Preservation March",
    description: "Citizens rally to protect historic sites",
    location: {
      city: "Paris",
      country: "France",
      coordinates: {
        latitude: 48.8566,
        longitude: 2.3522,
      },
    },
    thumbnailUrl: "/images/events/event4.jpg",
    evidenceCount: 189,
    verificationStatus: "verified",
    timestamp: new Date("2024-01-14T16:00:00"),
    isActive: false,
  },
  {
    id: "5",
    title: "Education Reform Assembly",
    description: "Students and teachers unite for policy change",
    location: {
      city: "Sydney",
      country: "Australia",
      coordinates: {
        latitude: -33.8688,
        longitude: 151.2093,
      },
    },
    thumbnailUrl: "/images/events/event5.jpg",
    evidenceCount: 98,
    verificationStatus: "pending",
    timestamp: new Date("2024-01-14T11:30:00"),
    isActive: false,
  },
  {
    id: "6",
    title: "Workers' Rights Demonstration",
    description: "Labor unions gather for fair wage demands",
    location: {
      city: "Berlin",
      country: "Germany",
      coordinates: {
        latitude: 52.52,
        longitude: 13.405,
      },
    },
    thumbnailUrl: "/images/events/event6.jpg",
    evidenceCount: 321,
    verificationStatus: "verified",
    timestamp: new Date("2024-01-13T13:00:00"),
    isActive: false,
  },
];
