"use client";

import { EventCard } from "./event-card";
import { SectionTitle } from "./section-title";
import { Container } from "./container";
import { Event } from "@/types/event";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

/**
 * ActiveEvents component - Horizontal scrolling section displaying active events
 *
 * **Validates: Requirements 3.1, 3.7, 11.5**
 */

export interface ActiveEventsProps {
  events: Event[];
  onEventClick?: (id: string) => void;
  title?: string;
  subtitle?: string;
  /** When true, omit outer section/container/title (parent provides layout) */
  embedded?: boolean;
  viewAllHref?: string;
  className?: string;
}

export function ActiveEvents({
  events,
  onEventClick,
  title = "Active Events",
  subtitle = "Real-time updates from public events around the world",
  embedded = false,
  viewAllHref = "/events",
  className,
}: ActiveEventsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showScrollIndicators, setShowScrollIndicators] = useState(false);

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const hasOverflow = container.scrollWidth > container.clientWidth;
    setShowScrollIndicators(hasOverflow);

    if (hasOverflow) {
      checkScrollPosition();
    }

    container.addEventListener("scroll", checkScrollPosition);

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

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 340;
    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  const carousel = (
    <div className="relative" ref={ref}>
      {showScrollIndicators && canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0B0E11] to-transparent z-10 pointer-events-none" />
      )}

      {showScrollIndicators && canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0B0E11] to-transparent z-10 pointer-events-none" />
      )}

      {showScrollIndicators && canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-1.5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
      )}

      {showScrollIndicators && canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-1.5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      )}

      <motion.div
        ref={scrollContainerRef}
        variants={staggerContainer}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {events.map((event, index) => (
          <motion.div key={event.id} variants={fadeUp} custom={index}>
            <EventCard event={event} onClick={onEventClick} />
          </motion.div>
        ))}
      </motion.div>

      {showScrollIndicators && (
        <div className="md:hidden mt-3 text-center">
          <p className="text-xs text-text-tertiary">Swipe to explore more events</p>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return (
      <div id="events" className={cn(className)}>
        <div className="flex items-start justify-between gap-4 mb-6 md:mb-7">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1.5 text-base text-text-secondary/90">
                {subtitle}
              </p>
            )}
          </div>
          <a
            href={viewAllHref}
            className="hidden sm:inline-flex items-center gap-1.5 text-base font-medium text-[#60A5FA] hover:text-white transition-colors whitespace-nowrap mt-1"
          >
            View all events
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
        {carousel}
      </div>
    );
  }

  return (
    <section
      className={cn(
        "py-20 md:py-32 bg-background-primary relative overflow-hidden",
        className
      )}
    >
      <Container size="xl">
        <div className="mb-12 flex items-end justify-between gap-4">
          <SectionTitle title={title} subtitle={subtitle} alignment="left" />
          <a
            href={viewAllHref}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-blue-primary hover:text-brand-cyan-accent transition-colors mb-1"
          >
            View all events
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        {carousel}
      </Container>
    </section>
  );
}
