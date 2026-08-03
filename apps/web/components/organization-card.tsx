"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GlassCard } from "./glass-card";
import { memo } from "react";
import Link from "next/link";

/**
 * OrganizationCard — compact trusted-org strip card with circular avatar
 */

export interface OrganizationCardProps {
  organization: {
    id: string;
    name: string;
    initials: string;
    accent: string;
    category?: string;
  };
  href?: string;
  className?: string;
}

function OrganizationCardComponent({
  organization,
  href,
  className,
}: OrganizationCardProps) {
  const { id, name, initials, accent, category } = organization;
  const targetHref = href ?? `/organizations/${id}`;

  return (
    <Link
      href={targetHref}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary rounded-xl"
      aria-label={`View ${name} on Organizations`}
    >
      <GlassCard
        variant="hover-lift"
        className={cn(
          "px-4 py-6 md:px-6 md:py-8 flex flex-col items-center justify-center relative group",
          "min-h-[100px] md:min-h-[120px]",
          className
        )}
      >
        <motion.div
          className="relative w-full flex flex-col items-center justify-center gap-2.5"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shadow-inner"
            style={{ backgroundColor: accent }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <span
            className={cn(
              "text-xs md:text-sm font-medium text-text-secondary text-center",
              "group-hover:text-white transition-colors duration-300"
            )}
          >
            {name}
          </span>
          {category ? (
            <span className="text-[10px] text-zinc-500 text-center line-clamp-1 px-1">
              {category}
            </span>
          ) : null}
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
    </Link>
  );
}

export const OrganizationCard = memo(OrganizationCardComponent);
