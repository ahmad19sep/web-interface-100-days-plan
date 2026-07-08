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

Each challenge day, as the owner:

1. **Push the day's code** to a `day-N` folder (`day-1`, `day-2`, … `day-100`)
   in [ahmad19sep/100-days-learning-ai](https://github.com/ahmad19sep/100-days-learning-ai) —
   every day page's "Open the GitHub folder" button links straight to that
   folder.
2. **Add the lesson video** once it's live: one line in the `VIDEOS` map at
   the top of `lib/challenges/modern-ai-2026.ts`, e.g. `14: "https://youtu.be/XXXX",`.
   Two sibling maps take the same one-line-a-day treatment:
   - `OWNER_NOTES` — a short message shown on that day's page ("Note from
     @aixahmad"), e.g. `14: "Don't skip the Kappa step — it's the point.",`
   - `WATCH_LINKS` — curated links (yours or other creators') listed in the
     day's resource card, e.g.
     `2: [{ label: "Karpathy — GPT Tokenizer", url: "https://youtu.be/…" }],`
3. **Deploy** (`git push` with Vercel connected, or `vercel --prod`). That
   day's page now embeds the player, and the dashboard "Watch" button opens
   it. Days without a link show "video coming soon" plus a "Search this topic
   on YouTube" button built from each day's curated search phrase.

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
