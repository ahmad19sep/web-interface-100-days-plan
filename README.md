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
- **Onboarding** — start date (today / align with cohort), daily reminder,
  profile visibility, display name. Max 3 steps, never shame.
- **Dashboard "Today"** — day counter, today's build card, check-in CTA, this
  week checklist, journey mini-map. Auto-derives four states: **today**,
  **behind/catch-up**, **rest day** (every 7th), and **streak paused**.
- **Journey map** — numbered 10×10 grid with done/today/locked/rest states and
  an optional cohort line overlay.
- **Day detail** — one page per day: video slot, resource, build, done-when,
  private notes journal, GitHub folder link, around-today rail.
- **Projects** — P1–P8 + capstone with SHIPPED / IN PROGRESS / LOCKED states;
  per-project detail with day list and ship criteria.
- **Leaderboard & community** — preview cohort + weekly showcase wall (live
  sync ships with the community backend; your row uses real local stats).
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

Progress is stored **locally in the browser** (`localStorage`) — no accounts,
no backend, instant deploys. The cohort backend (auth, live leaderboard,
showcase wall, journey-map cohort stats) is the natural v2.

## Develop

```bash
npm install
npm run dev
```

## Deploy (Vercel)

```bash
npm i -g vercel   # once
vercel login      # once
vercel --prod
```

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · localStorage · Canvas ·
Space Grotesk / Inter / JetBrains Mono
