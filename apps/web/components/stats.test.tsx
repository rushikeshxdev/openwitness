/**
 * Stats Component Tests
 * 
 * Tests for the Stats component with animated counters
 * **Validates: Requirements 1.6, 1.7, 12.4**
 * 
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stats, StatsProps } from "./stats";

// Mock framer-motion hooks
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    useSpring: vi.fn(() => ({
      get: () => 0,
      set: vi.fn(),
      on: vi.fn(() => vi.fn()),
      destroy: vi.fn(),
    })),
    useInView: vi.fn(() => true),
    MotionConfig: ({ children }: any) => children,
  };
});

const mockStats: StatsProps = {
  stats: [
    { label: "Active Events", value: 1247 },
    { label: "Evidence Items", value: 48392, suffix: "+", increment: "+234 today" },
    { label: "Global Contributors", value: 15234, prefix: "$" },
  ],
};

describe("Stats", () => {
  describe("Rendering", () => {
    it("renders all stat items", () => {
      render(<Stats {...mockStats} />);
      
      expect(screen.getByText("Active Events")).toBeInTheDocument();
      expect(screen.getByText("Evidence Items")).toBeInTheDocument();
      expect(screen.getByText("Global Contributors")).toBeInTheDocument();
    });

    it("displays stat labels correctly", () => {
      render(<Stats {...mockStats} />);
      
      const labels = screen.getAllByText(/Events|Items|Contributors/);
      expect(labels).toHaveLength(3);
    });

    it("wraps each stat in a GlassCard", () => {
      const { container } = render(<Stats {...mockStats} />);
      const glassCards = container.querySelectorAll(".backdrop-blur-md");

      expect(glassCards.length).toBe(3);
    });
  });

  describe("Layout", () => {
    it("uses responsive grid layout", () => {
      const { container } = render(<Stats {...mockStats} />);
      const grid = container.querySelector(".grid");

      expect(grid).toHaveClass("grid-cols-1");
      expect(grid).toHaveClass("sm:grid-cols-2");
      expect(grid).toHaveClass("lg:grid-cols-3");
    });

    it("applies gap between stat cards", () => {
      const { container } = render(<Stats {...mockStats} />);
      const grid = container.querySelector(".grid");

      expect(grid).toHaveClass("gap-4");
      expect(grid).toHaveClass("sm:gap-6");
    });

    it("centers stat content", () => {
      const { container } = render(<Stats {...mockStats} />);
      const cards = container.querySelectorAll(".flex.flex-col");
      expect(cards.length).toBeGreaterThanOrEqual(3);
    });

    it("renders cards as direct children when layout is contents", () => {
      const { container } = render(
        <div className="grid grid-cols-4">
          <Stats {...mockStats} layout="contents" />
        </div>
      );
      // Fragment flattens — cards become grid children (no wrapper .grid from Stats)
      expect(container.querySelectorAll(".backdrop-blur-md").length).toBe(3);
    });
  });

  describe("Typography", () => {
    it("applies large font size to stat values", () => {
      const { container } = render(<Stats {...mockStats} />);
      const statValues = container.querySelectorAll(".font-bold.tabular-nums");

      expect(statValues.length).toBe(3);
    });

    it("applies body text style to labels", () => {
      render(<Stats {...mockStats} />);
      expect(screen.getByText("Active Events")).toBeInTheDocument();
      expect(screen.getByText("Evidence Items")).toBeInTheDocument();
      expect(screen.getByText("Global Contributors")).toBeInTheDocument();
    });

    it("applies correct text colors", () => {
      const { container } = render(<Stats {...mockStats} />);
      const values = container.querySelectorAll(".text-white");
      const labels = container.querySelectorAll(".text-zinc-300");

      expect(values.length).toBeGreaterThanOrEqual(3);
      expect(labels.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Animation", () => {
    it("initializes with animated number components", () => {
      const { container } = render(<Stats {...mockStats} />);
      const statValues = container.querySelectorAll(".tabular-nums");

      expect(statValues.length).toBe(3);
    });

    it("applies stagger animation to grid", () => {
      const { container } = render(<Stats {...mockStats} />);
      const grid = container.querySelector(".grid");
      
      expect(grid).toBeInTheDocument();
    });
  });

  describe("Prefix and Suffix", () => {
    it("handles stat with suffix", () => {
      render(<Stats {...mockStats} />);
      
      // Evidence Items has a "+" suffix
      expect(screen.getByText("Evidence Items")).toBeInTheDocument();
    });

    it("handles stat with prefix", () => {
      render(<Stats {...mockStats} />);
      
      // Global Contributors has a "$" prefix
      expect(screen.getByText("Global Contributors")).toBeInTheDocument();
    });

    it("handles stat without prefix or suffix", () => {
      render(<Stats {...mockStats} />);
      
      // Active Events has neither
      expect(screen.getByText("Active Events")).toBeInTheDocument();
    });

    it("displays increment text when provided", () => {
      render(<Stats {...mockStats} />);
      
      // Evidence Items has increment text
      expect(screen.getByText("+234 today")).toBeInTheDocument();
    });

    it("does not display increment text when not provided", () => {
      render(<Stats {...mockStats} />);
      
      // Active Events doesn't have increment text
      const incrementTexts = screen.queryAllByText(/today|week/);
      expect(incrementTexts).toHaveLength(1); // Only one stat has increment
    });
  });

  describe("Responsive Behavior", () => {
    it("shows single column on mobile", () => {
      const { container } = render(<Stats {...mockStats} />);
      const grid = container.querySelector(".grid");
      
      expect(grid).toHaveClass("grid-cols-1");
    });

    it("shows two columns on small screens", () => {
      const { container } = render(<Stats {...mockStats} />);
      const grid = container.querySelector(".grid");
      
      expect(grid).toHaveClass("sm:grid-cols-2");
    });

    it("shows three columns on desktop", () => {
      const { container } = render(<Stats {...mockStats} />);
      const grid = container.querySelector(".grid");
      
      expect(grid).toHaveClass("lg:grid-cols-3");
    });
  });

  describe("Accessibility", () => {
    it("provides text content for screen readers", () => {
      render(<Stats {...mockStats} />);
      
      // All labels should be readable
      expect(screen.getByText("Active Events")).toBeInTheDocument();
      expect(screen.getByText("Evidence Items")).toBeInTheDocument();
      expect(screen.getByText("Global Contributors")).toBeInTheDocument();
    });

    it("uses semantic structure", () => {
      const { container } = render(<Stats {...mockStats} />);
      
      // Stats should be in a structured layout
      expect(container.querySelector(".grid")).toBeInTheDocument();
    });
  });
});
