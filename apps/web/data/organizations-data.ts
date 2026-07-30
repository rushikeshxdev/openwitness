/**
 * Sample organization data for the Organizations section
 * 
 * This file contains mock data for partner organizations displayed on the landing page.
 * In production, this would be fetched from an API or CMS.
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
    name: "Human Rights Watch",
    logoUrl: "/logos/hrw.png",
    website: "https://www.hrw.org",
    description: "International human rights organization",
  },
  {
    id: "org-2",
    name: "Amnesty International",
    logoUrl: "/logos/amnesty.png",
    website: "https://www.amnesty.org",
    description: "Global movement for human rights",
  },
  {
    id: "org-3",
    name: "Bellingcat",
    logoUrl: "/logos/bellingcat.png",
    website: "https://www.bellingcat.com",
    description: "Independent investigative journalism collective",
  },
  {
    id: "org-4",
    name: "WITNESS",
    logoUrl: "/logos/witness.png",
    website: "https://www.witness.org",
    description: "Video activism and human rights",
  },
  {
    id: "org-5",
    name: "Committee to Protect Journalists",
    logoUrl: "/logos/cpj.png",
    website: "https://cpj.org",
    description: "Promoting press freedom worldwide",
  },
  {
    id: "org-6",
    name: "Reporters Without Borders",
    logoUrl: "/logos/rsf.png",
    website: "https://rsf.org",
    description: "Defending freedom of information",
  },
  {
    id: "org-7",
    name: "International Criminal Court",
    logoUrl: "/logos/icc.png",
    website: "https://www.icc-cpi.int",
    description: "Prosecuting individuals for international crimes",
  },
  {
    id: "org-8",
    name: "United Nations",
    logoUrl: "/logos/un.png",
    website: "https://www.un.org",
    description: "International organization for global cooperation",
  },
];

/**
 * Get all organizations
 */
export function getOrganizations(): Organization[] {
  return organizationsData;
}

/**
 * Get a specific number of organizations (for homepage preview, etc.)
 */
export function getFeaturedOrganizations(count: number = 8): Organization[] {
  return organizationsData.slice(0, count);
}
