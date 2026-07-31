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

const MAP_OVERVIEW = { longitude: 20, latitude: 18, zoom: 1.85 } as const;
const GLOBE_OVERVIEW = { longitude: 20, latitude: 10, zoom: 1.55 } as const;
/** Keep fly-to readable on a sphere; avoid flattening the globe. */
const GLOBE_FLY_MAX_ZOOM = 5.5;

const GLOBE_SKY = {
  "atmosphere-blend": [
    "interpolate",
    ["linear"],
    ["zoom"],
    0,
    1,
    5,
    0.6,
    8,
    0,
  ],
  "sky-color": "#0B1220",
  "horizon-color": "#1E3A5F",
  "fog-color": "#09090B",
  "horizon-fog-blend": 0.7,
  "fog-ground-blend": 0.4,
} as const;

export interface MapCanvasProps {
  geojson: MapEventFeatureCollection;
  selectedEventId: string | null;
  flyTo: { longitude: number; latitude: number; zoom?: number } | null;
  viewMode: "map" | "globe";
  onViewModeChange: (mode: "map" | "globe") => void;
  onSelect: (eventId: string) => void;
  className?: string;
}

function applyProjection(map: MapLibreMap, mode: "map" | "globe") {
  try {
    map.setProjection({ type: mode === "globe" ? "globe" : "mercator" });
  } catch (err) {
    console.warn("[MapCanvas] setProjection failed", err);
  }

  const withSky = map as MapLibreMap & {
    setSky?: (sky?: typeof GLOBE_SKY) => void;
  };
  // Only apply atmosphere in globe mode — clearing sky can blank some styles.
  if (mode === "globe" && typeof withSky.setSky === "function") {
    try {
      withSky.setSky(GLOBE_SKY);
    } catch {
      /* optional */
    }
  }
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
  const containerRef = useRef<HTMLDivElement>(null);
  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;
  const prevViewModeRef = useRef(viewMode);
  const mapReadyRef = useRef(false);

  const resizeMap = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    map.resize();
  }, []);

  const applyMode = useCallback(
    (mode: "map" | "globe", animateCamera: boolean) => {
      const map = mapRef.current?.getMap() as MapLibreMap | undefined;
      if (!map || !mapReadyRef.current) return;

      applyProjection(map, mode);
      resizeMap();

      if (!animateCamera) return;

      const target = mode === "globe" ? GLOBE_OVERVIEW : MAP_OVERVIEW;
      map.easeTo({
        center: [target.longitude, target.latitude],
        zoom: target.zoom,
        bearing: 0,
        duration: 900,
      });
    },
    [resizeMap]
  );

  // Keep canvas sized when flex layout settles / window resizes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      resizeMap();
    });
    ro.observe(el);

    // Extra passes after layout paint (flex can settle late)
    const t1 = window.setTimeout(resizeMap, 50);
    const t2 = window.setTimeout(resizeMap, 250);
    const t3 = window.setTimeout(resizeMap, 600);

    return () => {
      ro.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [resizeMap]);

  // Sync projection whenever viewMode changes (after map is ready)
  useEffect(() => {
    if (!mapReadyRef.current) return;

    const modeChanged = prevViewModeRef.current !== viewMode;
    prevViewModeRef.current = viewMode;
    applyMode(viewMode, modeChanged);
  }, [viewMode, applyMode]);

  useEffect(() => {
    if (!flyTo || !mapRef.current || !mapReadyRef.current) return;
    const map = mapRef.current.getMap() as MapLibreMap;
    const requested = flyTo.zoom ?? 8;
    const zoom =
      viewModeRef.current === "globe"
        ? Math.min(requested, GLOBE_FLY_MAX_ZOOM)
        : requested;

    map.flyTo({
      center: [flyTo.longitude, flyTo.latitude],
      zoom,
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
            const nextZoom =
              viewModeRef.current === "globe"
                ? Math.min(zoom, GLOBE_FLY_MAX_ZOOM)
                : zoom;
            map.easeTo({ center: coords, zoom: nextZoom });
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

  const onMapLoad = useCallback(() => {
      mapReadyRef.current = true;
      const map = mapRef.current?.getMap() as MapLibreMap | undefined;
      if (!map) return;

      // Default is mercator — only force projection if starting in globe
      if (viewModeRef.current === "globe") {
        applyProjection(map, "globe");
      }

      // Critical: flex parents often size after first paint
      resizeMap();
      requestAnimationFrame(() => {
        resizeMap();
        window.setTimeout(resizeMap, 100);
      });
    }, [resizeMap]);

  const onMapError = useCallback((e: unknown) => {
    console.error("[MapCanvas] map error", e);
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
        const zoom =
          viewModeRef.current === "globe"
            ? Math.min(10, GLOBE_FLY_MAX_ZOOM)
            : 10;
        mapRef.current?.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom,
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
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 h-full min-h-[360px] w-full overflow-hidden bg-[#0B0E11]",
        className
      )}
    >
      <Map
        ref={mapRef}
        mapStyle={DEFAULT_MAP_STYLE}
        initialViewState={{
          longitude: MAP_OVERVIEW.longitude,
          latitude: MAP_OVERVIEW.latitude,
          zoom: MAP_OVERVIEW.zoom,
        }}
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        attributionControl={false}
        interactiveLayerIds={interactiveLayerIds}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onLoad={onMapLoad}
        onError={onMapError}
        aria-label="Global events map"
      >
        <Source
          id="events"
          type="geojson"
          data={geojson}
          cluster
          clusterMaxZoom={14}
          clusterRadius={56}
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
                22,
                5,
                30,
                15,
                40,
              ],
              "circle-opacity": 0.88,
              "circle-stroke-width": 3,
              "circle-stroke-color": "rgba(255,255,255,0.4)",
            }}
          />
          <Layer
            id={CLUSTER_COUNT_LAYER}
            type="symbol"
            filter={["has", "point_count"]}
            layout={{
              "text-field": ["get", "point_count_abbreviated"],
              "text-size": 13,
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
                12,
                8,
              ],
              "circle-stroke-width": [
                "case",
                ["==", ["get", "id"], selectedEventId ?? ""],
                3,
                2,
              ],
              "circle-stroke-color": "#ffffff",
              "circle-opacity": 0.95,
            }}
          />
        </Source>
      </Map>

      {/* Map | Globe toggle */}
      <div className="pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2 sm:left-4 sm:top-4 sm:translate-x-0">
        <div className="pointer-events-auto inline-flex rounded-xl border border-white/12 bg-[#121214]/90 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => onViewModeChange("map")}
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              viewMode === "map"
                ? "bg-[#3B82F6] text-white"
                : "text-zinc-400 hover:text-white"
            )}
            aria-pressed={viewMode === "map"}
          >
            <MapIcon className="h-4 w-4" aria-hidden="true" />
            Map
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("globe")}
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              viewMode === "globe"
                ? "bg-[#3B82F6] text-white"
                : "text-zinc-400 hover:text-white"
            )}
            aria-pressed={viewMode === "globe"}
            aria-label="Switch to globe view"
          >
            <Globe2 className="h-4 w-4" aria-hidden="true" />
            Globe
          </button>
        </div>
      </div>

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
