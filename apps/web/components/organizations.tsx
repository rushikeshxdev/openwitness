"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { OrganizationCard } from "./organization-card";
import { Container } from "./container";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { useInView } from "framer-motion";
import { useRef } from "react";

/**
 * Organizations component displaying partner organization logos in a responsive grid
 * Features staggered entrance animations and responsive column layout
 * 
 * **Validates: Requirements 6.1, 6.4, 6.5**
 * 
 * @example
 * ```tsx
 * <Organizations
 *   organizations={[
 *     { id: "1", name: "Partner A", logoUrl: "/logos/a.png" },
 *     { id: "2", name: "Partner B", logoUrl: "/logos/b.png", website: "https://b.com" },
 *   ]}
 * />
 * ```
 */

export interface OrganizationsProps {
  /** Array of organization data */
  organizations: Array<{
    id: string;
    name: string;
    logoUrl: string;
    website?: string;
  }>;
  /** Optional section title (defaults to "Trusted By") */
  title?: string;
  /** Optional section subtitle */
  subtitle?: string;
  /** Additional CSS classes */
  className?: string;
}

export function Organizations({
  organizations,
  title = "Trusted By",
  subtitle = "Organizations using OpenWitness to preserve truth",
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
            "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
          )}
        >
          {organizations.map((organization) => (
            <motion.div key={organization.id} variants={fadeUp}>
              <OrganizationCard organization={organization} />
            </motion.div>
          ))}
        </motion.div>

        {organizations.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-text-secondary text-lg">
              No organizations to display
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
