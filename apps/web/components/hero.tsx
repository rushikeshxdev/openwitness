"use client";

import { motion, useScroll, useTransform, MotionConfig } from "framer-motion";
import Image from "next/image";
import { Button } from "./button";
import { Stats, type Stat } from "./stats";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useRef, useState } from "react";
import { Compass, ShieldPlus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CTAButton {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: LucideIcon;
}

export interface HeroProps {
  backgroundImage: string;
  /** Combined into one pill: "Open Source • Community Driven • For Truth" */
  tags?: string[];
  tagline?: string;
  missionStatement: string;
  description?: string;
  stats?: Stat[];
  primaryCTA: CTAButton;
  secondaryCTA: CTAButton;
  alignment?: "left" | "center";
}

/**
 * Hero — left-aligned copy matching referral typography & spacing
 */
export function Hero({
  backgroundImage,
  tags = ["Open Source", "Community Driven", "For Truth"],
  tagline,
  missionStatement,
  description,
  stats = [],
  primaryCTA,
  secondaryCTA,
  alignment = "left",
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [imageFailed, setImageFailed] = useState(false);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 140]);

  const hasTrailingPeriod = missionStatement.trim().endsWith(".");
  const missionText = hasTrailingPeriod
    ? missionStatement.trim().slice(0, -1)
    : missionStatement;

  const tagLabel = tags.join(" • ");
  const PrimaryIcon = primaryCTA.icon ?? Compass;
  const SecondaryIcon = secondaryCTA.icon ?? ShieldPlus;

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={heroRef}
        className="relative min-h-[100svh] w-full overflow-hidden flex items-start md:items-center"
        aria-labelledby="hero-heading"
      >
        <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
          <div className="absolute inset-0 bg-[#0B0E11]" />
          {!imageFailed && (
            <div className="relative w-full h-[115%]">
              <Image
                src={backgroundImage}
                alt="Public demonstration with citizens documenting the event"
                fill
                priority
                quality={80}
                className="object-cover object-[62%_35%] sm:object-[58%_32%] brightness-[0.82] contrast-[1.05]"
                sizes="100vw"
                onError={() => setImageFailed(true)}
              />
            </div>
          )}
        </motion.div>

        {/* Subtle left wash — readable copy, photo still clear */}
        <div
          className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#0B0E11]/70 from-0% via-[#0B0E11]/35 via-30% to-transparent to-58%"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#0B0E11] via-transparent to-black/25"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 z-10 h-40 pointer-events-none bg-gradient-to-t from-[#0B0E11] to-transparent"
          aria-hidden="true"
        />

        {/* Copy further left + larger type */}
        <div className="relative z-20 w-full max-w-[1440px] mx-auto pl-2 sm:pl-3 md:pl-4 lg:pl-5 pr-5 pt-28 md:pt-36 pb-44 md:pb-52">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className={cn(
              "flex flex-col w-full max-w-[720px] lg:max-w-[780px]",
              alignment === "center" && "items-center text-center mx-auto",
              alignment === "left" && "items-start text-left"
            )}
          >
            {/* Single combined pill */}
            {tags.length > 0 && (
              <motion.div variants={fadeUp} className="mb-6 md:mb-8">
                <span className="inline-flex items-center rounded-full border border-white/15 bg-black/45 px-5 py-2.5 text-sm md:text-base font-medium tracking-wide text-zinc-200 backdrop-blur-md">
                  {tagLabel}
                </span>
              </motion.div>
            )}

            {/* Headline */}
            <motion.h1
              id="hero-heading"
              variants={fadeUp}
              className="font-bold text-white tracking-[-0.04em] leading-[1.0] mb-6 md:mb-7"
              style={{
                fontSize: "clamp(3.5rem, 7.5vw, 6.25rem)",
              }}
            >
              {missionText}
              <span className="text-[#3B82F6]" aria-hidden="true">
                .
              </span>
            </motion.h1>

            {/* Tagline */}
            {tagline && (
              <motion.p
                variants={fadeUp}
                className="text-xl md:text-2xl lg:text-3xl font-medium text-white/95 mb-5 md:mb-6 tracking-[-0.02em]"
              >
                {tagline}
              </motion.p>
            )}

            {/* Description */}
            {description && (
              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl text-zinc-300 mb-9 md:mb-11 max-w-[40rem] leading-[1.7]"
              >
                {description}
              </motion.p>
            )}

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 w-full sm:w-auto"
            >
              <Button
                variant="primary"
                size="lg"
                icon={PrimaryIcon}
                iconPosition="left"
                href={primaryCTA.href}
                onClick={primaryCTA.onClick}
                className={cn(
                  "w-full sm:w-auto !rounded-xl !px-8 !py-4 text-lg",
                  "!bg-gradient-to-b from-[#4B8BFF] to-[#2563EB]",
                  "shadow-[0_8px_24px_rgba(37,99,235,0.4),inset_0_1px_0_rgba(255,255,255,0.35)]",
                  "ring-1 ring-white/25 hover:ring-white/40",
                  "border border-white/30"
                )}
              >
                {primaryCTA.label}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                icon={SecondaryIcon}
                iconPosition="left"
                href={secondaryCTA.href}
                onClick={secondaryCTA.onClick}
                className={cn(
                  "w-full sm:w-auto !rounded-xl !px-8 !py-4 text-lg",
                  "!bg-black/25 backdrop-blur-md",
                  "!border !border-transparent",
                  "[background:linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.35))_padding-box,linear-gradient(135deg,rgba(255,255,255,0.55),rgba(255,255,255,0.12)_40%,rgba(59,130,246,0.45))_border-box]",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
                  "hover:!bg-black/40"
                )}
              >
                {secondaryCTA.label}
              </Button>
            </motion.div>

            {stats.length > 0 && (
              <motion.div variants={fadeUp} className="w-full mt-12">
                <Stats stats={stats} />
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
