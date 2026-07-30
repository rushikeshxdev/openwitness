"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { forwardRef, useState } from "react";
import { tapScale } from "@/lib/animations";

/**
 * Button component with variants and animations
 * Supports primary, secondary, and ghost variants with size options
 * Includes hover animations (scale, glow, color transitions) and click ripple effect
 * 
 * **Validates: Requirements 12.10, 10.1, 10.2**
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * <Button variant="secondary" size="lg" icon={ArrowRight}>
 *   Get Started
 * </Button>
 * ```
 */

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  /** Button style variant */
  variant?: "primary" | "secondary" | "ghost";
  /** Button size */
  size?: "sm" | "md" | "lg";
  /** Optional Lucide icon to display */
  icon?: LucideIcon;
  /** Icon position (default: right) */
  iconPosition?: "left" | "right";
  /** Button content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

// Variant styles
const variantStyles = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/50",
  secondary:
    "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md",
  ghost:
    "bg-transparent hover:bg-white/10 text-white border border-white/30 hover:border-white/50",
};

// Size styles
const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

// Icon size mapping
const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon: Icon,
      iconPosition = "right",
      children,
      className,
      disabled = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<
      Array<{ id: number; x: number; y: number }>
    >([]);

    // Handle click with ripple effect
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      // Calculate ripple position relative to button
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create ripple
      const newRipple = {
        id: Date.now(),
        x,
        y,
      };

      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);

      // Call original onClick
      onClick?.(e);
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-lg font-medium transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        whileHover={
          !disabled
            ? {
                scale: 1.05,
                transition: { duration: 0.2 },
              }
            : undefined
        }
        whileTap={!disabled ? tapScale : undefined}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {Icon && iconPosition === "left" && (
            <Icon size={iconSizes[size]} className="flex-shrink-0" />
          )}
          {children}
          {Icon && iconPosition === "right" && (
            <Icon size={iconSizes[size]} className="flex-shrink-0" />
          )}
        </span>

        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{
              width: 300,
              height: 300,
              opacity: 0,
              x: -150,
              y: -150,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}

        {/* Glow effect on hover (for primary variant) */}
        {variant === "primary" && !disabled && (
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0 blur-xl"
            style={{
              background:
                "radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, transparent 70%)",
            }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
