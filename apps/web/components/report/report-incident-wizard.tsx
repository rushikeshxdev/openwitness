"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getMockSession } from "@/lib/auth-session";
import {
  RegisterRequiredModal,
} from "@/components/auth/report-incident-gate";
import {
  emptyReportDraft,
  reportCategories,
  reportEventTypes,
  reportGuidelines,
  reportSteps,
  type ReportDraft,
} from "@/data/report-incident-data";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HelpCircle,
  MapPin,
  Shield,
} from "lucide-react";

export function ReportIncidentWizard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ReportDraft>(emptyReportDraft);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const session = getMockSession();
    setAllowed(Boolean(session));
    setReady(true);
    if (!session) setModalOpen(true);
  }, []);

  const update = (patch: Partial<ReportDraft>) =>
    setDraft((d) => ({ ...d, ...patch }));

  const next = () => {
    setError(null);
    if (step === 1) {
      if (!draft.title.trim()) {
        setError("Enter an event title.");
        return;
      }
      if (!draft.description.trim() || draft.description.trim().length < 20) {
        setError("Add a short description (at least 20 characters).");
        return;
      }
    }
    if (step === 3) {
      if (!draft.city.trim() || !draft.country.trim()) {
        setError("City and country are required.");
        return;
      }
    }
    if (step < 5) setStep((s) => s + 1);
  };

  const back = () => {
    setError(null);
    if (step > 1) setStep((s) => s - 1);
  };

  const submit = () => {
    setToast("Incident submitted for review (demo).");
    window.setTimeout(() => {
      router.push("/events");
    }, 1200);
  };

  if (!ready) {
    return (
      <div className="min-h-[50vh] animate-pulse rounded-2xl bg-white/5" aria-hidden />
    );
  }

  if (!allowed) {
    return (
      <RegisterRequiredModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          router.push(`/register?next=${encodeURIComponent("/report")}`);
        }}
      />
    );
  }

  const inputClass =
    "w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]";

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-zinc-400">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <span className="mx-2 text-zinc-600">/</span>
        <span className="text-zinc-200">Report Incident</span>
      </nav>

      <h1 className="text-3xl font-bold text-white sm:text-4xl">
        Report an Incident
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
        Document what you witnessed. Evidence helps the community verify and
        preserve the record.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
        {/* Stepper */}
        <aside className="hidden lg:block">
          <ol className="space-y-3">
            {reportSteps.map((s) => {
              const active = step === s.id;
              const done = step > s.id;
              return (
                <li key={s.id} className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      active && "bg-[#3B82F6] text-white",
                      done && "bg-[#3B82F6]/25 text-[#93C5FD]",
                      !active && !done && "bg-white/5 text-zinc-500"
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : s.id}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      active ? "text-white" : "text-zinc-500"
                    )}
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* Form */}
        <div className="rounded-2xl border border-white/12 bg-[#121214]/90 p-5 sm:p-7">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500 lg:hidden">
            Step {step} of {reportSteps.length}:{" "}
            {reportSteps[step - 1]?.label}
          </p>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Basic Information
              </h2>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="r-title">
                  Event Title
                </label>
                <input
                  id="r-title"
                  value={draft.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="e.g. CJP Protest – New Delhi"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="r-cat">
                  Category
                </label>
                <select
                  id="r-cat"
                  value={draft.category}
                  onChange={(e) => update({ category: e.target.value })}
                  className={inputClass}
                >
                  {reportCategories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <fieldset>
                <legend className="mb-2 text-xs text-zinc-400">Event Type</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {reportEventTypes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => update({ eventType: t.id })}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                        draft.eventType === t.id
                          ? "border-[#3B82F6] bg-[#3B82F6]/15 text-white"
                          : "border-white/10 text-zinc-400 hover:border-white/20"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="r-desc">
                  Description
                </label>
                <textarea
                  id="r-desc"
                  rows={5}
                  value={draft.description}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="What happened? When? What did you observe?"
                  className={cn(inputClass, "resize-y")}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Media &amp; Evidence
              </h2>
              <p className="text-sm text-zinc-400">
                Describe evidence you have (photos, video, documents). File upload
                is coming soon — notes are enough for this demo.
              </p>
              <textarea
                rows={6}
                value={draft.mediaNotes}
                onChange={(e) => update({ mediaNotes: e.target.value })}
                placeholder="e.g. 3 phone videos from North Campus, 12:00–13:30…"
                className={cn(inputClass, "resize-y")}
              />
              <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-10 text-center text-sm text-zinc-500">
                Drag &amp; drop uploads coming soon
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Location</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="r-city">
                    City
                  </label>
                  <input
                    id="r-city"
                    value={draft.city}
                    onChange={(e) => update({ city: e.target.value })}
                    placeholder="New Delhi"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="r-country">
                    Country
                  </label>
                  <input
                    id="r-country"
                    value={draft.country}
                    onChange={(e) => update({ country: e.target.value })}
                    placeholder="India"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="r-addr">
                  Area / landmark (optional)
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    id="r-addr"
                    value={draft.address}
                    onChange={(e) => update({ address: e.target.value })}
                    placeholder="Near India Gate"
                    className={cn(inputClass, "pl-10")}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Additional Details
              </h2>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="r-impact">
                  Impact level
                </label>
                <select
                  id="r-impact"
                  value={draft.impactLevel}
                  onChange={(e) =>
                    update({
                      impactLevel: e.target.value as ReportDraft["impactLevel"],
                    })
                  }
                  className={inputClass}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="r-vis">
                  Visibility
                </label>
                <select
                  id="r-vis"
                  value={draft.visibility}
                  onChange={(e) =>
                    update({
                      visibility: e.target.value as ReportDraft["visibility"],
                    })
                  }
                  className={inputClass}
                >
                  <option value="public">Public</option>
                  <option value="restricted">Restricted</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="r-notes">
                  Extra notes
                </label>
                <textarea
                  id="r-notes"
                  rows={4}
                  value={draft.additionalNotes}
                  onChange={(e) => update({ additionalNotes: e.target.value })}
                  className={cn(inputClass, "resize-y")}
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Review &amp; Submit
              </h2>
              <dl className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
                {[
                  ["Title", draft.title],
                  ["Category", draft.category],
                  ["Type", draft.eventType],
                  ["Location", `${draft.city}, ${draft.country}`],
                  ["Impact", draft.impactLevel],
                  ["Visibility", draft.visibility],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-zinc-500">{k}</dt>
                    <dd className="text-right text-zinc-200">{v || "—"}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-sm text-zinc-400 line-clamp-4">
                {draft.description}
              </p>
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-rose-400" role="alert">
              {error}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/events")}
                className="text-sm text-zinc-500 hover:text-zinc-300"
              >
                Save as Draft (skip)
              </button>
            )}
            {step < 5 ? (
              <button
                type="button"
                onClick={next}
                className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB]"
              >
                Next: {reportSteps[step]?.label ?? "Continue"}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB]"
              >
                Submit Report
                <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Guidelines */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Shield className="h-4 w-4 text-[#3B82F6]" />
              Reporting Guidelines
            </h3>
            <ul className="space-y-2.5 text-xs leading-relaxed text-zinc-400">
              {reportGuidelines.map((g) => (
                <li key={g} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3B82F6]" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
              <HelpCircle className="h-4 w-4 text-[#3B82F6]" />
              Need Help?
            </h3>
            <p className="text-xs text-zinc-400">
              Questions about what to report? Email{" "}
              <a
                href="mailto:help@openwitness.org"
                className="text-[#60A5FA] hover:text-white"
              >
                help@openwitness.org
              </a>
            </p>
          </div>
        </aside>
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
