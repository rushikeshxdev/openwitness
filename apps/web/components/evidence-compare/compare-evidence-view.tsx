"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell/app-shell";
import {
  buildCompareViewModel,
  formatCompareIds,
  listComparableEvidence,
  parseCompareIds,
  type CompareIdPair,
  type CompareTabId,
  MAX_COMPARE_SLOTS,
  MIN_COMPARE_SLOTS,
} from "@/data/compare-evidence-data";
import { CompareSlotStrip } from "./compare-slot-strip";
import { CompareTabs } from "./compare-tabs";
import { CompareOverview } from "./compare-overview";
import { CompareSectionPanel } from "./compare-section-panel";
import { CompareAddPicker } from "./compare-add-picker";

function CompareEvidenceInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<CompareTabId>("overview");
  const [pickerOpen, setPickerOpen] = useState(false);

  const ids = useMemo(
    () => parseCompareIds(searchParams.get("ids")),
    [searchParams]
  );

  const model = useMemo(() => buildCompareViewModel(ids), [ids]);

  const activeIds: CompareIdPair[] = useMemo(
    () =>
      model.slots.map((s) => ({
        eventId: s.eventId,
        evidenceId: s.evidenceId,
      })),
    [model.slots]
  );

  const selectedKeys = useMemo(
    () => new Set(activeIds.map((p) => `${p.eventId}:${p.evidenceId}`)),
    [activeIds]
  );

  const pickerItems = useMemo(
    () => listComparableEvidence(model.primaryEventId),
    [model.primaryEventId]
  );

  const replaceIds = useCallback(
    (next: CompareIdPair[]) => {
      const qs = formatCompareIds(next);
      router.replace(`/evidence/compare?ids=${encodeURIComponent(qs)}`, {
        scroll: false,
      });
    },
    [router]
  );

  const onRemove = useCallback(
    (evidenceId: string, eventId: string) => {
      if (activeIds.length <= MIN_COMPARE_SLOTS) return;
      replaceIds(
        activeIds.filter(
          (p) => !(p.eventId === eventId && p.evidenceId === evidenceId)
        )
      );
    },
    [activeIds, replaceIds]
  );

  const onPick = useCallback(
    (pair: CompareIdPair) => {
      if (activeIds.length >= MAX_COMPARE_SLOTS) return;
      const key = `${pair.eventId}:${pair.evidenceId}`;
      if (selectedKeys.has(key)) return;
      replaceIds([...activeIds, pair]);
      setPickerOpen(false);
    },
    [activeIds, replaceIds, selectedKeys]
  );

  const onShare = useCallback(() => {
    const url =
      typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({ title: "OpenWitness Comparison", url });
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(url);
    }
  }, []);

  return (
    <AppShell
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Evidence", href: "/evidence" },
        { label: "Compare" },
      ]}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#60A5FA]">
              Beta
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Compare Evidence
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-zinc-400">
              Measure corroboration across angles — agreement raises confidence;
              disagreement flags risk. This does not pick a single “true” clip.
            </p>
          </div>
        </div>

        <CompareSlotStrip
          slots={model.slots}
          onRemove={onRemove}
          onAdd={() => setPickerOpen(true)}
        />

        <CompareTabs active={tab} onSelect={setTab} />

        {tab === "overview" ? (
          <CompareOverview model={model} onShare={onShare} />
        ) : (
          <CompareSectionPanel tab={tab} model={model} />
        )}
      </div>

      <CompareAddPicker
        open={pickerOpen}
        items={pickerItems}
        selectedKeys={selectedKeys}
        onClose={() => setPickerOpen(false)}
        onPick={onPick}
      />
    </AppShell>
  );
}

export function CompareEvidenceView() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1440px] px-4 py-24 text-sm text-zinc-500">
          Loading comparison…
        </div>
      }
    >
      <CompareEvidenceInner />
    </Suspense>
  );
}
