// Day 2 — authored lesson: raw HTTP calls to a frontier model.

import type { Lesson } from "./types";

export const DAY_002: Lesson = {
  day: 2,
  slug: "frontier-model-raw-http",
  title: "Call a frontier model through raw HTTP and log the full response",
  module: "AI Engineering Foundations",
  projectId: "P1",
  projectPhase: "BUILD",
  durationMinutes: 165,
  difficulty: "Foundation",
  prerequisites: [
    "Day 1's monorepo installed and green",
    "An API key from a model provider (OpenAI or compatible)",
    "curl available in your terminal",
  ],
  objectives: [
    "Send a model request with curl and with Python httpx — no SDK",
    "Read the raw response JSON: output text, usage, request id",
    "Load the API key from the environment, never from code",
    "Log latency and token usage for every call",
    "Handle 401, 429 and 5xx correctly — with retries that never duplicate a success",
  ],
  whyItMatters:
    "SDKs are sugar over one HTTP request. Engineers who have seen the raw request know exactly what the SDK hides: the auth header, the status codes, the usage accounting, the retry semantics. When an SDK misbehaves, changes its abstractions, or doesn't exist for your provider, this knowledge is the difference between debugging for minutes and being stuck for days.",
  jobRelevance:
    "You can integrate any model provider from its HTTP reference alone, and you can explain what happens on the wire — a question that separates API users from AI engineers in interviews.",
  missionBrief:
    "Talk to a frontier model with nothing but HTTP. By the end of today you have a script that makes model calls, saves the raw JSON, logs latency and token usage, and survives auth failures, rate limits and server errors — with retries that never double-charge a successful request.",
  finalEvidence:
    "Ten test calls producing structured logs, plus a failure-handling demo (a forced 401 and a simulated 429 with backoff).",

  videos: [
    {
      id: "concept",
      title: "Concept — what one model call really is",
      kind: "concept",
      required: true,
      minutes: 10,
    },
    {
      id: "walkthrough",
      title: "Code walkthrough — curl to httpx to retries",
      kind: "walkthrough",
      required: false,
      minutes: 15,
    },
  ],

  sections: [
    {
      id: "anatomy",
      title: "Anatomy of a model call",
      blocks: [
        {
          t: "p",
          text: "Strip away every SDK and a model call is one HTTPS POST: a URL that names the API, a header that proves who you are, and a JSON body that says which model and what input. The provider answers with JSON containing the generated output plus metadata — most importantly usage (what you'll be billed for) and a request id (what you'll quote to support when something breaks).",
        },
        {
          t: "terminal",
          code: `curl https://api.openai.com/v1/responses \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "gpt-5", "input": "Say hello in Urdu, one line."}'`,
        },
        {
          t: "output",
          label: "the fields that matter in the response",
          code: `{
  "id": "resp_abc123…",            ← quote this id in bug reports
  "model": "gpt-5",
  "output": [ { "content": [ { "text": "السلام علیکم!" } ] } ],
  "usage": {
    "input_tokens": 14,            ← what you pay for in
    "output_tokens": 9             ← what you pay for out
  }
}`,
        },
        {
          t: "callout",
          kind: "info",
          title: "Secrets discipline",
          text: "The key travels in the Authorization header, loaded from the environment. It never appears in code, logs, notebooks or git — your Day 1 .gitignore already excludes .env. One leaked key = one revoked key + one bad day.",
        },
        {
          t: "callout",
          kind: "interview",
          title: "Interview question you can now answer",
          text: "\"What actually happens when you call an LLM API?\" — an HTTPS POST with a bearer token and a JSON body; the response carries the output plus usage for billing; streaming variants deliver the same output as server-sent events chunk by chunk.",
        },
      ],
    },
    {
      id: "failures",
      title: "Status codes, timeouts and honest retries",
      blocks: [
        {
          t: "p",
          text: "Production model calls fail in three flavors, and each demands a different reaction. 401 means your credentials are wrong — retrying is pointless, fail loudly. 429 means slow down — the provider is rate-limiting you; wait and retry. 5xx means the provider hiccuped — retry with growing patience. Everything else in the 4xx family means your request is malformed — fix the request, don't retry it.",
        },
        {
          t: "list",
          items: [
            "401 unauthorized → never retry; check the key and env loading",
            "429 rate limited → retry after an exponential backoff with jitter",
            "500 / 502 / 503 → retry the same way, a few times, then give up loudly",
            "400 bad request → your JSON is wrong; retrying identical garbage yields identical garbage",
          ],
        },
        {
          t: "p",
          text: "Exponential backoff means each retry waits roughly twice as long as the last (1s, 2s, 4s…), and jitter adds randomness so a thousand clients that failed together don't all retry together. The subtle bug to avoid: retrying a request that actually succeeded — if the response arrived but your code crashed while handling it, a blind retry bills you twice and may act twice. Rule: only retry when you know the request did not complete (connection error, timeout, 429, 5xx) — never after a successful 200 you failed to process.",
        },
        {
          t: "callout",
          kind: "warn",
          title: "Timeouts are not optional",
          text: "A model call with no timeout can hang your program forever on a dead connection. Always set one (30–60s for non-streaming calls) and treat the timeout as a retryable failure.",
        },
        {
          t: "callout",
          kind: "job",
          title: "What an employer sees",
          text: "Logs with latency, token usage and request ids per call — plus retries that distinguish 401 from 429 — read as 'this person has operated AI in production', not just demoed it.",
        },
      ],
    },
    {
      id: "streaming",
      title: "Streaming: the same answer, delivered as events",
      blocks: [
        {
          t: "p",
          text: "Add \"stream\": true and the provider keeps the connection open, sending server-sent events (SSE) — lines beginning with data: — each carrying a small delta of the output as it's generated. The final events carry the completed response and the usage numbers. Streaming doesn't change what the model produces; it changes when you see it, which is what makes chat UIs feel alive. Today you only need to observe the event stream with curl and recognize its shape — you'll build proper streaming handlers later in the course.",
        },
        {
          t: "terminal",
          code: `curl -N https://api.openai.com/v1/responses \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "gpt-5", "input": "Count to five.", "stream": true}'`,
        },
        {
          t: "output",
          label: "what the wire looks like",
          code: `data: {"type":"response.output_text.delta","delta":"One"}
data: {"type":"response.output_text.delta","delta":", two"}
…
data: {"type":"response.completed","response":{"usage":{…}}}`,
        },
      ],
    },
  ],

  lab: {
    intro:
      "Build up from one curl call to a logged, retrying Python client. Work inside days/day-002/ in your monorepo.",
    steps: [
      {
        id: "env",
        title: "Put the key in the environment",
        instruction:
          "Add OPENAI_API_KEY to your repo's .env (already gitignored) and export it into the shell.",
        command: "export OPENAI_API_KEY=sk-…   # PowerShell: $env:OPENAI_API_KEY='sk-…'",
        expected: "echo ${OPENAI_API_KEY:0:6} prints sk-… (first characters only).",
        commonError:
          "Pasting the key with surrounding quotes into .env — the quotes become part of the key and every call 401s.",
      },
      {
        id: "curl-call",
        title: "First contact with curl",
        instruction:
          "Send the request from the lesson and read the whole response body — find the output text, the usage object and the response id.",
        command: `curl https://api.openai.com/v1/responses -H "Authorization: Bearer $OPENAI_API_KEY" -H "Content-Type: application/json" -d '{"model": "gpt-5", "input": "Say hello in Urdu, one line."}'`,
        expected: "JSON with output text in Urdu, plus usage.input_tokens and usage.output_tokens.",
        troubleshooting:
          "401 → the key isn't reaching the header (re-export, check quotes). 404 with a model error → use a model name your account actually has; any current model works, the lesson is about the wire format.",
      },
      {
        id: "force-401",
        title: "Break authentication on purpose",
        instruction:
          "Repeat the call with Authorization: Bearer WRONG and read the error body — this is the exact shape your code must recognize as 'do not retry'.",
        command: `curl -s -o /dev/null -w "%{http_code}\\n" https://api.openai.com/v1/responses -H "Authorization: Bearer WRONG" -H "Content-Type: application/json" -d '{"model": "gpt-5", "input": "hi"}'`,
        expected: "401",
        explanation:
          "You now know both faces of the API — success and failure — before writing any Python.",
      },
      {
        id: "httpx",
        title: "The same call from Python",
        instruction: "Install httpx into your Day 1 environment and make the call from code.",
        code: {
          lang: "python",
          file: "days/day-002/call_model.py",
          code: `import os
import time

import httpx

API_URL = "https://api.openai.com/v1/responses"


def call_model(prompt: str, model: str = "gpt-5") -> dict:
    started = time.perf_counter()
    response = httpx.post(
        API_URL,
        headers={"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}"},
        json={"model": model, "input": prompt},
        timeout=60.0,
    )
    response.raise_for_status()
    data = response.json()
    data["_latency_ms"] = round((time.perf_counter() - started) * 1000)
    return data


if __name__ == "__main__":
    result = call_model("Say hello in Urdu, one line.")
    print(result["_latency_ms"], "ms", result.get("usage"))`,
        },
        command: 'pip install httpx && python days/day-002/call_model.py',
        expected: "A latency in milliseconds and the usage dict printed.",
        commonError:
          "KeyError: 'OPENAI_API_KEY' — the env var isn't set in THIS shell; re-export or load your .env.",
      },
      {
        id: "logging",
        title: "Log every call as one JSON line",
        instruction:
          "Append a structured record per call — timestamp, model, latency, input/output tokens, response id — to days/day-002/calls.jsonl. JSON Lines (one object per line) is the standard shape for machine-readable logs.",
        code: {
          lang: "python",
          file: "days/day-002/call_model.py (add)",
          code: `import json
from datetime import datetime, timezone

def log_call(data: dict, path: str = "days/day-002/calls.jsonl") -> None:
    record = {
        "at": datetime.now(timezone.utc).isoformat(),
        "id": data.get("id"),
        "model": data.get("model"),
        "latency_ms": data.get("_latency_ms"),
        "input_tokens": data.get("usage", {}).get("input_tokens"),
        "output_tokens": data.get("usage", {}).get("output_tokens"),
    }
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(record) + "\\n")`,
        },
        expected: "calls.jsonl grows by one line per call, each line valid JSON.",
      },
      {
        id: "retries",
        title: "Add honest retries",
        instruction:
          "Wrap the call in a retry loop: up to 3 attempts, exponential backoff with jitter, retrying ONLY on timeout, connection error, 429 and 5xx. 401 and 400 raise immediately.",
        code: {
          lang: "python",
          file: "days/day-002/call_model.py (add)",
          code: `import random

RETRYABLE = {429, 500, 502, 503}

def call_with_retries(prompt: str, attempts: int = 3) -> dict:
    for attempt in range(attempts):
        try:
            return call_model(prompt)
        except httpx.HTTPStatusError as err:
            if err.response.status_code not in RETRYABLE:
                raise  # 401/400: retrying identical garbage yields identical garbage
        except (httpx.TimeoutException, httpx.ConnectError):
            pass  # request did not complete — safe to retry
        if attempt < attempts - 1:
            time.sleep(2**attempt + random.random())  # 1s, 2s, 4s + jitter
    raise RuntimeError(f"model call failed after {attempts} attempts")`,
        },
        expected:
          "A temporary WRONG key raises immediately (no retries); a fake 503 (point API_URL at httpbin.org/status/503 to test) retries three times then raises.",
        troubleshooting:
          "If retries fire on 401, your except order is wrong — HTTPStatusError must re-raise non-retryable codes before the generic sleep.",
      },
      {
        id: "ten-calls",
        title: "The ten-call proof",
        instruction:
          "Run ten varied prompts through call_with_retries + log_call, then verify the log.",
        command:
          "python -c \"import json; lines=[json.loads(l) for l in open('days/day-002/calls.jsonl')]; print(len(lines), 'calls · avg', sum(l['latency_ms'] for l in lines)//len(lines), 'ms')\"",
        expected: "10 calls · avg NNN ms (or more if you experimented — good).",
      },
      {
        id: "stream-peek",
        title: "Watch a stream go by",
        instruction:
          "Run the streaming curl from the lesson with -N and watch the data: events arrive. You're just observing the shape today.",
        command: `curl -N https://api.openai.com/v1/responses -H "Authorization: Bearer $OPENAI_API_KEY" -H "Content-Type: application/json" -d '{"model": "gpt-5", "input": "Count to five.", "stream": true}'`,
        expected: "A series of data: {…delta…} lines ending with a completed event carrying usage.",
      },
    ],
  },

  build: {
    brief:
      "Package today's work as a small, tested module: a callable script with argument parsing, the retry logic, JSONL logging, and a pytest that exercises the retry decision table without hitting the network (monkeypatch call_model to raise scripted errors). Commit it to days/day-002/.",
    requirements: [
      "days/day-002/call_model.py — call, retries, logging, argparse (prompt + model flags)",
      "days/day-002/test_retries.py — proves 401 raises immediately, 429/503 retry, success is never retried",
      "days/day-002/calls.jsonl — at least ten real logged calls",
      "A short NOTES.md: your average latency, tokens per call, and one thing that surprised you",
    ],
    acceptance: [
      "python days/day-002/call_model.py \"your prompt\" prints latency + usage and appends to the log",
      "python -m pytest days/day-002 -q passes",
      "python -m ruff check days/day-002 is clean",
      "The retry loop provably never retries after a successful call",
    ],
    commonMistakes: [
      "Retrying on every exception — a 401 loop just hammers the provider with a bad key",
      "Logging the prompt text with the key accidentally embedded in an error message",
      "Backoff without jitter (fine alone, thundering herd in production)",
    ],
    submission: [
      "Paste your test run output in Verification",
      "Submit the commit URL in Verification",
    ],
  },

  hints: [
    {
      level: 1,
      title: "Conceptual direction",
      body: "Test the retry logic without any network: your test replaces call_model with a fake that raises a scripted sequence (429, 429, success) and counts invocations. If your code is hard to test this way, the retry loop and the HTTP call are too entangled — pass the callable in, or monkeypatch.",
    },
    {
      level: 2,
      title: "Architecture",
      body: "Three functions with one job each: call_model (one HTTP request, raises on bad status), call_with_retries (policy: which errors retry, how long to wait), log_call (one JSONL line). The test file only ever imports call_with_retries and feeds it fakes via monkeypatch.setattr.",
    },
    {
      level: 3,
      title: "Partial implementation",
      body: "def test_401_no_retry(monkeypatch): calls=[]; def fake(p): calls.append(1); raise httpx.HTTPStatusError('', request=None, response=httpx.Response(401)); monkeypatch.setattr(call_model_module, 'call_model', fake); with pytest.raises(httpx.HTTPStatusError): call_with_retries('x'); assert len(calls) == 1 — same pattern with Response(429) asserting len(calls) == 3.",
    },
  ],

  verification: {
    intro:
      "Prove the module works and the failure handling is real — the pastes are pattern-checked.",
    fields: [
      {
        id: "pytest-output",
        label: "Paste the last line of: python -m pytest days/day-002 -q",
        kind: "paste",
        required: true,
        placeholder: "3 passed in 0.12s",
        mustMatch: "\\d+ passed",
        failHelp:
          "The paste must contain \"N passed\" and no failures — fix the tests first, that's the exercise.",
      },
      {
        id: "log-count",
        label: "Paste the output of the ten-call proof command (lab step 7)",
        kind: "paste",
        required: true,
        placeholder: "10 calls · avg 812 ms",
        mustMatch: "\\d+\\s*calls",
        failHelp:
          "Run lab step 7's one-liner against your calls.jsonl — it must report at least 10 calls.",
      },
      {
        id: "commit-url",
        label: "GitHub commit URL for days/day-002",
        kind: "url",
        required: true,
        placeholder: "https://github.com/you/ax-120/commit/…",
        mustMatch: "^https://github\\.com/[^/]+/[^/]+/commit/[0-9a-f]{7,40}",
        failHelp: "Repo → Commits → latest → copy the URL (…/commit/<sha>).",
      },
      {
        id: "no-retry-success",
        label:
          "I confirmed by test that a successful call is never retried and a 401 never retries",
        kind: "attest",
        required: true,
        hint: "This is the day's core engineering lesson — only attest what your tests actually prove.",
      },
    ],
  },

  reflectionPrompts: [
    "Explain to a junior dev what the SDK was hiding from you.",
    "Which failures deserve a retry and which never do — and why?",
    "What did a model call cost you today, in tokens and milliseconds?",
    "What interview question could be asked from today's topic?",
  ],

  shipFields: [
    {
      id: "commit-url",
      label: "Commit URL for today's work",
      kind: "url",
      required: true,
      placeholder: "https://github.com/…",
      mustMatch: "^https://",
    },
    {
      id: "ship-note",
      label: "One-line technical note for your portfolio",
      kind: "text",
      required: true,
      placeholder:
        "Raw-HTTP model client: env auth, JSONL usage/latency logs, backoff+jitter retries that never duplicate a success",
    },
  ],

  references: [
    {
      label: "OpenAI — Migrate to the Responses API",
      url: "https://developers.openai.com/api/docs/guides/migrate-to-responses",
    },
    {
      label: "OpenAI — Production best practices",
      url: "https://developers.openai.com/api/docs/guides/production-best-practices",
    },
    { label: "httpx documentation", url: "https://www.python-httpx.org/" },
  ],

  nextDayPreview:
    "Day 3: wrap this into a typed ModelClient with schema-validated outputs, provider adapters and a cost ledger — and ship Project P1.",

  authored: true,
};
