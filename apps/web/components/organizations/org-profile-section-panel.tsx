"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  formatOrgStat,
  type OrgProfileSection,
  type OrganizationDetailViewModel,
} from "@/data/organization-detail-data";
import { OrgAboutSection } from "./org-about-section";
import { OrgActiveEvents } from "./org-active-events";
import { OrgRecentActivity } from "./org-recent-activity";
import { OrgTopEndorsements } from "./org-top-endorsements";
import { OrgRecentReports } from "./org-recent-reports";

function SectionPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5">
      <h2 className="text-base font-semibold text-white sm:text-lg">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function OrgProfileSectionPanel({
  section,
  detail,
}: {
  section: OrgProfileSection;
  detail: OrganizationDetailViewModel;
}) {
  switch (section) {
    case "overview":
      return null;
    case "events":
      return <OrgActiveEvents events={detail.activeEvents} />;
    case "reports":
      return <OrgRecentReports reports={detail.recentReports} />;
    case "evidence":
      return (
        <SectionPanel title="Evidence">
          <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-5">
            <p className="text-2xl font-bold tabular-nums text-white">
              {formatOrgStat(detail.counts.evidence)}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Evidence items associated with this organization.
            </p>
            <Link
              href="/events"
              className="mt-3 inline-block text-sm font-medium text-[#60A5FA] hover:text-[#93C5FD]"
            >
              Browse related events
            </Link>
          </div>
        </SectionPanel>
      );
    case "activity":
      return <OrgRecentActivity items={detail.recentActivity} />;
    case "team":
      return (
        <SectionPanel title="Team">
          <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-5">
            <p className="text-2xl font-bold tabular-nums text-white">
              {formatOrgStat(detail.counts.team)}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Team members contributing on behalf of {detail.fullName}.
            </p>
          </div>
        </SectionPanel>
      );
    case "followers":
      return (
        <SectionPanel title="Followers">
          <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-5">
            <p className="text-2xl font-bold tabular-nums text-white">
              {formatOrgStat(detail.counts.followers)}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              People following this organization on OpenWitness.
            </p>
          </div>
        </SectionPanel>
      );
    case "endorsements":
      return (
        <div className="space-y-3">
          <OrgTopEndorsements endorsements={detail.topEndorsements} />
          <p className="px-1 text-sm text-zinc-400">
            {formatOrgStat(detail.counts.endorsements)} total endorsements.
          </p>
        </div>
      );
    case "about":
      return <OrgAboutSection detail={detail} />;
    default:
      return null;
  }
}
