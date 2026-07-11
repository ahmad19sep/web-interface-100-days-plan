// Lesson registry + scaffold generator.
//
// lessonFor(day) always returns a Lesson for days 1–120:
//  - authored lessons (lib/lessons/day-NNN.ts, registered below) are the
//    full experience — written sections, guided lab, hints, verification
//  - every other day gets a scaffold generated from its DayPlan, so the
//    workspace works for the whole curriculum while lessons are authored
//    incrementally (see docs/content-authoring.md)

import { DAYS, PROJECTS, getDay, type DayPlan, type Project } from "../plan";
import { DAY_001 } from "./day-001";
import { DAY_002 } from "./day-002";
import { DAY_003 } from "./day-003";
import { DAY_004 } from "./day-004";
import { DAY_005 } from "./day-005";
import { DAY_006 } from "./day-006";
import { DAY_007 } from "./day-007";
import {
  STAGE_ORDER,
  WATCH_THRESHOLD,
  type EvidenceField,
  type GateRequirement,
  type Lesson,
  type StageId,
  type WorkspaceProgress,
} from "./types";

export * from "./types";

const AUTHORED: Record<number, Lesson> = {
  1: DAY_001,
  2: DAY_002,
  3: DAY_003,
  4: DAY_004,
  5: DAY_005,
  6: DAY_006,
  7: DAY_007,
};

// ── project phases ───────────────────────────────────────────────────────────

export interface ProjectPhase {
  project: Project;
  /** e.g. "PROJECT START", "LEARN", "BUILD", "HARDEN", "SHIP DAY", "RETROSPECTIVE" */
  label: string;
  /** 1-based day index inside the project */
  dayIndex: number;
  totalDays: number;
}

/** Which project a day belongs to and which phase of it this day is. */
export function projectPhaseOf(day: number): ProjectPhase | null {
  const project = PROJECTS.find((p) => day >= p.start && day <= p.end);
  if (!project) return null;
  const totalDays = project.end - project.start + 1;
  const dayIndex = day - project.start + 1;
  let label: string;
  if (day === project.shipDay) label = "SHIP DAY";
  else if (day === project.start) label = "PROJECT START";
  else if (day > project.shipDay) label = "RETROSPECTIVE";
  else {
    const pct = dayIndex / totalDays;
    label = pct < 0.34 ? "LEARN" : pct < 0.75 ? "BUILD" : "HARDEN";
  }
  return { project, label, dayIndex, totalDays };
}

// ── scaffold generation ──────────────────────────────────────────────────────

const STANDARD_REFLECTIONS = [
  "What did I build today, in my own words?",
  "What problem did I hit, and how did I solve it?",
  "Explain today's concept in two sentences.",
  "What interview question could be asked from today's topic?",
];

function scaffoldFrom(plan: DayPlan): Lesson {
  const phase = projectPhaseOf(plan.day);
  const isShip = phase?.label === "SHIP DAY";

  const verifyFields: EvidenceField[] = plan.isRest
    ? []
    : [
        {
          id: "done-attest",
          label: `Done when: ${plan.doneWhen ?? "the build works and is committed"}`,
          kind: "attest",
          required: true,
          hint: "Only check this when it is literally true — this course runs on real evidence.",
        },
        {
          id: "evidence",
          label: plan.proof
            ? `Evidence — ${plan.proof}`
            : "Evidence — commit URL, output paste, or demo link",
          kind: "text",
          required: true,
          placeholder: "https://github.com/you/ax-120/commit/… or pasted output",
        },
      ];

  const shipFields: EvidenceField[] = plan.isRest
    ? []
    : [
        {
          id: "commit-url",
          label: "Commit or repository URL for today's work",
          kind: "url",
          required: isShip,
          placeholder: "https://github.com/…",
          mustMatch: "^https://",
        },
        ...(isShip
          ? ([
              {
                id: "ship-note",
                label: `One-line technical note for the ${phase?.project.short ?? "project"} portfolio card`,
                kind: "text",
                required: true,
                placeholder: "What you built and what proves it works",
              },
            ] as EvidenceField[])
          : []),
      ];

  return {
    day: plan.day,
    slug: `day-${plan.day}`,
    title: plan.title,
    module: "Production AI Engineering",
    projectId: phase?.project.id,
    projectPhase: phase?.label,
    durationMinutes: undefined,
    difficulty: plan.difficulty,
    prerequisites: [],
    objectives: plan.about ? [plan.about] : [plan.resource],
    whyItMatters: plan.why,
    jobRelevance: undefined,
    missionBrief: plan.about ?? plan.build,
    finalEvidence: plan.proof,
    videos: plan.video
      ? [
          {
            id: "lesson",
            title: plan.videoTitle ?? plan.title,
            url: plan.video,
            kind: "concept",
            required: true,
          },
        ]
      : [],
    sections: [
      {
        id: "learn",
        title: "What to learn today",
        blocks: [
          { t: "p", text: plan.resource },
          ...(plan.why
            ? ([
                {
                  t: "callout",
                  kind: "info",
                  title: "Why this matters",
                  text: plan.why,
                },
              ] as const)
            : []),
          ...(plan.ownerNote
            ? ([
                {
                  t: "callout",
                  kind: "info",
                  title: "Note from Ahmad",
                  text: plan.ownerNote,
                },
              ] as const)
            : []),
        ],
      },
    ],
    lab: undefined,
    build: plan.isRest
      ? { brief: plan.build, requirements: [], acceptance: [] }
      : {
          brief: plan.build,
          requirements: [],
          acceptance: plan.doneWhen ? [plan.doneWhen] : [],
          submission: plan.proof ? [plan.proof] : undefined,
        },
    hints: [],
    verification: { fields: verifyFields },
    reflectionPrompts: STANDARD_REFLECTIONS,
    shipFields,
    references: (plan.watchLinks ?? []).map((l) => ({
      label: l.label,
      url: l.url,
    })),
    nextDayPreview: getDay(plan.day + 1)?.title,
    authored: false,
  };
}

/** The lesson for a day — authored when available, scaffold otherwise. */
export function lessonFor(day: number): Lesson | null {
  const plan = DAYS[day - 1];
  if (!plan) return null;
  return AUTHORED[day] ?? scaffoldFrom(plan);
}

// ── stage availability + completion ──────────────────────────────────────────

/** The stages this lesson actually has, in order. */
export function stagesFor(lesson: Lesson, hasQuiz: boolean): StageId[] {
  return STAGE_ORDER.filter((s) => {
    if (s === "watch") return lesson.videos.length > 0;
    if (s === "understand") return lesson.sections.length > 0;
    if (s === "lab") return Boolean(lesson.lab?.steps.length);
    if (s === "build") return lesson.build.brief.trim().length > 0;
    if (s === "verify") return lesson.verification.fields.length > 0;
    if (s === "quiz") return hasQuiz;
    if (s === "ship") return lesson.shipFields.length > 0;
    return true; // mission, reflect, unlock
  });
}

export function fieldOk(field: EvidenceField, value: string | undefined): boolean {
  const v = (value ?? "").trim();
  if (field.kind === "attest") return v === "yes";
  if (v === "") return false;
  if (field.kind === "url") {
    try {
      const u = new URL(v);
      if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    } catch {
      return false;
    }
  }
  if (field.mustMatch && !new RegExp(field.mustMatch, "i").test(v)) return false;
  return true;
}

/** "passed" when every required field verifies; "failed" when something was
 *  submitted but doesn't verify; "none" before any real attempt. */
export function verifyStatusOf(
  fields: EvidenceField[],
  values: Record<string, string> | undefined
): "none" | "failed" | "passed" {
  if (fields.length === 0) return "passed";
  const required = fields.filter((f) => f.required);
  const anyFilled = fields.some((f) => (values?.[f.id] ?? "").trim() !== "");
  const allOk = required.every((f) => fieldOk(f, values?.[f.id]));
  if (allOk && required.length > 0) return "passed";
  return anyFilled ? "failed" : "none";
}

export function videoStageDone(lesson: Lesson, p: WorkspaceProgress): boolean {
  const required = lesson.videos.filter((v) => v.required && v.url);
  return required.every((v) => {
    const vp = p.video?.[v.id];
    if (!vp) return false;
    return vp.done || (vp.duration > 0 && vp.seconds / vp.duration >= WATCH_THRESHOLD);
  });
}

export function sectionsDone(lesson: Lesson, p: WorkspaceProgress): boolean {
  return lesson.sections.every((s) => p.sections?.[s.id]);
}

export function labDone(lesson: Lesson, p: WorkspaceProgress): boolean {
  if (!lesson.lab) return true;
  return lesson.lab.steps.every((s) => p.lab?.[s.id]);
}

export function reflectionDone(lesson: Lesson, p: WorkspaceProgress): boolean {
  if (lesson.reflectionPrompts.length === 0) return true;
  return Object.values(p.reflections ?? {}).some((r) => r.trim().length >= 20);
}

export function shipDone(lesson: Lesson, p: WorkspaceProgress): boolean {
  return lesson.shipFields
    .filter((f) => f.required)
    .every((f) => fieldOk(f, p.ship?.[f.id]));
}

/** The gate checklist — one row per requirement, all must be done to unlock. */
export function gateChecklist(
  lesson: Lesson,
  p: WorkspaceProgress,
  quiz: { hasQuiz: boolean; passed: boolean }
): GateRequirement[] {
  const stages = stagesFor(lesson, quiz.hasQuiz);
  const reqs: GateRequirement[] = [];
  if (stages.includes("watch"))
    reqs.push({
      id: "watch",
      label: "Required video watched",
      done: videoStageDone(lesson, p),
      stage: "watch",
    });
  if (stages.includes("understand"))
    reqs.push({
      id: "understand",
      label: "Lesson sections completed",
      done: sectionsDone(lesson, p),
      stage: "understand",
    });
  if (stages.includes("lab"))
    reqs.push({
      id: "lab",
      label: "Guided lab completed",
      done: labDone(lesson, p),
      stage: "lab",
    });
  if (stages.includes("build"))
    reqs.push({
      id: "build",
      label: "Main build started and finished",
      done: Boolean(p.buildStarted),
      stage: "build",
    });
  if (stages.includes("verify"))
    reqs.push({
      id: "verify",
      label: "Verification passed",
      done:
        verifyStatusOf(lesson.verification.fields, p.verify) === "passed",
      stage: "verify",
    });
  if (stages.includes("quiz"))
    reqs.push({
      id: "quiz",
      label: "Quiz passed",
      done: quiz.passed,
      stage: "quiz",
    });
  reqs.push({
    id: "reflect",
    label: "Reflection saved",
    done: reflectionDone(lesson, p),
    stage: "reflect",
  });
  if (stages.includes("ship"))
    reqs.push({
      id: "ship",
      label: "Ship evidence submitted",
      done: shipDone(lesson, p),
      stage: "ship",
    });
  return reqs;
}

/** Rich progress state for a day, derived from workspace progress. */
export function workspaceState(
  lesson: Lesson,
  p: WorkspaceProgress | undefined,
  opts: { checkedIn: boolean; locked: boolean; hasQuiz: boolean; quizPassed: boolean }
):
  | "locked"
  | "available"
  | "learning"
  | "practising"
  | "building"
  | "verification_failed"
  | "ready_to_submit"
  | "completed" {
  if (opts.checkedIn) return "completed";
  if (opts.locked) return "locked";
  if (!p || !p.lastStage) return "available";
  const reqs = gateChecklist(lesson, p, {
    hasQuiz: opts.hasQuiz,
    passed: opts.quizPassed,
  });
  if (reqs.every((r) => r.done)) return "ready_to_submit";
  if (
    verifyStatusOf(lesson.verification.fields, p.verify) === "failed"
  )
    return "verification_failed";
  if (p.buildStarted) return "building";
  if (p.lab && Object.keys(p.lab).length > 0) return "practising";
  return "learning";
}
