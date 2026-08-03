import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CompareEvidenceView } from "@/components/evidence-compare/compare-evidence-view";
import { EVIDENCE_SUITE_NAV } from "@/components/app-shell/evidence-suite-nav";
import {
  footerLinkColumns,
  footerSocialLinks,
  footerCopyright,
} from "@/data/footer-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Evidence – OpenWitness",
  description:
    "Compare multiple evidence clips to measure corroboration across visual, location, time, and audio signals.",
};

export default function CompareEvidencePage() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-text-primary">
      <a
        href="#compare-main"
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
      <main id="compare-main">
        <CompareEvidenceView />
      </main>
      <Footer
        linkColumns={footerLinkColumns}
        socialLinks={footerSocialLinks}
        copyright={footerCopyright}
      />
    </div>
  );
}
