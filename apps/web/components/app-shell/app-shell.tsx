"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AppSidebar } from "./app-sidebar";

export type AppShellBreadcrumb = { label: string; href?: string };

export function AppShell({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb?: AppShellBreadcrumb[];
}) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-24 sm:px-6 md:pt-28 lg:px-8">
      {breadcrumb && breadcrumb.length > 0 ? (
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-zinc-400"
        >
          {breadcrumb.map((item, i) => {
            const last = i === breadcrumb.length - 1;
            return (
              <span key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
                {i > 0 ? (
                  <ChevronRight
                    className="h-3.5 w-3.5 text-zinc-600"
                    aria-hidden="true"
                  />
                ) : null}
                {item.href && !last ? (
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={last ? "text-zinc-200" : undefined}>
                    {item.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      ) : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        <aside className="lg:col-span-3 space-y-4">
          <div className="hidden overflow-hidden rounded-2xl border border-white/12 bg-[#121214]/90 lg:block">
            <AppSidebar variant="vertical" />
          </div>
          <div className="rounded-2xl border border-white/12 bg-[#121214]/90 p-2 lg:hidden">
            <AppSidebar variant="horizontal" />
          </div>
        </aside>
        <div className="min-w-0 lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}

/** Shared top-nav links for Evidence suite pages */
export const EVIDENCE_SUITE_NAV = [
  { label: "Explore", href: "/events" },
  { label: "Map", href: "/map" },
  { label: "Evidence", href: "/evidence" },
  { label: "Reports", href: "/reports" },
  { label: "Organizations", href: "/organizations" },
  { label: "About", href: "/#about" },
] as const;
