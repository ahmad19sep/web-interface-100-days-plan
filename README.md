# 100 Days of Modern AI — Companion Tracker

The web app for the **100 Days of Modern AI** public learning challenge by
AI Radar (@aixahmad): raw-API foundations → evals & reliability → context &
cost → agents from scratch → MCP → retrieval depth → AI security → capstone
& client sprint.

Built from the high-fidelity design handoff in
`100 days app prompt/design_handoff_100_days_ai/`, wired to the real 100-day
curriculum.

## Screens

- **Landing** — logged-out marketing page (hero, how-it-works, the 8 projects,
  weekly rhythm, creator, join CTA).
- **Start / login** — every learner has their own **account**: a username +
  personal code (min 4 chars, stored salted-hashed) that opens the same track
  from any phone or laptop. Settings can log out anytime; logging back in
  from any device with the same username + code picks up right where you
  left off.
- **Onboarding** — start date (today / align with cohort), daily reminder,
  profile visibility. Max 3 steps, never shame.
- **Dashboard "Today"** — day counter, today's build card, check-in CTA, this
  week checklist, journey mini-map. Auto-derives four states: **today**,
  **behind/catch-up**, **rest day** (every 7th), and **streak paused**.
- **Journey map** — numbered 10×10 grid with done/today/locked/rest states and
  an optional cohort line overlay.
- **Day detail** — one page per day: video slot, resource, build, done-when,
  private notes journal, GitHub folder link, around-today rail.
- **Projects** — P1–P8 + capstone with SHIPPED / IN PROGRESS / LOCKED states;
  per-project detail with day list and ship criteria.
- **Leaderboard & community** — real ranked list of everyone with a public
  profile (name, day, streak, days done), pulled live from the database;
  private profiles never appear. The weekly showcase wall is still preview
  data (see ARCHITECTURE.md's v3 section).
- **Profile** — stats (current streak, days done, projects shipped, longest
  streak) + journey thumbnail.
- **Settings** — reminder, public profile, private notes, account.
- **100-day completion** — certificate screen.
- **Share card** — 1200×630 and 1080×1080 progress cards, PNG download, copy
  image, share intent.

## Streak rules (streak-with-grace)

- Every check-in day grows the streak; rest days count too.
- Miss **one** day → the grace token bridges it, streak holds.
- Miss **two+** in a row → the streak **pauses** (never resets to 0); the next
  check-in resumes it.
- The grace token refills after 7 clean consecutive check-ins.

Progress is stored in a **shared Postgres database** — every learner's
username + code opens the same track from any device (see
`db/schema.sql`). Codes are salted-hashed and can't be recovered. The owner
sees aggregate visitors via Vercel Web Analytics. See
**[ARCHITECTURE.md](ARCHITECTURE.md)** for the full access model, the
one-time database setup, and the multi-challenge structure
(`lib/challenges/`).

## Daily owner workflow

**Live, from the app — no deploy needed.** Log in as the owner account and
open that day's page: a **"👑 CREATOR"** panel appears (visible only to you)
with video link, GitHub link, a note, and a quiz builder (add/remove
questions and options, mark the correct one per question) — one Save button
for all of it. Saving updates that day's page for every user immediately.
GitHub defaults to the `day-N` folder pattern in
[ahmad19sep/100-days-learning-ai](https://github.com/ahmad19sep/100-days-learning-ai)
if you leave it blank. Everything you set shows to users in one grouped
**"📦 Today's learnings from …"** section on that day's page, instead of
scattered across the layout.

**Bulk-loading many days at once, via code** (optional — still works,
useful for pre-seeding before the challenge starts): `VIDEOS`, `OWNER_NOTES`,
and `WATCH_LINKS` in `lib/challenges/modern-ai-2026.ts` take one line per
day, e.g. `14: "https://youtu.be/XXXX",`. Anything set live from the app
takes priority over these when both exist for the same day.

`QUIZZES` (also in that file) works the same way as a bulk-preload fallback
for the quiz builder above — a DB-set quiz for a day always wins over it.
Either way, answers are never stored as "correct/incorrect", only the
selected option — so fixing a `correctIndex` (in the app or in code)
re-grades everyone retroactively.

Days without a video show "video coming soon" plus a "Search this topic on
YouTube" button built from each day's curated search phrase.

## Develop

```bash
npm install
cp .env.local.example .env.local   # fill in DATABASE_URL — see ARCHITECTURE.md
npm run dev
```

## Deploy (Vercel)

```bash
npm i -g vercel   # once
vercel login      # once
vercel --prod
```

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Postgres (Neon) ·
Canvas · Space Grotesk / Inter / JetBrains Mono
