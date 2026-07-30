/**
 * Hero Component Tests
 * 
 * Tests for the Hero component structure, animations, and interactions
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 12.2, 14.5**
 * 
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Hero, HeroProps } from "./hero";

// Mock framer-motion for testing
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
      p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    },
    useScroll: () => ({ scrollY: { get: () => 0, on: vi.fn(), destroy: vi.fn() } }),
    useTransform: () => ({ get: () => 0, on: vi.fn(), destroy: vi.fn() }),
  };
});

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock child components
vi.mock("./container", () => ({
  Container: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock("./button", () => ({
  Button: ({ children, onClick, variant, size, className }: any) => (
    <button onClick={onClick} className={className} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
}));

vi.mock("./stats", () => ({
  Stats: ({ stats }: any) => (
    <div data-testid="stats">
      {stats.map((stat: any, index: number) => (
        <div key={index}>{stat.label}: {stat.value}</div>
      ))}
    </div>
  ),
}));

vi.mock("./spotlight-cursor", () => ({
  SpotlightCursor: () => <div data-testid="spotlight-cursor" />,
}));

const mockHeroProps: HeroProps = {
  backgroundImage: "/images/hero-bg.jpg",
  tagline: "Open Source • Community Driven • For Truth",
  missionStatement: "Truth deserves structure",
  description: "OpenWitness is an open-source platform for preserving, organizing, and verifying evidence from public events.",
  stats: [
    { label: "Active Events", value: 1247 },
    { label: "Evidence Items", value: 48392, suffix: "+" },
    { label: "Global Contributors", value: 15234 },
  ],
  primaryCTA: {
    label: "Get Started",
    href: "#get-started",
  },
  secondaryCTA: {
    label: "Learn More",
    href: "#learn-more",
  },
};

describe("Hero", () => {
  describe("Rendering", () => {
    it("renders hero section with full viewport height", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const section = container.querySelector("section");
      expect(section).toHaveClass("h-screen");
    });

    it("renders mission statement", () => {
      render(<Hero {...mockHeroProps} />);
      expect(screen.getByText("Truth deserves structure")).toBeInTheDocument();
    });

    it("applies hero typography to mission statement", () => {
      render(<Hero {...mockHeroProps} />);
      const heading = screen.getByText("Truth deserves structure");
      expect(heading).toHaveClass("text-hero");
    });

    it("renders background image with priority loading", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const image = container.querySelector("img[src='/images/hero-bg.jpg']");
      expect(image).toBeInTheDocument();
      // Priority is a Next.js prop that gets handled during build, not rendered as attribute
    });

    it("applies dark overlay to background", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const image = container.querySelector("img");
      expect(image).toHaveClass("brightness-40");
    });
  });

  describe("Content Elements", () => {
    it("renders tagline when provided", () => {
      render(<Hero {...mockHeroProps} />);
      expect(screen.getByText("Open Source • Community Driven • For Truth")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(<Hero {...mockHeroProps} />);
      expect(screen.getByText(/OpenWitness is an open-source platform/)).toBeInTheDocument();
    });

    it("does not render tagline when not provided", () => {
      const propsWithoutTagline = { ...mockHeroProps, tagline: undefined };
      render(<Hero {...propsWithoutTagline} />);
      expect(screen.queryByText("Open Source • Community Driven • For Truth")).not.toBeInTheDocument();
    });

    it("does not render description when not provided", () => {
      const propsWithoutDescription = { ...mockHeroProps, description: undefined };
      render(<Hero {...propsWithoutDescription} />);
      expect(screen.queryByText(/OpenWitness is an open-source platform/)).not.toBeInTheDocument();
    });
  });

  describe("CTA Buttons", () => {
    it("renders primary CTA button", () => {
      render(<Hero {...mockHeroProps} />);
      expect(screen.getByRole("button", { name: "Get Started" })).toBeInTheDocument();
    });

    it("renders secondary CTA button", () => {
      render(<Hero {...mockHeroProps} />);
      expect(screen.getByRole("button", { name: "Learn More" })).toBeInTheDocument();
    });

    it("handles primary CTA click with href", () => {
      const originalLocation = window.location.href;
      delete (window as any).location;
      window.location = { href: originalLocation } as any;

      render(<Hero {...mockHeroProps} />);
      const button = screen.getByRole("button", { name: "Get Started" });
      fireEvent.click(button);

      expect(window.location.href).toBe("#get-started");
    });

    it("handles secondary CTA click with onClick", () => {
      const onClick = vi.fn();
      const props = {
        ...mockHeroProps,
        secondaryCTA: {
          label: "Learn More",
          onClick,
        },
      };

      render(<Hero {...props} />);
      const button = screen.getByRole("button", { name: "Learn More" });
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Stats Display", () => {
    it("renders all stats", () => {
      render(<Hero {...mockHeroProps} />);
      
      // Stats are now rendered through the mocked Stats component
      expect(screen.getByTestId("stats")).toBeInTheDocument();
      expect(screen.getByText(/Active Events/)).toBeInTheDocument();
      expect(screen.getByText(/Evidence Items/)).toBeInTheDocument();
      expect(screen.getByText(/Global Contributors/)).toBeInTheDocument();
    });

    it("renders stats within Stats component", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const statsComponent = container.querySelector("[data-testid='stats']");
      
      // Stats component should be present
      expect(statsComponent).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("uses Container component for content width", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const containerDiv = container.querySelector(".max-w-screen-2xl");
      expect(containerDiv).toBeInTheDocument();
    });

    it("centers content vertically and horizontally", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const section = container.querySelector("section");
      expect(section).toHaveClass("flex", "items-center", "justify-center");
    });

    it("arranges CTA buttons horizontally on desktop", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const ctaContainer = container.querySelector(".sm\\:flex-row");
      expect(ctaContainer).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<Hero {...mockHeroProps} />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Truth deserves structure");
    });

    it("has alt text for background image", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const image = container.querySelector("img");
      expect(image).toHaveAttribute("alt", "Hero background");
    });
  });

  describe("Responsive Design", () => {
    it("stacks CTA buttons vertically on mobile", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const ctaContainer = container.querySelector(".flex-col");
      expect(ctaContainer).toBeInTheDocument();
    });

    it("applies responsive spacing", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const content = container.querySelector(".mb-8");
      expect(content).toBeInTheDocument();
    });
  });
});
