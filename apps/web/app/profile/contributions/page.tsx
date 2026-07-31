"use client";

import { ProfileShell } from "@/components/profile/profile-shell";
import { ProfileListSection } from "@/components/profile/profile-list-section";

export default function ProfileContributionsPage() {
  return (
    <ProfileShell
      breadcrumb={[
        { label: "Profile", href: "/profile" },
        { label: "Contributions" },
      ]}
    >
      {({ profile }) => (
        <ProfileListSection
          title="Contributions"
          items={profile.contributions}
          emptyTitle="No contributions yet"
          emptyHint="Verify evidence or add timeline notes to build your record."
          emptyCta={{ label: "Explore events", href: "/events" }}
        />
      )}
    </ProfileShell>
  );
}
