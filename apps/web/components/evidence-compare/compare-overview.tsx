"use client";

import type { CompareViewModel } from "@/data/compare-evidence-data";
import {
  CompareMetricCards,
  CompareScoreRing,
} from "./compare-score-metrics";
import { CompareTimelineAlign } from "./compare-timeline-align";
import { CompareDetailsTable } from "./compare-details-table";
import { CompareAnalysisPanel } from "./compare-analysis-panel";

export function CompareOverview({
  model,
  onShare,
}: {
  model: CompareViewModel;
  onShare: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <div className="space-y-5 xl:col-span-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
          <CompareScoreRing scores={model.scores} />
          <CompareMetricCards scores={model.scores} />
        </div>
        <CompareTimelineAlign timeline={model.timeline} />
        <CompareDetailsTable slots={model.slots} />
      </div>
      <div className="xl:col-span-4">
        <CompareAnalysisPanel
          highlights={model.highlights}
          ai={model.ai}
          actions={model.actions}
          onShare={onShare}
        />
      </div>
    </div>
  );
}
