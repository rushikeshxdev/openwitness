"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  formatTimecode,
  type EvidenceContentTab,
  type EvidenceDetailViewModel,
  type EvidenceNavSection,
} from "@/data/evidence-detail-data";
import { compareHref } from "@/data/compare-evidence-data";
import {
  BadgeCheck,
  Calendar,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Film,
  FolderPlus,
  GitCompareArrows,
  History,
  Info,
  Link2,
  Map as MapIcon,
  MapPin,
  Maximize2,
  MessageSquare,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Settings,
  Share2,
  ShieldCheck,
  User,
  Volume2,
  type LucideIcon,
} from "lucide-react";

export interface EvidenceDetailViewProps {
  detail: EvidenceDetailViewModel;
}

const NAV_ITEMS: {
  id: EvidenceNavSection;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  countKey?: keyof EvidenceDetailViewModel["navCounts"];
  verified?: boolean;
}[] = [
  { id: "details", label: "Details", shortLabel: "Details", icon: Info },
  {
    id: "verifications",
    label: "Verifications",
    shortLabel: "Verify",
    icon: BadgeCheck,
    verified: true,
  },
  {
    id: "timeline",
    label: "Timeline",
    shortLabel: "Timeline",
    icon: Clock,
    countKey: "timeline",
  },
  {
    id: "location",
    label: "Location",
    shortLabel: "Location",
    icon: MapPin,
  },
  {
    id: "related",
    label: "Related Evidence",
    shortLabel: "Related",
    icon: Link2,
    countKey: "related",
  },
  {
    id: "reports",
    label: "Reports",
    shortLabel: "Reports",
    icon: FileText,
    countKey: "reports",
  },
  {
    id: "comments",
    label: "Comments",
    shortLabel: "Comments",
    icon: MessageSquare,
    countKey: "comments",
  },
  {
    id: "history",
    label: "History",
    shortLabel: "History",
    icon: History,
    countKey: "history",
  },
];

const CONTENT_TABS: { id: EvidenceContentTab; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "context", label: "Context" },
  { id: "metadata", label: "Metadata" },
  { id: "verifications", label: "Verifications" },
  { id: "comments", label: "Comments" },
];

function Panel({
  children,
  className,
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-white/12 bg-[#121214]/90 overflow-hidden",
        className
      )}
    >
      {title ? (
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
        </div>
      ) : null}
      {children}
    </section>
  );
}

function MetaChip({
  icon: Icon,
  children,
  className,
}: {
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs sm:text-sm text-zinc-300",
        className
      )}
    >
      {Icon ? (
        <Icon className="w-3.5 h-3.5 text-zinc-500 shrink-0" aria-hidden="true" />
      ) : null}
      {children}
    </span>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-2.5 sm:px-3.5 py-2 text-sm font-medium text-zinc-200 hover:bg-white/10 transition-colors"
    >
      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

function OverviewNav({
  detail,
  nav,
  onNavChange,
  variant,
}: {
  detail: EvidenceDetailViewModel;
  nav: EvidenceNavSection;
  onNavChange: (id: EvidenceNavSection) => void;
  variant: "horizontal" | "vertical";
}) {
  return (
    <nav
      aria-label="Evidence sections"
      className={cn(
        variant === "horizontal"
          ? "flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1 -mx-1 px-1"
          : "flex flex-col gap-0.5 p-2"
      )}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = nav === item.id;
        const count =
          item.countKey != null ? detail.navCounts[item.countKey] : undefined;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavChange(item.id)}
            className={cn(
              "snap-start inline-flex items-center gap-2 rounded-lg text-sm transition-colors text-left min-h-10",
              variant === "horizontal"
                ? "shrink-0 px-3 py-2 border"
                : "w-full px-3 py-2.5 border",
              active
                ? "bg-[#2563EB]/20 text-white border-[#3B82F6]/40"
                : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border-transparent"
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4 shrink-0",
                active
                  ? "text-[#60A5FA]"
                  : item.verified
                    ? "text-emerald-400"
                    : "text-zinc-500"
              )}
              aria-hidden="true"
            />
            <span className="font-medium whitespace-nowrap">
              {variant === "horizontal" ? item.shortLabel : item.label}
            </span>
            {item.verified ? (
              <BadgeCheck
                className="w-4 h-4 text-emerald-400 shrink-0"
                aria-hidden="true"
              />
            ) : null}
            {count != null ? (
              <span
                className={cn(
                  "min-w-[1.5rem] text-center text-xs tabular-nums rounded-md px-1.5 py-0.5",
                  active
                    ? "bg-[#3B82F6]/30 text-[#93C5FD]"
                    : "bg-white/5 text-zinc-500"
                )}
              >
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

function FileInfoList({
  rows,
}: {
  rows: { label: string; value: string }[];
}) {
  return (
    <dl className="px-3 sm:px-4 py-3 space-y-2.5">
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-2 text-sm"
        >
          <dt className="text-zinc-500">{row.label}</dt>
          <dd className="text-zinc-200 text-right tabular-nums break-all">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function EvidenceDetailView({ detail }: EvidenceDetailViewProps) {
  const noteId = useId();
  const [nav, setNav] = useState<EvidenceNavSection>("details");
  const [tab, setTab] = useState<EvidenceContentTab>("description");
  const [playing, setPlaying] = useState(false);
  const [fromExplorer, setFromExplorer] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(
    detail.currentTimeSeconds
  );
  const [activeFrame, setActiveFrame] = useState(() => {
    const idx = detail.filmstrip.findIndex(
      (f) => f.seconds >= detail.currentTimeSeconds
    );
    return idx >= 0 ? idx : 0;
  });
  const [noteDraft, setNoteDraft] = useState("");
  const [shareHint, setShareHint] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setFromExplorer(params.get("from") === "explorer");
  }, []);

  const handleNavChange = (id: EvidenceNavSection) => {
    setNav(id);
    if (id === "details") setTab("description");
    if (id === "verifications") setTab("verifications");
    if (id === "comments") setTab("comments");
  };

  const activeThumb =
    detail.filmstrip[activeFrame]?.thumbnailUrl ?? detail.thumbnailUrl;
  const progress =
    detail.durationSeconds > 0
      ? Math.min(1, currentSeconds / detail.durationSeconds)
      : 0;

  const fileRows = [
    { label: "File ID", value: detail.fileInfo.fileId },
    { label: "File Type", value: detail.fileInfo.fileType },
    { label: "Duration", value: detail.fileInfo.duration },
    { label: "Size", value: detail.fileInfo.size },
    { label: "Resolution", value: detail.fileInfo.resolution },
    { label: "Uploaded By", value: detail.fileInfo.uploadedBy },
    { label: "Uploaded At", value: detail.fileInfo.uploadedAt },
    { label: "Source Device", value: detail.fileInfo.sourceDevice },
  ];

  const statusTone =
    detail.status === "verified"
      ? "text-emerald-400"
      : detail.status === "pending"
        ? "text-amber-400"
        : "text-zinc-400";

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({ title: detail.title, url }).catch(() => undefined);
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(url).then(() => {
        setShareHint("Link copied");
        window.setTimeout(() => setShareHint(null), 1800);
      });
    }
  };

  const selectFrame = (index: number) => {
    const frame = detail.filmstrip[index];
    if (!frame) return;
    setActiveFrame(index);
    setCurrentSeconds(frame.seconds);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-12 sm:pb-16">
      {/* Breadcrumbs — collapse middle on small screens */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 sm:mb-5 flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-zinc-400"
      >
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" aria-hidden="true" />
        {fromExplorer ? (
          <>
            <Link href="/evidence" className="hover:text-white transition-colors">
              Evidence
            </Link>
            <ChevronRight
              className="w-3.5 h-3.5 text-zinc-600 shrink-0"
              aria-hidden="true"
            />
          </>
        ) : (
          <>
            <Link
              href="/events"
              className="hidden sm:inline hover:text-white transition-colors"
            >
              Explore Events
            </Link>
            <ChevronRight
              className="hidden sm:block w-3.5 h-3.5 text-zinc-600 shrink-0"
              aria-hidden="true"
            />
          </>
        )}
        <Link
          href={`/events/${detail.eventId}`}
          className="hover:text-white transition-colors truncate max-w-[9rem] sm:max-w-[14rem] md:max-w-xs"
        >
          {detail.eventTitle}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" aria-hidden="true" />
        <span className="text-zinc-200 font-medium tabular-nums truncate max-w-[11rem] sm:max-w-none">
          {detail.id}
        </span>
      </nav>

      {/* Title + actions */}
      <header className="flex flex-col gap-4 mb-6 sm:mb-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[2rem] font-bold text-white tracking-tight break-words">
            {detail.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <MetaChip icon={Calendar}>{detail.capturedAtLabel}</MetaChip>
            <MetaChip icon={MapPin}>{detail.locationLabel}</MetaChip>
            <MetaChip className={statusTone}>
              {detail.status === "verified" ? (
                <BadgeCheck className="w-4 h-4" aria-hidden="true" />
              ) : null}
              {detail.verification.statusLabel}
            </MetaChip>
            <MetaChip icon={User}>By {detail.sourceLabel}</MetaChip>
            <MetaChip icon={Film}>{detail.mediaTypeLabel}</MetaChip>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
          <ActionButton icon={Download} label="Download" />
          <ActionButton icon={Share2} label="Share" onClick={handleShare} />
          <ActionButton icon={FolderPlus} label="Add to Report" />
          <button
            type="button"
            aria-label="More actions"
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-zinc-300 hover:bg-white/10 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
          </button>
          {shareHint ? (
            <span className="text-xs text-emerald-400" role="status">
              {shareHint}
            </span>
          ) : null}
        </div>
      </header>

      {/* Mobile / tablet overview rail */}
      <div className="xl:hidden mb-4 sm:mb-5">
        <Panel title="Evidence Overview">
          <div className="p-2 sm:p-3">
            <OverviewNav
              detail={detail}
              nav={nav}
              onNavChange={handleNavChange}
              variant="horizontal"
            />
          </div>
        </Panel>
      </div>

      {/* Layout:
          - <lg: single column (media → side widgets → file info)
          - lg–xl: media + right rail
          - xl+: left | media | right
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 xl:gap-6">
        {/* Left sidebar (desktop only) */}
        <aside className="hidden xl:flex xl:col-span-3 flex-col gap-4 order-1">
          <Panel title="Evidence Overview">
            <OverviewNav
              detail={detail}
              nav={nav}
              onNavChange={handleNavChange}
              variant="vertical"
            />
          </Panel>
          <Panel title="File Information">
            <FileInfoList rows={fileRows} />
          </Panel>
          <IntegrityCard message={detail.integrityMessage} />
        </aside>

        {/* Center */}
        <div className="lg:col-span-7 xl:col-span-6 flex flex-col gap-4 order-1 lg:order-2">
          <div className="rounded-xl border border-white/12 bg-[#0A0A0C] overflow-hidden">
            <div className="relative aspect-video bg-black group touch-manipulation">
              <Image
                src={activeThumb}
                alt={`Preview of ${detail.title}`}
                fill
                priority
                quality={75}
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 66vw, 720px"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"
                aria-hidden="true"
              />

              {detail.status === "verified" ? (
                <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 inline-flex items-center gap-1 rounded-md bg-emerald-500/90 px-2 py-1 text-[11px] font-semibold text-white shadow-lg">
                  <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  Verified
                </span>
              ) : null}

              <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
                <PlayerIconButton label="Download media" icon={Download} />
                <PlayerIconButton label="Expand" icon={Maximize2} />
              </div>

              <button
                type="button"
                aria-label={playing ? "Pause" : "Play"}
                onClick={() => setPlaying((p) => !p)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/90 text-black shadow-xl transition-transform hover:scale-105">
                  {playing ? (
                    <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" aria-hidden="true" />
                  ) : (
                    <Play
                      className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </button>

              <div className="absolute inset-x-0 bottom-0 px-2.5 sm:px-3 pb-2.5 sm:pb-3 pt-8 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                <div
                  className="h-1 rounded-full bg-white/20 mb-2.5 overflow-hidden pointer-events-auto"
                  role="progressbar"
                  aria-valuenow={Math.round(progress * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Playback progress"
                >
                  <div
                    className="h-full rounded-full bg-[#3B82F6] transition-[width] duration-200"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-white pointer-events-auto">
                  <button
                    type="button"
                    aria-label={playing ? "Pause" : "Play"}
                    onClick={() => setPlaying((p) => !p)}
                    className="min-h-9 min-w-9 inline-flex items-center justify-center hover:text-[#93C5FD] transition-colors"
                  >
                    {playing ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                  </button>
                  <span className="text-[11px] sm:text-xs tabular-nums text-zinc-200">
                    {formatTimecode(currentSeconds)} /{" "}
                    {formatTimecode(detail.durationSeconds)}
                  </span>
                  <div className="flex-1" />
                  <Volume2 className="w-4 h-4 text-zinc-300" aria-hidden="true" />
                  <Settings className="w-4 h-4 text-zinc-300 hidden sm:block" aria-hidden="true" />
                  <Maximize2 className="w-4 h-4 text-zinc-300" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto overscroll-x-contain p-2.5 sm:p-3 border-t border-white/10 scrollbar-hide snap-x snap-mandatory">
              {detail.filmstrip.map((frame, index) => {
                const active = index === activeFrame;
                return (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => selectFrame(index)}
                    aria-label={`Jump to ${frame.timeLabel}`}
                    aria-pressed={active}
                    className={cn(
                      "relative shrink-0 w-[80px] sm:w-[100px] aspect-video rounded-md overflow-hidden border-2 transition-colors snap-start",
                      active
                        ? "border-[#3B82F6]"
                        : "border-transparent hover:border-white/30"
                    )}
                  >
                    <Image
                      src={frame.thumbnailUrl}
                      alt=""
                      fill
                      loading="lazy"
                      className="object-cover"
                      sizes="100px"
                    />
                    <span className="absolute bottom-1 left-1 rounded bg-black/75 px-1 py-0.5 text-[10px] font-medium text-white tabular-nums">
                      {frame.timeLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Panel>
            <div
              role="tablist"
              aria-label="Evidence content"
              className="flex gap-1 px-2 sm:px-3 pt-2 sm:pt-3 border-b border-white/10 overflow-x-auto scrollbar-hide"
            >
              {CONTENT_TABS.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setTab(t.id);
                      if (t.id === "verifications") setNav("verifications");
                      else if (t.id === "comments") setNav("comments");
                      else if (t.id === "description" || t.id === "context")
                        setNav("details");
                    }}
                    className={cn(
                      "shrink-0 min-h-10 px-3 sm:px-3.5 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                      active
                        ? "border-[#3B82F6] text-white"
                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className="px-3 sm:px-4 py-4" role="tabpanel">
              {tab === "description" ? (
                <>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {detail.description}
                  </p>
                  <TagList tags={detail.tags} className="mt-4" />
                </>
              ) : null}
              {tab === "context" ? (
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {detail.context}
                </p>
              ) : null}
              {tab === "metadata" ? <FileInfoList rows={fileRows} /> : null}
              {tab === "verifications" ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <BadgeCheck
                      className={cn("w-5 h-5 mt-0.5", statusTone)}
                      aria-hidden="true"
                    />
                    <div>
                      <p className={cn("text-sm font-semibold", statusTone)}>
                        {detail.verification.statusLabel}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {detail.verification.verifiedAtLabel}
                      </p>
                      <p className="mt-2 text-sm text-zinc-400">
                        {detail.verification.communityLabel}
                      </p>
                    </div>
                  </div>
                  {detail.verification.verifiers.length > 0 ? (
                    <ul className="space-y-2">
                      {detail.verification.verifiers.map((v) => (
                        <li
                          key={v.id}
                          className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-3 py-2.5"
                        >
                          <span
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                            style={{ backgroundColor: v.color }}
                          >
                            {v.initials}
                          </span>
                          <span className="text-sm text-zinc-200">{v.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-zinc-500">
                      No verifiers yet for this file.
                    </p>
                  )}
                </div>
              ) : null}
              {tab === "comments" ? (
                <ul className="space-y-3">
                  {detail.comments.map((c) => (
                    <li
                      key={c.id}
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-3"
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: c.color }}
                        >
                          {c.initials}
                        </span>
                        <span className="text-sm font-medium text-white">
                          {c.author}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {c.timeLabel}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed">
                        {c.body}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Panel>

          {nav === "location" ? (
            <Panel title="Location details">
              <div className="p-4 space-y-2 text-sm">
                <p className="font-medium text-white">{detail.location.placeName}</p>
                <p className="text-zinc-300 tabular-nums">
                  {detail.location.coordinatesLabel}
                </p>
                <p className="text-zinc-400">{detail.location.address}</p>
                <p className="text-xs text-zinc-500">
                  Accuracy: {detail.location.accuracyMeters} meters
                </p>
              </div>
            </Panel>
          ) : null}

          {nav === "related" ? (
            <Panel title="Related Evidence">
              {detail.related.length > 0 ? (
                <div className="border-b border-white/10 px-3 py-2.5">
                  <Link
                    href={compareHref([
                      { eventId: detail.eventId, evidenceId: detail.id },
                      ...detail.related.slice(0, 2).map((item) => ({
                        eventId: detail.eventId,
                        evidenceId: item.id,
                      })),
                    ])}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#60A5FA] hover:text-[#93C5FD]"
                  >
                    <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
                    Compare with related
                  </Link>
                </div>
              ) : null}
              <ul className="divide-y divide-white/10">
                {detail.related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/events/${detail.eventId}/evidence/${item.id}${fromExplorer ? "?from=explorer" : ""}`}
                      className="flex gap-3 px-3 py-3 hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="relative h-14 w-[72px] shrink-0 rounded-md overflow-hidden border border-white/10">
                        <Image
                          src={item.thumbnailUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="72px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          {item.typeLabel} · {item.duration}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}

          {(nav === "timeline" || nav === "reports" || nav === "history") && (
            <Panel title={nav.charAt(0).toUpperCase() + nav.slice(1)}>
              <p className="px-4 py-5 text-sm text-zinc-400">
                {nav === "timeline" &&
                  `${detail.navCounts.timeline} timeline markers linked to this file.`}
                {nav === "reports" &&
                  `${detail.navCounts.reports} reports reference this evidence.`}
                {nav === "history" &&
                  `${detail.navCounts.history} history events recorded for this file.`}
              </p>
            </Panel>
          )}

          <Panel title="Notes">
            <div className="px-3 sm:px-4 py-4 space-y-3">
              <p className="text-sm text-zinc-300 leading-relaxed">
                {detail.notes}
              </p>
              <div className="relative">
                <label htmlFor={noteId} className="sr-only">
                  Add an internal note
                </label>
                <textarea
                  id={noteId}
                  rows={2}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Add an internal note..."
                  className="w-full min-h-[72px] resize-y rounded-lg border border-white/12 bg-black/40 px-3 py-2.5 pr-10 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
                />
                <Pencil
                  className="absolute right-3 top-3 w-4 h-4 text-zinc-500 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </Panel>

          {/* File info + integrity on <xl (moved from left) */}
          <div className="xl:hidden flex flex-col gap-4">
            <Panel title="File Information">
              <FileInfoList rows={fileRows} />
            </Panel>
            <IntegrityCard message={detail.integrityMessage} />
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="lg:col-span-5 xl:col-span-3 flex flex-col gap-4 order-3">
          <Panel>
            <div className="px-3 sm:px-4 py-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    detail.status === "verified"
                      ? "bg-emerald-500/15"
                      : "bg-amber-500/15"
                  )}
                >
                  <BadgeCheck
                    className={cn(
                      "w-5 h-5",
                      detail.status === "verified"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    )}
                    aria-hidden="true"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">
                    Verification Status
                  </p>
                  <p className={cn("mt-0.5 text-sm font-medium", statusTone)}>
                    {detail.verification.statusLabel}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {detail.verification.verifiedAtLabel}
                  </p>
                </div>
              </div>

              {detail.verification.verifiers.length > 0 ? (
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {detail.verification.verifiers.map((v) => (
                      <span
                        key={v.id}
                        title={v.name}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#121214] text-[10px] font-bold text-white"
                        style={{ backgroundColor: v.color }}
                      >
                        {v.initials}
                      </span>
                    ))}
                    {detail.verification.extraCount > 0 ? (
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#121214] bg-zinc-700 text-[10px] font-semibold text-zinc-200">
                        +{detail.verification.extraCount}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-zinc-400 leading-snug min-w-0">
                    {detail.verification.communityLabel}
                  </p>
                </div>
              ) : null}

              <Link
                href="/verification"
                className="mt-4 w-full min-h-10 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/12 bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-zinc-200 hover:bg-white/[0.08] transition-colors"
              >
                Open Verification Dashboard
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </Panel>

          <Panel title="Location">
            <div className="p-3">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-white/10 bg-[#0B1220]">
                <Image
                  src={detail.mapThumbnailUrl}
                  alt=""
                  fill
                  loading="lazy"
                  className="object-cover opacity-40 saturate-50"
                  sizes="(max-width: 1024px) 100vw, 320px"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                  aria-hidden="true"
                />
                <div
                  className="absolute -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${detail.location.mapPinX}%`,
                    top: `${detail.location.mapPinY}%`,
                  }}
                >
                  <MapPin
                    className="w-7 h-7 text-[#3B82F6] fill-[#3B82F6]/30 drop-shadow-lg"
                    aria-hidden="true"
                  />
                </div>
                <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white">
                  {detail.location.placeName}
                </span>
              </div>

              <div className="mt-3 space-y-2 px-1">
                <p className="text-sm font-medium text-white tabular-nums break-all">
                  {detail.location.coordinatesLabel}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {detail.location.address}
                </p>
                <p className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                  <MapIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  Accuracy: {detail.location.accuracyMeters} meters
                </p>
              </div>
            </div>
          </Panel>

          <Panel title="Related Evidence">
            {detail.related.length === 0 ? (
              <p className="px-4 py-4 text-sm text-zinc-500">
                No related evidence yet.
              </p>
            ) : (
              <>
                <div className="border-b border-white/10 px-3 py-2.5">
                  <Link
                    href={compareHref([
                      { eventId: detail.eventId, evidenceId: detail.id },
                      ...detail.related.slice(0, 2).map((item) => ({
                        eventId: detail.eventId,
                        evidenceId: item.id,
                      })),
                    ])}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#60A5FA] hover:text-[#93C5FD]"
                  >
                    <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
                    Compare with related
                  </Link>
                </div>
                <ul className="divide-y divide-white/10">
                  {detail.related.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/events/${detail.eventId}/evidence/${item.id}`}
                        className="flex gap-3 px-3 py-3 hover:bg-white/[0.03] transition-colors min-h-[4.5rem]"
                      >
                        <div className="relative h-14 w-[72px] shrink-0 rounded-md overflow-hidden border border-white/10">
                          <Image
                            src={item.thumbnailUrl}
                            alt=""
                            fill
                            loading="lazy"
                            className="object-cover"
                            sizes="72px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white line-clamp-1">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-[11px] text-zinc-500">
                            {item.typeLabel} · {item.duration}
                          </p>
                          {item.verified ? (
                            <span className="mt-1 inline-flex items-center gap-0.5 text-[10px] text-emerald-400">
                              <BadgeCheck className="w-3 h-3" aria-hidden="true" />
                              Verified
                            </span>
                          ) : null}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function TagList({
  tags,
  className,
}: {
  tags: string[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-zinc-300"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function IntegrityCard({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.07] px-3 sm:px-4 py-3.5 flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
        <ShieldCheck className="w-5 h-5 text-emerald-400" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-emerald-300">
          Integrity Protected
        </p>
        <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

function PlayerIconButton({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-black/55 text-white backdrop-blur-sm hover:bg-black/75 transition-colors"
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
    </button>
  );
}
