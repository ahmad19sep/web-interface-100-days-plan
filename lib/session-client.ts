"use client";

// The one client-side store behind both lib/profiles.ts (who's logged in)
// and lib/store.ts (their progress) — a single fetch of /api/auth/me backs
// both, since the server returns profile + checkins + notes together.

import { useSyncExternalStore } from "react";

export type Reminder = "morning" | "evening" | "none";
export type Visibility = "public" | "private";

export interface Profile {
  id: string;
  handle: string;
  name: string;
  github: string;
  reminder: Reminder;
  visibility: Visibility;
  notesPrivate: boolean;
  startDate: string | null;
  joined: string;
  onboarded: boolean;
}

export interface Snapshot {
  profile: Profile;
  checkins: Record<number, string>;
  notes: Record<number, string>;
}

export const MIN_CODE_LENGTH = 4;
export const HANDLE_RE = /^[a-z0-9_-]{3,24}$/;

interface State {
  ready: boolean;
  snapshot: Snapshot | null;
}

let state: State = { ready: false, snapshot: null };
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function setState(next: State) {
  state = next;
  emit();
}

async function parseOrThrow(res: Response): Promise<Record<string, unknown>> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body.error as string) || "Something went wrong.");
  return body;
}

function ensureLoaded() {
  if (loading || typeof window === "undefined") return;
  loading = fetch("/api/auth/me")
    .then((res) => res.json())
    .then((body: { profile: Profile | null; checkins?: Record<number, string>; notes?: Record<number, string> }) => {
      setState({
        ready: true,
        snapshot: body.profile
          ? { profile: body.profile, checkins: body.checkins ?? {}, notes: body.notes ?? {} }
          : null,
      });
    })
    .catch(() => setState({ ready: true, snapshot: null }));
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  ensureLoaded();
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): State {
  ensureLoaded();
  return state;
}

function getServerSnapshot(): State {
  return { ready: false, snapshot: null };
}

export function useSession(): State {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Sync read for mutation helpers outside React. */
export function currentSnapshot(): Snapshot | null {
  return state.snapshot;
}

export async function signup(
  handle: string,
  name: string,
  code: string
): Promise<Snapshot> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ handle, name, code }),
  });
  const body = (await parseOrThrow(res)) as unknown as Snapshot;
  setState({ ready: true, snapshot: body });
  return body;
}

export async function login(handle: string, code: string): Promise<Snapshot> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ handle, code }),
  });
  const body = (await parseOrThrow(res)) as unknown as Snapshot;
  setState({ ready: true, snapshot: body });
  return body;
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  setState({ ready: true, snapshot: null });
}

interface OptimisticPatch {
  profile?: Partial<Profile>;
  checkins?: Record<number, string>;
  notes?: Record<number, string>;
}

/** Apply a change to the in-memory snapshot immediately (before the server confirms it). */
export function applyOptimistic(patch: OptimisticPatch): void {
  const prev = state.snapshot;
  if (!prev) return;
  setState({
    ready: true,
    snapshot: {
      profile: patch.profile ? { ...prev.profile, ...patch.profile } : prev.profile,
      checkins: patch.checkins ?? prev.checkins,
      notes: patch.notes ?? prev.notes,
    },
  });
}

/** Send the change to the server; on failure, re-sync from /api/auth/me. */
export async function persist(request: () => Promise<Response>): Promise<void> {
  try {
    const res = await request();
    const body = await parseOrThrow(res);
    const prev = state.snapshot;
    if (!prev) return;
    setState({
      ready: true,
      snapshot: {
        profile: (body.profile as Profile) ?? prev.profile,
        checkins: (body.checkins as Record<number, string>) ?? prev.checkins,
        notes: (body.notes as Record<number, string>) ?? prev.notes,
      },
    });
  } catch {
    loading = null;
    ensureLoaded();
  }
}
