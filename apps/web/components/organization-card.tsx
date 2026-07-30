"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GlassCard } from "./glass-card";
import { memo, useState } from "react";

/**
 * OrganizationCard — partner logo with grayscale-to-color hover
 * Falls back to typographic mark when logo image is unavailable
 *
 * **Validates: Requirements 6.2, 12.8**
 */

export interface OrganizationCardProps {
  organization: {
    id: string;
    name: string;
    logoUrl: string;
    website?: string;
  };
  className?: string;
}

function OrganizationCardComponent({ organization, className }: OrganizationCardProps) {
  const { name, logoUrl, website } = organization;
  const [imgFailed, setImgFailed] = useState(false);

  const content = (
    <GlassCard
      variant="hover-lift"
      className={cn(
        "px-4 py-6 md:px-6 md:py-8 flex flex-col items-center justify-center relative group",
        "min-h-[100px] md:min-h-[120px]",
        className
      )}
    >
      <motion.div
        className="relative w-full flex flex-col items-center justify-center gap-2"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {!imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={`${name} logo`}
            width={160}
            height={48}
            className={cn(
              "h-10 w-auto max-w-[140px] object-contain",
              "filter grayscale group-hover:grayscale-0",
              "transition-all duration-300 ease-out",
              "opacity-60 group-hover:opacity-100"
            )}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              "border border-white/15 bg-white/5 text-sm font-semibold text-text-secondary",
              "group-hover:border-brand-blue-primary/40 group-hover:text-brand-blue-primary",
              "transition-colors duration-300"
            )}
            aria-hidden="true"
          >
            {name.charAt(0)}
          </div>
        )}
        <span
          className={cn(
            "text-xs md:text-sm font-medium text-text-tertiary text-center",
            "group-hover:text-text-secondary transition-colors duration-300"
          )}
        >
          {name}
        </span>
      </motion.div>

      <div
        className={cn(
          "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100",
          "transition-opacity duration-300 pointer-events-none",
          "shadow-[0_0_30px_rgba(37,99,235,0.2)]"
        )}
        aria-hidden="true"
      />
    </GlassCard>
  );

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

export const OrganizationCard = memo(OrganizationCardComponent);
