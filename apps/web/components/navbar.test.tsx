import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Navbar, NavbarLink, NavbarCTA } from "./navbar";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Navbar", () => {
  const mockLinks: NavbarLink[] = [
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const mockCTA: NavbarCTA = {
    label: "Get Started",
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render the navbar with logo text", () => {
      render(<Navbar logoText="TestLogo" links={mockLinks} />);
      expect(screen.getByText("TestLogo")).toBeInTheDocument();
    });

    it("should render the navbar with logo image when logoSrc is provided", () => {
      render(
        <Navbar logoSrc="/logo.svg" logoText="TestLogo" links={mockLinks} />
      );
      const logo = screen.getByAltText("TestLogo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "/logo.svg");
    });

    it("should render all navigation links", () => {
      render(<Navbar links={mockLinks} />);
      mockLinks.forEach((link) => {
        const linkElements = screen.getAllByText(link.label);
        // Each link appears twice: once in desktop nav, once in mobile nav
        expect(linkElements.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("should render CTA button when provided", () => {
      render(<Navbar links={mockLinks} ctaButton={mockCTA} />);
      const ctaButtons = screen.getAllByText("Get Started");
      // CTA appears in both desktop and mobile views
      expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Navigation Links", () => {
    it("should render links with correct href attributes", () => {
      render(<Navbar links={mockLinks} />);
      mockLinks.forEach((link) => {
        const linkElements = screen.getAllByRole("link", { name: link.label });
        expect(linkElements[0]).toHaveAttribute("href", link.href);
      });
    });

    it("should render external links with correct attributes", () => {
      const externalLink: NavbarLink = {
        label: "External",
        href: "https://example.com",
        external: true,
      };
      render(<Navbar links={[externalLink]} />);
      const linkElements = screen.getAllByRole("link", { name: "External" });
      expect(linkElements[0]).toHaveAttribute("target", "_blank");
      expect(linkElements[0]).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("CTA Button", () => {
    it("should call onClick when CTA button is clicked", () => {
      render(<Navbar links={mockLinks} ctaButton={mockCTA} />);
      const ctaButtons = screen.getAllByText("Get Started");
      fireEvent.click(ctaButtons[0]);
      expect(mockCTA.onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Mobile Menu", () => {
    it("should toggle mobile menu when hamburger button is clicked", () => {
      render(<Navbar links={mockLinks} />);
      const menuButton = screen.getByLabelText("Open menu");
      expect(menuButton).toBeInTheDocument();

      // Click to open
      fireEvent.click(menuButton);
      expect(screen.getByLabelText("Close menu")).toBeInTheDocument();

      // Click to close
      fireEvent.click(screen.getByLabelText("Close menu"));
      expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
    });

    it("should have proper aria attributes on mobile menu button", () => {
      render(<Navbar links={mockLinks} />);
      const menuButton = screen.getByLabelText("Open menu");
      expect(menuButton).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(menuButton);
      const closeButton = screen.getByLabelText("Close menu");
      expect(closeButton).toHaveAttribute("aria-expanded", "true");
    });

    it("should close mobile menu when a link is clicked", async () => {
      render(<Navbar links={mockLinks} />);
      
      // Open mobile menu
      const menuButton = screen.getByLabelText("Open menu");
      fireEvent.click(menuButton);
      expect(screen.getByLabelText("Close menu")).toBeInTheDocument();

      // Find and click a mobile menu link
      const mobileLinks = screen.getAllByText("Features");
      const mobileLink = mobileLinks.find(
        (el) => el.closest(".bg-zinc-900\\/95") !== null
      );
      
      if (mobileLink) {
        fireEvent.click(mobileLink);
        await waitFor(() => {
          expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
        });
      }
    });
  });

  describe("Accessibility", () => {
    it("should have proper focus management for keyboard navigation", () => {
      render(<Navbar links={mockLinks} ctaButton={mockCTA} />);
      
      // Get all focusable elements
      const links = screen.getAllByRole("link");
      const buttons = screen.getAllByRole("button");
      
      // Verify that links have focus styles
      links.forEach((link) => {
        expect(link.className).toContain("focus:outline-none");
        expect(link.className).toContain("focus:ring-2");
      });

      // Verify buttons have focus styles
      buttons.forEach((button) => {
        expect(button.className).toContain("focus:outline-none");
      });
    });

    it("should have touch targets of at least 44x44px on mobile menu button", () => {
      render(<Navbar links={mockLinks} />);
      const menuButton = screen.getByLabelText("Open menu");
      
      // Check that the button has min-width and min-height classes
      expect(menuButton.className).toContain("min-w-[44px]");
      expect(menuButton.className).toContain("min-h-[44px]");
    });

    it("should have touch targets of at least 44px height on mobile links", () => {
      render(<Navbar links={mockLinks} />);
      
      // Open mobile menu
      const menuButton = screen.getByLabelText("Open menu");
      fireEvent.click(menuButton);

      // Check mobile link classes
      const mobileLinks = screen.getAllByText("Features");
      const mobileLink = mobileLinks.find(
        (el) => el.className.includes("min-h-[44px]")
      );
      
      expect(mobileLink).toBeDefined();
    });

    it("should have proper ARIA label on home link", () => {
      render(<Navbar links={mockLinks} />);
      const homeLink = screen.getByLabelText("Home");
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute("href", "/");
    });
  });

  describe("Responsive Behavior", () => {
    it("should render desktop navigation elements", () => {
      render(<Navbar links={mockLinks} ctaButton={mockCTA} />);
      
      // Desktop nav should be present (hidden class at small screens)
      const desktopNavLinks = screen.getAllByText("Features");
      expect(desktopNavLinks.length).toBeGreaterThan(0);
    });

    it("should render mobile menu button", () => {
      render(<Navbar links={mockLinks} />);
      const menuButton = screen.getByLabelText("Open menu");
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should apply custom className when provided", () => {
      const { container } = render(
        <Navbar links={mockLinks} className="custom-class" />
      );
      const nav = container.querySelector("nav");
      expect(nav?.className).toContain("custom-class");
    });

    it("should have fixed positioning", () => {
      const { container } = render(<Navbar links={mockLinks} />);
      const nav = container.querySelector("nav");
      expect(nav?.className).toContain("fixed");
      expect(nav?.className).toContain("top-0");
      expect(nav?.className).toContain("z-50");
    });
  });
});
