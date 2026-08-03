import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AddEvidenceWizard } from "@/components/evidence-explorer/add-evidence-wizard";
import { EVIDENCE_SUITE_NAV } from "@/components/app-shell/evidence-suite-nav";
import {
  footerLinkColumns,
  footerSocialLinks,
  footerCopyright,
} from "@/data/footer-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Evidence – OpenWitness",
  description: "Upload and submit evidence for community verification.",
};

export default function AddEvidencePage() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-text-primary">
      <Navbar
        links={[...EVIDENCE_SUITE_NAV]}
        ctaButton={{ label: "Report Incident", href: "/report" }}
        showSearch
        showUserMenu
      />
      <main>
        <AddEvidenceWizard />
      </main>
      <Footer
        linkColumns={footerLinkColumns}
        socialLinks={footerSocialLinks}
        copyright={footerCopyright}
      />
    </div>
  );
}
