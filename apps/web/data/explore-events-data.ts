/**
 * Static explore-events catalog for /events page
 */

import type {
  Event,
  EventCategory,
  EventRegion,
  ExploreStatus,
} from "@/types/event";
import { LANDING_REFERENCE_TIME } from "./events-data";

const hoursBefore = (h: number) =>
  new Date(LANDING_REFERENCE_TIME.getTime() - h * 60 * 60 * 1000);

const daysBefore = (d: number) => hoursBefore(d * 24);

type Seed = Omit<
  Event,
  "verificationStatus" | "isActive" | "badge" | "timestamp"
> & {
  status: ExploreStatus;
  category: EventCategory;
  region: EventRegion;
  tags: string[];
  startedAt: Date;
  verifiedCount: number;
  contributorCount: number;
  description: string;
};

function toEvent(seed: Seed): Event {
  const verificationStatus =
    seed.status === "verified"
      ? "verified"
      : seed.status === "under_review"
        ? "pending"
        : seed.status === "live"
          ? "verified"
          : "pending";

  return {
    ...seed,
    verificationStatus,
    isActive: seed.status === "live" || seed.status === "trending",
    badge:
      seed.status === "live"
        ? "live"
        : seed.status === "trending"
          ? "trending"
          : undefined,
    timestamp: seed.startedAt,
  };
}

const seeds: Seed[] = [
  {
    id: "1",
    title: "CJP Protest – New Delhi",
    description:
      "Citizens documenting a large public demonstration calling for justice and transparency across the capital.",
    location: {
      city: "New Delhi",
      country: "India",
      coordinates: { latitude: 28.6139, longitude: 77.209 },
    },
    thumbnailUrl: "/images/events/event1.jpg",
    evidenceCount: 482,
    category: "protest",
    status: "live",
    region: "asia",
    tags: ["democracy", "students", "justice"],
    startedAt: daysBefore(2),
    verifiedCount: 312,
    contributorCount: 86,
  },
  {
    id: "2",
    title: "Farmers Protest – Noida",
    description:
      "Ongoing documentation of the farmers' protest with community-sourced photos and verified video clips.",
    location: {
      city: "Noida",
      country: "India",
      coordinates: { latitude: 28.5355, longitude: 77.391 },
    },
    thumbnailUrl: "/images/events/event2.jpg",
    evidenceCount: 318,
    category: "protest",
    status: "trending",
    region: "asia",
    tags: ["farmers", "rights", "agriculture"],
    startedAt: daysBefore(5),
    verifiedCount: 201,
    contributorCount: 54,
  },
  {
    id: "3",
    title: "Flood Relief – Assam",
    description:
      "Community-sourced flood relief documentation from affected districts as waters continue to rise.",
    location: {
      city: "Guwahati",
      country: "India",
      coordinates: { latitude: 26.1445, longitude: 91.7362 },
    },
    thumbnailUrl: "/images/events/event3.jpg",
    evidenceCount: 267,
    category: "disaster",
    status: "live",
    region: "asia",
    tags: ["flood", "relief", "climate"],
    startedAt: daysBefore(1),
    verifiedCount: 98,
    contributorCount: 41,
  },
  {
    id: "4",
    title: "Building Collapse – Mumbai",
    description:
      "Evidence preserved from a structural collapse site including eyewitness accounts and site photos.",
    location: {
      city: "Mumbai",
      country: "India",
      coordinates: { latitude: 19.076, longitude: 72.8777 },
    },
    thumbnailUrl: "/images/events/event4.jpg",
    evidenceCount: 541,
    category: "accident",
    status: "verified",
    region: "asia",
    tags: ["accident", "infrastructure", "safety"],
    startedAt: daysBefore(8),
    verifiedCount: 480,
    contributorCount: 72,
  },
  {
    id: "5",
    title: "Campus Protest – Bengaluru",
    description:
      "Student protest documentation from campus highlighting education policy concerns.",
    location: {
      city: "Bengaluru",
      country: "India",
      coordinates: { latitude: 12.9716, longitude: 77.5946 },
    },
    thumbnailUrl: "/images/events/event5.jpg",
    evidenceCount: 194,
    category: "protest",
    status: "under_review",
    region: "asia",
    tags: ["students", "education", "campus"],
    startedAt: daysBefore(3),
    verifiedCount: 44,
    contributorCount: 29,
  },
  {
    id: "6",
    title: "Climate March – London",
    description:
      "Thousands gathered for a climate action march through central London with coordinated documentation.",
    location: {
      city: "London",
      country: "United Kingdom",
      coordinates: { latitude: 51.5074, longitude: -0.1278 },
    },
    thumbnailUrl: "/images/events/event6.jpg",
    evidenceCount: 612,
    category: "gathering",
    status: "trending",
    region: "europe",
    tags: ["climate", "march", "democracy"],
    startedAt: daysBefore(4),
    verifiedCount: 390,
    contributorCount: 112,
  },
  {
    id: "7",
    title: "Wildfire Response – California",
    description:
      "Volunteer and first-responder documentation from active wildfire containment zones.",
    location: {
      city: "Los Angeles",
      country: "United States",
      coordinates: { latitude: 34.0522, longitude: -118.2437 },
    },
    thumbnailUrl: "/images/events/event1.jpg",
    evidenceCount: 890,
    category: "disaster",
    status: "live",
    region: "americas",
    tags: ["wildfire", "relief", "climate"],
    startedAt: hoursBefore(18),
    verifiedCount: 210,
    contributorCount: 95,
  },
  {
    id: "8",
    title: "Transit Strike – Paris",
    description:
      "Public transit strike documentation including station closures and crowd conditions.",
    location: {
      city: "Paris",
      country: "France",
      coordinates: { latitude: 48.8566, longitude: 2.3522 },
    },
    thumbnailUrl: "/images/events/event2.jpg",
    evidenceCount: 156,
    category: "protest",
    status: "verified",
    region: "europe",
    tags: ["labor", "transit", "strike"],
    startedAt: daysBefore(6),
    verifiedCount: 140,
    contributorCount: 38,
  },
  {
    id: "9",
    title: "Earthquake Aftermath – Jakarta",
    description:
      "Post-quake structural damage and community response evidence from affected neighborhoods.",
    location: {
      city: "Jakarta",
      country: "Indonesia",
      coordinates: { latitude: -6.2088, longitude: 106.8456 },
    },
    thumbnailUrl: "/images/events/event3.jpg",
    evidenceCount: 734,
    category: "disaster",
    status: "trending",
    region: "asia",
    tags: ["earthquake", "relief", "infrastructure"],
    startedAt: daysBefore(2),
    verifiedCount: 305,
    contributorCount: 128,
  },
  {
    id: "10",
    title: "Highway Pileup – São Paulo",
    description:
      "Multi-vehicle accident documentation from emergency responders and nearby witnesses.",
    location: {
      city: "São Paulo",
      country: "Brazil",
      coordinates: { latitude: -23.5505, longitude: -46.6333 },
    },
    thumbnailUrl: "/images/events/event4.jpg",
    evidenceCount: 88,
    category: "accident",
    status: "under_review",
    region: "americas",
    tags: ["accident", "traffic", "safety"],
    startedAt: hoursBefore(30),
    verifiedCount: 12,
    contributorCount: 19,
  },
  {
    id: "11",
    title: "Memorial Gathering – Cape Town",
    description:
      "Community memorial gathering with peaceful vigil documentation and speeches.",
    location: {
      city: "Cape Town",
      country: "South Africa",
      coordinates: { latitude: -33.9249, longitude: 18.4241 },
    },
    thumbnailUrl: "/images/events/event5.jpg",
    evidenceCount: 221,
    category: "gathering",
    status: "verified",
    region: "africa",
    tags: ["memorial", "community", "vigil"],
    startedAt: daysBefore(7),
    verifiedCount: 198,
    contributorCount: 47,
  },
  {
    id: "12",
    title: "Port Blockade – Sydney",
    description:
      "Industrial action at the harbor with worker statements and timeline of disruptions.",
    location: {
      city: "Sydney",
      country: "Australia",
      coordinates: { latitude: -33.8688, longitude: 151.2093 },
    },
    thumbnailUrl: "/images/events/event6.jpg",
    evidenceCount: 143,
    category: "protest",
    status: "live",
    region: "oceania",
    tags: ["labor", "port", "blockade"],
    startedAt: hoursBefore(12),
    verifiedCount: 56,
    contributorCount: 33,
  },
  {
    id: "13",
    title: "River Flooding – Dhaka",
    description:
      "Seasonal flooding evidence from riverside communities and rescue operations.",
    location: {
      city: "Dhaka",
      country: "Bangladesh",
      coordinates: { latitude: 23.8103, longitude: 90.4125 },
    },
    thumbnailUrl: "/images/events/event3.jpg",
    evidenceCount: 405,
    category: "disaster",
    status: "under_review",
    region: "asia",
    tags: ["flood", "climate", "relief"],
    startedAt: daysBefore(3),
    verifiedCount: 67,
    contributorCount: 52,
  },
  {
    id: "14",
    title: "Civic Forum – Berlin",
    description:
      "Public forum on civic tech and open data with speaker recordings and notes.",
    location: {
      city: "Berlin",
      country: "Germany",
      coordinates: { latitude: 52.52, longitude: 13.405 },
    },
    thumbnailUrl: "/images/events/event1.jpg",
    evidenceCount: 76,
    category: "gathering",
    status: "verified",
    region: "europe",
    tags: ["civic", "opendata", "forum"],
    startedAt: daysBefore(10),
    verifiedCount: 70,
    contributorCount: 24,
  },
  {
    id: "15",
    title: "Factory Fire – Lagos",
    description:
      "Industrial fire incident with evacuation timelines and environmental impact notes.",
    location: {
      city: "Lagos",
      country: "Nigeria",
      coordinates: { latitude: 6.5244, longitude: 3.3792 },
    },
    thumbnailUrl: "/images/events/event4.jpg",
    evidenceCount: 298,
    category: "accident",
    status: "trending",
    region: "africa",
    tags: ["fire", "industrial", "safety"],
    startedAt: daysBefore(1),
    verifiedCount: 101,
    contributorCount: 61,
  },
  {
    id: "16",
    title: "Housing Rally – Toronto",
    description:
      "Housing affordability rally with chants, speeches, and route documentation.",
    location: {
      city: "Toronto",
      country: "Canada",
      coordinates: { latitude: 43.6532, longitude: -79.3832 },
    },
    thumbnailUrl: "/images/events/event2.jpg",
    evidenceCount: 167,
    category: "protest",
    status: "live",
    region: "americas",
    tags: ["housing", "rally", "democracy"],
    startedAt: hoursBefore(40),
    verifiedCount: 88,
    contributorCount: 45,
  },
  {
    id: "17",
    title: "Cyclone Prep – Manila",
    description:
      "Pre-landfall cyclone preparedness documentation from coastal barangays.",
    location: {
      city: "Manila",
      country: "Philippines",
      coordinates: { latitude: 14.5995, longitude: 120.9842 },
    },
    thumbnailUrl: "/images/events/event5.jpg",
    evidenceCount: 352,
    category: "disaster",
    status: "live",
    region: "asia",
    tags: ["cyclone", "prep", "climate"],
    startedAt: hoursBefore(8),
    verifiedCount: 120,
    contributorCount: 58,
  },
  {
    id: "18",
    title: "Art Fair Gathering – Tokyo",
    description:
      "Open-air cultural gathering with artist installations and visitor documentation.",
    location: {
      city: "Tokyo",
      country: "Japan",
      coordinates: { latitude: 35.6762, longitude: 139.6503 },
    },
    thumbnailUrl: "/images/events/event6.jpg",
    evidenceCount: 119,
    category: "other",
    status: "verified",
    region: "asia",
    tags: ["culture", "art", "community"],
    startedAt: daysBefore(9),
    verifiedCount: 110,
    contributorCount: 31,
  },
  {
    id: "19",
    title: "Bridge Inspection – Chicago",
    description:
      "Emergency structural inspection after reported cracks; photos and engineer notes.",
    location: {
      city: "Chicago",
      country: "United States",
      coordinates: { latitude: 41.8781, longitude: -87.6298 },
    },
    thumbnailUrl: "/images/events/event4.jpg",
    evidenceCount: 64,
    category: "accident",
    status: "under_review",
    region: "americas",
    tags: ["infrastructure", "safety", "inspection"],
    startedAt: daysBefore(4),
    verifiedCount: 9,
    contributorCount: 14,
  },
  {
    id: "20",
    title: "Election Watch – Nairobi",
    description:
      "Citizen election observation notes and polling-station atmosphere documentation.",
    location: {
      city: "Nairobi",
      country: "Kenya",
      coordinates: { latitude: -1.2921, longitude: 36.8219 },
    },
    thumbnailUrl: "/images/events/event1.jpg",
    evidenceCount: 528,
    category: "other",
    status: "trending",
    region: "africa",
    tags: ["election", "democracy", "observation"],
    startedAt: daysBefore(2),
    verifiedCount: 260,
    contributorCount: 97,
  },
];

export const exploreEventsData: Event[] = seeds.map(toEvent);

export const EXPLORE_PAGE_SIZE = 5;

export const exploreMapStats = {
  activeEvents: 248,
  cities: 97,
  countries: 23,
} as const;

export function getStatusCounts(events: Event[] = exploreEventsData) {
  const counts: Record<ExploreStatus, number> = {
    live: 0,
    trending: 0,
    verified: 0,
    under_review: 0,
  };
  for (const e of events) {
    if (e.status) counts[e.status] += 1;
  }
  return counts;
}

export function getTrendingEvents(events: Event[] = exploreEventsData, limit = 3) {
  return [...events]
    .filter((e) => e.status === "trending" || e.status === "live")
    .sort((a, b) => b.evidenceCount - a.evidenceCount)
    .slice(0, limit);
}

export function getPopularTags(events: Event[] = exploreEventsData, limit = 12) {
  const map = new Map<string, number>();
  for (const e of events) {
    for (const tag of e.tags ?? []) {
      map.set(tag, (map.get(tag) ?? 0) + (e.evidenceCount > 200 ? 3 : 1) * 40);
    }
  }
  // Boost mockup-like magnitudes
  const boost: Record<string, number> = {
    democracy: 1243,
    climate: 986,
    students: 754,
    flood: 612,
    relief: 540,
    farmers: 488,
    safety: 421,
    labor: 390,
  };
  for (const [k, v] of Object.entries(boost)) {
    if (map.has(k)) map.set(k, v);
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getCountriesForRegion(
  region: EventRegion | "all",
  events: Event[] = exploreEventsData
): string[] {
  const set = new Set<string>();
  for (const e of events) {
    if (region === "all" || e.region === region) {
      set.add(e.location.country);
    }
  }
  return [...set].sort();
}

export function getEventById(id: string): Event | undefined {
  return exploreEventsData.find((e) => e.id === id);
}

export const REGION_OPTIONS: { value: EventRegion | "all"; label: string }[] = [
  { value: "all", label: "All Regions" },
  { value: "asia", label: "Asia" },
  { value: "europe", label: "Europe" },
  { value: "americas", label: "Americas" },
  { value: "africa", label: "Africa" },
  { value: "oceania", label: "Oceania" },
];

export const DATE_RANGE_OPTIONS = [
  { value: "any", label: "Any Time" },
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
] as const;

export type DateRangeValue = (typeof DATE_RANGE_OPTIONS)[number]["value"];
