"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Container } from "./container";
import { SectionTitle } from "./section-title";
import { fadeIn } from "@/lib/animations";

/**
 * MapSection component - Interactive world map with event markers
 * 
 * **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 9.2, 12.7**
 * 
 * Features:
 * - Dark-themed world map with responsive scaling
 * - Glowing markers at event locations with pulse animation
 * - Tooltip on marker hover showing event details
 * - Fade-in animation when entering viewport
 * - Uses primary blue (#2563EB) or accent cyan (#38BDF8) for markers
 * 
 * @example
 * ```tsx
 * <MapSection
 *   events={[
 *     {
 *       id: "1",
 *       latitude: 40.7128,
 *       longitude: -74.0060,
 *       title: "New York Protest",
 *       evidenceCount: 156
 *     }
 *   ]}
 *   onMarkerClick={(id) => console.log(`Event ${id} clicked`)}
 * />
 * ```
 */

export interface MapEvent {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  evidenceCount: number;
  location?: string;
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
  const [hoveredEvent, setHoveredEvent] = useState<MapEvent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Convert lat/long to SVG coordinates (using equirectangular projection)
  // SVG viewBox is 1000x500 representing 360° x 180°
  const latLongToXY = (lat: number, long: number) => {
    // Longitude: -180 to 180 maps to 0 to 1000
    const x = ((long + 180) / 360) * 1000;
    // Latitude: 90 to -90 maps to 0 to 500
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const handleMarkerHover = (event: MapEvent, svgX: number, svgY: number) => {
    setHoveredEvent(event);
    
    // Get the SVG element to calculate screen coordinates
    const svgElement = ref.current?.querySelector("svg");
    if (svgElement) {
      const rect = svgElement.getBoundingClientRect();
      const scaleX = rect.width / 1000;
      const scaleY = rect.height / 500;
      
      setTooltipPosition({
        x: svgX * scaleX,
        y: svgY * scaleY,
      });
    }
  };

  const handleMarkerLeave = () => {
    setHoveredEvent(null);
  };

  const handleMarkerClick = (eventId: string) => {
    if (onMarkerClick) {
      onMarkerClick(eventId);
    }
  };

  return (
    <section
      id="map"
      ref={ref}
      className="py-20 md:py-32 bg-background-primary relative overflow-hidden scroll-mt-24"
      aria-labelledby="map-section-title"
    >
      <Container size="xl">
        {/* Section Header */}
        <div className="mb-12">
          <SectionTitle
            id="map-section-title"
            title={title}
            subtitle={subtitle}
            alignment="center"
          />
        </div>

        {/* Map Container */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          className="relative w-full aspect-[2/1] max-h-[600px] rounded-2xl overflow-hidden bg-background-elevated border border-white/5"
        >
          {/* World Map SVG */}
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background */}
            <rect width="1000" height="500" fill="#09090B" />
            
            {/* Simplified world map - continents as basic shapes */}
            {/* This is a placeholder - a real implementation would use detailed SVG paths */}
            <g fill="#18181B" stroke="#27272A" strokeWidth="0.5">
              {/* North America */}
              <path d="M 150 150 L 250 120 L 280 140 L 290 180 L 270 220 L 240 240 L 200 250 L 170 230 L 150 200 Z" />
              
              {/* South America */}
              <path d="M 280 280 L 310 270 L 330 290 L 340 330 L 330 370 L 310 390 L 290 380 L 280 340 Z" />
              
              {/* Europe */}
              <path d="M 480 140 L 520 130 L 540 150 L 530 170 L 510 180 L 490 170 Z" />
              
              {/* Africa */}
              <path d="M 490 200 L 530 190 L 560 210 L 570 250 L 560 300 L 540 330 L 510 340 L 490 320 L 480 270 Z" />
              
              {/* Asia */}
              <path d="M 580 120 L 680 110 L 750 130 L 780 160 L 790 200 L 770 240 L 730 250 L 680 240 L 640 220 L 600 200 L 580 170 Z" />
              
              {/* Australia */}
              <path d="M 730 320 L 780 310 L 810 330 L 800 360 L 770 370 L 740 360 Z" />
            </g>

            {/* Event Markers */}
            {events.map((event) => {
              const { x, y } = latLongToXY(event.latitude, event.longitude);
              const isHovered = hoveredEvent?.id === event.id;
              
              return (
                <g
                  key={event.id}
                  onMouseEnter={() => handleMarkerHover(event, x, y)}
                  onMouseLeave={handleMarkerLeave}
                  onClick={() => handleMarkerClick(event.id)}
                  className="cursor-pointer"
                  style={{ transformOrigin: `${x}px ${y}px` }}
                >
                  {/* Glow effect */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 15 : 12}
                    fill="#2563EB"
                    opacity="0.2"
                    className="transition-all duration-300"
                  >
                    {/* Pulse animation */}
                    <animate
                      attributeName="r"
                      values={isHovered ? "15;20;15" : "12;18;12"}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.2;0.05;0.2"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  
                  {/* Inner glow */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 8 : 6}
                    fill="#38BDF8"
                    opacity="0.6"
                    className="transition-all duration-300"
                  >
                    <animate
                      attributeName="r"
                      values={isHovered ? "8;10;8" : "6;8;6"}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  
                  {/* Core dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 4 : 3}
                    fill="#60A5FA"
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredEvent && (
            <div
              className="absolute z-10 pointer-events-none"
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y,
                transform: "translate(-50%, -100%)",
                marginTop: "-12px",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 min-w-[200px]"
              >
                <h4 className="font-semibold text-white text-sm mb-1">
                  {hoveredEvent.title}
                </h4>
                {hoveredEvent.location && (
                  <p className="text-xs text-text-secondary mb-1">
                    {hoveredEvent.location}
                  </p>
                )}
                <p className="text-xs text-text-secondary">
                  {hoveredEvent.evidenceCount} pieces of evidence
                </p>
                
                {/* Tooltip arrow */}
                <div
                  className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full w-0 h-0"
                  style={{
                    borderLeft: "6px solid transparent",
                    borderRight: "6px solid transparent",
                    borderTop: "6px solid rgba(255, 255, 255, 0.2)",
                  }}
                />
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Optional: Map Legend */}
        <div className="mt-8 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-brand-blue-primary" />
            <span className="text-sm text-text-secondary">Active Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-brand-cyan-accent animate-pulse" />
            <span className="text-sm text-text-secondary">Recent Activity</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
