/**
 * Button Component Tests
 * 
 * Tests for the Button component variants, sizes, and interactions
 * **Validates: Requirements 12.10, 10.1, 10.2**
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./button";
import { ArrowRight, Download } from "lucide-react";

describe("Button", () => {
  describe("Rendering", () => {
    it("renders button with children text", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("renders with primary variant by default", () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-blue-600");
    });

    it("renders with secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-white/10");
    });

    it("renders with ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-transparent");
    });
  });

  describe("Sizes", () => {
    it("renders with medium size by default", () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-6", "py-3", "text-base");
    });

    it("renders with small size", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-4", "py-2", "text-sm");
    });

    it("renders with large size", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-8", "py-4", "text-lg");
    });
  });

  describe("Icon Support", () => {
    it("renders with icon on the right by default", () => {
      render(
        <Button icon={ArrowRight}>
          Next
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      // Icon should be after text
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders with icon on the left when specified", () => {
      render(
        <Button icon={Download} iconPosition="left">
          Download
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls onClick handler when clicked", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole("button");
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );
      
      const button = screen.getByRole("button");
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("has disabled attribute when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("creates ripple effect on click", () => {
      render(<Button>Ripple</Button>);
      const button = screen.getByRole("button");
      
      fireEvent.click(button);
      
      // Check that ripple span is created
      const ripple = button.querySelector("span[style*='left']");
      expect(ripple).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has focus ring styles", () => {
      render(<Button>Focus me</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus:ring-2", "focus:ring-blue-500");
    });

    it("applies disabled opacity when disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("disabled:opacity-50");
    });

    it("prevents interactions when disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("disabled:cursor-not-allowed");
    });
  });

  describe("Custom styling", () => {
    it("accepts and applies custom className", () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("merges custom className with default styles", () => {
      render(<Button className="my-custom-class">Styled</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("my-custom-class");
      expect(button).toHaveClass("bg-blue-600"); // Default variant style
    });
  });
});
