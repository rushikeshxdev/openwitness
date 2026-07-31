"use client";

import { ProfileShell } from "@/components/profile/profile-shell";
import { ProfileListSection } from "@/components/profile/profile-list-section";

export default function ProfileFollowingPage() {
  return (
    <ProfileShell
      breadcrumb={[
        { label: "Profile", href: "/profile" },
        { label: "Following" },
      ]}
    >
      {({ profile }) => (
        <ProfileListSection
          title="Following"
          items={profile.following}
          emptyTitle="Not following anyone yet"
          emptyHint="Follow organizations and live events to track updates."
          emptyCta={{ label: "Open map", href: "/map" }}
        />
      )}
    </ProfileShell>
  );
}
