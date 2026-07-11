// Day 1 — fully authored lesson (the vertical slice every other day will
// follow). Original explanation written for this course; external docs are
// optional references at the end, never required reading.

import type { Lesson } from "./types";

export const DAY_001: Lesson = {
  day: 1,
  slug: "engineering-monorepo-learning-contract",
  title: "Set up the engineering monorepo and learning contract",
  module: "AI Engineering Foundations",
  projectId: "P1",
  projectPhase: "PROJECT START",
  durationMinutes: 150,
  difficulty: "Foundation",
  prerequisites: [
    "A computer with Python 3.11+ installed",
    "A GitHub account",
    "Basic terminal comfort (cd, ls, running commands)",
  ],
  objectives: [
    "Create the monorepo that will hold all 120 days of code, notes, tests and datasets",
    "Configure pyproject.toml as the single source of project truth",
    "Wire Ruff (lint + format) and pytest so quality is checked by command, not by eye",
    "Write a validation script that proves the repo's health in one command",
    "Commit a repository a stranger could clone and run",
  ],
  whyItMatters:
    "Every AI engineer you'll compete with can call a model API. Far fewer can hand you a repository that installs, tests and validates itself with one command. That discipline — reproducibility — is what separates production engineers from notebook tinkerers, and it's the foundation every one of the next 119 days builds on.",
  jobRelevance:
    "You can create reproducible, maintainable AI engineering repositories rather than disconnected demo scripts. Interviewers routinely open a candidate's repo and try `pip install -e . && pytest` — today makes that moment work in your favor.",
  missionBrief:
    "Build the engineering foundation that will support all 120 days of code, notes, tests, datasets, projects, and portfolio evidence. By the end of this lesson, your repository installs, tests, lints, and validates itself using one command.",
  finalEvidence:
    "A public GitHub repository where a fresh clone passes install → pytest → ruff → validation, plus the commit URL submitted below.",

  videos: [
    {
      id: "concept",
      title: "Concept — why monorepos and reproducibility",
      kind: "concept",
      required: true,
      minutes: 12,
    },
    {
      id: "walkthrough",
      title: "Code walkthrough — building today's repo live",
      kind: "walkthrough",
      required: false,
      minutes: 18,
    },
  ],

  sections: [
    {
      id: "why-monorepo",
      title: "Why one repository for 120 days",
      blocks: [
        {
          t: "p",
          text: "Over the next 120 days you will produce code, tests, datasets, evaluation reports, and twenty portfolio projects. If each lives in its own folder on your desktop, by week four you will have a junk drawer. We use a monorepo — one version-controlled repository with a predictable folder for everything — so that every day's work lands in a known place and one command can check all of it.",
        },
        {
          t: "list",
          items: [
            "days/ — one folder per day (day-001, day-002 …) for daily builds",
            "projects/ — the twenty portfolio projects, each self-contained",
            "datasets/ — small shared datasets and fixtures used by evals",
            "docs/ — notes, decisions and evidence you'll mine for your portfolio",
            "scripts/ — repo tooling, starting with today's validation script",
          ],
        },
        {
          t: "callout",
          kind: "info",
          title: "Rule of the road",
          text: "Nothing lives outside the structure. If a file has no home, it gets a home added to the structure — it does not sit in the repo root.",
        },
        {
          t: "callout",
          kind: "job",
          title: "What an employer sees",
          text: "A single repo with a clean layout and green checks reads as 'this person has shipped before'. Twenty scattered demo folders read as 'student exercises'.",
        },
      ],
    },
    {
      id: "pyproject",
      title: "pyproject.toml — one file, all the truth",
      blocks: [
        {
          t: "p",
          text: "pyproject.toml is Python's standard project manifest. It declares your project's name, Python version, dependencies, and the configuration for tools like Ruff and pytest — all in one file, so nothing hides in per-machine settings. When a teammate (or an employer) clones your repo, this file is why `pip install -e .` just works.",
        },
        {
          t: "code",
          lang: "toml",
          file: "pyproject.toml",
          code: `[project]
name = "ax-120"
version = "0.1.0"
description = "120 days of production AI engineering — daily builds and projects"
requires-python = ">=3.11"
dependencies = []

[project.optional-dependencies]
dev = ["pytest>=8", "ruff>=0.6"]

[tool.ruff]
line-length = 100
src = ["days", "projects", "scripts"]

[tool.pytest.ini_options]
testpaths = ["days", "projects", "scripts"]`,
        },
        {
          t: "p",
          text: "Two details matter. First, dev tools (pytest, ruff) are optional-dependencies — production installs stay lean, and `pip install -e \".[dev]\"` pulls in the toolchain. Second, both tools are configured here rather than in separate dotfiles, so the manifest really is the single source of truth.",
        },
        {
          t: "callout",
          kind: "interview",
          title: "Interview question you can now answer",
          text: "\"How do you make a Python project reproducible across machines?\" — pin the Python version and dependencies in pyproject.toml, install editable with extras, and gate merges on the same commands CI runs.",
        },
      ],
    },
    {
      id: "quality-gates",
      title: "Ruff, pytest, and the one-command validation",
      blocks: [
        {
          t: "p",
          text: "Quality you check by eye decays; quality you check by command compounds. Ruff lints and formats (it replaces flake8 + isort + black in one fast tool). pytest runs anything named test_*.py. Today you'll also write scripts/validate.py — the repo's own health check — which verifies the folder structure exists and prints a curriculum status. From now on, 'is the repo okay?' is one command, and every future day adds its tests into the same gate.",
        },
        {
          t: "terminal",
          code: "python -m pytest -q && python -m ruff check . && python scripts/validate.py",
        },
        {
          t: "output",
          label: "what green looks like",
          code: `2 passed in 0.03s
All checks passed!
AX-120 VALID · days present: 1/120 · structure OK`,
        },
        {
          t: "callout",
          kind: "warn",
          title: "The trap to avoid",
          text: "Do not skip the failing-lint exercise in the lab. Feeling a gate catch a real mistake once teaches you more than reading about linters for an hour.",
        },
      ],
    },
  ],

  lab: {
    intro:
      "Build the repo step by step. Run every command yourself — the point is muscle memory, not copy-paste speed.",
    steps: [
      {
        id: "venv",
        title: "Create the project and environment",
        instruction:
          "Make the project folder, enter it, and create a virtual environment so today's tools never pollute your system Python.",
        command:
          "mkdir ax-120 && cd ax-120 && python -m venv .venv && source .venv/bin/activate",
        expected: "Your prompt now shows (.venv).",
        commonError:
          "Windows PowerShell: activate with .venv\\Scripts\\Activate.ps1 instead of `source`.",
        troubleshooting:
          "If `python` is not found, try `python3`. If activation is blocked on Windows, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, then activate again.",
      },
      {
        id: "structure",
        title: "Create the folder structure",
        instruction:
          "Create the five standard folders plus a first day folder. The .gitkeep files let git track the empty folders.",
        command:
          "mkdir -p days/day-001 projects datasets docs scripts && touch datasets/.gitkeep docs/.gitkeep projects/.gitkeep",
        expected: "ls shows: datasets days docs projects scripts",
      },
      {
        id: "pyproject",
        title: "Add pyproject.toml",
        instruction:
          "Create pyproject.toml in the repo root with the manifest from the Understand section (copy it from there).",
        expected: "The file exists at the repo root and parses (next step proves it).",
        commonError:
          "TOML is indentation-agnostic but quote-sensitive — every string needs double quotes.",
      },
      {
        id: "install",
        title: "Install the project with dev tools",
        instruction:
          "Editable-install the project with its dev extras. This is the exact command a fresh clone will use.",
        command: 'pip install -e ".[dev]"',
        expected: "Successfully installed ax-120 … pytest … ruff …",
        troubleshooting:
          "\"neither 'setup.py' nor 'pyproject.toml' found\" means you're not in the repo root. `error in pyproject.toml` means a TOML typo — the message points at the line.",
      },
      {
        id: "first-test",
        title: "Write the first test and run pytest",
        instruction:
          "Give day-001 a real test so the test gate is never empty.",
        code: {
          lang: "python",
          file: "days/day-001/test_setup.py",
          code: `from pathlib import Path

REQUIRED = ["days", "projects", "datasets", "docs", "scripts"]


def test_structure_exists():
    root = Path(__file__).resolve().parents[2]
    for folder in REQUIRED:
        assert (root / folder).is_dir(), f"missing folder: {folder}"


def test_manifest_exists():
    root = Path(__file__).resolve().parents[2]
    assert (root / "pyproject.toml").is_file()`,
        },
        command: "python -m pytest -q",
        expected: "2 passed",
      },
      {
        id: "break-lint",
        title: "Introduce a lint error on purpose",
        instruction:
          "Add `import os` at the top of test_setup.py (it's unused), then run Ruff and watch the gate catch it.",
        command: "python -m ruff check .",
        expected: "F401 `os` imported but unused — 1 error found.",
        explanation:
          "You just saw the gate work. Every unused import, undefined name and style slip across all 120 days gets caught exactly like this.",
      },
      {
        id: "fix-lint",
        title: "Fix it the tool's way",
        instruction:
          "Let Ruff fix what it can fix automatically, then confirm the repo is clean.",
        command: "python -m ruff check --fix . && python -m ruff check .",
        expected: "All checks passed!",
      },
      {
        id: "validate",
        title: "Write the validation script and run the full gate",
        instruction:
          "Create scripts/validate.py — the repo's one-command health check — then run the complete validation chain.",
        code: {
          lang: "python",
          file: "scripts/validate.py",
          code: `"""Repo health check: structure + curriculum status in one command."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = ["days", "projects", "datasets", "docs", "scripts"]
TOTAL_DAYS = 120


def main() -> int:
    missing = [f for f in REQUIRED if not (ROOT / f).is_dir()]
    if missing:
        print(f"AX-120 INVALID · missing: {', '.join(missing)}")
        return 1
    if not (ROOT / "pyproject.toml").is_file():
        print("AX-120 INVALID · missing: pyproject.toml")
        return 1
    days = sorted(
        d.name for d in (ROOT / "days").iterdir()
        if d.is_dir() and re.fullmatch(r"day-\\d{3}", d.name)
    )
    print(f"AX-120 VALID · days present: {len(days)}/{TOTAL_DAYS} · structure OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())`,
        },
        command:
          "python -m pytest -q && python -m ruff check . && python scripts/validate.py",
        expected: "2 passed … All checks passed! … AX-120 VALID · days present: 1/120 · structure OK",
        troubleshooting:
          "If validate.py prints INVALID, it tells you exactly which folder is missing — create it and re-run. If pytest collects 0 tests, check the file is named test_setup.py inside days/day-001/.",
      },
    ],
  },

  build: {
    brief:
      "Finish the repo as a real project: initialize git, write the README that doubles as your learning contract, and push it to a public GitHub repository. This repo is Project P1's foundation and your home for 120 days.",
    requirements: [
      "git repository initialized with a .gitignore covering .venv/, __pycache__/ and .env",
      "README.md with: project title, one-paragraph purpose, the folder structure, the exact fresh-clone commands, and a signed learning contract (your name + start date + the sentence \"I ship evidence every day I check in.\")",
      "An .env.example file (empty keys are fine) proving secrets never enter git",
      "Everything committed and pushed to a public GitHub repo",
    ],
    acceptance: [
      "A fresh `git clone` followed by the README's install command succeeds",
      "python -m pytest -q reports all tests passing",
      "python -m ruff check . reports no errors",
      "python scripts/validate.py prints AX-120 VALID",
      "The GitHub repo is public and the latest commit contains all of the above",
    ],
    commonMistakes: [
      "Committing the .venv folder (hundreds of files in your diff = you did this — fix .gitignore, `git rm -r --cached .venv`)",
      "README commands that only work on your machine (absolute paths, missing activate step)",
      "Empty days/day-001 — the test from the lab belongs in the commit",
    ],
    submission: [
      "Paste the final line of scripts/validate.py output in Verification",
      "Submit the GitHub commit URL in Verification",
    ],
  },

  hints: [
    {
      level: 1,
      title: "Conceptual direction",
      body: "Work in this order: .gitignore BEFORE `git init`+first commit (so junk never enters history), then README, then push. The learning contract is not decoration — write it like you'll be held to it, because Day 120's retrospective quotes it back to you.",
    },
    {
      level: 2,
      title: "Structure",
      body: "README sections that work: # AX-120 · your name → Purpose (one paragraph) → Structure (the five folders, one line each) → Quickstart (python -m venv … / pip install -e \".[dev]\" / the validation chain) → Learning contract (name, date, the shipping sentence). .gitignore needs at least: .venv/, __pycache__/, *.pyc, .env.",
    },
    {
      level: 3,
      title: "Partial implementation",
      body: "git init && git add -A && git commit -m \"day 1: engineering monorepo + learning contract\" — then create an empty public repo on GitHub (no README, you have one), and: git remote add origin https://github.com/YOU/ax-120.git && git branch -M main && git push -u origin main. If push rejects, you initialized the GitHub repo with files — pull --rebase or recreate it empty.",
    },
  ],

  verification: {
    intro:
      "Run the validation chain locally and prove it here. The paste is checked against the expected output pattern; the commit URL becomes part of your portfolio evidence.",
    fields: [
      {
        id: "validate-output",
        label: "Paste the output of: python scripts/validate.py",
        kind: "paste",
        required: true,
        placeholder: "AX-120 VALID · days present: 1/120 · structure OK",
        mustMatch: "AX-120 VALID",
        failHelp:
          "The paste must contain the script's success line \"AX-120 VALID\". If yours prints INVALID, the message names the missing folder — fix and re-run.",
      },
      {
        id: "pytest-output",
        label: "Paste the last line of: python -m pytest -q",
        kind: "paste",
        required: true,
        placeholder: "2 passed in 0.03s",
        mustMatch: "\\d+ passed",
        failHelp:
          "The paste must contain \"N passed\" with zero failures. A paste with \"failed\" or \"error\" doesn't pass verification — fix the test first.",
      },
      {
        id: "commit-url",
        label: "GitHub commit URL of your final commit",
        kind: "url",
        required: true,
        placeholder: "https://github.com/you/ax-120/commit/abc123…",
        mustMatch: "^https://github\\.com/[^/]+/[^/]+/commit/[0-9a-f]{7,40}",
        failHelp:
          "Open your repo on GitHub → Commits → click the latest one → copy the URL. It looks like github.com/you/repo/commit/<sha>.",
      },
      {
        id: "fresh-clone",
        label:
          "I cloned my repo into a NEW folder and the README quickstart worked start to finish",
        kind: "attest",
        required: true,
        hint: "This is the whole point of today. git clone <url> fresh-test && cd fresh-test && follow your own README.",
      },
    ],
  },

  reflectionPrompts: [
    "What did I build today, in my own words?",
    "What problem did I hit, and how did I solve it?",
    "Explain reproducibility in two sentences, as if to a junior developer.",
    "What interview question could be asked from today's topic?",
  ],

  shipFields: [
    {
      id: "repo-url",
      label: "Public GitHub repository URL",
      kind: "url",
      required: true,
      placeholder: "https://github.com/you/ax-120",
      mustMatch: "^https://github\\.com/[^/]+/[^/]+/?$",
    },
    {
      id: "ship-note",
      label: "One-line technical note for your portfolio card",
      kind: "text",
      required: true,
      placeholder:
        "Reproducible Python monorepo: pyproject-driven install, pytest + Ruff gates, one-command validation",
    },
  ],

  references: [
    {
      label: "Python Packaging — pyproject.toml specification",
      url: "https://packaging.python.org/en/latest/specifications/pyproject-toml/",
    },
    { label: "Ruff documentation", url: "https://docs.astral.sh/ruff/" },
    {
      label: "pytest — getting started",
      url: "https://docs.pytest.org/en/stable/getting-started.html",
    },
  ],

  nextDayPreview:
    "Day 2: your first raw HTTP call to a frontier model — request, response, tokens, latency and cost, logged from your own code.",

  authored: true,
};
