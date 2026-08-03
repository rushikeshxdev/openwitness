"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type {
  CompareAction,
  CompareAiInsight,
  CompareHighlight,
  CompareHighlightTone,
} from "@/data/compare-evidence-data";
import {
  AlertTriangle,
  CheckCircle2,
  FilePlus2,
  FolderPlus,
  Info,
  Share2,
  Sparkles,
} from "lucide-react";
import type { ComponentType } from "react";

const TONE_ICON: Record<
  CompareHighlightTone,
  ComponentType<{ className?: string }>
> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

const TONE_CLASS: Record<CompareHighlightTone, string> = {
  success: "text-emerald-400",
  warning: "text-amber-400",
  info: "text-[#60A5FA]",
};

const ACTION_ICON: Record<string, ComponentType<{ className?: string }>> = {
  report: FilePlus2,
  event: FolderPlus,
  share: Share2,
};

export function CompareAnalysisPanel({
  highlights,
  ai,
  actions,
  onShare,
}: {
  highlights: CompareHighlight[];
  ai: CompareAiInsight;
  actions: CompareAction[];
  onShare: () => void;
}) {
  return (
    <aside className="space-y-4">
      <section className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5">
        <h2 className="text-base font-semibold text-white">Comparison Highlights</h2>
        <ul className="mt-3 space-y-3">
          {highlights.map((h) => {
            const Icon = TONE_ICON[h.tone];
            return (
              <li key={h.id} className="flex gap-2.5 text-sm leading-snug text-zinc-300">
                <Icon
                  className={cn("mt-0.5 h-4 w-4 shrink-0", TONE_CLASS[h.tone])}
                  aria-hidden="true"
                />
                <span>{h.text}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-white">
          <Sparkles className="h-4 w-4 text-[#60A5FA]" aria-hidden="true" />
          AI Insights
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">{ai.summary}</p>
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
          Key objects detected in all
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {ai.keyObjects.map((obj) => (
            <li
              key={obj}
              className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-xs text-zinc-300"
            >
              {obj}
            </li>
          ))}
        </ul>
        <Link
          href={ai.reportHref}
          className="mt-4 inline-flex text-sm font-medium text-[#60A5FA] hover:text-[#93C5FD]"
        >
          View AI Analysis Report →
        </Link>
      </section>

      <section className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5">
        <h2 className="text-base font-semibold text-white">Take Action</h2>
        <ul className="mt-3 space-y-2">
          {actions.map((action) => {
            const Icon = ACTION_ICON[action.id] ?? FilePlus2;
            if (action.id === "share") {
              return (
                <li key={action.id}>
                  <button
                    type="button"
                    onClick={onShare}
                    className="flex w-full items-center gap-2.5 rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-left text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.06]"
                  >
                    <Icon className="h-4 w-4 text-[#60A5FA]" aria-hidden="true" />
                    {action.label}
                  </button>
                </li>
              );
            }
            return (
              <li key={action.id}>
                <Link
                  href={action.href}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.06]"
                >
                  <Icon className="h-4 w-4 text-[#60A5FA]" aria-hidden="true" />
                  {action.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
