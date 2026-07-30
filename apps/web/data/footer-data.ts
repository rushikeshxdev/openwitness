import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { FooterLinkColumn, FooterSocialLink } from "@/components/footer";

/**
 * Sample footer data for the landing page
 * Contains link columns, social links, and copyright information
 */

export const footerLinkColumns: FooterLinkColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Use Cases", href: "#use-cases" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api" },
      { label: "Guides", href: "/guides" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
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
  {
    platform: "Email",
    url: "mailto:contact@openwitness.org",
    icon: Mail,
  },
];

export const footerCopyright = "© 2024 OpenWitness. All rights reserved.";
