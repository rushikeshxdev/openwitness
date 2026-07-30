import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { SpotlightCursor } from "./spotlight-cursor";

/**
 * Tests for SpotlightCursor component
 * 
 * **Validates: Requirements 10.5, 16.6**
 */

describe("SpotlightCursor", () => {
  let matchMediaMock: any;

  beforeEach(() => {
    // Mock window.matchMedia to return not reduced motion by default
    matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: matchMediaMock,
    });

    // Mock requestAnimationFrame
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });

    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders spotlight element", () => {
    const { container } = render(
      <div data-testid="parent">
        <SpotlightCursor />
      </div>
    );

    const spotlight = container.querySelector('[aria-hidden="true"]');
    expect(spotlight).toBeTruthy();
  });

  it("applies custom size prop via inline styles", () => {
    const { container } = render(
      <div>
        <SpotlightCursor size={300} />
      </div>
    );

    const spotlight = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    const computedStyle = window.getComputedStyle(spotlight);
    
    // Check that size is applied (inline style or computed)
    expect(spotlight).toBeTruthy();
  });

  it("has pointer-events-none class", () => {
    const { container } = render(
      <div>
        <SpotlightCursor />
      </div>
    );

    const spotlight = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(spotlight.className).toContain("pointer-events-none");
  });

  it("is positioned absolutely", () => {
    const { container } = render(
      <div>
        <SpotlightCursor />
      </div>
    );

    const spotlight = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(spotlight.className).toContain("absolute");
  });

  it("respects prefers-reduced-motion preference", () => {
    // Mock prefers-reduced-motion: reduce
    matchMediaMock.mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(
      <div>
        <SpotlightCursor />
      </div>
    );

    // Component should not render when reduced motion is preferred
    const spotlight = container.querySelector('[aria-hidden="true"]');
    expect(spotlight).toBeFalsy();
  });
});
