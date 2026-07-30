import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { GlassCard } from "@/components/glass-card";
import { getEventById, exploreEventsData } from "@/data/explore-events-data";
import {
  footerLinkColumns,
  footerSocialLinks,
  footerCopyright,
} from "@/data/footer-data";
import { ArrowLeft, MapPin, FileText, BadgeCheck, Users } from "lucide-react";
import type { Metadata } from "next";

export function generateStaticParams() {
  return exploreEventsData.map((e) => ({ id: e.id }));
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
  const event = getEventById(id);
  if (!event) return { title: "Event not found – OpenWitness" };
  return {
    title: `${event.title} – OpenWitness`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = getEventById(id);
  if (!event) notFound();

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Explore
        </Link>

        <GlassCard className="overflow-hidden bg-black/45 border-white/[0.12]">
          <div className="relative aspect-[21/9] min-h-[200px]">
            <Image
              src={event.thumbnailUrl}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-transparent to-transparent" />
          </div>

          <div className="p-5 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {event.title}
            </h1>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-zinc-400">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              {event.location.city}, {event.location.country}
            </p>

            {event.description && (
              <p className="mt-5 text-base text-zinc-300 leading-relaxed">
                {event.description}
              </p>
            )}

            {(event.tags?.length ?? 0) > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {event.tags!.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-zinc-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                {
                  icon: FileText,
                  label: "Evidence",
                  value: event.evidenceCount,
                },
                {
                  icon: BadgeCheck,
                  label: "Verified",
                  value: event.verifiedCount ?? 0,
                },
                {
                  icon: Users,
                  label: "Contributors",
                  value: event.contributorCount ?? 0,
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center"
                >
                  <Icon
                    className="w-4 h-4 mx-auto text-zinc-500 mb-1"
                    aria-hidden="true"
                  />
                  <div className="text-lg font-bold text-white tabular-nums">
                    {value.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-zinc-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </main>

      <Footer
        linkColumns={footerLinkColumns}
        socialLinks={footerSocialLinks}
        copyright={footerCopyright}
      />
    </div>
  );
}
