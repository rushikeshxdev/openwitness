import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { Github, Lock, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In – OpenWitness",
  description: "Sign in to OpenWitness to document, verify, and follow public events.",
};

export default function LoginPage() {
  return (
    <AuthShell
      variant="login"
      footer={
        <div className="space-y-3 text-center text-xs text-zinc-500">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              Open source &amp; transparent
            </span>
            <span className="hidden text-zinc-700 sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              Privacy first
            </span>
            <span className="hidden text-zinc-700 sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              Community driven
            </span>
          </div>
          <p>© 2024 OpenWitness. All rights reserved.</p>
        </div>
      }
    >
      <Suspense
        fallback={
          <div className="mx-auto h-96 w-full max-w-md animate-pulse rounded-2xl bg-white/5" />
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
