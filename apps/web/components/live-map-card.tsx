import { GlassCard } from "./glass-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Live Map Card — static preview linking to the full map section.
 * Dot grid is module-scoped so it is built once, not per render.
 */

export interface LiveMapCardProps {
  href?: string;
  className?: string;
}

const HOTSPOTS = [
  { cx: 72, cy: 38, r: 3.5 },
  { cx: 48, cy: 32, r: 2.8 },
  { cx: 22, cy: 42, r: 2.5 },
  { cx: 78, cy: 55, r: 2.2 },
  { cx: 52, cy: 58, r: 2.0 },
] as const;

function buildWorldDots(): ReadonlyArray<{ x: number; y: number }> {
  const dots: Array<{ x: number; y: number }> = [];
  for (let y = 12; y <= 78; y += 4) {
    for (let x = 8; x <= 92; x += 4) {
      const inAmericas =
        x >= 12 &&
        x <= 32 &&
        y >= 18 &&
        y <= 70 &&
        Math.sin((y - 20) * 0.08) * 6 + 22 > x - 8;
      const inEuropeAfrica = x >= 42 && x <= 58 && y >= 18 && y <= 68;
      const inAsia = x >= 58 && x <= 88 && y >= 18 && y <= 58 && (x < 82 || y < 48);
      const inOceania = x >= 78 && x <= 90 && y >= 58 && y <= 72;

      if (
        (inAmericas || inEuropeAfrica || inAsia || inOceania) &&
        (x * 7 + y * 13) % 3 !== 0
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
        <circle key={i} cx={d.x} cy={d.y} r={0.7} className="fill-white/25" />
      ))}
      {HOTSPOTS.map((h, i) => (
        <g key={i}>
          <circle
            cx={h.cx}
            cy={h.cy}
            r={h.r * 2.2}
            className="fill-brand-blue-primary/20 motion-safe:animate-pulse"
          />
          <circle
            cx={h.cx}
            cy={h.cy}
            r={h.r}
            className="fill-brand-blue-primary"
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
      className={className}
      aria-label="View live map of events around the world"
    >
      <GlassCard
        variant="hover-lift"
        className="p-5 sm:p-6 h-full flex flex-col bg-black/40 hover:bg-white/10 cursor-pointer group overflow-hidden"
      >
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-text-primary mb-1">Live Map</h3>
          <p className="text-text-secondary text-sm">
            See events happening around the world
          </p>
        </div>

        <div className="relative flex-1 min-h-[100px] my-2 rounded-lg overflow-hidden bg-gradient-to-b from-blue-950/40 to-transparent">
          <MiniWorldMap />
        </div>

        <div className="mt-2 flex items-center text-brand-blue-primary group-hover:text-brand-cyan-accent transition-colors">
          <span className="font-medium text-sm">View Map</span>
          <ArrowRight
            className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          />
        </div>
      </GlassCard>
    </Link>
  );
}
