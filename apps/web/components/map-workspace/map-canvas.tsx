"use client";

import { useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { cn } from "@/lib/utils";
import {
  DEFAULT_TILE_URL,
  MAP_STATUS_OPTIONS,
  type MapEventFeatureCollection,
} from "@/data/map-workspace-data";
import { Locate, Minus, Plus } from "lucide-react";

const MAP_OVERVIEW = { longitude: 20, latitude: 18, zoom: 1.85 } as const;

const STATUS_COLORS: Record<string, string> = {
  live: "#22C55E",
  trending: "#F97316",
  verified: "#3B82F6",
};

export interface MapCanvasProps {
  geojson: MapEventFeatureCollection;
  selectedEventId: string | null;
  flyTo: { longitude: number; latitude: number; zoom?: number } | null;
  onSelect: (eventId: string) => void;
  className?: string;
}

function statusColor(status: string | undefined): string {
  return STATUS_COLORS[status ?? ""] ?? "#94A3B8";
}

function circleStyle(selected: boolean, status: string | undefined): L.CircleMarkerOptions {
  return {
    radius: selected ? 12 : 8,
    fillColor: statusColor(status),
    color: "#ffffff",
    weight: selected ? 3 : 2,
    opacity: 1,
    fillOpacity: 0.95,
  };
}

export function MapCanvas({
  geojson,
  selectedEventId,
  flyTo,
  onSelect,
  className,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersByIdRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const mapReadyRef = useRef(false);

  const invalidateSize = useCallback(() => {
    mapRef.current?.invalidateSize();
  }, []);

  // Init map once
  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    const map = L.map(el, {
      center: [MAP_OVERVIEW.latitude, MAP_OVERVIEW.longitude],
      zoom: MAP_OVERVIEW.zoom,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer(DEFAULT_TILE_URL, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    const cluster = L.markerClusterGroup({
      maxClusterRadius: 56,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 15,
    });
    map.addLayer(cluster);

    mapRef.current = map;
    clusterRef.current = cluster;
    mapReadyRef.current = true;

    // Flex parents often size after first paint
    const t1 = window.setTimeout(() => map.invalidateSize(), 50);
    const t2 = window.setTimeout(() => map.invalidateSize(), 250);
    const t3 = window.setTimeout(() => map.invalidateSize(), 600);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      mapReadyRef.current = false;
      cluster.clearLayers();
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
      markersByIdRef.current.clear();
    };
  }, []);

  // ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      invalidateSize();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [invalidateSize]);

  // Sync markers when geojson / selection changes
  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster || !mapReadyRef.current) return;

    cluster.clearLayers();
    markersByIdRef.current.clear();

    for (const feature of geojson.features) {
      const [lng, lat] = feature.geometry.coordinates;
      const { id, status } = feature.properties;
      const selected = id === selectedEventId;

      const marker = L.circleMarker([lat, lng], circleStyle(selected, status));
      marker.bindTooltip(feature.properties.title, {
        direction: "top",
        offset: [0, -8],
        opacity: 0.95,
      });
      marker.on("click", () => {
        onSelectRef.current(id);
      });

      markersByIdRef.current.set(id, marker);
      cluster.addLayer(marker);
    }
  }, [geojson, selectedEventId]);

  // Fly to selected event
  useEffect(() => {
    const map = mapRef.current;
    if (!flyTo || !map || !mapReadyRef.current) return;

    map.flyTo([flyTo.latitude, flyTo.longitude], flyTo.zoom ?? 8, {
      duration: 1.2,
    });
  }, [flyTo]);

  const zoomBy = (delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    map.setZoom(map.getZoom() + delta);
  };

  const locateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.flyTo([pos.coords.latitude, pos.coords.longitude], 10, {
          duration: 1.2,
        });
      },
      () => {
        /* ignore permission errors */
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div
      className={cn(
        "absolute inset-0 z-0 isolate h-full min-h-[360px] w-full overflow-hidden bg-[#0B0E11]",
        className
      )}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 h-full w-full"
        aria-label="Global events map"
        role="application"
      />

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 sm:bottom-4 sm:block">
        <div className="pointer-events-auto flex items-center gap-5 rounded-xl border border-white/12 bg-[#121214]/90 px-5 py-2.5 backdrop-blur-md">
          {MAP_STATUS_OPTIONS.map((s) => (
            <div key={s.id} className="flex items-center gap-2 text-sm text-zinc-300">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.dot }}
                aria-hidden="true"
              />
              {s.label}
            </div>
          ))}
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <span
              className="h-2.5 w-2.5 rounded-full bg-zinc-400"
              aria-hidden="true"
            />
            Recent
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="pointer-events-none absolute bottom-3 right-3 z-10 sm:bottom-4 sm:right-4">
        <div className="pointer-events-auto flex flex-col gap-1 rounded-xl border border-white/12 bg-[#121214]/90 p-1.5 backdrop-blur-md">
          <button
            type="button"
            onClick={locateMe}
            className="rounded-lg p-2.5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Locate me"
          >
            <Locate className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => zoomBy(1)}
            className="rounded-lg p-2.5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Zoom in"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => zoomBy(-1)}
            className="rounded-lg p-2.5 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Zoom out"
          >
            <Minus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
