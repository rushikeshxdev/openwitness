"use client";

import { GlassCard } from "./glass-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Live Map Card — text left, dotted world map right (mockup)
 */

export interface LiveMapCardProps {
  href?: string;
  className?: string;
}

const HOTSPOTS = [
  { cx: 22, cy: 34, r: 2.6 },
  { cx: 28, cy: 52, r: 2.0 },
  { cx: 48, cy: 28, r: 2.4 },
  { cx: 52, cy: 48, r: 1.9 },
  { cx: 72, cy: 34, r: 2.8 },
  { cx: 80, cy: 42, r: 2.1 },
] as const;

function buildWorldDots(): ReadonlyArray<{ x: number; y: number }> {
  const dots: Array<{ x: number; y: number }> = [];
  for (let y = 8; y <= 78; y += 3.2) {
    for (let x = 4; x <= 96; x += 3.2) {
      const inAmericas =
        x >= 8 &&
        x <= 36 &&
        y >= 14 &&
        y <= 70 &&
        Math.sin((y - 16) * 0.09) * 5 + 18 > x - 10;
      const inEuropeAfrica =
        x >= 40 && x <= 58 && y >= 14 && y <= 68 && !(x > 54 && y < 22);
      const inAsia =
        x >= 58 && x <= 92 && y >= 14 && y <= 54 && (x < 86 || y < 44);
      const inOceania = x >= 78 && x <= 94 && y >= 56 && y <= 74;

      if (
        (inAmericas || inEuropeAfrica || inAsia || inOceania) &&
        Math.round(x * 7 + y * 13) % 3 !== 0
      ) {
        dots.push({ x, y });
      }
    }
  }
  return dots;
}

const WORLD_DOTS = buildWorldDots();

function MiniWorldMap() {
  return (
    <svg
      viewBox="0 0 100 80"
      className="w-full h-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {WORLD_DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={0.5} className="fill-white/25" />
      ))}
      {HOTSPOTS.map((h, i) => (
        <g key={i}>
          <circle
            cx={h.cx}
            cy={h.cy}
            r={h.r * 2.6}
            className="fill-[#3B82F6]/20 motion-safe:animate-pulse"
          />
          <circle
            cx={h.cx}
            cy={h.cy}
            r={h.r}
            className="fill-[#3B82F6]"
            style={{ filter: "drop-shadow(0 0 5px rgba(59,130,246,0.95))" }}
          />
        </g>
      ))}
    </svg>
  );
}

export function LiveMapCard({ href = "#map", className }: LiveMapCardProps) {
  return (
    <Link
      href={href}
      className={cn("block h-full min-h-[180px]", className)}
      aria-label="View live map of events around the world"
    >
      <GlassCard
        variant="hover-lift"
        className={cn(
          "h-full p-5 sm:p-6",
          "bg-black/45 border-white/[0.12]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
          "flex flex-row items-center gap-4 sm:gap-5",
          "cursor-pointer group overflow-hidden"
        )}
      >
        <div className="w-[42%] sm:w-[38%] shrink-0 flex flex-col justify-center pr-1">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Live Map
          </h3>
          <p className="text-zinc-400 text-sm sm:text-base leading-snug mb-4">
            See events happening around the world
          </p>
          <span className="inline-flex items-center text-[#3B82F6] text-base font-medium group-hover:text-sky-400 transition-colors">
            View Map
            <ArrowRight
              className="ml-1.5 w-5 h-5 group-hover:translate-x-0.5 transition-transform"
              aria-hidden="true"
            />
          </span>
        </div>

        <div className="relative flex-1 self-stretch min-h-[136px] rounded-lg overflow-hidden">
          <MiniWorldMap />
        </div>
      </GlassCard>
    </Link>
  );
}
