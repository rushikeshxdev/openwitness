/**
 * Static data for Hero section
 */

export interface HeroData {
  backgroundImage: string;
  tags: string[];
  tagline?: string;
  missionStatement: string;
  description?: string;
  stats: Array<{
    label: string;
    value: number;
    suffix?: string;
    prefix?: string;
  }>;
  primaryCTA: {
    label: string;
    href?: string;
  };
  secondaryCTA: {
    label: string;
    href?: string;
  };
}

export const heroData: HeroData = {
  backgroundImage: "/images/hero-bg.png",
  tags: ["Open Source", "Community Driven", "For Truth"],
  tagline: "Document. Preserve. Organize. Verify.",
  missionStatement: "Truth deserves structure.",
  description:
    "OpenWitness is an open-source platform for preserving, organizing, and verifying evidence from public events.",
  stats: [],
  primaryCTA: {
    label: "Explore Events",
    href: "/events",
  },
  secondaryCTA: {
    label: "Report Incident",
    href: "mailto:report@openwitness.org?subject=Incident%20Report",
  },
};
