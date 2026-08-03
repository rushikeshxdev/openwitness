"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  CHECKLIST_CATEGORIES,
  statusLabel,
  statusTone,
  type ChecklistAnswer,
  type ChecklistCategoryId,
  type VerificationQueueItem,
} from "@/data/verification-queue-data";
import { formatTimecode } from "@/data/evidence-detail-data";
import {
  BadgeCheck,
  Bookmark,
  Download,
  MoreHorizontal,
  Pause,
  Play,
  Share2,
  X,
} from "lucide-react";

type ChecklistState = Record<ChecklistCategoryId, ChecklistAnswer>;

function emptyChecklist(): ChecklistState {
  return {
    authenticity: null,
    timestamp: null,
    location: null,
    integrity: null,
    context: null,
  };
}

export function VerificationDetailPanel({
  item,
  onClose,
  onAction,
  className,
}: {
  item: VerificationQueueItem | null;
  onClose?: () => void;
  onAction: (
    itemId: string,
    action: "approve" | "reject" | "skip" | "request_info",
    notes?: string
  ) => void;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [checklist, setChecklist] = useState<ChecklistState>(emptyChecklist);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setPlaying(false);
    setFrameIndex(0);
    setChecklist(emptyChecklist());
    setNotes("");
  }, [item?.id]);

  const activeThumb = useMemo(() => {
    if (!item) return "";
    return item.filmstrip[frameIndex]?.thumbnailUrl ?? item.thumbnailUrl;
  }, [item, frameIndex]);

  const currentSeconds = item?.filmstrip[frameIndex]?.seconds ?? 0;
  const durationLabel = item?.metadata.duration ?? "01:23";

  if (!item) {
    return (
      <div
        className={cn(
          "flex h-full flex-col items-center justify-center p-6 text-center",
          className
        )}
      >
        <p className="text-sm font-medium text-zinc-400">
          Select evidence to review
        </p>
      </div>
    );
  }

  const setAnswer = (id: ChecklistCategoryId, value: ChecklistAnswer) => {
    setChecklist((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5 sm:px-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            Evidence Details
          </p>
          <p className="truncate font-mono text-[11px] text-zinc-500">
            {item.evidenceCode}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <IconBtn label="Download" icon={Download} />
          <IconBtn label="Share" icon={Share2} />
          <IconBtn label="Bookmark" icon={Bookmark} />
          <IconBtn label="More" icon={MoreHorizontal} />
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 xl:hidden"
              aria-label="Close details"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
        {/* Media */}
        <div>
          <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
            <Image
              src={activeThumb}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 90vw, 380px"
            />
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              onClick={() => setPlaying((p) => !p)}
              className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm"
            >
              {playing ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              )}
            </button>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2.5 pt-8">
              <div className="mb-1.5 h-1 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white"
                  style={{
                    width: `${Math.min(100, ((frameIndex + 1) / Math.max(1, item.filmstrip.length)) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-300">
                <span className="tabular-nums">
                  {formatTimecode(currentSeconds)} / {durationLabel}
                </span>
                <span
                  className={cn(
                    "rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                    statusTone(item.status)
                  )}
                >
                  {statusLabel(item.status)}
                </span>
              </div>
            </div>
          </div>

          {item.filmstrip.length > 1 ? (
            <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {item.filmstrip.map((frame, i) => (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => setFrameIndex(i)}
                  className={cn(
                    "relative h-12 w-[4.25rem] shrink-0 overflow-hidden rounded-md border",
                    i === frameIndex
                      ? "border-[#3B82F6]"
                      : "border-white/10 opacity-80 hover:opacity-100"
                  )}
                >
                  <Image
                    src={frame.thumbnailUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="68px"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Title / uploader */}
        <div>
          <h2 className="text-base font-semibold text-white">{item.title}</h2>
          <p className="mt-1 text-xs text-zinc-500">{item.location}</p>
          <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-zinc-400">
            {item.uploaderName}
            {item.uploaderVerified ? (
              <span className="inline-flex items-center gap-0.5 text-emerald-400">
                <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                Verified
              </span>
            ) : null}
          </p>
        </div>

        {/* Metadata */}
        <section>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Metadata
          </h3>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
            <MetaRow label="Date & Time" value={item.metadata.dateTime} />
            <MetaRow label="Device" value={item.metadata.device} />
            <MetaRow label="File Size" value={item.metadata.fileSize} />
            <MetaRow label="Resolution" value={item.metadata.resolution} />
            <MetaRow label="Format" value={item.metadata.format} />
            {item.metadata.duration ? (
              <MetaRow label="Duration" value={item.metadata.duration} />
            ) : null}
            <div className="col-span-2">
              <dt className="text-zinc-500">SHA-256</dt>
              <dd className="mt-0.5 break-all font-mono text-[11px] text-zinc-300">
                {item.metadata.sha256}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-zinc-500">GPS Coordinates</dt>
              <dd className="mt-0.5 flex flex-wrap items-center gap-2 text-zinc-300">
                <span>{item.metadata.gpsLabel}</span>
                <Link
                  href={item.metadata.mapHref}
                  className="font-medium text-[#60A5FA] hover:text-white"
                >
                  View on map
                </Link>
              </dd>
            </div>
          </dl>
        </section>

        {/* Checklist */}
        <section>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Verification Checklist
          </h3>
          <div className="space-y-2">
            {CHECKLIST_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5"
              >
                <p className="mb-2 text-xs font-medium text-zinc-200">
                  {cat.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      ["yes", "Yes"],
                      ["no", "No"],
                      ["unsure", "Unsure"],
                    ] as const
                  ).map(([value, label]) => {
                    const active = checklist[cat.id] === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAnswer(cat.id, value)}
                        className={cn(
                          "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                          active
                            ? value === "yes"
                              ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                              : value === "no"
                                ? "border-rose-500/50 bg-rose-500/20 text-rose-300"
                                : "border-amber-500/50 bg-amber-500/20 text-amber-300"
                            : "border-white/10 text-zinc-400 hover:text-white"
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section>
          <label
            htmlFor={`verif-notes-${item.id}`}
            className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-zinc-500"
          >
            Private notes (optional)
          </label>
          <textarea
            id={`verif-notes-${item.id}`}
            value={notes}
            maxLength={500}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Add context for yourself or moderators…"
            className="w-full resize-y rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
          />
          <p className="mt-1 text-right text-[10px] tabular-nums text-zinc-600">
            {notes.length}/500
          </p>
        </section>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onAction(item.id, "skip", notes)}
            className="rounded-xl border border-white/12 px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/5"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={() => onAction(item.id, "request_info", notes)}
            className="rounded-xl border border-white/12 px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/5"
          >
            Request More Info
          </button>
          <button
            type="button"
            onClick={() => onAction(item.id, "reject", notes)}
            className="rounded-xl border border-rose-500/40 px-3 py-2.5 text-sm font-semibold text-rose-300 hover:bg-rose-500/10"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => onAction(item.id, "approve", notes)}
            className="rounded-xl bg-emerald-500 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400"
          >
            Approve
          </button>
        </div>

        {/* Activity */}
        <section>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Community Activity
          </h3>
          <ul className="space-y-2">
            {item.activity.map((a) => (
              <li
                key={a.id}
                className="flex items-start gap-2.5 rounded-lg px-1 py-1"
              >
                <span
                  className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: a.accent }}
                >
                  {a.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-zinc-300">
                    <span className="font-medium text-white">{a.name}</span>{" "}
                    {a.action}
                  </span>
                  <span className="text-[10px] text-zinc-600">{a.timeLabel}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <p className="pb-2 text-center text-[11px] text-zinc-600">
          <Link href={item.detailHref} className="text-[#60A5FA] hover:text-white">
            Open full evidence page
          </Link>
        </p>
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-zinc-500">{label}</dt>
      <dd className="mt-0.5 text-zinc-200">{value}</dd>
    </div>
  );
}

function IconBtn({
  label,
  icon: Icon,
}: {
  label: string;
  icon: typeof Download;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
