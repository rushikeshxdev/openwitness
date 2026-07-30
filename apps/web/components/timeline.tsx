"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { TimelineEntry } from "./timeline-entry";
import { staggerContainer } from "@/lib/animations";
import { useRef } from "react";

/**
 * Timeline component displays chronological activity entries
 * with vertical layout, connecting line, and dot indicators
 * 
 * **Validates: Requirements 5.1, 5.4**
 * 
 * @example
 * ```tsx
 * <Timeline
 *   entries={[
 *     {
 *       id: '1',
 *       timestamp: new Date(),
 *       eventName: 'Ukraine Protests 2024',
 *       activityType: 'evidence_added',
 *       metadata: { evidenceCount: 5 }
 *     }
 *   ]}
 * />
 * ```
 */

export interface TimelineProps {
  /** Array of timeline entries to display */
  entries: Array<{
    id: string;
    timestamp: Date;
    eventName: string;
    activityType: 'evidence_added' | 'event_created' | 'verification_updated';
    metadata: Record<string, any>;
  }>;
  /** Optional className for custom styling */
  className?: string;
}

export function Timeline({ entries, className }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Sort entries in reverse chronological order (newest first)
  const sortedEntries = [...entries].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        className="relative"
      >
        {/* Vertical connecting line */}
        <div 
          className="absolute left-5 top-10 bottom-10 w-px bg-gradient-to-b from-blue-500/50 via-cyan-500/30 to-blue-500/50"
          aria-hidden="true"
        />

        {/* Timeline entries */}
        <div className="space-y-6">
          {sortedEntries.map((entry, index) => (
            <div key={entry.id} className="relative pl-14">
              {/* Dot indicator */}
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

              {/* Pulsing ring for the first (newest) entry */}
              {index === 0 && (
                <div 
                  className="absolute left-0 top-6 w-10 h-10"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />
                </div>
              )}

              {/* Timeline entry card */}
              <TimelineEntry
                timestamp={entry.timestamp}
                eventName={entry.eventName}
                activityType={entry.activityType}
                metadata={entry.metadata}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
