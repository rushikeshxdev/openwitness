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
      section: ({ children, ...props }: any) => (
        <section {...props}>{children}</section>
      ),
    },
    useInView: () => true,
  };
});

describe("OrganizationCard", () => {
  const mockOrganization = {
    id: "amnesty",
    name: "Amnesty",
    initials: "A",
    accent: "#F59E0B",
    category: "Human Rights Organization",
  };

  it("renders organization name and initials", () => {
    render(<OrganizationCard organization={mockOrganization} />);
    expect(screen.getByText("Amnesty")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("links to organizations page by default", () => {
    render(<OrganizationCard organization={mockOrganization} />);
    const link = screen.getByRole("link", {
      name: /view amnesty on organizations/i,
    });
    expect(link).toHaveAttribute("href", "/organizations");
  });

  it("supports custom href", () => {
    render(
      <OrganizationCard organization={mockOrganization} href="/custom" />
    );
    expect(
      screen.getByRole("link", { name: /view amnesty on organizations/i })
    ).toHaveAttribute("href", "/custom");
  });

  it("applies custom className", () => {
    const { container } = render(
      <OrganizationCard
        organization={mockOrganization}
        className="custom-class"
      />
    );
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });
});

describe("Organizations", () => {
  const mockOrganizations = [
    {
      id: "org-1",
      name: "Organization A",
      initials: "OA",
      accent: "#3B82F6",
    },
    {
      id: "org-2",
      name: "Organization B",
      initials: "OB",
      accent: "#10B981",
    },
    {
      id: "org-3",
      name: "Organization C",
      initials: "OC",
      accent: "#F97316",
    },
  ];

  it("renders section with default title and subtitle", () => {
    render(<Organizations organizations={mockOrganizations} />);
    expect(screen.getByText("Trusted By")).toBeInTheDocument();
    expect(
      screen.getByText(/organizations using openwitness/i)
    ).toBeInTheDocument();
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
    expect(
      screen.getByText("Working together for transparency")
    ).toBeInTheDocument();
  });

  it("renders all organization cards", () => {
    render(<Organizations organizations={mockOrganizations} />);
    expect(screen.getByText("Organization A")).toBeInTheDocument();
    expect(screen.getByText("Organization B")).toBeInTheDocument();
    expect(screen.getByText("Organization C")).toBeInTheDocument();
  });

  it("renders view-all link", () => {
    render(<Organizations organizations={mockOrganizations} />);
    expect(
      screen.getByRole("link", { name: /view all organizations/i })
    ).toHaveAttribute("href", "/organizations");
  });

  it("renders empty state when no organizations provided", () => {
    render(<Organizations organizations={[]} />);
    expect(screen.getByText("No organizations to display")).toBeInTheDocument();
  });

  it("applies responsive grid classes", () => {
    const { container } = render(
      <Organizations organizations={mockOrganizations} />
    );
    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("grid-cols-2");
    expect(grid).toHaveClass("md:grid-cols-3");
    expect(grid).toHaveClass("lg:grid-cols-4");
  });

  it("has proper section accessibility", () => {
    render(<Organizations organizations={mockOrganizations} />);
    const section = screen.getByRole("region");
    expect(section).toHaveAttribute("aria-labelledby", "organizations-title");
  });

  it("applies custom className to section", () => {
    const { container } = render(
      <Organizations
        organizations={mockOrganizations}
        className="custom-section"
      />
    );
    expect(container.querySelector(".custom-section")).toBeInTheDocument();
  });

  it("renders correct number of organization cards", () => {
    render(<Organizations organizations={mockOrganizations} />);
    expect(
      screen.getAllByRole("link", { name: /view .* on organizations/i })
    ).toHaveLength(mockOrganizations.length);
  });
});
