"use client";

import { ProfileShell } from "@/components/profile/profile-shell";
import { ProfileListSection } from "@/components/profile/profile-list-section";

export default function ProfileReportsPage() {
  return (
    <ProfileShell breadcrumb={[{ label: "Profile", href: "/profile" }, { label: "My Reports" }]}>
      {({ profile }) => (
        <ProfileListSection
          title="My Reports"
          items={profile.reports}
          emptyTitle="No reports yet"
          emptyHint="Document an incident to see it listed here."
          emptyCta={{ label: "Report Incident", href: "/report" }}
        />
      )}
    </ProfileShell>
  );
}
