"use client";

import { ProfileShell } from "./profile-shell";
import { ProfileHeaderCard } from "./profile-header-card";
import { ProfileActivityChart } from "./profile-activity-chart";
import { ProfileActivityFeed, ProfileBadges } from "./profile-badges";

export function ProfileOverviewView() {
  return (
    <ProfileShell>
      {({ profile }) => (
        <div className="space-y-5">
          <ProfileHeaderCard profile={profile} />

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <ProfileActivityChart series={profile.activitySeries} />
            </div>
            <div className="xl:col-span-4">
              <ProfileBadges badges={profile.badges} />
            </div>
          </div>

          <ProfileActivityFeed items={profile.recentActivity} />
        </div>
      )}
    </ProfileShell>
  );
}
