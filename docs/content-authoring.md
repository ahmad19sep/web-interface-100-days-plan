# Authoring daily lessons

Every day already works: days without an authored lesson get a **scaffold**
generated from their `DayPlan` (`scaffoldFrom()` in `lib/lessons/index.ts`) —
mission from `about`/`why`, one Understand section from `resource`, the build
from `build`/`doneWhen`, honest attest+evidence verification, standard
reflection prompts, and ship fields on ship days. Authoring replaces the
scaffold with the full experience.

## How to author a new day

1. Copy `lib/lessons/day-001.ts` to `lib/lessons/day-0NN.ts`.
2. Write the lesson **in your own words** — external docs go in `references`
   (optional by design), never as required reading. No "search YouTube" links.
3. Register it in `lib/lessons/index.ts`:

```ts
import { DAY_002 } from "./day-002";
const AUTHORED: Record<number, Lesson> = { 1: DAY_001, 2: DAY_002 };
```

That's it — `/learn/day/N` picks it up.

## How to add videos

Add entries to `videos`. `url` is a normal YouTube link; playback is tracked
through the IFrame API and required videos gate the Watch stage at 85%.
Leave `url` undefined until the video is recorded — the workspace shows an
honest "coming soon" panel that never blocks the gate. Use `kind` to label
concept / walkthrough / mistakes / briefing, and `required: false` for
optional extras (including Urdu / Roman Urdu alternates).

The owner can still set the lesson-room video live from the app
(👑 CREATOR panel → `/api/day-content`); the workspace's video list comes
from the lesson file.

## How to add quiz questions

Quizzes stay in the existing system (it's already server-graded and
owner-editable live):

- **From the app**: 👑 CREATOR panel on the day page → quiz builder → Save.
- **In code**: `QUIZZES` map in `lib/challenges/production-ai-2026.ts`.

The workspace's Quiz stage and the gate pick up whichever is effective
(DB override wins). Only the selected option index is stored, never a
"correct" flag — fixing `correctIndex` re-grades everyone retroactively.

## How to add verification rules

Add `EvidenceField`s to `verification.fields`:

```ts
{
  id: "pytest-output",             // stable forever
  label: "Paste the last line of: python -m pytest -q",
  kind: "paste",
  required: true,
  mustMatch: "\\d+ passed",        // regex the paste must satisfy
  failHelp: "A paste containing 'failed' doesn't pass — fix the test first.",
}
```

Kinds: `url` (validated + regex), `paste`/`text` (regex), `attest`
(honesty checkbox). See `docs/verification-system.md` for the architecture
and the automated-checks roadmap.

## Guided lab steps

Each step: `instruction`, optional `explanation`, `command` and/or `code`
(with `file` name), `expected`, `commonError`, and `troubleshooting` — the
last one powers the "I GOT A DIFFERENT RESULT" reveal. Design at least one
step that intentionally fails (like Day 1's lint error) — feeling a gate
catch a mistake teaches more than reading about it.

## Rules

- Stable `id`s once shipped (they're storage keys).
- The lesson must be completable **without opening any external link**.
- Progressive hints: level 1 conceptual → 2 architecture → 3 partial code.
  Never put the full solution in a hint.
- Don't copy third-party articles; attribute optional references.
