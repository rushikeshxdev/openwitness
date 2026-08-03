import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { OrganizationProfileView } from "@/components/organizations/organization-profile-view";
import {
  getAllOrganizationDetailIds,
  getOrganizationDetail,
} from "@/data/organization-detail-data";
import {
  footerLinkColumns,
  footerSocialLinks,
  footerCopyright,
} from "@/data/footer-data";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllOrganizationDetailIds().map((id) => ({ id }));
}

const navLinks = [
  { label: "Explore", href: "/events" },
  { label: "Map", href: "/map" },
  { label: "Organizations", href: "/organizations" },
  { label: "About", href: "/#about" },
] as const;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const detail = getOrganizationDetail(id);
  if (!detail) return { title: "Organization not found – OpenWitness" };
  return {
    title: `${detail.fullName} – OpenWitness`,
    description: detail.bio,
  };
}

export default async function OrganizationDetailPage({ params }: Props) {
  const { id } = await params;
  const detail = getOrganizationDetail(id);
  if (!detail) notFound();

  return (
    <div className="min-h-screen bg-[#0B0E11] text-text-primary">
      <a
        href="#organization-main"
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

      <main id="organization-main">
        <OrganizationProfileView detail={detail} />
      </main>

      <Footer
        linkColumns={footerLinkColumns}
        socialLinks={footerSocialLinks}
        copyright={footerCopyright}
      />
    </div>
  );
}
