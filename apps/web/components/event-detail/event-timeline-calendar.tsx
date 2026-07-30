"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface EventTimelineCalendarProps {
  year: number;
  month: number; // 0-indexed
  activeDates: string[];
  selectedDate: string | null;
  onSelectDate: (dateKey: string | null) => void;
  className?: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function EventTimelineCalendar({
  year,
  month,
  activeDates,
  selectedDate,
  onSelectDate,
  className,
}: EventTimelineCalendarProps) {
  const activeSet = useMemo(() => new Set(activeDates), [activeDates]);

  const { label, cells } = useMemo(() => {
    const first = new Date(Date.UTC(year, month, 1));
    const label = first.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
    const startWeekday = first.getUTCDay();
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells: ({ day: number; key: string } | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({
        day,
        key: `${year}-${pad(month + 1)}-${pad(day)}`,
      });
    }
    return { label, cells };
  }, [year, month]);

  // Display-only month navigation is fixed to data month for v1
  // (mockup shows a single month with activity). Keep chevrons disabled visually.

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/12 bg-[#121214]/90 p-4 backdrop-blur-md",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Jump to Date</h3>
        <div className="flex items-center gap-1 text-zinc-500">
          <span className="rounded p-1 opacity-40" aria-hidden="true">
            <ChevronLeft className="h-4 w-4" />
          </span>
          <span className="rounded p-1 opacity-40" aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
      <p className="mb-3 text-center text-xs font-medium text-zinc-400">{label}</p>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-zinc-600">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) return <div key={`e-${i}`} />;
          const active = activeSet.has(cell.key);
          const selected = selectedDate === cell.key;
          return (
            <button
              key={cell.key}
              type="button"
              disabled={!active}
              onClick={() =>
                onSelectDate(selected ? null : cell.key)
              }
              aria-label={`${cell.key}${active ? ", has updates" : ""}`}
              aria-pressed={selected}
              className={cn(
                "flex h-8 items-center justify-center rounded-lg text-xs tabular-nums transition-colors",
                !active && "cursor-default text-zinc-700",
                active &&
                  !selected &&
                  "text-zinc-200 hover:bg-white/10",
                selected && "bg-[#3B82F6] font-semibold text-white"
              )}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
      {selectedDate && (
        <button
          type="button"
          onClick={() => onSelectDate(null)}
          className="mt-3 w-full text-center text-xs text-[#60A5FA] hover:text-white"
        >
          Clear date filter
        </button>
      )}
    </div>
  );
}
