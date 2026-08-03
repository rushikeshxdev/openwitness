"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ORG_PROFILE_NAV,
  formatOrgStat,
  type OrgProfileSection,
  type OrganizationDetailViewModel,
} from "@/data/organization-detail-data";
import {
  Activity,
  BadgeCheck,
  ChevronLeft,
  FileText,
  FolderOpen,
  Info,
  LayoutDashboard,
  ThumbsUp,
  Users,
  UsersRound,
} from "lucide-react";

const ICONS: Record<OrgProfileSection, ComponentType<{ className?: string }>> = {
  overview: LayoutDashboard,
  events: FolderOpen,
  reports: FileText,
  evidence: BadgeCheck,
  activity: Activity,
  team: UsersRound,
  followers: Users,
  endorsements: ThumbsUp,
  about: Info,
};

export function OrgProfileSidebar({
  detail,
  active,
  onSelect,
  variant = "vertical",
}: {
  detail: OrganizationDetailViewModel;
  active: OrgProfileSection;
  onSelect: (section: OrgProfileSection) => void;
  variant?: "vertical" | "horizontal";
}) {
  return (
    <div
      className={cn(
        variant === "vertical" ? "flex flex-col" : "flex flex-col gap-2"
      )}
    >
      {variant === "vertical" ? (
        <Link
          href="/organizations"
          className="inline-flex items-center gap-1.5 border-b border-white/10 px-3 py-3 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to Organizations
        </Link>
      ) : null}

      <nav
        aria-label="Organization sections"
        className={cn(
          variant === "horizontal"
            ? "flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
            : "flex flex-col gap-0.5 p-2"
        )}
      >
        {ORG_PROFILE_NAV.map((item) => {
          const Icon = ICONS[item.id];
          const isActive = active === item.id;
          const count =
            item.countKey != null ? detail.counts[item.countKey] : undefined;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "inline-flex min-h-10 items-center gap-2.5 rounded-xl text-sm font-medium transition-colors",
                variant === "horizontal"
                  ? "shrink-0 px-3 py-2"
                  : "w-full px-3 py-2.5",
                isActive
                  ? "border border-[#3B82F6]/40 bg-[#2563EB]/20 text-white"
                  : "border border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-[#60A5FA]" : "text-zinc-500"
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.label}</span>
              {count != null ? (
                <span
                  className={cn(
                    "ml-auto tabular-nums text-xs",
                    isActive ? "text-[#93C5FD]" : "text-zinc-500"
                  )}
                >
                  {formatOrgStat(count)}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {variant === "vertical" && detail.verified ? (
        <div className="m-2 mt-auto rounded-xl border border-white/10 bg-black/30 p-3.5">
          <div className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">
                Verified Organization
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Verified {detail.verifiedAt}
              </p>
              <button
                type="button"
                className="mt-2 text-xs font-medium text-[#60A5FA] hover:text-[#93C5FD]"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
