"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMockSession, type MockSessionUser } from "@/lib/auth-session";
import {
  LOGIN_NEXT_VERIFICATION,
  REGISTER_NEXT_VERIFICATION,
} from "@/data/verification-queue-data";

export function useVerificationSession() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<MockSessionUser | null>(null);

  useEffect(() => {
    setSession(getMockSession());
    setReady(true);
  }, []);

  const refresh = () => setSession(getMockSession());

  return { ready, session, refresh };
}

function VerificationAuthModal({
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
        aria-labelledby="verification-auth-title"
        className="relative w-full max-w-md rounded-2xl border border-white/12 bg-[#121214] p-6 shadow-2xl"
      >
        <h2
          id="verification-auth-title"
          className="text-lg font-semibold text-white"
        >
          Sign in to verify evidence
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Community verification is available to registered members. Sign in to
          review pending evidence and help keep OpenWitness trustworthy.
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href={REGISTER_NEXT_VERIFICATION}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB]"
            onClick={onClose}
          >
            Register
          </Link>
          <Link
            href={LOGIN_NEXT_VERIFICATION}
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

export function VerificationGate({
  children,
}: {
  children: (ctx: {
    session: MockSessionUser;
    refresh: () => void;
  }) => ReactNode;
}) {
  const router = useRouter();
  const { ready, session, refresh } = useVerificationSession();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!session) setModalOpen(true);
  }, [ready, session]);

  if (!ready) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#0B0E11] pt-20">
        <div className="mx-4 h-40 w-full max-w-3xl animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
      </div>
    );
  }

  if (!session) {
    return (
      <VerificationAuthModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          router.push("/events");
        }}
      />
    );
  }

  return <>{children({ session, refresh })}</>;
}
