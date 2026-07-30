"use client";

import { EventCard } from "./event-card";
import { SectionTitle } from "./section-title";
import { Container } from "./container";
import { Event } from "@/types/event";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { staggerContainer, fadeUp } from "@/lib/animations";

/**
 * ActiveEvents component - Horizontal scrolling section displaying active events
 * 
 * **Validates: Requirements 3.1, 3.7, 11.5**
 * 
 * Features:
 * - Horizontal scroll container with touch/mouse drag interactions
 * - Scroll indicators with gradient fade at edges
 * - Smooth mobile horizontal scrolling
 * - Navigation arrows for desktop
 * - Staggered reveal animations when entering viewport
 * 
 * @example
 * ```tsx
 * <ActiveEvents
 *   events={activeEventsData}
 *   onEventClick={(id) => console.log(`Event ${id} clicked`)}
 * />
 * ```
 */

export interface ActiveEventsProps {
  events: Event[];
  onEventClick?: (id: string) => void;
  title?: string;
  subtitle?: string;
}

export function ActiveEvents({
  events,
  onEventClick,
  title = "Active Events",
  subtitle = "Real-time documentation from around the world",
}: ActiveEventsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showScrollIndicators, setShowScrollIndicators] = useState(false);

  // Check scroll position to update indicators
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Initialize scroll indicators visibility
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check if content overflows
    const hasOverflow = container.scrollWidth > container.clientWidth;
    setShowScrollIndicators(hasOverflow);
    
    if (hasOverflow) {
      checkScrollPosition();
    }

    // Add scroll listener
    container.addEventListener("scroll", checkScrollPosition);
    
    // Add resize listener
    const handleResize = () => {
      const newHasOverflow = container.scrollWidth > container.clientWidth;
      setShowScrollIndicators(newHasOverflow);
      checkScrollPosition();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", handleResize);
    };
  }, [events]);

  // Smooth scroll function
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 400; // Scroll by ~1.25 cards
    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={ref}
      className="py-20 md:py-32 bg-background-primary relative overflow-hidden"
    >
      <Container size="xl">
        {/* Section Header */}
        <div className="mb-12">
          <SectionTitle title={title} subtitle={subtitle} alignment="left" />
        </div>

        {/* Scrollable Container with Navigation */}
        <div className="relative">
          {/* Left Gradient Fade */}
          {showScrollIndicators && canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background-primary to-transparent z-10 pointer-events-none" />
          )}

          {/* Right Gradient Fade */}
          {showScrollIndicators && canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background-primary to-transparent z-10 pointer-events-none" />
          )}

          {/* Left Navigation Arrow (Desktop) */}
          {showScrollIndicators && canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Right Navigation Arrow (Desktop) */}
          {showScrollIndicators && canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Horizontal Scroll Container */}
          <motion.div
            ref={scrollContainerRef}
            variants={staggerContainer}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                variants={fadeUp}
                custom={index}
              >
                <EventCard
                  event={event}
                  onClick={onEventClick}
                  enableTilt={false}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile Scroll Hint */}
        {showScrollIndicators && (
          <div className="md:hidden mt-6 text-center">
            <p className="text-sm text-text-tertiary">
              Swipe to explore more events
            </p>
          </div>
        )}
      </Container>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
