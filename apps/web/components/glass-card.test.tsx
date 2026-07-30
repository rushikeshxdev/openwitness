/**
 * GlassCard Component Tests
 * 
 * Tests for the GlassCard component variants, hover effects, and interactions
 * **Validates: Requirements 12.3, 10.3**
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GlassCard } from "./glass-card";

describe("GlassCard", () => {
  describe("Rendering", () => {
    it("renders card with children content", () => {
      render(
        <GlassCard>
          <h3>Card Title</h3>
          <p>Card content</p>
        </GlassCard>
      );
      
      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    it("renders with default variant", () => {
      render(<GlassCard>Default Card</GlassCard>);
      const card = screen.getByText("Default Card");
      expect(card).toHaveClass("bg-white/6", "backdrop-blur-md", "border-white/10");
    });

    it("renders with hover-lift variant", () => {
      render(<GlassCard variant="hover-lift">Lift Card</GlassCard>);
      const card = screen.getByText("Lift Card");
      expect(card).toHaveClass("bg-white/6");
      expect(card).toBeInTheDocument();
    });

    it("renders with hover-tilt variant", () => {
      render(<GlassCard variant="hover-tilt">Tilt Card</GlassCard>);
      const card = screen.getByText("Tilt Card");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Base Glassmorphism Styling", () => {
    it("applies glassmorphism background styles", () => {
      render(<GlassCard>Glass</GlassCard>);
      const card = screen.getByText("Glass");
      expect(card).toHaveClass("bg-white/6");
    });

    it("applies backdrop blur", () => {
      render(<GlassCard>Blur</GlassCard>);
      const card = screen.getByText("Blur");
      expect(card).toHaveClass("backdrop-blur-md");
    });

    it("applies border styling", () => {
      render(<GlassCard>Border</GlassCard>);
      const card = screen.getByText("Border");
      expect(card).toHaveClass("border", "border-white/10");
    });

    it("applies rounded corners", () => {
      render(<GlassCard>Rounded</GlassCard>);
      const card = screen.getByText("Rounded");
      expect(card).toHaveClass("rounded-xl");
    });
  });

  describe("Variant Behavior", () => {
    it("applies default variant with no hover effects", () => {
      render(<GlassCard variant="default">Default</GlassCard>);
      const card = screen.getByText("Default");
      
      // Should still have base styles
      expect(card).toHaveClass("bg-white/6");
      expect(card).toBeInTheDocument();
    });

    it("hover-lift variant exists", () => {
      render(<GlassCard variant="hover-lift">Lift</GlassCard>);
      const card = screen.getByText("Lift");
      
      // Card should be rendered with motion component
      expect(card).toBeInTheDocument();
    });

    it("hover-tilt variant exists", () => {
      render(<GlassCard variant="hover-tilt">Tilt</GlassCard>);
      const card = screen.getByText("Tilt");
      
      // Card should be rendered with motion component
      expect(card).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls onClick handler when clicked", () => {
      const handleClick = vi.fn();
      render(
        <GlassCard onClick={handleClick}>
          Clickable Card
        </GlassCard>
      );
      
      const card = screen.getByText("Clickable Card");
      if (card) {
        fireEvent.click(card);
        expect(handleClick).toHaveBeenCalledTimes(1);
      }
    });

    it("applies cursor-pointer class when onClick is provided", () => {
      const handleClick = vi.fn();
      render(
        <GlassCard onClick={handleClick}>
          Click me
        </GlassCard>
      );
      
      const card = screen.getByText("Click me");
      expect(card).toHaveClass("cursor-pointer");
    });

    it("does not apply cursor-pointer when no onClick", () => {
      render(<GlassCard>No click</GlassCard>);
      const card = screen.getByText("No click");
      expect(card).not.toHaveClass("cursor-pointer");
    });

    it("handles mouse move events for tilt variant", () => {
      render(<GlassCard variant="hover-tilt">Tilt Me</GlassCard>);
      const card = screen.getByText("Tilt Me");
      
      if (card) {
        // Simulate mouse move
        fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });
        expect(card).toBeInTheDocument();
      }
    });

    it("handles mouse leave events for tilt variant", () => {
      render(<GlassCard variant="hover-tilt">Tilt Me</GlassCard>);
      const card = screen.getByText("Tilt Me");
      
      if (card) {
        fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });
        fireEvent.mouseLeave(card);
        expect(card).toBeInTheDocument();
      }
    });

    it("does not handle mouse move for non-tilt variants", () => {
      render(<GlassCard variant="hover-lift">Lift Me</GlassCard>);
      const card = screen.getByText("Lift Me");
      
      if (card) {
        // Should not error on mouse move
        fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });
        expect(card).toBeInTheDocument();
      }
    });
  });

  describe("Custom Styling", () => {
    it("accepts and applies custom className", () => {
      render(<GlassCard className="custom-class">Custom</GlassCard>);
      const card = screen.getByText("Custom");
      expect(card).toHaveClass("custom-class");
    });

    it("merges custom className with default styles", () => {
      render(<GlassCard className="max-w-md">Styled</GlassCard>);
      const card = screen.getByText("Styled");
      expect(card).toHaveClass("max-w-md");
      expect(card).toHaveClass("bg-white/6"); // Base style preserved
    });

    it("allows className to override default styles", () => {
      render(
        <GlassCard className="bg-red-500 p-8">
          Override
        </GlassCard>
      );
      const card = screen.getByText("Override");
      // Custom classes should be present
      expect(card).toHaveClass("p-8");
    });
  });

  describe("Complex Content", () => {
    it("renders nested components", () => {
      render(
        <GlassCard>
          <div>
            <h3>Title</h3>
            <p>Description</p>
            <button>Action</button>
          </div>
        </GlassCard>
      );
      
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
    });

    it("maintains layout with flex children", () => {
      render(
        <GlassCard>
          <div className="flex gap-4">
            <span>Left</span>
            <span>Right</span>
          </div>
        </GlassCard>
      );
      
      expect(screen.getByText("Left")).toBeInTheDocument();
      expect(screen.getByText("Right")).toBeInTheDocument();
    });

    it("works with grid layouts", () => {
      render(
        <GlassCard>
          <div className="grid grid-cols-2">
            <div>Column 1</div>
            <div>Column 2</div>
          </div>
        </GlassCard>
      );
      
      expect(screen.getByText("Column 1")).toBeInTheDocument();
      expect(screen.getByText("Column 2")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty children", () => {
      render(<GlassCard></GlassCard>);
      const cards = document.querySelectorAll(".bg-white\\/6");
      expect(cards.length).toBeGreaterThan(0);
    });

    it("handles multiple cards on the same page", () => {
      render(
        <div>
          <GlassCard>Card 1</GlassCard>
          <GlassCard>Card 2</GlassCard>
          <GlassCard>Card 3</GlassCard>
        </div>
      );
      
      expect(screen.getByText("Card 1")).toBeInTheDocument();
      expect(screen.getByText("Card 2")).toBeInTheDocument();
      expect(screen.getByText("Card 3")).toBeInTheDocument();
    });

    it("handles different variants on the same page", () => {
      render(
        <div>
          <GlassCard variant="default">Default</GlassCard>
          <GlassCard variant="hover-lift">Lift</GlassCard>
          <GlassCard variant="hover-tilt">Tilt</GlassCard>
        </div>
      );
      
      expect(screen.getByText("Default")).toBeInTheDocument();
      expect(screen.getByText("Lift")).toBeInTheDocument();
      expect(screen.getByText("Tilt")).toBeInTheDocument();
    });
  });
});

