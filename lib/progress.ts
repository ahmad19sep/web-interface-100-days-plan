// Pure progress math — no "use client", no storage. Shared by the browser
// store (lib/store.ts) and the server API routes (app/api/**) so the streak
// rule is computed identically in both places.

import { DAYS, PROJECTS, TOTAL_DAYS, type Project } from "./plan";

export function localToday(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

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

/** First incomplete day (1–totalDays); totalDays+1 when the track is done. */
export function currentDay(checkins: Record<number, string>): number {
  for (let n = 1; n <= TOTAL_DAYS; n++) if (!checkins[n]) return n;
  return TOTAL_DAYS + 1;
}

/** Where the schedule/cohort says you "should" be, from your start date. */
export function expectedDay(
  startDate: string | null,
  today: string = localToday()
): number {
  if (!startDate) return 1;
  const diff = epochDay(today) - epochDay(startDate);
  return Math.max(1, Math.min(TOTAL_DAYS, diff + 1));
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

/** True once a day is beyond the first incomplete day — i.e. the previous
 * day hasn't been checked in yet. Past incomplete days stay checkable, so
 * this is deliberately narrower than dayState's "locked" (which also flags
 * those). Matches the server-side rule in the checkin API route. */
export function isLocked(day: number, checkins: Record<number, string>): boolean {
  return day > currentDay(checkins);
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

/** Projects shipped, capstone included — the docx's "0/20" counter. */
export function shippedCount(checkins: Record<number, string>): number {
  return PROJECTS.filter((p) => checkins[p.shipDay]).length;
}
