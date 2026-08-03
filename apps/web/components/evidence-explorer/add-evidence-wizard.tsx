"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/app-shell/app-shell";
import { getMockSession } from "@/lib/auth-session";
import { RegisterRequiredModal } from "@/components/auth/report-incident-gate";
import { exploreEventsData } from "@/data/explore-events-data";
import {
  ACCEPTED_FORMATS,
  ADD_EVIDENCE_DRAFT_KEY,
  ADD_EVIDENCE_STEPS,
  emptyAddEvidenceDraft,
  MOCK_UPLOAD_FILES,
  type AddEvidenceDraft,
} from "@/data/add-evidence-data";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileUp,
  Trash2,
  Upload,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]";

export function AddEvidenceWizard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<AddEvidenceDraft>(emptyAddEvidenceDraft);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const eventOptions = useMemo(
    () =>
      exploreEventsData.slice(0, 12).map((e) => ({
        id: e.id,
        label: `${e.title} (${e.location.city})`,
      })),
    []
  );

  useEffect(() => {
    const session = getMockSession();
    setAllowed(Boolean(session));
    setReady(true);
    if (!session) setModalOpen(true);

    try {
      const raw = localStorage.getItem(ADD_EVIDENCE_DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AddEvidenceDraft;
        setDraft({ ...emptyAddEvidenceDraft(), ...parsed });
      }
    } catch {
      /* ignore */
    }
  }, []);

  const update = (patch: Partial<AddEvidenceDraft>) =>
    setDraft((d) => ({ ...d, ...patch }));

  const saveDraft = () => {
    try {
      localStorage.setItem(ADD_EVIDENCE_DRAFT_KEY, JSON.stringify(draft));
      setToast("Draft saved locally.");
      window.setTimeout(() => setToast(null), 2000);
    } catch {
      setError("Could not save draft.");
    }
  };

  const next = () => {
    setError(null);
    if (step === 1 && draft.files.length === 0) {
      setError("Add at least one file (use the upload zone to simulate).");
      return;
    }
    if (step === 2) {
      if (!draft.title.trim()) {
        setError("Enter a title for this evidence.");
        return;
      }
      if (!draft.eventId) {
        setError("Link this evidence to an event.");
        return;
      }
    }
    if (step === 3) {
      if (!draft.city.trim() || !draft.country.trim()) {
        setError("City and country are required.");
        return;
      }
    }
    if (step === 4) {
      if (!draft.attestOriginal || !draft.attestLocation || !draft.attestReview) {
        setError("Confirm all verification attestations to continue.");
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
    try {
      localStorage.removeItem(ADD_EVIDENCE_DRAFT_KEY);
    } catch {
      /* ignore */
    }
    setToast("Evidence submitted for review (demo).");
    window.setTimeout(() => router.push("/evidence"), 1200);
  };

  const simulateUpload = () => {
    update({ files: MOCK_UPLOAD_FILES.map((f) => ({ ...f })) });
  };

  if (!ready) {
    return (
      <AppShell>
        <div className="min-h-[40vh] animate-pulse rounded-2xl bg-white/5" aria-hidden />
      </AppShell>
    );
  }

  if (!allowed) {
    return (
      <RegisterRequiredModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          router.push(`/register?next=${encodeURIComponent("/evidence/new")}`);
        }}
      />
    );
  }

  return (
    <AppShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Evidence", href: "/evidence" },
        { label: "Add New" },
      ]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Add New Evidence
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
            Upload media, add context, and submit for community verification.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[200px_minmax(0,1fr)_240px]">
          <aside className="hidden lg:block">
            <ol className="space-y-3">
              {ADD_EVIDENCE_STEPS.map((s) => {
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

          <div className="rounded-2xl border border-white/12 bg-[#121214]/90 p-5 sm:p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500 lg:hidden">
              Step {step} of {ADD_EVIDENCE_STEPS.length}:{" "}
              {ADD_EVIDENCE_STEPS[step - 1]?.label}
            </p>

            {error ? (
              <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            ) : null}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Upload</h2>
                <button
                  type="button"
                  onClick={simulateUpload}
                  className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-black/30 px-6 py-14 text-center hover:border-[#3B82F6]/50 hover:bg-[#3B82F6]/5 transition-colors"
                >
                  <Upload className="h-8 w-8 text-[#60A5FA]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      Drag & drop files here, or click to browse
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Demo: click to attach sample uploads
                    </p>
                  </div>
                </button>
                {draft.files.length > 0 ? (
                  <ul className="space-y-2">
                    {draft.files.map((f) => (
                      <li
                        key={f.id}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
                      >
                        <FileUp className="h-4 w-4 text-zinc-400 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-zinc-200 truncate">{f.name}</p>
                          <p className="text-[11px] text-zinc-500">
                            {f.sizeLabel} · {f.progress}%
                          </p>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${f.progress}%` }}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${f.name}`}
                          onClick={() =>
                            update({
                              files: draft.files.filter((x) => x.id !== f.id),
                            })
                          }
                          className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Details</h2>
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="ae-title">
                    Title
                  </label>
                  <input
                    id="ae-title"
                    value={draft.title}
                    onChange={(e) => update({ title: e.target.value })}
                    placeholder="e.g. Protest at India Gate"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="ae-desc">
                    Description
                  </label>
                  <textarea
                    id="ae-desc"
                    rows={4}
                    value={draft.description}
                    onChange={(e) => update({ description: e.target.value })}
                    placeholder="What does this media show?"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="ae-event">
                    Linked event
                  </label>
                  <select
                    id="ae-event"
                    value={draft.eventId}
                    onChange={(e) => update({ eventId: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Select an event</option>
                    {eventOptions.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="ae-tags">
                    Tags (comma-separated)
                  </label>
                  <input
                    id="ae-tags"
                    value={draft.tags}
                    onChange={(e) => update({ tags: e.target.value })}
                    placeholder="Protest, Crowd"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Location</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="ae-city">
                      City
                    </label>
                    <input
                      id="ae-city"
                      value={draft.city}
                      onChange={(e) => update({ city: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="ae-country">
                      Country
                    </label>
                    <input
                      id="ae-country"
                      value={draft.country}
                      onChange={(e) => update({ country: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="ae-lat">
                      Latitude (optional)
                    </label>
                    <input
                      id="ae-lat"
                      value={draft.latitude}
                      onChange={(e) => update({ latitude: e.target.value })}
                      placeholder="28.6129"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-zinc-400" htmlFor="ae-lng">
                      Longitude (optional)
                    </label>
                    <input
                      id="ae-lng"
                      value={draft.longitude}
                      onChange={(e) => update({ longitude: e.target.value })}
                      placeholder="77.2295"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Verification</h2>
                <p className="text-sm text-zinc-400">
                  Confirm the following before community review.
                </p>
                {(
                  [
                    ["attestOriginal", "This is original media I captured or have rights to share"],
                    ["attestLocation", "The location information is accurate to the best of my knowledge"],
                    ["attestReview", "I understand this will be reviewed by the OpenWitness community"],
                  ] as const
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-zinc-300"
                  >
                    <input
                      type="checkbox"
                      checked={draft[key]}
                      onChange={(e) => update({ [key]: e.target.checked })}
                      className="mt-0.5 rounded border-white/20"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Review</h2>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3 border-b border-white/8 pb-2">
                    <dt className="text-zinc-500">Files</dt>
                    <dd className="text-zinc-200 text-right">
                      {draft.files.map((f) => f.name).join(", ") || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-white/8 pb-2">
                    <dt className="text-zinc-500">Title</dt>
                    <dd className="text-zinc-200 text-right">{draft.title}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-white/8 pb-2">
                    <dt className="text-zinc-500">Event</dt>
                    <dd className="text-zinc-200 text-right">
                      {eventOptions.find((e) => e.id === draft.eventId)?.label ??
                        draft.eventId}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-white/8 pb-2">
                    <dt className="text-zinc-500">Location</dt>
                    <dd className="text-zinc-200 text-right">
                      {draft.city}, {draft.country}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-zinc-500">Tags</dt>
                    <dd className="text-zinc-200 text-right">
                      {draft.tags || "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-5">
              <button
                type="button"
                onClick={saveDraft}
                className="text-sm font-medium text-zinc-400 hover:text-white"
              >
                Save as Draft
              </button>
              <div className="flex gap-2">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={back}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-white/5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                ) : null}
                {step < 5 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB]"
                  >
                    Next: {ADD_EVIDENCE_STEPS[step]?.label ?? "Continue"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2563EB]"
                  >
                    Submit evidence
                  </button>
                )}
              </div>
            </div>
          </div>

          <aside className="hidden lg:block space-y-4">
            <div className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                Accepted Formats
              </h3>
              <ul className="space-y-3">
                {ACCEPTED_FORMATS.map((f) => (
                  <li key={f.label}>
                    <p className="text-xs font-medium text-zinc-300">{f.label}</p>
                    <p className="text-[11px] text-zinc-500">{f.formats}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-white/15 bg-[#121214] px-4 py-2.5 text-sm text-white shadow-xl">
          {toast}
        </div>
      ) : null}
    </AppShell>
  );
}
