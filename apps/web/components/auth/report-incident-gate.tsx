"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  getMockSession,
  LOGIN_NEXT_REPORT,
  REPORT_PATH,
} from "@/lib/auth-session";
import { ClipboardCheck, X } from "lucide-react";

export interface RegisterRequiredModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function RegisterRequiredModal({
  open,
  onClose,
  title = "Please register first",
  description = "You need an OpenWitness account before you can report an incident. Register or sign in to continue.",
}: RegisterRequiredModalProps) {
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
        aria-labelledby="register-required-title"
        className="relative w-full max-w-md rounded-2xl border border-white/12 bg-[#121214] p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-zinc-500 hover:bg-white/5 hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <h2
          id="register-required-title"
          className="pr-8 text-lg font-semibold text-white"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          {description}
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href={`/register?next=${encodeURIComponent(REPORT_PATH)}`}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB]"
            onClick={onClose}
          >
            Register
          </Link>
          <Link
            href={LOGIN_NEXT_REPORT}
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

export type ReportIncidentGateVariant = "navbar" | "hero" | "footer" | "plain";

export interface ReportIncidentGateProps {
  label?: string;
  variant?: ReportIncidentGateVariant;
  className?: string;
  onAfterNavigate?: () => void;
}

export function ReportIncidentGate({
  label = "Report Incident",
  variant = "navbar",
  className,
  onAfterNavigate,
}: ReportIncidentGateProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = useCallback(() => {
    if (getMockSession()) {
      router.push(REPORT_PATH);
      onAfterNavigate?.();
      return;
    }
    setModalOpen(true);
  }, [router, onAfterNavigate]);

  const base =
    variant === "navbar"
      ? cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0",
          "rounded-xl h-9 px-3.5 lg:px-4",
          "bg-[#3B82F6] hover:bg-[#2563EB] text-white",
          "text-[12px] lg:text-[13px] font-semibold",
          "shadow-md shadow-blue-500/25 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-sky-400/50"
        )
      : variant === "hero"
        ? cn(
            "inline-flex w-full sm:w-auto items-center justify-center gap-2",
            "rounded-xl px-8 py-4 text-lg font-medium",
            "bg-transparent text-white border border-white/30 hover:bg-white/10 hover:border-white/50",
            "transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-blue-500"
          )
        : variant === "footer"
          ? cn(
              "text-sm text-text-secondary transition-colors hover:text-text-primary",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            )
          : cn(
              "inline-flex items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB]"
            );

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(base, className)}
      >
        {variant === "navbar" && (
          <ClipboardCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        {label}
      </button>
      <RegisterRequiredModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

/** Hook for pages that need the same gate without rendering a button. */
export function useReportAuthGuard(options?: { autoPrompt?: boolean }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const session = getMockSession();
    setAllowed(Boolean(session));
    setReady(true);
    if (!session && options?.autoPrompt !== false) {
      setModalOpen(true);
    }
  }, [options?.autoPrompt]);

  const goRegister = () => {
    router.push(`/register?next=${encodeURIComponent(REPORT_PATH)}`);
  };

  return {
    ready,
    allowed,
    modalOpen,
    setModalOpen,
    goRegister,
    RegisterModal: (
      <RegisterRequiredModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (!getMockSession()) {
            router.push(`/register?next=${encodeURIComponent(REPORT_PATH)}`);
          }
        }}
      />
    ),
  };
}
