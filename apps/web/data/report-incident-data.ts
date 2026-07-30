/**
 * Copy and options for /report incident wizard
 */

export const reportSteps = [
  { id: 1, label: "Basic Information" },
  { id: 2, label: "Media & Evidence" },
  { id: 3, label: "Location" },
  { id: 4, label: "Additional Details" },
  { id: 5, label: "Review & Submit" },
] as const;

export const reportCategories = [
  { value: "protest", label: "Protest" },
  { value: "disaster", label: "Natural Disaster" },
  { value: "accident", label: "Accident" },
  { value: "humanitarian", label: "Humanitarian" },
  { value: "other", label: "Other" },
] as const;

export const reportEventTypes = [
  { id: "protest", label: "Protest" },
  { id: "disaster", label: "Natural Disaster" },
  { id: "accident", label: "Accident" },
  { id: "other", label: "Other" },
] as const;

export const reportGuidelines = [
  "Only report events you witnessed or can document with evidence.",
  "Do not upload graphic content involving minors.",
  "Include clear location and time when possible.",
  "Mark unverified claims honestly — our community will help verify.",
] as const;

export type ReportDraft = {
  title: string;
  category: string;
  eventType: string;
  description: string;
  mediaNotes: string;
  city: string;
  country: string;
  address: string;
  impactLevel: "low" | "medium" | "high";
  visibility: "public" | "restricted";
  additionalNotes: string;
};

export const emptyReportDraft: ReportDraft = {
  title: "",
  category: "protest",
  eventType: "protest",
  description: "",
  mediaNotes: "",
  city: "",
  country: "",
  address: "",
  impactLevel: "medium",
  visibility: "public",
  additionalNotes: "",
};
