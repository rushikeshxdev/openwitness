import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ReportsView } from "@/components/reports/reports-view";
import { EVIDENCE_SUITE_NAV } from "@/components/app-shell/evidence-suite-nav";
import {
  footerLinkColumns,
  footerSocialLinks,
  footerCopyright,
} from "@/data/footer-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports – OpenWitness",
  description:
    "Browse community reports and official statements linked to documented events.",
};

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-text-primary">
      <Navbar
        links={[...EVIDENCE_SUITE_NAV]}
        ctaButton={{ label: "Report Incident", href: "/report" }}
        showSearch
        showUserMenu
      />
      <main>
        <Suspense
          fallback={
            <div className="min-h-[50vh] animate-pulse bg-white/5" aria-hidden />
          }
        >
          <ReportsView />
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
