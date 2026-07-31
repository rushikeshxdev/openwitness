"use client";

import { useId, useState } from "react";
import type { ProfileActivityPoint } from "@/data/profile-data";
import { ProfilePanel } from "./profile-gate";

export function ProfileActivityChart({
  series,
}: {
  series: ProfileActivityPoint[];
}) {
  const gradId = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);

  const w = 640;
  const h = 220;
  const padX = 28;
  const padY = 24;
  const max = Math.max(...series.map((p) => p.value), 1);

  const points = series.map((p, i) => {
    const x =
      padX + (i / Math.max(series.length - 1, 1)) * (w - padX * 2);
    const y = h - padY - (p.value / max) * (h - padY * 2);
    return { ...p, x, y };
  });

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const area = `${line} L ${points[points.length - 1]?.x ?? 0} ${h - padY} L ${points[0]?.x ?? 0} ${h - padY} Z`;

  const active = hover != null ? points[hover] : points[Math.min(6, points.length - 1)];

  return (
    <ProfilePanel title="Activity Overview">
      <div className="px-3 py-4 sm:px-5">
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${w} ${h}`}
            className="h-auto w-full min-w-[320px]"
            role="img"
            aria-label="Activity chart from January to August"
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75, 1].map((t) => (
              <line
                key={t}
                x1={padX}
                x2={w - padX}
                y1={h - padY - t * (h - padY * 2)}
                y2={h - padY - t * (h - padY * 2)}
                stroke="rgba(255,255,255,0.06)"
              />
            ))}
            <path d={area} fill={`url(#${gradId})`} />
            <path
              d={line}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((p, i) => (
              <g key={p.month}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hover === i || active?.month === p.month ? 5 : 3.5}
                  fill="#3B82F6"
                  stroke="#fff"
                  strokeWidth="1.5"
                  className="cursor-pointer"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  tabIndex={0}
                  role="img"
                  aria-label={`${p.month}: ${p.value}`}
                />
                <text
                  x={p.x}
                  y={h - 6}
                  textAnchor="middle"
                  className="fill-zinc-500"
                  fontSize="11"
                >
                  {p.month}
                </text>
              </g>
            ))}
            {active ? (
              <g>
                <rect
                  x={active.x - 28}
                  y={active.y - 36}
                  width="56"
                  height="24"
                  rx="6"
                  fill="#121214"
                  stroke="rgba(255,255,255,0.15)"
                />
                <text
                  x={active.x}
                  y={active.y - 20}
                  textAnchor="middle"
                  className="fill-white"
                  fontSize="12"
                  fontWeight="600"
                >
                  {active.value}
                </text>
              </g>
            ) : null}
          </svg>
        </div>
      </div>
    </ProfilePanel>
  );
}
