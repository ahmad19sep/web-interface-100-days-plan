# Handoff: 100 Days of Modern AI — companion tracker web app

## Overview
A personal 100-day learning-challenge tracker for the "AI Radar" (@aixahmad) community. Each
user follows a 100-day curriculum (daily lesson video + build task), checks in daily, keeps a
streak (with one grace token), logs private notes, and ships 8 projects + a capstone — while
seeing the community around them. Every user has their **own** track: "my Day N" ≠ calendar day.

This bundle is a **clickable desktop prototype (1280px)** covering the full flow: landing,
onboarding, dashboard (with all states), journey map, day detail, projects, project detail,
leaderboard, profile, settings, 100-day completion, and the shareable progress card.

## About the Design Files
The file in this bundle (`100 Days of Modern AI.dc.html`) is a **design reference created in
HTML** — a prototype showing intended look and behavior, **not production code to copy directly**.
It is authored as a "Design Component" (a custom streaming runtime: `<x-dc>` template + a
`Component extends DCLogic` class, requiring `support.js`). **Do not ship this format.**

Your task: **recreate these designs in the target codebase's environment** using its established
patterns and libraries. If no app exists yet, the recommended stack is **React + TypeScript +
Tailwind (or CSS Modules)** with a light client router — but use whatever the repo already has.
Read the HTML for exact layout/values; re-implement as idiomatic components.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are all specified
below and present in the HTML. Recreate the UI pixel-perfectly using the codebase's libraries.

## Design Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| bg | `#0D1117` | app background (near-black blue-charcoal) |
| bg-radial | `radial-gradient(1200px 600px at 78% -8%, rgba(53,211,153,.06), transparent 60%)` | subtle page glow |
| panel | `#0F141A` | sidebar / darker panels |
| card | `#12181F` | primary card surface |
| card-2 | `#161C24` | secondary buttons, chips |
| inset | `#0F141A` / `#0C1116` | inset wells (video, note field) |
| border | `#212934` | card borders |
| border-2 | `#262E39` | button borders |
| border-3 | `#1E262F` | inset borders |
| divider | `#1B222B` | nav/hairline dividers |
| text | `#ECE6DA` | primary warm off-white |
| text-2 | `#C6CDD6` | strong body |
| muted | `#9AA3AF` | body copy |
| muted-2 | `#8A93A0` | secondary |
| muted-3 | `#6C7581` / `#5D6672` | labels, captions |
| dim | `#4A5460` | locked numbers |
| **emerald** | `#35D399` | PRIMARY accent — progress, streaks, CTAs, links |
| emerald-deep | `#1DBA89` / `#16A97E` | CTA gradient end, "done" fills |
| emerald-done | `#2AB98A` | completed journey cells |
| emerald-rest-done | `#164034` | completed rest-day cells |
| emerald-tint | `rgba(53,211,153,.08–.16)` | accent backgrounds |
| **amber** | `#F5B54B` | SECONDARY accent — RESERVED for "today / needs you" only |
| amber-tint | `rgba(245,181,75,.08–.16)` | today backgrounds |
| link (a) | `#35D399`; hover `#5BE3B0` | |
| avatar gradients | violet `#7C6CF5→#5B4BD6`, emerald `#35D399→#16A97E`, amber `#F5B54B→#D98A2B`, pink `#EC6A9C→#C13E77`, blue `#4AA8FF→#2B7FD6` | |

Accent rule: **emerald is the only progress/CTA color; amber appears ONLY for the current/today
state and "needs you" moments.** Never use red "streak lost" states.

### Typography
- **Display / headings:** `Space Grotesk` (600/700). Headings use `letter-spacing:-.02em`,
  hero uses `-.025em`, big numbers `-.04em`.
- **Body:** `Inter` (400/500/600). Base body 14–15px, line-height ~1.6.
- **Mono (signature):** `JetBrains Mono` (400/500/700/800) — day numbers, streaks, stats, tags,
  code, and any numeric badge. The giant DAY counter is JetBrains Mono 800.
- Google Fonts import: `Space+Grotesk:wght@400;500;600;700` + `Inter:wght@400;500;600;700`
  + `JetBrains+Mono:wght@400;500;700;800`.
- Type sizes seen: hero 57px; giant day counter 88px (dashboard) / 100–150px (completion & share
  card); section H2 30px; screen H1 26px; card title 24px; body 14–15px; labels 11–12px.

### Spacing / radius / motion
- Radii: cards 16–22px, buttons 10–12px, chips/pills 100px, journey cells 5–9px, small dots 2–6px.
- Card padding 20–30px; grid gaps 6–22px.
- Max content width: 1280px (landing), app main column 1030px, sidebar 250px.
- Shadows: `0 30px 60px -30px rgba(0,0,0,.6)` (hero card), `0 20px 40px -16px rgba(0,0,0,.7)` (toast).
- Keyframes: `pulseRing` (2s infinite amber ring on today cell), `fadeUp` (.3–.4s ease on state
  changes), `toastIn` (.3s), `flick` (1.1s cursor blink). **Respect `prefers-reduced-motion`** —
  the prototype disables all animation under it.
- Touch/hit targets ≥44px; WCAG AA contrast on dark palette; visible keyboard focus.

## Screens / Views

### 1. Landing (logged out) — `startScreen: 'landing'`
- **Layout:** 1280px centered, 40px side padding. Sticky blurred top nav (78px). Then sections:
  hero (2-col grid `1.05fr .95fr`, 56px gap), how-it-works (3-col), 8-projects (4-col), weekly
  rhythm + creator (2-col), join CTA banner + footer.
- **Nav:** logo (32px rounded-9px emerald gradient square "A") + "100 Days of Modern AI" +
  "AI RADAR" mono pill; links How it works / The 8 projects / Creator; "Log in" (ghost) + "Start
  the challenge" (emerald-gradient button).
- **Hero:** live pill ("Cohort live now · Day 37 of 100" with pulsing dot); H1 57px
  "100 days. / 8 real projects. / **Modern AI, built by hand.**" (last line emerald); subcopy;
  two CTAs ("Start Day 1 — free" → onboarding, "See the dashboard" → dashboard); 3 stat blocks
  (14,208 learners / 1.2M check-ins / 89k projects). Right: journey-map preview card (10-col grid
  of 100 cells + legend).
- **How it works:** 3 numbered cards (01 Watch the lesson / 02 Build the task / 03 Check in), each
  with a line icon in an emerald-tint rounded square.
- **8 projects:** 4-col grid of project cards (mono tag, name, blurb, day range).
- **Weekly rhythm:** amber-tinted card "Every 7th day, you rest." + a 7-cell week strip (6 dim +
  1 dashed amber "R"). Creator card: Ahmad avatar + video-embed placeholder.
- **Join CTA:** emerald-tint banner, H2 34px + button; footer row.

### 2. Onboarding — `startScreen: 'onboarding'`
- Centered 560px card, 3-segment progress bar (all filled). 3 steps in one view: (1) start date —
  "Start today" (selected, emerald) vs "Align with cohort"; (2) daily reminder — Morning / Evening
  8:30 PM (selected) / No reminder pills; (3) profile visibility — Public (selected) vs Private.
  Primary "Start Day 1 →" → dashboard. Cancel → landing. Max 3 steps; never shame.

### 3. Dashboard "Today" (home, most important) — `startScreen: 'dashboard'`
- **Shell:** left sidebar (250px, sticky, full height) with logo, nav (Today / Journey map /
  Projects / Leaderboard / Profile / Settings — active item = emerald-tint bg + emerald text +
  icon), and a bottom user card (avatar "SK", "Saad Khan", mono "Day 37 · 🔥 12"). Main column
  1030px, 34px/46px padding.
- **Header:** greeting "Assalam-o-alaikum, Saad" + H1 "Today"; right: streak chip pill
  ("🔥 12 day streak · 🛡 1 grace").
- **Demo-states switcher** (a prototype affordance, gated by `showStateTabs` prop — see State): a
  pill row "Demo states: Today / Behind — catch-up / Rest day / Streak paused". In production this
  is NOT a UI control; the app computes which state to show from the user's data.
- **TODAY state:** 2-col grid `300px 1fr`. Left = day-counter card: mono "MY DAY", giant "037"
  (emerald, 88px), "/ 100", divider, progress row (37%) + emerald progress bar, "Projects shipped
  2 / 8". Right = today task card: badges ("TODAY'S BUILD" amber, "P2 · Eval harness" emerald),
  H2 title, description, 2 info tiles (📺 Lesson ~22 min / ✓ Done when), and action row: primary
  **Check in — mark Day 37 done** (emerald gradient, check icon) + Notes + Watch (secondary).
  Below: 2-col grid — "This week" checklist (done rows with emerald check squares, today row amber,
  locked row dim) and "Journey map" mini (10-col, "Open full →" → journey).
- **Check-in behavior:** clicking Check in shows a bottom-center toast (`toastIn` anim, auto-hide
  ~3.2s): emerald check circle + "Shabash! Day 37 logged." / "Streak → 13 🔥 · see you tomorrow".
  Small and tasteful — no confetti.

### 3b. Dashboard — BEHIND / CATCH-UP state
- Calm emerald-tint banner: "The cohort is on Day 40 — you're on Day 37. No stress." + reassurance
  (streak & grace untouched). Same 2-col layout; left card "MY NEXT DAY 037" + "3 days to catch
  up"; right card resumes the next incomplete day with "Resume Day 37" CTA. **Never shame; always
  center my next incomplete day.**

### 3c. Dashboard — REST DAY state (days 7,14,21…)
- Amber-tinted hero: "REST DAY · DAY 35" / "No new task today. Breathe." No build task. 2-col:
  week recap checklist (some checked, strikethrough) + community showcase preview (2 items,
  "See wall →" → leaderboard). Streak counts rest days.

### 3d. Dashboard — STREAK PAUSED state
- Neutral banner (⏸, NOT red): "Your streak is paused — not lost." Explains grace token spent +
  a second miss → paused (never reset to 0). Left card shows "12 paused" (muted) + grace token
  spent (dimmed 🛡, "Refills after 7 clean check-ins"). Right: "Bring your streak back to life" +
  "Check in — resume streak" CTA. Streak logic: 1 miss consumes grace (shield dims); 2 consecutive
  misses → paused.

### 4. Journey map — `startScreen: 'journey'`
- Header: "Your 100-day track" / H1 "Journey map"; right 3 stats (36 done / 37 today / 63 to go).
- Big card: legend (Done / Today / Locked / Rest day) + **"Show cohort line" toggle** (switch).
  10×10 grid of numbered cells (aspect-ratio 1, radius 9px, 9px gap). Cell states:
  - done (non-rest): bg `#2AB98A`, number `#08281E` bold
  - done rest: bg `#164034`, number `#5FC7A4`
  - current (day 37): bg `rgba(245,181,75,.16)`, 1.5px `#F5B54B` border, **pulseRing** animation,
    number `#F5B54B`
  - locked: bg `#1C2530`, number `#4A5460`
  - locked rest: transparent + 1px dashed `#3A4552` border
  - When cohort toggle on: a dashed amber horizontal line overlays the grid at ~40% height with a
    "cohort · Day 40" tag. Tapping a done/current cell → Day detail (`selectedDay`).

### 5. Day detail — `startScreen: 'day'`
- "← Back to journey map". 2-col `1fr 320px`. Left: big mono "037 / 100" + tags (P2 · Eval harness,
  TODAY) + H1 task title; video-embed placeholder (play button, "Eval harnesses from scratch · AI
  Radar · 22:14"); 2 tiles (📖 THE BUILD / ✓ DONE WHEN); "Your notes" card (🔒 Private) with a
  journal entry + blinking cursor. Right sticky rail: "Mark Day 37 done" CTA + "Open the GitHub
  folder" link (GitHub icon); "Around today" list (036 done / 037 today / 038 locked).

### 6. Projects — `startScreen: 'projects'`
- Header + "2 / 8 shipped · Capstone locked" chip. 3-col grid of 9 cards (P1–P8 + Capstone "C").
  Card: mono tag (color by state) + status badge (SHIPPED emerald / IN PROGRESS amber / LOCKED
  gray), name, blurb, day range + fraction (e.g. "4/14"), progress bar. Locked cards opacity .62
  and not clickable; shipped/in-progress → Project detail. Data (tag,name,blurb,days,done/total,
  state) is in `projectCards()` in the HTML — copy verbatim.

### 7. Project detail — `startScreen: 'projectDetail'` (shown for P2)
- "← All projects". 2-col `1fr 300px`. Left: P2 tag + IN PROGRESS badge, H1 "RAG bot + eval",
  description, "Days 13–26 · 14 days" day list (done/current/locked rows → Day detail). Right
  sticky: progress card ("4 / 14 days", 29% bar) + "Ship-it checklist" (checked + unchecked rows)
  + "Go to today's task" → Day detail. Day rows in `p2days()`.

### 8. Leaderboard & community — `startScreen: 'leaderboard'`
- "Ranked by consistency — never speed" / H1. 2-col `1.15fr 1fr`. Left card: filter pills
  (This week active / All time / 🇵🇰 My country) + ranked rows (rank, avatar, name, "country · Day
  N", "🔥 streak" + "N days"). **The current user's row (rank 12, "Saad Khan (you)") is
  highlighted** with emerald-tint bg + emerald border. Right card: "Weekly showcase wall" (opt-in)
  — 4 cards each with a gradient thumbnail (project tag), avatar, title, "who · Day N", ❤ likes.
  Ranked by current streak + total days, never speed. Data in `leaderList()` / `showcaseList()`.
  **No infinite-scroll feed** — this is a training log, not a social network.

### 9. Profile — `startScreen: 'profile'`
- Header row: 80px rounded-22px violet-gradient avatar "SK", name + "Public profile" tag, "Joined
  Dec 2, 2025 · Karachi, Pakistan", GitHub link; right "Share card" button → share screen.
- 4 stat cards (🔥 12 current streak / 36 days done / 2 projects shipped / 41 longest streak).
- Journey-map thumbnail card (20-col mini grid) + "Open full →".

### 10. Settings — `startScreen: 'settings'`
- 640px column of setting cards: Daily reminder (08:30 PM) / Public profile (toggle on) / Private
  notes (toggle on) / Account (Edit profile, Log out → landing). Language flavor toggle can be
  added here (English / Urdish) — current build is English-only per request.

### 11. 100-day completion — `startScreen: 'complete'`
- Centered 720px certificate card, emerald-bordered, radial glow. Mono "CHALLENGE COMPLETE", giant
  "100 / 100 days · done", H1 "You finished the 100 days.", summary, 3 stats (9 projects / 🔥 58
  best streak / 112 days elapsed), CTAs "Get your share card" + "View profile". Tasteful, no
  confetti storm.

### 12. Shareable progress card — `startScreen: 'share'`
- "← Back to profile" + title. **1200×630 landscape** card (aspect-ratio 1200/630): radial emerald
  glow, header (logo + "100 Days of Modern AI", "AI RADAR · @aixahmad"), giant mono "037 / 100",
  "Saad Khan" + 🔥 12 streak + 2/8 projects, and a full 50-col micro journey-map row at the bottom.
  Below: **1080×1080 square** variant (same content, stacked) + a share panel (Download PNG / Copy
  image / Share to X · LinkedIn). Green = done, amber = today. Both are auto-generated, on-brand.
  In production these should be rendered server-side (or via canvas/OG-image) at exact pixel sizes.

## Interactions & Behavior
- **Navigation:** sidebar nav + in-screen CTAs swap the active screen. Sidebar active state maps
  sub-screens to a parent (day→journey, projectDetail→projects, complete→profile).
- **Per-user track:** UI always centers *my* next incomplete day; "my Day N" ≠ calendar day.
- **Streak:** daily check-in keeps streak; 1 miss consumes grace token (shield dims); 2 consecutive
  misses → **paused** (shown "paused", never "lost"/0). Grace refills after 7 clean check-ins.
- **Check-in:** primary action, always above the fold; fires the "Shabash!" toast.
- **Notes** private by default; **showcase** posts opt-in.
- **Cohort line:** optional overlay on journey map (toggle).
- **Rest days** (every 7th): distinct calm variant, recap checklist + showcase, no new task.
- Animations: `fadeUp` on state switches, `pulseRing` on today cell, `toastIn` toast; all disabled
  under `prefers-reduced-motion`.

## State Management
State needed (see `Component` class in the HTML):
- `screen` — active view (enum of the 12 screens above). Router.
- `dashState` — `today | catchup | rest | paused` (in production, derived from user data, not a
  manual toggle).
- `selectedDay` — which day the Day-detail view shows.
- `showCohort` — journey cohort-line overlay on/off.
- `toast` — check-in confirmation visible (auto-clears after ~3.2s).
- Prototype props: `startScreen` (initial view) and `showStateTabs` (show/hide the demo-states
  switcher) — both are prototype conveniences; drop them in production.
- Data models to port from the logic class: `buildDays(current)` (100 day cells + states),
  `projectCards()` (9 projects), `p2days()`, `leaderList()`, `showcaseList()`. Copy the copy/values
  verbatim for fidelity, then wire to real data.

## Data fetching (production)
Per user: current day, streak, grace-token status, per-day completion + notes, per-project
progress, leaderboard (streak + total, filterable this week / all time / country), showcase posts.
Share cards should be generated as real images at 1200×630 and 1080×1080.

## Assets
- **Fonts:** Space Grotesk, Inter, JetBrains Mono (Google Fonts).
- **Icons:** inline SVG (stroke, 24×24 viewBox) — play, chevrons, check, grid, list, bars, user,
  gear, clock, info, heart, share, GitHub mark. Replace with the codebase's icon library
  (e.g. lucide) — the shapes used map 1:1 to lucide names.
- **No raster images / no 3D / no stock art.** Video + thumbnail areas are CSS placeholders — wire
  to real YouTube embeds. Avatars are CSS gradients — replace with user images.
- Emoji used sparingly: 🔥 (streak), 🛡 (grace), ⏸ (paused), flags. Keep or swap for icons per the
  codebase's convention.

## Do NOT
- No neon cyberpunk gradients, no glassmorphism overload, no stock 3D robots.
- No infinite-scroll social feed. No red "streak lost" punishment states.
- Don't bury Check in below the fold. Latin script only — never Arabic-script Urdu.

## Files
- `100 Days of Modern AI.dc.html` — the full prototype (all 12 screens + logic/data). Design
  reference only; read it for exact markup, inline styles, and data.
- `support.js` — runtime for the `.dc.html` format (needed only to open the prototype locally;
  not part of your implementation).

## How to open the prototype locally
Serve the folder over http (e.g. `npx serve .`) and open the `.dc.html` — the custom elements need
`support.js` loaded alongside it. Use the `startScreen` value to jump to any screen while reviewing.
