"use client";

import { useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { cn } from "@/lib/utils";
import { DEFAULT_TILE_URL } from "@/data/map-workspace-data";
import { Minus, Plus } from "lucide-react";

const WORLD_CENTER = { latitude: 18, longitude: 20, zoom: 1.4 } as const;

const STATUS_COLORS: Record<string, string> = {
  live: "#22C55E",
  trending: "#F97316",
  verified: "#3B82F6",
};

export type LeafletMapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  status?: string;
};

export interface LeafletEventMapProps {
  markers: LeafletMapMarker[];
  /** Prefer framing these coords (e.g. single-event overview). */
  center?: { latitude: number; longitude: number; zoom?: number };
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  cluster?: boolean;
  interactive?: boolean;
  showZoomControls?: boolean;
  showAttribution?: boolean;
  className?: string;
  /** Accessible name for the map region */
  ariaLabel?: string;
}

function statusColor(status: string | undefined): string {
  return STATUS_COLORS[status ?? ""] ?? "#94A3B8";
}

function circleStyle(
  selected: boolean,
  status: string | undefined,
  compact: boolean
): L.CircleMarkerOptions {
  return {
    radius: selected ? (compact ? 8 : 12) : compact ? 5 : 8,
    fillColor: statusColor(status),
    color: "#ffffff",
    weight: selected ? 3 : 2,
    opacity: 1,
    fillOpacity: 0.95,
  };
}

export function LeafletEventMap({
  markers,
  center,
  selectedId = null,
  onSelect,
  cluster = true,
  interactive = true,
  showZoomControls = false,
  showAttribution = false,
  className,
  ariaLabel = "Event map",
}: LeafletEventMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | L.MarkerClusterGroup | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const mapReadyRef = useRef(false);
  const compact = !showZoomControls;

  const invalidateSize = useCallback(() => {
    mapRef.current?.invalidateSize();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    const initial = center ?? WORLD_CENTER;
    const map = L.map(el, {
      center: [initial.latitude, initial.longitude],
      zoom: initial.zoom ?? (center ? 11 : WORLD_CENTER.zoom),
      zoomControl: false,
      attributionControl: showAttribution,
      scrollWheelZoom: interactive,
      dragging: interactive,
      doubleClickZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive,
      touchZoom: interactive,
    });

    L.tileLayer(DEFAULT_TILE_URL, {
      attribution: showAttribution
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        : "",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    const layer = cluster
      ? L.markerClusterGroup({
          maxClusterRadius: compact ? 40 : 56,
          showCoverageOnHover: false,
          spiderfyOnMaxZoom: true,
          disableClusteringAtZoom: 15,
        })
      : L.layerGroup();

    map.addLayer(layer);
    mapRef.current = map;
    layerRef.current = layer;
    mapReadyRef.current = true;

    const t1 = window.setTimeout(() => map.invalidateSize(), 50);
    const t2 = window.setTimeout(() => map.invalidateSize(), 250);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      mapReadyRef.current = false;
      layer.clearLayers();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
    // Init once; center/markers sync in later effects
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cluster, compact, interactive, showAttribution]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => invalidateSize());
    ro.observe(el);
    return () => ro.disconnect();
  }, [invalidateSize]);

  useEffect(() => {
    const layer = layerRef.current;
    const map = mapRef.current;
    if (!layer || !map || !mapReadyRef.current) return;

    layer.clearLayers();

    for (const m of markers) {
      const selected = m.id === selectedId;
      const marker = L.circleMarker(
        [m.latitude, m.longitude],
        circleStyle(selected, m.status, compact)
      );
      if (m.title) {
        marker.bindTooltip(m.title, {
          direction: "top",
          offset: [0, -6],
          opacity: 0.95,
        });
      }
      marker.on("click", () => {
        onSelectRef.current?.(m.id);
      });
      layer.addLayer(marker);
    }

    if (center) {
      map.setView(
        [center.latitude, center.longitude],
        center.zoom ?? 11,
        { animate: false }
      );
    } else if (markers.length === 1) {
      const only = markers[0];
      map.setView([only.latitude, only.longitude], 11, { animate: false });
    } else if (markers.length > 1) {
      const bounds = L.latLngBounds(
        markers.map((m) => [m.latitude, m.longitude] as [number, number])
      );
      map.fitBounds(bounds.pad(0.2), { animate: false, maxZoom: 6 });
    }

    requestAnimationFrame(() => map.invalidateSize());
  }, [markers, selectedId, center, compact]);

  const zoomBy = (delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    map.setZoom(map.getZoom() + delta);
  };

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-[#0B0E11]", className)}>
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
        aria-label={ariaLabel}
        role="application"
      />
      {showZoomControls && (
        <div className="pointer-events-none absolute bottom-3 right-3 z-[1000]">
          <div className="pointer-events-auto flex flex-col gap-1 rounded-xl border border-white/12 bg-[#121214]/90 p-1.5 backdrop-blur-md">
            <button
              type="button"
              onClick={() => zoomBy(1)}
              className="rounded-lg p-2 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Zoom in"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => zoomBy(-1)}
              className="rounded-lg p-2 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Zoom out"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
