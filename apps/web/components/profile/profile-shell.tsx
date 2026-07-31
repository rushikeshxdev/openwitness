"use client";

import type { ReactNode } from "react";
import type { MockSessionUser } from "@/lib/auth-session";
import type { ProfileViewModel } from "@/data/profile-data";
import { ProfileBreadcrumb, ProfileGate } from "./profile-gate";
import { ProfileContributorCta, ProfileSidebar } from "./profile-sidebar";

export function ProfileShell({
  breadcrumb,
  children,
  showContributorCta = true,
}: {
  breadcrumb?: { label: string; href?: string }[];
  children: (ctx: {
    session: MockSessionUser;
    profile: ProfileViewModel;
    refresh: () => void;
  }) => ReactNode;
  showContributorCta?: boolean;
}) {
  return (
    <ProfileGate>
      {({ session, profile, refresh }) => (
        <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-24 sm:px-6 md:pt-28 lg:px-8">
          <ProfileBreadcrumb trail={breadcrumb} />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
            <aside className="space-y-4 lg:col-span-3">
              <div className="hidden overflow-hidden rounded-2xl border border-white/12 bg-[#121214]/90 lg:block">
                <ProfileSidebar profile={profile} variant="vertical" />
              </div>
              <div className="rounded-2xl border border-white/12 bg-[#121214]/90 p-2 lg:hidden">
                <ProfileSidebar profile={profile} variant="horizontal" />
              </div>
              {showContributorCta ? <ProfileContributorCta /> : null}
            </aside>

            <div className="min-w-0 lg:col-span-9">
              {children({ session, profile, refresh })}
            </div>
          </div>
        </div>
      )}
    </ProfileGate>
  );
}
