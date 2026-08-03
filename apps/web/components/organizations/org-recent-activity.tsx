"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import type { OrgActivityItem, OrgActivityKind } from "@/data/organization-detail-data";
import {
  BadgeCheck,
  FileText,
  FolderOpen,
  ThumbsUp,
  Users,
} from "lucide-react";

const KIND_ICON: Record<OrgActivityKind, ComponentType<{ className?: string }>> = {
  endorsement: ThumbsUp,
  evidence: BadgeCheck,
  report: FileText,
  event: FolderOpen,
  follow: Users,
};

export function OrgRecentActivity({ items }: { items: OrgActivityItem[] }) {
  return (
    <section
      className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5"
      aria-labelledby="org-activity-heading"
    >
      <h2
        id="org-activity-heading"
        className="text-base font-semibold text-white sm:text-lg"
      >
        Recent Activity
      </h2>
      <ul className="mt-3 divide-y divide-white/10">
        {items.map((item) => {
          const Icon = KIND_ICON[item.kind];
          return (
            <li key={item.id} className="flex gap-3 py-3 first:pt-1 last:pb-0">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/30 text-[#60A5FA]">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-zinc-300">
                  {item.text}
                  {item.linkLabel ? (
                    <>
                      {" "}
                      {item.linkHref ? (
                        <Link
                          href={item.linkHref}
                          className="font-medium text-[#60A5FA] hover:text-[#93C5FD]"
                        >
                          {item.linkLabel}
                        </Link>
                      ) : (
                        <span className="font-medium text-zinc-200">
                          {item.linkLabel}
                        </span>
                      )}
                    </>
                  ) : null}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{item.relativeLabel}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
