import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { OrganizationsView } from "@/components/organizations/organizations-view";
import {
  footerLinkColumns,
  footerSocialLinks,
  footerCopyright,
} from "@/data/footer-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trusted Organizations – OpenWitness",
  description:
    "Organizations working towards transparency, justice and accountability.",
};

const navLinks = [
  { label: "Explore", href: "/events" },
  { label: "Map", href: "/map" },
  { label: "Organizations", href: "/organizations" },
  { label: "About", href: "/#about" },
] as const;

export default function OrganizationsPage() {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-text-primary">
      <a
        href="#organizations-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
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

      <main id="organizations-main">
        <OrganizationsView />
      </main>

      <Footer
        linkColumns={footerLinkColumns}
        socialLinks={footerSocialLinks}
        copyright={footerCopyright}
      />
    </div>
  );
}
