/**
 * Static data for Hero section
 * Contains mission statement, stats, CTA buttons, and background image
 */

export interface HeroData {
  backgroundImage: string;
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
  backgroundImage: "/images/hero-bg.jpg",
  tagline: "Open Source • Community Driven • For Truth",
  missionStatement: "Truth deserves structure",
  description: "OpenWitness is an open-source platform for preserving, organizing, and verifying evidence from public events.",
  stats: [
    {
      label: "Active Events",
      value: 1247,
    },
    {
      label: "Evidence Items",
      value: 48392,
      suffix: "+",
    },
    {
      label: "Global Contributors",
      value: 15234,
    },
  ],
  primaryCTA: {
    label: "Get Started",
    href: "#get-started",
  },
  secondaryCTA: {
    label: "Learn More",
    href: "#learn-more",
  },
};
