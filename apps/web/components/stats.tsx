"use client";

import { GlassCard } from "./glass-card";
import { motion, useSpring, useInView } from "framer-motion";
import { useEffect, useRef, memo } from "react";
import { staggerContainerFast } from "@/lib/animations";

/**
 * Stats component - Animated numeric statistics with labels
 * Optimized with React.memo to prevent unnecessary re-renders
 * 
 * **Validates: Requirements 1.6, 1.7, 12.4**
 * 
 * Features:
 * - Grid layout with responsive columns (3 on desktop, 1-2 on mobile)
 * - Animates from 0 to target value using useSpring
 * - Triggers animation when stats enter viewport using useInView
 * - Each stat wrapped in GlassCard component
 * - Number typography: 48px bold, label: 18px regular
 * 
 * @example
 * ```tsx
 * <Stats
 *   stats={[
 *     { label: "Active Events", value: 1247 },
 *     { label: "Evidence Items", value: 48392, suffix: "+" },
 *     { label: "Global Contributors", value: 15234 }
 *   ]}
 * />
 * ```
 */

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  increment?: string;
}

export interface StatsProps {
  stats: Stat[];
  animationDuration?: number;
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
        const formatted = Math.floor(latest).toLocaleString();
        displayValue.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });

    return unsubscribe;
  }, [prefix, suffix, springValue]);

  return <span ref={displayValue}>0</span>;
});

export function Stats({ stats, animationDuration = 2 }: StatsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      variants={staggerContainerFast}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1 + 0.8, // Start after hero content
          }}
        >
          <GlassCard
            variant="default"
            className="p-6 sm:p-8 text-center hover:bg-white/10 transition-colors bg-black/40"
          >
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-2">
              <AnimatedNumber
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                isInView={isInView}
              />
            </div>
            <div className="text-base md:text-body text-text-secondary mb-1">{stat.label}</div>
            {stat.increment && (
              <div className="text-sm text-brand-blue-primary">{stat.increment}</div>
            )}
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
