/**
 * Trusted organizations catalog for /organizations
 */

export type OrganizationCategory =
  | "Human Rights Organization"
  | "Independent Media"
  | "NGO"
  | "Advocacy Organization"
  | "Free Speech Organization";

export interface TrustedOrganization {
  id: string;
  name: string;
  category: OrganizationCategory;
  eventCount: number;
  verified: boolean;
  /** Initials shown in circular avatar */
  initials: string;
  /** Avatar accent background */
  accent: string;
  description?: string;
  website?: string;
}

export const ORGANIZATION_CATEGORIES: Array<OrganizationCategory | "all"> = [
  "all",
  "Human Rights Organization",
  "Independent Media",
  "NGO",
  "Advocacy Organization",
  "Free Speech Organization",
];

export const trustedOrganizationsData: TrustedOrganization[] = [
  {
    id: "amnesty",
    name: "Amnesty International India",
    category: "Human Rights Organization",
    eventCount: 120,
    verified: true,
    initials: "A",
    accent: "#F59E0B",
    description: "Global human rights documentation and advocacy.",
    website: "https://www.amnesty.org.in",
  },
  {
    id: "human-rights",
    name: "Human Rights",
    category: "Human Rights Organization",
    eventCount: 98,
    verified: true,
    initials: "HR",
    accent: "#3B82F6",
    description: "Independent monitoring of civic and rights issues.",
  },
  {
    id: "the-wire",
    name: "The Wire",
    category: "Independent Media",
    eventCount: 75,
    verified: true,
    initials: "TW",
    accent: "#EF4444",
    description: "Independent journalism covering public events.",
  },
  {
    id: "india-civil-watch",
    name: "India Civil Watch",
    category: "NGO",
    eventCount: 64,
    verified: true,
    initials: "IC",
    accent: "#10B981",
    description: "Civil society documentation and accountability.",
  },
  {
    id: "change-org-india",
    name: "Change.org India",
    category: "Advocacy Organization",
    eventCount: 55,
    verified: true,
    initials: "C",
    accent: "#F97316",
    description: "Advocacy campaigns and citizen petitions.",
  },
  {
    id: "sabrang-trust",
    name: "Sabrang Trust",
    category: "NGO",
    eventCount: 42,
    verified: true,
    initials: "ST",
    accent: "#8B5CF6",
    description: "Community justice and documentation initiatives.",
  },
  {
    id: "pucl",
    name: "PUCL",
    category: "Human Rights Organization",
    eventCount: 43,
    verified: true,
    initials: "P",
    accent: "#06B6D4",
    description: "People's Union for Civil Liberties.",
  },
  {
    id: "article-19-india",
    name: "Article 19 India",
    category: "Free Speech Organization",
    eventCount: 34,
    verified: true,
    initials: "A19",
    accent: "#EC4899",
    description: "Freedom of expression and information rights.",
  },
];

export function getTrustedOrganizations(): TrustedOrganization[] {
  return trustedOrganizationsData;
}

export function getTrustedOrganizationById(
  id: string
): TrustedOrganization | undefined {
  return trustedOrganizationsData.find((o) => o.id === id);
}

export function filterTrustedOrganizations(
  orgs: TrustedOrganization[],
  category: OrganizationCategory | "all",
  query: string
): TrustedOrganization[] {
  const q = query.trim().toLowerCase();
  return orgs.filter((org) => {
    if (category !== "all" && org.category !== category) return false;
    if (!q) return true;
    return (
      org.name.toLowerCase().includes(q) ||
      org.category.toLowerCase().includes(q) ||
      (org.description?.toLowerCase().includes(q) ?? false)
    );
  });
}
