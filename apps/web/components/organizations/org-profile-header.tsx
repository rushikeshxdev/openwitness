"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  formatOrgStat,
  type OrganizationDetailViewModel,
} from "@/data/organization-detail-data";
import {
  BadgeCheck,
  Globe,
  MapPin,
  MoreHorizontal,
  UserPlus,
  UserCheck,
} from "lucide-react";

export function OrgProfileHeader({
  detail,
  following,
  onToggleFollow,
}: {
  detail: OrganizationDetailViewModel;
  following: boolean;
  onToggleFollow: () => void;
}) {
  const headerStats = [
    { label: "Followers", value: detail.counts.followers },
    { label: "Reports", value: detail.counts.reports },
    { label: "Evidence", value: detail.counts.evidence },
    { label: "Endorsements", value: detail.counts.endorsements },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-white/12 bg-[#121214]/90">
      <div className="relative h-40 sm:h-48 md:h-56">
        <Image
          src={detail.coverUrl}
          alt=""
          fill
          priority
          quality={75}
          className="object-cover object-[50%_35%] brightness-[0.45] contrast-[1.05]"
          sizes="(max-width: 1024px) 100vw, 75vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/40 to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative px-4 pb-5 sm:px-6 sm:pb-6">
        <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-end gap-3.5 sm:gap-4">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-[#121214] text-2xl font-bold text-white shadow-lg sm:h-24 sm:w-24 sm:text-3xl"
              style={{ backgroundColor: detail.accent }}
              aria-hidden="true"
            >
              {detail.initials}
            </div>
            <div className="min-w-0 pb-1">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl md:text-[1.75rem]">
                  {detail.fullName}
                </h1>
                {detail.verified ? (
                  <BadgeCheck
                    className="h-5 w-5 shrink-0 text-[#3B82F6]"
                    aria-label="Verified"
                  />
                ) : null}
              </div>
              <p className="mt-0.5 text-sm font-medium text-[#A78BFA]">
                {detail.tagline}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:pb-1">
            <button
              type="button"
              aria-pressed={following}
              onClick={onToggleFollow}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                following
                  ? "border border-white/20 bg-white/15 text-white"
                  : "border border-transparent bg-[#3B82F6] text-white hover:bg-[#2563EB]"
              )}
            >
              {following ? (
                <UserCheck className="h-4 w-4" aria-hidden="true" />
              ) : (
                <UserPlus className="h-4 w-4" aria-hidden="true" />
              )}
              {following ? "Following" : "Follow"}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.08]"
            >
              Contact
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
          {detail.bio}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {detail.location}
          </span>
          <Link
            href={detail.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#60A5FA] transition-colors hover:text-[#93C5FD]"
          >
            <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {detail.websiteLabel}
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {headerStats.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-white/12 bg-black/40 px-3.5 py-3 backdrop-blur-md"
            >
              <div className="text-lg font-bold tabular-nums leading-none text-white sm:text-xl">
                {formatOrgStat(value)}
              </div>
              <div className="mt-1.5 text-[11px] text-zinc-400 sm:text-xs">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
