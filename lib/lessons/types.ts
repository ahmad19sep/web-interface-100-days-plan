// Structured lesson schema for the daily learning workspace (/learn/day/N).
//
// A Lesson is pure data — no JSX, no fetching. Authored lessons live in
// lib/lessons/day-NNN.ts and register in lib/lessons/index.ts; every day
// without an authored file gets a scaffold generated from its DayPlan so the
// workspace works for all 120 days from day one.

export type StageId =
  | "mission"
  | "watch"
  | "understand"
  | "lab"
  | "build"
  | "verify"
  | "quiz"
  | "reflect"
  | "ship"
  | "unlock";

export const STAGE_ORDER: StageId[] = [
  "mission",
  "watch",
  "understand",
  "lab",
  "build",
  "verify",
  "quiz",
  "reflect",
  "ship",
  "unlock",
];

export const STAGE_LABEL: Record<StageId, string> = {
  mission: "Mission",
  watch: "Watch",
  understand: "Understand",
  lab: "Guided Lab",
  build: "Main Build",
  verify: "Verification",
  quiz: "Quiz",
  reflect: "Reflection",
  ship: "Ship",
  unlock: "Unlock",
};

export interface LessonVideo {
  /** stable id — video progress is stored under it */
  id: string;
  title: string;
  /** YouTube URL; absent = "official video coming soon" */
  url?: string;
  kind: "concept" | "walkthrough" | "mistakes" | "briefing";
  /** required videos gate the Watch stage at WATCH_THRESHOLD */
  required: boolean;
  minutes?: number;
}

/** Fraction of a required video that must actually play to count. */
export const WATCH_THRESHOLD = 0.85;

// ── written lesson blocks ────────────────────────────────────────────────────

export type Block =
  | { t: "h"; text: string }
  | { t: "p"; text: string }
  | { t: "list"; items: string[]; ordered?: boolean }
  | { t: "code"; code: string; lang?: string; file?: string }
  | { t: "terminal"; code: string }
  | { t: "output"; code: string; label?: string }
  | {
      t: "callout";
      kind: "info" | "warn" | "job" | "interview";
      title?: string;
      text: string;
    };

export interface LessonSection {
  /** stable id — section completion is stored under it */
  id: string;
  title: string;
  blocks: Block[];
}

// ── guided lab ───────────────────────────────────────────────────────────────

export interface LabStep {
  /** stable id — step completion is stored under it */
  id: string;
  title: string;
  instruction: string;
  explanation?: string;
  command?: string;
  code?: { code: string; lang?: string; file?: string };
  expected?: string;
  commonError?: string;
  hint?: string;
  /** shown by the "I got a different result" button */
  troubleshooting?: string;
}

// ── main build ───────────────────────────────────────────────────────────────

export interface BuildSpec {
  brief: string;
  requirements: string[];
  acceptance: string[];
  commonMistakes?: string[];
  submission?: string[];
}

export interface BuildHint {
  /** 1 = conceptual, 2 = architecture, 3 = partial implementation */
  level: 1 | 2 | 3;
  title: string;
  body: string;
}

// ── verification / ship evidence ─────────────────────────────────────────────

export interface EvidenceField {
  /** stable id — the value is stored under it */
  id: string;
  label: string;
  kind: "url" | "text" | "paste" | "attest";
  required: boolean;
  placeholder?: string;
  hint?: string;
  /** regex source — a paste/text value must match it to verify */
  mustMatch?: string;
  /** what a wrong value usually means — shown when mustMatch fails */
  failHelp?: string;
}

// ── the lesson ───────────────────────────────────────────────────────────────

export interface Lesson {
  day: number;
  slug: string;
  title: string;
  module: string;
  projectId?: string;
  /** e.g. "PROJECT START", "BUILD", "SHIP DAY" — see projectPhaseOf() */
  projectPhase?: string;
  durationMinutes?: number;
  difficulty?: string;
  prerequisites: string[];
  objectives: string[];
  whyItMatters?: string;
  /** "What an employer sees" — real-world job relevance */
  jobRelevance?: string;
  missionBrief: string;
  finalEvidence?: string;
  videos: LessonVideo[];
  sections: LessonSection[];
  lab?: { intro?: string; steps: LabStep[] };
  build: BuildSpec;
  hints: BuildHint[];
  verification: { intro?: string; fields: EvidenceField[] };
  reflectionPrompts: string[];
  shipFields: EvidenceField[];
  references: { label: string; url: string }[];
  nextDayPreview?: string;
  /** true = hand-written full lesson; false = scaffold from the DayPlan */
  authored: boolean;
}

// ── per-user workspace progress (the day_progress.data jsonb) ────────────────

export interface VideoProgress {
  seconds: number;
  duration: number;
  done: boolean;
}

export interface WorkspaceProgress {
  /** where the user left off — restored on return */
  lastStage?: StageId;
  /** video id → playback progress */
  video?: Record<string, VideoProgress>;
  /** section id → completed */
  sections?: Record<string, boolean>;
  /** lab step id → completed */
  lab?: Record<string, boolean>;
  /** ISO timestamp of "I'm building" — starts the hint clock */
  buildStarted?: string;
  /** how many progressive hints are revealed (0–3) */
  hintsUnlocked?: number;
  solutionUnlocked?: boolean;
  /** verification field id → submitted value ("yes" for attest) */
  verify?: Record<string, string>;
  verifyStatus?: "none" | "failed" | "passed";
  verifyAt?: string;
  /** reflection prompt index → answer */
  reflections?: Record<number, string>;
  /** ship evidence field id → value */
  ship?: Record<string, string>;
}

// ── gate requirements ────────────────────────────────────────────────────────

export interface GateRequirement {
  id: string;
  label: string;
  done: boolean;
  /** which stage fixes it */
  stage: StageId;
}
