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
  tone: "blue" | "emerald" | "amber" | "violet" | "cyan" | "rose";
  subtitle?: string;
}

export interface ProfileAchievement {
  id: string;
  title: string;
  description: string;
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

export interface ProfileContributorStats {
  evidenceUploaded: number;
  evidenceUploadedDelta: number;
  verifiedEvidence: number;
  verifiedPercent: number;
  reportsPublished: number;
  reportsDelta: number;
  reviewsCompleted: number;
  reviewsDelta: number;
  reviewAccuracy: number;
  reviewAccuracyLabel: string;
}

export interface ProfileTrustScore {
  score: number;
  max: number;
  label: string;
}

export interface ProfileReputationItem {
  id: string;
  label: string;
  value: number;
  max: number;
  color: string;
}

export interface ProfileOrgWorkedWith {
  id: string;
  name: string;
  initials: string;
  accent: string;
  contributions: number;
  href?: string;
}

export interface ProfileContributionCard {
  id: string;
  title: string;
  location: string;
  dateLabel: string;
  thumbnailUrl: string;
  tags: string[];
  status: "verified" | "under_review" | "pending";
  verifiedBy?: string;
  href?: string;
}

export interface ProfileHeatmapStats {
  daysActive: number;
  eventsContributed: number;
  organizationsWorkedWith: number;
  countriesContributed: number;
}

export type ContributorTabId =
  | "overview"
  | "activity"
  | "contributions"
  | "reviews"
  | "badges"
  | "following"
  | "followers";

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
  joinLabel: string;
  stats: ProfileStats;
  contributorStats: ProfileContributorStats;
  trustScore: ProfileTrustScore;
  reputation: ProfileReputationItem[];
  reputationTotal: number;
  skills: string[];
  organizationsWorkedWith: ProfileOrgWorkedWith[];
  heatmap: number[];
  heatmapYear: number;
  heatmapStats: ProfileHeatmapStats;
  recentContributions: ProfileContributionCard[];
  achievements: ProfileAchievement[];
  followersCount: number;
  followingCount: number;
  activitySeries: ProfileActivityPoint[];
  badges: ProfileBadge[];
  recentActivity: ProfileActivityItem[];
  reports: ProfileListItem[];
  bookmarks: ProfileListItem[];
  following: ProfileListItem[];
  followers: ProfileListItem[];
  contributions: ProfileListItem[];
  reviews: ProfileListItem[];
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

export const CONTRIBUTOR_TABS: {
  id: ContributorTabId;
  label: string;
  countKey?: "followingCount" | "followersCount";
}[] = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity" },
  { id: "contributions", label: "Contributions" },
  { id: "reviews", label: "Reviews" },
  { id: "badges", label: "Badges" },
  { id: "following", label: "Following", countKey: "followingCount" },
  { id: "followers", label: "Followers", countKey: "followersCount" },
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
    title: "Trusted Reviewer",
    earnedLabel: "Earned May 12, 2024",
    subtitle: "Top 5% reviewers",
    tone: "blue",
  },
  {
    id: "b2",
    title: "Photo Expert",
    earnedLabel: "Earned Jun 3, 2024",
    subtitle: "200+ photo verifications",
    tone: "emerald",
  },
  {
    id: "b3",
    title: "Local Guide",
    earnedLabel: "Earned Jun 28, 2024",
    subtitle: "Maharashtra coverage",
    tone: "amber",
  },
  {
    id: "b4",
    title: "Fact Checker",
    earnedLabel: "Earned Jul 15, 2024",
    subtitle: "High accuracy streak",
    tone: "violet",
  },
  {
    id: "b5",
    title: "Global Contributor",
    earnedLabel: "Earned Aug 1, 2024",
    subtitle: "9 countries contributed",
    tone: "cyan",
  },
];

const DEFAULT_ACHIEVEMENTS: ProfileAchievement[] = [
  {
    id: "ach1",
    title: "Milestone: 100 Verified Evidence",
    description: "Reached 100 community-verified uploads",
  },
  {
    id: "ach2",
    title: "First Organization Endorsement",
    description: "Endorsed by Amnesty International India",
  },
  {
    id: "ach3",
    title: "Week Streak: 14 Days",
    description: "Contributed evidence 14 days in a row",
  },
];

function buildHeatmap(seed = 42): number[] {
  const cells: number[] = [];
  let s = seed;
  for (let i = 0; i < 371; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const r = s % 100;
    if (r < 35) cells.push(0);
    else if (r < 55) cells.push(1);
    else if (r < 75) cells.push(2);
    else if (r < 90) cells.push(3);
    else cells.push(4);
  }
  return cells;
}

const DEFAULT_RECENT_CONTRIBUTIONS: ProfileContributionCard[] = [
  {
    id: "rc1",
    title: "Protest at India Gate",
    location: "New Delhi, India",
    dateLabel: "May 17, 2024",
    thumbnailUrl: "/images/events/event1.jpg",
    tags: ["Video", "1:24"],
    status: "verified",
    verifiedBy: "Amnesty International",
    href: "/events/1",
  },
  {
    id: "rc2",
    title: "Assam Flood Documentation",
    location: "Guwahati, Assam",
    dateLabel: "May 20, 2024",
    thumbnailUrl: "/images/events/event3.jpg",
    tags: ["Photo", "Series"],
    status: "verified",
    verifiedBy: "The Wire",
    href: "/events/3",
  },
  {
    id: "rc3",
    title: "Farmers March – Noida",
    location: "Noida, India",
    dateLabel: "May 22, 2024",
    thumbnailUrl: "/images/events/event2.jpg",
    tags: ["Video", "0:48"],
    status: "under_review",
    href: "/events/2",
  },
  {
    id: "rc4",
    title: "Campus Gathering – Pune",
    location: "Pune, India",
    dateLabel: "May 25, 2024",
    thumbnailUrl: "/images/events/event4.jpg",
    tags: ["Photo"],
    status: "verified",
    verifiedBy: "PUCL",
    href: "/events/4",
  },
];

const DEFAULT_ORGS_WORKED: ProfileOrgWorkedWith[] = [
  {
    id: "amnesty",
    name: "Amnesty International",
    initials: "A",
    accent: "#F59E0B",
    contributions: 42,
    href: "/organizations/amnesty",
  },
  {
    id: "red-cross",
    name: "Red Cross",
    initials: "RC",
    accent: "#EF4444",
    contributions: 18,
  },
  {
    id: "reuters",
    name: "Reuters",
    initials: "R",
    accent: "#F97316",
    contributions: 12,
  },
  {
    id: "the-wire",
    name: "The Wire",
    initials: "TW",
    accent: "#EF4444",
    contributions: 27,
    href: "/organizations/the-wire",
  },
  {
    id: "human-rights",
    name: "Human Rights Watch",
    initials: "HR",
    accent: "#3B82F6",
    contributions: 9,
    href: "/organizations/human-rights",
  },
];

const DEFAULT_REPUTATION: ProfileReputationItem[] = [
  { id: "identity", label: "Identity Verification", value: 20, max: 20, color: "#10B981" },
  { id: "accuracy", label: "Evidence Accuracy", value: 25, max: 25, color: "#3B82F6" },
  { id: "reviews", label: "Community Reviews", value: 18, max: 20, color: "#8B5CF6" },
  { id: "endorsements", label: "Organization Endorsements", value: 15, max: 15, color: "#F97316" },
  { id: "longevity", label: "Longevity", value: 10, max: 10, color: "#14B8A6" },
  { id: "review-acc", label: "Review Accuracy", value: 5, max: 10, color: "#60A5FA" },
];

const DEFAULT_SKILLS = [
  "Video Verification",
  "Geolocation",
  "OSINT",
  "Research",
  "Photo Forensics",
  "Timeline Mapping",
  "Source Credibility",
  "Multilingual",
];

const DEFAULT_FOLLOWERS: ProfileListItem[] = [
  { id: "fl1", title: "Ananya Verma", meta: "Contributor · Trust 96" },
  { id: "fl2", title: "Rohan Mehta", meta: "Reviewer · Trust 91" },
  { id: "fl3", title: "Amnesty International India", meta: "Organization · Verified", href: "/organizations/amnesty" },
  { id: "fl4", title: "Priya Nair", meta: "Contributor · Trust 88" },
];

const DEFAULT_REVIEWS: ProfileListItem[] = [
  {
    id: "rv1",
    title: "Reviewed evidence on Protest at India Gate",
    meta: "Accurate · May 18, 2024",
    status: "Accepted",
    href: "/events/1",
  },
  {
    id: "rv2",
    title: "Geolocation check – Assam Floods",
    meta: "Accurate · May 21, 2024",
    status: "Accepted",
    href: "/events/3",
  },
  {
    id: "rv3",
    title: "Source credibility – Farmers March",
    meta: "Needs info · May 23, 2024",
    status: "Flagged",
    href: "/events/2",
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
    bio: "Computer Science Engineer passionate about transparency, human rights, and leveraging technology to build a better world.",
    location: "Kolhapur, Maharashtra, India",
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
  const merged: StoredProfile = {
    ...base,
    ...stored,
    links: { ...base.links, ...stored?.links },
  };
  const name = merged.name || base.name || "User";
  const handle = merged.handle || base.handle || "user";
  const email = merged.email || session.email;
  const bio =
    merged.bio ||
    base.bio ||
    "Documenting public events and community evidence.";
  const location = merged.location || base.location || "India";
  const language = merged.language || base.language || "English";
  const lists = defaultLists(name);
  const reputation = DEFAULT_REPUTATION;
  const reputationTotal = reputation.reduce((sum, r) => sum + r.value, 0);

  const stats: ProfileStats = {
    reports: 27,
    bookmarks: 18,
    following: 128,
    points: 1200,
    verifications: 451,
  };

  const memberSinceLabel = formatMemberSince(session.createdAt);

  return {
    id: `user-${session.email}`,
    name,
    handle,
    email,
    verified: merged.verified ?? true,
    avatarUrl: merged.avatarUrl,
    bio,
    location,
    links: merged.links ?? {},
    role: session.role || "Contributor",
    memberSinceLabel,
    joinLabel: "Joined OpenWitness · Jan 2024",
    stats,
    contributorStats: {
      evidenceUploaded: 482,
      evidenceUploadedDelta: 18,
      verifiedEvidence: 451,
      verifiedPercent: 93.6,
      reportsPublished: 27,
      reportsDelta: 3,
      reviewsCompleted: 1200,
      reviewsDelta: 86,
      reviewAccuracy: 98,
      reviewAccuracyLabel: "Excellent",
    },
    trustScore: { score: 96, max: 100, label: "Excellent" },
    reputation,
    reputationTotal,
    skills: DEFAULT_SKILLS,
    organizationsWorkedWith: DEFAULT_ORGS_WORKED,
    heatmap: buildHeatmap(96),
    heatmapYear: 2024,
    heatmapStats: {
      daysActive: 142,
      eventsContributed: 28,
      organizationsWorkedWith: 12,
      countriesContributed: 9,
    },
    recentContributions: DEFAULT_RECENT_CONTRIBUTIONS,
    achievements: DEFAULT_ACHIEVEMENTS,
    followersCount: 342,
    followingCount: 128,
    activitySeries: DEFAULT_ACTIVITY,
    badges: DEFAULT_BADGES,
    recentActivity: lists.recentActivity,
    reports: lists.reports,
    bookmarks: lists.bookmarks,
    following: lists.following,
    followers: DEFAULT_FOLLOWERS,
    contributions: lists.contributions,
    reviews: DEFAULT_REVIEWS,
    notifications: lists.notifications,
    settings: {
      username: handle,
      email,
      bio,
      location,
      language,
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
