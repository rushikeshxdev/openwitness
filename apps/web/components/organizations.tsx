"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { OrganizationCard } from "./organization-card";
import { Container } from "./container";
import { staggerContainer, fadeUp } from "@/lib/animations";
import type { TrustedOrganization } from "@/data/trusted-organizations-data";

/**
 * Landing Trusted-by strip — compact org grid linking to org profiles
 */

export interface OrganizationsProps {
  organizations: Array<
    Pick<TrustedOrganization, "id" | "name" | "initials" | "accent"> & {
      category?: string;
    }
  >;
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  className?: string;
}

export function Organizations({
  organizations,
  title = "Trusted By",
  subtitle = "Organizations using OpenWitness to preserve truth",
  viewAllHref = "/organizations",
  className,
}: OrganizationsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      className={cn("py-16 md:py-20 bg-background-primary", className)}
      aria-labelledby="organizations-title"
    >
      <Container size="xl">
        <h2
          id="organizations-title"
          className="text-center text-base md:text-lg font-medium text-text-secondary tracking-wide"
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 text-center text-sm text-text-tertiary">{subtitle}</p>
        ) : null}

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          className={cn(
            "grid gap-3 md:gap-4 mt-10 md:mt-12",
            "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
          )}
        >
          {organizations.map((organization) => (
            <motion.div key={organization.id} variants={fadeUp}>
              <OrganizationCard organization={organization} />
            </motion.div>
          ))}
        </motion.div>

        {organizations.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-text-secondary text-lg">
              No organizations to display
            </p>
          </div>
        ) : (
          <div className="mt-8 flex justify-center">
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#60A5FA] hover:text-white transition-colors"
            >
              View all organizations
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
