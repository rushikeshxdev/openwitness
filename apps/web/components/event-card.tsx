"use client";

import { GlassCard } from "./glass-card";
import { Event } from "@/types/event";
import { ImageZoom } from "./image-zoom";
import { MapPin, FileText, ArrowRight } from "lucide-react";
import { memo, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { LANDING_REFERENCE_TIME } from "@/data/events-data";
import Link from "next/link";

export interface EventCardProps {
  event: Event;
  onClick?: (id: string) => void;
  href?: string;
}

function formatUpdatedAt(
  timestamp: Date,
  now: Date = LANDING_REFERENCE_TIME
): string {
  const seconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
  if (seconds < 60) return "Updated just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Updated ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  return `Updated ${Math.floor(hours / 24)}d ago`;
}

function EventCardComponent({ event, onClick, href }: EventCardProps) {
  const { id, title, location, thumbnailUrl, evidenceCount, timestamp, badge } =
    event;

  const locationString = useMemo(
    () => `${location.city}, ${location.country}`,
    [location.city, location.country]
  );

  const badgeConfig = useMemo(() => {
    if (badge === "trending") {
      return { label: "TRENDING", className: "bg-orange-500 text-white" };
    }
    if (badge === "live" || event.isActive) {
      return { label: "LIVE", className: "bg-[#3B82F6] text-white" };
    }
    return null;
  }, [badge, event.isActive]);

  const handleClick = useCallback(() => {
    onClick?.(id);
  }, [onClick, id]);

  const cardHref = href ?? `/events/${id}`;

  const cardInner = (
    <GlassCard
      variant="hover-lift"
      className="overflow-hidden group h-full bg-[#121214]/90 border-white/[0.12]"
      onClick={onClick ? handleClick : undefined}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <ImageZoom
          src={thumbnailUrl}
          alt=""
          fill
          quality={75}
          className="object-cover"
          sizes="(max-width: 640px) 300px, 320px"
          zoomScale={1.06}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent opacity-80" />

        {badgeConfig && (
          <div className="absolute top-3 left-3">
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide shadow-sm",
                badgeConfig.className
              )}
            >
              {badgeConfig.label === "LIVE" && (
                <span className="w-1.5 h-1.5 rounded-full bg-white motion-safe:animate-pulse" />
              )}
              {badgeConfig.label}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-2.5">
        <h3 className="text-base sm:text-lg font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#60A5FA] transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
          <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{locationString}</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
          <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{evidenceCount.toLocaleString()} evidence files</span>
        </div>

        <div className="flex items-center justify-between pt-1.5">
          <time
            className="text-xs text-zinc-500"
            dateTime={timestamp.toISOString()}
          >
            {formatUpdatedAt(timestamp)}
          </time>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-zinc-300 group-hover:bg-[#3B82F6] group-hover:border-[#3B82F6] group-hover:text-white transition-colors"
            aria-hidden="true"
          >
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </GlassCard>
  );

  return (
    <div className="w-[300px] sm:w-[320px] flex-shrink-0">
      {onClick ? (
        cardInner
      ) : (
        <Link
          href={cardHref}
          className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded-xl"
          aria-label={`View event: ${title}`}
        >
          {cardInner}
        </Link>
      )}
    </div>
  );
}

export const EventCard = memo(EventCardComponent);
