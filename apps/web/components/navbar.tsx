"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Menu, X, Search, ClipboardCheck, Eye, LogOut, Settings, User, Bell } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "./button";
import { duration } from "@/lib/animations";
import { ReportIncidentGate } from "@/components/auth/report-incident-gate";
import {
  clearMockSession,
  getMockSession,
  type MockSessionUser,
} from "@/lib/auth-session";
import { getInitials } from "@/data/profile-data";
import {
  getUnreadNotificationCount,
  NOTIFICATIONS_CHANGED_EVENT,
} from "@/lib/notifications-store";
import { NOTIFICATIONS_PATH } from "@/data/notifications-data";
import Link from "next/link";
import { SearchModal } from "@/components/search/search-modal";

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
  /** Show avatar menu when a mock session exists */
  showUserMenu?: boolean;
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
  searchPlaceholder = "Search events, evidence, organizations, people...",
  showUserMenu = false,
  className,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [session, setSession] = useState<MockSessionUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showUserMenu) return;
    const s = getMockSession();
    setSession(s);
    setUnreadNotifications(s ? getUnreadNotificationCount() : 0);
  }, [showUserMenu]);

  useEffect(() => {
    if (!showUserMenu || !session) return;
    const sync = () => setUnreadNotifications(getUnreadNotificationCount());
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, sync);
    };
  }, [showUserMenu, session]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const signOut = () => {
    clearMockSession();
    setSession(null);
    setMenuOpen(false);
    setIsMobileMenuOpen(false);
    window.location.href = "/";
  };

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
        if (showSearch) setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        if (searchOpen) {
          setSearchOpen(false);
          window.setTimeout(() => {
            document.getElementById("navbar-search")?.focus();
          }, 0);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSearch, searchOpen]);

  const handleLinkClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    setIsMobileMenuOpen(false);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    window.setTimeout(() => {
      document.getElementById("navbar-search")?.focus();
    }, 0);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openSearch();
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
                    searchOpen &&
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
                    readOnly
                    value=""
                    onMouseDown={(e) => {
                      e.preventDefault();
                      openSearch();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openSearch();
                      }
                    }}
                    placeholder={searchPlaceholder}
                    className={cn(
                      "w-full h-full bg-transparent cursor-pointer",
                      "pl-9 pr-14 text-[12px] lg:text-[13px] text-zinc-200",
                      "placeholder:text-zinc-500",
                      "focus:outline-none rounded-full"
                    )}
                    aria-label="Search events, evidence, organizations, people"
                    aria-haspopup="dialog"
                  />
                  <kbd
                    className="absolute right-2 inline-flex items-center rounded-md border border-white/10 bg-black/30 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400"
                    aria-hidden="true"
                  >
                    Ctrl K
                  </kbd>
                </form>
              )}

              {ctaButton &&
                (ctaButton.href === "/report" ? (
                  <ReportIncidentGate
                    label={ctaButton.label}
                    variant="navbar"
                  />
                ) : (
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
                ))}

              {showUserMenu && session ? (
                <Link
                  href={NOTIFICATIONS_PATH}
                  className="relative hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-300 hover:bg-white/5 hover:text-white"
                  aria-label={
                    unreadNotifications > 0
                      ? `Notifications, ${unreadNotifications} unread`
                      : "Notifications"
                  }
                >
                  <Bell className="h-4 w-4" aria-hidden="true" />
                  {unreadNotifications > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#3B82F6] px-1 text-[10px] font-bold text-white">
                      {unreadNotifications > 99 ? "99+" : unreadNotifications}
                    </span>
                  ) : null}
                </Link>
              ) : null}

              {showUserMenu && session ? (
                <div className="relative hidden md:block" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#3B82F6]/20 text-xs font-bold text-[#93C5FD] hover:bg-[#3B82F6]/30"
                    aria-label="Account menu"
                    aria-expanded={menuOpen}
                  >
                    {getInitials(session.name || session.email)}
                  </button>
                  {menuOpen ? (
                    <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/12 bg-[#121214] py-1 shadow-xl">
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-200 hover:bg-white/5"
                      >
                        <User className="h-4 w-4" aria-hidden="true" />
                        Profile
                      </Link>
                      <Link
                        href={NOTIFICATIONS_PATH}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-200 hover:bg-white/5"
                      >
                        <Bell className="h-4 w-4" aria-hidden="true" />
                        Notifications
                        {unreadNotifications > 0 ? (
                          <span className="ml-auto rounded-full bg-[#3B82F6] px-1.5 py-0.5 text-[10px] font-bold text-white">
                            {unreadNotifications}
                          </span>
                        ) : null}
                      </Link>
                      <Link
                        href="/profile/settings"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-200 hover:bg-white/5"
                      >
                        <Settings className="h-4 w-4" aria-hidden="true" />
                        Settings
                      </Link>
                      <button
                        type="button"
                        onClick={signOut}
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-zinc-200 hover:bg-white/5"
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        Sign out
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : showUserMenu ? (
                <Link
                  href="/login?next=/profile"
                  className="hidden md:inline-flex h-9 items-center rounded-xl border border-white/15 px-3 text-xs font-medium text-zinc-200 hover:bg-white/5"
                >
                  Sign in
                </Link>
              ) : null}
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
                    readOnly
                    value=""
                    onMouseDown={(e) => {
                      e.preventDefault();
                      openSearch();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openSearch();
                      }
                    }}
                    placeholder={searchPlaceholder}
                    className="w-full h-full bg-transparent cursor-pointer pl-9 pr-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none rounded-full"
                    aria-label="Search events, evidence, organizations, people"
                    aria-haspopup="dialog"
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
              {showUserMenu && session ? (
                <>
                  <Link
                    href="/profile"
                    onClick={handleLinkClick}
                    className="flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    Profile
                  </Link>
                  <Link
                    href={NOTIFICATIONS_PATH}
                    onClick={handleLinkClick}
                    className="flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
                  >
                    <Bell className="h-4 w-4" aria-hidden="true" />
                    Notifications
                    {unreadNotifications > 0 ? (
                      <span className="ml-auto rounded-full bg-[#3B82F6] px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {unreadNotifications}
                      </span>
                    ) : null}
                  </Link>
                  <Link
                    href="/profile/settings"
                    onClick={handleLinkClick}
                    className="flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
                  >
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={signOut}
                    className="flex min-h-[44px] w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-base font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                </>
              ) : showUserMenu ? (
                <Link
                  href="/login?next=/profile"
                  onClick={handleLinkClick}
                  className="flex min-h-[44px] items-center rounded-lg px-4 py-3 text-base font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
                >
                  Sign in
                </Link>
              ) : null}
            </nav>
            {ctaButton && (
              <div className="pt-6 border-t border-white/10">
                {ctaButton.href === "/report" ? (
                  <ReportIncidentGate
                    label={ctaButton.label}
                    variant="navbar"
                    className="!h-11 !w-full !rounded-xl"
                    onAfterNavigate={() => setIsMobileMenuOpen(false)}
                  />
                ) : (
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
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {showSearch && (
        <SearchModal
          open={searchOpen}
          onClose={closeSearch}
        />
      )}
    </>
  );
}
