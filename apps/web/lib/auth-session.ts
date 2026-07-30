/**
 * Client-side mock auth session (localStorage). Not real security.
 */

export const MOCK_SESSION_KEY = "openwitness_mock_session";

export interface MockSessionUser {
  email: string;
  name?: string;
  role?: string;
  createdAt: string;
}

export function getMockSession(): MockSessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(MOCK_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MockSessionUser;
  } catch {
    return null;
  }
}

export function setMockSession(user: Omit<MockSessionUser, "createdAt"> & { createdAt?: string }) {
  if (typeof window === "undefined") return;
  const payload: MockSessionUser = {
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt ?? new Date().toISOString(),
  };
  window.localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(payload));
}

export function clearMockSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(MOCK_SESSION_KEY);
}

/** Only allow same-origin relative paths (block //evil.com). */
export function safeAuthNext(
  next: string | null | undefined,
  fallback = "/events"
): string {
  if (!next) return fallback;
  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  return trimmed;
}

export const REPORT_PATH = "/report";
export const REPORT_NEXT = `/register?next=${encodeURIComponent(REPORT_PATH)}`;
export const LOGIN_NEXT_REPORT = `/login?next=${encodeURIComponent(REPORT_PATH)}`;
