"use client";

import { cn } from "@/lib/utils";
import { motion, useInView, MotionConfig } from "framer-motion";
import { TimelineEntry as TimelineEntryCard } from "./timeline-entry";
import { staggerContainer } from "@/lib/animations";
import { useRef } from "react";
import type { TimelineEntry as TimelineEntryData } from "@/data/timeline-data";

export interface TimelineProps {
  entries: TimelineEntryData[];
  className?: string;
}

export function Timeline({ entries, className }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const sortedEntries = [...entries].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} className={cn("relative", className)}>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          className="relative"
        >
          <div
            className="absolute left-5 top-10 bottom-10 w-px bg-gradient-to-b from-blue-500/50 via-cyan-500/30 to-blue-500/50"
            aria-hidden="true"
          />

          <ol className="space-y-6 list-none m-0 p-0">
            {sortedEntries.map((entry, index) => (
              <li key={entry.id} className="relative pl-14">
                <div
                  className={cn(
                    "absolute left-0 top-6 w-10 h-10 rounded-full",
                    "bg-gradient-to-br from-blue-500 to-cyan-500",
                    "flex items-center justify-center",
                    "border-4 border-background-primary",
                    "shadow-lg shadow-blue-500/30",
                    "z-10"
                  )}
                  aria-hidden="true"
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {index === 0 && (
                  <div
                    className="absolute left-0 top-6 w-10 h-10 motion-safe:animate-ping"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 rounded-full bg-blue-500/30" />
                  </div>
                )}

                <TimelineEntryCard
                  timestamp={entry.timestamp}
                  eventName={entry.eventName}
                  activityType={entry.activityType}
                  summary={entry.summary}
                  metadata={entry.metadata}
                />
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
