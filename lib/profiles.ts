"use client";

// Account layer — everyone has their own device (phone/laptop), so accounts
// live in the shared database (see db/schema.sql), not per-device
// localStorage. A username + personal code is checked server-side
// (app/api/auth/*) and opens a session cookie good for 180 days.

import {
  HANDLE_RE,
  MIN_CODE_LENGTH,
  useSession,
  type Profile,
} from "./session-client";
import * as session from "./session-client";

export { HANDLE_RE, MIN_CODE_LENGTH, type Profile };

export interface ProfilesState {
  ready: boolean;
  activeId: string | null;
}

export function useProfiles(): ProfilesState {
  const { ready, snapshot } = useSession();
  return { ready, activeId: snapshot?.profile.id ?? null };
}

/** Create an account and log in. Throws with a user-facing message on failure. */
export async function signup(
  handle: string,
  name: string,
  code: string,
  avatar: string
) {
  await session.signup(handle, name, code, avatar);
}

/** Log in to an existing account. Throws with a user-facing message on failure. */
export async function login(handle: string, code: string) {
  await session.login(handle, code);
}

export async function logout() {
  await session.logout();
}
