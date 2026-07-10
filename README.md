# Ahmad X AI — learn AI by building

The course platform at **[radar.hafizahmad.com](https://radar.hafizahmad.com)**
by Ahmad (@aixahmad). Course #1, live now: **120 Days of Production AI
Engineering** — raw APIs → retrieval → evals & reliability → context & cost →
agents → loop engineering → production backend → multimodal → realtime voice →
open-model serving → MCP/A2A → AI security → production capstone. 120 days,
20 portfolio projects, evals-first and production-first.

Built from the high-fidelity design handoff in
`100 days app prompt/design_handoff_100_days_ai/`; the curriculum is pure data
in `lib/challenges/production-ai-2026.ts` (generated from the prepared
120-day JSON). Site brand lives in `lib/site.ts` — one-line change to rename.

## Screens

- **Landing** — logged-out page for the platform (hero with a live three.js
  3D journey city, how-it-works, the 20 projects, weekly rhythm, about me,
  join CTA).
- **Start / login** — every learner has their own **account**: a username +
  personal code (min 4 chars, salted-hashed) that opens the same track from
  any phone or laptop.
- **Onboarding** — start date (today / align with cohort), daily reminder,
  profile visibility. Max 3 steps, never shame. Lands on **Courses**.
- **Courses** — the catalog (own courses only, no external ones): one card
  per course with progress and a Start/Continue button. Post-login home.
- **Dashboard "Today"** — day counter, today's build card, this-week
  checklist, 3D journey mini-map. One primary button — **Start Day N** — that
  opens the day page; check-in deliberately does NOT live on the dashboard.
  Auto-derives four states: today, behind/catch-up, rest day (every 7th),
  streak paused.
- **Journey map** — numbered 10×12 grid with done/today/locked/rest states
  and an optional cohort line overlay.
- **Day detail** — the only place a day can be completed: goal, why-it-
  matters, what-to-learn, build, done-when, proof-to-post, difficulty/time
  badges, the creator's grouped "📦 Today's learnings" (video embed, GitHub
  folder, note, resource links), private notes, and the quiz (60% pass gate;
  day-order locking).
- **Projects** — P1–P20 with SHIPPED / IN PROGRESS / LOCKED states;
  per-project detail with day list and ship criteria.
- **Leaderboard & community** — real ranked list of everyone with a public
  profile (name, day, streak, days done, badges, quiz score), live from the
  database; private profiles never appear. Showcase wall is still preview
  data (see ARCHITECTURE.md).
- **Profile / Settings / Completion certificate / Share cards** (1200×630 +
  1080×1080 PNG export).
- **/creator** — owner-only dashboard: sign-ups, per-day check-in funnel,
  every account's stats.

## The 3D UI

- Site-wide **three.js backdrop**: drifting emerald/amber particle field over
  a moving wireframe floor, with pointer parallax — behind every screen from
  login to certificate.
- **Journey3D**: the track rendered as a 3D city (one tower per day; done
  days glow emerald, today pulses amber) on the landing hero and dashboard.
- Every button is an extruded 3D block (raised ledge, presses flat on
  click); every card lifts in 3D on hover; inputs are pressed-in wells;
  key cards tilt toward the cursor. All of it goes still under
  `prefers-reduced-motion`; three.js loads client-side only.

## Streak rules (streak-with-grace)

- Every check-in day grows the streak; rest days count too.
- Miss **one** day → the grace token bridges it, streak holds.
- Miss **two+** in a row → the streak **pauses** (never resets to 0); the
  next check-in resumes it.
- The grace token refills after 7 clean consecutive check-ins.

Progress lives in a **shared Postgres database** (`db/schema.sql`); codes are
salted-hashed and not recoverable. See **[ARCHITECTURE.md](ARCHITECTURE.md)**
for the access model, one-time DB setup, and the **multi-course roadmap**
(adding course #2 = one data file + registry entry + a lossless
`challenge_id` migration).

## Daily owner workflow

**Live, from the app — no deploy needed.** Log in as the owner account and
open that day's page: the **"👑 CREATOR"** panel (visible only to you) sets
the video link, GitHub link, note, resource links (one per line,
`Label | https://url`), and the quiz builder — one Save updates that day for
every user immediately. GitHub defaults to the `day-N` folder in
[ahmad19sep/100-days-learning-ai](https://github.com/ahmad19sep/100-days-learning-ai)
if left blank.

**Bulk pre-seeding via code** (optional): `VIDEOS`, `OWNER_NOTES`,
`WATCH_LINKS`, and `QUIZZES` maps in the course file take one line per day;
anything set live from the app wins over them. Quiz answers store only the
selected option — never a "correct" flag — so fixing a `correctIndex`
re-grades everyone retroactively. Days without a video show "coming soon"
plus a topic search button.

## Develop

```bash
npm install
cp .env.local.example .env.local   # fill in DATABASE_URL — see ARCHITECTURE.md
npm run dev
```

## Deploy

Push to `main` — the GitHub repo is connected to Vercel and deploys to
production automatically (also aliased to
`web-interface-100-days-plan.vercel.app`). Domain: `radar.hafizahmad.com`
via CNAME → `cname.vercel-dns.com` at Hostinger.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Postgres (Neon, `pg`) ·
three.js · Canvas · Space Grotesk / Inter / JetBrains Mono
