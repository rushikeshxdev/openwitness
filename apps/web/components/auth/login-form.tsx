"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { safeAuthNext, setMockSession } from "@/lib/auth-session";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Github,
  Lock,
  Mail,
} from "lucide-react";

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.18 3.01-.8.86-2.12 1.52-3.23 1.43-.14-1.1.4-2.27 1.16-3.06.8-.86 2.2-1.5 3.25-1.38zM20.9 17.4c-.55 1.27-.82 1.84-1.53 2.96-1 1.55-2.4 3.48-4.14 3.5-1.54.02-1.94-.99-4.04-.98-2.1.01-2.54 1-4.08.98-1.74-.02-3.07-1.76-4.07-3.3C1.3 17.3.2 12.9 2.7 9.9c1.24-1.5 3.2-2.45 5.1-2.45 1.9 0 3.09 1 4.66 1 1.52 0 2.45-1.01 4.64-1.01 1.65 0 3.4.9 4.63 2.45-4.07 2.23-3.41 8.04-.83 7.51z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-.9 2.4-1.9 3.1l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z"
      />
      <path
        fill="#34A853"
        d="M6.6 14.3l-.7.5-2.4 1.9C5.2 19.3 8.4 21.2 12 21.2c2.4 0 4.4-.8 5.9-2.1l-3.1-2.4c-.8.6-1.9.9-2.8.9-2.2 0-4-1.5-4.7-3.5z"
      />
      <path
        fill="#4A90E2"
        d="M3.5 7.3C2.7 8.8 2.2 10.4 2.2 12s.5 3.2 1.3 4.7l3.1-2.4c-.3-.9-.5-1.6-.5-2.3s.2-1.5.5-2.3L3.5 7.3z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.4c1.3 0 2.5.5 3.4 1.3l2.6-2.6C16.4 2.6 14.4 1.8 12 1.8 8.4 1.8 5.2 3.7 3.5 7.3l3.1 2.4C7.9 6.9 9.8 5.4 12 5.4z"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeAuthNext(searchParams.get("next"));
  const registerHref =
    nextPath !== "/events"
      ? `/register?next=${encodeURIComponent(nextPath)}`
      : "/register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    setMockSession({
      email: email.trim(),
      name: email.split("@")[0],
    });
    if (!remember) {
      // Still set session for this demo; remember is visual preference only
    }
    router.push(nextPath);
  };

  const social = [
    { id: "google", label: "Continue with Google", icon: GoogleIcon },
    { id: "github", label: "Continue with GitHub", icon: Github },
    { id: "apple", label: "Continue with Apple", icon: AppleIcon },
  ] as const;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-white/12 bg-[#121214]/95 p-6 shadow-2xl backdrop-blur-md sm:p-8">
        <h1 className="text-2xl font-bold text-white">Welcome back 👋</h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          Sign in to continue your journey with OpenWitness
        </p>

        <div
          className="mt-6 flex gap-6 border-b border-white/10"
          role="tablist"
          aria-label="Auth mode"
        >
          <span
            role="tab"
            aria-selected="true"
            className="relative pb-2.5 text-sm font-semibold text-white"
          >
            Sign In
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#3B82F6]" />
          </span>
          <Link
            href={registerHref}
            role="tab"
            aria-selected="false"
            className="pb-2.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-5 space-y-2.5">
          {social.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => showToast("Social sign-in coming soon")}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/12 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.06]"
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-zinc-500">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Email address
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/12 bg-black/40 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Password
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-white/12 bg-black/40 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="inline-flex cursor-pointer items-center gap-2 text-zinc-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-white/20 bg-black/40 text-[#3B82F6] focus:ring-[#3B82F6]"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => showToast("Password reset coming soon")}
              className="font-medium text-[#60A5FA] hover:text-white"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <p className="text-sm text-rose-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2563EB]",
              submitting && "opacity-70"
            )}
          >
            Sign In
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-zinc-500">
          By signing in, you agree to our{" "}
          <Link href="/#terms" className="text-[#60A5FA] hover:text-white">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/#privacy" className="text-[#60A5FA] hover:text-white">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-white/12 bg-[#121214] px-4 py-2.5 text-sm text-zinc-200 shadow-xl"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
