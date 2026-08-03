"use client";

import Link from "next/link";
import type {
  ProfileOrgWorkedWith,
  ProfileReputationItem,
} from "@/data/profile-data";

export function ContributorReputation({
  items,
  total,
  max = 100,
}: {
  items: ProfileReputationItem[];
  total: number;
  max?: number;
}) {
  return (
    <section
      className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5"
      aria-labelledby="reputation-heading"
    >
      <h2
        id="reputation-heading"
        className="text-base font-semibold text-white sm:text-lg"
      >
        Reputation Breakdown
      </h2>
      <ul className="mt-4 space-y-3.5">
        {items.map((item) => {
          const pct = Math.round((item.value / item.max) * 100);
          return (
            <li key={item.id}>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-zinc-300">{item.label}</span>
                <span className="tabular-nums text-zinc-400">
                  {item.value}/{item.max}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: item.color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-sm">
        <span className="font-medium text-zinc-400">Total</span>
        <span className="font-bold tabular-nums text-white">
          {total}/{max}
        </span>
      </div>
    </section>
  );
}

export function ContributorSkills({ skills }: { skills: string[] }) {
  return (
    <section
      className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5"
      aria-labelledby="skills-heading"
    >
      <h2
        id="skills-heading"
        className="text-base font-semibold text-white sm:text-lg"
      >
        Top Skills
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li
            key={skill}
            className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-xs font-medium text-zinc-300"
          >
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ContributorOrgsWorkedWith({
  orgs,
}: {
  orgs: ProfileOrgWorkedWith[];
}) {
  return (
    <section
      className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5"
      aria-labelledby="orgs-heading"
    >
      <h2
        id="orgs-heading"
        className="text-base font-semibold text-white sm:text-lg"
      >
        Organizations Worked With
      </h2>
      <ul className="mt-3 divide-y divide-white/10">
        {orgs.map((org) => {
          const content = (
            <>
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: org.accent }}
                aria-hidden="true"
              >
                {org.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-200 group-hover:text-white">
                  {org.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {org.contributions} contributions
                </p>
              </div>
            </>
          );

          return (
            <li key={org.id} className="py-2.5 first:pt-0 last:pb-0">
              {org.href ? (
                <Link
                  href={org.href}
                  className="group flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
                >
                  {content}
                </Link>
              ) : (
                <div className="flex items-center gap-3">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
