"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { forwardRef, useState, type MouseEvent } from "react";
import { tapScale } from "@/lib/animations";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "size" | "href"> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  /** When set, renders as a link (preferred for navigation CTAs) */
  href?: string;
}

const variantStyles = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/50",
  secondary:
    "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md",
  ghost:
    "bg-transparent hover:bg-white/10 text-white border border-white/30 hover:border-white/50",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

function ButtonContent({
  Icon,
  iconPosition,
  size,
  children,
}: {
  Icon?: LucideIcon;
  iconPosition: "left" | "right";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
}) {
  return (
    <span className="relative z-10 flex items-center justify-center gap-2">
      {Icon && iconPosition === "left" && (
        <Icon size={iconSizes[size]} className="flex-shrink-0" aria-hidden="true" />
      )}
      {children}
      {Icon && iconPosition === "right" && (
        <Icon size={iconSizes[size]} className="flex-shrink-0" aria-hidden="true" />
      )}
    </span>
  );
}

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
      href,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<
      Array<{ id: number; x: number; y: number }>
    >([]);

    const classes = cn(
      "relative inline-flex overflow-hidden rounded-lg font-medium transition-all duration-300",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background-primary",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    const addRipple = (e: MouseEvent<HTMLElement>) => {
      if (disabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const newRipple = {
        id: Date.now(),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    const rippleLayer = ripples.map((ripple) => (
      <motion.span
        key={ripple.id}
        className="absolute rounded-full bg-white/30 pointer-events-none"
        style={{ left: ripple.x, top: ripple.y, width: 0, height: 0 }}
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
    ));

    // Link-based CTA — real navigation, middle-click, SEO-friendly
    if (href && !disabled) {
      return (
        <Link
          href={href}
          className={classes}
          onClick={(e) => addRipple(e as unknown as MouseEvent<HTMLElement>)}
        >
          <ButtonContent Icon={Icon} iconPosition={iconPosition} size={size}>
            {children}
          </ButtonContent>
          {rippleLayer}
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={classes}
        whileHover={
          !disabled ? { scale: 1.05, transition: { duration: 0.2 } } : undefined
        }
        whileTap={!disabled ? tapScale : undefined}
        onClick={(e) => {
          addRipple(e);
          onClick?.(e);
        }}
        disabled={disabled}
        {...props}
      >
        <ButtonContent Icon={Icon} iconPosition={iconPosition} size={size}>
          {children}
        </ButtonContent>
        {rippleLayer}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
