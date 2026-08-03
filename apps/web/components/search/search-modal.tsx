"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SEARCH_TYPE_OPTIONS,
  TRENDING_SEARCHES,
  QUICK_ACTIONS,
  clearRecentSearches,
  countGroupedResults,
  flattenGroupedResults,
  getTopPreviewResults,
  loadRecentSearches,
  saveRecentSearch,
  searchCatalog,
  type RecentSearchItem,
  type SearchResultItem,
  type SearchType,
} from "@/data/search-data";
import {
  ArrowUpRight,
  BadgeCheck,
  Clock,
  FileText,
  FolderOpen,
  Map as MapIcon,
  Search,
  TrendingUp,
  Upload,
  X,
} from "lucide-react";

export interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}

function badgeClass(tone?: SearchResultItem["badgeTone"]) {
  if (tone === "live") return "bg-emerald-500/20 text-emerald-400";
  if (tone === "trending") return "bg-orange-500/20 text-orange-400";
  if (tone === "verified") return "bg-emerald-500/20 text-emerald-400";
  if (tone === "pending") return "bg-amber-500/20 text-amber-300";
  return "bg-white/10 text-zinc-300";
}

function ResultRow({
  item,
  active,
  onSelect,
  onHover,
}: {
  item: SearchResultItem;
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onHover}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
        active
          ? "border-[#3B82F6]/40 bg-[#3B82F6]/15"
          : "border-transparent hover:bg-white/[0.04]"
      )}
    >
      {item.thumbnailUrl ? (
        <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40">
          <Image
            src={item.thumbnailUrl}
            alt=""
            fill
            className="object-cover"
            sizes="64px"
          />
        </span>
      ) : item.initials ? (
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: item.accent ?? "#3B82F6" }}
        >
          {item.initials}
        </span>
      ) : (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-zinc-400">
          <Search className="h-4 w-4" aria-hidden="true" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-white line-clamp-1">
            {item.title}
          </span>
          {item.badge ? (
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                badgeClass(item.badgeTone)
              )}
            >
              {item.badgeTone === "verified" ? (
                <span className="inline-flex items-center gap-0.5">
                  <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                  {item.badge}
                </span>
              ) : (
                item.badge
              )}
            </span>
          ) : null}
        </span>
        {item.meta || item.subtitle ? (
          <span className="mt-0.5 block text-xs text-zinc-500 line-clamp-1">
            {[item.subtitle, item.meta].filter(Boolean).join(" · ")}
          </span>
        ) : null}
        {item.tags && item.tags.length > 0 ? (
          <span className="mt-1.5 flex flex-wrap gap-1">
            {item.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-400"
              >
                {t}
              </span>
            ))}
          </span>
        ) : null}
        {item.stats ? (
          <span className="mt-1 block text-[11px] text-zinc-500">
            {item.stats}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function SectionHeader({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </h3>
      {href ? (
        <a
          href={href}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#60A5FA] hover:text-white"
        >
          {linkLabel ?? "View all"}
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}

export function SearchModal({
  open,
  onClose,
  initialQuery = "",
}: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<SearchType>("all");
  const [recent, setRecent] = useState<RecentSearchItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const previews = useMemo(() => getTopPreviewResults(), []);
  const grouped = useMemo(() => searchCatalog(query, type), [query, type]);
  const flat = useMemo(() => flattenGroupedResults(grouped), [grouped]);
  const total = countGroupedResults(grouped);
  const idle = !query.trim();

  useEffect(() => {
    if (!open) return;
    setQuery(initialQuery);
    setType("all");
    setActiveIndex(0);
    setRecent(loadRecentSearches());
    const t = window.setTimeout(() => inputRef.current?.focus(), 20);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open, initialQuery]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, type]);

  const navigateTo = useCallback(
    (href: string, recentItem?: RecentSearchItem) => {
      if (recentItem) setRecent(saveRecentSearch(recentItem));
      else if (query.trim()) {
        setRecent(
          saveRecentSearch({
            query: query.trim(),
            typeLabel: type === "all" ? "Search" : type,
          })
        );
      }
      onClose();
      router.push(href);
    },
    [onClose, query, router, type]
  );

  const runQuickAction = useCallback(
    (href: string, label: string) => {
      navigateTo(href, { query: label, typeLabel: "Action", href });
    },
    [navigateTo]
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (idle) {
        const key = e.key.toUpperCase();
        const action = QUICK_ACTIONS.find((a) => a.shortcut === key);
        if (action && !e.metaKey && !e.ctrlKey && !e.altKey && e.key.length === 1) {
          e.preventDefault();
          runQuickAction(action.href, action.label);
          return;
        }
      }

      if (!idle && flat.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActiveIndex((i) => (i + 1) % flat.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
        } else if (e.key === "Enter") {
          e.preventDefault();
          const item = flat[activeIndex];
          if (item) {
            navigateTo(item.href, {
              query: item.title,
              typeLabel: item.kind,
              href: item.href,
            });
          }
        }
      } else if (idle && e.key === "Enter" && query.trim()) {
        e.preventDefault();
        navigateTo(`/events?q=${encodeURIComponent(query.trim())}`);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    open,
    onClose,
    idle,
    flat,
    activeIndex,
    navigateTo,
    runQuickAction,
    query,
  ]);

  if (!open) return null;

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-3 pt-[8vh] sm:px-4 sm:pt-[10vh]">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        aria-label="Close search"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        aria-labelledby={titleId}
        className={cn(
          "relative z-10 flex w-full max-w-5xl flex-col overflow-hidden",
          "max-h-[min(780px,82vh)] rounded-2xl border border-white/12",
          "bg-[#121214] shadow-2xl shadow-black/50"
        )}
      >
        <h2 id={titleId} className="sr-only">
          Search OpenWitness
        </h2>

        {/* Search header */}
        <div className="border-b border-white/10 px-3 pt-3 sm:px-4 sm:pt-4">
          <div className="flex items-center gap-2">
            <div className="relative flex min-h-11 flex-1 items-center rounded-xl border border-white/12 bg-black/40">
              <Search
                className="absolute left-3 h-4 w-4 text-zinc-500"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events, evidence, organizations, people..."
                className="w-full bg-transparent py-2.5 pl-10 pr-16 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                aria-label="Search"
              />
              <kbd className="absolute right-2 hidden sm:inline-flex items-center rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                {isMac ? "⌘" : "Ctrl"} K
              </kbd>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 p-2.5 text-zinc-400 hover:bg-white/5 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {SEARCH_TYPE_OPTIONS.map((opt) => {
              const active = type === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setType(opt.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "border-[#3B82F6] bg-[#3B82F6] text-white"
                      : "border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {idle ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-0">
              <aside className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/10 p-3 sm:p-4 space-y-5">
                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Recent Searches
                    </h3>
                    {recent.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          clearRecentSearches();
                          setRecent([]);
                        }}
                        className="text-xs text-zinc-500 hover:text-white"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                  <ul className="space-y-0.5">
                    {recent.length === 0 ? (
                      <li className="px-2 py-2 text-xs text-zinc-600">
                        No recent searches
                      </li>
                    ) : (
                      recent.map((r) => (
                        <li key={`${r.query}-${r.typeLabel}`}>
                          <button
                            type="button"
                            onClick={() => {
                              if (r.href) navigateTo(r.href, r);
                              else {
                                setQuery(r.query);
                                inputRef.current?.focus();
                              }
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-white/[0.04]"
                          >
                            <Clock
                              className="h-3.5 w-3.5 shrink-0 text-zinc-500"
                              aria-hidden="true"
                            />
                            <span className="min-w-0 flex-1 truncate text-sm text-zinc-200">
                              {r.query}
                            </span>
                            <span className="shrink-0 rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-500">
                              {r.typeLabel}
                            </span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </section>

                <section>
                  <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    Trending Searches
                  </h3>
                  <ul className="space-y-0.5">
                    {TRENDING_SEARCHES.map((t) => (
                      <li key={t.query}>
                        <button
                          type="button"
                          onClick={() => {
                            setQuery(t.query);
                            inputRef.current?.focus();
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-white/[0.04]"
                        >
                          <TrendingUp
                            className="h-3.5 w-3.5 shrink-0 text-orange-400"
                            aria-hidden="true"
                          />
                          <span className="text-sm text-zinc-200">
                            {t.query}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    Quick Actions
                  </h3>
                  <ul className="space-y-0.5">
                    {QUICK_ACTIONS.map((a) => {
                      const Icon =
                        a.id === "report"
                          ? FileText
                          : a.id === "upload"
                            ? Upload
                            : a.id === "map"
                              ? MapIcon
                              : FolderOpen;
                      return (
                        <li key={a.id}>
                          <button
                            type="button"
                            onClick={() => runQuickAction(a.href, a.label)}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-white/[0.04]"
                          >
                            <Icon
                              className="h-3.5 w-3.5 shrink-0 text-[#60A5FA]"
                              aria-hidden="true"
                            />
                            <span className="flex-1 text-sm text-zinc-200">
                              {a.label}
                            </span>
                            <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-500">
                              {a.shortcut}
                            </kbd>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                <p className="pt-1 text-[11px] text-zinc-600">
                  Tip: Use ↑↓ to navigate, ↵ to select, esc to close
                </p>
              </aside>

              <div className="lg:col-span-8 p-3 sm:p-4 space-y-6">
                <section>
                  <SectionHeader
                    title="Top Events"
                    href="/events"
                    linkLabel="View all events"
                  />
                  <div className="space-y-1">
                    {previews.events.map((item) => (
                      <ResultRow
                        key={item.id}
                        item={item}
                        active={false}
                        onHover={() => undefined}
                        onSelect={() =>
                          navigateTo(item.href, {
                            query: item.title,
                            typeLabel: "Event",
                            href: item.href,
                          })
                        }
                      />
                    ))}
                  </div>
                </section>

                <section>
                  <SectionHeader
                    title="Top Evidence"
                    href="/evidence"
                    linkLabel="View all evidence"
                  />
                  <div className="space-y-1">
                    {previews.evidence.map((item) => (
                      <ResultRow
                        key={item.id}
                        item={item}
                        active={false}
                        onHover={() => undefined}
                        onSelect={() =>
                          navigateTo(item.href, {
                            query: item.title,
                            typeLabel: "Evidence",
                            href: item.href,
                          })
                        }
                      />
                    ))}
                  </div>
                </section>

                <section>
                  <SectionHeader
                    title="Top Organizations"
                    href="/organizations"
                    linkLabel="View all organizations"
                  />
                  <div className="flex flex-wrap gap-4 pt-1">
                    {previews.organizations.map((org) => (
                      <button
                        key={org.id}
                        type="button"
                        onClick={() =>
                          navigateTo(org.href, {
                            query: org.title,
                            typeLabel: "Organization",
                            href: org.href,
                          })
                        }
                        className="flex w-[88px] flex-col items-center gap-2 text-center hover:opacity-90"
                      >
                        <span
                          className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ backgroundColor: org.accent }}
                        >
                          {org.initials}
                        </span>
                        <span className="text-xs text-zinc-300 line-clamp-2">
                          {org.title}
                        </span>
                        {org.badge ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400">
                            <BadgeCheck className="h-3 w-3" />
                            Verified
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="p-3 sm:p-4 space-y-5">
              {total === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-base font-medium text-white">
                    No results for “{query.trim()}”
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Try another keyword or switch type filters.
                  </p>
                </div>
              ) : (
                <>
                  {(
                    [
                      ["events", "Events", grouped.events, "/events"],
                      ["evidence", "Evidence", grouped.evidence, "/evidence"],
                      [
                        "organizations",
                        "Organizations",
                        grouped.organizations,
                        "/organizations",
                      ],
                      ["people", "People", grouped.people, "/profile"],
                      ["reports", "Reports", grouped.reports, "/reports"],
                      ["tags", "Tags", grouped.tags, "/events"],
                    ] as const
                  ).map(([key, label, items, href]) => {
                    if (items.length === 0) return null;
                    let offset = 0;
                    if (key === "evidence") offset = grouped.events.length;
                    else if (key === "organizations")
                      offset = grouped.events.length + grouped.evidence.length;
                    else if (key === "people")
                      offset =
                        grouped.events.length +
                        grouped.evidence.length +
                        grouped.organizations.length;
                    else if (key === "reports")
                      offset =
                        grouped.events.length +
                        grouped.evidence.length +
                        grouped.organizations.length +
                        grouped.people.length;
                    else if (key === "tags")
                      offset =
                        grouped.events.length +
                        grouped.evidence.length +
                        grouped.organizations.length +
                        grouped.people.length +
                        grouped.reports.length;

                    return (
                      <section key={key}>
                        <SectionHeader title={label} href={href} />
                        <div className="space-y-1">
                          {items.map((item, i) => {
                            const idx = offset + i;
                            return (
                              <ResultRow
                                key={item.id}
                                item={item}
                                active={idx === activeIndex}
                                onHover={() => setActiveIndex(idx)}
                                onSelect={() =>
                                  navigateTo(item.href, {
                                    query: item.title,
                                    typeLabel: label.slice(0, -1),
                                    href: item.href,
                                  })
                                }
                              />
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
