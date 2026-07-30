"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Menu, X, Search, ClipboardCheck, Eye } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "./button";
import { duration } from "@/lib/animations";

export interface NavbarLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavbarCTA {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface NavbarProps {
  logoSrc?: string;
  logoText?: string;
  links: NavbarLink[];
  ctaButton?: NavbarCTA;
  showSearch?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

/**
 * Floating pill glass navbar — matches referral mockup
 */
export function Navbar({
  logoSrc,
  logoText = "OpenWitness",
  links,
  ctaButton,
  showSearch = true,
  searchPlaceholder = "Search events, places, incidents...",
  className,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("navbar-search")?.focus();
      }
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLinkClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    const href = q
      ? `/events?q=${encodeURIComponent(q)}`
      : "/events";
    window.location.href = href;
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 pointer-events-none",
          className
        )}
      >
        <div className="pointer-events-auto px-3 pt-3 sm:px-4 sm:pt-4 md:px-5 lg:px-6">
          <motion.nav
            aria-label="Main navigation"
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "mx-auto max-w-[1280px] w-full",
              "flex items-center gap-2 sm:gap-3 md:gap-4",
              "h-12 sm:h-14 md:h-[3.75rem]",
              "pl-3.5 sm:pl-4 md:pl-5 pr-1.5 sm:pr-2",
              "rounded-full",
              "border border-white/12",
              "bg-[rgba(18,18,20,0.55)]",
              "backdrop-blur-xl backdrop-saturate-150",
              "shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]"
            )}
          >
            {/* Logo — eye light blue, wordmark white, left */}
            <a
              href="/"
              className="flex items-center gap-2 shrink-0 focus:outline-none focus:ring-2 focus:ring-sky-400/50 rounded-full px-1 py-1"
              aria-label="Home"
            >
              {logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoSrc} alt={logoText} className="h-7 w-auto" />
              ) : (
                <>
                  <Eye
                    className="h-5 w-5 text-sky-400"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span className="text-sm sm:text-[15px] font-semibold tracking-tight text-white">
                    {logoText}
                  </span>
                </>
              )}
            </a>

            {/* Nav links */}
            <div className="hidden md:flex flex-1 items-center justify-center gap-1 lg:gap-2 min-w-0">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "text-[13px] lg:text-sm font-medium text-white/90",
                    "hover:text-white transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-sky-400/40 rounded-full",
                    "px-2.5 lg:px-3.5 py-1.5 whitespace-nowrap"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Search + CTA */}
            <div className="hidden md:flex items-center gap-2 lg:gap-2.5 shrink-0 ml-auto">
              {showSearch && (
                <form
                  onSubmit={handleSearchSubmit}
                  role="search"
                  className={cn(
                    "relative flex items-center h-9",
                    "w-[200px] lg:w-[260px] xl:w-[300px]",
                    "rounded-full",
                    "border border-white/10",
                    "bg-white/[0.07]",
                    "transition-all duration-200",
                    isSearchFocused &&
                      "border-sky-400/35 ring-2 ring-sky-400/15 bg-white/[0.1]"
                  )}
                >
                  <Search
                    className="absolute left-3 h-3.5 w-3.5 text-zinc-400 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="navbar-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder={searchPlaceholder}
                    className={cn(
                      "w-full h-full bg-transparent",
                      "pl-9 pr-14 text-[12px] lg:text-[13px] text-zinc-200",
                      "placeholder:text-zinc-500",
                      "focus:outline-none rounded-full"
                    )}
                    aria-label="Search events, places, incidents"
                  />
                  <kbd
                    className="absolute right-2 inline-flex items-center rounded-md border border-white/10 bg-black/30 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400"
                    aria-hidden="true"
                  >
                    Ctrl K
                  </kbd>
                </form>
              )}

              {ctaButton && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={ClipboardCheck}
                  iconPosition="left"
                  href={ctaButton.href}
                  onClick={
                    ctaButton.onClick
                      ? () => ctaButton.onClick?.()
                      : undefined
                  }
                  className={cn(
                    "whitespace-nowrap shrink-0",
                    "!rounded-xl !h-9 !px-3.5 lg:!px-4",
                    "!bg-[#3B82F6] hover:!bg-[#2563EB]",
                    "!text-[12px] lg:!text-[13px] !font-semibold",
                    "shadow-md shadow-blue-500/25"
                  )}
                >
                  {ctaButton.label}
                </Button>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "md:hidden ml-auto p-2 rounded-full text-white hover:bg-white/10",
                "focus:outline-none focus:ring-2 focus:ring-sky-400",
                "min-w-[44px] min-h-[44px] flex items-center justify-center"
              )}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </motion.nav>
        </div>
      </header>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? "auto" : "none",
        }}
        transition={{ duration: duration.normal }}
        className="fixed inset-0 z-40 md:hidden"
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: isMobileMenuOpen ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0 right-0 bottom-0 w-[280px] bg-zinc-950/95 backdrop-blur-xl border-l border-white/10"
        >
          <div className="flex flex-col h-full pt-20 pb-6 px-5">
            {showSearch && (
              <form
                onSubmit={handleSearchSubmit}
                className="mb-4"
                role="search"
              >
                <div className="relative flex items-center h-11 rounded-full border border-white/10 bg-white/[0.06]">
                  <Search
                    className="absolute left-3 h-4 w-4 text-zinc-500"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full h-full bg-transparent pl-9 pr-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none rounded-full"
                    aria-label="Search events, places, incidents"
                  />
                </div>
              </form>
            )}
            <nav className="flex-1 space-y-1" aria-label="Mobile navigation">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-base font-medium text-zinc-300",
                    "hover:bg-white/10 hover:text-white",
                    "focus:outline-none focus:ring-2 focus:ring-sky-400",
                    "min-h-[44px] flex items-center"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            {ctaButton && (
              <div className="pt-6 border-t border-white/10">
                <Button
                  variant="primary"
                  size="lg"
                  icon={ClipboardCheck}
                  iconPosition="left"
                  href={ctaButton.href}
                  onClick={() => {
                    ctaButton.onClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full !rounded-xl !bg-[#3B82F6]"
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
