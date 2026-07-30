"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GlassCard } from "./glass-card";
import { ImageZoom } from "./image-zoom";
import { memo } from "react";

/**
 * OrganizationCard component for displaying partner organization logos
 * Wraps logos with GlassCard and applies premium grayscale-to-color hover effect
 * Optimized with React.memo to prevent unnecessary re-renders
 * 
 * **Validates: Requirements 6.2, 12.8**
 * 
 * @example
 * ```tsx
 * <OrganizationCard
 *   organization={{
 *     id: "org-1",
 *     name: "Partner Organization",
 *     logoUrl: "/logos/partner.png",
 *     website: "https://partner.com"
 *   }}
 * />
 * ```
 */

export interface OrganizationCardProps {
  /** Organization data */
  organization: {
    id: string;
    name: string;
    logoUrl: string;
    website?: string;
  };
  /** Additional CSS classes */
  className?: string;
}

function OrganizationCardComponent({ organization, className }: OrganizationCardProps) {
  const { name, logoUrl, website } = organization;

  const content = (
    <GlassCard
      variant="hover-lift"
      className={cn(
        "p-6 md:p-8 flex items-center justify-center relative group",
        "min-h-[120px] md:min-h-[160px]",
        className
      )}
    >
      {/* Logo with grayscale filter */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        whileHover={{
          scale: 1.05,
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <ImageZoom
          src={logoUrl}
          alt={`${name} logo`}
          width={200}
          height={80}
          quality={90}
          className={cn(
            "w-auto h-auto max-w-full max-h-20 object-contain",
            "filter grayscale group-hover:grayscale-0",
            "transition-all duration-300 ease-out",
            "opacity-70 group-hover:opacity-100"
          )}
          zoomScale={1.05}
          zoomDuration={0.3}
        />
      </motion.div>

      {/* Glow effect on hover */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100",
          "transition-opacity duration-300",
          "pointer-events-none",
          "shadow-[0_0_30px_rgba(37,99,235,0.2)]"
        )}
        aria-hidden="true"
      />
    </GlassCard>
  );

  // If website URL is provided, wrap in a link
  if (website) {
    return (
      <a
        href={website}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background-primary rounded-xl"
        aria-label={`Visit ${name} website`}
      >
        {content}
      </a>
    );
  }

  return content;
}

// Export memoized component to prevent unnecessary re-renders
export const OrganizationCard = memo(OrganizationCardComponent);
