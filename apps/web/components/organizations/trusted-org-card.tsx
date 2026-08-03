"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/glass-card";
import type { TrustedOrganization } from "@/data/trusted-organizations-data";
import { BadgeCheck, ChevronRight, UserPlus, UserCheck } from "lucide-react";

export interface TrustedOrgCardProps {
  organization: TrustedOrganization;
  className?: string;
}

export function TrustedOrgCard({ organization, className }: TrustedOrgCardProps) {
  const [following, setFollowing] = useState(false);
  const { name, category, eventCount, verified, initials, accent } = organization;

  return (
    <GlassCard
      className={cn(
        "flex flex-col gap-5 p-5 sm:p-6",
        "bg-[#121214]/90 border-white/[0.12]",
        className
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full text-sm sm:text-base font-bold text-white shadow-inner"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-white truncate">
            {name}
          </h3>
          <p className="text-sm text-zinc-400 truncate">{category}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-300 tabular-nums">
          <span className="font-semibold text-white">{eventCount}</span> Events
        </p>
        {verified && (
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            aria-label={`${name} is verified`}
          >
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            Verified
            <ChevronRight className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
          </button>
        )}
      </div>

      <button
        type="button"
        aria-pressed={following}
        onClick={() => setFollowing((v) => !v)}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
          following
            ? "border-[#3B82F6]/50 bg-[#3B82F6]/15 text-white"
            : "border-white/12 bg-white/[0.04] text-zinc-200 hover:bg-white/[0.08] hover:text-white"
        )}
      >
        {following ? (
          <UserCheck className="h-4 w-4" aria-hidden="true" />
        ) : (
          <UserPlus className="h-4 w-4" aria-hidden="true" />
        )}
        {following ? "Following" : "Follow"}
      </button>
    </GlassCard>
  );
}
