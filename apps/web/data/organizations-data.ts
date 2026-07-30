/**
 * Partner organizations shown in the Trusted By section
 */

export interface Organization {
  id: string;
  name: string;
  logoUrl: string;
  website?: string;
  description?: string;
}

export const organizationsData: Organization[] = [
  {
    id: "org-1",
    name: "Humanity First",
    logoUrl: "/logos/humanity-first.svg",
    description: "Humanitarian documentation network",
  },
  {
    id: "org-2",
    name: "People's Archive",
    logoUrl: "/logos/peoples-archive.svg",
    description: "Community memory and evidence archive",
  },
  {
    id: "org-3",
    name: "CivicLens",
    logoUrl: "/logos/civiclens.svg",
    description: "Civic monitoring and open data",
  },
  {
    id: "org-4",
    name: "Satyagraha Labs",
    logoUrl: "/logos/satyagraha-labs.svg",
    description: "Truth-seeking research collective",
  },
  {
    id: "org-5",
    name: "Evidence Collective",
    logoUrl: "/logos/evidence-collective.svg",
    description: "Open evidence stewardship",
  },
  {
    id: "org-6",
    name: "The Public Record",
    logoUrl: "/logos/public-record.svg",
    description: "Independent public documentation",
  },
];

export function getOrganizations(): Organization[] {
  return organizationsData;
}

export function getFeaturedOrganizations(count: number = 6): Organization[] {
  return organizationsData.slice(0, count);
}
