"use client";

import type { OrganizationDetailViewModel } from "@/data/organization-detail-data";
import { OrgAboutSection } from "./org-about-section";
import { OrgActiveEvents } from "./org-active-events";
import { OrgImpactGlance } from "./org-impact-glance";
import { OrgRecentActivity } from "./org-recent-activity";
import { OrgTopEndorsements } from "./org-top-endorsements";
import { OrgRecentReports } from "./org-recent-reports";

export function OrgProfileOverview({
  detail,
}: {
  detail: OrganizationDetailViewModel;
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-7">
          <OrgAboutSection detail={detail} />
          <OrgActiveEvents events={detail.activeEvents} />
        </div>
        <div className="space-y-5 xl:col-span-5">
          <OrgImpactGlance
            stats={detail.impactStats}
            period={detail.impactPeriod}
          />
          <OrgRecentActivity items={detail.recentActivity} />
          <OrgTopEndorsements endorsements={detail.topEndorsements} />
        </div>
      </div>
      <OrgRecentReports reports={detail.recentReports} />
    </div>
  );
}
