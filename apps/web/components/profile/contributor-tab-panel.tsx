"use client";

import Link from "next/link";
import type {
  ContributorTabId,
  ProfileListItem,
  ProfileViewModel,
} from "@/data/profile-data";
import { ProfileActivityFeed } from "./profile-badges";
import { ContributorBadgesAchievements } from "./contributor-badges-achievements";
import { ContributorRecentContributions } from "./contributor-recent-contributions";

function ListPanel({
  title,
  items,
  empty,
}: {
  title: string;
  items: ProfileListItem[];
  empty: string;
}) {
  return (
    <section className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5">
      <h2 className="text-base font-semibold text-white sm:text-lg">{title}</h2>
      <ul className="mt-3 divide-y divide-white/10">
        {items.length === 0 ? (
          <li className="py-8 text-center text-sm text-zinc-500">{empty}</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="py-3 first:pt-1">
              {item.href ? (
                <Link
                  href={item.href}
                  className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
                >
                  <ListRow item={item} />
                </Link>
              ) : (
                <ListRow item={item} />
              )}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

function ListRow({ item }: { item: ProfileListItem }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-200">{item.title}</p>
        <p className="mt-0.5 text-xs text-zinc-500">{item.meta}</p>
      </div>
      {item.status ? (
        <span className="shrink-0 rounded-md border border-white/10 bg-black/30 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
          {item.status}
        </span>
      ) : null}
    </div>
  );
}

export function ContributorTabPanel({
  tab,
  profile,
}: {
  tab: ContributorTabId;
  profile: ProfileViewModel;
}) {
  switch (tab) {
    case "overview":
      return null;
    case "activity":
      return <ProfileActivityFeed items={profile.recentActivity} />;
    case "contributions":
      return (
        <ContributorRecentContributions items={profile.recentContributions} />
      );
    case "reviews":
      return (
        <ListPanel
          title="Reviews"
          items={profile.reviews}
          empty="No reviews yet."
        />
      );
    case "badges":
      return (
        <ContributorBadgesAchievements
          badges={profile.badges}
          achievements={profile.achievements}
        />
      );
    case "following":
      return (
        <ListPanel
          title="Following"
          items={profile.following}
          empty="Not following anyone yet."
        />
      );
    case "followers":
      return (
        <ListPanel
          title="Followers"
          items={profile.followers}
          empty="No followers yet."
        />
      );
    default:
      return null;
  }
}
