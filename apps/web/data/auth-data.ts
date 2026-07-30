/**
 * Copy and options for /login and /register
 */

export const AUTH_BG_IMAGE = "/images/hero-bg.png";

export const loginBrand = {
  quote: "Truth is stronger when it's witnessed together.",
  headlineBefore: "Document. Verify. Make truth ",
  headlineAccent: "unignorable.",
  description:
    "OpenWitness is a global platform for real-time documentation and verification of events that shape our world.",
  callout: "By the community. For the truth. Open, transparent, and accountable.",
} as const;

export const registerBrand = {
  headlineBefore: "Welcome to ",
  headlineAccent: "OpenWitness",
  description:
    "Join a global community working towards truth, transparency, and accountability.",
  quote: "In a world of noise, be a witness that matters.",
  features: [
    {
      id: "document",
      title: "Document",
      body: "Capture and upload real-time evidence from anywhere.",
    },
    {
      id: "verify",
      title: "Verify",
      body: "Community-powered verification ensures authenticity.",
    },
    {
      id: "impact",
      title: "Make Impact",
      body: "Your contribution helps build a transparent and informed world.",
    },
  ],
} as const;

export const authStats = [
  { id: "countries", value: "190+", label: "Countries", icon: "globe" as const },
  { id: "events", value: "48K+", label: "Active Events", icon: "calendar" as const },
  { id: "evidence", value: "2.3M+", label: "Evidence Items", icon: "video" as const },
  { id: "contributors", value: "125K+", label: "Contributors", icon: "users" as const },
] as const;

export type UserRoleId =
  | "citizen"
  | "journalist"
  | "researcher"
  | "organization"
  | "volunteer"
  | "other";

export const userRoles: {
  id: UserRoleId;
  title: string;
  description: string;
  accent: string;
}[] = [
  {
    id: "citizen",
    title: "Citizen",
    description: "I want to report events and contribute evidence.",
    accent: "bg-violet-500/20 text-violet-300",
  },
  {
    id: "journalist",
    title: "Journalist",
    description: "I'm here to cover stories and share verified reports.",
    accent: "bg-amber-500/20 text-amber-300",
  },
  {
    id: "researcher",
    title: "Researcher",
    description: "I use data and evidence for research and analysis.",
    accent: "bg-teal-500/20 text-teal-300",
  },
  {
    id: "organization",
    title: "Organization",
    description: "I represent an organization or institution.",
    accent: "bg-orange-500/20 text-orange-300",
  },
  {
    id: "volunteer",
    title: "Volunteer",
    description: "I want to help verify and support the community.",
    accent: "bg-rose-500/20 text-rose-300",
  },
  {
    id: "other",
    title: "Other",
    description: "Something else? You can tell us more later.",
    accent: "bg-zinc-500/20 text-zinc-300",
  },
];

export const registerSteps = [
  { id: 1, label: "About You" },
  { id: 2, label: "Account Details" },
  { id: 3, label: "Preferences" },
  { id: 4, label: "You're In!" },
] as const;

export const regionOptions = [
  { value: "global", label: "Global" },
  { value: "asia", label: "Asia" },
  { value: "europe", label: "Europe" },
  { value: "americas", label: "Americas" },
  { value: "africa", label: "Africa" },
  { value: "oceania", label: "Oceania" },
] as const;

export const defaultRegisterPreferences = {
  emailUpdates: true,
  followPublicEvents: true,
  region: "global" as (typeof regionOptions)[number]["value"],
};
