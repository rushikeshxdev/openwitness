"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CompareSlot } from "@/data/compare-evidence-data";
import { MAX_COMPARE_SLOTS } from "@/data/compare-evidence-data";
import { BadgeCheck, MoreHorizontal, Play, Plus, X } from "lucide-react";

export function CompareSlotStrip({
  slots,
  onRemove,
  onAdd,
}: {
  slots: CompareSlot[];
  onRemove: (evidenceId: string, eventId: string) => void;
  onAdd: () => void;
}) {
  const canAdd = slots.length < MAX_COMPARE_SLOTS;
  const canRemove = slots.length > 2;

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {slots.map((slot) => (
        <article
          key={`${slot.eventId}:${slot.evidenceId}`}
          className="relative w-[220px] shrink-0 overflow-hidden rounded-2xl border border-white/12 bg-[#121214]/90 sm:w-[240px]"
        >
          <div className="absolute left-2 top-2 z-10 flex items-center gap-1.5">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#3B82F6] text-xs font-bold text-white">
              {slot.letter}
            </span>
            {slot.verified ? (
              <span className="inline-flex items-center gap-0.5 rounded-md border border-emerald-500/20 bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                Verified
              </span>
            ) : null}
          </div>
          <div className="absolute right-2 top-2 z-10 flex gap-1">
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/50 text-zinc-300 backdrop-blur-sm"
              aria-label="More options"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
            {canRemove ? (
              <button
                type="button"
                onClick={() => onRemove(slot.evidenceId, slot.eventId)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/50 text-zinc-300 backdrop-blur-sm hover:text-white"
                aria-label={`Remove ${slot.letter}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>

          <Link href={slot.detailHref} className="group block">
            <div className="relative aspect-video bg-black/40">
              <Image
                src={slot.thumbnailUrl}
                alt=""
                fill
                className="object-cover brightness-[0.7] transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="240px"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                </span>
              </span>
              <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-white">
                {slot.duration}
              </span>
            </div>
            <div className="p-3">
              <h3 className="line-clamp-1 text-sm font-semibold text-white group-hover:text-[#60A5FA]">
                {slot.title}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                {slot.mediaType} · {slot.duration}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: slot.uploaderAccent }}
                  aria-hidden="true"
                >
                  {slot.uploaderInitials}
                </span>
                <span className="truncate text-xs text-zinc-400">
                  {slot.uploader}
                </span>
              </div>
            </div>
          </Link>
        </article>
      ))}

      {canAdd ? (
        <button
          type="button"
          onClick={onAdd}
          className={cn(
            "flex w-[180px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-8 text-sm font-medium text-zinc-400 transition-colors hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/5 hover:text-white sm:w-[200px]"
          )}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/30">
            <Plus className="h-5 w-5" aria-hidden="true" />
          </span>
          Add more evidence
          <span className="text-[11px] font-normal text-zinc-600">
            Up to {MAX_COMPARE_SLOTS} items
          </span>
        </button>
      ) : null}
    </div>
  );
}
