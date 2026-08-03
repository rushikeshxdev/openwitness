"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  statusLabel,
  statusTone,
  type VerificationQueueItem,
} from "@/data/verification-queue-data";
import { BadgeCheck, MapPin } from "lucide-react";

export function VerificationQueueItem({
  item,
  selected,
  onSelect,
}: {
  item: VerificationQueueItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const progress = Math.round((item.reviewsDone / item.reviewsNeeded) * 100);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full gap-3 rounded-xl border p-3 text-left transition-colors",
        selected
          ? "border-[#3B82F6]/50 bg-[#3B82F6]/10"
          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
      )}
    >
      <span className="relative h-16 w-[5.5rem] shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40">
        <Image
          src={item.thumbnailUrl}
          alt=""
          fill
          className="object-cover"
          sizes="88px"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="line-clamp-1 text-sm font-semibold text-white">
            {item.title}
          </span>
          <span
            className={cn(
              "shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              statusTone(item.status)
            )}
          >
            {statusLabel(item.status)}
          </span>
        </span>

        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            <span className="line-clamp-1">{item.location}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>{item.dateLabel}</span>
        </span>

        <span className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
            {item.uploaderName}
            {item.uploaderVerified ? (
              <span className="inline-flex items-center gap-0.5 text-emerald-400">
                <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                Verified
              </span>
            ) : null}
          </span>
          <span className="text-[10px] tabular-nums text-zinc-500">
            {item.reviewsDone} of {item.reviewsNeeded} reviews
          </span>
        </span>

        <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-white/10">
          <span
            className={cn(
              "block h-full rounded-full",
              item.status === "verified"
                ? "bg-emerald-500"
                : item.status === "rejected"
                  ? "bg-rose-500"
                  : "bg-[#3B82F6]"
            )}
            style={{ width: `${progress}%` }}
          />
        </span>
      </span>
    </button>
  );
}
