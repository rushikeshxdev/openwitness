import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EvidenceExplorerView } from "@/components/evidence-explorer/evidence-explorer-view";
import { EVIDENCE_SUITE_NAV } from "@/components/app-shell/evidence-suite-nav";
import {
  footerLinkColumns,
  footerSocialLinks,
  footerCopyright,
} from "@/data/footer-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evidence Explorer – OpenWitness",
  description:
    "Browse, filter, and verify community evidence from public events worldwide.",
};

export default function EvidenceExplorerPage() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-text-primary">
      <a
        href="#evidence-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Navbar
        links={[...EVIDENCE_SUITE_NAV]}
        ctaButton={{ label: "Report Incident", href: "/report" }}
        showSearch
        showUserMenu
      />
      <main id="evidence-main">
        <EvidenceExplorerView />
      </main>
      <Footer
        linkColumns={footerLinkColumns}
        socialLinks={footerSocialLinks}
        copyright={footerCopyright}
      />
    </div>
  );
}
