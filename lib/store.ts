"use client";

// Local-first progress store (localStorage), shared across components via
// useSyncExternalStore.
//
// Streak rules (per the design handoff):
//  - every check-in day grows the streak; rest days count too
//  - miss ONE day → the grace token bridges it, streak keeps climbing
//  - miss two+ in a row → the streak PAUSES (shown "paused", never reset to 0);
//    the next check-in resumes it from where it stood
//  - the grace token refills after 7 clean consecutive check-ins

import { useSyncExternalStore } from "react";
import { COHORT_START_DATE, DAYS, PROJECTS, type Project } from "./plan";

export type Reminder = "morning" | "evening" | "none";
export type Visibility = "public" | "private";

export interface ProgressState {
  onboarded: boolean;
  /** Display name / handle for profile + share card */
  name: string;
  github: string;
  /** "YYYY-MM-DD" — the user's personal Day 1 */
  startDate: string | null;
  joined: string | null;
  reminder: Reminder;
  visibility: Visibility;
  notesPrivate: boolean;
  /** day number → local check-in date "YYYY-MM-DD" */
  checkins: Record<number, string>;
  /** day number → private note */
  notes: Record<number, string>;
}

const KEY = "hundred-days-modern-ai-v1";
const EMPTY: ProgressState = {
  onboarded: false,
  name: "",
  github: "",
  startDate: null,
  joined: null,
  reminder: "evening",
  visibility: "public",
  notesPrivate: true,
  checkins: {},
  notes: {},
};

let state: ProgressState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage unavailable — keep in-memory state
  }
}

function loadOnce() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ProgressState>;
      if (parsed && typeof parsed === "object") {
        state = { ...EMPTY, ...parsed };
      }
    }
  } catch {
    state = EMPTY;
  }
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    try {
      state = e.newValue
        ? { ...EMPTY, ...(JSON.parse(e.newValue) as ProgressState) }
        : EMPTY;
      emit();
    } catch {
      // ignore malformed cross-tab payloads
    }
  });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): ProgressState {
  loadOnce();
  return state;
}

function getServerSnapshot(): ProgressState {
  return EMPTY;
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function set(patch: Partial<ProgressState>) {
  loadOnce();
  state = { ...state, ...patch };
  persist();
  emit();
}

// ── mutations ──────────────────────────────────────────────────────────────

export function localToday(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function completeOnboarding(opts: {
  startToday: boolean;
  reminder: Reminder;
  visibility: Visibility;
  name: string;
}) {
  loadOnce();
  set({
    onboarded: true,
    name: opts.name || state.name,
    reminder: opts.reminder,
    visibility: opts.visibility,
    startDate: state.startDate ?? (opts.startToday ? localToday() : COHORT_START_DATE),
    joined: state.joined ?? localToday(),
  });
}

export function logOut() {
  set({ onboarded: false });
}

/** Toggle a day's check-in; returns the streak count after the change. */
export function toggleDay(day: number): number {
  loadOnce();
  const checkins = { ...state.checkins };
  if (checkins[day]) delete checkins[day];
  else checkins[day] = localToday();
  set({ checkins });
  return computeStreak(checkins).streak;
}

export function setNote(day: number, text: string) {
  loadOnce();
  const notes = { ...state.notes };
  if (text.trim() === "") delete notes[day];
  else notes[day] = text;
  set({ notes });
}

export function setName(name: string) {
  set({ name });
}
export function setGithub(github: string) {
  set({ github });
}
export function setReminder(reminder: Reminder) {
  set({ reminder });
}
export function setVisibility(visibility: Visibility) {
  set({ visibility });
}
export function setNotesPrivate(notesPrivate: boolean) {
  set({ notesPrivate });
}

// ── derived ────────────────────────────────────────────────────────────────

export type StreakStatus = "none" | "active" | "grace" | "paused";

export interface StreakInfo {
  streak: number;
  status: StreakStatus;
  graceAvailable: boolean;
  /** Longest unbroken run (a 1-day miss bridged by grace doesn't break it) */
  longest: number;
}

function epochDay(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

export function computeStreak(
  checkins: Record<number, string>,
  today: string = localToday()
): StreakInfo {
  const dates = Array.from(new Set(Object.values(checkins)))
    .map(epochDay)
    .sort((a, b) => a - b);
  if (dates.length === 0)
    return { streak: 0, status: "none", graceAvailable: true, longest: 0 };

  let streak = 1;
  let chain = 1;
  let longest = 1;
  let grace = true;
  let clean = 1;

  for (let i = 1; i < dates.length; i++) {
    const gap = dates[i] - dates[i - 1];
    if (gap === 1) {
      // clean consecutive day
      streak += 1;
      chain += 1;
      clean += 1;
      if (clean >= 7) grace = true;
    } else if (gap === 2) {
      // one missed day — grace bridges it
      streak += 2;
      chain += 2;
      grace = false;
      clean = 1;
    } else {
      // two+ missed days — the streak paused, then resumed here.
      // Missed days don't count against you; the count just continues.
      streak += 1;
      chain = 1;
      grace = false;
      clean = 1;
    }
    longest = Math.max(longest, chain);
  }
  longest = Math.max(longest, chain);

  const sinceLast = epochDay(today) - dates[dates.length - 1];
  const status: StreakStatus =
    sinceLast <= 1 ? "active" : sinceLast === 2 && grace ? "grace" : "paused";

  return { streak, status, graceAvailable: grace, longest };
}

/** First incomplete day (1–100); 101 when the whole track is done. */
export function currentDay(checkins: Record<number, string>): number {
  for (let n = 1; n <= 100; n++) if (!checkins[n]) return n;
  return 101;
}

/** Where the schedule/cohort says you "should" be, from your start date. */
export function expectedDay(
  startDate: string | null,
  today: string = localToday()
): number {
  if (!startDate) return 1;
  const diff = epochDay(today) - epochDay(startDate);
  return Math.max(1, Math.min(100, diff + 1));
}

export type DayState = "done" | "current" | "locked";

export function dayState(
  n: number,
  checkins: Record<number, string>,
  current: number
): DayState {
  if (checkins[n]) return "done";
  if (n === current) return "current";
  return "locked";
}

export type ProjectStatus = "shipped" | "progress" | "locked";

export function projectStatus(
  p: Project,
  checkins: Record<number, string>,
  current: number
): ProjectStatus {
  if (checkins[p.shipDay]) return "shipped";
  const doneIn = DAYS.filter(
    (d) => d.day >= p.start && d.day <= p.end && checkins[d.day]
  ).length;
  if (doneIn > 0 || (current >= p.start && current <= p.end)) return "progress";
  return "locked";
}

export function projectDone(
  p: Project,
  checkins: Record<number, string>
): number {
  let c = 0;
  for (let n = p.start; n <= p.end; n++) if (checkins[n]) c++;
  return c;
}

/** Projects shipped out of P1–P8 (capstone tracked separately). */
export function shippedCount(checkins: Record<number, string>): number {
  return PROJECTS.filter((p) => p.id !== "CAP" && checkins[p.shipDay]).length;
}
