"use client";

import { useState } from "react";
import type {
  OrgProfileSection,
  OrganizationDetailViewModel,
} from "@/data/organization-detail-data";
import { OrgProfileSidebar } from "./org-profile-sidebar";
import { OrgProfileHeader } from "./org-profile-header";
import { OrgProfileTabs } from "./org-profile-tabs";
import { OrgProfileOverview } from "./org-profile-overview";
import { OrgProfileSectionPanel } from "./org-profile-section-panel";

export function OrganizationProfileView({
  detail,
}: {
  detail: OrganizationDetailViewModel;
}) {
  const [section, setSection] = useState<OrgProfileSection>("overview");
  const [following, setFollowing] = useState(false);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-24 sm:px-6 md:pt-28 lg:px-8">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        <aside className="space-y-4 lg:col-span-3">
          <div className="hidden overflow-hidden rounded-2xl border border-white/12 bg-[#121214]/90 lg:flex lg:min-h-[28rem] lg:flex-col">
            <OrgProfileSidebar
              detail={detail}
              active={section}
              onSelect={setSection}
              variant="vertical"
            />
          </div>
          <div className="rounded-2xl border border-white/12 bg-[#121214]/90 p-2 lg:hidden">
            <OrgProfileSidebar
              detail={detail}
              active={section}
              onSelect={setSection}
              variant="horizontal"
            />
          </div>
        </aside>

        <div className="min-w-0 space-y-5 lg:col-span-9">
          <OrgProfileHeader
            detail={detail}
            following={following}
            onToggleFollow={() => setFollowing((v) => !v)}
          />
          <OrgProfileTabs
            detail={detail}
            active={section}
            onSelect={setSection}
          />
          {section === "overview" ? (
            <OrgProfileOverview detail={detail} />
          ) : (
            <OrgProfileSectionPanel section={section} detail={detail} />
          )}
        </div>
      </div>
    </div>
  );
}
