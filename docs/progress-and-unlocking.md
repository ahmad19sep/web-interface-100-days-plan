# Progress and unlocking

## Storage

| What | Where | Notes |
| --- | --- | --- |
| Check-ins (day completion) | `checkins` table | PK (profile, day) → idempotent; XP/streak/level all derive from this |
| Quiz answers | `quiz_answers` table | selected index only; server-graded |
| Day notes | `notes` table | shared by lesson room + workspace quick note |
| **Workspace progress** | **`day_progress` table** | one jsonb blob per (user, day) — `WorkspaceProgress` |

`day_progress` is created by a self-healing migration
(`ensureDayProgressTable()` in `lib/db.ts`) — no manual SQL needed in
production; `db/schema.sql` carries it for fresh installs.

## The WorkspaceProgress blob

```ts
{
  lastStage,            // resume position
  video:      { [videoId]: { seconds, duration, done } },
  sections:   { [sectionId]: true },
  lab:        { [stepId]: true },
  buildStarted,         // ISO timestamp — starts the hint cooldown clock
  hintsUnlocked,        // 0–3
  verify:     { [fieldId]: value },
  verifyStatus,         // none | failed | passed
  verifyAt,
  reflections: { [promptIndex]: text },
  ship:       { [fieldId]: value },
}
```

Writes go through `/api/progress/workspace` (POST `{ day, patch }`) which
whitelists keys, caps payload size, and shallow-merges with `jsonb ||` —
the client always sends whole values per top-level key. Reads: GET `?day=N`.

## Rich day states

`workspaceState()` derives: `locked · available · learning · practising ·
building · verification_failed · ready_to_submit · completed`. The workspace
header shows it; other surfaces (journey map, weekly list) can adopt the same
helper incrementally — they currently keep their original done/today/locked
states, which remain correct because both derive from the same check-ins.

## Unlock rules (the gate)

A day checks in only when **all** of `gateChecklist()` is green:

1. required videos ≥ 85% watched
2. every Understand section marked complete
3. every guided-lab step done
4. main build started
5. verification `passed`
6. quiz passed (≥ 60%) — **also re-graded server-side in the check-in API**
7. reflection saved (≥ 20 chars on at least one prompt)
8. required ship evidence submitted

Plus the pre-existing server rules: days complete strictly in order, and
check-ins are toggled through the same `/api/progress/checkin` used by the
lesson room — one source of truth, no duplicate completion, no double XP.

"Undo check-in" stays available (it deletes the check-in row; XP being
derived makes this always safe).

## Project phases

`projectPhaseOf(day)` (in `lib/lessons/index.ts`) labels each project day:
`PROJECT START → LEARN → BUILD → HARDEN → SHIP DAY → RETROSPECTIVE`, with
"day k of n" — only the actual ship day says SHIP DAY. Used by the workspace
header and the lesson-room badge.
