/**
 * Sample timeline data for the Recent Activity timeline section
 * 
 * This data demonstrates the various activity types and metadata formats
 * that the Timeline component can display.
 */

export interface TimelineEntry {
  id: string;
  timestamp: Date;
  eventName: string;
  activityType: 'evidence_added' | 'event_created' | 'verification_updated';
  metadata: Record<string, any>;
}

/**
 * Sample timeline entries showing recent platform activity
 */
export const timelineData: TimelineEntry[] = [
  {
    id: 'tl-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    eventName: 'Ukraine Protests 2024',
    activityType: 'evidence_added',
    metadata: {
      evidenceCount: 5,
      userName: 'Sarah Chen',
    },
  },
  {
    id: 'tl-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    eventName: 'Climate March London',
    activityType: 'verification_updated',
    metadata: {
      verificationStatus: 'verified',
      userName: 'Alex Thompson',
    },
  },
  {
    id: 'tl-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    eventName: 'Tech Workers Strike',
    activityType: 'event_created',
    metadata: {
      userName: 'Maria Garcia',
    },
  },
  {
    id: 'tl-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    eventName: 'Student Demonstrations Paris',
    activityType: 'evidence_added',
    metadata: {
      evidenceCount: 12,
      userName: 'David Kim',
    },
  },
  {
    id: 'tl-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    eventName: 'Healthcare Workers Rally',
    activityType: 'verification_updated',
    metadata: {
      verificationStatus: 'pending',
      userName: 'Emma Wilson',
    },
  },
  {
    id: 'tl-6',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    eventName: 'Environmental Protest Berlin',
    activityType: 'evidence_added',
    metadata: {
      evidenceCount: 8,
      userName: 'Lucas Schmidt',
    },
  },
  {
    id: 'tl-7',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    eventName: 'Indigenous Rights March',
    activityType: 'event_created',
    metadata: {
      userName: 'Nina Patel',
    },
  },
  {
    id: 'tl-8',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    eventName: 'Education Reform Protests',
    activityType: 'verification_updated',
    metadata: {
      verificationStatus: 'verified',
      userName: 'James Anderson',
    },
  },
];

/**
 * Export a subset of timeline entries for preview sections
 */
export const recentTimelineData = timelineData.slice(0, 5);
