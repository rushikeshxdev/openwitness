/**
 * Static data for Stats cards
 * Contains platform metrics with incremental values
 */

export interface StatData {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  increment?: string;
}

export const statsData: StatData[] = [
  {
    label: "Evidence Files",
    value: 12483,
    increment: "+234 today",
  },
  {
    label: "Active Events",
    value: 248,
    increment: "+16 today",
  },
  {
    label: "Cities",
    value: 97,
    increment: "+6 this week",
  },
  {
    label: "Contributors",
    value: 1842,
    increment: "+121 this week",
  },
];
