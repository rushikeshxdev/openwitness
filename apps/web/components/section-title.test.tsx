/**
 * Unit tests for SectionTitle component
 * Tests rendering, alignment, subtitle, and gradient text functionality
 * 
 * **Validates: Requirements 12.12**
 */

import { render, screen } from "@testing-library/react";
import { SectionTitle } from "./section-title";

describe("SectionTitle", () => {
  it("renders title text correctly", () => {
    render(<SectionTitle title="Test Title" />);
    
    const title = screen.getByRole("heading", { name: "Test Title" });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("text-section");
  });

  it("renders subtitle when provided", () => {
    render(<SectionTitle title="Main Title" subtitle="Subtitle text" />);
    
    const subtitle = screen.getByText("Subtitle text");
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveClass("text-body", "text-gray-400");
  });

  it("does not render subtitle when not provided", () => {
    const { container } = render(<SectionTitle title="Main Title" />);
    
    const subtitle = container.querySelector("p");
    expect(subtitle).not.toBeInTheDocument();
  });

  it("applies left alignment by default", () => {
    const { container } = render(<SectionTitle title="Test Title" />);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("text-left");
  });

  it("applies center alignment when specified", () => {
    const { container } = render(
      <SectionTitle title="Test Title" alignment="center" />
    );
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("text-center");
  });

  it("applies right alignment when specified", () => {
    const { container } = render(
      <SectionTitle title="Test Title" alignment="right" />
    );
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("text-right");
  });

  it("applies gradient text effect when gradientText is true", () => {
    render(<SectionTitle title="Gradient Title" gradientText={true} />);
    
    const title = screen.getByRole("heading", { name: "Gradient Title" });
    expect(title).toHaveClass(
      "bg-gradient-to-r",
      "from-blue-400",
      "via-blue-500",
      "to-cyan-400",
      "bg-clip-text",
      "text-transparent"
    );
  });

  it("does not apply gradient text effect by default", () => {
    render(<SectionTitle title="Normal Title" />);
    
    const title = screen.getByRole("heading", { name: "Normal Title" });
    expect(title).not.toHaveClass("bg-gradient-to-r");
  });

  it("applies custom className when provided", () => {
    const { container } = render(
      <SectionTitle title="Test Title" className="custom-class" />
    );
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("renders both title and subtitle with correct hierarchy", () => {
    render(
      <SectionTitle
        title="Main Heading"
        subtitle="Supporting description"
        alignment="center"
      />
    );
    
    const title = screen.getByRole("heading", { name: "Main Heading" });
    const subtitle = screen.getByText("Supporting description");
    
    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
    
    // Verify subtitle has margin-top for spacing
    expect(subtitle).toHaveClass("mt-3");
  });
});
