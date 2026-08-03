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
import { trustedOrganizationsData } from "@/data/trusted-organizations-data";
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
  { label: "Explore", href: "/events" },
  { label: "Map", href: "/map" },
  { label: "Organizations", href: "/organizations" },
  { label: "Verification", href: "/verification" },
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
          href: "/report",
        }}
        showSearch
        showUserMenu
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

        {/* 2. Stats + Live Map — 4 equal cards + wide map (mockup row) */}
        <section
          className="relative z-20 -mt-24 md:-mt-28 pb-8 md:pb-12"
          aria-label="Platform statistics"
        >
          <Container size="xl">
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3.5 sm:gap-4 items-stretch">
              <Stats stats={statsData} layout="contents" />
              <div className="col-span-2 md:col-span-4 xl:col-span-2 min-h-[180px]">
                <LiveMapCard href="#map" />
              </div>
            </div>
          </Container>
        </section>

        {/* 3. Active Events (≈2/3) + Recent Timeline (≈1/3) */}
        <section
          className="py-10 md:py-14"
          aria-label="Active events and recent activity"
        >
          <Container size="xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-7 xl:gap-10">
              <div className="lg:col-span-2 min-w-0">
                <ActiveEvents
                  events={activeEventsData}
                  embedded
                  subtitle="Real-time updates from public events around the world"
                />
              </div>

              <div className="lg:col-span-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-6 md:mb-7">
                  <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
                    Recent Timeline
                  </h2>
                  <a
                    href="#timeline"
                    className="inline-flex items-center gap-1.5 text-base font-medium text-[#60A5FA] hover:text-white transition-colors whitespace-nowrap mt-1"
                  >
                    View all
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
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
            organizations={trustedOrganizationsData}
            title="Trusted by organizations and communities"
            subtitle=""
            viewAllHref="/organizations"
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
