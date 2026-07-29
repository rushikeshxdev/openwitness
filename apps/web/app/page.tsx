import dynamic from "next/dynamic";
import { Hero } from "@/components/hero";
import { heroData } from "@/data/hero-data";
import { statsData } from "@/data/stats-data";
import { activeEventsData } from "@/data/events-data";
import { mapEventsData } from "@/data/map-data";
import { Container } from "@/components/container";
import { SectionTitle } from "@/components/section-title";
import { Timeline } from "@/components/timeline";
import { timelineData } from "@/data/timeline-data";
import { Organizations } from "@/components/organizations";
import { organizationsData } from "@/data/organizations-data";
import { Footer } from "@/components/footer";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Stats } from "@/components/stats";
import { LiveMapCard } from "@/components/live-map-card";

// Dynamic imports for below-the-fold components
const ActiveEvents = dynamic(() => import("@/components/active-events").then(mod => ({ default: mod.ActiveEvents })), {
  loading: () => <div className="min-h-[400px]" />,
});

const MapSection = dynamic(() => import("@/components/map-section").then(mod => ({ default: mod.MapSection })), {
  loading: () => <div className="min-h-screen" />,
});

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background-primary text-text-primary">
      {/* Hero Section - Full width without stats */}
      <Hero 
        backgroundImage={heroData.backgroundImage}
        tagline={heroData.tagline}
        missionStatement={heroData.missionStatement}
        description={heroData.description}
        stats={[]} // Stats will be shown in separate section below
        primaryCTA={heroData.primaryCTA}
        secondaryCTA={heroData.secondaryCTA}
      />

      {/* Stats Grid + Live Map Section - Positioned below hero as separate cards */}
      <section className="py-12 -mt-24 relative z-20">
        <Container size="xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {/* Individual Stats Cards */}
            {statsData.map((stat, index) => (
              <div key={index} className="h-full">
                <Stats stats={[stat]} />
              </div>
            ))}
            
            {/* Live Map Card - 5th item */}
            <div className="h-full">
              <LiveMapCard href="#map" />
            </div>
          </div>
        </Container>
      </section>

      {/* Active Events + Timeline - Side by side layout */}
      <section className="py-16 md:py-24">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Active Events - 2/3 width */}
            <div className="lg:col-span-2">
              <SectionTitle 
                title="Active Events" 
                subtitle="Real-time events documented by our community"
                alignment="left"
              />
              <div className="mt-8">
                <ActiveEvents 
                  events={activeEventsData}
                />
              </div>
            </div>

            {/* Recent Timeline - 1/3 width */}
            <div className="lg:col-span-1">
              <SectionTitle 
                title="Recent Activity" 
                subtitle="Latest platform updates"
                alignment="left"
              />
              <div className="mt-8">
                <Timeline entries={timelineData} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* World Map Section - Full width */}
      <MapSection
        events={mapEventsData}
      />

      {/* Organizations Section - "Trusted by" */}
      <Organizations 
        organizations={organizationsData}
        title="Trusted by organizations"
        subtitle="Working with partners to preserve truth and accountability"
      />

      {/* Footer */}
      <Footer
        linkColumns={[
          {
            title: "Product",
            links: [
              { label: "Features", href: "#features" },
              { label: "Documentation", href: "#docs" },
              { label: "API", href: "#api" },
            ],
          },
          {
            title: "Company",
            links: [
              { label: "About", href: "#about" },
              { label: "Blog", href: "#blog" },
              { label: "Careers", href: "#careers" },
            ],
          },
          {
            title: "Legal",
            links: [
              { label: "Privacy", href: "#privacy" },
              { label: "Terms", href: "#terms" },
              { label: "License", href: "#license" },
            ],
          },
        ]}
        socialLinks={[
          { platform: "GitHub", url: "https://github.com", icon: Github },
          { platform: "Twitter", url: "https://twitter.com", icon: Twitter },
          { platform: "LinkedIn", url: "https://linkedin.com", icon: Linkedin },
        ]}
        copyright="© 2024 OpenWitness. Open source software for truth preservation."
      />
    </main>
  );
}
