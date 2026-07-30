"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps, useMotionValue, useSpring, useTransform } from "framer-motion";
import { forwardRef, useRef, MouseEvent } from "react";
import { duration, easing } from "@/lib/animations";

/**
 * GlassCard component with glassmorphism styling and hover effects
 * Provides reusable card layouts with base glass styling and variant-based animations
 * 
 * **Validates: Requirements 12.3, 10.3**
 * 
 * @example
 * ```tsx
 * <GlassCard variant="hover-lift">
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </GlassCard>
 * 
 * <GlassCard variant="hover-tilt" className="max-w-md">
 *   <EventDetails />
 * </GlassCard>
 * ```
 */

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "style"> {
  /** Visual variant controlling hover behavior */
  variant?: "default" | "hover-lift" | "hover-tilt";
  /** Card content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ variant = "default", children, className, onClick, ...props }, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Motion values for tilt effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring animation for smooth tilt
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
      stiffness: 300,
      damping: 30,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
      stiffness: 300,
      damping: 30,
    });

    // Handle mouse move for tilt effect
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      if (variant !== "hover-tilt") return;

      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate normalized position (-0.5 to 0.5)
      const normalizedX = (e.clientX - centerX) / (rect.width / 2);
      const normalizedY = (e.clientY - centerY) / (rect.height / 2);

      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    // Reset tilt on mouse leave
    const handleMouseLeave = () => {
      if (variant !== "hover-tilt") return;
      mouseX.set(0);
      mouseY.set(0);
    };

    // Base glassmorphism styles
    const baseStyles = "bg-white/6 backdrop-blur-md border border-white/10 rounded-xl";

    // Variant-specific animation props
    const getAnimationProps = () => {
      switch (variant) {
        case "hover-lift":
          return {
            whileHover: {
              y: -8,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
              transition: {
                duration: duration.normal,
                ease: easing.smooth,
              },
            },
          };
        case "hover-tilt":
          return {
            style: {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d" as const,
            },
            whileHover: {
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
              transition: {
                duration: duration.normal,
                ease: easing.smooth,
              },
            },
          };
        default:
          return {};
      }
    };

    const animationProps = getAnimationProps();

    return (
      <motion.div
        ref={(node) => {
          // Handle both refs
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          // @ts-ignore - cardRef is used for measuring
          cardRef.current = node;
        }}
        className={cn(
          baseStyles,
          "transition-shadow duration-300",
          onClick && "cursor-pointer",
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        {...animationProps}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
