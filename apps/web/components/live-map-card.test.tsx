/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LiveMapCard } from "./live-map-card";

describe("LiveMapCard", () => {
  it("renders with default props", () => {
    render(<LiveMapCard />);
    
    expect(screen.getByText("Live Map")).toBeInTheDocument();
    expect(screen.getByText("See events happening around the world")).toBeInTheDocument();
    expect(screen.getByText("View Map")).toBeInTheDocument();
  });

  it("renders with custom href", () => {
    render(<LiveMapCard href="/custom-map" />);
    
    const link = screen.getByText("Live Map").closest("a");
    expect(link).toHaveAttribute("href", "/custom-map");
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<LiveMapCard onClick={handleClick} />);
    
    const card = screen.getByText("Live Map").closest("div");
    card?.click();
    
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("displays globe icon", () => {
    const { container } = render(<LiveMapCard />);
    
    // Check for the SVG icon element
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("displays arrow right icon", () => {
    const { container } = render(<LiveMapCard />);
    
    // Check for multiple SVG elements (Globe and ArrowRight)
    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThanOrEqual(2);
  });
});
