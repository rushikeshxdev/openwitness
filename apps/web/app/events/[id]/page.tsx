import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EventDetailView } from "@/components/event-detail/event-detail-view";
import {
  buildEventDetail,
  getAllEventDetailIds,
} from "@/data/event-detail-data";
import {
  footerLinkColumns,
  footerSocialLinks,
  footerCopyright,
} from "@/data/footer-data";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllEventDetailIds().map((id) => ({ id }));
}

const navLinks = [
  { label: "Explore", href: "/events" },
  { label: "Map", href: "/#map" },
  { label: "Organizations", href: "/#organizations" },
  { label: "About", href: "/#about" },
] as const;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const detail = buildEventDetail(id);
  if (!detail) return { title: "Event not found – OpenWitness" };
  return {
    title: `${detail.title} – OpenWitness`,
    description: detail.description,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const detail = buildEventDetail(id);
  if (!detail) notFound();

  return (
    <div className="min-h-screen bg-[#0B0E11] text-text-primary">
      <Navbar
        links={[...navLinks]}
        ctaButton={{
          label: "Report Incident",
          href: "mailto:report@openwitness.org?subject=Incident%20Report",
        }}
        showSearch
      />

      <main>
        <EventDetailView detail={detail} />
      </main>

      <Footer
        linkColumns={footerLinkColumns}
        socialLinks={footerSocialLinks}
        copyright={footerCopyright}
      />
    </div>
  );
}
