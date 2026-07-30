import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ExploreEventsView } from "@/components/explore/explore-events-view";
import {
  footerLinkColumns,
  footerSocialLinks,
  footerCopyright,
} from "@/data/footer-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Events – OpenWitness",
  description:
    "Discover, document and verify public events happening around the world.",
};

const navLinks = [
  { label: "Explore", href: "/events" },
  { label: "Map", href: "/#map" },
  { label: "Organizations", href: "/#organizations" },
  { label: "About", href: "/#about" },
] as const;

export default function ExploreEventsPage() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-text-primary">
      <a
        href="#explore-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <Navbar
        links={[...navLinks]}
        ctaButton={{
          label: "Report Incident",
          href: "mailto:report@openwitness.org?subject=Incident%20Report",
        }}
        showSearch
      />

      <main id="explore-main">
        <Suspense
          fallback={
            <div className="min-h-[60vh] animate-pulse bg-white/5" aria-hidden />
          }
        >
          <ExploreEventsView />
        </Suspense>
      </main>

      <Footer
        linkColumns={footerLinkColumns}
        socialLinks={footerSocialLinks}
        copyright={footerCopyright}
      />
    </div>
  );
}
