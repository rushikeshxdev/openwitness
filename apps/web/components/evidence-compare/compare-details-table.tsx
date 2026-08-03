"use client";

import type { CompareSlot } from "@/data/compare-evidence-data";

const ROWS: Array<{
  key: keyof CompareSlot | "uploaderRow" | "status";
  label: string;
  render: (slot: CompareSlot) => string;
}> = [
  { key: "type", label: "Type", render: (s) => s.type },
  { key: "duration", label: "Duration", render: (s) => s.duration },
  { key: "resolution", label: "Resolution", render: (s) => s.resolution },
  { key: "fileSize", label: "File Size", render: (s) => s.fileSize },
  { key: "uploadedAt", label: "Uploaded", render: (s) => s.uploadedAt },
  {
    key: "uploaderRow",
    label: "Uploader",
    render: (s) => s.uploader,
  },
  {
    key: "status",
    label: "Verification",
    render: (s) => s.statusLabel,
  },
];

export function CompareDetailsTable({ slots }: { slots: CompareSlot[] }) {
  return (
    <section
      className="overflow-hidden rounded-2xl border border-white/12 bg-[#121214]/90"
      aria-labelledby="details-table-heading"
    >
      <div className="border-b border-white/10 px-4 py-3.5 sm:px-5">
        <h2
          id="details-table-heading"
          className="text-base font-semibold text-white sm:text-lg"
        >
          Evidence Details
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs text-zinc-500">
              <th className="px-4 py-3 font-medium sm:px-5">Field</th>
              {slots.map((slot) => (
                <th key={slot.letter} className="px-3 py-3 font-medium">
                  <span className="inline-flex items-center gap-1.5 text-zinc-300">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#3B82F6]/20 text-[10px] font-bold text-[#93C5FD]">
                      {slot.letter}
                    </span>
                    {slot.letter}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {ROWS.map((row) => (
              <tr key={row.key}>
                <th className="px-4 py-3 text-xs font-medium text-zinc-500 sm:px-5">
                  {row.label}
                </th>
                {slots.map((slot) => (
                  <td
                    key={`${slot.letter}-${row.key}`}
                    className="px-3 py-3 text-zinc-200"
                  >
                    {row.key === "uploaderRow" ? (
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: slot.uploaderAccent }}
                          aria-hidden="true"
                        >
                          {slot.uploaderInitials}
                        </span>
                        {slot.uploader}
                      </span>
                    ) : (
                      row.render(slot)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
