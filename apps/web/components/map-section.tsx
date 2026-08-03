"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "./container";
import { SectionTitle } from "./section-title";
import { fadeIn } from "@/lib/animations";
import { LeafletEventMapClient } from "@/components/map/leaflet-event-map-client";
import type { LeafletMapMarker } from "@/components/map/leaflet-event-map";
import { ArrowRight } from "lucide-react";

export interface MapEvent {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  evidenceCount: number;
  location?: string;
  status?: string;
}

export interface MapSectionProps {
  events: MapEvent[];
  onMarkerClick?: (id: string) => void;
  title?: string;
  subtitle?: string;
}

export function MapSection({
  events,
  onMarkerClick,
  title = "Global Reach",
  subtitle = "Events documented around the world",
}: MapSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const router = useRouter();

  const markers = useMemo<LeafletMapMarker[]>(
    () =>
      events.map((e) => ({
        id: e.id,
        latitude: e.latitude,
        longitude: e.longitude,
        title: e.location ? `${e.title} · ${e.location}` : e.title,
        status: e.status ?? "verified",
      })),
    [events]
  );

  const handleSelect = (id: string) => {
    if (onMarkerClick) {
      onMarkerClick(id);
      return;
    }
    router.push(`/events/${id}`);
  };

  return (
    <section
      id="map"
      ref={ref}
      className="py-20 md:py-32 bg-background-primary relative overflow-hidden scroll-mt-24"
      aria-labelledby="map-section-title"
    >
      <Container size="xl">
        <div className="mb-12">
          <SectionTitle
            id="map-section-title"
            title={title}
            subtitle={subtitle}
            alignment="center"
          />
        </div>

        <motion.div
          variants={fadeIn}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          className="relative w-full aspect-[2/1] max-h-[600px] rounded-2xl overflow-hidden bg-background-elevated border border-white/5"
        >
          <LeafletEventMapClient
            markers={markers}
            cluster
            interactive
            showZoomControls
            showAttribution
            ariaLabel="Global reach map of documented events"
            onSelect={handleSelect}
          />
        </motion.div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
            <span className="text-sm text-text-secondary">Live</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#F97316]" />
            <span className="text-sm text-text-secondary">Trending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
            <span className="text-sm text-text-secondary">Verified</span>
          </div>
          <Link
            href="/map"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#60A5FA] hover:text-white transition-colors"
          >
            Open Live Map
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
