// Challenge data model. A challenge is pure data — adding a new one means
// adding one file in lib/challenges/ and registering it in lib/plan.ts.

export type ProjectId =
  | "P1"
  | "P2"
  | "P3"
  | "P4"
  | "P5"
  | "P6"
  | "P7"
  | "P8"
  | "CAP";

export interface DayPlan {
  day: number;
  title: string;
  /** Plain-language what-and-why of the topic — shown under the title */
  about?: string;
  /** YouTube search phrase for the topic (falls back to the title) */
  search?: string;
  /** Viewer resource, ~30–45 min */
  resource: string;
  /** Viewer build task, ~45–75 min */
  build: string;
  doneWhen?: string;
  videoTitle?: string;
  /** Lesson video URL (YouTube) — day pages embed it once the owner adds it */
  video?: string;
  /** Owner's note for the day, merged from OWNER_NOTES */
  ownerNote?: string;
  /** Owner-curated links to watch for the day, merged from WATCH_LINKS */
  watchLinks?: { label: string; url: string }[];
  projects: ProjectId[];
  isRest: boolean;
}

export interface WeekPlan {
  week: number;
  title: string;
  start: number;
  end: number;
}

export interface Project {
  id: ProjectId;
  name: string;
  /** Short label for badges, e.g. "P2 · Eval harness" */
  short: string;
  /** One-line card blurb */
  blurb: string;
  start: number;
  end: number;
  /** The day this project ships as a standalone portfolio piece */
  shipDay: number;
  flagship?: boolean;
  description: string;
  doneWhen: string;
}

export interface Creator {
  name: string;
  handle: string;
  tagline: string;
}

export interface Challenge {
  /** Stable slug — used as the storage namespace and (later) route segment */
  id: string;
  title: string;
  totalDays: number;
  /** The public cohort's shared Day-1 date, "YYYY-MM-DD" */
  cohortStart: string;
  /** Monorepo with one folder per day (day-1 … day-NNN) */
  github: string;
  creator: Creator;
  days: DayPlan[];
  weeks: WeekPlan[];
  projects: Project[];
}
