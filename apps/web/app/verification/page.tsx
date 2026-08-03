import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { VerificationWorkspaceView } from "@/components/verification/verification-workspace-view";
import { EVIDENCE_SUITE_NAV } from "@/components/app-shell/evidence-suite-nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Verification – OpenWitness",
  description:
    "Review submitted evidence with the community — authenticity, location, integrity, and context checks.",
};

const navLinks = [...EVIDENCE_SUITE_NAV] as const;

export default function VerificationPage() {
  return (
    <div className="h-dvh overflow-hidden bg-[#0B0E11] text-text-primary">
      <a
        href="#verification-workspace"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to verification
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

      <main id="verification-workspace" className="h-full">
        <Suspense
          fallback={
            <div className="flex h-dvh items-center justify-center pt-20">
              <div className="mx-4 h-40 w-full max-w-3xl animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
            </div>
          }
        >
          <VerificationWorkspaceView />
        </Suspense>
      </main>
    </div>
  );
}
