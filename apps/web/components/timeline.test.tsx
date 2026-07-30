import { render, screen } from '@testing-library/react';
import { Timeline } from './timeline';
import { TimelineEntry } from './timeline-entry';

/**
 * Test suite for Timeline and TimelineEntry components
 * 
 * **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6**
 */

// Mock framer-motion to avoid animation complexity in tests
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    useInView: () => true,
  };
});

describe('TimelineEntry Component', () => {
  const mockEntry = {
    timestamp: new Date('2024-01-15T10:30:00'),
    eventName: 'Test Event',
    activityType: 'evidence_added' as const,
    metadata: {
      evidenceCount: 5,
      userName: 'John Doe',
    },
  };

  it('renders event name correctly', () => {
    render(<TimelineEntry {...mockEntry} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('displays activity type label for evidence_added', () => {
    render(<TimelineEntry {...mockEntry} />);
    expect(screen.getByText('Evidence Added')).toBeInTheDocument();
  });

  it('displays activity type label for event_created', () => {
    render(
      <TimelineEntry
        {...mockEntry}
        activityType="event_created"
      />
    );
    expect(screen.getByText('Event Created')).toBeInTheDocument();
  });

  it('displays activity type label for verification_updated', () => {
    render(
      <TimelineEntry
        {...mockEntry}
        activityType="verification_updated"
      />
    );
    expect(screen.getByText('Verification Updated')).toBeInTheDocument();
  });

  it('displays evidence count from metadata', () => {
    render(<TimelineEntry {...mockEntry} />);
    expect(screen.getByText('5 items')).toBeInTheDocument();
  });

  it('displays singular "item" for single evidence', () => {
    render(
      <TimelineEntry
        {...mockEntry}
        metadata={{ evidenceCount: 1 }}
      />
    );
    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('displays user name from metadata', () => {
    render(<TimelineEntry {...mockEntry} />);
    expect(screen.getByText('by John Doe')).toBeInTheDocument();
  });

  it('displays verification status from metadata', () => {
    render(
      <TimelineEntry
        {...mockEntry}
        metadata={{ verificationStatus: 'verified' }}
      />
    );
    expect(screen.getByText('verified')).toBeInTheDocument();
  });

  it('formats relative time for recent timestamps', () => {
    const recentDate = new Date(Date.now() - 1000 * 60 * 30); // 30 minutes ago
    render(
      <TimelineEntry
        {...mockEntry}
        timestamp={recentDate}
      />
    );
    expect(screen.getByText(/minutes ago/)).toBeInTheDocument();
  });

  it('shows "just now" for very recent timestamps', () => {
    const veryRecentDate = new Date(Date.now() - 1000 * 30); // 30 seconds ago
    render(
      <TimelineEntry
        {...mockEntry}
        timestamp={veryRecentDate}
      />
    );
    expect(screen.getByText('just now')).toBeInTheDocument();
  });

  it('formats hours correctly', () => {
    const hoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 3); // 3 hours ago
    render(
      <TimelineEntry
        {...mockEntry}
        timestamp={hoursAgo}
      />
    );
    expect(screen.getByText(/3 hours ago/)).toBeInTheDocument();
  });

  it('formats days correctly', () => {
    const daysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2); // 2 days ago
    render(
      <TimelineEntry
        {...mockEntry}
        timestamp={daysAgo}
      />
    );
    expect(screen.getByText(/2 days ago/)).toBeInTheDocument();
  });

  it('shows full date on hover (in title attribute)', () => {
    render(<TimelineEntry {...mockEntry} />);
    const timestampElement = screen.getByTitle(/2024/);
    expect(timestampElement).toBeInTheDocument();
  });

  it('renders with empty metadata without crashing', () => {
    render(
      <TimelineEntry
        {...mockEntry}
        metadata={{}}
      />
    );
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <TimelineEntry
        {...mockEntry}
        className="custom-class"
      />
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});

describe('Timeline Component', () => {
  const mockEntries = [
    {
      id: '1',
      timestamp: new Date('2024-01-15T12:00:00'),
      eventName: 'Recent Event',
      activityType: 'evidence_added' as const,
      metadata: { evidenceCount: 3 },
    },
    {
      id: '2',
      timestamp: new Date('2024-01-15T10:00:00'),
      eventName: 'Earlier Event',
      activityType: 'event_created' as const,
      metadata: { userName: 'Jane Smith' },
    },
    {
      id: '3',
      timestamp: new Date('2024-01-14T15:00:00'),
      eventName: 'Old Event',
      activityType: 'verification_updated' as const,
      metadata: { verificationStatus: 'verified' },
    },
  ];

  it('renders all timeline entries', () => {
    render(<Timeline entries={mockEntries} />);
    expect(screen.getByText('Recent Event')).toBeInTheDocument();
    expect(screen.getByText('Earlier Event')).toBeInTheDocument();
    expect(screen.getByText('Old Event')).toBeInTheDocument();
  });

  it('displays entries in reverse chronological order (newest first)', () => {
    const { container } = render(<Timeline entries={mockEntries} />);
    const eventNames = Array.from(container.querySelectorAll('h4')).map(
      (el) => el.textContent
    );
    expect(eventNames[0]).toBe('Recent Event');
    expect(eventNames[1]).toBe('Earlier Event');
    expect(eventNames[2]).toBe('Old Event');
  });

  it('renders connecting line element', () => {
    const { container } = render(<Timeline entries={mockEntries} />);
    const line = container.querySelector('.bg-gradient-to-b');
    expect(line).toBeInTheDocument();
  });

  it('renders dot indicators for each entry', () => {
    const { container } = render(<Timeline entries={mockEntries} />);
    const dots = container.querySelectorAll('.rounded-full.bg-gradient-to-br');
    expect(dots.length).toBe(mockEntries.length);
  });

  it('adds pulsing animation to the first (newest) entry', () => {
    const { container } = render(<Timeline entries={mockEntries} />);
    const pulsingElement = container.querySelector('.animate-ping');
    expect(pulsingElement).toBeInTheDocument();
  });

  it('renders empty timeline without crashing', () => {
    render(<Timeline entries={[]} />);
    // Should render without errors even with no entries
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <Timeline entries={mockEntries} className="custom-timeline-class" />
    );
    expect(container.querySelector('.custom-timeline-class')).toBeInTheDocument();
  });

  it('handles entries with identical timestamps', () => {
    const sameTimeEntries = [
      {
        id: '1',
        timestamp: new Date('2024-01-15T12:00:00'),
        eventName: 'Event One',
        activityType: 'evidence_added' as const,
        metadata: {},
      },
      {
        id: '2',
        timestamp: new Date('2024-01-15T12:00:00'),
        eventName: 'Event Two',
        activityType: 'event_created' as const,
        metadata: {},
      },
    ];
    render(<Timeline entries={sameTimeEntries} />);
    expect(screen.getByText('Event One')).toBeInTheDocument();
    expect(screen.getByText('Event Two')).toBeInTheDocument();
  });
});

describe('Timeline Integration', () => {
  it('displays complete timeline with all activity types', () => {
    const completeEntries = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        eventName: 'Ukraine Protests',
        activityType: 'evidence_added' as const,
        metadata: { evidenceCount: 5, userName: 'Sarah' },
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        eventName: 'Climate March',
        activityType: 'verification_updated' as const,
        metadata: { verificationStatus: 'verified' },
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        eventName: 'Tech Strike',
        activityType: 'event_created' as const,
        metadata: { userName: 'Alex' },
      },
    ];

    render(<Timeline entries={completeEntries} />);

    // Verify all entries are present
    expect(screen.getByText('Ukraine Protests')).toBeInTheDocument();
    expect(screen.getByText('Climate March')).toBeInTheDocument();
    expect(screen.getByText('Tech Strike')).toBeInTheDocument();

    // Verify activity types
    expect(screen.getByText('Evidence Added')).toBeInTheDocument();
    expect(screen.getByText('Verification Updated')).toBeInTheDocument();
    expect(screen.getByText('Event Created')).toBeInTheDocument();

    // Verify metadata
    expect(screen.getByText('5 items')).toBeInTheDocument();
    expect(screen.getByText('by Sarah')).toBeInTheDocument();
    expect(screen.getByText('verified')).toBeInTheDocument();
    expect(screen.getByText('by Alex')).toBeInTheDocument();
  });
});
