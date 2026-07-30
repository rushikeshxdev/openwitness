"use client";

import { GlassCard } from "./glass-card";
import { motion, useSpring, useInView, MotionConfig } from "framer-motion";
import { useEffect, useRef, useState, memo } from "react";
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
  /** When true, fill a parent CSS grid as direct children (no wrapper box). */
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
  const springValue = useSpring(0, { stiffness: 100, damping: 30 });
  const displayValue = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isInView) springValue.set(value);
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
      initial={{ opacity: 1, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 10 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="h-full min-h-0"
    >
      <GlassCard
        variant="hover-lift"
        className={cn(
          "h-full flex flex-col",
          "p-5 sm:p-6",
          "bg-black/45 border-white/[0.12]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
        )}
      >
        {Icon && (
          <div
            className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#3B82F6]/45 bg-[#3B82F6]/10 text-[#3B82F6]"
            aria-hidden="true"
          >
            <Icon className="w-5 h-5" strokeWidth={1.75} />
          </div>
        )}
        <div className="text-[2rem] sm:text-[2.25rem] font-bold text-white mb-1.5 tabular-nums tracking-tight leading-none">
          <AnimatedNumber
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
            isInView={isInView}
          />
        </div>
        <div className="text-sm sm:text-base text-zinc-300 mb-3.5">
          {stat.label}
        </div>
        {stat.increment && (
          <div className="mt-auto text-sm text-zinc-500">{stat.increment}</div>
        )}
      </GlassCard>
    </motion.div>
  );
});

export function Stats({ stats, layout = "grid", className }: StatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inViewObserved = useInView(ref, { once: true, amount: 0.2 });
  // display:contents has no box — IntersectionObserver can't see it, so mount-trigger instead
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const isInView = layout === "contents" ? mounted : inViewObserved;

  const cards = stats.map((stat, index) => (
    <StatCard
      key={stat.label}
      stat={stat}
      index={index}
      isInView={isInView}
    />
  ));

  return (
    <MotionConfig reducedMotion="user">
      {layout === "contents" ? (
        <>{cards}</>
      ) : (
        <div
          ref={ref}
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto",
            className
          )}
        >
          {cards}
        </div>
      )}
    </MotionConfig>
  );
}
