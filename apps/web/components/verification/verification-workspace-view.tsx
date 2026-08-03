"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, PanelRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  filterVerificationQueue,
  loadVerificationQueue,
  queueStats,
  saveVerificationReview,
  type StoredReviewAction,
  type VerificationMediaTab,
  type VerificationQueueItem,
  type VerificationSort,
} from "@/data/verification-queue-data";
import { VerificationGate } from "./verification-gate";
import { VerificationSidebar } from "./verification-sidebar";
import { VerificationQueueHeader } from "./verification-queue-header";
import { VerificationQueueList } from "./verification-queue-list";
import { VerificationDetailPanel } from "./verification-detail-panel";

const VALID_MEDIA = new Set<VerificationMediaTab>([
  "all",
  "image",
  "video",
  "audio",
  "document",
  "other",
]);

function VerificationWorkspaceInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<VerificationQueueItem[]>([]);
  const [media, setMedia] = useState<VerificationMediaTab>("all");
  const [sort, setSort] = useState<VerificationSort>("newest");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const refresh = useCallback(() => {
    setItems(loadVerificationQueue());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const m = searchParams.get("media");
    if (m && VALID_MEDIA.has(m as VerificationMediaTab)) {
      setMedia(m as VerificationMediaTab);
    }
    const id = searchParams.get("id");
    if (id) {
      setSelectedId(id);
      setPanelOpen(true);
    }
  }, [searchParams]);

  const filtered = useMemo(
    () => filterVerificationQueue(items, media, sort),
    [items, media, sort]
  );
  const stats = useMemo(() => queueStats(items), [items]);

  const selected = useMemo(
    () => filtered.find((i) => i.id === selectedId) ?? null,
    [filtered, selectedId]
  );

  useEffect(() => {
    if (selectedId && filtered.some((i) => i.id === selectedId)) return;
    setSelectedId(filtered[0]?.id ?? null);
  }, [filtered, selectedId]);

  const syncUrl = useCallback(
    (nextMedia: VerificationMediaTab, nextId: string | null) => {
      const params = new URLSearchParams();
      if (nextMedia !== "all") params.set("media", nextMedia);
      if (nextId) params.set("id", nextId);
      const qs = params.toString();
      router.replace(qs ? `/verification?${qs}` : "/verification", {
        scroll: false,
      });
    },
    [router]
  );

  const onSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      setPanelOpen(true);
      syncUrl(media, id);
    },
    [media, syncUrl]
  );

  const onMediaChange = useCallback(
    (next: VerificationMediaTab) => {
      setMedia(next);
      const nextList = filterVerificationQueue(items, next, sort);
      const nextSelected = nextList[0]?.id ?? null;
      setSelectedId(nextSelected);
      syncUrl(next, nextSelected);
    },
    [items, sort, syncUrl]
  );

  const advanceAfterAction = useCallback(
    (currentId: string, nextItems: VerificationQueueItem[]) => {
      const nextFiltered = filterVerificationQueue(nextItems, media, sort);
      const idx = nextFiltered.findIndex((i) => i.id === currentId);
      const following =
        nextFiltered[idx + 1] ??
        nextFiltered[idx - 1] ??
        nextFiltered.find((i) => i.id !== currentId) ??
        null;
      const nextId = following?.id ?? null;
      setSelectedId(nextId);
      syncUrl(media, nextId);
      if (!nextId) setPanelOpen(false);
    },
    [media, sort, syncUrl]
  );

  const onAction = useCallback(
    (
      itemId: string,
      action: StoredReviewAction["action"],
      notes?: string
    ) => {
      const next = saveVerificationReview(itemId, action, notes);
      setItems(next);
      if (action !== "skip") {
        advanceAfterAction(itemId, next);
      } else {
        advanceAfterAction(itemId, next);
      }
    },
    [advanceAfterAction]
  );

  return (
    <div className="relative flex h-dvh min-h-[640px] flex-col gap-2.5 px-2 pb-2.5 pt-[4.75rem] sm:gap-3 sm:px-3 sm:pb-3 sm:pt-20 md:px-4 lg:gap-3.5 lg:px-4 xl:px-5">
      {/* Mobile toolbar */}
      <div className="flex shrink-0 gap-2 xl:hidden">
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/12 bg-[#121214]/90 px-3 py-2.5 text-sm text-zinc-200"
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          Menu
        </button>
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/12 bg-[#121214]/90 px-3 py-2.5 text-sm text-zinc-200"
        >
          <PanelRight className="h-4 w-4" aria-hidden="true" />
          Details
        </button>
      </div>

      <div className="flex min-h-0 flex-1 gap-3">
        <aside className="hidden w-[240px] shrink-0 overflow-hidden rounded-2xl border border-white/12 bg-[#121214]/90 xl:flex xl:flex-col 2xl:w-[260px]">
          <VerificationSidebar />
        </aside>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#121214]/90">
          <div className="shrink-0 border-b border-white/10 px-3 py-4 sm:px-4">
            <VerificationQueueHeader stats={stats} />
            <p
              id="how-it-works"
              className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-xs leading-relaxed text-zinc-500"
            >
              Pick an item, check authenticity / timestamp / location /
              integrity / context, then Approve or Reject. Your reviews update
              this queue locally for the demo.
            </p>
          </div>
          <VerificationQueueList
            items={filtered}
            allItems={items}
            media={media}
            sort={sort}
            selectedId={selectedId}
            onMediaChange={onMediaChange}
            onSortChange={setSort}
            onSelect={onSelect}
          />
        </section>

        <aside className="hidden w-[360px] shrink-0 overflow-hidden rounded-2xl border border-white/12 bg-[#121214]/90 xl:flex xl:flex-col 2xl:w-[400px]">
          <VerificationDetailPanel item={selected} onAction={onAction} />
        </aside>
      </div>

      {/* Nav drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 xl:hidden",
          navOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!navOpen}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity",
            navOpen ? "opacity-100" : "opacity-0"
          )}
          aria-label="Close menu"
          onClick={() => setNavOpen(false)}
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 top-0 w-[min(300px,88vw)] border-r border-white/12 bg-[#121214] transition-transform duration-300",
            navOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-3">
            <p className="text-sm font-semibold text-white">Navigation</p>
            <button
              type="button"
              onClick={() => setNavOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <VerificationSidebar onNavigate={() => setNavOpen(false)} />
        </div>
      </div>

      {/* Detail drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 xl:hidden",
          panelOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!panelOpen}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity",
            panelOpen ? "opacity-100" : "opacity-0"
          )}
          aria-label="Close details"
          onClick={() => setPanelOpen(false)}
        />
        <div
          className={cn(
            "absolute bottom-0 right-0 top-0 flex w-[min(420px,94vw)] flex-col border-l border-white/12 bg-[#121214] transition-transform duration-300",
            panelOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <VerificationDetailPanel
            item={selected}
            onClose={() => setPanelOpen(false)}
            onAction={onAction}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}

export function VerificationWorkspaceView() {
  return (
    <VerificationGate>
      {() => <VerificationWorkspaceInner />}
    </VerificationGate>
  );
}
