"use client";

import { GlassCard } from "./glass-card";
import { Event } from "@/types/event";
import { ImageZoom } from "./image-zoom";
import { MapPin, FileText, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { duration, easing } from "@/lib/animations";
import { memo, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { LANDING_REFERENCE_TIME } from "@/data/events-data";
import Link from "next/link";

export interface EventCardProps {
  event: Event;
  onClick?: (id: string) => void;
  enableTilt?: boolean;
  href?: string;
}

function formatUpdatedAt(timestamp: Date, now: Date = LANDING_REFERENCE_TIME): string {
  const seconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
  if (seconds < 60) return "Updated just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Updated ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `Updated ${days}d ago`;
}

function EventCardComponent({
  event,
  onClick,
  enableTilt = false,
  href,
}: EventCardProps) {
  const {
    id,
    title,
    location,
    thumbnailUrl,
    evidenceCount,
    timestamp,
    badge,
  } = event;

  const locationString = useMemo(
    () => `${location.city}, ${location.country}`,
    [location.city, location.country]
  );

  const badgeConfig = useMemo(() => {
    if (badge === "trending") {
      return { label: "TRENDING", className: "bg-orange-500/90 text-white" };
    }
    if (badge === "live" || event.isActive) {
      return { label: "LIVE", className: "bg-brand-blue-primary/90 text-white" };
    }
    return null;
  }, [badge, event.isActive]);

  const handleClick = useCallback(() => {
    onClick?.(id);
  }, [onClick, id]);

  const cardHref = href ?? `/events/${id}`;

  const cardInner = (
    <GlassCard
      variant={enableTilt ? "hover-tilt" : "hover-lift"}
      className="overflow-hidden group h-full"
      onClick={onClick ? handleClick : undefined}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <ImageZoom
          src={thumbnailUrl}
          alt=""
          fill
          quality={75}
          className="object-cover"
          sizes="(max-width: 640px) 280px, 320px"
          zoomScale={1.08}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {badgeConfig && (
          <div className="absolute top-3 left-3">
            <div
              className={cn(
                "flex items-center gap-1.5 backdrop-blur-sm px-2.5 py-1 rounded-full",
                badgeConfig.className
              )}
            >
              {badgeConfig.label === "LIVE" && (
                <div className="w-1.5 h-1.5 bg-white rounded-full motion-safe:animate-pulse" />
              )}
              <span className="text-[10px] font-semibold tracking-wide">
                {badgeConfig.label}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2.5">
        <h3 className="text-base font-semibold text-text-primary line-clamp-2 group-hover:text-brand-blue-primary transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span className="truncate">{locationString}</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
          <FileText className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span>{evidenceCount.toLocaleString()} evidence files</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <time
            className="text-xs text-text-tertiary"
            dateTime={timestamp.toISOString()}
          >
            {formatUpdatedAt(timestamp)}
          </time>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-text-secondary group-hover:bg-brand-blue-primary group-hover:text-white group-hover:border-brand-blue-primary transition-colors"
            aria-hidden="true"
          >
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </GlassCard>
  );

  return (
    <motion.div
      className="w-72 sm:w-80 flex-shrink-0"
      whileHover={{ scale: 1.02 }}
      transition={{
        duration: duration.normal,
        ease: easing.smooth,
      }}
    >
      {onClick ? (
        cardInner
      ) : (
        <Link
          href={cardHref}
          className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
          aria-label={`View event: ${title}`}
        >
          {cardInner}
        </Link>
      )}
    </motion.div>
  );
}

export const EventCard = memo(EventCardComponent);
