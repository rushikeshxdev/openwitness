import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";
import { Github, Twitter, Linkedin } from "lucide-react";
import { describe, it, expect } from "vitest";

/**
 * Test suite for Footer component
 * Validates structure, content, links, and accessibility
 * 
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6**
 */

describe("Footer", () => {
  const mockLinkColumns = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ];

  const mockSocialLinks = [
    { platform: "GitHub", url: "https://github.com/test", icon: Github },
    { platform: "Twitter", url: "https://twitter.com/test", icon: Twitter },
    { platform: "LinkedIn", url: "https://linkedin.com/test", icon: Linkedin },
  ];

  const mockCopyright = "© 2024 OpenWitness. All rights reserved.";

  it("renders the footer with brand name", () => {
    render(
      <Footer
        linkColumns={mockLinkColumns}
        socialLinks={mockSocialLinks}
        copyright={mockCopyright}
      />
    );

    expect(screen.getByText("OpenWitness")).toBeInTheDocument();
  });

  it("renders the brand description", () => {
    render(
      <Footer
        linkColumns={mockLinkColumns}
        socialLinks={mockSocialLinks}
        copyright={mockCopyright}
      />
    );

    expect(
      screen.getByText(/Preserving truth through structured evidence/i)
    ).toBeInTheDocument();
  });

  it("renders all link columns with correct titles", () => {
    render(
      <Footer
        linkColumns={mockLinkColumns}
        socialLinks={mockSocialLinks}
        copyright={mockCopyright}
      />
    );

    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(
      <Footer
        linkColumns={mockLinkColumns}
        socialLinks={mockSocialLinks}
        copyright={mockCopyright}
      />
    );

    // Check all links are present
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("renders correct href attributes for navigation links", () => {
    render(
      <Footer
        linkColumns={mockLinkColumns}
        socialLinks={mockSocialLinks}
        copyright={mockCopyright}
      />
    );

    const featuresLink = screen.getByText("Features").closest("a");
    const aboutLink = screen.getByText("About").closest("a");

    expect(featuresLink).toHaveAttribute("href", "/features");
    expect(aboutLink).toHaveAttribute("href", "/about");
  });

  it("renders all social media links with icons", () => {
    render(
      <Footer
        linkColumns={mockLinkColumns}
        socialLinks={mockSocialLinks}
        copyright={mockCopyright}
      />
    );

    // Check social links have correct aria-labels
    expect(screen.getByLabelText("Visit our GitHub")).toBeInTheDocument();
    expect(screen.getByLabelText("Visit our Twitter")).toBeInTheDocument();
    expect(screen.getByLabelText("Visit our LinkedIn")).toBeInTheDocument();
  });

  it("social links have correct href and target attributes", () => {
    render(
      <Footer
        linkColumns={mockLinkColumns}
        socialLinks={mockSocialLinks}
        copyright={mockCopyright}
      />
    );

    const githubLink = screen.getByLabelText("Visit our GitHub");
    expect(githubLink).toHaveAttribute("href", "https://github.com/test");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders copyright text", () => {
    render(
      <Footer
        linkColumns={mockLinkColumns}
        socialLinks={mockSocialLinks}
        copyright={mockCopyright}
      />
    );

    expect(
      screen.getByText("© 2024 OpenWitness. All rights reserved.")
    ).toBeInTheDocument();
  });

  it("renders without social links when array is empty", () => {
    render(
      <Footer
        linkColumns={mockLinkColumns}
        socialLinks={[]}
        copyright={mockCopyright}
      />
    );

    // Should not throw error and should still render other content
    expect(screen.getByText("OpenWitness")).toBeInTheDocument();
    expect(screen.getByText(mockCopyright)).toBeInTheDocument();
  });

  it("applies responsive grid classes for multi-column layout", () => {
    const { container } = render(
      <Footer
        linkColumns={mockLinkColumns}
        socialLinks={mockSocialLinks}
        copyright={mockCopyright}
      />
    );

    const gridElement = container.querySelector(".grid");
    expect(gridElement).toHaveClass("grid-cols-2");
    expect(gridElement).toHaveClass("md:grid-cols-3");
    expect(gridElement).toHaveClass("lg:grid-cols-5");
  });

  it("has proper padding classes for generous whitespace", () => {
    const { container } = render(
      <Footer
        linkColumns={mockLinkColumns}
        socialLinks={mockSocialLinks}
        copyright={mockCopyright}
      />
    );

    const footerContent = container.querySelector(".py-24");
    expect(footerContent).toBeInTheDocument();
    expect(footerContent).toHaveClass("lg:py-32");
  });

  it("renders with semantic footer element", () => {
    const { container } = render(
      <Footer
        linkColumns={mockLinkColumns}
        socialLinks={mockSocialLinks}
        copyright={mockCopyright}
      />
    );

    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });
});
