/**
 * Add New Evidence wizard copy + draft shape
 */

export const ADD_EVIDENCE_STEPS = [
  { id: 1, label: "Upload" },
  { id: 2, label: "Details" },
  { id: 3, label: "Location" },
  { id: 4, label: "Verification" },
  { id: 5, label: "Review" },
] as const;

export const ACCEPTED_FORMATS = [
  {
    label: "Images",
    formats: "JPG, PNG, WEBP, HEIC",
  },
  {
    label: "Videos",
    formats: "MP4, MOV, WEBM",
  },
  {
    label: "Audio",
    formats: "MP3, WAV, M4A",
  },
  {
    label: "Documents",
    formats: "PDF, DOC, TXT",
  },
] as const;

export interface AddEvidenceFile {
  id: string;
  name: string;
  sizeLabel: string;
  progress: number;
}

export interface AddEvidenceDraft {
  files: AddEvidenceFile[];
  title: string;
  description: string;
  eventId: string;
  tags: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  attestOriginal: boolean;
  attestLocation: boolean;
  attestReview: boolean;
}

export const emptyAddEvidenceDraft = (): AddEvidenceDraft => ({
  files: [],
  title: "",
  description: "",
  eventId: "",
  tags: "",
  city: "",
  country: "",
  latitude: "",
  longitude: "",
  attestOriginal: false,
  attestLocation: false,
  attestReview: false,
});

export const MOCK_UPLOAD_FILES: AddEvidenceFile[] = [
  {
    id: "f1",
    name: "protest_crowd_01.mp4",
    sizeLabel: "42.8 MB",
    progress: 100,
  },
  {
    id: "f2",
    name: "student_speech.mp4",
    sizeLabel: "18.2 MB",
    progress: 100,
  },
  {
    id: "f3",
    name: "police_presence.jpg",
    sizeLabel: "3.1 MB",
    progress: 100,
  },
];

export const ADD_EVIDENCE_DRAFT_KEY = "ow-add-evidence-draft";
