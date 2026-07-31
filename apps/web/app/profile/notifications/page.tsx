"use client";

import { ProfileShell } from "@/components/profile/profile-shell";
import { ProfileNotificationsList } from "@/components/profile/profile-list-section";
import { markAllNotificationsRead } from "@/lib/profile-store";

export default function ProfileNotificationsPage() {
  return (
    <ProfileShell
      breadcrumb={[
        { label: "Profile", href: "/profile" },
        { label: "Notifications" },
      ]}
    >
      {({ profile, session, refresh }) => (
        <ProfileNotificationsList
          items={profile.notifications}
          onMarkAllRead={() => {
            markAllNotificationsRead(session);
            refresh();
          }}
        />
      )}
    </ProfileShell>
  );
}
