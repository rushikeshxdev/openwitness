/**
 * Client-side mock profile persistence (localStorage).
 * Merged with session identity via buildProfile().
 */

import type { MockSessionUser } from "@/lib/auth-session";
import {
  buildProfile,
  defaultStoredProfile,
  type ProfileViewModel,
  type StoredProfile,
} from "@/data/profile-data";
import {
  getUnreadNotificationCount,
  markAllNotificationsRead as markCenterAllRead,
} from "@/lib/notifications-store";

export type { StoredProfile };

export const MOCK_PROFILE_KEY = "openwitness_mock_profile";

export function getStoredProfile(): StoredProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(MOCK_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredProfile;
  } catch {
    return null;
  }
}

export function setStoredProfile(patch: Partial<StoredProfile>) {
  if (typeof window === "undefined") return;
  const current = getStoredProfile() ?? {};
  const next: StoredProfile = {
    ...current,
    ...patch,
    links: { ...current.links, ...patch.links },
  };
  window.localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(next));
}

export function clearStoredProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(MOCK_PROFILE_KEY);
}

export function ensureProfileSeed(session: MockSessionUser): StoredProfile {
  const existing = getStoredProfile();
  if (existing) return existing;
  const seed = defaultStoredProfile(session);
  setStoredProfile(seed);
  return seed;
}

export function loadProfileViewModel(
  session: MockSessionUser
): ProfileViewModel {
  const stored = ensureProfileSeed(session);
  const vm = buildProfile(session, stored);

  if (stored.readNotificationIds?.length) {
    const read = new Set(stored.readNotificationIds);
    vm.notifications = vm.notifications.map((n) =>
      read.has(n.id) ? { ...n, unread: false } : n
    );
  }

  // Prefer Notifications Center unread as the shared badge source.
  vm.navCounts.notifications = getUnreadNotificationCount();

  return vm;
}

export function markAllNotificationsRead(session: MockSessionUser) {
  const vm = loadProfileViewModel(session);
  setStoredProfile({
    readNotificationIds: vm.notifications.map((n) => n.id),
  });
  markCenterAllRead();
}
