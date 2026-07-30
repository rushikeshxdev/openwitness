"use client";

import { GlassCard } from "./glass-card";
import { Event } from "@/types/event";
import { ImageZoom } from "./image-zoom";
import { MapPin, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { duration, easing } from "@/lib/animations";
import { memo, useMemo, useCallback } from "react";

/**
 * EventCard component - Display active events with thumbnail, metadata, and hover effects
 * 
 * **Validates: Requirements 3.3, 3.4, 3.5, 12.5**
 * 
 * Features:
 * - Fixed width card (320px) for horizontal scroll container
 * - Thumbnail image with overlay gradient (16:9 aspect ratio)
 * - Verification badge with color coding (green/yellow/gray)
 * - Evidence count with icon
 * - Location display
 * - Hover: lift + glow effect (shadow-2xl shadow-blue-500/20)
 * - Optional subtle tilt on hover using mouse position
 * - Optimized with React.memo to prevent unnecessary re-renders
 * 
 * @example
 * ```tsx
 * <EventCard
 *   event={{
 *     id: "1",
 *     title: "Climate Action Rally",
 *     location: { city: "Seattle", country: "USA" },
 *     thumbnailUrl: "/images/event1.jpg",
 *     evidenceCount: 42,
 *     verificationStatus: "verified",
 *     timestamp: new Date(),
 *     isActive: true
 *   }}
 *   onClick={(id) => console.log(`Clicked event ${id}`)}
 * />
 * ```
 */

export interface EventCardProps {
  event: Event;
  onClick?: (id: string) => void;
  enableTilt?: boolean;
}

function EventCardComponent({ event, onClick, enableTilt = false }: EventCardProps) {
  const {
    id,
    title,
    location,
    thumbnailUrl,
    evidenceCount,
    verificationStatus,
    timestamp,
  } = event;

  // Memoize status configuration to avoid recalculation on every render
  const statusConfig = useMemo(() => {
    switch (verificationStatus) {
      case "verified":
        return {
          icon: CheckCircle,
          color: "text-status-verified",
          bgColor: "bg-status-verified/10",
          label: "Verified",
        };
      case "pending":
        return {
          icon: Clock,
          color: "text-status-pending",
          bgColor: "bg-status-pending/10",
          label: "Pending",
        };
      case "unverified":
        return {
          icon: AlertCircle,
          color: "text-status-unverified",
          bgColor: "bg-status-unverified/10",
          label: "Unverified",
        };
    }
  }, [verificationStatus]);

  const StatusIcon = statusConfig.icon;

  // Memoize location string
  const locationString = useMemo(
    () => `${location.city}, ${location.country}`,
    [location.city, location.country]
  );

  // Memoize click handler to prevent recreation on every render
  const handleClick = useCallback(() => {
    onClick?.(id);
  }, [onClick, id]);

  return (
    <motion.div
      className="w-80 sm:w-80 flex-shrink-0"
      whileHover={{
        scale: 1.02,
      }}
      transition={{
        duration: duration.normal,
        ease: easing.smooth,
      }}
    >
      <GlassCard
        variant={enableTilt ? "hover-tilt" : "hover-lift"}
        className="overflow-hidden cursor-pointer group h-full"
        onClick={handleClick}
      >
        {/* Thumbnail Image with 16:9 aspect ratio */}
        <div className="relative aspect-video overflow-hidden">
          <ImageZoom
            src={thumbnailUrl}
            alt={title}
            fill
            quality={85}
            className="object-cover"
            sizes="(max-width: 640px) 280px, 320px"
            zoomScale={1.1}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Active indicator */}
          {event.isActive && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
              <div className="flex items-center gap-1.5 bg-red-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-xs font-medium text-white">LIVE</span>
              </div>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          {/* Title */}
          <h3 className="text-base sm:text-lg font-semibold text-text-primary line-clamp-2 group-hover:text-brand-blue-primary transition-colors">
            {title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{locationString}</span>
          </div>

          {/* Metadata Row */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            {/* Evidence Count */}
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <FileText className="w-4 h-4" />
              <span className="font-medium">{evidenceCount}</span>
              <span className="text-xs hidden sm:inline">evidence</span>
            </div>

            {/* Verification Status Badge */}
            <div
              className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-full ${statusConfig.bgColor}`}
            >
              <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
              <span className={`text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 shadow-2xl shadow-blue-500/20" />
        </div>
      </GlassCard>
    </motion.div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export const EventCard = memo(EventCardComponent);
