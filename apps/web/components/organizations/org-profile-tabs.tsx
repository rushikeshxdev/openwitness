"use client";

import { cn } from "@/lib/utils";
import {
  ORG_PROFILE_NAV,
  formatOrgStat,
  type OrgProfileSection,
  type OrganizationDetailViewModel,
} from "@/data/organization-detail-data";

export function OrgProfileTabs({
  detail,
  active,
  onSelect,
}: {
  detail: OrganizationDetailViewModel;
  active: OrgProfileSection;
  onSelect: (section: OrgProfileSection) => void;
}) {
  return (
    <div
      className="flex gap-0.5 overflow-x-auto border-b border-white/10 scrollbar-hide"
      role="tablist"
      aria-label="Organization sections"
    >
      {ORG_PROFILE_NAV.map((item) => {
        const isActive = active === item.id;
        const count =
          item.countKey != null ? detail.counts[item.countKey] : undefined;
        const label =
          count != null ? `${item.label} (${formatOrgStat(count)})` : item.label;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(item.id)}
            className={cn(
              "relative shrink-0 px-3.5 py-3 text-sm font-medium whitespace-nowrap transition-colors sm:px-4",
              isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            {label}
            {isActive ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#3B82F6]" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
