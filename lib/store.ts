"use client";

// Progress store — backed by the shared account database (see
// db/schema.sql, app/api/**), not localStorage. Every mutation updates the
// in-memory snapshot immediately (so typing/checking-in feels instant) and
// persists to the server in the background; see lib/session-client.ts.
//
// Streak rules (per the design handoff):
//  - every check-in day grows the streak; rest days count too
//  - miss ONE day → the grace token bridges it, streak keeps climbing
//  - miss two+ in a row → the streak PAUSES (shown "paused", never reset to 0);
//    the next check-in resumes it from where it stood
//  - the grace token refills after 7 clean consecutive check-ins

import { COHORT_START_DATE } from "./plan";
import {
  computeStreak,
  currentDay,
  dayState,
  expectedDay,
  isLocked,
  localToday,
  projectDone,
  projectStatus,
  shippedCount,
  type DayState,
  type ProjectStatus,
  type StreakInfo,
  type StreakStatus,
} from "./progress";
import {
  applyOptimistic,
  currentSnapshot,
  persist,
  submitQuiz as submitQuizToServer,
  useSession,
  type Reminder,
  type Visibility,
} from "./session-client";
import { gradeDayQuiz, type GradedQuestion } from "./quiz";

export type { Reminder, Visibility };
export {
  computeStreak,
  currentDay,
  dayState,
  expectedDay,
  gradeDayQuiz,
  isLocked,
  localToday,
  projectDone,
  projectStatus,
  shippedCount,
};
export type { DayState, GradedQuestion, ProjectStatus, StreakInfo, StreakStatus };

export interface ProgressState {
  onboarded: boolean;
  isOwner: boolean;
  handle: string;
  avatar: string;
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
  /** day number → questionIndex → selectedIndex */
  quizAnswers: Record<number, Record<number, number>>;
}

const EMPTY: ProgressState = {
  onboarded: false,
  isOwner: false,
  handle: "",
  avatar: "bot",
  name: "",
  github: "",
  startDate: null,
  joined: null,
  reminder: "evening",
  visibility: "public",
  notesPrivate: true,
  checkins: {},
  notes: {},
  quizAnswers: {},
};

export function useProgress(): ProgressState {
  const { snapshot } = useSession();
  if (!snapshot) return EMPTY;
  const p = snapshot.profile;
  return {
    onboarded: p.onboarded,
    isOwner: p.isOwner,
    handle: p.handle,
    avatar: p.avatar,
    name: p.name,
    github: p.github,
    startDate: p.startDate,
    joined: p.joined,
    reminder: p.reminder,
    visibility: p.visibility,
    notesPrivate: p.notesPrivate,
    checkins: snapshot.checkins,
    notes: snapshot.notes,
    quizAnswers: snapshot.quizAnswers,
  };
}

async function patchProfile(body: Record<string, unknown>): Promise<void> {
  await persist(() =>
    fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  );
}

// Debounce noisy per-keystroke saves (notes, display name) so the UI stays
// instant locally without spamming the API on every character typed.
const debouncers = new Map<string, ReturnType<typeof setTimeout>>();
function debounced(key: string, ms: number, run: () => void) {
  const existing = debouncers.get(key);
  if (existing) clearTimeout(existing);
  debouncers.set(
    key,
    setTimeout(() => {
      debouncers.delete(key);
      run();
    }, ms)
  );
}

// ── mutations ──────────────────────────────────────────────────────────────

export async function completeOnboarding(opts: {
  startToday: boolean;
  reminder: Reminder;
  visibility: Visibility;
  name: string;
}) {
  const snap = currentSnapshot();
  const startDate =
    snap?.profile.startDate ??
    (opts.startToday ? localToday() : COHORT_START_DATE);
  const name = opts.name || snap?.profile.name || "";
  applyOptimistic({
    profile: {
      onboarded: true,
      name,
      reminder: opts.reminder,
      visibility: opts.visibility,
      startDate,
    },
  });
  await patchProfile({
    onboarded: true,
    name,
    reminder: opts.reminder,
    visibility: opts.visibility,
    startDate,
  });
}

/** Toggle a day's check-in; returns the streak count after the change. */
export function toggleDay(day: number): number {
  const snap = currentSnapshot();
  if (!snap) return 0;
  if (!snap.checkins[day] && isLocked(day, snap.checkins)) {
    return computeStreak(snap.checkins).streak;
  }
  const checkins = { ...snap.checkins };
  if (checkins[day]) delete checkins[day];
  else checkins[day] = localToday();
  applyOptimistic({ checkins });
  void persist(() =>
    fetch("/api/progress/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day }),
    })
  );
  return computeStreak(checkins).streak;
}

export function setNote(day: number, text: string) {
  const snap = currentSnapshot();
  if (!snap) return;
  const notes = { ...snap.notes };
  if (text.trim() === "") delete notes[day];
  else notes[day] = text;
  applyOptimistic({ notes });
  debounced(`note:${day}`, 500, () => {
    void persist(() =>
      fetch("/api/progress/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, text }),
      })
    );
  });
}

export function setName(name: string) {
  applyOptimistic({ profile: { name } });
  debounced("name", 500, () => void patchProfile({ name }));
}
export function setGithub(github: string) {
  applyOptimistic({ profile: { github } });
  debounced("github", 500, () => void patchProfile({ github }));
}
export function setReminder(reminder: Reminder) {
  applyOptimistic({ profile: { reminder } });
  void patchProfile({ reminder });
}
export function setVisibility(visibility: Visibility) {
  applyOptimistic({ profile: { visibility } });
  void patchProfile({ visibility });
}
export function setAvatar(avatar: string) {
  applyOptimistic({ profile: { avatar } });
  void patchProfile({ avatar });
}
export function setNotesPrivate(notesPrivate: boolean) {
  applyOptimistic({ profile: { notesPrivate } });
  void patchProfile({ notesPrivate });
}

/** Submit (or re-submit) answers for one day's quiz; grades instantly. */
export async function submitQuiz(
  day: number,
  answers: { questionIndex: number; selectedIndex: number }[]
): Promise<{ correct: number; total: number }> {
  return submitQuizToServer(day, answers);
}
