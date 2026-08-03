"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { TrustedOrgCard } from "./trusted-org-card";
import {
  ORGANIZATION_CATEGORIES,
  filterTrustedOrganizations,
  getTrustedOrganizations,
  type OrganizationCategory,
} from "@/data/trusted-organizations-data";
import { Filter, Search, X } from "lucide-react";

export function OrganizationsView() {
  const allOrgs = useMemo(() => getTrustedOrganizations(), []);
  const [category, setCategory] = useState<OrganizationCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(
    () => filterTrustedOrganizations(allOrgs, category, query),
    [allOrgs, category, query]
  );

  const clearFilters = () => {
    setCategory("all");
    setQuery("");
  };

  const hasActiveFilters = category !== "all" || query.trim().length > 0;

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16 md:pb-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8 md:mb-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-[2.5rem] font-semibold tracking-tight text-white">
            Trusted Organizations
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Organizations working towards transparency, justice and
            accountability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className={cn(
            "inline-flex shrink-0 items-center gap-2 self-start sm:self-auto rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors",
            filtersOpen || hasActiveFilters
              ? "border-[#3B82F6]/50 bg-[#3B82F6]/15 text-white"
              : "border-white/12 bg-[#121214]/80 text-zinc-200 hover:bg-white/5 hover:text-white"
          )}
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          Filter
          {hasActiveFilters && (
            <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#3B82F6] px-1.5 text-[11px] font-semibold text-white tabular-nums">
              {(category !== "all" ? 1 : 0) + (query.trim() ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {filtersOpen && (
        <div className="mb-8 rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search organizations..."
                className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#3B82F6]/50"
              />
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {ORGANIZATION_CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "border-[#3B82F6] bg-[#3B82F6]/20 text-white"
                      : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/10"
                  )}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p className="mb-4 text-sm text-zinc-500">
        Showing{" "}
        <span className="text-zinc-300 tabular-nums">{filtered.length}</span>{" "}
        organization{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((org) => (
            <TrustedOrgCard key={org.id} organization={org} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-black/35 px-6 py-16 text-center">
          <p className="text-lg font-medium text-white">No organizations found</p>
          <p className="mt-2 text-sm text-zinc-400">
            Try a different category or clear your search.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 text-sm font-medium text-[#60A5FA] hover:text-white"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
