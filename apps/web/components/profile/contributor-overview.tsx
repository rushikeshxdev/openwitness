"use client";

import type { ProfileViewModel } from "@/data/profile-data";
import { ContributorStatsRow } from "./contributor-stats-row";
import { ContributorHeatmap } from "./contributor-heatmap";
import { ContributorRecentContributions } from "./contributor-recent-contributions";
import { ContributorBadgesAchievements } from "./contributor-badges-achievements";
import {
  ContributorOrgsWorkedWith,
  ContributorReputation,
  ContributorSkills,
} from "./contributor-sidebar-cards";

export function ContributorOverview({
  profile,
}: {
  profile: ProfileViewModel;
}) {
  return (
    <div className="space-y-5">
      <ContributorStatsRow stats={profile.contributorStats} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <ContributorHeatmap
            cells={profile.heatmap}
            year={profile.heatmapYear}
            stats={profile.heatmapStats}
          />
          <ContributorRecentContributions items={profile.recentContributions} />
          <ContributorBadgesAchievements
            badges={profile.badges}
            achievements={profile.achievements}
          />
        </div>

        <div className="space-y-5 xl:col-span-4">
          <ContributorReputation
            items={profile.reputation}
            total={profile.reputationTotal}
          />
          <ContributorSkills skills={profile.skills} />
          <ContributorOrgsWorkedWith orgs={profile.organizationsWorkedWith} />
        </div>
      </div>
    </div>
  );
}
