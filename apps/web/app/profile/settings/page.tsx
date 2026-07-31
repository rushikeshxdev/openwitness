"use client";

import { Suspense } from "react";
import { ProfileGate, ProfileBreadcrumb } from "@/components/profile/profile-gate";
import { SettingsShell } from "@/components/profile/settings/settings-shell";

function SettingsContent() {
  return (
    <ProfileGate>
      {({ session, profile, refresh }) => (
        <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-24 sm:px-6 md:pt-28 lg:px-8">
          <ProfileBreadcrumb
            trail={[
              { label: "Profile", href: "/profile" },
              { label: "Settings" },
            ]}
          />
          <SettingsShell
            profile={profile}
            session={session}
            refresh={refresh}
          />
        </div>
      )}
    </ProfileGate>
  );
}

export default function ProfileSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1440px] px-4 pt-28">
          <div className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
