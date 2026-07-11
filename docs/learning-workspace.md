# The daily learning workspace

Route: **`/learn/day/[n]`** (e.g. `/learn/day/1`). Entry points:

- Today dashboard → **"Enter Day N Workspace →"**
- The lesson-room modal (`/day/N`) stays as the quick **Mission Preview** —
  its header links to the full workspace.

## Layout

- **Left rail** (desktop) / horizontal chips (mobile): the lesson stages with
  live done-markers. Click any stage to jump.
- **Center**: the current stage's content (max 760px column).
- **Right utility panel** (desktop, collapsible via `▸ PANEL`): day progress %
  + requirement count, estimated remaining time, verification status, hints
  used, and a private quick note (the same note as the lesson room — autosaves
  via `/api/progress/note`).

The workspace renders as a near-opaque full-page layer over the 3D world
(`WorldChrome` branches on `/learn/`).

## Stages

`mission → watch → understand → lab → build → verify → quiz → reflect → ship → unlock`

Stages that don't apply to a day are hidden automatically (`stagesFor()` in
`lib/lessons/index.ts`): no videos → no Watch, no guided lab → no Lab, no quiz
→ no Quiz, rest days → no Build/Verify/Ship.

## Resume

Every mutation is stored per `(user, day)` in the `day_progress` table as one
jsonb blob (`WorkspaceProgress` in `lib/lessons/types.ts`), including
`lastStage`. Reopening the workspace — same device or another — restores the
exact stage and every completed item. Writes are optimistic + debounced
(700 ms) with a `sendBeacon` flush on tab close.

## Video tracking

YouTube videos embed through the IFrame API and report real playback
progress every 5 seconds. A required video counts as watched at **85%**
(`WATCH_THRESHOLD`) or on the player's `ended` event — opening it is not
enough. Days without an official video show an honest "coming soon" panel and
never block the gate.

## The gate (Unlock stage)

`gateChecklist()` derives the requirement list from server-stored progress:

- required videos watched · sections completed · lab steps done ·
  build started · verification passed · quiz passed · reflection saved ·
  ship evidence submitted

All rows must be green before "⛩ Open the gate" enables. The button flushes
pending progress, then calls the existing check-in API — which **re-grades
the quiz server-side** and rejects out-of-order days, so frontend state can't
cheat progression. XP stays fully derived (`lib/game.ts`), so it can never be
awarded twice.

## Files

| Piece | Where |
| --- | --- |
| Lesson schema + progress types | `lib/lessons/types.ts` |
| Registry, scaffold generator, gate logic | `lib/lessons/index.ts` |
| Authored Day 1 | `lib/lessons/day-001.ts` |
| Progress hook (client) | `lib/use-workspace-progress.ts` |
| Progress API | `app/api/progress/workspace/route.ts` |
| Shell + utility panel | `components/workspace/Workspace.tsx` |
| Stages 1–4 | `components/workspace/stages-learn.tsx` |
| Stages 5–10 | `components/workspace/stages-build.tsx` |
| Written-block renderer | `components/workspace/Blocks.tsx` |
| Route | `app/(app)/learn/day/[n]/page.tsx` |
