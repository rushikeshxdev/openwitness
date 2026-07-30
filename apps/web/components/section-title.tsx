"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { useInView } from "framer-motion";
import { useRef } from "react";

/**
 * SectionTitle component for consistent section heading styling
 * Provides title and optional subtitle with alignment options and fade-in animation
 * 
 * **Validates: Requirements 12.12**
 * 
 * @example
 * ```tsx
 * <SectionTitle title="Active Events" alignment="center" />
 * 
 * <SectionTitle 
 *   title="Global Reach" 
 *   subtitle="Events from around the world"
 *   alignment="left"
 * />
 * ```
 */

interface SectionTitleProps {
  /** Main title text (48px) */
  title: string;
  /** Optional subtitle text (18px, muted) */
  subtitle?: string;
  /** Text alignment: left, center, or right */
  alignment?: "left" | "center" | "right";
  /** Additional CSS classes */
  className?: string;
  /** Enable gradient text effect on title */
  gradientText?: boolean;
}

const alignmentClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function SectionTitle({
  title,
  subtitle,
  alignment = "left",
  className,
  gradientText = false,
}: SectionTitleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={cn(alignmentClasses[alignment], className)}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={fadeIn}
    >
      <h2
        className={cn(
          "text-section",
          gradientText &&
            "bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-body text-gray-400">{subtitle}</p>
      )}
    </motion.div>
  );
}
