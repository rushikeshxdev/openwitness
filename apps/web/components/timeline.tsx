"use client";

import { cn } from "@/lib/utils";
import { motion, useInView, MotionConfig } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useRef } from "react";
import type { TimelineEntry as TimelineEntryData } from "@/data/timeline-data";
import { LANDING_REFERENCE_TIME } from "@/data/events-data";
import { GlassCard } from "./glass-card";

export interface TimelineProps {
  entries: TimelineEntryData[];
  className?: string;
}

function formatRelativeTime(date: Date, now: Date = LANDING_REFERENCE_TIME): string {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/**
 * Compact timeline in a single glass panel (mockup style)
 */
export function Timeline({ entries, className }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const sortedEntries = [...entries].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <MotionConfig reducedMotion="user">
      <GlassCard
        className={cn(
          "p-5 sm:p-6 bg-[#121214]/90 border-white/[0.12]",
          className
        )}
      >
        <div ref={ref} className="relative">
          <motion.ol
            variants={staggerContainer}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            className="relative space-y-0 list-none m-0 p-0"
          >
            {/* Vertical line */}
            <div
              className="absolute left-[6px] top-2 bottom-2 w-px bg-white/10"
              aria-hidden="true"
            />

            {sortedEntries.map((entry, index) => {
              const relative = formatRelativeTime(entry.timestamp);
              const isFirst = index === 0;

              return (
                <motion.li
                  key={entry.id}
                  variants={fadeUp}
                  className={cn(
                    "relative pl-7 py-3.5",
                    index === 0 && "pt-0",
                    index === sortedEntries.length - 1 && "pb-0"
                  )}
                >
                  {/* Node — aligned with the time label */}
                  <span
                    className={cn(
                      "absolute left-0 w-3 h-3 rounded-full border-2 z-10",
                      index === 0 ? "top-0.5" : "top-[1.05rem]",
                      isFirst
                        ? "bg-[#3B82F6] border-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.7)]"
                        : "bg-[#0a0a0c] border-[#3B82F6]/80"
                    )}
                    aria-hidden="true"
                  />

                  <div className="min-w-0">
                    <time
                      dateTime={entry.timestamp.toISOString()}
                      className="block text-xs sm:text-sm font-medium text-zinc-500 mb-1.5"
                    >
                      {relative}
                    </time>
                    <p className="text-sm sm:text-base text-zinc-200 leading-snug">
                      {entry.summary}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </GlassCard>
    </MotionConfig>
  );
}
