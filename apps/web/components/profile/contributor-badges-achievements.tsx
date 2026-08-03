"use client";

import { cn } from "@/lib/utils";
import type { ProfileAchievement, ProfileBadge } from "@/data/profile-data";
import { Award, Trophy } from "lucide-react";

const TONE: Record<ProfileBadge["tone"], string> = {
  blue: "bg-[#3B82F6]/15 text-[#60A5FA] border-[#3B82F6]/25",
  emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  amber: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  violet: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  rose: "bg-rose-500/15 text-rose-400 border-rose-500/25",
};

export function ContributorBadgesAchievements({
  badges,
  achievements,
}: {
  badges: ProfileBadge[];
  achievements: ProfileAchievement[];
}) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <section
        className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5 lg:col-span-7"
        aria-labelledby="badges-heading"
      >
        <h2
          id="badges-heading"
          className="text-base font-semibold text-white sm:text-lg"
        >
          Badges
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {badges.map((b) => (
            <li
              key={b.id}
              className="flex flex-col items-center rounded-xl border border-white/10 bg-black/25 px-2 py-3 text-center"
            >
              <span
                className={cn(
                  "inline-flex h-12 w-12 items-center justify-center rounded-xl border",
                  TONE[b.tone]
                )}
              >
                <Award className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-2 text-xs font-semibold text-white">{b.title}</p>
              {b.subtitle ? (
                <p className="mt-0.5 text-[10px] leading-snug text-zinc-500">
                  {b.subtitle}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section
        className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5 lg:col-span-5"
        aria-labelledby="achievements-heading"
      >
        <h2
          id="achievements-heading"
          className="text-base font-semibold text-white sm:text-lg"
        >
          Achievements
        </h2>
        <ul className="mt-3 divide-y divide-white/10">
          {achievements.map((a) => (
            <li key={a.id} className="flex gap-3 py-3 first:pt-1 last:pb-0">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <Trophy className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200">{a.title}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{a.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
