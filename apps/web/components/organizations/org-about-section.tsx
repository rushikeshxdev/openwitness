"use client";

import type { OrganizationDetailViewModel } from "@/data/organization-detail-data";

export function OrgAboutSection({
  detail,
}: {
  detail: OrganizationDetailViewModel;
}) {
  const meta = [
    { label: "Founded", value: detail.founded },
    { label: "Type", value: detail.type },
    { label: "Focus Areas", value: detail.focusAreas.join(", ") },
    { label: "Region", value: detail.region },
  ];

  return (
    <section
      className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5"
      aria-labelledby="org-about-heading"
    >
      <h2
        id="org-about-heading"
        className="text-base font-semibold text-white sm:text-lg"
      >
        About
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-300">
        {detail.aboutText}
      </p>
      <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {meta.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/10 bg-black/25 px-3.5 py-3"
          >
            <dt className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              {item.label}
            </dt>
            <dd className="mt-1 text-sm text-zinc-200">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
