"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, PanelRight, X } from "lucide-react";
import {
  countByCategory,
  filterNotifications,
  unreadCount,
  type AppNotification,
  type NotificationCategoryFilter,
} from "@/data/notifications-data";
import {
  loadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notifications-store";
import { NotificationsGate } from "./notifications-gate";
import { NotificationsHeader } from "./notifications-header";
import { NotificationsCategoryNav } from "./notifications-category-nav";
import { NotificationsFeed } from "./notifications-feed";
import { NotificationsDetailPanel } from "./notifications-detail-panel";
import { cn } from "@/lib/utils";

const VALID_CATEGORIES = new Set<NotificationCategoryFilter>([
  "all",
  "mentions",
  "verification",
  "updates",
  "comments",
  "follows",
  "system",
]);

function NotificationsWorkspaceInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [category, setCategory] = useState<NotificationCategoryFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => {
    setItems(loadNotifications());
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && VALID_CATEGORIES.has(cat as NotificationCategoryFilter)) {
      setCategory(cat as NotificationCategoryFilter);
    }
    const id = searchParams.get("id");
    if (id) {
      setSelectedId(id);
      setPanelOpen(true);
    }
  }, [searchParams]);

  const counts = useMemo(() => countByCategory(items), [items]);
  const filtered = useMemo(
    () => filterNotifications(items, category),
    [items, category]
  );
  const unread = useMemo(() => unreadCount(items), [items]);

  const selected = useMemo(
    () => filtered.find((n) => n.id === selectedId) ?? null,
    [filtered, selectedId]
  );

  // Keep selection inside the active filtered list
  useEffect(() => {
    if (selectedId && filtered.some((n) => n.id === selectedId)) return;
    setSelectedId(filtered[0]?.id ?? null);
  }, [filtered, selectedId, tick]);

  const syncUrl = useCallback(
    (nextCategory: NotificationCategoryFilter, nextId: string | null) => {
      const params = new URLSearchParams();
      if (nextCategory !== "all") params.set("category", nextCategory);
      if (nextId) params.set("id", nextId);
      const qs = params.toString();
      router.replace(qs ? `/notifications?${qs}` : "/notifications", {
        scroll: false,
      });
    },
    [router]
  );

  const onSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      setPanelOpen(true);
      markNotificationRead(id);
      refresh();
      syncUrl(category, id);
    },
    [category, refresh, syncUrl]
  );

  const onCategoryChange = useCallback(
    (id: NotificationCategoryFilter) => {
      setCategory(id);
      setFiltersOpen(false);
      const nextList = filterNotifications(items, id);
      const nextSelected = nextList[0]?.id ?? null;
      setSelectedId(nextSelected);
      syncUrl(id, nextSelected);
    },
    [items, syncUrl]
  );

  const onMarkAllRead = useCallback(() => {
    markAllNotificationsRead();
    refresh();
  }, [refresh]);

  return (
    <div className="relative flex h-dvh min-h-[640px] flex-col gap-2.5 px-2 pb-2.5 pt-[4.75rem] sm:gap-3 sm:px-3 sm:pb-3 sm:pt-20 md:px-4 lg:gap-3.5 lg:px-4 xl:px-5">
      <div className="shrink-0 px-1 sm:px-0">
        <NotificationsHeader unread={unread} onMarkAllRead={onMarkAllRead} />
      </div>

      {/* Mobile / tablet toolbar */}
      <div className="flex shrink-0 gap-2 xl:hidden">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/12 bg-[#121214]/90 px-3 py-2.5 text-sm text-zinc-200"
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          Categories
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
        {/* Category sidebar — desktop */}
        <aside className="hidden w-[200px] shrink-0 overflow-y-auto rounded-2xl border border-white/12 bg-[#121214]/90 xl:block 2xl:w-[220px]">
          <NotificationsCategoryNav
            active={category}
            counts={counts}
            onChange={onCategoryChange}
          />
        </aside>

        {/* Feed */}
        <section className="min-h-0 min-w-0 flex-1 overflow-y-auto rounded-2xl border border-white/12 bg-[#121214]/90">
          <NotificationsFeed
            items={filtered}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        </section>

        {/* Detail — desktop */}
        <aside className="hidden w-[340px] shrink-0 overflow-hidden rounded-2xl border border-white/12 bg-[#121214]/90 xl:flex xl:flex-col 2xl:w-[380px]">
          <NotificationsDetailPanel item={selected} />
        </aside>
      </div>

      {/* Category drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 xl:hidden",
          filtersOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!filtersOpen}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity",
            filtersOpen ? "opacity-100" : "opacity-0"
          )}
          aria-label="Close categories"
          onClick={() => setFiltersOpen(false)}
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 top-0 w-[min(300px,88vw)] border-r border-white/12 bg-[#121214] transition-transform duration-300",
            filtersOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-3">
            <p className="text-sm font-semibold text-white">Categories</p>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <NotificationsCategoryNav
            active={category}
            counts={counts}
            onChange={onCategoryChange}
          />
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
            "absolute bottom-0 right-0 top-0 flex w-[min(400px,92vw)] flex-col border-l border-white/12 bg-[#121214] transition-transform duration-300",
            panelOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <NotificationsDetailPanel
            item={selected}
            onClose={() => setPanelOpen(false)}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}

export function NotificationsWorkspaceView() {
  return (
    <NotificationsGate>
      {() => <NotificationsWorkspaceInner />}
    </NotificationsGate>
  );
}
