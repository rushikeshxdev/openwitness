/**
 * Profile hub mock data + view-model builder
 */

import type { MockSessionUser } from "@/lib/auth-session";

export type ProfileSectionId =
  | "overview"
  | "reports"
  | "bookmarks"
  | "following"
  | "contributions"
  | "notifications"
  | "settings";

export type SettingsSectionId =
  | "account"
  | "profile"
  | "notifications"
  | "privacy"
  | "security"
  | "connected"
  | "appearance";

export interface ProfileLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface StoredProfile {
  name?: string;
  handle?: string;
  email?: string;
  bio?: string;
  location?: string;
  language?: string;
  verified?: boolean;
  avatarUrl?: string;
  links?: ProfileLinks;
  emailUpdates?: boolean;
  pushNotifications?: boolean;
  followPublicEvents?: boolean;
  profilePublic?: boolean;
  showLocation?: boolean;
  twoFactorEnabled?: boolean;
  connectedGithub?: boolean;
  connectedTwitter?: boolean;
  connectedLinkedin?: boolean;
  theme?: "dark" | "system";
  compactMode?: boolean;
  readNotificationIds?: string[];
}

export interface ProfileStats {
  reports: number;
  bookmarks: number;
  following: number;
  points: number;
  verifications: number;
}

export interface ProfileActivityPoint {
  month: string;
  value: number;
}

export interface ProfileBadge {
  id: string;
  title: string;
  earnedLabel: string;
  tone: "blue" | "emerald" | "amber" | "violet";
}

export interface ProfileActivityItem {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  verified: boolean;
}

export interface ProfileListItem {
  id: string;
  title: string;
  meta: string;
  href?: string;
  status?: string;
  thumbnailUrl?: string;
}

export interface ProfileNotification {
  id: string;
  title: string;
  body: string;
  timeLabel: string;
  unread: boolean;
}

export interface ProfileSettingsState {
  username: string;
  email: string;
  bio: string;
  location: string;
  language: string;
  emailUpdates: boolean;
  pushNotifications: boolean;
  followPublicEvents: boolean;
  profilePublic: boolean;
  showLocation: boolean;
  twoFactorEnabled: boolean;
  connectedGithub: boolean;
  connectedTwitter: boolean;
  connectedLinkedin: boolean;
  theme: "dark" | "system";
  compactMode: boolean;
}

export interface ProfileViewModel {
  id: string;
  name: string;
  handle: string;
  email: string;
  verified: boolean;
  avatarUrl?: string;
  bio: string;
  location: string;
  links: ProfileLinks;
  role: string;
  memberSinceLabel: string;
  stats: ProfileStats;
  activitySeries: ProfileActivityPoint[];
  badges: ProfileBadge[];
  recentActivity: ProfileActivityItem[];
  reports: ProfileListItem[];
  bookmarks: ProfileListItem[];
  following: ProfileListItem[];
  contributions: ProfileListItem[];
  notifications: ProfileNotification[];
  settings: ProfileSettingsState;
  navCounts: {
    reports: number;
    bookmarks: number;
    following: number;
    contributions: number;
    notifications: number;
  };
}

export const PROFILE_PATH = "/profile";
export const PROFILE_SETTINGS_PATH = "/profile/settings";
export const LOGIN_NEXT_PROFILE = `/login?next=${encodeURIComponent(PROFILE_PATH)}`;
export const REGISTER_NEXT_PROFILE = `/register?next=${encodeURIComponent(PROFILE_PATH)}`;

export const PROFILE_NAV: {
  id: ProfileSectionId;
  label: string;
  href: string;
  countKey?: keyof ProfileViewModel["navCounts"];
}[] = [
  { id: "overview", label: "Overview", href: "/profile" },
  { id: "reports", label: "My Reports", href: "/profile/reports", countKey: "reports" },
  { id: "bookmarks", label: "Bookmarks", href: "/profile/bookmarks", countKey: "bookmarks" },
  { id: "following", label: "Following", href: "/profile/following", countKey: "following" },
  {
    id: "contributions",
    label: "Contributions",
    href: "/profile/contributions",
    countKey: "contributions",
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "/notifications",
    countKey: "notifications",
  },
  { id: "settings", label: "Settings", href: "/profile/settings" },
];

export const SETTINGS_NAV: { id: SettingsSectionId; label: string }[] = [
  { id: "account", label: "Account" },
  { id: "profile", label: "Profile" },
  { id: "notifications", label: "Notifications" },
  { id: "privacy", label: "Privacy" },
  { id: "security", label: "Security" },
  { id: "connected", label: "Connected Accounts" },
  { id: "appearance", label: "Appearance" },
];

function slugHandle(name: string, email: string): string {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "") || email.split("@")[0] || "user";
  return base.slice(0, 24);
}

function formatMemberSince(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "May 2024";
  }
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "OW";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getInitials(name: string): string {
  return initialsFromName(name);
}

const DEFAULT_ACTIVITY: ProfileActivityPoint[] = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 180 },
  { month: "Mar", value: 240 },
  { month: "Apr", value: 310 },
  { month: "May", value: 280 },
  { month: "Jun", value: 420 },
  { month: "Jul", value: 620 },
  { month: "Aug", value: 510 },
];

const DEFAULT_BADGES: ProfileBadge[] = [
  {
    id: "b1",
    title: "Active Reporter",
    earnedLabel: "Earned May 12, 2024",
    tone: "blue",
  },
  {
    id: "b2",
    title: "Verifier",
    earnedLabel: "Earned Jun 3, 2024",
    tone: "emerald",
  },
  {
    id: "b3",
    title: "Community Helper",
    earnedLabel: "Earned Jun 28, 2024",
    tone: "amber",
  },
  {
    id: "b4",
    title: "Top Contributor",
    earnedLabel: "Earned Jul 15, 2024",
    tone: "violet",
  },
];

function defaultLists(name: string) {
  const reports: ProfileListItem[] = [
    {
      id: "r1",
      title: "CJP Protest – New Delhi",
      meta: "Submitted May 17 · Protest",
      href: "/events/1",
      status: "Verified",
      thumbnailUrl: "/images/events/event1.jpg",
    },
    {
      id: "r2",
      title: "Flood Relief – Assam",
      meta: "Submitted May 20 · Disaster",
      href: "/events/3",
      status: "Under review",
      thumbnailUrl: "/images/events/event3.jpg",
    },
    {
      id: "r3",
      title: "Campus Gathering – Pune",
      meta: "Draft · Gathering",
      status: "Draft",
      thumbnailUrl: "/images/events/event2.jpg",
    },
  ];

  const bookmarks: ProfileListItem[] = [
    {
      id: "bm1",
      title: "Farmers Protest – Noida",
      meta: "Bookmarked 2d ago",
      href: "/events/2",
      thumbnailUrl: "/images/events/event2.jpg",
    },
    {
      id: "bm2",
      title: "Wildfire – California",
      meta: "Bookmarked 5d ago",
      href: "/events/5",
      thumbnailUrl: "/images/events/event5.jpg",
    },
  ];

  const following: ProfileListItem[] = [
    {
      id: "f1",
      title: "OpenWitness Community",
      meta: "Organization · 12.4K followers",
    },
    {
      id: "f2",
      title: "CJP Protest – New Delhi",
      meta: "Event · Live",
      href: "/events/1",
    },
    {
      id: "f3",
      title: "Humanity First",
      meta: "Organization · Verified",
    },
  ];

  const contributions: ProfileListItem[] = [
    {
      id: "c1",
      title: "Verified evidence EVT-2024-0517-0001",
      meta: "Contribution · Video",
      href: "/events/1/evidence/EVT-2024-0517-0001",
      status: "Verified",
    },
    {
      id: "c2",
      title: "Timeline note on India Gate march",
      meta: "Contribution · Timeline",
      href: "/events/1/timeline",
    },
    {
      id: "c3",
      title: `Comment by ${name.split(" ")[0] || "you"}`,
      meta: "Contribution · Discussion",
      href: "/events/1",
    },
  ];

  const notifications: ProfileNotification[] = [
    {
      id: "n1",
      title: "Your report was verified",
      body: "CJP Protest – New Delhi is now marked verified by the community.",
      timeLabel: "2h ago",
      unread: true,
    },
    {
      id: "n2",
      title: "New follower",
      body: "Humanity First started following your contributions.",
      timeLabel: "1d ago",
      unread: true,
    },
    {
      id: "n3",
      title: "Badge earned",
      body: "You earned the Top Contributor badge.",
      timeLabel: "3d ago",
      unread: false,
    },
  ];

  const recentActivity: ProfileActivityItem[] = [
    {
      id: "a1",
      title: "You reported an incident — CJP Protest",
      subtitle: "New Delhi, India",
      dateLabel: "May 17, 2024",
      verified: true,
    },
    {
      id: "a2",
      title: "You verified an event",
      subtitle: "Flood Relief – Assam",
      dateLabel: "May 21, 2024",
      verified: true,
    },
    {
      id: "a3",
      title: "You bookmarked Farmers Protest – Noida",
      subtitle: "Noida, India",
      dateLabel: "May 22, 2024",
      verified: false,
    },
    {
      id: "a4",
      title: "You contributed timeline evidence",
      subtitle: "March toward India Gate",
      dateLabel: "May 23, 2024",
      verified: true,
    },
  ];

  return { reports, bookmarks, following, contributions, notifications, recentActivity };
}

export function defaultStoredProfile(
  session: MockSessionUser
): StoredProfile {
  const name = session.name?.trim() || session.email.split("@")[0] || "User";
  const handle = slugHandle(name, session.email);
  return {
    name,
    handle,
    email: session.email,
    bio: "Documenting public events and community evidence across India. Building transparency with OpenWitness.",
    location: "Kolhapur, India",
    language: "English",
    verified: true,
    links: {
      github: "https://github.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      website: "https://openwitness.org",
    },
    emailUpdates: true,
    pushNotifications: true,
    followPublicEvents: true,
    profilePublic: true,
    showLocation: true,
    twoFactorEnabled: false,
    connectedGithub: true,
    connectedTwitter: false,
    connectedLinkedin: true,
    theme: "dark",
    compactMode: false,
  };
}

export function buildProfile(
  session: MockSessionUser,
  stored: StoredProfile | null
): ProfileViewModel {
  const base = defaultStoredProfile(session);
  const merged: StoredProfile = { ...base, ...stored, links: { ...base.links, ...stored?.links } };
  const name = merged.name || base.name;
  const lists = defaultLists(name);

  const stats: ProfileStats = {
    reports: 32,
    bookmarks: 18,
    following: 24,
    points: 1200,
    verifications: 5,
  };

  return {
    id: `user-${session.email}`,
    name,
    handle: merged.handle || base.handle,
    email: merged.email || session.email,
    verified: merged.verified ?? true,
    avatarUrl: merged.avatarUrl,
    bio: merged.bio,
    location: merged.location,
    links: merged.links ?? {},
    role: session.role || "Contributor",
    memberSinceLabel: formatMemberSince(session.createdAt),
    stats,
    activitySeries: DEFAULT_ACTIVITY,
    badges: DEFAULT_BADGES,
    recentActivity: lists.recentActivity,
    reports: lists.reports,
    bookmarks: lists.bookmarks,
    following: lists.following,
    contributions: lists.contributions,
    notifications: lists.notifications,
    settings: {
      username: merged.handle || base.handle,
      email: merged.email || session.email,
      bio: merged.bio,
      location: merged.location,
      language: merged.language || "English",
      emailUpdates: merged.emailUpdates ?? true,
      pushNotifications: merged.pushNotifications ?? true,
      followPublicEvents: merged.followPublicEvents ?? true,
      profilePublic: merged.profilePublic ?? true,
      showLocation: merged.showLocation ?? true,
      twoFactorEnabled: merged.twoFactorEnabled ?? false,
      connectedGithub: merged.connectedGithub ?? true,
      connectedTwitter: merged.connectedTwitter ?? false,
      connectedLinkedin: merged.connectedLinkedin ?? true,
      theme: merged.theme ?? "dark",
      compactMode: merged.compactMode ?? false,
    },
    navCounts: {
      reports: lists.reports.length,
      bookmarks: lists.bookmarks.length,
      following: lists.following.length,
      contributions: lists.contributions.length,
      notifications: lists.notifications.filter((n) => n.unread).length,
    },
  };
}

export function formatPoints(n: number): string {
  if (n >= 1000) {
    const v = n / 1000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}K`;
  }
  return String(n);
}
