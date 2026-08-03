"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ProfileContributionCard } from "@/data/profile-data";
import { MapPin } from "lucide-react";

const STATUS: Record<
  ProfileContributionCard["status"],
  { label: string; className: string }
> = {
  verified: {
    label: "Verified",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  },
  under_review: {
    label: "Under Review",
    className: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  },
  pending: {
    label: "Pending",
    className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  },
};

export function ContributorRecentContributions({
  items,
}: {
  items: ProfileContributionCard[];
}) {
  return (
    <section
      className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5"
      aria-labelledby="recent-contrib-heading"
    >
      <h2
        id="recent-contrib-heading"
        className="text-base font-semibold text-white sm:text-lg"
      >
        Recent Contributions
      </h2>

      <ul className="mt-4 space-y-3">
        {items.map((item) => {
          const badge = STATUS[item.status];
          const inner = (
            <>
              <div className="relative aspect-[4/3] w-[88px] shrink-0 overflow-hidden rounded-lg sm:w-[104px]">
                <Image
                  src={item.thumbnailUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="104px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#60A5FA] sm:text-[15px]">
                    {item.title}
                  </h3>
                  <span
                    className={cn(
                      "inline-flex shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-medium",
                      badge.className
                    )}
                  >
                    {badge.label}
                  </span>
                </div>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-zinc-400">
                  <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {item.location} · {item.dateLabel}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/10 bg-black/30 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {item.verifiedBy ? (
                  <p className="mt-2 text-[11px] text-zinc-500">
                    Verified by{" "}
                    <span className="text-zinc-300">{item.verifiedBy}</span>
                  </p>
                ) : null}
              </div>
            </>
          );

          return (
            <li key={item.id}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="group flex gap-3 rounded-xl border border-white/10 bg-black/25 p-3 transition-colors hover:border-white/20 hover:bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
                >
                  {inner}
                </Link>
              ) : (
                <div className="flex gap-3 rounded-xl border border-white/10 bg-black/25 p-3">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <Link
        href="/profile/contributions"
        className="mt-4 inline-flex text-sm font-medium text-[#60A5FA] hover:text-[#93C5FD]"
      >
        View all evidence →
      </Link>
    </section>
  );
}
