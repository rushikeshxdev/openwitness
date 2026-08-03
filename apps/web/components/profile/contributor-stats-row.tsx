"use client";

import { formatPoints, type ProfileContributorStats } from "@/data/profile-data";
import {
  CloudUpload,
  FileText,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";

const CARDS: Array<{
  key: keyof ProfileContributorStats | "accuracy";
  label: string;
  icon: ComponentType<{ className?: string }>;
  iconClass: string;
  value: (s: ProfileContributorStats) => string;
  sub: (s: ProfileContributorStats) => string;
}> = [
  {
    key: "evidenceUploaded",
    label: "Evidence Uploaded",
    icon: CloudUpload,
    iconClass: "bg-sky-500/15 text-sky-400",
    value: (s) => formatPoints(s.evidenceUploaded),
    sub: (s) => `+${s.evidenceUploadedDelta} this month`,
  },
  {
    key: "verifiedEvidence",
    label: "Verified Evidence",
    icon: ShieldCheck,
    iconClass: "bg-emerald-500/15 text-emerald-400",
    value: (s) => formatPoints(s.verifiedEvidence),
    sub: (s) => `${s.verifiedPercent}% of uploads`,
  },
  {
    key: "reportsPublished",
    label: "Reports Published",
    icon: FileText,
    iconClass: "bg-violet-500/15 text-violet-400",
    value: (s) => formatPoints(s.reportsPublished),
    sub: (s) => `+${s.reportsDelta} this month`,
  },
  {
    key: "reviewsCompleted",
    label: "Reviews Completed",
    icon: Users,
    iconClass: "bg-orange-500/15 text-orange-400",
    value: (s) => formatPoints(s.reviewsCompleted),
    sub: (s) => `+${s.reviewsDelta} this month`,
  },
  {
    key: "accuracy",
    label: "Review Accuracy",
    icon: Target,
    iconClass: "bg-teal-500/15 text-teal-400",
    value: (s) => `${s.reviewAccuracy}%`,
    sub: (s) => s.reviewAccuracyLabel,
  },
];

export function ContributorStatsRow({
  stats,
}: {
  stats: ProfileContributorStats;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5">
      {CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="rounded-2xl border border-white/12 bg-[#121214]/90 p-3.5 sm:p-4"
          >
            <div
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${card.iconClass}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <p className="mt-3 text-xl font-bold tabular-nums text-white sm:text-2xl">
              {card.value(stats)}
            </p>
            <p className="mt-1 text-xs font-medium text-zinc-300">{card.label}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">{card.sub(stats)}</p>
          </div>
        );
      })}
    </div>
  );
}
