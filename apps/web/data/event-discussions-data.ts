/**
 * Discussion threads for event detail Discussions tab
 */

export interface DiscussionReply {
  id: string;
  author: string;
  initials: string;
  accent: string;
  body: string;
  timeLabel: string;
}

export interface DiscussionThread {
  id: string;
  author: string;
  initials: string;
  accent: string;
  body: string;
  timeLabel: string;
  likeCount: number;
  replyCount: number;
  replies?: DiscussionReply[];
}

const ACCENTS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
  "#14B8A6",
] as const;

const AUTHORS = [
  ["Asha K.", "AK"],
  ["Rohan M.", "RM"],
  ["Priya S.", "PS"],
  ["Dev N.", "DN"],
  ["Maya L.", "ML"],
  ["Omar H.", "OH"],
  ["Neha T.", "NT"],
  ["Samir P.", "SP"],
] as const;

const CURATED: Record<string, DiscussionThread[]> = {
  "1": [
    {
      id: "d1-1",
      author: "Priya S.",
      initials: "PS",
      accent: "#8B5CF6",
      body: "The India Gate corridor footage around noon looks consistent across three uploads — anyone else noticing the same placard text?",
      timeLabel: "2h ago",
      likeCount: 24,
      replyCount: 2,
      replies: [
        {
          id: "d1-1-r1",
          author: "Rohan M.",
          initials: "RM",
          accent: "#10B981",
          body: "Yes — matched it with the stills in related evidence. Adding a timeline note.",
          timeLabel: "1h ago",
        },
        {
          id: "d1-1-r2",
          author: "Asha K.",
          initials: "AK",
          accent: "#3B82F6",
          body: "Flagged for verification — audio is clear enough for chants.",
          timeLabel: "45m ago",
        },
      ],
    },
    {
      id: "d1-2",
      author: "Maya L.",
      initials: "ML",
      accent: "#F59E0B",
      body: "Can we keep police corridor clips in a separate cluster so reports stay focused on the march route?",
      timeLabel: "5h ago",
      likeCount: 11,
      replyCount: 0,
    },
    {
      id: "d1-3",
      author: "Omar H.",
      initials: "OH",
      accent: "#06B6D4",
      body: "Official briefing just dropped — linking it under Reports so we can cross-check timestamps.",
      timeLabel: "8h ago",
      likeCount: 18,
      replyCount: 1,
      replies: [
        {
          id: "d1-3-r1",
          author: "Dev N.",
          initials: "DN",
          accent: "#EC4899",
          body: "Done — see the Official Statements tab on Reports.",
          timeLabel: "7h ago",
        },
      ],
    },
  ],
  "2": [
    {
      id: "d2-1",
      author: "Neha T.",
      initials: "NT",
      accent: "#F97316",
      body: "Noida stretch looks busy in the afternoon clips — any verified stills from the service road?",
      timeLabel: "3h ago",
      likeCount: 15,
      replyCount: 1,
      replies: [
        {
          id: "d2-1-r1",
          author: "Samir P.",
          initials: "SP",
          accent: "#14B8A6",
          body: "Uploaded two stills an hour ago — waiting on community verify.",
          timeLabel: "2h ago",
        },
      ],
    },
    {
      id: "d2-2",
      author: "Asha K.",
      initials: "AK",
      accent: "#3B82F6",
      body: "Please tag media with location accuracy when you can — helps the map workspace a lot.",
      timeLabel: "6h ago",
      likeCount: 9,
      replyCount: 0,
    },
    {
      id: "d2-3",
      author: "Rohan M.",
      initials: "RM",
      accent: "#10B981",
      body: "Farmers’ convoy footage from yesterday evening is strong — recommending it for the event highlights row.",
      timeLabel: "1d ago",
      likeCount: 21,
      replyCount: 0,
    },
  ],
};

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h || 1;
}

function buildFallbackThreads(
  eventId: string,
  eventTitle: string,
  discussionCount: number
): DiscussionThread[] {
  const seed = hashSeed(eventId);
  const count = Math.min(12, Math.max(3, Math.min(discussionCount, 10)));
  const bodies = [
    `Seeing a lot of new uploads for ${eventTitle} — which clips should we prioritize for verification?`,
    "Timeline markers feel solid through mid-day. Evening coverage is thinner.",
    "Reminder: keep original filenames when possible so metadata stays useful.",
    "Map pin looks accurate for the main cluster; secondary hotspots need a second look.",
    "Anyone drafting a community brief for today’s activity?",
    "Audio quality varies — flagging one clip that may need a cleaner alternate angle.",
    "Contributor count is climbing; welcome to new verifiers joining this thread.",
    "Cross-checking with official statements under Reports before we publish summaries.",
  ];

  return Array.from({ length: count }, (_, i) => {
    const [author, initials] = AUTHORS[(seed + i) % AUTHORS.length];
    const hasReply = i % 3 === 0;
    const replies: DiscussionReply[] | undefined = hasReply
      ? [
          {
            id: `fb-${eventId}-${i}-r0`,
            author: AUTHORS[(seed + i + 3) % AUTHORS.length][0],
            initials: AUTHORS[(seed + i + 3) % AUTHORS.length][1],
            accent: ACCENTS[(seed + i + 2) % ACCENTS.length],
            body: "Agreed — I’ll add a note on the evidence detail.",
            timeLabel: `${(i % 5) + 1}h ago`,
          },
        ]
      : undefined;

    return {
      id: `fb-${eventId}-${i}`,
      author,
      initials,
      accent: ACCENTS[(seed + i) % ACCENTS.length],
      body: bodies[i % bodies.length],
      timeLabel: i === 0 ? "1h ago" : i < 4 ? `${i + 2}h ago` : `${i - 2}d ago`,
      likeCount: 3 + ((seed + i * 7) % 28),
      replyCount: replies?.length ?? 0,
      replies,
    };
  });
}

export function getDiscussionsForEvent(
  eventId: string,
  eventTitle?: string,
  discussionCount?: number
): DiscussionThread[] {
  const curated = CURATED[eventId];
  if (curated?.length) return curated;

  return buildFallbackThreads(
    eventId,
    eventTitle ?? `Event ${eventId}`,
    discussionCount ?? 8
  );
}
