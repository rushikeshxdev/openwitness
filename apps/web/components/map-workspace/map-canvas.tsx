"use client";

import { useCallback, useMemo, useRef, useEffect } from "react";
import Map, {
  Source,
  Layer,
  type MapRef,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import type { Map as MapLibreMap, GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@/lib/utils";
import {
  DEFAULT_MAP_STYLE,
  MAP_STATUS_OPTIONS,
  type MapEventFeatureCollection,
} from "@/data/map-workspace-data";
import { Globe2, Locate, Map as MapIcon, Minus, Plus } from "lucide-react";

const CLUSTER_LAYER = "clusters";
const CLUSTER_COUNT_LAYER = "cluster-count";
const UNCLUSTERED_LAYER = "unclustered-point";

export interface MapCanvasProps {
  geojson: MapEventFeatureCollection;
  selectedEventId: string | null;
  flyTo: { longitude: number; latitude: number; zoom?: number } | null;
  viewMode: "map" | "globe";
  onViewModeChange: (mode: "map" | "globe") => void;
  onSelect: (eventId: string) => void;
  className?: string;
}

export function MapCanvas({
  geojson,
  selectedEventId,
  flyTo,
  viewMode,
  onViewModeChange,
  onSelect,
  className,
}: MapCanvasProps) {
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (!flyTo || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [flyTo.longitude, flyTo.latitude],
      zoom: flyTo.zoom ?? 8,
      duration: 1200,
    });
  }, [flyTo]);

  const interactiveLayerIds = useMemo(
    () => [CLUSTER_LAYER, UNCLUSTERED_LAYER],
    []
  );

  const onClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) return;
      const map = mapRef.current?.getMap() as MapLibreMap | undefined;
      if (!map) return;

      if (feature.layer?.id === CLUSTER_LAYER) {
        const clusterId = feature.properties?.cluster_id as number | undefined;
        const source = map.getSource("events") as GeoJSONSource | undefined;
        if (clusterId == null || !source) return;
        const coords = (
          feature.geometry as { type: "Point"; coordinates: [number, number] }
        ).coordinates;
        void Promise.resolve(source.getClusterExpansionZoom(clusterId)).then(
          (zoom) => {
            map.easeTo({ center: coords, zoom });
          }
        );
        return;
      }

      const id = feature.properties?.id as string | undefined;
      if (id) onSelect(id);
    },
    [onSelect]
  );

  const onMouseEnter = useCallback(() => {
    const canvas = mapRef.current?.getCanvas();
    if (canvas) canvas.style.cursor = "pointer";
  }, []);

  const onMouseLeave = useCallback(() => {
    const canvas = mapRef.current?.getCanvas();
    if (canvas) canvas.style.cursor = "";
  }, []);

  const zoomBy = (delta: number) => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    map.easeTo({ zoom: map.getZoom() + delta, duration: 250 });
  };

  const locateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 10,
          duration: 1200,
        });
      },
      () => {
        /* ignore permission errors */
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <Map
        ref={mapRef}
        mapStyle={DEFAULT_MAP_STYLE}
        initialViewState={{
          longitude: 20,
          latitude: 20,
          zoom: 1.6,
        }}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        interactiveLayerIds={interactiveLayerIds}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label="Global events map"
      >
        <Source
          id="events"
          type="geojson"
          data={geojson}
          cluster
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer
            id={CLUSTER_LAYER}
            type="circle"
            filter={["has", "point_count"]}
            paint={{
              "circle-color": "#3B82F6",
              "circle-radius": [
                "step",
                ["get", "point_count"],
                18,
                5,
                24,
                15,
                32,
              ],
              "circle-opacity": 0.85,
              "circle-stroke-width": 2,
              "circle-stroke-color": "rgba(255,255,255,0.35)",
            }}
          />
          <Layer
            id={CLUSTER_COUNT_LAYER}
            type="symbol"
            filter={["has", "point_count"]}
            layout={{
              "text-field": ["get", "point_count_abbreviated"],
              "text-size": 12,
              "text-allow-overlap": true,
            }}
            paint={{
              "text-color": "#ffffff",
            }}
          />
          <Layer
            id={UNCLUSTERED_LAYER}
            type="circle"
            filter={["!", ["has", "point_count"]]}
            paint={{
              "circle-color": [
                "match",
                ["get", "status"],
                "live",
                "#22C55E",
                "trending",
                "#F97316",
                "verified",
                "#3B82F6",
                "#94A3B8",
              ],
              "circle-radius": [
                "case",
                ["==", ["get", "id"], selectedEventId ?? ""],
                10,
                6,
              ],
              "circle-stroke-width": [
                "case",
                ["==", ["get", "id"], selectedEventId ?? ""],
                3,
                1.5,
              ],
              "circle-stroke-color": "#ffffff",
              "circle-opacity": 0.95,
            }}
          />
        </Source>
      </Map>

      {viewMode === "globe" && (
        <div className="pointer-events-none absolute inset-x-0 top-14 z-10 flex justify-center px-3 sm:justify-start sm:px-4">
          <p className="rounded-lg border border-white/12 bg-[#121214]/90 px-3 py-1.5 text-xs text-zinc-400 backdrop-blur-md">
            Globe view coming soon — showing flat map
          </p>
        </div>
      )}

      {/* Map | Globe toggle */}
      <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 sm:left-4 sm:translate-x-0">
        <div className="pointer-events-auto inline-flex rounded-xl border border-white/12 bg-[#121214]/90 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => onViewModeChange("map")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              viewMode === "map"
                ? "bg-[#3B82F6] text-white"
                : "text-zinc-400 hover:text-white"
            )}
            aria-pressed={viewMode === "map"}
          >
            <MapIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Map
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("globe")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              viewMode === "globe"
                ? "bg-[#3B82F6] text-white"
                : "text-zinc-400 hover:text-white"
            )}
            aria-pressed={viewMode === "globe"}
            title="Globe view coming soon — showing map"
          >
            <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
            Globe
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 sm:block">
        <div className="pointer-events-auto flex items-center gap-4 rounded-xl border border-white/12 bg-[#121214]/90 px-4 py-2 backdrop-blur-md">
          {MAP_STATUS_OPTIONS.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5 text-xs text-zinc-300">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: s.dot }}
                aria-hidden="true"
              />
              {s.label}
            </div>
          ))}
          <div className="flex items-center gap-1.5 text-xs text-zinc-300">
            <span
              className="h-2 w-2 rounded-full bg-zinc-400"
              aria-hidden="true"
            />
            Recent
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="pointer-events-none absolute bottom-3 right-3 z-10">
        <div className="pointer-events-auto flex flex-col gap-1 rounded-xl border border-white/12 bg-[#121214]/90 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={locateMe}
            className="rounded-lg p-2 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Locate me"
          >
            <Locate className="h-4 w-4" />
          </button>
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
    </div>
  );
}
