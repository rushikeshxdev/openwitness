import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { FooterNavLink } from "./footer-nav-link";

/**
 * Footer — static server component with design-system tokens
 */

export interface FooterLinkColumn {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

export interface FooterSocialLink {
  platform: string;
  url: string;
  icon: LucideIcon;
}

export interface FooterProps {
  linkColumns: FooterLinkColumn[];
  socialLinks: FooterSocialLink[];
  copyright: string;
  className?: string;
}

export function Footer({
  linkColumns,
  socialLinks,
  copyright,
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "bg-background-primary border-t border-white/5",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 lg:px-12 lg:py-32">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <h2 className="text-2xl font-bold text-text-primary">OpenWitness</h2>
            <p className="mt-4 text-base text-text-secondary max-w-md leading-relaxed">
              Preserving truth through structured evidence documentation. A
              platform for organizing and verifying public event records.
            </p>

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
                        "bg-white/5 text-text-tertiary transition-all duration-300",
                        "hover:bg-white/10 hover:text-text-primary hover:scale-110",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background-primary"
                      )}
                      aria-label={`Visit our ${social.platform}`}
                    >
                      <Icon size={20} aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {linkColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
                {column.title}
              </h3>
              <ul className="mt-6 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterNavLink label={link.label} href={link.href} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-white/5 pt-8">
          <p className="text-sm text-text-tertiary text-center">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
