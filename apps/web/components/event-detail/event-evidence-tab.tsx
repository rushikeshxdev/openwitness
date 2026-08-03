"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/glass-card";
import { listEvidenceForEvent } from "@/data/evidence-detail-data";
import { compareHref } from "@/data/compare-evidence-data";
import type { EventDetailViewModel } from "@/data/event-detail-data";
import { BadgeCheck, ExternalLink, GitCompareArrows, Plus } from "lucide-react";

export function EventEvidenceTab({
  detail,
}: {
  detail: EventDetailViewModel;
}) {
  const items = useMemo(
    () => listEvidenceForEvent(detail.id),
    [detail.id]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Evidence</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {items.length} file{items.length === 1 ? "" : "s"} linked to this
            event
            {detail.evidenceCount > items.length
              ? ` · ${detail.evidenceCount.toLocaleString()} total in catalog`
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.length >= 2 ? (
            <Link
              href={compareHref(
                items.slice(0, 5).map((item) => ({
                  eventId: detail.id,
                  evidenceId: item.id,
                }))
              )}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 px-3.5 py-2.5 text-sm font-medium text-zinc-200 hover:bg-white/5"
            >
              <GitCompareArrows className="h-3.5 w-3.5" aria-hidden="true" />
              Compare
            </Link>
          ) : null}
          <Link
            href="/evidence"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 px-3.5 py-2.5 text-sm font-medium text-zinc-200 hover:bg-white/5"
          >
            Open Explorer
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/evidence/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3B82F6] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Evidence
          </Link>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/events/${detail.id}/evidence/${encodeURIComponent(item.id)}`}
              className={cn(
                "group block overflow-hidden rounded-xl border border-white/12 bg-[#121214]/90",
                "transition-colors hover:border-white/20"
              )}
            >
              <article>
                <div className="relative aspect-video bg-[#0a1220]">
                  <Image
                    src={item.thumbnailUrl}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <span className="absolute bottom-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-white tabular-nums">
                    {item.duration}
                  </span>
                  {item.verified ? (
                    <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-emerald-500/90 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                      Verified
                    </span>
                  ) : null}
                </div>
                <div className="p-3.5">
                  <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-[#93C5FD] transition-colors">
                    {item.title}
                  </h3>
                  {item.relativeLabel ? (
                    <p className="mt-1.5 text-[11px] text-zinc-500">
                      {item.relativeLabel}
                    </p>
                  ) : null}
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <GlassCard className="p-8 text-center bg-[#121214]/90 border-white/[0.12]">
          <p className="text-base font-medium text-white">No evidence files yet</p>
          <p className="mt-2 text-sm text-zinc-400">
            Be the first to upload media for {detail.title}.
          </p>
          <Link
            href="/evidence/new"
            className="mt-4 inline-flex text-sm font-medium text-[#60A5FA] hover:text-white"
          >
            Add Evidence
          </Link>
        </GlassCard>
      )}
    </div>
  );
}
