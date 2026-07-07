# Architecture — access model & multi-challenge structure

## Who sees what (v1 — current, live)

There are **no accounts** in v1. Progress lives in each visitor's own browser
(`localStorage`), so privacy is automatic:

| Person | What they can see |
|---|---|
| **A user** | Only their own progress — check-ins, streak, notes. It never leaves their device. Different browser/device = different track. |
| **Another user** | Nothing about anyone else. The leaderboard/showcase are clearly-labeled preview data. |
| **You (owner)** | Aggregate traffic via **Vercel Web Analytics** — visitors, page views, referrers, countries. Not individual users or their progress (that data never reaches a server in v1). |

To turn analytics on: Vercel Dashboard → project **web-interface-100-days-plan**
→ **Analytics** tab → Enable. The `<Analytics />` component is already wired in
`app/layout.tsx`.

### Storage keys

Each challenge gets its own namespace, so tracks never collide:

```
track:<challenge-id>:v1        e.g.  track:modern-ai-2026:v1
```

## Multi-challenge structure (ready now)

A challenge is **pure data** — no UI code knows the curriculum:

```
lib/
  challenges/
    types.ts             ← Challenge / DayPlan / WeekPlan / Project types
    modern-ai-2026.ts    ← the full 100-day curriculum (data only)
  plan.ts                ← registry + ACTIVE challenge selector
  store.ts               ← per-user progress, namespaced by challenge id
```

**To add a second challenge later:**

1. Create `lib/challenges/<new-slug>.ts` exporting a `Challenge` object
   (id, title, cohortStart, days, weeks, projects).
2. Register it in `CHALLENGES` in `lib/plan.ts`.
3. Either point `CHALLENGE` at it (this deployment serves the new one), or add
   `/c/[slug]` routes and resolve the challenge from the URL to serve several
   at once. Storage is already per-challenge, so users keep separate progress
   in each.

## v2 — accounts, owner dashboard, live community (when you say go)

The moment you want "I see who joined, users see only their own progress,
live leaderboard," you add auth + a database. Recommended on Vercel:

- **Auth**: Clerk (Vercel Marketplace, native integration) — Google/GitHub
  sign-in, and it gives every user a stable `userId`.
- **Database**: Neon Postgres (Vercel Marketplace).

### Tables

```
challenges   (id, title, cohort_start, ...)          ← mirrors lib/challenges
users        (id, name, github, country, is_owner, visibility, created_at)
enrollments  (user_id, challenge_id, start_date, reminder)
checkins     (user_id, challenge_id, day, date)      ← one row per checked day
notes        (user_id, challenge_id, day, text)      ← private
showcase     (user_id, challenge_id, day, title, link, opted_in)
```

### Access rules (enforced in API routes / RLS)

- Every read/write on `checkins`/`notes` is filtered by `user_id = session
  user` — users can only ever touch their own rows.
- Leaderboard reads only `visibility = 'public'` users, aggregated
  (streak + total days), never notes.
- `is_owner = true` (you) unlocks an **/admin** dashboard: sign-up list,
  per-day attrition journey map (the Replit-style funnel), cohort stats,
  showcase moderation.

### Migration path

The localStorage shape (`checkins`, `notes`, settings) maps 1:1 onto the
tables above — on first sign-in, the app can offer "import this device's
progress" by POSTing the local state. Nothing built today is throwaway.
