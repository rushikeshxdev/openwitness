"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  evidenceDetailHref,
  type EvidenceExplorerItem,
} from "@/data/evidence-explorer-data";
import { BadgeCheck, MapPin } from "lucide-react";

export function EvidenceExplorerCard({
  item,
  className,
  selectable,
  selected,
  onToggleSelect,
}: {
  item: EvidenceExplorerItem;
  className?: string;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-[#121214]/90 transition-colors",
        selected
          ? "border-[#3B82F6]/50"
          : "border-white/12 hover:border-white/20",
        className
      )}
    >
      {selectable ? (
        <label className="absolute left-2 top-2 z-10 inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={!!selected}
            onChange={() => onToggleSelect?.()}
            className="h-4 w-4 rounded border-white/20 bg-black/50 text-[#3B82F6] focus:ring-[#3B82F6]"
            aria-label={`Select ${item.title} for compare`}
          />
        </label>
      ) : null}
      <Link
        href={evidenceDetailHref(item.eventId, item.evidenceId)}
        className="group block"
      >
        <article>
          <div className="relative aspect-video bg-[#0a1220]">
            <Image
              src={item.thumbnailUrl}
              alt=""
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {item.duration ? (
              <span className="absolute bottom-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-white">
                {item.duration}
              </span>
            ) : (
              <span className="absolute bottom-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-200">
                {item.mediaType}
              </span>
            )}
            {item.verified ? (
              <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-emerald-500/90 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                Verified
              </span>
            ) : null}
          </div>
          <div className="space-y-2 p-3.5">
            <h3 className="line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-[#93C5FD]">
              {item.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-zinc-500">
              <span>{item.dateLabel}</span>
              <span className="text-zinc-700">·</span>
              <span className="inline-flex min-w-0 items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.location}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}
