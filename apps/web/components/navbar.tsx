"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./button";
import { duration, easing } from "@/lib/animations";

/**
 * Navbar component with glassmorphism and scroll-based effects
 * Fixed navigation bar with logo, links, and CTA button
 * Includes responsive mobile menu with slide-in animation
 * 
 * **Validates: Requirements 2.3, 2.5, 2.6, 12.1**
 * 
 * @example
 * ```tsx
 * <Navbar
 *   logoSrc="/logo.svg"
 *   links={[
 *     { label: "Features", href: "#features" },
 *     { label: "About", href: "#about" },
 *   ]}
 *   ctaButton={{ label: "Get Started", onClick: () => {} }}
 * />
 * ```
 */

export interface NavbarLink {
  /** Link display text */
  label: string;
  /** Link href or anchor */
  href: string;
  /** Whether link opens in new tab */
  external?: boolean;
}

export interface NavbarCTA {
  /** CTA button label */
  label: string;
  /** CTA click handler */
  onClick: () => void;
}

interface NavbarProps {
  /** Logo image source */
  logoSrc?: string;
  /** Logo text (used if logoSrc not provided) */
  logoText?: string;
  /** Navigation links */
  links: NavbarLink[];
  /** Optional CTA button */
  ctaButton?: NavbarCTA;
  /** Additional CSS classes */
  className?: string;
}

export function Navbar({
  logoSrc,
  logoText = "OpenWitness",
  links,
  ctaButton,
  className,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for glassmorphism effect
  const { scrollY } = useScroll();
  
  // Transform scroll into background opacity
  const backgroundOpacity = useTransform(scrollY, [0, 50], [0, 0.06]);
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 0.1]);

  // Update isScrolled state
  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          className
        )}
        style={{
          backgroundColor: useTransform(
            backgroundOpacity,
            (val) => `rgba(255, 255, 255, ${val})`
          ),
        }}
      >
        <motion.div
          className="absolute inset-0 transition-all duration-300"
          style={{
            backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
            WebkitBackdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
            borderBottom: `1px solid rgba(255, 255, 255, ${isScrolled ? 0.1 : 0})`,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-2 group"
              aria-label="Home"
            >
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={logoText}
                  className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <span className="text-xl md:text-2xl font-bold text-white transition-all duration-300 group-hover:text-blue-400">
                  {logoText}
                </span>
              )}
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "text-base font-medium text-gray-300 transition-all duration-300",
                    "hover:text-white hover:scale-105",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent rounded-md px-2 py-1"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA Button */}
            {ctaButton && (
              <div className="hidden md:block">
                <Button
                  variant="primary"
                  size="md"
                  onClick={ctaButton.onClick}
                >
                  {ctaButton.label}
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "md:hidden p-2 rounded-lg transition-colors duration-300",
                "text-white hover:bg-white/10",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent",
                // Ensure touch target is at least 44x44px for accessibility
                "min-w-[44px] min-h-[44px] flex items-center justify-center"
              )}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={false}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? "auto" : "none",
        }}
        transition={{ duration: duration.normal }}
        className="fixed inset-0 z-40 md:hidden"
      >
        {/* Backdrop */}
        <motion.div
          initial={false}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
          transition={{ duration: duration.normal }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Mobile Menu Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{
            x: isMobileMenuOpen ? 0 : "100%",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="absolute top-0 right-0 bottom-0 w-[280px] bg-zinc-900/95 backdrop-blur-lg border-l border-white/10 shadow-2xl"
        >
          <div className="flex flex-col h-full pt-20 pb-6 px-6">
            {/* Mobile Navigation Links */}
            <nav className="flex-1 space-y-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  onClick={handleLinkClick}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-base font-medium text-gray-300",
                    "transition-all duration-300",
                    "hover:bg-white/10 hover:text-white",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900",
                    // Ensure touch target is at least 44x44px for accessibility
                    "min-h-[44px] flex items-center"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Mobile CTA Button */}
            {ctaButton && (
              <div className="pt-6 border-t border-white/10">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    ctaButton.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  {ctaButton.label}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
