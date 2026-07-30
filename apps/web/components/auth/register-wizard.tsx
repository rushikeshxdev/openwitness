"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { safeAuthNext, setMockSession } from "@/lib/auth-session";
import {
  defaultRegisterPreferences,
  regionOptions,
  registerSteps,
  userRoles,
  type UserRoleId,
} from "@/data/auth-data";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  HeartHandshake,
  Lock,
  Mail,
  MoreHorizontal,
  Newspaper,
  PartyPopper,
  PenLine,
  Shield,
  Users,
} from "lucide-react";

const ROLE_ICONS: Record<UserRoleId, typeof Users> = {
  citizen: Users,
  journalist: Newspaper,
  researcher: GraduationCap,
  organization: Building2,
  volunteer: HeartHandshake,
  other: MoreHorizontal,
};

export function RegisterWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeAuthNext(searchParams.get("next"));
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRoleId | null>("citizen");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [prefs, setPrefs] = useState(defaultRegisterPreferences);
  const [error, setError] = useState<string | null>(null);

  const goNext = () => {
    setError(null);
    if (step === 1) {
      if (!role) {
        setError("Select how you’ll use OpenWitness.");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!name.trim()) {
        setError("Enter your name.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setError("Enter a valid email address.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }
      setStep(3);
      return;
    }
    if (step === 3) {
      setMockSession({
        email: email.trim(),
        name: name.trim(),
        role: role ?? "citizen",
      });
      setStep(4);
    }
  };

  const goBack = () => {
    setError(null);
    if (step > 1 && step < 4) setStep((s) => s - 1);
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-2xl border border-white/12 bg-[#121214]/95 p-5 shadow-2xl backdrop-blur-md sm:p-8">
        {/* Stepper */}
        <ol className="mb-8 flex items-start justify-between gap-1">
          {registerSteps.map((s, i) => {
            const active = step === s.id;
            const done = step > s.id;
            return (
              <li key={s.id} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {i > 0 && (
                    <div
                      className={cn(
                        "h-px flex-1 border-t border-dashed",
                        done || active ? "border-[#3B82F6]/50" : "border-white/15"
                      )}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      active && "bg-[#3B82F6] text-white",
                      done && "bg-[#3B82F6]/25 text-[#93C5FD]",
                      !active && !done && "bg-white/5 text-zinc-500"
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : s.id}
                  </span>
                  {i < registerSteps.length - 1 && (
                    <div
                      className={cn(
                        "h-px flex-1 border-t border-dashed",
                        done ? "border-[#3B82F6]/50" : "border-white/15"
                      )}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 hidden text-center text-[10px] font-medium sm:block",
                    active ? "text-[#60A5FA]" : "text-zinc-500"
                  )}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>

        {step === 1 && (
          <StepAboutYou role={role} onSelect={setRole} />
        )}
        {step === 2 && (
          <StepAccountDetails
            name={name}
            email={email}
            password={password}
            confirm={confirm}
            showPassword={showPassword}
            onName={setName}
            onEmail={setEmail}
            onPassword={setPassword}
            onConfirm={setConfirm}
            onTogglePassword={() => setShowPassword((v) => !v)}
          />
        )}
        {step === 3 && (
          <StepPreferences
            prefs={prefs}
            onChange={setPrefs}
          />
        )}
        {step === 4 && (
          <StepSuccess
            name={name}
            role={role}
            onExplore={() => router.push(nextPath)}
            exploreLabel={nextPath === "/report" ? "Continue to Report" : "Go to Explore"}
          />
        )}

        {error && (
          <p className="mt-4 text-sm text-rose-400" role="alert">
            {error}
          </p>
        )}

        {step < 4 && (
          <div className="mt-6 flex items-center gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/5"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={goNext}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB]"
            >
              {step === 3 ? "Finish" : "Next"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {step === 1 && (
          <p className="mt-3 text-center text-xs text-zinc-500">
            This will only take a minute.
          </p>
        )}
      </div>

      <p className="mt-4 flex items-center justify-between text-xs text-zinc-500">
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Secure &amp; private
        </span>
        <span>
          Step {step} of {registerSteps.length}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5 text-[#60A5FA]" aria-hidden="true" />
          Open source
        </span>
      </p>
    </div>
  );
}

function StepAboutYou({
  role,
  onSelect,
}: {
  role: UserRoleId | null;
  onSelect: (id: UserRoleId) => void;
}) {
  return (
    <div>
      <h1 className="text-xl font-bold text-white sm:text-2xl">
        Tell us about yourself 👋
      </h1>
      <p className="mt-2 text-sm text-zinc-400">
        Help us personalize your experience and connect you with the right tools
        and communities.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {userRoles.map((r) => {
          const Icon = ROLE_ICONS[r.id];
          const selected = role === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelect(r.id)}
              className={cn(
                "relative rounded-xl border p-3.5 text-left transition-colors",
                selected
                  ? "border-[#3B82F6] bg-[#3B82F6]/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              )}
            >
              {selected && (
                <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#3B82F6] text-white">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
              )}
              <span
                className={cn(
                  "mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg",
                  r.accent
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold text-white">{r.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                {r.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#3B82F6]" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-zinc-400">
          Your <span className="font-medium text-zinc-200">privacy matters</span>.
          We never share your personal information. Read our{" "}
          <Link href="/#privacy" className="font-medium text-[#60A5FA] hover:text-white">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function StepAccountDetails({
  name,
  email,
  password,
  confirm,
  showPassword,
  onName,
  onEmail,
  onPassword,
  onConfirm,
  onTogglePassword,
}: {
  name: string;
  email: string;
  password: string;
  confirm: string;
  showPassword: boolean;
  onName: (v: string) => void;
  onEmail: (v: string) => void;
  onPassword: (v: string) => void;
  onConfirm: (v: string) => void;
  onTogglePassword: () => void;
}) {
  const inputClass =
    "w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]";

  return (
    <div>
      <h1 className="text-xl font-bold text-white sm:text-2xl">
        Account details
      </h1>
      <p className="mt-2 text-sm text-zinc-400">
        Create your OpenWitness credentials. You can update these later in
        settings.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="reg-name" className="mb-1.5 block text-xs font-medium text-zinc-400">
            Full name
          </label>
          <div className="relative">
            <PenLine
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            />
            <input
              id="reg-name"
              value={name}
              onChange={(e) => onName(e.target.value)}
              placeholder="Rushikesh Randive"
              className={cn(inputClass, "pl-10")}
              autoComplete="name"
            />
          </div>
        </div>
        <div>
          <label htmlFor="reg-email" className="mb-1.5 block text-xs font-medium text-zinc-400">
            Email address
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            />
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => onEmail(e.target.value)}
              placeholder="you@example.com"
              className={cn(inputClass, "pl-10")}
              autoComplete="email"
            />
          </div>
        </div>
        <div>
          <label htmlFor="reg-password" className="mb-1.5 block text-xs font-medium text-zinc-400">
            Password
          </label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            />
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPassword(e.target.value)}
              placeholder="At least 6 characters"
              className={cn(inputClass, "pl-10 pr-10")}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="reg-confirm" className="mb-1.5 block text-xs font-medium text-zinc-400">
            Confirm password
          </label>
          <input
            id="reg-confirm"
            type={showPassword ? "text" : "password"}
            value={confirm}
            onChange={(e) => onConfirm(e.target.value)}
            placeholder="Re-enter password"
            className={inputClass}
            autoComplete="new-password"
          />
        </div>
      </div>
    </div>
  );
}

function StepPreferences({
  prefs,
  onChange,
}: {
  prefs: typeof defaultRegisterPreferences;
  onChange: (next: typeof defaultRegisterPreferences) => void;
}) {
  return (
    <div>
      <h1 className="text-xl font-bold text-white sm:text-2xl">Preferences</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Choose how you’d like to stay updated. You can change these anytime.
      </p>

      <div className="mt-6 space-y-3">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <input
            type="checkbox"
            checked={prefs.emailUpdates}
            onChange={(e) =>
              onChange({ ...prefs, emailUpdates: e.target.checked })
            }
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/40 text-[#3B82F6] focus:ring-[#3B82F6]"
          />
          <span>
            <span className="block text-sm font-medium text-white">
              Email updates
            </span>
            <span className="mt-0.5 block text-xs text-zinc-400">
              Get digests about events you follow and verification activity.
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <input
            type="checkbox"
            checked={prefs.followPublicEvents}
            onChange={(e) =>
              onChange({ ...prefs, followPublicEvents: e.target.checked })
            }
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/40 text-[#3B82F6] focus:ring-[#3B82F6]"
          />
          <span>
            <span className="block text-sm font-medium text-white">
              Follow public events
            </span>
            <span className="mt-0.5 block text-xs text-zinc-400">
              Auto-suggest trending public events in your region.
            </span>
          </span>
        </label>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <label
            htmlFor="reg-region"
            className="block text-sm font-medium text-white"
          >
            Primary region of interest
          </label>
          <select
            id="reg-region"
            value={prefs.region}
            onChange={(e) =>
              onChange({
                ...prefs,
                region: e.target.value as typeof prefs.region,
              })
            }
            className="mt-2 w-full rounded-lg border border-white/12 bg-black/40 px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          >
            {regionOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function StepSuccess({
  name,
  role,
  onExplore,
  exploreLabel = "Go to Explore",
}: {
  name: string;
  role: UserRoleId | null;
  onExplore: () => void;
  exploreLabel?: string;
}) {
  const roleLabel = userRoles.find((r) => r.id === role)?.title ?? "Member";
  return (
    <div className="py-4 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B82F6]/15 text-[#60A5FA]">
        <PartyPopper className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-white">You&apos;re in!</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Welcome{name ? `, ${name.split(" ")[0]}` : ""} — you joined as a{" "}
        <span className="text-zinc-200">{roleLabel}</span>. Start exploring
        verified events and contribute evidence.
      </p>
      <button
        type="button"
        onClick={onExplore}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2563EB]"
      >
        {exploreLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
      <Link
        href="/"
        className="mt-3 inline-block text-sm text-zinc-500 hover:text-zinc-300"
      >
        Back to home
      </Link>
    </div>
  );
}
