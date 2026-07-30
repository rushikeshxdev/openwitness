import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ReportIncidentWizard } from "@/components/report/report-incident-wizard";
import {
  footerLinkColumns,
  footerSocialLinks,
  footerCopyright,
} from "@/data/footer-data";

export const metadata: Metadata = {
  title: "Report Incident – OpenWitness",
  description:
    "Document and submit evidence from a public event to the OpenWitness community.",
};

const navLinks = [
  { label: "Explore", href: "/events" },
  { label: "Map", href: "/map" },
  { label: "Organizations", href: "/#organizations" },
  { label: "About", href: "/#about" },
] as const;

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-text-primary">
      <Navbar
        links={[...navLinks]}
        ctaButton={{
          label: "Report Incident",
          href: "/report",
        }}
        showSearch
      />
      <main>
        <ReportIncidentWizard />
      </main>
      <Footer
        linkColumns={footerLinkColumns}
        socialLinks={footerSocialLinks}
        copyright={footerCopyright}
      />
    </div>
  );
}
