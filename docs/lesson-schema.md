# Lesson schema

Defined in `lib/lessons/types.ts`. A `Lesson` is pure data — no JSX, no
fetching — so lessons are reviewable, diffable and portable.

```ts
interface Lesson {
  day: number;              // 1–120
  slug: string;             // "engineering-monorepo-learning-contract"
  title: string;
  module: string;           // "AI Engineering Foundations"
  projectId?: string;       // "P1"
  projectPhase?: string;    // "PROJECT START" | "LEARN" | "BUILD" | "HARDEN" | "SHIP DAY" | "RETROSPECTIVE"
  durationMinutes?: number;
  difficulty?: string;
  prerequisites: string[];
  objectives: string[];
  whyItMatters?: string;
  jobRelevance?: string;    // the "what an employer sees" line
  missionBrief: string;
  finalEvidence?: string;
  videos: LessonVideo[];    // { id, title, url?, kind, required, minutes? }
  sections: LessonSection[];// { id, title, blocks: Block[] }
  lab?: { intro?; steps: LabStep[] };
  build: BuildSpec;         // brief, requirements, acceptance, commonMistakes, submission
  hints: BuildHint[];       // level 1 concept / 2 architecture / 3 partial code
  verification: { intro?; fields: EvidenceField[] };
  reflectionPrompts: string[];
  shipFields: EvidenceField[];
  references: { label; url }[];  // optional by design — the lesson stands alone
  nextDayPreview?: string;
  authored: boolean;        // true = hand-written, false = DayPlan scaffold
}
```

## Written blocks (`Block`)

Discriminated union rendered by `components/workspace/Blocks.tsx`:

| `t` | Renders as |
| --- | --- |
| `h` | sub-heading |
| `p` | paragraph |
| `list` | bullet (or `ordered: true`) list |
| `code` | code block with optional `file` header + copy button |
| `terminal` | `$`-prefixed command with copy button |
| `output` | expected-output panel with label |
| `callout` | `info` / `warn` / `job` (employer) / `interview` box |

## Evidence fields (`EvidenceField`)

Used by both Verification and Ship stages:

- `kind: "url"` — must parse as http(s) URL, plus optional `mustMatch` regex
- `kind: "paste"` / `"text"` — non-empty, plus optional `mustMatch` regex
- `kind: "attest"` — an explicit honesty checkbox
- `required: true` fields gate the stage; `failHelp` explains failures

## Stable ids matter

`video.id`, `section.id`, `step.id`, `field.id` are the storage keys inside
the user's `day_progress` blob. **Never rename them after a lesson ships** —
users would lose that item's completion. Adding new items is always safe.

## Per-user progress (`WorkspaceProgress`)

One jsonb blob per (user, day) — see `docs/progress-and-unlocking.md`.
