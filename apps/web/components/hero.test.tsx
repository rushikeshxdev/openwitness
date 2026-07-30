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

vi.mock("next/image", () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

vi.mock("./container", () => ({
  Container: ({ children, className }: any) => (
    <div className={`max-w-screen-2xl ${className}`}>{children}</div>
  ),
}));

vi.mock("./button", () => ({
  Button: ({ children, onClick, variant, size, className, href }: any) =>
    href ? (
      <a href={href} className={className} data-variant={variant} data-size={size}>
        {children}
      </a>
    ) : (
      <button onClick={onClick} className={className} data-variant={variant} data-size={size}>
        {children}
      </button>
    ),
}));

vi.mock("./stats", () => ({
  Stats: ({ stats }: any) => (
    <div data-testid="stats">
      {stats.map((stat: any, index: number) => (
        <div key={index}>
          {stat.label}: {stat.value}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("./spotlight-cursor", () => ({
  SpotlightCursor: () => <div data-testid="spotlight-cursor" />,
}));

const mockHeroProps: HeroProps = {
  backgroundImage: "/images/hero-bg.png",
  tags: ["Open Source", "Community Driven", "For Truth"],
  tagline: "Document. Preserve. Organize. Verify.",
  missionStatement: "Truth deserves structure.",
  description:
    "OpenWitness is an open-source platform for preserving, organizing, and verifying evidence from public events.",
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
      expect(section).toHaveClass("min-h-[100svh]");
    });

    it("renders mission statement", () => {
      render(<Hero {...mockHeroProps} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Truth deserves structure."
      );
    });

    it("applies hero typography to mission statement", () => {
      render(<Hero {...mockHeroProps} />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("font-bold");
    });

    it("renders background image with priority loading", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const image = container.querySelector("img[src='/images/hero-bg.png']");
      expect(image).toBeInTheDocument();
    });

    it("applies brightness treatment to background", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const image = container.querySelector("img");
      expect(image?.className).toMatch(/brightness/);
    });
  });

  describe("Content Elements", () => {
    it("renders tag pills", () => {
      render(<Hero {...mockHeroProps} />);
      expect(
        screen.getByText("Open Source • Community Driven • For Truth")
      ).toBeInTheDocument();
    });

    it("renders tagline when provided", () => {
      render(<Hero {...mockHeroProps} />);
      expect(
        screen.getByText("Document. Preserve. Organize. Verify.")
      ).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(<Hero {...mockHeroProps} />);
      expect(
        screen.getByText(/OpenWitness is an open-source platform/)
      ).toBeInTheDocument();
    });

    it("does not render tagline when not provided", () => {
      const propsWithoutTagline = { ...mockHeroProps, tagline: undefined };
      render(<Hero {...propsWithoutTagline} />);
      expect(
        screen.queryByText("Document. Preserve. Organize. Verify.")
      ).not.toBeInTheDocument();
    });

    it("does not render description when not provided", () => {
      const propsWithoutDescription = { ...mockHeroProps, description: undefined };
      render(<Hero {...propsWithoutDescription} />);
      expect(
        screen.queryByText(/OpenWitness is an open-source platform/)
      ).not.toBeInTheDocument();
    });
  });

  describe("CTA Buttons", () => {
    it("renders primary CTA as a link when href is provided", () => {
      render(<Hero {...mockHeroProps} />);
      expect(screen.getByRole("link", { name: "Get Started" })).toHaveAttribute(
        "href",
        "#get-started"
      );
    });

    it("renders secondary CTA as a link when href is provided", () => {
      render(<Hero {...mockHeroProps} />);
      expect(screen.getByRole("link", { name: "Learn More" })).toHaveAttribute(
        "href",
        "#learn-more"
      );
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

      expect(screen.getByTestId("stats")).toBeInTheDocument();
      expect(screen.getByText(/Active Events/)).toBeInTheDocument();
      expect(screen.getByText(/Evidence Items/)).toBeInTheDocument();
      expect(screen.getByText(/Global Contributors/)).toBeInTheDocument();
    });

    it("renders stats within Stats component", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const statsComponent = container.querySelector("[data-testid='stats']");
      expect(statsComponent).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("uses left-aligned content column matching nav edge", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const column = container.querySelector(".max-w-\\[1440px\\]");
      expect(column).toBeInTheDocument();
    });

    it("aligns content vertically", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const section = container.querySelector("section");
      expect(section).toHaveClass("flex");
      expect(section?.className).toMatch(/items-center|items-start/);
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
      expect(heading).toHaveTextContent("Truth deserves structure.");
    });

    it("has alt text for background image", () => {
      const { container } = render(<Hero {...mockHeroProps} />);
      const image = container.querySelector("img");
      expect(image).toHaveAttribute(
        "alt",
        "Public demonstration with citizens documenting the event"
      );
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
