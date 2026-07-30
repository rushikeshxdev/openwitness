"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GlassCard } from "./glass-card";
import { fadeUp } from "@/lib/animations";
import { Clock, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useState, memo, useMemo } from "react";

/**
 * TimelineEntry component displays a single activity entry in the timeline
 * with glassmorphism styling, timestamp, event details, and activity type
 * Optimized with React.memo to prevent unnecessary re-renders
 * 
 * **Validates: Requirements 5.3, 5.6**
 * 
 * @example
 * ```tsx
 * <TimelineEntry
 *   timestamp={new Date()}
 *   eventName="Ukraine Protests 2024"
 *   activityType="evidence_added"
 *   metadata={{ evidenceCount: 5, userName: "John Doe" }}
 * />
 * ```
 */

export interface TimelineEntryProps {
  /** Timestamp of the activity */
  timestamp: Date;
  /** Name of the associated event */
  eventName: string;
  /** Type of activity performed */
  activityType: 'evidence_added' | 'event_created' | 'verification_updated';
  /** Additional metadata about the activity */
  metadata: Record<string, any>;
  /** Optional className for custom styling */
  className?: string;
}

/**
 * Formats a date as relative time (e.g., "2 hours ago")
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

/**
 * Formats a date as full date string
 */
function formatFullDate(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Returns the icon and label for an activity type
 */
function getActivityTypeInfo(type: TimelineEntryProps['activityType']) {
  switch (type) {
    case 'evidence_added':
      return {
        icon: FileText,
        label: 'Evidence Added',
        color: 'text-blue-400',
      };
    case 'event_created':
      return {
        icon: AlertCircle,
        label: 'Event Created',
        color: 'text-cyan-400',
      };
    case 'verification_updated':
      return {
        icon: CheckCircle,
        label: 'Verification Updated',
        color: 'text-green-400',
      };
  }
}

function TimelineEntryComponent({
  timestamp,
  eventName,
  activityType,
  metadata,
  className,
}: TimelineEntryProps) {
  const [showFullDate, setShowFullDate] = useState(false);
  
  // Memoize activity type info to avoid recalculation
  const activityInfo = useMemo(() => getActivityTypeInfo(activityType), [activityType]);
  const ActivityIcon = activityInfo.icon;

  return (
    <motion.div
      variants={fadeUp}
      className={cn("relative", className)}
    >
      <GlassCard variant="hover-lift" className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          {/* Activity Icon */}
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-lg",
            "bg-white/5 border border-white/10",
            "flex items-center justify-center",
            activityInfo.color
          )}>
            <ActivityIcon className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 w-full">
            {/* Event Name */}
            <h4 className="text-base font-semibold text-white mb-1 truncate">
              {eventName}
            </h4>

            {/* Activity Type */}
            <p className="text-sm text-gray-400 mb-2">
              {activityInfo.label}
            </p>

            {/* Metadata and Timestamp Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {/* Metadata */}
              {Object.keys(metadata).length > 0 && (
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  {metadata.evidenceCount !== undefined && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {metadata.evidenceCount} {metadata.evidenceCount === 1 ? 'item' : 'items'}
                    </span>
                  )}
                  {metadata.userName && (
                    <span>by {metadata.userName}</span>
                  )}
                  {metadata.verificationStatus && (
                    <span className="capitalize">{metadata.verificationStatus}</span>
                  )}
                </div>
              )}

              {/* Timestamp */}
              <div 
                className="flex-shrink-0 cursor-help"
                onMouseEnter={() => setShowFullDate(true)}
                onMouseLeave={() => setShowFullDate(false)}
                title={formatFullDate(timestamp)}
              >
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span className="whitespace-nowrap">
                    {showFullDate ? formatFullDate(timestamp) : formatRelativeTime(timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export const TimelineEntry = memo(TimelineEntryComponent);
