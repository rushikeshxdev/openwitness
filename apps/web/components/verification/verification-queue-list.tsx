"use client";

import { cn } from "@/lib/utils";
import {
  countByMediaTab,
  type VerificationMediaTab,
  type VerificationQueueItem,
  type VerificationSort,
} from "@/data/verification-queue-data";
import { VerificationQueueItem as QueueCard } from "./verification-queue-item";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

const MEDIA_TABS: Array<{ id: VerificationMediaTab; label: string }> = [
  { id: "all", label: "All" },
  { id: "image", label: "Images" },
  { id: "video", label: "Videos" },
  { id: "audio", label: "Audios" },
  { id: "document", label: "Documents" },
  { id: "other", label: "Others" },
];

export function VerificationQueueList({
  items,
  allItems,
  media,
  sort,
  selectedId,
  onMediaChange,
  onSortChange,
  onSelect,
}: {
  items: VerificationQueueItem[];
  allItems: VerificationQueueItem[];
  media: VerificationMediaTab;
  sort: VerificationSort;
  selectedId: string | null;
  onMediaChange: (media: VerificationMediaTab) => void;
  onSortChange: (sort: VerificationSort) => void;
  onSelect: (id: string) => void;
}) {
  const counts = countByMediaTab(allItems);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 space-y-3 border-b border-white/10 px-3 pb-3 pt-1 sm:px-4">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          {MEDIA_TABS.map((tab) => {
            const active = media === tab.id;
            const count = counts[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onMediaChange(tab.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-[#3B82F6] bg-[#3B82F6] text-white"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
                )}
              >
                {tab.label}
                <span className={cn("ml-1.5 tabular-nums", active ? "text-white/80" : "text-zinc-600")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            Filters
          </button>
          <button
            type="button"
            onClick={() =>
              onSortChange(sort === "newest" ? "oldest" : "newest")
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white"
          >
            {sort === "newest" ? "Newest First" : "Oldest First"}
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 sm:p-4">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-white">No evidence in this filter</p>
            <p className="mt-1 text-xs text-zinc-500">
              Try another media type or clear filters.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <QueueCard
              key={item.id}
              item={item}
              selected={item.id === selectedId}
              onSelect={() => onSelect(item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
