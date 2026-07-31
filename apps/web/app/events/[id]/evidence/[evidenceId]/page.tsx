import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EvidenceDetailView } from "@/components/evidence-detail/evidence-detail-view";
import {
  buildEvidenceDetail,
  getEvidenceStaticParams,
} from "@/data/evidence-detail-data";
import {
  footerLinkColumns,
  footerSocialLinks,
  footerCopyright,
} from "@/data/footer-data";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getEvidenceStaticParams();
}

const navLinks = [
  { label: "Explore", href: "/events" },
  { label: "Map", href: "/map" },
  { label: "Organizations", href: "/#organizations" },
  { label: "About", href: "/#about" },
  { label: "Resources", href: "/#resources" },
] as const;

type Props = {
  params: Promise<{ id: string; evidenceId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, evidenceId } = await params;
  const detail = buildEvidenceDetail(id, evidenceId);
  if (!detail) return { title: "Evidence not found – OpenWitness" };
  return {
    title: `${detail.title} – Evidence – OpenWitness`,
    description: detail.description,
  };
}

export default async function EvidenceDetailPage({ params }: Props) {
  const { id, evidenceId } = await params;
  const detail = buildEvidenceDetail(id, evidenceId);
  if (!detail) notFound();

  return (
    <div className="min-h-screen bg-[#0B0E11] text-text-primary">
      <Navbar
        links={[...navLinks]}
        ctaButton={{
          label: "Report Incident",
          href: "/report",
        }}
        showSearch
        showUserMenu
      />

      <main>
        <EvidenceDetailView
          key={`${detail.eventId}-${detail.id}`}
          detail={detail}
        />
      </main>

      <Footer
        linkColumns={footerLinkColumns}
        socialLinks={footerSocialLinks}
        copyright={footerCopyright}
      />
    </div>
  );
}
