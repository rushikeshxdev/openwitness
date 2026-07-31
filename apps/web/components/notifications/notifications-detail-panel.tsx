"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, X, BadgeCheck } from "lucide-react";
import type { AppNotification } from "@/data/notifications-data";
import { cn } from "@/lib/utils";

export function NotificationsDetailPanel({
  item,
  onClose,
  className,
}: {
  item: AppNotification | null;
  onClose?: () => void;
  className?: string;
}) {
  if (!item) {
    return (
      <div
        className={cn(
          "flex h-full flex-col items-center justify-center px-6 text-center",
          className
        )}
      >
        <p className="text-sm font-medium text-zinc-300">Select a notification</p>
        <p className="mt-1 max-w-[220px] text-xs text-zinc-500">
          Choose an item from the feed to see details and actions.
        </p>
      </div>
    );
  }

  const { detail } = item;
  const whenLabel =
    detail.kind === "verification"
      ? `Today at ${item.timeLabel}`
      : item.timeLabel;

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-base font-semibold leading-snug text-white sm:text-lg">
            {detail.headline}
          </h2>
          <p className="mt-1 text-xs text-zinc-500">{whenLabel}</p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white"
            aria-label="Close detail"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
        <p className="text-sm leading-relaxed text-zinc-400">{detail.summary}</p>

        {detail.kind === "verification" ? (
          <>
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <BadgeCheck className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-emerald-300">
                    {detail.verifiedLabel}
                  </p>
                  <p className="mt-0.5 text-xs text-emerald-400/80">
                    {detail.reviewCount} Reviews
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={detail.evidence.href}
              className="flex gap-3 rounded-xl border border-white/12 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.05]"
            >
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10">
                <Image
                  src={detail.evidence.thumbnailUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">
                  {detail.evidence.title}
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  {detail.evidence.mediaLabel}
                </p>
                <p className="mt-1 text-[11px] text-zinc-500">
                  {detail.evidence.uploadedLabel}
                </p>
              </div>
            </Link>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Top Reviewers
                </h3>
                <span className="text-[11px] text-[#60A5FA]">View all</span>
              </div>
              <ul className="space-y-2">
                {detail.reviewers.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#3B82F6]/20 text-xs font-bold text-[#93C5FD]">
                      {r.initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-200">
                        {r.name}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Trust Score {r.trustScore}/100
                      </p>
                    </div>
                    <BadgeCheck
                      className="h-4 w-4 shrink-0 text-emerald-400"
                      aria-hidden="true"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
      </div>

      <div className="shrink-0 space-y-2 border-t border-white/10 p-4 sm:p-5">
        {detail.primaryCta ? (
          <Link
            href={detail.primaryCta.href}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB]"
          >
            {detail.primaryCta.label}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : null}
        {detail.secondaryCta ? (
          <Link
            href={detail.secondaryCta.href}
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/12 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-white/5"
          >
            {detail.secondaryCta.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
