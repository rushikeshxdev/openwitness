"use client";

import dynamic from "next/dynamic";
import type { LeafletEventMapProps } from "./leaflet-event-map";
import { cn } from "@/lib/utils";

const LeafletEventMapInner = dynamic(
  () => import("./leaflet-event-map").then((m) => m.LeafletEventMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-full w-full items-center justify-center bg-[#0B0E11] text-xs text-zinc-500"
        aria-hidden
      >
        Loading map…
      </div>
    ),
  }
);

export function LeafletEventMapClient(props: LeafletEventMapProps) {
  return (
    <div className={cn("h-full w-full", props.className)}>
      <LeafletEventMapInner {...props} className="h-full w-full" />
    </div>
  );
}

export type { LeafletMapMarker, LeafletEventMapProps } from "./leaflet-event-map";
