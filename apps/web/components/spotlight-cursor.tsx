"use client";

import { useEffect, useRef, useState, memo, useCallback } from "react";

/**
 * SpotlightCursor component - Subtle spotlight effect that follows cursor
 * Optimized with React.memo and useCallback to prevent unnecessary re-renders
 * 
 * **Validates: Requirements 10.5**
 * 
 * Features:
 * - Radial gradient spotlight that follows mouse movement
 * - Performance-optimized using requestAnimationFrame
 * - Respects prefers-reduced-motion for accessibility
 * - Smooth, subtle effect that doesn't distract from content
 * 
 * Usage:
 * ```tsx
 * <section className="relative">
 *   <SpotlightCursor />
 *   {/* Your section content *\/}
 * </section>
 * ```
 */

export interface SpotlightCursorProps {
  /**
   * Size of the spotlight in pixels
   * @default 500
   */
  size?: number;
  
  /**
   * Opacity of the spotlight effect (0-1)
   * @default 0.15
   */
  opacity?: number;
  
  /**
   * Color of the spotlight (CSS color value)
   * @default "rgba(37, 99, 235, 0.3)" - primary blue
   */
  color?: string;
}

function SpotlightCursorComponent({
  size = 500,
  opacity = 0.15,
  color = "rgba(37, 99, 235, 0.3)",
}: SpotlightCursorProps) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number | undefined>(undefined);
  const mousePos = useRef({ x: 0, y: 0 });

  // Check for reduced motion preference on mount
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Don't enable spotlight if user prefers reduced motion
    if (prefersReducedMotion) {
      return;
    }

    const updateSpotlightPosition = () => {
      if (spotlightRef.current) {
        const { x, y } = mousePos.current;
        spotlightRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      
      // Store mouse position relative to the section
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // Use RAF for performance optimization
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateSpotlightPosition);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Attach to parent element
    const parent = spotlightRef.current?.parentElement;
    if (parent) {
      // Use passive event listener for better scroll performance
      parent.addEventListener("mousemove", handleMouseMove, { passive: true } as AddEventListenerOptions);
      parent.addEventListener("mouseenter", handleMouseEnter);
      parent.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseenter", handleMouseEnter);
        parent.removeEventListener("mouseleave", handleMouseLeave);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }
  }, [prefersReducedMotion]);

  // Don't render if user prefers reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={spotlightRef}
      className="pointer-events-none absolute z-10 transition-opacity duration-300"
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        opacity: isVisible ? opacity : 0,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
      aria-hidden="true"
    />
  );
}

// Export memoized component to prevent unnecessary re-renders
export const SpotlightCursor = memo(SpotlightCursorComponent);
