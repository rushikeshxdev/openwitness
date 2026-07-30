"use client";

import { GlassCard } from "./glass-card";
import { motion, useSpring, useInView, MotionConfig } from "framer-motion";
import { useEffect, useRef, memo } from "react";
import { staggerContainerFast } from "@/lib/animations";
import { cn } from "@/lib/utils";
import {
  FolderOpen,
  CalendarDays,
  MapPin,
  Users,
  type LucideIcon,
} from "lucide-react";

export type StatIconKey = "folder" | "calendar" | "map-pin" | "users";

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  increment?: string;
  icon?: LucideIcon | StatIconKey;
}

export interface StatsProps {
  stats: Stat[];
  /** Layout mode for parent grids */
  layout?: "grid" | "contents";
  className?: string;
}

const iconMap: Record<StatIconKey, LucideIcon> = {
  folder: FolderOpen,
  calendar: CalendarDays,
  "map-pin": MapPin,
  users: Users,
};

function resolveIcon(icon?: Stat["icon"]): LucideIcon | null {
  if (!icon) return null;
  if (typeof icon === "string") return iconMap[icon] ?? null;
  return icon;
}

const AnimatedNumber = memo(function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  isInView,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  isInView: boolean;
}) {
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
  });
  const displayValue = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (displayValue.current) {
        displayValue.current.textContent = `${prefix}${Math.floor(latest).toLocaleString()}${suffix}`;
      }
    });
    return unsubscribe;
  }, [prefix, suffix, springValue]);

  return (
    <span ref={displayValue} suppressHydrationWarning>
      {prefix}0{suffix}
    </span>
  );
});

const StatCard = memo(function StatCard({
  stat,
  index,
  isInView,
}: {
  stat: Stat;
  index: number;
  isInView: boolean;
}) {
  const Icon = resolveIcon(stat.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="h-full"
    >
      <GlassCard
        variant="hover-lift"
        className="p-5 sm:p-6 h-full flex flex-col bg-black/40"
      >
        {Icon && (
          <div className="mb-4 text-brand-blue-primary">
            <Icon className="w-6 h-6" aria-hidden="true" />
          </div>
        )}
        <div className="text-3xl md:text-4xl font-bold text-text-primary mb-1 tabular-nums">
          <AnimatedNumber
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
            isInView={isInView}
          />
        </div>
        <div className="text-sm md:text-base text-text-secondary mb-2">
          {stat.label}
        </div>
        {stat.increment && (
          <div className="mt-auto text-sm font-medium text-brand-blue-primary">
            {stat.increment}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
});

export function Stats({ stats, layout = "grid", className }: StatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        ref={ref}
        variants={staggerContainerFast}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        className={cn(
          layout === "grid" &&
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto",
          layout === "contents" && "contents",
          className
        )}
      >
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            stat={stat}
            index={index}
            isInView={isInView}
          />
        ))}
      </motion.div>
    </MotionConfig>
  );
}
