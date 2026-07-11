// People sign in with their NAME — the unique handle derives from it.
// Shared by the landing login form and the /start onboarding flow.

import { HANDLE_RE } from "./session-client";

export function nameToHandle(raw: string): string {
  const cleaned = raw.trim().toLowerCase();
  if (HANDLE_RE.test(cleaned)) return cleaned;
  return cleaned.replace(/[^a-z0-9]+/g, "").slice(0, 24);
}
