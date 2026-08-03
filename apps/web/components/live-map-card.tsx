"use client";

import { useMemo } from "react";
import { GlassCard } from "./glass-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LeafletEventMapClient } from "@/components/map/leaflet-event-map-client";
import type { LeafletMapMarker } from "@/components/map/leaflet-event-map";
import { mapEventsData } from "@/data/map-data";

/**
 * Live Map Card — copy left, real Leaflet preview right
 */

export interface LiveMapCardProps {
  href?: string;
  className?: string;
}

export function LiveMapCard({ href = "#map", className }: LiveMapCardProps) {
  const markers = useMemo<LeafletMapMarker[]>(
    () =>
      mapEventsData.map((e) => ({
        id: e.id,
        latitude: e.latitude,
        longitude: e.longitude,
        title: e.title,
        status: e.status ?? "verified",
      })),
    []
  );

  return (
    <Link
      href={href}
      className={cn("block h-full min-h-[180px]", className)}
      aria-label="View live map of events around the world"
    >
      <GlassCard
        variant="hover-lift"
        className={cn(
          "h-full p-5 sm:p-6",
          "bg-black/45 border-white/[0.12]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
          "flex flex-row items-center gap-4 sm:gap-5",
          "cursor-pointer group overflow-hidden"
        )}
      >
        <div className="w-[42%] sm:w-[38%] shrink-0 flex flex-col justify-center pr-1">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Live Map
          </h3>
          <p className="text-zinc-400 text-sm sm:text-base leading-snug mb-4">
            See events happening around the world
          </p>
          <span className="inline-flex items-center text-[#3B82F6] text-base font-medium group-hover:text-sky-400 transition-colors">
            View Map
            <ArrowRight
              className="ml-1.5 w-5 h-5 group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
          </span>
        </div>

        <div className="relative flex-1 self-stretch min-h-[136px] z-0 isolate rounded-lg overflow-hidden border border-white/8 bg-[#0B0E11] pointer-events-none">
          <LeafletEventMapClient
            markers={markers}
            cluster
            interactive={false}
            showZoomControls={false}
            showAttribution={false}
            ariaLabel="Live map preview"
          />
        </div>
      </GlassCard>
    </Link>
  );
}
