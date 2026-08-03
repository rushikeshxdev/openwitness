"use client";

import type { OrgEndorsement } from "@/data/organization-detail-data";
import { BadgeCheck } from "lucide-react";

export function OrgTopEndorsements({
  endorsements,
}: {
  endorsements: OrgEndorsement[];
}) {
  return (
    <section
      className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5"
      aria-labelledby="org-endorsements-heading"
    >
      <h2
        id="org-endorsements-heading"
        className="text-base font-semibold text-white sm:text-lg"
      >
        Top Endorsements
      </h2>
      <ul className="mt-4 flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
        {endorsements.map((org) => (
          <li
            key={org.id}
            className="flex w-[88px] shrink-0 flex-col items-center text-center"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: org.accent }}
              aria-hidden="true"
            >
              {org.initials}
            </div>
            <p className="mt-2 inline-flex max-w-full items-center justify-center gap-0.5 text-xs font-medium text-zinc-200">
              <span className="truncate">{org.name}</span>
              {org.verified ? (
                <BadgeCheck
                  className="h-3 w-3 shrink-0 text-[#3B82F6]"
                  aria-hidden="true"
                />
              ) : null}
            </p>
            <p className="mt-0.5 text-[10px] text-zinc-500">{org.dateLabel}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
