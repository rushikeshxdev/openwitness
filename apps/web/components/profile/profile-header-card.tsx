"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  formatPoints,
  getInitials,
  type ProfileViewModel,
} from "@/data/profile-data";
import { ProfilePanel } from "./profile-gate";
import {
  BadgeCheck,
  Github,
  Globe,
  Linkedin,
  MapPin,
  Twitter,
} from "lucide-react";

export function ProfileHeaderCard({ profile }: { profile: ProfileViewModel }) {
  return (
    <ProfilePanel className="p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#3B82F6]/20 text-lg font-bold text-[#93C5FD] sm:h-20 sm:w-20 sm:text-xl"
          aria-hidden="true"
        >
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt=""
              className="h-full w-full rounded-2xl object-cover"
            />
          ) : (
            getInitials(profile.name)
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              {profile.name}
            </h1>
            {profile.verified ? (
              <BadgeCheck
                className="h-5 w-5 text-[#3B82F6]"
                aria-label="Verified"
              />
            ) : null}
          </div>
          <p className="mt-1 text-sm text-zinc-400">@{profile.handle}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-zinc-400">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {profile.location}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300">
            {profile.bio}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {profile.links.github ? (
              <SocialLink href={profile.links.github} label="GitHub">
                <Github className="h-4 w-4" />
              </SocialLink>
            ) : null}
            {profile.links.twitter ? (
              <SocialLink href={profile.links.twitter} label="Twitter">
                <Twitter className="h-4 w-4" />
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
          </div>
        </div>

        <Link
          href="/profile/settings?section=profile"
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-white/10"
        >
          Edit Profile
        </Link>
      </div>

      <ProfileStatsStrip profile={profile} className="mt-5" />
    </ProfilePanel>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white"
    >
      {children}
    </a>
  );
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
