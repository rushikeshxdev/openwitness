"use client";

import { ProfileShell } from "@/components/profile/profile-shell";
import { ProfileListSection } from "@/components/profile/profile-list-section";

export default function ProfileBookmarksPage() {
  return (
    <ProfileShell
      breadcrumb={[
        { label: "Profile", href: "/profile" },
        { label: "Bookmarks" },
      ]}
    >
      {({ profile }) => (
        <ProfileListSection
          title="Bookmarks"
          items={profile.bookmarks}
          emptyTitle="No bookmarks"
          emptyHint="Save events from Explore or Map to find them later."
          emptyCta={{ label: "Explore events", href: "/events" }}
        />
      )}
    </ProfileShell>
  );
}
