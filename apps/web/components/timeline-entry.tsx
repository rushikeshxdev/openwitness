"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GlassCard } from "./glass-card";
import { fadeUp } from "@/lib/animations";
import { Clock, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { memo, useMemo } from "react";
import { LANDING_REFERENCE_TIME } from "@/data/events-data";
import type { TimelineActivityType } from "@/data/timeline-data";

export interface TimelineEntryProps {
  timestamp: Date;
  eventName: string;
  activityType: TimelineActivityType;
  summary: string;
  metadata: Record<string, unknown>;
  className?: string;
  /** Reference "now" for relative formatting (defaults to landing reference) */
  now?: Date;
}

function formatRelativeTime(date: Date, now: Date): string {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getActivityTypeInfo(type: TimelineActivityType) {
  switch (type) {
    case "evidence_added":
      return { icon: FileText, label: "Evidence Added", color: "text-blue-400" };
    case "event_created":
      return { icon: AlertCircle, label: "Event Created", color: "text-cyan-400" };
    case "verification_updated":
      return {
        icon: CheckCircle,
        label: "Verification Updated",
        color: "text-green-400",
      };
  }
}

function TimelineEntryComponent({
  timestamp,
  eventName,
  activityType,
  summary,
  metadata,
  className,
  now = LANDING_REFERENCE_TIME,
}: TimelineEntryProps) {
  const activityInfo = useMemo(
    () => getActivityTypeInfo(activityType),
    [activityType]
  );
  const ActivityIcon = activityInfo.icon;
  const relative = formatRelativeTime(timestamp, now);
  const absolute = timestamp.toISOString();

  return (
    <motion.div variants={fadeUp} className={cn("relative", className)}>
      <GlassCard variant="hover-lift" className="p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex-shrink-0 w-9 h-9 rounded-lg",
              "bg-white/5 border border-white/10",
              "flex items-center justify-center",
              activityInfo.color
            )}
            aria-hidden="true"
          >
            <ActivityIcon className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm md:text-base font-medium text-white leading-snug">
              {summary || eventName}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-tertiary">
              <time dateTime={absolute} title={timestamp.toLocaleString()}>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {relative}
                </span>
              </time>

              {typeof metadata.evidenceCount === "number" && (
                <span className="inline-flex items-center gap-1">
                  <FileText className="w-3 h-3" aria-hidden="true" />
                  {metadata.evidenceCount}{" "}
                  {metadata.evidenceCount === 1 ? "item" : "items"}
                </span>
              )}

              {typeof metadata.verificationStatus === "string" && (
                <span className="capitalize">{metadata.verificationStatus}</span>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export const TimelineEntry = memo(TimelineEntryComponent);
