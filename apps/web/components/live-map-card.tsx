"use client";

import { GlassCard } from "./glass-card";
import { ArrowRight, Globe } from "lucide-react";
import Link from "next/link";

/**
 * Live Map Card component - Card that links to the live map view
 * Designed to be placed alongside stats cards
 * 
 * Features:
 * - Title and subtitle
 * - "View Map →" link
 * - Globe icon
 * - Glass morphism styling matching stats cards
 */

export interface LiveMapCardProps {
  onClick?: () => void;
  href?: string;
}

export function LiveMapCard({ onClick, href = "#map" }: LiveMapCardProps) {
  const content = (
    <GlassCard
      variant="hover-lift"
      className="p-6 sm:p-8 h-full flex flex-col justify-between bg-black/40 hover:bg-white/10 transition-colors cursor-pointer group"
    >
      <div>
        <div className="mb-4 text-brand-blue-primary">
          <Globe className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-text-primary mb-2">
          Live Map
        </h3>
        <p className="text-text-secondary text-sm md:text-base">
          See events happening around the world
        </p>
      </div>
      
      <div className="mt-6 flex items-center text-brand-blue-primary group-hover:text-brand-cyan-accent transition-colors">
        <span className="font-medium">View Map</span>
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </div>
    </GlassCard>
  );

  if (href && !onClick) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return <div onClick={onClick}>{content}</div>;
}
