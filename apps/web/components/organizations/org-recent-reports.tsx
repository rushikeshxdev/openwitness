"use client";

import Image from "next/image";
import Link from "next/link";
import type { OrgRecentReport } from "@/data/organization-detail-data";

export function OrgRecentReports({ reports }: { reports: OrgRecentReport[] }) {
  return (
    <section
      className="rounded-2xl border border-white/12 bg-[#121214]/90 p-4 sm:p-5"
      aria-labelledby="org-reports-heading"
    >
      <h2
        id="org-reports-heading"
        className="text-base font-semibold text-white sm:text-lg"
      >
        Recent Reports
      </h2>
      <ul className="mt-4 flex gap-3 overflow-x-auto pb-1 scrollbar-hide sm:gap-4">
        {reports.map((report) => {
          const href = report.href ?? "/reports";
          return (
            <li key={report.id} className="w-[180px] shrink-0 sm:w-[200px]">
              <Link
                href={href}
                className="group block overflow-hidden rounded-xl border border-white/12 bg-black/30 transition-colors hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
              >
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={report.thumbnailUrl}
                    alt=""
                    fill
                    className="object-cover brightness-[0.7] transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="200px"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                    aria-hidden="true"
                  />
                  {report.status === "published" ? (
                    <span className="absolute left-2 top-2 inline-flex rounded-md bg-emerald-500/90 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
                      Published
                    </span>
                  ) : null}
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-[#60A5FA]">
                    {report.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-zinc-500">{report.dateLabel}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
