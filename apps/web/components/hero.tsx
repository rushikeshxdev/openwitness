"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Container } from "./container";
import { Button } from "./button";
import { Stats, type Stat } from "./stats";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useRef } from "react";
import { SpotlightCursor } from "./spotlight-cursor";

/**
 * Hero component - Full-viewport section with cinematic background, mission statement, and animated stats
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 12.2, 14.5**
 * 
 * Features:
 * - Full viewport height (h-screen) with flexbox centering
 * - Background image with dark overlay for text contrast
 * - Mission statement with fade-up reveal animation
 * - Primary and secondary CTA buttons with staggered animation
 * - Animated statistics cards
 * - Parallax effect on background
 * 
 * @example
 * ```tsx
 * <Hero
 *   backgroundImage="/images/hero-bg.jpg"
 *   missionStatement="Truth deserves structure"
 *   stats={[
 *     { label: "Active Events", value: 1247 },
 *     { label: "Evidence Items", value: 48392, suffix: "+" },
 *     { label: "Global Contributors", value: 15234 }
 *   ]}
 *   primaryCTA={{ label: "Get Started", onClick: () => {} }}
 *   secondaryCTA={{ label: "Learn More", onClick: () => {} }}
 * />
 * ```
 */

export interface CTAButton {
  label: string;
  onClick?: () => void;
  href?: string;
}

export interface HeroProps {
  backgroundImage: string;
  tagline?: string;
  missionStatement: string;
  description?: string;
  stats: Stat[];
  primaryCTA: CTAButton;
  secondaryCTA: CTAButton;
}

export function Hero({
  backgroundImage,
  tagline,
  missionStatement,
  description,
  stats,
  primaryCTA,
  secondaryCTA,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  // Parallax effect: background moves slower than scroll
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 300]);

  // Handle CTA clicks
  const handlePrimaryCTA = () => {
    if (primaryCTA.onClick) {
      primaryCTA.onClick();
    } else if (primaryCTA.href) {
      window.location.href = primaryCTA.href;
    }
  };

  const handleSecondaryCTA = () => {
    if (secondaryCTA.onClick) {
      secondaryCTA.onClick();
    } else if (secondaryCTA.href) {
      // Smooth scroll to section if href is an anchor
      if (secondaryCTA.href.startsWith("#")) {
        const element = document.querySelector(secondaryCTA.href);
        element?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = secondaryCTA.href;
      }
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Spotlight effect */}
      <SpotlightCursor size={600} opacity={0.2} />

      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        {/* Gradient fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-background-primary via-blue-950/20 to-background-elevated" />
        
        {/* Background image */}
        <div className="relative w-full h-[120vh]">
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            priority
            quality={90}
            className="object-cover brightness-40"
            sizes="100vw"
            onError={(e) => {
              // Hide image on error, gradient fallback will show
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </motion.div>

      {/* Dark overlay for additional contrast */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Content */}
      <Container size="xl" className="relative z-20">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center justify-center text-center"
        >
          {/* Tagline */}
          {tagline && (
            <motion.div
              variants={fadeUp}
              className="text-sm md:text-base text-text-secondary mb-6 tracking-wide"
            >
              {tagline}
            </motion.div>
          )}

          {/* Mission Statement */}
          <motion.h1
            variants={fadeUp}
            className="text-hero font-bold text-text-primary mb-6 max-w-5xl"
          >
            {missionStatement}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-text-secondary mb-8 max-w-3xl"
            >
              {description}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
            style={{ marginBottom: stats.length > 0 ? undefined : 0 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handlePrimaryCTA}
              className="w-full sm:w-auto"
            >
              {primaryCTA.label}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleSecondaryCTA}
              className="w-full sm:w-auto"
            >
              {secondaryCTA.label}
            </Button>
          </motion.div>

          {/* Stats - only show if stats array is not empty */}
          {stats.length > 0 && (
            <motion.div variants={fadeUp} className="w-full mt-12 sm:mt-16">
              <Stats stats={stats} />
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
