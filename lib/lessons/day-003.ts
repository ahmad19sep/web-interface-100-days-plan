// Day 3 — authored lesson: structured outputs, provider abstraction, cost
// ledger. P1's ship day.

import type { Lesson } from "./types";

export const DAY_003: Lesson = {
  day: 3,
  slug: "structured-outputs-provider-abstraction",
  title: "Structured outputs, provider abstraction and cost ledger",
  module: "AI Engineering Foundations",
  projectId: "P1",
  projectPhase: "SHIP DAY",
  durationMinutes: 180,
  difficulty: "Core",
  prerequisites: [
    "Day 2's call_model.py working with retries and logging",
    "Comfort reading a Python class definition",
  ],
  objectives: [
    "Define output schemas with Pydantic and validate every model response against them",
    "Build ModelClient.generate(schema=…) — one typed boundary for all model access",
    "Write two adapters: a real provider and a deterministic mock for tests",
    "Persist a cost ledger: model, latency, tokens, estimated cost, request id per call",
    "Ship Project P1 — the model-client foundation every later project imports",
  ],
  whyItMatters:
    "Model output is text until you make it data. Apps break when they trust the model to 'usually' return valid JSON; they survive when a schema validates every response and invalid ones are retried. And apps rot when model calls are scattered across the codebase; they stay maintainable when exactly one class touches the provider — swap providers, add caching, or measure cost in one place.",
  jobRelevance:
    "You can design the integration layer teams actually hire for: typed schemas, one provider boundary, a mock adapter that makes the whole app testable without network or cost, and a ledger that answers 'what does this feature cost us?'",
  missionBrief:
    "Turn Day 2's script into P1: a reusable ModelClient where generate(prompt, schema=…) returns validated, typed data — with a real adapter, a mock adapter for tests, automatic retry on invalid output, and a cost ledger recording every call. Then ship it: README, diagram, tests, sample logs.",
  finalEvidence:
    "P1 shipped on GitHub: tests pass against the mock adapter with zero network access, and the ledger shows real calls with cost estimates.",

  videos: [
    {
      id: "concept",
      title: "Concept — why one typed boundary beats scattered calls",
      kind: "concept",
      required: true,
      minutes: 12,
    },
    {
      id: "walkthrough",
      title: "Code walkthrough — ModelClient, adapters, ledger",
      kind: "walkthrough",
      required: false,
      minutes: 20,
    },
  ],

  sections: [
    {
      id: "schemas",
      title: "Schemas make model output trustworthy",
      blocks: [
        {
          t: "p",
          text: "A Pydantic model is a contract: these fields, these types, or a ValidationError. Ask the model for JSON matching the schema, then validate what comes back — never assume. When validation fails, you retry with the error message included, and the model usually corrects itself. This validate-and-retry loop is the standard pattern behind every 'structured outputs' feature.",
        },
        {
          t: "code",
          lang: "python",
          file: "projects/p1/schemas.py",
          code: `from pydantic import BaseModel, Field


class Sentiment(BaseModel):
    label: str = Field(description="positive | negative | mixed")
    confidence: float = Field(ge=0, le=1)
    reason: str


# Sentiment.model_json_schema() → the JSON Schema you send to the provider
# Sentiment.model_validate_json(raw) → typed object or ValidationError`,
        },
        {
          t: "p",
          text: "Providers with native structured-output modes constrain generation to the schema server-side; providers without it still follow a schema included in the prompt most of the time. Your client treats both the same way: validate locally regardless. Local validation is the only guarantee that is provider-independent.",
        },
        {
          t: "callout",
          kind: "warn",
          title: "The trap",
          text: "json.loads() succeeding is not validation. {\"label\": \"banana\", \"confidence\": 7} parses fine and still breaks your app. Parse, then validate types AND constraints.",
        },
      ],
    },
    {
      id: "boundary",
      title: "One boundary, many providers: the adapter pattern",
      blocks: [
        {
          t: "p",
          text: "ModelClient is the only thing your application ever imports. Behind it, an adapter does provider-specific work: an OpenAIAdapter speaks Day 2's raw HTTP; a MockAdapter returns canned responses instantly and deterministically. Because both satisfy the same tiny interface — complete(prompt) → (text, usage, request_id) — your tests run the full client logic (validation, retries, ledger) against the mock: no network, no key, no cost, no flakiness.",
        },
        {
          t: "code",
          lang: "python",
          file: "projects/p1/adapters.py",
          code: `from typing import Protocol


class Completion:
    def __init__(self, text: str, input_tokens: int, output_tokens: int, request_id: str):
        self.text = text
        self.input_tokens = input_tokens
        self.output_tokens = output_tokens
        self.request_id = request_id


class Adapter(Protocol):
    model: str
    def complete(self, prompt: str) -> Completion: ...


class MockAdapter:
    """Deterministic fake — the whole test suite runs on this."""
    model = "mock-1"

    def __init__(self, responses: list[str]):
        self._responses = list(responses)
        self.calls: list[str] = []

    def complete(self, prompt: str) -> Completion:
        self.calls.append(prompt)
        text = self._responses.pop(0)
        return Completion(text, input_tokens=10, output_tokens=20, request_id="mock-req")`,
        },
        {
          t: "callout",
          kind: "interview",
          title: "Interview question you can now answer",
          text: "\"How do you test code that calls an LLM?\" — put all provider access behind one adapter interface and run the suite against a deterministic mock; the real adapter gets a thin integration test. Bonus points for mentioning the invalid-output retry path is what most needs testing.",
        },
      ],
    },
    {
      id: "ledger",
      title: "The cost ledger — every call accounted for",
      blocks: [
        {
          t: "p",
          text: "Token usage is money. The ledger extends Day 2's JSONL log with an estimated cost per call, computed from a price table you maintain (prices change — that's why it's your table, in code, versioned). Once every call lands in the ledger, questions like 'what did this experiment cost?' or 'which feature burns the budget?' become one-liners over a file.",
        },
        {
          t: "code",
          lang: "python",
          file: "projects/p1/ledger.py",
          code: `# USD per 1M tokens — maintain these; prices change.
PRICES = {
    "gpt-5": {"input": 1.25, "output": 10.00},
    "mock-1": {"input": 0.0, "output": 0.0},
}


def estimate_cost(model: str, input_tokens: int, output_tokens: int) -> float:
    p = PRICES.get(model, {"input": 0.0, "output": 0.0})
    return round(
        (input_tokens * p["input"] + output_tokens * p["output"]) / 1_000_000, 6
    )`,
        },
        {
          t: "callout",
          kind: "job",
          title: "What an employer sees",
          text: "A repo where cost-per-call is measured, not guessed. Teams lose real money to unmeasured LLM usage — an engineer who ships a ledger by habit is immediately valuable.",
        },
      ],
    },
  ],

  lab: {
    intro:
      "Assemble P1 piece by piece in projects/p1/. Each step is small; the sum is a shippable library.",
    steps: [
      {
        id: "scaffold",
        title: "Scaffold the project",
        instruction:
          "Create the P1 package with empty modules so the structure exists before the logic.",
        command:
          "mkdir -p projects/p1/tests && touch projects/p1/__init__.py projects/p1/schemas.py projects/p1/adapters.py projects/p1/client.py projects/p1/ledger.py projects/p1/tests/test_client.py && pip install pydantic",
        expected: "The files exist; pip confirms pydantic installed.",
      },
      {
        id: "schema",
        title: "Define and exercise a schema",
        instruction:
          "Add the Sentiment schema from the lesson, then prove validation catches garbage.",
        command: `python -c "from projects.p1.schemas import Sentiment; Sentiment.model_validate_json('{\\"label\\":\\"banana\\",\\"confidence\\":7,\\"reason\\":\\"x\\"}')"`,
        expected:
          "A ValidationError mentioning confidence — the contract works.",
        explanation:
          "You want to SEE the error today so you recognize it in logs forever.",
      },
      {
        id: "mock",
        title: "Build the MockAdapter",
        instruction:
          "Add Completion, the Adapter protocol and MockAdapter from the lesson to adapters.py.",
        expected: "python -c \"from projects.p1.adapters import MockAdapter\" runs clean.",
      },
      {
        id: "client",
        title: "Build ModelClient.generate",
        instruction:
          "The core: prompt in, validated object out, invalid output retried once with the error appended.",
        code: {
          lang: "python",
          file: "projects/p1/client.py",
          code: `import json
import time

from pydantic import BaseModel, ValidationError

from .adapters import Adapter
from .ledger import estimate_cost


class ModelClient:
    def __init__(self, adapter: Adapter, ledger_path: str = "projects/p1/ledger.jsonl"):
        self.adapter = adapter
        self.ledger_path = ledger_path

    def generate(self, prompt: str, schema: type[BaseModel], retries: int = 1) -> BaseModel:
        ask = (
            f"{prompt}\\n\\nReply with ONLY valid JSON matching this schema:\\n"
            f"{json.dumps(schema.model_json_schema())}"
        )
        last_error = None
        for _ in range(retries + 1):
            started = time.perf_counter()
            completion = self.adapter.complete(
                ask if last_error is None else f"{ask}\\n\\nYour last reply failed validation: {last_error}"
            )
            self._record(completion, time.perf_counter() - started)
            try:
                return schema.model_validate_json(completion.text)
            except ValidationError as err:
                last_error = str(err)
        raise ValueError(f"model output failed validation after {retries + 1} attempts: {last_error}")

    def _record(self, completion, seconds: float) -> None:
        entry = {
            "model": self.adapter.model,
            "request_id": completion.request_id,
            "latency_ms": round(seconds * 1000),
            "input_tokens": completion.input_tokens,
            "output_tokens": completion.output_tokens,
            "cost_usd": estimate_cost(
                self.adapter.model, completion.input_tokens, completion.output_tokens
            ),
        }
        with open(self.ledger_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry) + "\\n")`,
        },
        expected: "Imports clean; the shape mirrors the lesson diagram: client → adapter → ledger.",
      },
      {
        id: "test-happy",
        title: "Test the happy path on the mock",
        instruction:
          "First real test: valid JSON from the mock comes back as a typed object, and the ledger gained a line.",
        code: {
          lang: "python",
          file: "projects/p1/tests/test_client.py",
          code: `import json

from projects.p1.adapters import MockAdapter
from projects.p1.client import ModelClient
from projects.p1.schemas import Sentiment

VALID = json.dumps({"label": "positive", "confidence": 0.9, "reason": "clear praise"})
INVALID = json.dumps({"label": "positive", "confidence": 7, "reason": "broken"})


def test_valid_output_returns_typed_object(tmp_path):
    client = ModelClient(MockAdapter([VALID]), ledger_path=str(tmp_path / "l.jsonl"))
    result = client.generate("Classify: great product!", schema=Sentiment)
    assert isinstance(result, Sentiment)
    assert result.confidence == 0.9


def test_invalid_output_is_retried_then_ok(tmp_path):
    adapter = MockAdapter([INVALID, VALID])
    client = ModelClient(adapter, ledger_path=str(tmp_path / "l.jsonl"))
    result = client.generate("Classify this", schema=Sentiment)
    assert result.label == "positive"
    assert len(adapter.calls) == 2
    assert "failed validation" in adapter.calls[1]`,
        },
        command: "python -m pytest projects/p1 -q",
        expected: "2 passed",
        troubleshooting:
          "ImportError projects.p1 → run pytest from the repo root, and make sure projects/__init__.py isn't needed (pytest rootdir with pyproject testpaths handles it; otherwise add empty __init__.py files).",
      },
      {
        id: "real-adapter",
        title: "Wire the real adapter",
        instruction:
          "OpenAIAdapter reuses Day 2's httpx call: complete(prompt) posts the prompt, returns Completion(text, usage tokens, response id). Then run one real generate() and read the typed result.",
        expected:
          "A real Sentiment object from a live call, and projects/p1/ledger.jsonl gains a line with a non-zero cost_usd.",
        commonError:
          "Extracting the wrong field from the response JSON — print the raw response once and find the output text path before parsing.",
        troubleshooting:
          "If the model wraps JSON in markdown fences, strip leading/trailing ``` lines before validation — and note it in NOTES.md; that's a classic provider quirk.",
      },
      {
        id: "ledger-sum",
        title: "Answer the money question",
        instruction:
          "One-liner over the ledger: total calls and total estimated cost so far.",
        command:
          "python -c \"import json; rows=[json.loads(l) for l in open('projects/p1/ledger.jsonl')]; print(len(rows),'calls · $',round(sum(r['cost_usd'] for r in rows),4))\"",
        expected: "N calls · $ 0.00XX — your first cost report.",
      },
    ],
  },

  build: {
    brief:
      "Ship P1. Turn the working code into a portfolio project: README with a 60-second quickstart and an architecture diagram (ASCII is fine: app → ModelClient → adapter → provider, with the ledger tapped off the client), a second schema of your own design proving reuse, and green checks. This is the first of twenty — set the shipping standard here.",
    requirements: [
      "projects/p1/README.md — what it is, why the boundary exists, quickstart, diagram, sample ledger lines",
      "A second Pydantic schema used through the same generate() (your choice — e.g. TranslationCheck, TodoExtraction)",
      "Tests green on MockAdapter only — the suite must pass with no API key set",
      "Repo-root validation chain still green (pytest + ruff + validate.py)",
      "Committed and pushed; the repo's front README links to projects/p1",
    ],
    acceptance: [
      "OPENAI_API_KEY='' python -m pytest projects/p1 -q passes (proves no hidden network dependency)",
      "One real call recorded in ledger.jsonl with model, tokens, latency and cost",
      "A stranger can go from clone to first typed generate() using only the README",
    ],
    commonMistakes: [
      "Tests that secretly hit the real API — they pass today and fail in CI forever",
      "Letting application code import the adapter directly instead of ModelClient (the boundary leaks)",
      "A README that documents the code but never shows the 3-line usage example people actually want",
    ],
    submission: [
      "Paste the no-network test proof in Verification",
      "Submit the commit URL and ledger paste in Verification",
    ],
  },

  hints: [
    {
      level: 1,
      title: "Conceptual direction",
      body: "The retry-on-invalid path is the heart of the client — make the second prompt include the validation error text, because that's what makes the retry smarter than the first attempt. Your test already proves this via adapter.calls[1].",
    },
    {
      level: 2,
      title: "Architecture",
      body: "Keep the dependency arrows one-directional: client.py imports adapters and ledger; adapters import nothing of yours; schemas import only pydantic. If ledger.py ever imports client.py you've created a cycle — invert it by passing values, not objects.",
    },
    {
      level: 3,
      title: "Partial implementation",
      body: "OpenAIAdapter.complete: response = httpx.post(API_URL, headers=auth, json={'model': self.model, 'input': prompt}, timeout=60); data = response.json(); text = data['output'][0]['content'][0]['text'] (print data once to confirm the path on your account); return Completion(text, data['usage']['input_tokens'], data['usage']['output_tokens'], data['id']). Reuse Day 2's call_with_retries around the post if you want the full stack.",
    },
  ],

  verification: {
    intro:
      "Ship-day verification is stricter — P1 must prove it works without network before the real call counts.",
    fields: [
      {
        id: "offline-tests",
        label:
          "Paste the output of: OPENAI_API_KEY='' python -m pytest projects/p1 -q",
        kind: "paste",
        required: true,
        placeholder: "3 passed in 0.09s",
        mustMatch: "\\d+ passed",
        failHelp:
          "The suite must pass with the key blanked — if it fails, a test is secretly calling the real API. That's the exact bug this day exists to prevent.",
      },
      {
        id: "ledger-line",
        label: "Paste one real line from projects/p1/ledger.jsonl",
        kind: "paste",
        required: true,
        placeholder: '{"model": "gpt-5", …, "cost_usd": 0.00031}',
        mustMatch: "cost_usd",
        failHelp:
          "The line must be a ledger entry containing cost_usd — run one real generate() first.",
      },
      {
        id: "commit-url",
        label: "GitHub commit URL for the shipped P1",
        kind: "url",
        required: true,
        placeholder: "https://github.com/you/ax-120/commit/…",
        mustMatch: "^https://github\\.com/[^/]+/[^/]+/commit/[0-9a-f]{7,40}",
        failHelp: "Repo → Commits → latest → copy the URL.",
      },
      {
        id: "second-schema",
        label:
          "I added a second schema of my own design and it works through the same generate()",
        kind: "attest",
        required: true,
        hint: "Reuse is the whole argument for the abstraction — prove it to yourself.",
      },
    ],
  },

  reflectionPrompts: [
    "Explain the adapter pattern in two sentences, using P1 as the example.",
    "What breaks first in an app that trusts raw model output? How does your client prevent it?",
    "What does one call cost through your ledger, and what would 100k/day cost?",
    "What interview question could be asked from today's topic?",
  ],

  shipFields: [
    {
      id: "repo-url",
      label: "GitHub URL of the shipped P1 project folder",
      kind: "url",
      required: true,
      placeholder: "https://github.com/you/ax-120/tree/main/projects/p1",
      mustMatch: "^https://github\\.com/",
    },
    {
      id: "ship-note",
      label: "One-line technical note for the P1 portfolio card",
      kind: "text",
      required: true,
      placeholder:
        "Typed model client: Pydantic-validated outputs with smart retry, swappable adapters (real + mock), per-call cost ledger",
    },
  ],

  references: [
    {
      label: "OpenAI — Structured outputs",
      url: "https://developers.openai.com/api/docs/guides/structured-outputs",
    },
    { label: "Pydantic documentation", url: "https://docs.pydantic.dev/latest/" },
    {
      label: "OpenAI — Cost optimization",
      url: "https://developers.openai.com/api/docs/guides/cost-optimization",
    },
  ],

  nextDayPreview:
    "Day 4: how models actually read Urdu and English — tokenization measured, charted and turned into design conclusions.",

  authored: true,
};
