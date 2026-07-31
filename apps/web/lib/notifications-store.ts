/**
 * Client-side notifications persistence (localStorage).
 */

import {
  getSeedNotifications,
  type AppNotification,
} from "@/data/notifications-data";

export const MOCK_NOTIFICATIONS_KEY = "openwitness_mock_notifications";
export const NOTIFICATIONS_CHANGED_EVENT = "openwitness:notifications";

export interface StoredNotifications {
  readIds: string[];
  /** Optional dismissals for future use */
  dismissedIds?: string[];
}

function emitChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}

function readStore(): StoredNotifications {
  if (typeof window === "undefined") return { readIds: [] };
  try {
    const raw = window.localStorage.getItem(MOCK_NOTIFICATIONS_KEY);
    if (!raw) return { readIds: [] };
    const parsed = JSON.parse(raw) as StoredNotifications;
    return {
      readIds: Array.isArray(parsed.readIds) ? parsed.readIds : [],
      dismissedIds: Array.isArray(parsed.dismissedIds)
        ? parsed.dismissedIds
        : [],
    };
  } catch {
    return { readIds: [] };
  }
}

function writeStore(next: StoredNotifications) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MOCK_NOTIFICATIONS_KEY, JSON.stringify(next));
}

export function loadNotifications(): AppNotification[] {
  const seed = getSeedNotifications();
  const { readIds, dismissedIds = [] } = readStore();
  const read = new Set(readIds);
  const dismissed = new Set(dismissedIds);

  return seed
    .filter((n) => !dismissed.has(n.id))
    .map((n) => (read.has(n.id) ? { ...n, unread: false } : n));
}

export function getUnreadNotificationCount(): number {
  return loadNotifications().filter((n) => n.unread).length;
}

export function markNotificationRead(id: string) {
  const store = readStore();
  if (store.readIds.includes(id)) return;
  writeStore({ ...store, readIds: [...store.readIds, id] });
  emitChanged();
}

export function markAllNotificationsRead() {
  const ids = getSeedNotifications().map((n) => n.id);
  const store = readStore();
  writeStore({ ...store, readIds: Array.from(new Set([...store.readIds, ...ids])) });
  emitChanged();
}

export function clearNotificationsStore() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(MOCK_NOTIFICATIONS_KEY);
}
