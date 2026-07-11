// Day 7 — authored lesson: week-1 recap and P2's ship day. Rest-day rules:
// light hours, real shipping — so no guided lab, a short build, and the
// reflection carries extra weight.

import type { Lesson } from "./types";

export const DAY_007: Lesson = {
  day: 7,
  slug: "week-1-recap-ship",
  title: "Recap, explain and ship the foundations",
  module: "AI Engineering Foundations",
  projectId: "P2",
  projectPhase: "SHIP DAY",
  durationMinutes: 100,
  difficulty: "Recap",
  prerequisites: ["Days 1–6 checked in — this day packages them"],
  objectives: [
    "Refactor P1 and P2 to the standard a stranger can use",
    "Record a two-minute demo of the week's work",
    "Publish the benchmark tables (token ratios, compression, eval scores)",
    "Write the Week 1 retrospective, including what AI assistance was used vs hand-written",
    "Ship P2 — project 2 of 20 goes public",
  ],
  whyItMatters:
    "Weekly shipping is the design that keeps 120 days from becoming one giant unfinished project. A recap day converts loose daily work into artifacts with re-entry points: a README someone can follow, a demo someone can watch, numbers someone can quote. It's also a rest day — the point is consolidation at light effort, not new features.",
  jobRelevance:
    "The habit itself is the credential: engineers who ship a documented, demoed increment every week are what every team says it wants and rarely finds. Week 1's artifacts are also your first public proof this challenge is real.",
  missionBrief:
    "Convert week 1 into two understandable portfolio artifacts. Refactor P1 (model client) and P2 (tokenization lab) for a stranger's eyes, add the demo, publish your benchmark numbers, disclose your AI-assistance honestly, and ship P2. Under two hours — this is a rest day.",
  finalEvidence:
    "A stranger can clone both projects and reproduce the primary result of each in under ten minutes.",

  videos: [
    {
      id: "briefing",
      title: "Build briefing — what a good week-1 ship looks like",
      kind: "briefing",
      required: false,
      minutes: 8,
    },
  ],

  sections: [
    {
      id: "ten-minute-test",
      title: "The ten-minute stranger test",
      blocks: [
        {
          t: "p",
          text: "The done-when for today is concrete: a stranger clones your repo, follows the README of P1 and of P2, and reproduces each project's primary result — a validated generate() call, a token-ratio chart — in under ten minutes total. Everything in today's checklist serves that test. Run it literally: fresh folder, clone, follow your own instructions with fresh eyes, fix every step where you had to 'just know' something.",
        },
        {
          t: "list",
          items: [
            "P1 primary result: one typed, validated generate() against the mock adapter (no API key needed for the demo path)",
            "P2 primary result: regenerate the token-ratio table/chart from the committed corpus",
            "Both READMEs: purpose paragraph → quickstart commands → the result the commands produce",
            "Front README: links to P1 and P2 with one-line descriptions and your headline numbers",
          ],
        },
        {
          t: "callout",
          kind: "warn",
          title: "Rest-day discipline",
          text: "No new features today. Every 'while I'm here I could add…' goes into a NEXT.md list instead. Consolidation days protect the streak precisely because they're light.",
        },
        {
          t: "callout",
          kind: "job",
          title: "What an employer sees",
          text: "An honest AI-assistance disclosure ('generated the boilerplate with AI, wrote the merge loop and the failure analysis by hand') reads as integrity plus self-awareness — increasingly a hiring signal, not a confession.",
        },
      ],
    },
    {
      id: "retro",
      title: "The retrospective format",
      blocks: [
        {
          t: "p",
          text: "Write docs/week-01-retro.md in four short sections: SHIPPED (bullet what exists now with links), NUMBERS (the week's measurements — token ratios, compression, eval scores — in one table), LEARNED (three insights in your own words), NEXT (what week 2 attacks). Twenty minutes, honest, public. Future-you mines these for the Day-120 story; near-future-you posts them.",
        },
        {
          t: "callout",
          kind: "info",
          title: "The AI-assistance line",
          text: "One paragraph in the retro: which parts of the week's code and writing were AI-assisted, which were hand-written, and one thing you made sure to understand rather than paste. This course's credibility — and yours — rests on that habit.",
        },
      ],
    },
  ],

  build: {
    brief:
      "Run the ship checklist: refactor pass on P1 and P2 (names, dead code, docstrings — no new features), READMEs to the ten-minute standard, record the two-minute demo (screen capture: clone → command → result, both projects), add the benchmark tables, write the retrospective with the AI-assistance disclosure, update the front README to show 2/20 projects, push everything.",
    requirements: [
      "P1 and P2 pass the ten-minute stranger test (you actually timed a fresh-clone run)",
      "A ~2-minute demo video (screen recording is fine) linked from the front README",
      "docs/week-01-retro.md — SHIPPED / NUMBERS / LEARNED / NEXT + AI-assistance paragraph",
      "Front README: 2/20 projects, links, headline numbers",
    ],
    acceptance: [
      "Fresh clone → both primary results reproduced in under ten minutes",
      "python -m pytest -q green across the repo; ruff clean",
      "The retro exists, is public, and names real numbers",
    ],
    commonMistakes: [
      "Spending the rest day building features instead of packaging (NEXT.md exists for a reason)",
      "A demo that shows code files instead of the result happening",
      "A retro written for nobody ('learned a lot this week') — numbers or it didn't happen",
    ],
    submission: [
      "Paste the repo-wide test run in Verification",
      "Submit the P2 URL and demo link in Ship",
    ],
  },

  hints: [
    {
      level: 1,
      title: "Conceptual direction",
      body: "Do the stranger test FIRST, not last — the failures it exposes are today's actual task list. Most common finding: the README assumes the venv is active and the working directory is the repo root; say both explicitly.",
    },
    {
      level: 2,
      title: "Demo structure",
      body: "Two minutes, no editing needed: 20s — front README on screen, say the week's one-sentence story. 50s — P1: run the mock-adapter demo command, show the typed result and a ledger line. 40s — P2: regenerate the chart, show the ur/en ratio. 10s — the 2/20 progress line. Record in one take; imperfect is shippable.",
    },
    {
      level: 3,
      title: "Retro numbers table",
      body: "One markdown table, five rows: avg latency per call (Day 2 log) · cost per call (P1 ledger) · ur/en token ratio (Day 4 csv) · your BPE compression by language (Day 5) · retrieval top-1/top-3 (Day 6 eval). Every number already exists in a file you committed — this is assembly, not work.",
    },
  ],

  verification: {
    intro: "Ship-day verification: the whole week must be green, not just today.",
    fields: [
      {
        id: "repo-tests",
        label: "Paste the last line of the repo-wide run: python -m pytest -q",
        kind: "paste",
        required: true,
        placeholder: "14 passed in 1.20s",
        mustMatch: "\\d+ passed",
        failHelp:
          "Everything from Days 1–6 must pass together — fix any test the refactor broke before shipping.",
      },
      {
        id: "stranger-test",
        label:
          "I performed the fresh-clone stranger test myself and both primary results reproduced in under ten minutes",
        kind: "attest",
        required: true,
        hint: "Actually clone into a new folder and time it — that's the done-when.",
      },
      {
        id: "retro-url",
        label: "URL of the published Week 1 retrospective (repo file or post)",
        kind: "url",
        required: true,
        placeholder: "https://github.com/you/ax-120/blob/main/docs/week-01-retro.md",
        mustMatch: "^https://",
        failHelp: "Commit docs/week-01-retro.md and paste its GitHub URL.",
      },
      {
        id: "commit-url",
        label: "GitHub commit URL for the ship",
        kind: "url",
        required: true,
        placeholder: "https://github.com/you/ax-120/commit/…",
        mustMatch: "^https://github\\.com/[^/]+/[^/]+/commit/[0-9a-f]{7,40}",
        failHelp: "Repo → Commits → latest → copy the URL.",
      },
    ],
  },

  reflectionPrompts: [
    "What is the one-sentence story of week 1?",
    "Which number from the week are you most confident defending, and why?",
    "What did you use AI assistance for, and what did you deliberately write by hand?",
    "What will you do differently in week 2?",
  ],

  shipFields: [
    {
      id: "repo-url",
      label: "GitHub URL of the shipped P2",
      kind: "url",
      required: true,
      placeholder: "https://github.com/you/ax-120/tree/main/projects/p2",
      mustMatch: "^https://github\\.com/",
    },
    {
      id: "demo-url",
      label: "Demo video URL (YouTube unlisted, Loom, or repo file)",
      kind: "url",
      required: true,
      placeholder: "https://…",
      mustMatch: "^https://",
    },
    {
      id: "ship-note",
      label: "One-line technical note for the P2 portfolio card",
      kind: "text",
      required: true,
      placeholder:
        "Tokenization lab shipped: measured multilingual costs + from-scratch BPE with round-trip tests and a bias experiment",
    },
  ],

  references: [
    { label: "Karpathy — minBPE", url: "https://github.com/karpathy/minbpe" },
    {
      label: "GitHub Actions — get started (week 2 prep)",
      url: "https://docs.github.com/en/actions/get-started",
    },
  ],

  nextDayPreview:
    "Week 2 opens the retrieval region: Day 8 designs chunking experiments instead of guessing a magic chunk size.",

  authored: true,
};
