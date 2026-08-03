"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  USER_VERIFICATION_STATS,
  type VerificationUserStats,
} from "@/data/verification-queue-data";
import {
  getUnreadNotificationCount,
  NOTIFICATIONS_CHANGED_EVENT,
} from "@/lib/notifications-store";
import { NOTIFICATIONS_PATH } from "@/data/notifications-data";
import { ReportIncidentGate } from "@/components/auth/report-incident-gate";
import {
  Award,
  Bell,
  Bookmark,
  Building2,
  FileText,
  Flame,
  FolderOpen,
  HelpCircle,
  Home,
  LayoutDashboard,
  Map as MapIcon,
  Settings,
  ShieldCheck,
  Trophy,
  BookOpen,
} from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: typeof Home;
  disabled?: boolean;
  badge?: number;
};

const MAIN_NAV: NavItem[] = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "explore", label: "Explore Events", href: "/events", icon: LayoutDashboard },
  { id: "map", label: "Map", href: "/map", icon: MapIcon },
  { id: "evidence", label: "Evidence", href: "/evidence", icon: FolderOpen },
  { id: "reports", label: "Reports", href: "/reports", icon: FileText },
  {
    id: "organizations",
    label: "Organizations",
    href: "/organizations",
    icon: Building2,
  },
];

const COMMUNITY_NAV: NavItem[] = [
  {
    id: "verification",
    label: "Verification Dashboard",
    href: "/verification",
    icon: ShieldCheck,
  },
  {
    id: "my-reviews",
    label: "My Reviews",
    href: "#",
    icon: Award,
    disabled: true,
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    href: "#",
    icon: Trophy,
    disabled: true,
  },
  {
    id: "guidelines",
    label: "Guidelines",
    href: "#",
    icon: BookOpen,
    disabled: true,
  },
];

function isActive(pathname: string, href: string, id: string): boolean {
  if (id === "verification") {
    return pathname === "/verification" || pathname.startsWith("/verification/");
  }
  if (id === "home") return pathname === "/";
  if (id === "explore") {
    return pathname === "/events" || pathname.startsWith("/events/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavSection({
  title,
  items,
  pathname,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
}) {
  return (
    <div>
      <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
        {title}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            !item.disabled && isActive(pathname, item.href, item.id);
          const className = cn(
            "inline-flex w-full min-h-10 items-center gap-2.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
            item.disabled
              ? "cursor-not-allowed border-transparent text-zinc-600"
              : active
                ? "border-[#3B82F6]/40 bg-[#2563EB]/20 text-white"
                : "border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
          );

          if (item.disabled) {
            return (
              <li key={item.id}>
                <span className={className} title="Coming soon" aria-disabled="true">
                  <Icon className="h-4 w-4 shrink-0 text-zinc-600" aria-hidden="true" />
                  <span className="flex-1 truncate">{item.label}</span>
                  <span className="text-[10px] uppercase tracking-wide text-zinc-600">
                    Soon
                  </span>
                </span>
              </li>
            );
          }

          return (
            <li key={item.id}>
              <Link href={item.href} className={className} aria-current={active ? "page" : undefined}>
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-[#93C5FD]" : "text-zinc-500"
                  )}
                  aria-hidden="true"
                />
                <span className="flex-1 truncate">{item.label}</span>
                {typeof item.badge === "number" && item.badge > 0 ? (
                  <span className="rounded-md bg-rose-500/90 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StatsCard({ stats }: { stats: VerificationUserStats }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        Your Verification Stats
      </p>
      <dl className="mt-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2 text-sm">
          <dt className="text-zinc-400">Reviews Completed</dt>
          <dd className="font-semibold text-white">{stats.reviewsCompleted}</dd>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm">
          <dt className="text-zinc-400">Accuracy Rate</dt>
          <dd className="font-semibold text-emerald-400">{stats.accuracyRate}%</dd>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm">
          <dt className="inline-flex items-center gap-1 text-zinc-400">
            Current Streak
            <Flame className="h-3.5 w-3.5 text-orange-400" aria-hidden="true" />
          </dt>
          <dd className="font-semibold text-white">{stats.streakDays} days</dd>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
            <dt className="text-zinc-400">Trust Score</dt>
            <dd className="font-semibold text-white">
              {stats.trustScore}
              <span className="text-zinc-500">/100</span>
            </dd>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${stats.trustScore}%` }}
            />
          </div>
        </div>
      </dl>
    </div>
  );
}

export function VerificationSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const refresh = () => setNotifCount(getUnreadNotificationCount());
    refresh();
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);
  }, []);

  const moreNav: NavItem[] = [
    {
      id: "bookmarks",
      label: "Bookmarks",
      href: "/profile/bookmarks",
      icon: Bookmark,
    },
    {
      id: "notifications",
      label: "Notifications",
      href: NOTIFICATIONS_PATH,
      icon: Bell,
      badge: notifCount,
    },
    {
      id: "settings",
      label: "Settings",
      href: "/profile/settings",
      icon: Settings,
    },
    {
      id: "help",
      label: "Help & Support",
      href: "#",
      icon: HelpCircle,
      disabled: true,
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4 p-3" onClick={onNavigate}>
      <ReportIncidentGate
        label="+ Report an Incident"
        variant="navbar"
        className="!h-11 !w-full !justify-center !rounded-xl !bg-[#3B82F6] !text-sm !font-semibold"
      />

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-0.5">
        <NavSection title="Main" items={MAIN_NAV} pathname={pathname} />
        <NavSection title="Community" items={COMMUNITY_NAV} pathname={pathname} />
        <NavSection title="More" items={moreNav} pathname={pathname} />
      </div>

      <StatsCard stats={USER_VERIFICATION_STATS} />
    </div>
  );
}
