"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  PROFILE_NAV,
  type ProfileViewModel,
} from "@/data/profile-data";
import { useActiveProfileSection } from "./profile-gate";
import {
  Award,
  Bell,
  Bookmark,
  FileText,
  Globe2,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

const ICONS = {
  overview: LayoutDashboard,
  reports: FileText,
  bookmarks: Bookmark,
  following: Users,
  contributions: Award,
  notifications: Bell,
  settings: Settings,
} as const;

export function ProfileSidebar({
  profile,
  variant = "vertical",
}: {
  profile: ProfileViewModel;
  variant?: "vertical" | "horizontal";
}) {
  const active = useActiveProfileSection();

  return (
    <nav
      aria-label="Profile sections"
      className={cn(
        variant === "horizontal"
          ? "flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
          : "flex flex-col gap-0.5 p-2"
      )}
    >
      {PROFILE_NAV.map((item) => {
        const Icon = ICONS[item.id];
        const isActive = active === item.id;
        const count =
          item.countKey != null ? profile.navCounts[item.countKey] : undefined;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "inline-flex min-h-10 items-center gap-2.5 rounded-xl text-sm font-medium transition-colors",
              variant === "horizontal"
                ? "shrink-0 border px-3 py-2"
                : "w-full border px-3 py-2.5",
              isActive
                ? "border-[#3B82F6]/40 bg-[#2563EB]/20 text-white"
                : "border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                isActive ? "text-[#60A5FA]" : "text-zinc-500"
              )}
              aria-hidden="true"
            />
            <span className="flex-1 whitespace-nowrap">{item.label}</span>
            {count != null && count > 0 ? (
              <span
                className={cn(
                  "min-w-[1.5rem] rounded-md px-1.5 py-0.5 text-center text-xs tabular-nums",
                  isActive
                    ? "bg-[#3B82F6]/30 text-[#93C5FD]"
                    : "bg-white/5 text-zinc-500"
                )}
              >
                {count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function ProfileContributorCta() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-[#1e3a5f]/40 to-[#121214] p-4">
      <Globe2
        className="pointer-events-none absolute -right-2 -top-2 h-20 w-20 text-[#3B82F6]/20"
        aria-hidden="true"
      />
      <p className="relative text-sm font-semibold text-white">
        Become a Contributor
      </p>
      <p className="relative mt-1.5 text-xs leading-relaxed text-zinc-400">
        Unlock verification tools and help document public events worldwide.
      </p>
      <Link
        href="/report"
        className="relative mt-3 inline-flex min-h-9 items-center justify-center rounded-lg bg-[#3B82F6] px-3 py-2 text-xs font-semibold text-white hover:bg-[#2563EB]"
      >
        Start contributing
      </Link>
    </div>
  );
}
