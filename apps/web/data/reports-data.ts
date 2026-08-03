/**
 * Reports catalog for /reports
 */

export type ReportKind = "community" | "official" | "mine";
export type ReportStatus = "published" | "under_review";
export type ReportsTab = "all" | "community" | "official" | "mine";

export interface ReportItem {
  id: string;
  title: string;
  summary: string;
  author: string;
  dateLabel: string;
  evidenceCount: number;
  contributorCount: number;
  status: ReportStatus;
  kind: ReportKind;
  eventId?: string;
}

export const reportsData: ReportItem[] = [
  {
    id: "r1",
    title: "CJP Protest – New Delhi",
    summary:
      "Community compilation of verified footage from India Gate and North Campus corridors.",
    author: "Asha K.",
    dateLabel: "May 18, 2024",
    evidenceCount: 48,
    contributorCount: 22,
    status: "published",
    kind: "community",
    eventId: "1",
  },
  {
    id: "r2",
    title: "Official statement on crowd management",
    summary:
      "Municipal briefing summarizing deployment timelines and public advisories.",
    author: "Delhi Civic Desk",
    dateLabel: "May 18, 2024",
    evidenceCount: 6,
    contributorCount: 3,
    status: "published",
    kind: "official",
    eventId: "1",
  },
  {
    id: "r3",
    title: "London rally field notes",
    summary:
      "Contributor notes linking speeches, march route, and press presence.",
    author: "Maya L.",
    dateLabel: "May 17, 2024",
    evidenceCount: 19,
    contributorCount: 8,
    status: "under_review",
    kind: "community",
    eventId: "6",
  },
  {
    id: "r4",
    title: "Flood response documentation pack",
    summary:
      "Organized media set covering rescue corridors and shelter capacity updates.",
    author: "Omar H.",
    dateLabel: "May 16, 2024",
    evidenceCount: 31,
    contributorCount: 14,
    status: "published",
    kind: "community",
    eventId: "3",
  },
  {
    id: "r5",
    title: "Press pool summary – LA march",
    summary:
      "Independent media roundup of verified clips and outlet attributions.",
    author: "The Wire Desk",
    dateLabel: "May 15, 2024",
    evidenceCount: 12,
    contributorCount: 5,
    status: "published",
    kind: "official",
    eventId: "7",
  },
  {
    id: "r6",
    title: "My draft: campus corridor evidence",
    summary:
      "Personal draft compiling speeches and police presence near the main gate.",
    author: "You",
    dateLabel: "May 18, 2024",
    evidenceCount: 4,
    contributorCount: 1,
    status: "under_review",
    kind: "mine",
    eventId: "1",
  },
  {
    id: "r7",
    title: "Jakarta transit disruption brief",
    summary:
      "Community report aggregating station footage and timeline markers.",
    author: "Dev N.",
    dateLabel: "May 14, 2024",
    evidenceCount: 21,
    contributorCount: 9,
    status: "published",
    kind: "community",
    eventId: "9",
  },
  {
    id: "r8",
    title: "My report: verified stills set",
    summary: "Still-image package submitted for community verification.",
    author: "You",
    dateLabel: "May 13, 2024",
    evidenceCount: 7,
    contributorCount: 1,
    status: "under_review",
    kind: "mine",
    eventId: "2",
  },
];

export function filterReports(
  items: ReportItem[],
  tab: ReportsTab,
  sessionName?: string | null
): ReportItem[] {
  if (tab === "all") return items;
  if (tab === "community") return items.filter((r) => r.kind === "community");
  if (tab === "official") return items.filter((r) => r.kind === "official");
  // mine
  return items.filter((r) => {
    if (r.kind === "mine") return true;
    if (sessionName && r.author === sessionName) return true;
    return false;
  });
}

export function getReportsForEvent(
  eventId: string,
  eventTitle?: string
): ReportItem[] {
  const linked = reportsData.filter((r) => r.eventId === eventId);
  if (linked.length > 0) return linked;

  const label = eventTitle ?? `Event ${eventId}`;
  return [
    {
      id: `fallback-c-${eventId}`,
      title: `Community brief – ${label}`,
      summary:
        "Contributor summary of verified media and timeline notes for this event.",
      author: "OpenWitness Community",
      dateLabel: "May 18, 2024",
      evidenceCount: 12,
      contributorCount: 5,
      status: "published",
      kind: "community",
      eventId,
    },
    {
      id: `fallback-o-${eventId}`,
      title: `Field update – ${label}`,
      summary:
        "Draft report compiling new uploads pending community verification.",
      author: "Field Desk",
      dateLabel: "May 17, 2024",
      evidenceCount: 4,
      contributorCount: 2,
      status: "under_review",
      kind: "official",
      eventId,
    },
  ];
}
