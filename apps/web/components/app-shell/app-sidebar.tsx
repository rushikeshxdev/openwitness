"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  Clock,
  FileText,
  FolderOpen,
  HelpCircle,
  LayoutDashboard,
  Map as MapIcon,
  Settings,
  Building2,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS: Array<{
  id: string;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  disabled?: boolean;
}> = [
  { id: "overview", label: "Overview", href: "/", icon: LayoutDashboard },
  { id: "events", label: "Events", href: "/events", icon: CalendarDays },
  { id: "map", label: "Map", href: "/map", icon: MapIcon },
  { id: "evidence", label: "Evidence", href: "/evidence", icon: FolderOpen },
  { id: "reports", label: "Reports", href: "/reports", icon: FileText },
  {
    id: "organizations",
    label: "Organizations",
    href: "/organizations",
    icon: Building2,
  },
  {
    id: "verification",
    label: "Verification",
    href: "/verification",
    icon: ShieldCheck,
  },
  { id: "timeline", label: "Timeline", href: "/events", icon: Clock },
  {
    id: "bookmarks",
    label: "Bookmarks",
    href: "/profile/bookmarks",
    icon: Bookmark,
  },
  {
    id: "support",
    label: "Support",
    href: "#",
    icon: HelpCircle,
    disabled: true,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/profile/settings",
    icon: Settings,
  },
];

function isActive(pathname: string, href: string, id: string): boolean {
  if (id === "evidence") {
    return pathname === "/evidence" || pathname.startsWith("/evidence/");
  }
  if (id === "reports") {
    return pathname === "/reports" || pathname.startsWith("/reports/");
  }
  if (id === "verification") {
    return (
      pathname === "/verification" || pathname.startsWith("/verification/")
    );
  }
  if (id === "overview") return pathname === "/";
  if (id === "timeline") return false; // shared /events href; don't steal Events active
  if (href === "/events") return pathname === "/events" || pathname.startsWith("/events/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar({
  variant = "vertical",
}: {
  variant?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="App sections"
      className={cn(
        variant === "horizontal"
          ? "flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
          : "flex flex-col gap-0.5 p-2"
      )}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = !item.disabled && isActive(pathname, item.href, item.id);
        const className = cn(
          "inline-flex min-h-10 items-center gap-2.5 rounded-xl text-sm font-medium transition-colors",
          variant === "horizontal"
            ? "shrink-0 border px-3 py-2"
            : "w-full border px-3 py-2.5",
          item.disabled
            ? "cursor-not-allowed border-transparent text-zinc-600"
            : active
              ? "border-[#3B82F6]/40 bg-[#2563EB]/20 text-white"
              : "border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
        );

        if (item.disabled) {
          return (
            <span
              key={item.id}
              className={className}
              title="Coming soon"
              aria-disabled="true"
            >
              <Icon className="h-4 w-4 shrink-0 text-zinc-600" aria-hidden="true" />
              <span className="flex-1 whitespace-nowrap">{item.label}</span>
              <span className="text-[10px] uppercase tracking-wide text-zinc-600">
                Soon
              </span>
            </span>
          );
        }

        return (
          <Link key={item.id} href={item.href} className={className}>
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                active ? "text-[#60A5FA]" : "text-zinc-500"
              )}
              aria-hidden="true"
            />
            <span className="flex-1 whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
