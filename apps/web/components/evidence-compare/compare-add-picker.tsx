"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { CompareIdPair, ComparePickerItem } from "@/data/compare-evidence-data";
import { BadgeCheck, X } from "lucide-react";

export function CompareAddPicker({
  open,
  items,
  selectedKeys,
  onClose,
  onPick,
}: {
  open: boolean;
  items: ComparePickerItem[];
  selectedKeys: Set<string>;
  onClose: () => void;
  onPick: (pair: CompareIdPair) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const available = items.filter(
    (item) => !selectedKeys.has(`${item.eventId}:${item.evidenceId}`)
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Dismiss"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-picker-title"
        className="relative flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#121214] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5">
          <h2 id="compare-picker-title" className="text-base font-semibold text-white">
            Add evidence to compare
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto p-2">
          {available.length === 0 ? (
            <li className="px-3 py-10 text-center text-sm text-zinc-500">
              No more evidence available to add.
            </li>
          ) : (
            available.map((item) => (
              <li key={`${item.eventId}:${item.evidenceId}`}>
                <button
                  type="button"
                  onClick={() =>
                    onPick({
                      eventId: item.eventId,
                      evidenceId: item.evidenceId,
                    })
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
                >
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.thumbnailUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {item.location} · {item.duration}
                    </p>
                  </div>
                  {item.verified ? (
                    <BadgeCheck
                      className="h-4 w-4 shrink-0 text-emerald-400"
                      aria-label="Verified"
                    />
                  ) : null}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
