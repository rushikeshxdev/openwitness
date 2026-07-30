"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ACCENT_HEX,
  groupEntriesByDate,
  type EventTimelineEntry,
} from "@/data/event-timeline-data";
import { EventTimelineEntryCard } from "./event-timeline-entry-card";
import { ChevronDown } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";

export interface EventTimelineFeedProps {
  entries: EventTimelineEntry[];
  hasMore: boolean;
  onLoadMore: () => void;
  className?: string;
}

export function EventTimelineFeed({
  entries,
  hasMore,
  onLoadMore,
  className,
}: EventTimelineFeedProps) {
  const groups = groupEntriesByDate(entries);

  if (entries.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center",
          className
        )}
      >
        <p className="text-sm font-medium text-zinc-300">No updates found</p>
        <p className="mt-1 text-xs text-zinc-500">
          Try another category or clear the date filter.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {groups.map((group) => (
        <section key={group.dateKey} id={`timeline-date-${group.dateKey}`}>
          <div className="mb-5 flex justify-center">
            <span className="rounded-full border border-white/12 bg-[#121214]/90 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md">
              {group.dateLabel}
            </span>
          </div>

          <motion.ol
            className="relative space-y-0"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Vertical rail */}
            <div
              className="absolute bottom-4 left-[4.25rem] top-4 w-px bg-white/10 sm:left-[5.25rem]"
              aria-hidden="true"
            />

            {group.items.map((item, index) => (
              <motion.li
                key={item.id}
                variants={fadeUp}
                className={cn(
                  "relative grid grid-cols-[3.5rem_1.25rem_1fr] gap-x-2 sm:grid-cols-[4.5rem_1.25rem_1fr] sm:gap-x-3",
                  index < group.items.length - 1 && "pb-5"
                )}
              >
                <time className="pt-4 text-right text-xs font-medium tabular-nums text-zinc-500 sm:text-sm">
                  {item.timeLabel}
                </time>
                <div className="relative flex justify-center pt-[1.15rem]">
                  <span
                    className="relative z-10 h-3 w-3 rounded-full ring-4 ring-[#0B0E11]"
                    style={{ backgroundColor: ACCENT_HEX[item.accent] }}
                    aria-hidden="true"
                  />
                </div>
                <EventTimelineEntryCard entry={item} />
              </motion.li>
            ))}
          </motion.ol>
        </section>
      ))}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onLoadMore}
            className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-[#121214]/80 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/5 hover:text-white"
          >
            Load more updates
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
