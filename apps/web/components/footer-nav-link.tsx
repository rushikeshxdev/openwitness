"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReportIncidentGate } from "@/components/auth/report-incident-gate";

export function FooterNavLink({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  if (href === "/report") {
    return (
      <ReportIncidentGate
        label={label}
        variant="footer"
        className="text-base hover:underline"
      />
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "text-base text-text-secondary transition-colors duration-200",
        "hover:text-text-primary hover:underline",
        "focus:outline-none focus:text-text-primary"
      )}
    >
      {label}
    </Link>
  );
}
