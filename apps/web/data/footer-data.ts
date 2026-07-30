import { Github, Twitter, Linkedin } from "lucide-react";
import type { FooterLinkColumn, FooterSocialLink } from "@/components/footer";

export const footerLinkColumns: FooterLinkColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Explore Events", href: "/events" },
      { label: "Live Map", href: "#map" },
      {
        label: "Report Incident",
        href: "mailto:report@openwitness.org?subject=Incident%20Report",
      },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "About", href: "#about" },
      { label: "Organizations", href: "#organizations" },
      { label: "Documentation", href: "https://github.com/openwitness" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
      { label: "License", href: "https://github.com/openwitness" },
    ],
  },
];

export const footerSocialLinks: FooterSocialLink[] = [
  {
    platform: "GitHub",
    url: "https://github.com/openwitness",
    icon: Github,
  },
  {
    platform: "Twitter",
    url: "https://twitter.com/openwitness",
    icon: Twitter,
  },
  {
    platform: "LinkedIn",
    url: "https://linkedin.com/company/openwitness",
    icon: Linkedin,
  },
];

export const footerCopyright =
  "© 2026 OpenWitness. Open source software for truth preservation.";
