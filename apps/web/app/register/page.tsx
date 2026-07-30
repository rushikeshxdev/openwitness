import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterWizard } from "@/components/auth/register-wizard";
import { RegisterSignInLink } from "@/components/auth/register-sign-in-link";

export const metadata: Metadata = {
  title: "Create Account – OpenWitness",
  description:
    "Join OpenWitness to document, verify, and contribute evidence from public events.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      variant="register"
      formHeader={
        <Suspense fallback={<p className="text-sm text-zinc-400">Already have an account?</p>}>
          <RegisterSignInLink />
        </Suspense>
      }
    >
      <Suspense
        fallback={
          <div className="mx-auto h-96 w-full max-w-xl animate-pulse rounded-2xl bg-white/5" />
        }
      >
        <RegisterWizard />
      </Suspense>
    </AuthShell>
  );
}
