"use client";

import { useState } from "react";
import type { ContributorTabId } from "@/data/profile-data";
import { ProfileBreadcrumb, ProfileGate } from "./profile-gate";
import { ContributorProfileHeader } from "./profile-header-card";
import { ContributorProfileTabs } from "./contributor-profile-tabs";
import { ContributorOverview } from "./contributor-overview";
import { ContributorTabPanel } from "./contributor-tab-panel";

export function ProfileOverviewView() {
  const [tab, setTab] = useState<ContributorTabId>("overview");

  return (
    <ProfileGate>
      {({ profile }) => (
        <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-24 sm:px-6 md:pt-28 lg:px-8">
          <ProfileBreadcrumb />

          <div className="space-y-5">
            <ContributorProfileHeader profile={profile} />
            <ContributorProfileTabs
              profile={profile}
              active={tab}
              onSelect={setTab}
            />
            {tab === "overview" ? (
              <ContributorOverview profile={profile} />
            ) : (
              <ContributorTabPanel tab={tab} profile={profile} />
            )}
          </div>
        </div>
      )}
    </ProfileGate>
  );
}
