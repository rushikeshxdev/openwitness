"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { EventCategory } from "@/types/event";
import type { ComponentType } from "react";
import {
  LayoutGrid,
  Megaphone,
  CloudLightning,
  CarFront,
  Users,
  MoreHorizontal,
} from "lucide-react";

export type CategoryFilter = "all" | EventCategory;

const CATEGORIES: {
  id: CategoryFilter;
  label: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  { id: "all", label: "All Events", icon: LayoutGrid },
  { id: "protest", label: "Protests", icon: Megaphone },
  { id: "disaster", label: "Disasters", icon: CloudLightning },
  { id: "accident", label: "Accidents", icon: CarFront },
  { id: "gathering", label: "Gatherings", icon: Users },
  { id: "other", label: "Other", icon: MoreHorizontal },
];

export interface CategoryPillsProps {
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
  className?: string;
}

export function CategoryPills({ value, onChange, className }: CategoryPillsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 sm:gap-2.5",
        className
      )}
      role="tablist"
      aria-label="Event categories"
    >
      {CATEGORIES.map(({ id, label, icon: Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
              "border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]",
              active
                ? "bg-[#3B82F6] border-[#3B82F6] text-white shadow-[0_4px_14px_rgba(59,130,246,0.35)]"
                : "bg-black/40 border-white/15 text-zinc-200 hover:bg-white/10 hover:border-white/25"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export interface ExploreHeroProps {
  category: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  backgroundImage?: string;
}

export function ExploreHero({
  category,
  onCategoryChange,
  backgroundImage = "/images/hero-bg.png",
}: ExploreHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          quality={70}
          className="object-cover object-center brightness-[0.45] contrast-[1.05]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0B0E11]/55 via-[#0B0E11]/75 to-[#0B0E11]"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-8 md:pb-10">
        <h1 className="text-4xl sm:text-5xl md:text-[3.25rem] font-bold text-white tracking-tight mb-3">
          Explore Events
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mb-6 md:mb-8">
          Discover, document and verify public events happening around the
          world.
        </p>
        <CategoryPills value={category} onChange={onCategoryChange} />
      </div>
    </section>
  );
}
