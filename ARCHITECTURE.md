# Architecture — access model & multi-challenge structure

## Who sees what (v2 — current, live)

Every learner has their own **account in a shared Postgres database**
(`db/schema.sql`) — not per-browser storage. A new person picks a **username +
personal code**; a returning person enters the same two things on any phone
or laptop and their track opens: streak, check-ins, notes, settings. Sessions
are an httpOnly cookie good for 180 days (`lib/session.ts`).

| Person | What they can see |
|---|---|
| **A user** | Only their own progress — check-ins, streak, notes — after logging in with their username + code, from any device. |
| **Another user** | Nothing private. If the user set their profile to Public, others see them on the **community tab** (name, day, streak, days done) — never their notes. Private profiles show up nowhere. |
| **You (owner)** | Everything above, plus **`/creator`** — a dashboard visible only to the account with `is_owner = true`: total sign-ups, a per-day check-in funnel, and every account's stats (public *and* private), gated server-side in `app/api/admin/stats`. |

Codes are hashed with `scrypt` + a random salt (`lib/auth-hash.ts`) — never
stored in plain text, and **not recoverable** (no email exists to reset via;
a forgotten code means starting a new track).

### Data model

```
profiles      (id, handle, name, salt, code_hash, github, reminder, visibility,
               notes_private, start_date, joined, onboarded, is_owner)
checkins      (profile_id, day, checked_on)      ← one row per checked day
notes         (profile_id, day, text)            ← private, never sent to /api/community
quiz_answers  (profile_id, day, question_index, selected_index) ← raw selection only,
               never a stored "correct" flag — always re-graded against the
               current QUIZZES data in lib/challenges/modern-ai-2026.ts, so
               fixing a quiz question re-grades every past answer for free
sessions      (id, profile_id, created_at)       ← the login-cookie token
```

`handle` is the unique login username; `name` is the display name shown on
the dashboard, share card, and community tab. See `db/schema.sql` for the
full, idempotent `CREATE TABLE` statements.

### Request flow

```
lib/session-client.ts   ← client store: fetches /api/auth/me once,
                           optimistic-updates on every mutation, "use client"
lib/store.ts             ← useProgress() + toggleDay/setNote/submitQuiz/... (progress)
lib/profiles.ts          ← useProfiles() + signup/login/logout (identity)
lib/progress.ts          ← pure streak/day math — shared by the browser
                           AND the server (app/api/community, app/api/admin/stats)
lib/quiz.ts               ← pure quiz grading (gradeAll, gradeDayQuiz) — same
                           re-shared-everywhere pattern as lib/progress.ts
lib/badges.ts             ← pure badge catalog, derived fresh from streak +
                           quiz stats every time — nothing is ever "awarded"
                           or stored, so changing the rules needs no migration

app/api/auth/{signup,login,logout,me}   ← account + session
app/api/profile                          ← PATCH settings (name, reminder, …)
app/api/progress/{checkin,note,quiz}     ← the things checked/answered daily
app/api/community                        ← public ranked list + badges (GET, no auth)
app/api/admin/stats                      ← owner-only aggregate stats (GET, 403 if not is_owner)
```

`lib/db.ts` throws a clear `DbNotConfiguredError` (surfaced as HTTP 503) if
`DATABASE_URL` isn't set yet, so the app fails loudly instead of silently, and
`/api/community` degrades to an empty, clearly-labeled state instead of
crashing the leaderboard page.

### One-time setup (owner)

1. Create a free Postgres database — [neon.tech](https://neon.tech) is the
   Vercel-native option. Copy the pooled connection string.
2. Run `db/schema.sql` against it once (Neon's SQL editor, or
   `psql "$DATABASE_URL" -f db/schema.sql`).
3. Set `DATABASE_URL` in Vercel (Project Settings → Environment Variables) and
   locally in `.env.local` (copy `.env.local.example`).

No auth provider (Clerk etc.) is used — the existing username + code UX is
the whole login system, just checked against the database instead of
`localStorage`.

## Multi-challenge structure (ready now)

A challenge is **pure data** — no UI code knows the curriculum:

```
lib/
  challenges/
    types.ts             ← Challenge / DayPlan / WeekPlan / Project types
    modern-ai-2026.ts    ← the full 100-day curriculum (data only)
  plan.ts                ← registry + ACTIVE challenge selector
```

**To add a second challenge later:**

1. Create `lib/challenges/<new-slug>.ts` exporting a `Challenge` object
   (id, title, cohortStart, days, weeks, projects).
2. Register it in `CHALLENGES` in `lib/plan.ts`.
3. Either point `CHALLENGE` at it (this deployment serves the new one), or add
   `/c/[slug]` routes and resolve the challenge from the URL to serve several
   at once. `checkins`/`notes` would need a `challenge_id` column to keep
   tracks separate per challenge — not needed while only one challenge exists.

## v3 — not built yet

- Showcase wall backed by a `showcase` table (title, link, opted_in) instead
  of the current preview/demo cards in `lib/demo.ts`.
- Rate limiting / abuse protection on `/api/auth/signup` (currently open —
  fine for a course cohort, not for a public internet-facing signup at scale).
- Owner dashboard is now live (`/creator`, see above) — natural next steps
  there are per-question quiz breakdowns and CSV export.
