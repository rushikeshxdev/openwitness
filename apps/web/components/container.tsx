import { cn } from "@/lib/utils";

/**
 * Container component for consistent content width and padding across sections
 * Provides size variants (sm, md, lg, xl) with responsive padding
 * 
 * @example
 * ```tsx
 * <Container size="lg">
 *   <h1>Content goes here</h1>
 * </Container>
 * ```
 */

interface ContainerProps {
  /** Content to be rendered inside the container */
  children: React.ReactNode;
  /** Container max-width variant: sm (max-w-4xl), md (max-w-6xl), lg (max-w-7xl), xl (max-w-screen-2xl) */
  size?: "sm" | "md" | "lg" | "xl";
  /** Additional CSS classes to merge with container styles */
  className?: string;
}

const sizeClasses = {
  sm: "max-w-4xl",
  md: "max-w-6xl",
  lg: "max-w-7xl",
  xl: "max-w-screen-2xl",
};

export function Container({ children, size = "md", className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-6 md:px-8 lg:px-12",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
