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
}: {
  item: EvidenceExplorerItem;
  className?: string;
}) {
  return (
    <Link
      href={evidenceDetailHref(item.eventId, item.evidenceId)}
      className={cn(
        "group block overflow-hidden rounded-xl border border-white/12 bg-[#121214]/90 transition-colors hover:border-white/20",
        className
      )}
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
            <span className="absolute bottom-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-white tabular-nums">
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
        <div className="p-3.5 space-y-2">
          <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-[#93C5FD] transition-colors">
            {item.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-zinc-500">
            <span>{item.dateLabel}</span>
            <span className="text-zinc-700">·</span>
            <span className="inline-flex items-center gap-1 min-w-0">
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
  );
}
