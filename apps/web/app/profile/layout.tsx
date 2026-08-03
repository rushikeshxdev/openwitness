import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  footerLinkColumns,
  footerSocialLinks,
  footerCopyright,
} from "@/data/footer-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile – OpenWitness",
  description: "Your OpenWitness profile, reports, contributions, and settings.",
};

const navLinks = [
  { label: "Explore", href: "/events" },
  { label: "Map", href: "/map" },
  { label: "Organizations", href: "/organizations" },
  { label: "About", href: "/#about" },
  { label: "Resources", href: "/#resources" },
] as const;

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0E11] text-text-primary">
      <Navbar
        links={[...navLinks]}
        ctaButton={{ label: "Report Incident", href: "/report" }}
        showSearch
        showUserMenu
      />
      <main>{children}</main>
      <Footer
        linkColumns={footerLinkColumns}
        socialLinks={footerSocialLinks}
        copyright={footerCopyright}
      />
    </div>
  );
}
