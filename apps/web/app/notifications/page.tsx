import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { NotificationsWorkspaceView } from "@/components/notifications/notifications-workspace-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications – OpenWitness",
  description:
    "Stay updated with verifications, mentions, comments, and activity that matters to you.",
};

const navLinks = [
  { label: "Explore", href: "/events" },
  { label: "Map", href: "/map" },
  { label: "Organizations", href: "/organizations" },
  { label: "About", href: "/#about" },
  { label: "Resources", href: "/#resources" },
] as const;

export default function NotificationsPage() {
  return (
    <div className="h-dvh overflow-hidden bg-[#0B0E11] text-text-primary">
      <a
        href="#notifications-workspace"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to notifications
      </a>

      <Navbar
        links={[...navLinks]}
        ctaButton={{
          label: "Report Incident",
          href: "/report",
        }}
        showSearch
        showUserMenu
      />

      <main id="notifications-workspace" className="h-full">
        <Suspense
          fallback={
            <div className="flex h-dvh items-center justify-center pt-20">
              <div className="h-40 w-full max-w-3xl animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] mx-4" />
            </div>
          }
        >
          <NotificationsWorkspaceView />
        </Suspense>
      </main>
    </div>
  );
}
