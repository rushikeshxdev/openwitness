/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Organizations } from "./organizations";
import { OrganizationCard } from "./organization-card";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    },
    useInView: () => true,
  };
});

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("OrganizationCard", () => {
  const mockOrganization = {
    id: "org-1",
    name: "Test Organization",
    logoUrl: "/logos/test.png",
    website: "https://test.org",
  };

  it("renders organization logo with alt text", () => {
    render(<OrganizationCard organization={mockOrganization} />);
    
    const logo = screen.getByAltText("Test Organization logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logos/test.png");
  });

  it("renders as a link when website is provided", () => {
    render(<OrganizationCard organization={mockOrganization} />);
    
    const link = screen.getByRole("link", { name: /visit test organization website/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://test.org");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders without link when website is not provided", () => {
    const orgWithoutWebsite = { ...mockOrganization, website: undefined };
    render(<OrganizationCard organization={orgWithoutWebsite} />);
    
    const link = screen.queryByRole("link");
    expect(link).not.toBeInTheDocument();
  });

  it("applies grayscale filter to logo", () => {
    render(<OrganizationCard organization={mockOrganization} />);
    
    const logo = screen.getByAltText("Test Organization logo");
    expect(logo).toHaveClass("grayscale");
  });

  it("applies custom className", () => {
    const { container } = render(
      <OrganizationCard organization={mockOrganization} className="custom-class" />
    );
    
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<OrganizationCard organization={mockOrganization} />);
    
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", "Visit Test Organization website");
  });
});

describe("Organizations", () => {
  const mockOrganizations = [
    {
      id: "org-1",
      name: "Organization A",
      logoUrl: "/logos/a.png",
      website: "https://a.org",
    },
    {
      id: "org-2",
      name: "Organization B",
      logoUrl: "/logos/b.png",
      website: "https://b.org",
    },
    {
      id: "org-3",
      name: "Organization C",
      logoUrl: "/logos/c.png",
    },
  ];

  it("renders section with default title and subtitle", () => {
    render(<Organizations organizations={mockOrganizations} />);
    
    expect(screen.getByText("Trusted By")).toBeInTheDocument();
    expect(screen.getByText(/organizations using openwitness/i)).toBeInTheDocument();
  });

  it("renders custom title and subtitle", () => {
    render(
      <Organizations
        organizations={mockOrganizations}
        title="Our Partners"
        subtitle="Working together for transparency"
      />
    );
    
    expect(screen.getByText("Our Partners")).toBeInTheDocument();
    expect(screen.getByText("Working together for transparency")).toBeInTheDocument();
  });

  it("renders all organization cards", () => {
    render(<Organizations organizations={mockOrganizations} />);
    
    expect(screen.getByAltText("Organization A logo")).toBeInTheDocument();
    expect(screen.getByAltText("Organization B logo")).toBeInTheDocument();
    expect(screen.getByAltText("Organization C logo")).toBeInTheDocument();
  });

  it("renders empty state when no organizations provided", () => {
    render(<Organizations organizations={[]} />);
    
    expect(screen.getByText("No organizations to display")).toBeInTheDocument();
  });

  it("applies responsive grid classes", () => {
    const { container } = render(<Organizations organizations={mockOrganizations} />);
    
    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("grid-cols-2");
    expect(grid).toHaveClass("md:grid-cols-3");
    expect(grid).toHaveClass("lg:grid-cols-6");
  });

  it("has proper section accessibility", () => {
    render(<Organizations organizations={mockOrganizations} />);
    
    const section = screen.getByRole("region");
    expect(section).toHaveAttribute("aria-labelledby", "organizations-title");
  });

  it("applies custom className to section", () => {
    const { container } = render(
      <Organizations organizations={mockOrganizations} className="custom-section" />
    );
    
    expect(container.querySelector(".custom-section")).toBeInTheDocument();
  });

  it("renders correct number of organization cards", () => {
    render(<Organizations organizations={mockOrganizations} />);
    
    const logos = screen.getAllByAltText(/logo/i);
    expect(logos).toHaveLength(mockOrganizations.length);
  });

  it("handles large number of organizations", () => {
    const manyOrganizations = Array.from({ length: 20 }, (_, i) => ({
      id: `org-${i}`,
      name: `Organization ${i}`,
      logoUrl: `/logos/${i}.png`,
    }));
    
    render(<Organizations organizations={manyOrganizations} />);
    
    const logos = screen.getAllByAltText(/logo/i);
    expect(logos).toHaveLength(20);
  });

  it("maintains grid structure with odd number of items", () => {
    const oddOrganizations = mockOrganizations.slice(0, 3);
    const { container } = render(<Organizations organizations={oddOrganizations} />);
    
    const grid = container.querySelector(".grid");
    expect(grid?.children).toHaveLength(3);
  });
});
