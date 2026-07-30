import dynamic from "next/dynamic";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { heroData } from "@/data/hero-data";
import { statsData } from "@/data/stats-data";
import { activeEventsData } from "@/data/events-data";
import { mapEventsData } from "@/data/map-data";
import { Container } from "@/components/container";
import { Timeline } from "@/components/timeline";
import { recentTimelineData } from "@/data/timeline-data";
import { Organizations } from "@/components/organizations";
import { organizationsData } from "@/data/organizations-data";
import { Footer } from "@/components/footer";
import {
  footerLinkColumns,
  footerSocialLinks,
  footerCopyright,
} from "@/data/footer-data";
import { ArrowRight } from "lucide-react";
import { Stats } from "@/components/stats";
import { LiveMapCard } from "@/components/live-map-card";

const ActiveEvents = dynamic(
  () =>
    import("@/components/active-events").then((mod) => ({
      default: mod.ActiveEvents,
    })),
  {
    loading: () => (
      <div
        className="min-h-[320px] rounded-xl bg-white/5 animate-pulse"
        aria-hidden="true"
      />
    ),
  }
);

const MapSection = dynamic(
  () =>
    import("@/components/map-section").then((mod) => ({
      default: mod.MapSection,
    })),
  {
    loading: () => (
      <div
        className="min-h-[40vh] rounded-2xl bg-white/5 animate-pulse mx-6"
        aria-hidden="true"
      />
    ),
  }
);

const navLinks = [
  { label: "Explore", href: "#events" },
  { label: "Map", href: "#map" },
  { label: "Organizations", href: "#organizations" },
  { label: "About", href: "#about" },
] as const;

/**
 * Landing composition mirrors the design mockup top-to-bottom:
 * Nav → Hero → Stats+Live Map → Active Events | Timeline → Trusted by → Map → Footer
 */
export default function HomePage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <Navbar
        links={[...navLinks]}
        ctaButton={{
          label: "Report Incident",
          href: "mailto:report@openwitness.org?subject=Incident%20Report",
        }}
        showSearch
      />

      <main
        id="main-content"
        className="min-h-screen bg-[#0B0E11] text-text-primary"
      >
        {/* 1. Hero — full-bleed protest photo + left copy */}
        <Hero
          backgroundImage={heroData.backgroundImage}
          tags={heroData.tags}
          tagline={heroData.tagline}
          missionStatement={heroData.missionStatement}
          description={heroData.description}
          primaryCTA={heroData.primaryCTA}
          secondaryCTA={heroData.secondaryCTA}
          alignment="left"
        />

        {/* 2. Stats row overlapping hero bottom */}
        <section
          className="relative z-20 -mt-28 md:-mt-32 pb-6 md:pb-10"
          aria-label="Platform statistics"
        >
          <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
              <Stats stats={statsData} layout="contents" className="contents" />
              <div className="col-span-2 lg:col-span-4 xl:col-span-2 min-h-[168px]">
                <LiveMapCard href="#map" className="block h-full" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Active Events (≈2/3) + Recent Timeline (≈1/3) */}
        <section
          className="py-10 md:py-16"
          aria-label="Active events and recent activity"
        >
          <Container size="xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 xl:gap-12">
              <div className="lg:col-span-2 min-w-0">
                <ActiveEvents
                  events={activeEventsData}
                  embedded
                  subtitle="Real-time updates from public events around the world"
                />
              </div>

              <div className="lg:col-span-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
                      Recent Timeline
                    </h2>
                  </div>
                  <a
                    href="#timeline"
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue-primary hover:text-brand-cyan-accent transition-colors whitespace-nowrap mt-1.5"
                  >
                    View all
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
                <div id="timeline">
                  <Timeline entries={recentTimelineData} />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 4. Trusted by — mockup closing strip */}
        <div id="organizations">
          <Organizations
            organizations={organizationsData}
            title="Trusted by organizations and communities"
            subtitle=""
            className="py-16 md:py-20"
          />
        </div>

        {/* Map destination for Live Map / nav */}
        <MapSection events={mapEventsData} />

        <div id="about">
          <Footer
            linkColumns={footerLinkColumns}
            socialLinks={footerSocialLinks}
            copyright={footerCopyright}
          />
        </div>
      </main>
    </>
  );
}
