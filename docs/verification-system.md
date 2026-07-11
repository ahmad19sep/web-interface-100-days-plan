# Verification system

## What verification means here

Every day's Verification stage collects **evidence** declared by the lesson
(`verification.fields`) and validates it client-side with the same pure
functions the gate uses server-adjacent (`fieldOk`, `verifyStatusOf` in
`lib/lessons/index.ts`):

| Method | How it works today |
| --- | --- |
| **Local verification result** | The lesson ships a validation command/script (e.g. Day 1's `scripts/validate.py`); the user runs it locally and pastes the output; the paste must match the lesson's `mustMatch` pattern (e.g. `AX-120 VALID`, `\d+ passed`). |
| **URL evidence** | Commit / repo / deployment URLs — parsed as real URLs plus a per-field pattern (e.g. `github.com/*/commit/<sha>`). |
| **Manual attestation** | An explicit honesty checkbox for things automation can't see ("I fresh-cloned and the quickstart worked"). Used sparingly and worded concretely. |

Statuses: `not submitted → failed (fix and resubmit) → passed`, with a
timestamp. Failed verification is not a dead end — it also unlocks the next
progressive hint in the Build stage.

The submitted values live in the user's `day_progress` blob, so they're
inspectable (`/creator` tooling can audit them later) and become the
portfolio evidence card on the Ship stage.

## What is deliberately NOT built yet

- **GitHub API verification** (connect account → check files/branches):
  needs a GitHub OAuth app + token storage. The evidence-field abstraction
  already fits it (a new `kind: "github-repo"` that resolves server-side).
- **ZIP upload / sandboxed test runs**: running user code requires an
  isolated sandbox (e.g. Vercel Sandbox); it must never run on the app
  server. Rule types like "test suite passes", "endpoint responds",
  "eval score ≥ threshold" plug in here.

Both slot in as new `EvidenceField.kind`s plus a server-side
`/api/verify/[method]` runner — the UI, storage and gate logic don't change.

## Anti-cheat model, honestly stated

- The **quiz** is fully server-enforced: `/api/progress/checkin` re-grades
  stored answers against the effective quiz and rejects a check-in below 60%.
- **Day order** is server-enforced (no skipping ahead).
- **XP is derived, never stored** (`lib/game.ts` from check-ins) — duplicate
  awards are structurally impossible; check-ins are primary-keyed per
  (user, day), so completion is idempotent.
- Evidence-field regexes run client-side before being stored; a determined
  user could hand-craft a passing paste. That is a known, accepted limit of
  phase 1 — the strings are stored server-side and auditable, and faked
  evidence sabotages only the user's own portfolio. Server-side re-validation
  of `mustMatch` in the check-in route is the cheap next hardening step.
