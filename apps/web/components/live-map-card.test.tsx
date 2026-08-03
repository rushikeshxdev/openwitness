/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LiveMapCard } from "./live-map-card";

describe("LiveMapCard", () => {
  it("renders with default props", () => {
    render(<LiveMapCard />);

    expect(screen.getByText("Live Map")).toBeInTheDocument();
    expect(
      screen.getByText("See events happening around the world")
    ).toBeInTheDocument();
    expect(screen.getByText("View Map")).toBeInTheDocument();
  });

  it("renders as a link to the map section by default", () => {
    render(<LiveMapCard />);
    expect(
      screen.getByRole("link", {
        name: /view live map of events around the world/i,
      })
    ).toHaveAttribute("href", "#map");
  });

  it("renders with custom href", () => {
    render(<LiveMapCard href="/custom-map" />);
    expect(
      screen.getByRole("link", {
        name: /view live map of events around the world/i,
      })
    ).toHaveAttribute("href", "/custom-map");
  });

  it("shows map preview region", () => {
    render(<LiveMapCard />);
    const preview =
      screen.queryByLabelText("Live map preview") ??
      screen.queryByText("Loading map…");
    expect(preview).toBeTruthy();
  });

  it("displays arrow icon alongside map", () => {
    const { container } = render(<LiveMapCard />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
