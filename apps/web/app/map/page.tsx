import { Navbar } from "@/components/navbar";
import { MapWorkspaceView } from "@/components/map-workspace/map-workspace-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Map – OpenWitness",
  description:
    "Explore real-time global incidents on an interactive map with filters, clusters, and evidence details.",
};

const navLinks = [
  { label: "Explore", href: "/events" },
  { label: "Map", href: "/map" },
  { label: "Organizations", href: "/#organizations" },
  { label: "About", href: "/#about" },
] as const;

export default function MapPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#0B0E11] text-text-primary">
      <a
        href="#map-workspace"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to map
      </a>

      <Navbar
        links={[...navLinks]}
        ctaButton={{
          label: "Report Incident",
          href: "mailto:report@openwitness.org?subject=Incident%20Report",
        }}
        showSearch
      />

      <main id="map-workspace">
        <MapWorkspaceView />
      </main>
    </div>
  );
}
