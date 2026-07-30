import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Timeline } from "./timeline";
import { TimelineEntry } from "./timeline-entry";
import { LANDING_REFERENCE_TIME } from "@/data/events-data";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    useInView: () => true,
    MotionConfig: ({ children }: any) => children,
  };
});

describe("TimelineEntry Component", () => {
  const mockEntry = {
    timestamp: new Date(LANDING_REFERENCE_TIME.getTime() - 5 * 60 * 1000),
    eventName: "Test Event",
    activityType: "evidence_added" as const,
    summary: "New evidence added to Test Event",
    metadata: { evidenceCount: 5 },
    now: LANDING_REFERENCE_TIME,
  };

  it("renders summary correctly", () => {
    render(<TimelineEntry {...mockEntry} />);
    expect(
      screen.getByText("New evidence added to Test Event")
    ).toBeInTheDocument();
  });

  it("displays evidence count from metadata", () => {
    render(<TimelineEntry {...mockEntry} />);
    expect(screen.getByText(/5 items/)).toBeInTheDocument();
  });

  it('displays singular "item" for single evidence', () => {
    render(
      <TimelineEntry {...mockEntry} metadata={{ evidenceCount: 1 }} />
    );
    expect(screen.getByText(/1 item/)).toBeInTheDocument();
  });

  it("renders a time element with datetime", () => {
    render(<TimelineEntry {...mockEntry} />);
    const time = screen.getByText(/5m ago/).closest("time");
    expect(time).toHaveAttribute("dateTime");
  });

  it("applies glassmorphism styling", () => {
    const { container } = render(<TimelineEntry {...mockEntry} />);
    expect(container.querySelector(".backdrop-blur-md")).toBeInTheDocument();
  });
});

describe("Timeline Component", () => {
  const mockEntries = [
    {
      id: "1",
      timestamp: new Date(LANDING_REFERENCE_TIME.getTime() - 3 * 60 * 1000),
      eventName: "Event A",
      activityType: "evidence_added" as const,
      summary: "New evidence added to Event A",
      metadata: { evidenceCount: 3 },
    },
    {
      id: "2",
      timestamp: new Date(LANDING_REFERENCE_TIME.getTime() - 10 * 60 * 1000),
      eventName: "Event B",
      activityType: "verification_updated" as const,
      summary: "Verified Event B",
      metadata: { verificationStatus: "verified" as const },
    },
  ];

  it("renders all entries", () => {
    render(<Timeline entries={mockEntries} />);
    expect(screen.getByText(/New evidence added to Event A/)).toBeInTheDocument();
    expect(screen.getByText(/Verified Event B/)).toBeInTheDocument();
  });

  it("orders newest first", () => {
    render(<Timeline entries={mockEntries} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Event A");
    expect(items[1]).toHaveTextContent("Event B");
  });

  it("renders connecting line", () => {
    const { container } = render(<Timeline entries={mockEntries} />);
    expect(
      container.querySelector(".bg-gradient-to-b")
    ).toBeInTheDocument();
  });
});
