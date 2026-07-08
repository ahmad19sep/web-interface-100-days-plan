"use client";

// Per-device profile registry — several people can share one browser, each
// with their own code-locked track.
//
//  - profiles:v1 (localStorage)        → [{ id, name, salt, codeHash, created }]
//  - active-profile:v1 (sessionStorage) → id of the profile that entered its
//    code this browser session. Closing the browser (or logging out) locks
//    every track again, so the code is asked before each login.
//  - progress lives per profile under track:<challenge>:<profileId>:v1
//    (see lib/store.ts).
//
// The code is stored as a salted SHA-256 hash — never in plain text. This is
// courtesy privacy between people sharing a device, not real security: v1 has
// no backend, so anyone with devtools can read localStorage. Codes are not
// recoverable — there is no email reset in a local-only app.

import { useSyncExternalStore } from "react";
import { CHALLENGE } from "./plan";

export interface Profile {
  id: string;
  name: string;
  salt: string;
  codeHash: string;
  /** "YYYY-MM-DD" the profile was created */
  created: string;
}

export interface ProfilesState {
  /** false during SSR / before the first client read */
  ready: boolean;
  list: Profile[];
  activeId: string | null;
}

const LIST_KEY = "profiles:v1";
const SESSION_KEY = "active-profile:v1";

/** Progress key for one profile's track (consumed by lib/store.ts). */
export function trackKeyFor(profileId: string): string {
  return `track:${CHALLENGE.id}:${profileId}:v1`;
}

// Tracks written before profiles existed — adopted by the first profile
// created on the device, so nobody loses a streak to this upgrade.
const LEGACY_TRACK_KEY = `track:${CHALLENGE.id}:v1`;
const OLDEST_TRACK_KEY = "hundred-days-modern-ai-v1";

const EMPTY_STATE: ProfilesState = { ready: false, list: [], activeId: null };

let state: ProfilesState = EMPTY_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function readList(): Profile[] {
  try {
    const raw = localStorage.getItem(LIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Profile[]) : [];
  } catch {
    return [];
  }
}

function persistList(list: Profile[]) {
  try {
    localStorage.setItem(LIST_KEY, JSON.stringify(list));
  } catch {
    // storage unavailable — keep in-memory state
  }
}

function readSession(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function writeSession(id: string | null) {
  try {
    if (id) sessionStorage.setItem(SESSION_KEY, id);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

function loadOnce() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const list = readList();
  const session = readSession();
  const activeId = session && list.some((p) => p.id === session) ? session : null;
  if (session && !activeId) writeSession(null);
  state = { ready: true, list, activeId };
  window.addEventListener("storage", (e) => {
    if (e.key !== LIST_KEY) return;
    const next = readList();
    const active =
      state.activeId && next.some((p) => p.id === state.activeId)
        ? state.activeId
        : null;
    if (active !== state.activeId) writeSession(active);
    state = { ...state, list: next, activeId: active };
    emit();
  });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): ProfilesState {
  loadOnce();
  return state;
}

function getServerSnapshot(): ProfilesState {
  return EMPTY_STATE;
}

export function useProfiles(): ProfilesState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Sync accessor for non-React modules (lib/store.ts). */
export function activeProfileId(): string | null {
  loadOnce();
  return state.activeId;
}

/** Lets lib/store.ts re-read progress when the active profile changes. */
export function subscribeProfiles(cb: () => void): () => void {
  return subscribe(cb);
}

// ── code hashing ────────────────────────────────────────────────────────────

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashCode(code: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${code}`);
  // crypto.subtle exists on https and localhost; fall back to FNV-1a for
  // insecure contexts (e.g. testing over plain http on a LAN IP)
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", data);
    return `sha:${toHex(new Uint8Array(digest))}`;
  }
  let h = 0x811c9dc5;
  for (const byte of data) {
    h ^= byte;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `fnv:${h.toString(16)}`;
}

function randomId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function todayStr(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// ── legacy single-track adoption ────────────────────────────────────────────

function readLegacyTrack(): string | null {
  try {
    return (
      localStorage.getItem(LEGACY_TRACK_KEY) ??
      localStorage.getItem(OLDEST_TRACK_KEY)
    );
  } catch {
    return null;
  }
}

/** True when this device has pre-profiles progress waiting to be claimed. */
export function legacyTrackExists(): boolean {
  loadOnce();
  return state.list.length === 0 && readLegacyTrack() !== null;
}

/** Display name saved in the pre-profiles track, to prefill the claim form. */
export function legacyName(): string {
  const raw = readLegacyTrack();
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw) as { name?: unknown };
    return typeof parsed.name === "string" ? parsed.name : "";
  } catch {
    return "";
  }
}

// ── mutations ───────────────────────────────────────────────────────────────

export const MIN_CODE_LENGTH = 4;

/**
 * Create a track locked by `code` and log it in. The first profile ever
 * created on the device adopts the legacy single track, if one exists.
 */
export async function createProfile(
  name: string,
  code: string
): Promise<Profile> {
  loadOnce();
  const salt = randomId();
  const profile: Profile = {
    id: randomId(),
    name: name.trim(),
    salt,
    codeHash: await hashCode(code, salt),
    created: todayStr(),
  };
  if (state.list.length === 0) {
    const legacy = readLegacyTrack();
    if (legacy) {
      try {
        localStorage.setItem(trackKeyFor(profile.id), legacy);
        localStorage.removeItem(LEGACY_TRACK_KEY);
        localStorage.removeItem(OLDEST_TRACK_KEY);
      } catch {
        // ignore — worst case the legacy track stays where it was
      }
    }
  }
  const list = [...state.list, profile];
  persistList(list);
  writeSession(profile.id);
  state = { ready: true, list, activeId: profile.id };
  emit();
  return profile;
}

/** Try to open a profile with its code. Returns false on a wrong code. */
export async function login(id: string, code: string): Promise<boolean> {
  loadOnce();
  const profile = state.list.find((p) => p.id === id);
  if (!profile) return false;
  const hash = await hashCode(code, profile.salt);
  if (hash !== profile.codeHash) return false;
  writeSession(id);
  state = { ...state, activeId: id };
  emit();
  return true;
}

/** Lock the active track. Progress stays saved; the code reopens it. */
export function logout() {
  loadOnce();
  if (!state.activeId) return;
  writeSession(null);
  state = { ...state, activeId: null };
  emit();
}

/** Keep the login list in sync when the display name changes in Settings. */
export function renameActiveProfile(name: string) {
  loadOnce();
  if (!state.activeId) return;
  const trimmed = name.trim();
  if (!trimmed) return;
  const list = state.list.map((p) =>
    p.id === state.activeId ? { ...p, name: trimmed } : p
  );
  persistList(list);
  state = { ...state, list };
  emit();
}
