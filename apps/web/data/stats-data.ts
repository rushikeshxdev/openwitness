/**
 * Static data for Stats cards
 */

export interface StatData {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  increment?: string;
  icon?: "folder" | "calendar" | "map-pin" | "users";
}

export const statsData: StatData[] = [
  {
    label: "Evidence Files",
    value: 12483,
    increment: "+234 today",
    icon: "folder",
  },
  {
    label: "Active Events",
    value: 248,
    increment: "+18 today",
    icon: "calendar",
  },
  {
    label: "Cities",
    value: 97,
    increment: "+6 this week",
    icon: "map-pin",
  },
  {
    label: "Contributors",
    value: 1842,
    increment: "+121 this week",
    icon: "users",
  },
];
