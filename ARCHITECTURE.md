# Architecture — access model & multi-challenge structure

## Who sees what (v1 — current, live)

There are **no server accounts** in v1, but each device now has **local,
code-locked profiles** (`lib/profiles.ts`): a new person sets a display name +
personal code; a returning person picks their name and enters their code
before their track opens. The session lives in `sessionStorage`, so every new
browser session asks for the code again, and Settings can lock the track at
any time.

| Person | What they can see |
|---|---|
| **A user** | Only their own progress — check-ins, streak, notes — after entering their code. It never leaves their device. Different browser/device = different track. |
| **Someone else on the same device** | The list of display names on the start screen, nothing more — each track needs its owner's code. (Courtesy privacy: v1 has no backend, so devtools can still read `localStorage`.) |
| **Another user elsewhere** | Nothing about anyone else. The leaderboard/showcase are clearly-labeled preview data. |
| **You (owner)** | Aggregate traffic via **Vercel Web Analytics** — visitors, page views, referrers, countries. Not individual users or their progress (that data never reaches a server in v1). |

Codes are stored as salted SHA-256 hashes, asked on every login, and are
**not recoverable** (nothing is uploaded, so there is no email reset).

To turn analytics on: Vercel Dashboard → project **web-interface-100-days-plan**
→ **Analytics** tab → Enable. The `<Analytics />` component is already wired in
`app/layout.tsx`.

### Storage keys

Each challenge **and each profile** gets its own namespace, so tracks never
collide:

```
profiles:v1                              ← device profile list (localStorage)
active-profile:v1                        ← who's logged in (sessionStorage)
track:<challenge-id>:<profile-id>:v1     e.g. track:modern-ai-2026:3f2c…:v1
```

The first profile created on a device automatically adopts any pre-profiles
track (`track:<challenge-id>:v1` or the oldest `hundred-days-modern-ai-v1`),
so nobody loses a streak to the upgrade.

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
