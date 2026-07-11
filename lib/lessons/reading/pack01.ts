// Reading Pack 01 — Days 001–010: Foundations, Tokenization and Search Basics.
// Per-day content from the course reading pack; the shared skeleton lives in
// core.ts. Full text renders in the Understand stage — never replaced by links.

import type { ReadingData } from "./core";

export const PACK01: Record<number, ReadingData> = {
  1: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "The first engineering decision is not which model to use; it is how the work will be made repeatable. A disciplined repository turns daily experiments into a system that another person can install, test and review. The learning contract also defines what counts as completion: code, tests, evidence and reflection rather than passive consumption.",
    concepts: [
      {
        name: "Monorepo conventions",
        def: "A monorepo keeps related lessons, projects, datasets, tests and documentation under one version-controlled root. The value is not the folder count; it is shared tooling, predictable paths, and one command that validates the whole learning system.",
      },
      {
        name: "Python environments",
        def: "A Python environment isolates project dependencies so one project cannot silently break another. Reproducibility requires both a declared dependency set and a repeatable install process.",
      },
      {
        name: "Linting, formatting and pytest",
        def: "Formatting makes code visually consistent, linting catches suspicious patterns, and pytest checks behavior. They solve different problems and should run together in one validation command.",
      },
      {
        name: "Environment-variable hygiene",
        def: "Secrets belong outside source control. Commit an example file that documents required names, but keep real values in a local secret store or deployment platform.",
      },
      {
        name: "Daily evidence standards",
        def: "Evidence means a reviewer can see what was built and reproduce it. A commit, test result, benchmark, short note and demo are stronger than a completion checkbox.",
      },
    ],
    walkthrough: [
      "Prepare: create /days, /projects, /datasets and /docs.",
      "Implement: add pyproject.toml, .env.example, pre-commit or Ruff, pytest, and a README index.",
      "Measure: add a script that validates every day folder.",
    ],
    gate: "A fresh clone installs, runs tests and prints a valid curriculum status with one command.",
    evidence:
      "Public commit, setup GIF or terminal screenshot, and a Day 1 engineering note.",
    refs: [
      { label: "GitHub Actions - Get Started", url: "https://docs.github.com/en/actions/get-started" },
      { label: "pytest - Documentation", url: "https://docs.pytest.org/" },
    ],
  },

  2: {
    rule: "boundary",
    failures: "http",
    problem:
      "A model API is an HTTP service before it is an SDK method. Thinking in requests, events and failure classes removes mystery. You should be able to inspect exactly what crossed the network, which usage was charged, and whether a retry is safe.",
    concepts: [
      {
        name: "Authentication headers",
        def: "Most model APIs authenticate with a secret carried in an HTTP header. The client must protect the secret, avoid logging it, and distinguish authentication failures from ordinary application errors.",
      },
      {
        name: "Request bodies",
        def: "The request body is the explicit contract sent to the provider: model, input, tools, output format and generation controls. Keeping it visible makes debugging easier.",
      },
      {
        name: "Streaming versus non-streaming",
        def: "Non-streaming waits for one complete response. Streaming emits events as work progresses, improving perceived latency but adding event ordering, partial-state and disconnect concerns.",
      },
      {
        name: "Usage/tokens",
        def: "Usage fields report how much model work was consumed. They are the foundation for cost accounting, capacity planning and detecting unexpectedly expensive prompts.",
      },
      {
        name: "Status codes",
        def: "HTTP status codes separate client errors, authentication failures, rate limits and server failures. Retry logic should respond differently to each class.",
      },
      {
        name: "Timeouts and exponential backoff",
        def: "A timeout prevents a request from hanging forever. Exponential backoff spaces retries farther apart, ideally with jitter, so many clients do not retry at the same instant.",
      },
    ],
    walkthrough: [
      "Prepare: call the Responses API with curl and httpx.",
      "Implement: save the raw JSON, parse output text, log latency and usage, and handle 401/429/5xx failures.",
    ],
    gate: "Ten test calls produce structured logs and retries work without duplicating successful requests.",
    evidence: "A provider-neutral call diagram and a short failure-handling demo.",
    refs: [
      { label: "OpenAI - Migrate to the Responses API", url: "https://developers.openai.com/api/docs/guides/migrate-to-responses" },
      { label: "OpenAI - Production Best Practices", url: "https://developers.openai.com/api/docs/guides/production-best-practices" },
    ],
  },

  3: {
    rule: "boundary",
    failures: "cost",
    problem:
      "Production AI applications need contracts. Structured output constrains model behavior at the boundary, a provider abstraction prevents vendor details from spreading through the codebase, and a cost ledger makes every call economically visible.",
    concepts: [
      {
        name: "JSON Schema",
        def: "A JSON Schema defines allowed fields, types and constraints. It turns a vague text-generation task into a machine-checkable interface.",
      },
      {
        name: "Pydantic validation",
        def: "Pydantic converts untrusted input into typed Python objects or produces explicit validation errors. Validation is a boundary, not a cosmetic convenience.",
      },
      { name: "Structured outputs" },
      {
        name: "Provider adapters",
        def: "A provider adapter hides vendor-specific request and response details behind a small internal interface. The application should depend on the interface, not on one SDK everywhere.",
      },
      { name: "Token and cost accounting" },
    ],
    walkthrough: [
      "Prepare: create ModelClient.generate(schema=...) with at least two adapters or one real plus one mock.",
      "Implement: persist model, latency, tokens, estimated cost and request ID.",
    ],
    gate: "Invalid outputs are caught and retried; tests can swap the real provider for a deterministic fake.",
    evidence: "Ship P1 with README, architecture diagram, tests and sample logs.",
    refs: [
      { label: "OpenAI - Structured Outputs", url: "https://developers.openai.com/api/docs/guides/structured-outputs" },
      { label: "Pydantic - Documentation", url: "https://docs.pydantic.dev/latest/" },
      { label: "OpenAI - Cost Optimization", url: "https://developers.openai.com/api/docs/guides/cost-optimization" },
    ],
  },

  4: {
    rule: "boundary",
    failures: "retrieval",
    problem:
      "Models do not read characters or words in the human sense. They process token IDs. Multilingual text can produce very different token counts, so language support must be measured rather than assumed.",
    concepts: [
      { name: "UTF-8 bytes" },
      { name: "Vocabulary" },
      { name: "Token IDs" },
      { name: "Special tokens" },
      { name: "Why one word can become many tokens" },
    ],
    walkthrough: [
      "Prepare: create a notebook comparing token counts and cost estimates for matched English, Urdu and Roman Urdu samples.",
      "Implement: include punctuation, numbers and code-switching.",
    ],
    gate: "At least 30 paired examples produce charts and three practical multilingual design conclusions.",
    evidence:
      "A visual tokenization report suitable for a social post or interview discussion.",
    refs: [
      { label: "Karpathy - minBPE", url: "https://github.com/karpathy/minbpe" },
      { label: "Karpathy - microGPT", url: "https://karpathy.github.io/2026/02/12/microgpt/" },
    ],
  },

  5: {
    rule: "boundary",
    failures: "retrieval",
    problem:
      "Building a small tokenizer makes vocabulary construction concrete. Frequent neighboring units are merged into reusable symbols; the resulting vocabulary changes sequence length, coverage and model efficiency.",
    concepts: [
      { name: "Pair statistics" },
      { name: "Merge rules" },
      { name: "Encode/decode" },
      { name: "Vocabulary training" },
      { name: "Special-token handling" },
    ],
    walkthrough: [
      "Prepare: implement get_stats, merge, train, encode and decode on a small bilingual corpus.",
      "Implement: add round-trip tests and compare vocabulary sizes.",
    ],
    gate: "All test strings round-trip correctly and the tokenizer reports compression ratios by language.",
    evidence:
      "Clean tokenizer module, tests and explanation of one surprising Urdu result.",
    refs: [{ label: "Karpathy - minBPE", url: "https://github.com/karpathy/minbpe" }],
  },

  6: {
    rule: "provenance",
    failures: "retrieval",
    problem:
      "Embeddings are task-shaped coordinates, not universal meaning. A similarity score is useful only when the dataset, query types and relevance judgments make it useful.",
    concepts: [
      { name: "Embedding vectors" },
      {
        name: "Cosine similarity",
        def: "Cosine similarity compares the angle between vectors, reducing the effect of vector magnitude. A high score suggests directional similarity, not guaranteed semantic correctness.",
      },
      { name: "Dot product" },
      {
        name: "Normalization",
        def: "Normalization scales vectors to a consistent length. It can simplify cosine comparisons and prevent magnitude from dominating rankings.",
      },
      { name: "Semantic versus lexical similarity" },
    ],
    walkthrough: [
      "Prepare: embed 40-60 sentences.",
      "Implement: compute similarities with NumPy.",
      "Measure: rank nearest neighbours and inspect multilingual/cross-lingual behavior.",
    ],
    gate: "A small evaluation set shows where semantic similarity succeeds and where it confuses related but incorrect text.",
    evidence: "Notebook, similarity matrix and written failure analysis.",
    refs: [
      { label: "OpenAI - Embeddings", url: "https://developers.openai.com/api/docs/guides/embeddings" },
    ],
  },

  7: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "This lesson turns one part of the project into an explicit engineering system. The objective is to understand the mechanism, expose its assumptions, and create evidence that the result works beyond a single demonstration.",
    concepts: [
      { name: "Technical writing" },
      { name: "Reproducibility" },
      { name: "Demo design" },
      { name: "Retrospective practice" },
    ],
    walkthrough: [
      "Prepare: refactor P1/P2.",
      "Implement: improve READMEs.",
      "Measure: add a two-minute demo.",
      "Validate: publish benchmark tables and write what AI assistance was used versus hand-written.",
    ],
    gate: "A stranger can clone both projects and reproduce the primary result in under ten minutes.",
    evidence: "Ship P2; website shows 2/20 projects; publish Week 1 retrospective.",
    refs: [
      { label: "Karpathy - minBPE", url: "https://github.com/karpathy/minbpe" },
      { label: "GitHub Actions - Get Started", url: "https://docs.github.com/en/actions/get-started" },
    ],
  },

  8: {
    rule: "provenance",
    failures: "happy-path",
    problem:
      "Chunking is an information-retrieval decision. The right unit depends on how answers are distributed in documents, how users ask questions, and how the retriever will be evaluated.",
    concepts: [
      { name: "Chunk boundaries" },
      {
        name: "Overlap",
        def: "Overlap repeats boundary text between neighboring chunks. It can protect split concepts but increases storage, duplicated context and cost.",
      },
      { name: "Metadata" },
      { name: "Parent-child chunks" },
      { name: "Retrieval unit versus generation unit" },
    ],
    walkthrough: [
      "Prepare: ingest a small real corpus and output chunks with stable IDs.",
      "Implement: record source metadata and token counts for four strategies.",
    ],
    gate: "A report compares chunk count, average tokens and answer coverage on ten questions.",
    evidence: "Chunking benchmark committed to P3/P4.",
    refs: [
      { label: "OpenAI - Retrieval", url: "https://developers.openai.com/api/docs/guides/retrieval" },
      { label: "Anthropic - Contextual Retrieval", url: "https://www.anthropic.com/engineering/contextual-retrieval" },
    ],
  },

  9: {
    rule: "eval",
    failures: "retrieval",
    problem:
      "A retrieval baseline establishes the minimum system that must be beaten. Indexing and ranking choices should be measured on labeled queries rather than selected by intuition.",
    concepts: [
      { name: "Indexing" },
      { name: "Namespaces" },
      { name: "Metadata filters" },
      { name: "Top-k" },
      { name: "Persistence" },
      { name: "pgvector or FAISS trade-offs" },
    ],
    walkthrough: [
      "Prepare: index the corpus with pgvector or FAISS.",
      "Implement: implement search(query, filters, k).",
      "Document: save retrieval traces.",
    ],
    gate: "Twenty labeled queries return a baseline recall@k and latency distribution.",
    evidence: "CLI search demo and baseline metrics table.",
    refs: [
      { label: "OpenAI - Retrieval", url: "https://developers.openai.com/api/docs/guides/retrieval" },
      { label: "pgvector - PostgreSQL Vector Similarity Search", url: "https://github.com/pgvector/pgvector" },
    ],
  },

  10: {
    rule: "provenance",
    failures: "retrieval",
    problem:
      "Lexical search remains valuable because exact words, identifiers and names are often the strongest relevance signal. Semantic search complements it; it does not automatically replace it.",
    concepts: [
      { name: "Term frequency" },
      { name: "Inverse document frequency" },
      {
        name: "Tokenization for search",
        def: "Tokenization converts text into the discrete units a model processes. Token boundaries affect cost, context length, latency and how well different languages are represented.",
      },
      { name: "Lexical failure modes" },
    ],
    walkthrough: [
      "Prepare: implement or integrate BM25 over the same corpus and evaluation queries.",
      "Implement: log which queries each retriever wins.",
    ],
    gate: "You can explain at least five semantic wins and five lexical wins using real examples.",
    evidence: "Comparison notebook and error labels.",
    refs: [
      { label: "OpenAI - Retrieval", url: "https://developers.openai.com/api/docs/guides/retrieval" },
      { label: "pytest - Documentation", url: "https://docs.pytest.org/" },
    ],
  },
};
