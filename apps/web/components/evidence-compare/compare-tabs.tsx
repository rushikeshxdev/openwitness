"use client";

import { cn } from "@/lib/utils";
import { COMPARE_TABS, type CompareTabId } from "@/data/compare-evidence-data";

export function CompareTabs({
  active,
  onSelect,
}: {
  active: CompareTabId;
  onSelect: (tab: CompareTabId) => void;
}) {
  return (
    <div
      className="flex gap-0.5 overflow-x-auto border-b border-white/10 scrollbar-hide"
      role="tablist"
      aria-label="Comparison sections"
    >
      {COMPARE_TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(tab.id)}
            className={cn(
              "relative shrink-0 px-3.5 py-3 text-sm font-medium whitespace-nowrap transition-colors sm:px-4",
              isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            {tab.label}
            {isActive ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#3B82F6]" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
