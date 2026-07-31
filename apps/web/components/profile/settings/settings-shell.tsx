"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  SETTINGS_NAV,
  getInitials,
  type ProfileViewModel,
  type SettingsSectionId,
} from "@/data/profile-data";
import {
  clearStoredProfile,
  setStoredProfile,
} from "@/lib/profile-store";
import {
  clearMockSession,
  setMockSession,
  type MockSessionUser,
} from "@/lib/auth-session";
import { ProfilePanel } from "../profile-gate";
import { BadgeCheck, MapPin } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-white/12 bg-black/40 px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]";

export function SettingsShell({
  profile,
  session,
  refresh,
}: {
  profile: ProfileViewModel;
  session: MockSessionUser;
  refresh: () => void;
}) {
  const search = useSearchParams();
  const section = (search.get("section") as SettingsSectionId) || "account";
  const active = SETTINGS_NAV.some((s) => s.id === section) ? section : "account";

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <aside className="lg:col-span-3">
        <SettingsNav active={active} />
      </aside>
      <div className="min-w-0 space-y-5 lg:col-span-6">
        {active === "account" ? (
          <SettingsAccountForm
            profile={profile}
            session={session}
            refresh={refresh}
          />
        ) : null}
        {active === "profile" ? (
          <SettingsProfileForm
            profile={profile}
            session={session}
            refresh={refresh}
          />
        ) : null}
        {active === "notifications" ? (
          <SettingsToggles
            title="Notifications"
            profile={profile}
            refresh={refresh}
            fields={[
              {
                key: "emailUpdates",
                label: "Email updates",
                hint: "Digest of verified events and report status",
              },
              {
                key: "pushNotifications",
                label: "Push notifications",
                hint: "Browser alerts for mentions and verifications",
              },
              {
                key: "followPublicEvents",
                label: "Follow public events",
                hint: "Auto-follow events you report or verify",
              },
            ]}
          />
        ) : null}
        {active === "privacy" ? (
          <SettingsToggles
            title="Privacy"
            profile={profile}
            refresh={refresh}
            fields={[
              {
                key: "profilePublic",
                label: "Public profile",
                hint: "Allow others to view your profile page",
              },
              {
                key: "showLocation",
                label: "Show location",
                hint: "Display city on your public profile",
              },
            ]}
          />
        ) : null}
        {active === "security" ? (
          <SettingsToggles
            title="Security"
            profile={profile}
            refresh={refresh}
            fields={[
              {
                key: "twoFactorEnabled",
                label: "Two-factor authentication",
                hint: "Require a second step at sign-in (demo toggle)",
              },
            ]}
          />
        ) : null}
        {active === "connected" ? (
          <SettingsConnected profile={profile} refresh={refresh} />
        ) : null}
        {active === "appearance" ? (
          <SettingsAppearance profile={profile} refresh={refresh} />
        ) : null}
      </div>
      <aside className="space-y-4 lg:col-span-3">
        <ProfilePreviewCard profile={profile} />
        <AccountStatsCard profile={profile} />
        <DangerZone />
      </aside>
    </div>
  );
}

function SettingsNav({ active }: { active: SettingsSectionId }) {
  return (
    <nav
      aria-label="Settings"
      className="overflow-hidden rounded-2xl border border-white/12 bg-[#121214]/90"
    >
      <div className="flex gap-1 overflow-x-auto p-2 scrollbar-hide lg:flex-col">
        {SETTINGS_NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              href={`/profile/settings?section=${item.id}`}
              className={cn(
                "inline-flex min-h-10 shrink-0 items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#2563EB]/20 text-white"
                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function EditableRow({
  label,
  value,
  multiline,
  onSave,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  onSave: (next: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  return (
    <div className="border-b border-white/10 px-4 py-4 last:border-b-0 sm:px-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {label}
          </p>
          {editing ? (
            multiline ? (
              <textarea
                rows={3}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className={cn(inputClass, "mt-2")}
              />
            ) : (
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className={cn(inputClass, "mt-2")}
              />
            )
          ) : (
            <p className="mt-1.5 text-sm text-zinc-200 break-words">{value || "—"}</p>
          )}
        </div>
        {editing ? (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => {
                onSave(draft.trim());
                setEditing(false);
              }}
              className="rounded-lg bg-[#3B82F6] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2563EB]"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(value);
                setEditing(false);
              }}
              className="rounded-lg border border-white/12 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDraft(value);
              setEditing(true);
            }}
            className="shrink-0 text-xs font-medium text-[#60A5FA] hover:text-[#93C5FD]"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

function SettingsAccountForm({
  profile,
  session,
  refresh,
}: {
  profile: ProfileViewModel;
  session: MockSessionUser;
  refresh: () => void;
}) {
  const s = profile.settings;

  return (
    <ProfilePanel title="Account Settings">
      <EditableRow
        label="Username"
        value={s.username}
        onSave={(username) => {
          setStoredProfile({ handle: username });
          refresh();
        }}
      />
      <EditableRow
        label="Email"
        value={s.email}
        onSave={(email) => {
          setStoredProfile({ email });
          setMockSession({
            email,
            name: profile.name,
            role: session.role,
            createdAt: session.createdAt,
          });
          refresh();
        }}
      />
      <EditableRow
        label="Bio"
        value={s.bio}
        multiline
        onSave={(bio) => {
          setStoredProfile({ bio });
          refresh();
        }}
      />
      <EditableRow
        label="Location"
        value={s.location}
        onSave={(location) => {
          setStoredProfile({ location });
          refresh();
        }}
      />
      <EditableRow
        label="Language"
        value={s.language}
        onSave={(language) => {
          setStoredProfile({ language });
          refresh();
        }}
      />
    </ProfilePanel>
  );
}

function SettingsProfileForm({
  profile,
  session,
  refresh,
}: {
  profile: ProfileViewModel;
  session: MockSessionUser;
  refresh: () => void;
}) {
  const save = (patch: Record<string, string>) => {
    setStoredProfile(patch);
    if (patch.name) {
      setMockSession({
        email: session.email,
        name: patch.name,
        role: session.role,
        createdAt: session.createdAt,
      });
    }
    refresh();
  };

  return (
    <ProfilePanel title="Profile">
      <EditableRow
        label="Display name"
        value={profile.name}
        onSave={(name) => save({ name })}
      />
      <EditableRow
        label="Bio"
        value={profile.bio}
        multiline
        onSave={(bio) => save({ bio })}
      />
      <EditableRow
        label="Location"
        value={profile.location}
        onSave={(location) => save({ location })}
      />
      <EditableRow
        label="GitHub"
        value={profile.links.github || ""}
        onSave={(github) => {
          setStoredProfile({ links: { github } });
          refresh();
        }}
      />
      <EditableRow
        label="Website"
        value={profile.links.website || ""}
        onSave={(website) => {
          setStoredProfile({ links: { website } });
          refresh();
        }}
      />
    </ProfilePanel>
  );
}

function SettingsToggles({
  title,
  profile,
  refresh,
  fields,
}: {
  title: string;
  profile: ProfileViewModel;
  refresh: () => void;
  fields: {
    key: keyof ProfileViewModel["settings"];
    label: string;
    hint: string;
  }[];
}) {
  return (
    <ProfilePanel title={title}>
      <ul className="divide-y divide-white/10">
        {fields.map((f) => {
          const checked = Boolean(profile.settings[f.key]);
          return (
            <li
              key={f.key}
              className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5"
            >
              <div>
                <p className="text-sm font-medium text-white">{f.label}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{f.hint}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => {
                  setStoredProfile({ [f.key]: !checked } as never);
                  refresh();
                }}
                className={cn(
                  "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                  checked ? "bg-[#3B82F6]" : "bg-zinc-700"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform",
                    checked ? "left-5" : "left-0.5"
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </ProfilePanel>
  );
}

function SettingsConnected({
  profile,
  refresh,
}: {
  profile: ProfileViewModel;
  refresh: () => void;
}) {
  const rows = useMemo(
    () => [
      {
        key: "connectedGithub" as const,
        label: "GitHub",
        connected: profile.settings.connectedGithub,
      },
      {
        key: "connectedTwitter" as const,
        label: "Twitter / X",
        connected: profile.settings.connectedTwitter,
      },
      {
        key: "connectedLinkedin" as const,
        label: "LinkedIn",
        connected: profile.settings.connectedLinkedin,
      },
    ],
    [profile.settings]
  );

  return (
    <ProfilePanel title="Connected Accounts">
      <ul className="divide-y divide-white/10">
        {rows.map((r) => (
          <li
            key={r.key}
            className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5"
          >
            <div>
              <p className="text-sm font-medium text-white">{r.label}</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {r.connected ? "Connected" : "Not connected"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setStoredProfile({ [r.key]: !r.connected });
                refresh();
              }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold",
                r.connected
                  ? "border border-white/12 text-zinc-300 hover:bg-white/5"
                  : "bg-[#3B82F6] text-white hover:bg-[#2563EB]"
              )}
            >
              {r.connected ? "Disconnect" : "Connect"}
            </button>
          </li>
        ))}
      </ul>
    </ProfilePanel>
  );
}

function SettingsAppearance({
  profile,
  refresh,
}: {
  profile: ProfileViewModel;
  refresh: () => void;
}) {
  return (
    <ProfilePanel title="Appearance">
      <div className="space-y-4 px-4 py-4 sm:px-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Theme
          </p>
          <div className="mt-2 flex gap-2">
            {(["dark", "system"] as const).map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => {
                  setStoredProfile({ theme });
                  refresh();
                }}
                className={cn(
                  "rounded-xl border px-4 py-2 text-sm capitalize",
                  profile.settings.theme === theme
                    ? "border-[#3B82F6]/50 bg-[#2563EB]/20 text-white"
                    : "border-white/12 text-zinc-400 hover:bg-white/5"
                )}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center justify-between gap-3">
          <span>
            <span className="block text-sm font-medium text-white">
              Compact mode
            </span>
            <span className="mt-0.5 block text-xs text-zinc-500">
              Reduce spacing in lists and cards
            </span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={profile.settings.compactMode}
            onClick={() => {
              setStoredProfile({
                compactMode: !profile.settings.compactMode,
              });
              refresh();
            }}
            className={cn(
              "relative h-7 w-12 shrink-0 rounded-full transition-colors",
              profile.settings.compactMode ? "bg-[#3B82F6]" : "bg-zinc-700"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform",
                profile.settings.compactMode ? "left-5" : "left-0.5"
              )}
            />
          </button>
        </label>
      </div>
    </ProfilePanel>
  );
}

function ProfilePreviewCard({ profile }: { profile: ProfileViewModel }) {
  return (
    <ProfilePanel title="Profile Preview">
      <div className="px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6]/20 text-sm font-bold text-[#93C5FD]">
            {getInitials(profile.name)}
          </div>
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1 text-sm font-semibold text-white">
              {profile.name}
              {profile.verified ? (
                <BadgeCheck className="h-4 w-4 text-[#3B82F6]" aria-hidden="true" />
              ) : null}
            </p>
            <p className="text-xs text-zinc-500">@{profile.handle}</p>
          </div>
        </div>
        <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-zinc-400">
          {profile.bio}
        </p>
        <p className="mt-2 inline-flex items-center gap-1 text-xs text-zinc-500">
          <MapPin className="h-3 w-3" aria-hidden="true" />
          {profile.location}
        </p>
      </div>
    </ProfilePanel>
  );
}

function AccountStatsCard({ profile }: { profile: ProfileViewModel }) {
  const rows = [
    { label: "Member since", value: profile.memberSinceLabel },
    { label: "Reports", value: String(profile.stats.reports) },
    { label: "Contributions", value: String(profile.navCounts.contributions) },
    { label: "Verifications", value: String(profile.stats.verifications) },
  ];
  return (
    <ProfilePanel title="Account Stats">
      <dl className="space-y-2.5 px-4 py-4 sm:px-5">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-3 text-sm">
            <dt className="text-zinc-500">{r.label}</dt>
            <dd className="text-zinc-200 tabular-nums">{r.value}</dd>
          </div>
        ))}
      </dl>
    </ProfilePanel>
  );
}

function DangerZone() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="rounded-2xl border border-red-500/25 bg-red-500/[0.06] p-4">
      <p className="text-sm font-semibold text-red-300">Danger Zone</p>
      <p className="mt-1 text-xs text-zinc-400">
        Permanently delete your mock account and local profile data.
      </p>
      {confirming ? (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => {
              clearMockSession();
              clearStoredProfile();
              router.push("/");
            }}
            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Confirm delete
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-xl border border-white/12 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-red-500/40 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10"
        >
          Delete Account
        </button>
      )}
    </div>
  );
}
