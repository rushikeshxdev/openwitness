"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getMockSession, type MockSessionUser } from "@/lib/auth-session";
import {
  LOGIN_NEXT_PROFILE,
  REGISTER_NEXT_PROFILE,
  type ProfileViewModel,
} from "@/data/profile-data";
import { loadProfileViewModel } from "@/lib/profile-store";
import { ChevronRight } from "lucide-react";

export function useProfileSession() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<MockSessionUser | null>(null);
  const [profile, setProfile] = useState<ProfileViewModel | null>(null);

  const refresh = () => {
    const s = getMockSession();
    setSession(s);
    setProfile(s ? loadProfileViewModel(s) : null);
  };

  useEffect(() => {
    refresh();
    setReady(true);
  }, []);

  return { ready, session, profile, refresh };
}

export function ProfileAuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Dismiss"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-auth-title"
        className="relative w-full max-w-md rounded-2xl border border-white/12 bg-[#121214] p-6 shadow-2xl"
      >
        <h2 id="profile-auth-title" className="text-lg font-semibold text-white">
          Sign in to view your profile
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Your OpenWitness profile, reports, and settings are available after
          you register or sign in.
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href={REGISTER_NEXT_PROFILE}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB]"
            onClick={onClose}
          >
            Register
          </Link>
          <Link
            href={LOGIN_NEXT_PROFILE}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/12 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-white/5"
            onClick={onClose}
          >
            Sign in
          </Link>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full text-center text-xs text-zinc-500 hover:text-zinc-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function ProfileGate({
  children,
}: {
  children: (ctx: {
    session: MockSessionUser;
    profile: ProfileViewModel;
    refresh: () => void;
  }) => ReactNode;
}) {
  const router = useRouter();
  const { ready, session, profile, refresh } = useProfileSession();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!session) setModalOpen(true);
  }, [ready, session]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 pt-28 sm:px-6 lg:px-8">
        <div className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
      </div>
    );
  }

  if (!session || !profile) {
    return (
      <ProfileAuthModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          router.push("/events");
        }}
      />
    );
  }

  return <>{children({ session, profile, refresh })}</>;
}

export function ProfileBreadcrumb({
  trail,
}: {
  trail?: { label: string; href?: string }[];
}) {
  const items = trail ?? [{ label: "Profile" }];
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-zinc-400 sm:text-sm"
    >
      <Link href="/" className="transition-colors hover:text-white">
        Home
      </Link>
      {items.map((item) => (
        <span key={item.label} className="contents">
          <ChevronRight
            className="h-3.5 w-3.5 shrink-0 text-zinc-600"
            aria-hidden="true"
          />
          {item.href ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-zinc-200">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function ProfilePanel({
  children,
  className,
  title,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-white/12 bg-[#121214]/90",
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
          {title ? (
            <h2 className="text-sm font-semibold text-white sm:text-base">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function useActiveProfileSection(): string {
  const pathname = usePathname();
  if (pathname?.startsWith("/profile/settings")) return "settings";
  if (pathname?.startsWith("/profile/reports")) return "reports";
  if (pathname?.startsWith("/profile/bookmarks")) return "bookmarks";
  if (pathname?.startsWith("/profile/following")) return "following";
  if (pathname?.startsWith("/profile/contributions")) return "contributions";
  if (pathname?.startsWith("/profile/notifications")) return "notifications";
  return "overview";
}
