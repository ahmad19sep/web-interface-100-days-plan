// Active-challenge selector.
//
// Challenges are pure data files in lib/challenges/. To add a new challenge:
//  1. create lib/challenges/<slug>.ts exporting a `Challenge`
//  2. register it in CHALLENGES below
//  3. point CHALLENGE at it (or, when serving several at once, add /c/[slug]
//     routing and resolve the challenge from the URL instead)
//
// Per-user progress is already namespaced by challenge id (see lib/store.ts),
// so tracks never collide.

import { PRODUCTION_AI_2026 } from "./challenges/production-ai-2026";
import type { Challenge, DayPlan, WeekPlan } from "./challenges/types";

export type {
  Challenge,
  Course,
  Creator,
  DayPlan,
  Project,
  ProjectId,
  WeekPlan,
} from "./challenges/types";

export const CHALLENGES: Record<string, Challenge> = {
  [PRODUCTION_AI_2026.id]: PRODUCTION_AI_2026,
};

/** The challenge this deployment currently serves. */
export const CHALLENGE: Challenge = PRODUCTION_AI_2026;

// ── convenience exports for the active challenge ───────────────────────────

export const DAYS = CHALLENGE.days;
export const WEEKS = CHALLENGE.weeks;
export const PROJECTS = CHALLENGE.projects;
export const COURSES = CHALLENGE.courses;
export const COHORT_START_DATE = CHALLENGE.cohortStart;
export const GITHUB_REPO = CHALLENGE.github;
export const CREATOR = CHALLENGE.creator;
export const TOTAL_DAYS = CHALLENGE.totalDays;
export const TOTAL_PROJECTS = CHALLENGE.projects.length;

export function getDay(n: number): DayPlan | undefined {
  return CHALLENGE.days[n - 1];
}

/** GitHub folder for one day's code — folders are named day-1 … day-100. */
export function dayFolderUrl(n: number): string {
  return `${CHALLENGE.github}/tree/main/day-${n}`;
}

/** YouTube search for the day's topic (until the official video is added). */
export function youTubeSearchUrl(plan: DayPlan): string {
  const query = plan.search ?? plan.title;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function weekOf(day: number): WeekPlan {
  return CHALLENGE.weeks.find((w) => day >= w.start && day <= w.end)!;
}

export function pad3(n: number): string {
  return ("00" + n).slice(-3);
}
