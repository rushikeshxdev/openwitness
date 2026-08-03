"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  formatPoints,
  getInitials,
  type ProfileTrustScore,
  type ProfileViewModel,
} from "@/data/profile-data";
import {
  BadgeCheck,
  Calendar,
  Github,
  Globe,
  Linkedin,
  MapPin,
  Shield,
  Twitter,
} from "lucide-react";

function TrustScoreGauge({ trust }: { trust: ProfileTrustScore }) {
  const pct = Math.min(100, Math.max(0, (trust.score / trust.max) * 100));
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 text-sm font-medium text-zinc-400">Trust Score</p>
      <div className="relative h-[112px] w-[112px]">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B82F6]/15 text-[#60A5FA]">
            <Shield className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums text-white">
        {trust.score}
        <span className="text-base font-medium text-zinc-500">/{trust.max}</span>
      </p>
      <p className="mt-0.5 text-sm font-semibold text-emerald-400">{trust.label}</p>
    </div>
  );
}

export function ContributorProfileHeader({
  profile,
}: {
  profile: ProfileViewModel;
}) {
  return (
    <section className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start">
          <div
            className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/10 bg-[#3B82F6]/20 text-2xl font-bold text-[#93C5FD] sm:h-28 sm:w-28"
            aria-hidden="true"
          >
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(profile.name)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {profile.name}
              </h1>
              <Link
                href="/profile/settings?section=profile"
                className="inline-flex min-h-9 items-center rounded-xl border border-white/12 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-zinc-200 hover:bg-white/[0.08]"
              >
                Edit Profile
              </Link>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-zinc-400">@{profile.handle}</span>
              {profile.verified ? (
                <span className="inline-flex items-center gap-1 font-medium text-[#A78BFA]">
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                  Verified Contributor
                </span>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {profile.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {profile.joinLabel}
              </span>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
              {profile.bio}
            </p>

            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              {profile.links.github ? (
                <SocialLink href={profile.links.github} label="GitHub">
                  <Github className="h-4 w-4" />
                </SocialLink>
              ) : null}
              {profile.links.linkedin ? (
                <SocialLink href={profile.links.linkedin} label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </SocialLink>
              ) : null}
              {profile.links.website ? (
                <SocialLink href={profile.links.website} label="Website">
                  <Globe className="h-4 w-4" />
                </SocialLink>
              ) : null}
              {profile.links.twitter ? (
                <SocialLink href={profile.links.twitter} label="X">
                  <Twitter className="h-4 w-4" />
                </SocialLink>
              ) : null}
            </div>
          </div>
        </div>

        <div className="shrink-0 rounded-2xl border border-white/10 bg-black/30 px-5 py-4 sm:min-w-[160px]">
          <TrustScoreGauge trust={profile.trustScore} />
        </div>
      </div>
    </section>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
    >
      {children}
    </a>
  );
}

/** Legacy export for settings / other pages */
export function ProfileHeaderCard({ profile }: { profile: ProfileViewModel }) {
  return <ContributorProfileHeader profile={profile} />;
}

export function ProfileStatsStrip({
  profile,
  className,
}: {
  profile: ProfileViewModel;
  className?: string;
}) {
  const items = [
    { label: "Reports", value: String(profile.stats.reports) },
    { label: "Bookmarks", value: String(profile.stats.bookmarks) },
    { label: "Following", value: String(profile.stats.following) },
    { label: "Points", value: formatPoints(profile.stats.points) },
    { label: "Verifications", value: String(profile.stats.verifications) },
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5",
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-center"
        >
          <p className="text-lg font-bold tabular-nums text-white">
            {item.value}
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
