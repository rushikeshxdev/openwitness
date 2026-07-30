import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

/**
 * Footer component with large minimal design
 * Features generous whitespace, multi-column grid, social links, and copyright
 * Server component (static content, no client state needed)
 * 
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 12.9**
 * 
 * @example
 * ```tsx
 * <Footer
 *   linkColumns={[
 *     {
 *       title: "Product",
 *       links: [
 *         { label: "Features", href: "/features" },
 *         { label: "Pricing", href: "/pricing" },
 *       ]
 *     }
 *   ]}
 *   socialLinks={[
 *     { platform: "Twitter", url: "https://twitter.com", icon: Twitter }
 *   ]}
 *   copyright="© 2024 OpenWitness. All rights reserved."
 * />
 * ```
 */

export interface FooterLinkColumn {
  /** Column title */
  title: string;
  /** Array of links in this column */
  links: Array<{
    /** Link text */
    label: string;
    /** Link destination */
    href: string;
  }>;
}

export interface FooterSocialLink {
  /** Platform name (e.g., "Twitter", "GitHub") */
  platform: string;
  /** Social profile URL */
  url: string;
  /** Lucide icon component */
  icon: LucideIcon;
}

export interface FooterProps {
  /** Array of link columns with categorized navigation */
  linkColumns: FooterLinkColumn[];
  /** Array of social media links with icons */
  socialLinks: FooterSocialLink[];
  /** Copyright text */
  copyright: string;
}

export function Footer({ linkColumns, socialLinks, copyright }: FooterProps) {
  return (
    <footer className="bg-background border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 lg:px-12 lg:py-32">
        {/* Main footer content */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <h2 className="text-2xl font-bold text-primary">OpenWitness</h2>
            <p className="mt-4 text-base text-secondary max-w-md leading-relaxed">
              Preserving truth through structured evidence documentation. A
              platform for organizing and verifying public event records.
            </p>
            
            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="mt-8 flex items-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        "bg-white/5 text-tertiary transition-all duration-300",
                        "hover:bg-white/10 hover:text-primary hover:scale-110",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background"
                      )}
                      aria-label={`Visit our ${social.platform}`}
                    >
                      <Icon size={20} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Link columns */}
          {linkColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                {column.title}
              </h3>
              <ul className="mt-6 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-base text-secondary transition-colors duration-200",
                        "hover:text-primary hover:underline",
                        "focus:outline-none focus:text-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-16 border-t border-white/5 pt-8">
          {/* Copyright */}
          <p className="text-sm text-tertiary text-center">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
