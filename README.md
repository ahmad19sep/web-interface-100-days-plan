# Ahmad X AI — learn AI by building

The course platform at **[radar.hafizahmad.com](https://radar.hafizahmad.com)**
by Ahmad (@aixahmad). Course #1, live now: **120 Days of Production AI
Engineering** — raw APIs → retrieval → evals & reliability → context & cost →
agents → loop engineering → production backend → multimodal → realtime voice →
open-model serving → MCP/A2A → AI security → production capstone. 120 days,
20 portfolio projects, evals-first and production-first.

The whole app is a **3D game world**. A persistent three.js scene — the
journey road — runs behind everything; every tab is a translucent overlay
floating above it, and lessons open as a room inside it. The look comes from
the high-fidelity "Ahmad X World" design handoff in
`100 days app prompt/design_handoff_100_days_ai/`; the curriculum is pure data
in `lib/challenges/production-ai-2026.ts`. Site brand lives in `lib/site.ts` —
one-line change to rename.

## The world

- **One persistent scene** (`components/JourneyWorld.tsx`, mounted in the app
  layout via `WorldChrome`): the 120-day road rendered as a glowing tube that
  climbs **week terraces** — 17 stair steps from the valley floor to the
  summit — with a dim teal guide thread from your position to the end and a
  bright cyan trail over walked ground.
- **Landmarks that grow with you**: every ship day gets a tower, a plaza and
  a bench; each project's **trophy cup grows** with its ship order; Day 120
  is the summit — a rotating **jeweled crown (the king's taj)** under its own
  golden light.
- **Your explorer walks**: click a building and the character travels the
  road to it (EN ROUTE + SKIP), camera following. Clicking opens the day
  panel; check-ins light the road behind you.
- **Real 3D characters, never placeholder balls**: five voxel characters
  built in code plus three VRM avatars (breathing, blinking, arms posed) —
  users pick theirs at signup and in Profile. Ahmad's personal Avaturn GLB
  appears only on the landing door and About me (`lib/avatar-models.ts`).

## Screens & flow

- **Landing (/)** — the front door *is* the login: Ahmad's 3D avatar welcomes
  visitors with his mission ("AI won't replace you — a person who builds with
  it will"), next to name + access code and a signup link. Logged-in visitors
  go straight to Courses.
- **Signup (/start)** — name, 3D character, access code (min 4 chars,
  salted-hashed, non-recoverable). The login handle derives from the name;
  returning users write name + code from any device.
- **Courses** — Udemy-style: every login lands on the catalog first. One
  card per course with progress and Start/Continue; clicking Start opens the
  3-step course setup (start date, reminder, visibility) and unlocks the
  course tabs.
- **Icon rail** (68px, exact prototype glyphs): AX tile → Courses, then
  Journey (map) · Today (clock → current day) · Projects (box) · Leaderboard
  (trophy) · Certification (award) · Profile (person) · Crown last (creator
  dashboard for the owner, About me for everyone else). Settings lives
  inside Profile — no separate tab.
- **Lesson room (/day/N)** — opens as a modal room over the world, exact
  prototype format: DAY 00N badge, objective, video embed, what-to-learn,
  note from Ahmad, done-when; **📦 code · 🎬 video · 📝 my notes** buttons;
  right column has BUILD TASKS (3 per day) and the **⬢ QUIZ GATE** — pass
  ≥60% and the gate opens (+XP, streak, "DAY N+1 NOW ILLUMINATED").
- **Projects** — all 20 as design rows: P#, ship day, region, day range,
  flagship stars, live progress, +250 XP.
- **Leaderboard** — a live **3D podium** (gold/silver/bronze characters on
  stage) above medal-ranked rows; XP derived from days + ships. Public
  profiles only.
- **Certification** — locked preview of the real certificate (named, dated,
  numbered AX-120-HANDLE, signed) with a live "how to earn it" checklist;
  after Day 120 it unlocks with print/download.
- **Profile** — live 3D character, level (XP/500), stats, badge shelf,
  week-by-week region progress, character picker, and ⚙ Settings folded in.
- **About me** — Ahmad's personal GLB avatar full-height (drag to spin) next
  to who-he-is content from `lib/site.ts`.
- **/creator** — owner-only: sign-ups, per-day check-in funnel, every
  account's stats, plus the per-day 👑 CREATOR panel inside each lesson.

## Streak rules (streak-with-grace)

- Every check-in day grows the streak; rest days count too.
- Miss **one** day → the grace token bridges it, streak holds.
- Miss **two+** in a row → the streak **pauses** (never resets to 0); the
  next check-in resumes it.
- The grace token refills after 7 clean consecutive check-ins.

XP is always derived, never stored: 100/lesson day, 250/ship, 40/rest —
shared math in `lib/game.ts` keeps the HUD, profile and leaderboard agreeing.

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
three.js (`@pixiv/three-vrm` for VRM avatars) · Canvas ·
Space Grotesk / JetBrains Mono
