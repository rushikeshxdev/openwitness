"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { OrganizationCard } from "./organization-card";
import { Container } from "./container";
import { SectionTitle } from "./section-title";
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
      className={cn("py-24 md:py-32 bg-background-primary", className)}
      aria-labelledby="organizations-title"
    >
      <Container>
        {/* Section Title */}
        <SectionTitle
          title={title}
          subtitle={subtitle}
          alignment="center"
        />

        {/* Organizations Grid */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          className={cn(
            "grid gap-6 mt-16",
            // Responsive columns: 2 mobile, 3 tablet, 4 desktop
            "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          )}
        >
          {organizations.map((organization) => (
            <motion.div key={organization.id} variants={fadeUp}>
              <OrganizationCard organization={organization} />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state */}
        {organizations.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-text-secondary text-lg">
              No organizations to display
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
