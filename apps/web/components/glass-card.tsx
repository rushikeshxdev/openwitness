import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes } from "react";

/**
 * GlassCard — glassmorphism surface with CSS hover effects (no Framer Motion).
 * Prefer CSS for production: lower JS cost, works in Server Components.
 */

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover-lift" | "hover-tilt";
  children: React.ReactNode;
}

const baseStyles =
  "bg-white/6 backdrop-blur-md border border-white/10 rounded-xl transition-[transform,box-shadow,background-color] duration-300 ease-out";

const variantStyles = {
  default: "",
  "hover-lift":
    "hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3),0_10px_10px_-5px_rgba(0,0,0,0.2)] hover:bg-white/[0.08]",
  // Tilt approximated with subtle scale — full 3D tilt reserved for rare interactive surfaces
  "hover-tilt":
    "hover:scale-[1.02] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3),0_10px_10px_-5px_rgba(0,0,0,0.2)]",
} as const;

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ variant = "default", children, className, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          onClick && "cursor-pointer",
          className
        )}
        onClick={onClick}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
