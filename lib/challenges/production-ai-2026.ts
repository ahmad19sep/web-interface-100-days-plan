// 120 Days of Futuristic Production AI Engineering — 2026 edition.
// Generated from 120_Days_Futuristic_Production_AI_Engineering_2026.json
// (2026.07-loop-engineering) — 120 days, 20 projects, evals-first,
// loop-engineering, production-first. Every 7th day is a recap/ship day.
//
// Owner content (video, note, resource links, quiz) is set live from the
// app's creator panel and stored in the database; nothing here needs manual
// editing day-to-day.

import type { Challenge, DayPlan, Project, WeekPlan } from "./types";

export const WEEKS: WeekPlan[] = [
  {
    "week": 1,
    "title": "API workbench + Tokenizer lab + Hybrid search",
    "start": 1,
    "end": 7
  },
  {
    "week": 2,
    "title": "Hybrid search + RAG API",
    "start": 8,
    "end": 14
  },
  {
    "week": 3,
    "title": "Evals harness",
    "start": 15,
    "end": 21
  },
  {
    "week": 4,
    "title": "Cost optimizer",
    "start": 22,
    "end": 28
  },
  {
    "week": 5,
    "title": "Extraction + Workflows",
    "start": 29,
    "end": 35
  },
  {
    "week": 6,
    "title": "Agent",
    "start": 36,
    "end": 42
  },
  {
    "week": 7,
    "title": "Long-horizon",
    "start": 43,
    "end": 49
  },
  {
    "week": 8,
    "title": "Loop engineering",
    "start": 50,
    "end": 56
  },
  {
    "week": 9,
    "title": "Prod service",
    "start": 57,
    "end": 63
  },
  {
    "week": 10,
    "title": "Multimodal",
    "start": 64,
    "end": 70
  },
  {
    "week": 11,
    "title": "Voice agent",
    "start": 71,
    "end": 77
  },
  {
    "week": 12,
    "title": "Model serving",
    "start": 78,
    "end": 84
  },
  {
    "week": 13,
    "title": "MCP server + A2A network",
    "start": 85,
    "end": 91
  },
  {
    "week": 14,
    "title": "Red-team kit",
    "start": 92,
    "end": 98
  },
  {
    "week": 15,
    "title": "Improvement lab",
    "start": 99,
    "end": 105
  },
  {
    "week": 16,
    "title": "Capstone",
    "start": 106,
    "end": 112
  },
  {
    "week": 17,
    "title": "Capstone",
    "start": 113,
    "end": 119
  },
  {
    "week": 18,
    "title": "Capstone",
    "start": 120,
    "end": 120
  }
];

export const PROJECTS: Project[] = [
  {
    "id": "P1",
    "name": "Multi-Provider LLM API Workbench",
    "short": "API workbench",
    "blurb": "Raw HTTP and Python clients for OpenAI/Anthropic-style APIs, structured outputs, streaming, token/cost logging, and a clean provider abstraction.",
    "start": 1,
    "end": 3,
    "shipDay": 3,
    "description": "Raw HTTP and Python clients for OpenAI/Anthropic-style APIs, structured outputs, streaming, token/cost logging, and a clean provider abstraction. Job signal: API integration, schema validation, provider abstraction, production debugging.",
    "doneWhen": "Invalid outputs are caught and retried; tests can swap the real provider for a deterministic fake."
  },
  {
    "id": "P2",
    "name": "Urdu-English Tokenizer Lab",
    "short": "Tokenizer lab",
    "blurb": "A mini BPE tokenizer plus experiments showing how Urdu, Roman Urdu, and English are tokenized and billed differently.",
    "start": 4,
    "end": 7,
    "shipDay": 7,
    "description": "A mini BPE tokenizer plus experiments showing how Urdu, Roman Urdu, and English are tokenized and billed differently. Job signal: Model fundamentals, multilingual awareness, data/latency intuition.",
    "doneWhen": "A stranger can clone both projects and reproduce the primary result in under ten minutes."
  },
  {
    "id": "P3",
    "name": "Semantic and Hybrid Search Engine",
    "short": "Hybrid search",
    "blurb": "Embeddings, BM25, reciprocal-rank fusion, query rewriting, reranking, contextual retrieval, and retrieval metrics.",
    "start": 8,
    "end": 13,
    "shipDay": 13,
    "description": "Embeddings, BM25, reciprocal-rank fusion, query rewriting, reranking, contextual retrieval, and retrieval metrics. Job signal: Search, information retrieval, vector databases, measurable optimization.",
    "doneWhen": "Top-k precision and citation validity are measured; unsupported answers abstain."
  },
  {
    "id": "P4",
    "name": "Grounded RAG API",
    "short": "RAG API",
    "blurb": "A cited, traceable RAG service over local files with ingestion, retrieval, answer synthesis, FastAPI serving, and provenance.",
    "start": 8,
    "end": 14,
    "shipDay": 14,
    "description": "A cited, traceable RAG service over local files with ingestion, retrieval, answer synthesis, FastAPI serving, and provenance. Job signal: End-to-end RAG, backend APIs, citations, observability.",
    "doneWhen": "A fresh document can be uploaded and queried; every answer links to retrieved evidence and trace data."
  },
  {
    "id": "P5",
    "name": "Evals and Reliability Harness",
    "short": "Evals harness",
    "blurb": "Trace dataset, error taxonomy, deterministic evaluators, aligned LLM judge, golden dataset, metrics, and CI regression gates.",
    "start": 15,
    "end": 21,
    "shipDay": 21,
    "flagship": true,
    "description": "Trace dataset, error taxonomy, deterministic evaluators, aligned LLM judge, golden dataset, metrics, and CI regression gates. Job signal: Evaluation engineering - the strongest differentiator in the portfolio.",
    "doneWhen": "Someone can add one new failure example and see it flow through the whole system."
  },
  {
    "id": "P6",
    "name": "Context and Cost Optimizer",
    "short": "Cost optimizer",
    "blurb": "Token budgets, context-position experiments, prompt caching, compaction, model routing, and cost/latency dashboards.",
    "start": 22,
    "end": 28,
    "shipDay": 28,
    "description": "Token budgets, context-position experiments, prompt caching, compaction, model routing, and cost/latency dashboards. Job signal: AI performance engineering and measurable cost reduction.",
    "doneWhen": "All claims are reproducible from scripts and no percentage is based on a single request."
  },
  {
    "id": "P7",
    "name": "Structured Document Extraction Pipeline",
    "short": "Extraction",
    "blurb": "PDF/image ingestion to validated business schemas, confidence handling, retries, batching, and human review.",
    "start": 29,
    "end": 31,
    "shipDay": 31,
    "description": "PDF/image ingestion to validated business schemas, confidence handling, retries, batching, and human review. Job signal: Document AI, structured outputs, practical business automation.",
    "doneWhen": "A reviewer can correct a record and the audit log preserves model output and human change."
  },
  {
    "id": "P8",
    "name": "Workflow Automation Engine",
    "short": "Workflows",
    "blurb": "Prompt chaining, routing, parallelization, orchestrator-workers, and evaluator-optimizer patterns with metrics.",
    "start": 32,
    "end": 35,
    "shipDay": 35,
    "description": "Prompt chaining, routing, parallelization, orchestrator-workers, and evaluator-optimizer patterns with metrics. Job signal: Reliable orchestration before agents; workflow design and trade-offs.",
    "doneWhen": "P8 exposes reusable components and a clear 'use this when' guide."
  },
  {
    "id": "P9",
    "name": "Tool-Using Agent from Scratch",
    "short": "Agent",
    "blurb": "A transparent think-act-observe loop with typed tools, error recovery, state, approval checkpoints, and trajectory evals.",
    "start": 36,
    "end": 42,
    "shipDay": 42,
    "description": "A transparent think-act-observe loop with typed tools, error recovery, state, approval checkpoints, and trajectory evals. Job signal: Agent architecture, tool calling, debugging, framework literacy.",
    "doneWhen": "P9 reports task success, tool accuracy, average steps, cost and unsafe-action rate."
  },
  {
    "id": "P10",
    "name": "Long-Horizon Research or Coding Agent",
    "short": "Long-horizon",
    "blurb": "Durable task state, initializer-worker harness, checkpoints, background jobs, reflection, verification, budgets, and restart recovery.",
    "start": 43,
    "end": 49,
    "shipDay": 49,
    "description": "Durable task state, initializer-worker harness, checkpoints, background jobs, reflection, verification, budgets, and restart recovery. Job signal: Long-running agent systems and reliable task execution.",
    "doneWhen": "The final artifact passes its tests and every session leaves a valid checkpoint."
  },
  {
    "id": "P11",
    "name": "Verification-Driven Loop Engineering System",
    "short": "Loop engineering",
    "blurb": "A goal-directed autonomous loop with explicit state, verifiers, repair cycles, durable checkpoints, budgets, stopping conditions, approvals and loop-level telemetry.",
    "start": 50,
    "end": 56,
    "shipDay": 56,
    "description": "A goal-directed autonomous loop with explicit state, verifiers, repair cycles, durable checkpoints, budgets, stopping conditions, approvals and loop-level telemetry. Job signal: Modern agent harness design, verification, reliable autonomy and failure containment.",
    "doneWhen": "Five fresh tasks run unattended within limits, with successes externally verified and blocked cases clearly reported."
  },
  {
    "id": "P12",
    "name": "Production AI Service Template",
    "short": "Prod service",
    "blurb": "FastAPI, PostgreSQL, Redis, auth, secrets, rate limits, Docker, observability, tests, CI/CD, and staging deployment.",
    "start": 57,
    "end": 63,
    "shipDay": 63,
    "description": "FastAPI, PostgreSQL, Redis, auth, secrets, rate limits, Docker, observability, tests, CI/CD, and staging deployment. Job signal: Backend, cloud, DevOps, MLOps, and production readiness.",
    "doneWhen": "A merged change deploys automatically only after software tests and AI evals pass."
  },
  {
    "id": "P13",
    "name": "Multimodal Document Intelligence Assistant",
    "short": "Multimodal",
    "blurb": "Images, scans, tables and forms; multimodal retrieval; grounded extraction; computer-use sandbox; multimodal evals.",
    "start": 64,
    "end": 70,
    "shipDay": 70,
    "description": "Images, scans, tables and forms; multimodal retrieval; grounded extraction; computer-use sandbox; multimodal evals. Job signal: Vision-language systems and document automation.",
    "doneWhen": "A reviewer can reproduce the benchmark and understand when the system abstains."
  },
  {
    "id": "P14",
    "name": "Realtime Bilingual Voice Agent",
    "short": "Voice agent",
    "blurb": "WebRTC/WebSocket voice, interruption handling, multilingual Urdu-English support, tool calls, latency and task-success evals.",
    "start": 71,
    "end": 77,
    "shipDay": 77,
    "description": "WebRTC/WebSocket voice, interruption handling, multilingual Urdu-English support, tool calls, latency and task-success evals. Job signal: Realtime systems, voice UX, event-driven integrations.",
    "doneWhen": "A new user can complete the target task while all tool actions and latency are traceable."
  },
  {
    "id": "P15",
    "name": "Open-Model Optimization and Serving Lab",
    "short": "Model serving",
    "blurb": "Model selection, local inference, quantization, dataset curation, PEFT/LoRA/QLoRA, vLLM serving, and hosted-vs-open comparison.",
    "start": 78,
    "end": 84,
    "shipDay": 84,
    "description": "Model selection, local inference, quantization, dataset curation, PEFT/LoRA/QLoRA, vLLM serving, and hosted-vs-open comparison. Job signal: Open-source models, GPU/inference literacy, fine-tuning decisions.",
    "doneWhen": "The report includes a clear recommendation at low, medium and high request volume."
  },
  {
    "id": "P16",
    "name": "Secure MCP Business Server and Interactive App",
    "short": "MCP server",
    "blurb": "MCP tools, resources and prompts over a real database, current Streamable HTTP transport, authentication, least privilege, tool-use evals and an optional interactive MCP App surface.",
    "start": 85,
    "end": 88,
    "shipDay": 88,
    "description": "MCP tools, resources and prompts over a real database, current Streamable HTTP transport, authentication, least privilege, tool-use evals and an optional interactive MCP App surface. Job signal: Current agent-tool interoperability, secure protocol deployment and product integration.",
    "doneWhen": "P16 works end-to-end with a real client and has an eval/security report."
  },
  {
    "id": "P17",
    "name": "A2A Interoperable Agent Network",
    "short": "A2A network",
    "blurb": "Two specialized agents with agent cards, task delegation, streaming artifacts, cross-framework communication, and delegation evals.",
    "start": 89,
    "end": 91,
    "shipDay": 91,
    "description": "Two specialized agents with agent cards, task delegation, streaming artifacts, cross-framework communication, and delegation evals. Job signal: Agent interoperability and distributed agent architecture.",
    "doneWhen": "P17 clearly states when A2A is useful and when the coordinator should work alone."
  },
  {
    "id": "P18",
    "name": "AI Red-Team and Guardrails Kit",
    "short": "Red-team kit",
    "blurb": "Threat models, injection/exfiltration tests, least privilege, memory poisoning tests, automated scanners, and security regression CI.",
    "start": 92,
    "end": 98,
    "shipDay": 98,
    "description": "Threat models, injection/exfiltration tests, least privilege, memory poisoning tests, automated scanners, and security regression CI. Job signal: AI security, governance, secure agent deployment.",
    "doneWhen": "Another AI project can adopt the kit and run the baseline security suite."
  },
  {
    "id": "P19",
    "name": "Agent Improvement and AI-Native Engineering Lab",
    "short": "Improvement lab",
    "blurb": "A trace-to-feedback-to-eval-to-harness improvement flywheel using repair loops, record/replay, skills, tool search, subagents and isolated worktrees, with measured before/after performance.",
    "start": 99,
    "end": 105,
    "shipDay": 105,
    "description": "A trace-to-feedback-to-eval-to-harness improvement flywheel using repair loops, record/replay, skills, tool search, subagents and isolated worktrees, with measured before/after performance. Job signal: Operating and continuously improving AI agents rather than merely prompting them.",
    "doneWhen": "The revised harness improves at least one primary metric on a held-out set without violating cost or safety gates."
  },
  {
    "id": "P20",
    "name": "Production Capstone AI Product",
    "short": "Capstone",
    "blurb": "One narrow, deployed AI product combining retrieval, deterministic workflows, agents or loops only where justified, evals, security, observability, cost controls, user testing and a public case study.",
    "start": 106,
    "end": 120,
    "shipDay": 120,
    "description": "One narrow, deployed AI product combining retrieval, deterministic workflows, agents or loops only where justified, evals, security, observability, cost controls, user testing and a public case study. Job signal: Complete hiring centerpiece with product judgment and production evidence.",
    "doneWhen": "Product URL, code, setup guide, evals, security report, telemetry screenshots, runbook, demo, case study and limitations are linked from one page."
  }
];

export const DAYS: DayPlan[] = [
  {
    "day": 1,
    "title": "Set up the engineering monorepo and learning contract",
    "about": "Create the structure that will hold 120 days of code, notes, tests and portfolio evidence.",
    "why": "A public challenge becomes valuable only when the work is reproducible. The repo, test command and evidence rules prevent the plan from becoming passive note-taking.",
    "resource": "Monorepo conventions; Python environments; linting, formatting and pytest; environment-variable hygiene; daily evidence standards.",
    "build": "Create /days, /projects, /datasets and /docs; add pyproject.toml, .env.example, pre-commit or Ruff, pytest, and a README index. Add a script that validates every day folder.",
    "doneWhen": "A fresh clone installs, runs tests and prints a valid curriculum status with one command.",
    "proof": "Public commit, setup GIF or terminal screenshot, and a Day 1 engineering note.",
    "time": "2-3 h",
    "difficulty": "Foundation",
    "projects": [
      "P1"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "GitHub Actions - Get Started",
        "url": "https://docs.github.com/en/actions/get-started"
      },
      {
        "label": "pytest - Documentation",
        "url": "https://docs.pytest.org/"
      }
    ]
  },
  {
    "day": 2,
    "title": "Call a frontier model through raw HTTP and log the full response",
    "about": "Understand requests, responses, usage fields, errors, streaming events and retries without SDK sugar.",
    "why": "Raw HTTP makes provider behavior visible. This knowledge is essential when SDKs hide errors, change abstractions or behave differently across providers.",
    "resource": "Authentication headers; request bodies; streaming versus non-streaming; usage/tokens; status codes; timeouts and exponential backoff.",
    "build": "Call the Responses API with curl and httpx. Save the raw JSON, parse output text, log latency and usage, and handle 401/429/5xx failures.",
    "doneWhen": "Ten test calls produce structured logs and retries work without duplicating successful requests.",
    "proof": "A provider-neutral call diagram and a short failure-handling demo.",
    "time": "2-3 h",
    "difficulty": "Foundation",
    "projects": [
      "P1"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Migrate to the Responses API",
        "url": "https://developers.openai.com/api/docs/guides/migrate-to-responses"
      },
      {
        "label": "OpenAI - Production Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/production-best-practices"
      }
    ]
  },
  {
    "day": 3,
    "title": "Structured outputs, provider abstraction and cost ledger",
    "about": "Build a reusable typed interface instead of scattering model calls across the codebase.",
    "why": "Jobs require maintainable integrations, not single scripts. Typed schemas and one provider boundary make applications testable and easier to migrate.",
    "resource": "JSON Schema; Pydantic validation; structured outputs; provider adapters; token and cost accounting.",
    "build": "Create ModelClient.generate(schema=...) with at least two adapters or one real plus one mock. Persist model, latency, tokens, estimated cost and request ID.",
    "doneWhen": "Invalid outputs are caught and retried; tests can swap the real provider for a deterministic fake.",
    "proof": "Ship P1 with README, architecture diagram, tests and sample logs.",
    "time": "3 h",
    "difficulty": "Core",
    "projects": [
      "P1"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Structured Outputs",
        "url": "https://developers.openai.com/api/docs/guides/structured-outputs"
      },
      {
        "label": "Pydantic - Documentation",
        "url": "https://docs.pydantic.dev/latest/"
      },
      {
        "label": "OpenAI - Cost Optimization",
        "url": "https://developers.openai.com/api/docs/guides/cost-optimization"
      }
    ]
  },
  {
    "day": 4,
    "title": "Tokenization - how models actually read Urdu and English",
    "about": "Measure how bytes, characters, words and tokens differ across English, Urdu and Roman Urdu.",
    "why": "Tokenization affects cost, context length, latency and multilingual quality. It is especially important for Pakistani-language products.",
    "resource": "UTF-8 bytes; vocabulary; token IDs; special tokens; why one word can become many tokens.",
    "build": "Create a notebook comparing token counts and cost estimates for matched English, Urdu and Roman Urdu samples. Include punctuation, numbers and code-switching.",
    "doneWhen": "At least 30 paired examples produce charts and three practical multilingual design conclusions.",
    "proof": "A visual tokenization report suitable for a social post or interview discussion.",
    "time": "2-3 h",
    "difficulty": "Core",
    "projects": [
      "P2"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Karpathy - minBPE",
        "url": "https://github.com/karpathy/minbpe"
      },
      {
        "label": "Karpathy - microGPT",
        "url": "https://karpathy.github.io/2026/02/12/microgpt/"
      }
    ]
  },
  {
    "day": 5,
    "title": "Implement a mini BPE tokenizer from first principles",
    "about": "Code the merge loop so tokenization is understood rather than memorized.",
    "why": "Building the primitive once creates intuition for vocabulary size, compression and out-of-vocabulary behavior.",
    "resource": "Pair statistics; merge rules; encode/decode; vocabulary training; special-token handling.",
    "build": "Implement get_stats, merge, train, encode and decode on a small bilingual corpus. Add round-trip tests and compare vocabulary sizes.",
    "doneWhen": "All test strings round-trip correctly and the tokenizer reports compression ratios by language.",
    "proof": "Clean tokenizer module, tests and explanation of one surprising Urdu result.",
    "time": "3-4 h",
    "difficulty": "Deep",
    "projects": [
      "P2"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Karpathy - minBPE",
        "url": "https://github.com/karpathy/minbpe"
      }
    ]
  },
  {
    "day": 6,
    "title": "Embeddings and cosine similarity by hand",
    "about": "Understand vector meaning before using a vector database.",
    "why": "Retrieval failures are easier to diagnose when similarity, normalization and top-k ranking are not black boxes.",
    "resource": "Embedding vectors; cosine similarity; dot product; normalization; semantic versus lexical similarity.",
    "build": "Embed 40-60 sentences, compute similarities with NumPy, rank nearest neighbours and inspect multilingual/cross-lingual behavior.",
    "doneWhen": "A small evaluation set shows where semantic similarity succeeds and where it confuses related but incorrect text.",
    "proof": "Notebook, similarity matrix and written failure analysis.",
    "time": "2-3 h",
    "difficulty": "Core",
    "projects": [
      "P3"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Embeddings",
        "url": "https://developers.openai.com/api/docs/guides/embeddings"
      }
    ]
  },
  {
    "day": 7,
    "title": "Recap, explain and ship the foundations",
    "about": "Convert the first week into two understandable portfolio artifacts.",
    "why": "Weekly shipping prevents the challenge from becoming one giant unfinished project and gives future viewers re-entry points.",
    "resource": "Technical writing; reproducibility; demo design; retrospective practice.",
    "build": "Refactor P1/P2, improve READMEs, add a two-minute demo, publish benchmark tables and write what AI assistance was used versus hand-written.",
    "doneWhen": "A stranger can clone both projects and reproduce the primary result in under ten minutes.",
    "proof": "Ship P2; website shows 2/20 projects; publish Week 1 retrospective.",
    "time": "1-2 h",
    "difficulty": "Recap",
    "projects": [
      "P2"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "Karpathy - minBPE",
        "url": "https://github.com/karpathy/minbpe"
      },
      {
        "label": "GitHub Actions - Get Started",
        "url": "https://docs.github.com/en/actions/get-started"
      }
    ]
  },
  {
    "day": 8,
    "title": "Design chunking experiments instead of choosing a magic chunk size",
    "about": "Create fixed, sentence-window, semantic and overlap chunkers with measurable trade-offs.",
    "why": "Chunking changes what can be retrieved and cited. A job-ready engineer tests it on their corpus rather than copying one value.",
    "resource": "Chunk boundaries; overlap; metadata; parent-child chunks; retrieval unit versus generation unit.",
    "build": "Ingest a small real corpus and output chunks with stable IDs, source metadata and token counts for four strategies.",
    "doneWhen": "A report compares chunk count, average tokens and answer coverage on ten questions.",
    "proof": "Chunking benchmark committed to P3/P4.",
    "time": "3 h",
    "difficulty": "Core",
    "projects": [
      "P3"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Retrieval",
        "url": "https://developers.openai.com/api/docs/guides/retrieval"
      },
      {
        "label": "Anthropic - Contextual Retrieval",
        "url": "https://www.anthropic.com/engineering/contextual-retrieval"
      }
    ]
  },
  {
    "day": 9,
    "title": "Build a vector index and retrieval baseline",
    "about": "Create an end-to-end semantic retriever with a real store.",
    "why": "A retriever must be reproducible, filterable and measurable; a notebook-only nearest-neighbour demo is not enough.",
    "resource": "Indexing; namespaces; metadata filters; top-k; persistence; pgvector or FAISS trade-offs.",
    "build": "Index the corpus with pgvector or FAISS, implement search(query, filters, k), and save retrieval traces.",
    "doneWhen": "Twenty labeled queries return a baseline recall@k and latency distribution.",
    "proof": "CLI search demo and baseline metrics table.",
    "time": "3 h",
    "difficulty": "Core",
    "projects": [
      "P3"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Retrieval",
        "url": "https://developers.openai.com/api/docs/guides/retrieval"
      },
      {
        "label": "pgvector - PostgreSQL Vector Similarity Search",
        "url": "https://github.com/pgvector/pgvector"
      }
    ]
  },
  {
    "day": 10,
    "title": "Add lexical search with BM25",
    "about": "Create a keyword baseline that catches exact names, codes and rare terms.",
    "why": "Semantic search is not automatically best. Production retrieval often benefits from lexical signals, especially for IDs and domain language.",
    "resource": "Term frequency; inverse document frequency; tokenization for search; lexical failure modes.",
    "build": "Implement or integrate BM25 over the same corpus and evaluation queries. Log which queries each retriever wins.",
    "doneWhen": "You can explain at least five semantic wins and five lexical wins using real examples.",
    "proof": "Comparison notebook and error labels.",
    "time": "2-3 h",
    "difficulty": "Core",
    "projects": [
      "P3"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Retrieval",
        "url": "https://developers.openai.com/api/docs/guides/retrieval"
      },
      {
        "label": "pytest - Documentation",
        "url": "https://docs.pytest.org/"
      }
    ]
  },
  {
    "day": 11,
    "title": "Fuse lexical and semantic results with reciprocal-rank fusion",
    "about": "Build a hybrid retriever and prove whether it improves recall.",
    "why": "Hybrid search is valuable only when evaluated. Fusion teaches ranking, deduplication and score calibration.",
    "resource": "Reciprocal-rank fusion; weighted fusion; deduplication; rank versus score.",
    "build": "Combine BM25 and vector results, tune one fusion parameter on a development set and freeze it before testing.",
    "doneWhen": "Hybrid retrieval is evaluated on a held-out set and either beats the baselines or documents why it does not.",
    "proof": "P3 metric card: recall@k, MRR and p95 latency.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P3"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Retrieval",
        "url": "https://developers.openai.com/api/docs/guides/retrieval"
      },
      {
        "label": "Anthropic - Contextual Retrieval",
        "url": "https://www.anthropic.com/engineering/contextual-retrieval"
      }
    ]
  },
  {
    "day": 12,
    "title": "Query rewriting, decomposition and hypothetical documents",
    "about": "Improve hard queries without stuffing more context into the prompt.",
    "why": "User wording and document wording often differ. Rewriting can close the vocabulary gap but can also drift from intent.",
    "resource": "Multi-query retrieval; decomposition; HyDE; fallback search; intent preservation.",
    "build": "Add two rewriting strategies and route them only when the baseline confidence is low. Save original and rewritten queries in traces.",
    "doneWhen": "Hard-query recall improves without reducing easy-query precision beyond the chosen tolerance.",
    "proof": "Before/after query examples and a drift failure analysis.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P3"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Effective Context Engineering",
        "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
      },
      {
        "label": "OpenAI - Retrieval",
        "url": "https://developers.openai.com/api/docs/guides/retrieval"
      }
    ]
  },
  {
    "day": 13,
    "title": "Reranking, contextual retrieval and source-grounded citations",
    "about": "Return the best evidence, not merely the nearest vectors.",
    "why": "Reranking and contextualization can improve top-k quality, while citations make answers inspectable and defensible.",
    "resource": "Cross-encoder/LLM reranking; contextualized chunks; source IDs; citation contracts; answer abstention.",
    "build": "Rerank retrieved chunks, add contextual descriptions before indexing, and generate answers that cite exact chunk IDs with quoted evidence limits.",
    "doneWhen": "Top-k precision and citation validity are measured; unsupported answers abstain.",
    "proof": "Ship P3 and freeze the retrieval benchmark used later by evals.",
    "time": "3-4 h",
    "difficulty": "Deep",
    "projects": [
      "P3"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Contextual Retrieval",
        "url": "https://www.anthropic.com/engineering/contextual-retrieval"
      },
      {
        "label": "OpenAI - Retrieval",
        "url": "https://developers.openai.com/api/docs/guides/retrieval"
      }
    ]
  },
  {
    "day": 14,
    "title": "Serve the grounded RAG system as a traceable API",
    "about": "Turn retrieval experiments into a usable product boundary.",
    "why": "Employers and clients need an API that handles files, users, errors and evidence - not only a notebook.",
    "resource": "Ingestion jobs; /ask endpoint; streaming; source payloads; tracing; API contracts.",
    "build": "Create FastAPI endpoints for upload/status/ask, return citations and trace IDs, and instrument the full path with Phoenix or OpenTelemetry.",
    "doneWhen": "A fresh document can be uploaded and queried; every answer links to retrieved evidence and trace data.",
    "proof": "Ship P4; website shows 4/20 projects; record a complete demo.",
    "time": "3-4 h",
    "difficulty": "Ship",
    "projects": [
      "P4"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "FastAPI - Documentation",
        "url": "https://fastapi.tiangolo.com/"
      },
      {
        "label": "Arize Phoenix - Documentation",
        "url": "https://arize.com/docs/phoenix"
      },
      {
        "label": "OpenAI - File Inputs",
        "url": "https://developers.openai.com/api/docs/guides/file-inputs"
      }
    ]
  },
  {
    "day": 15,
    "title": "Define quality before adding more features",
    "about": "Write task-specific success criteria and collect a trace dataset.",
    "why": "Without a definition of good behavior, prompt changes become vibe-based and regressions remain invisible.",
    "resource": "Task specification; trace schemas; feature/scenario matrices; sampling; privacy-aware logging.",
    "build": "Collect 40-60 RAG traces containing input, retrieved chunks, answer, citations, latency, cost and model version.",
    "doneWhen": "Every trace can be replayed and linked to a feature and scenario.",
    "proof": "Versioned traces.jsonl and evaluation README.",
    "time": "2-3 h",
    "difficulty": "Core",
    "projects": [
      "P5"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Hamel Husain - Your AI Product Needs Evals",
        "url": "https://hamel.dev/blog/posts/evals/"
      },
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      }
    ]
  },
  {
    "day": 16,
    "title": "Perform human error analysis and build a failure taxonomy",
    "about": "Read the traces and name the real failure modes before selecting metrics.",
    "why": "Generic metrics do not tell you what to fix. Error analysis transforms examples into an engineering backlog.",
    "resource": "Open coding; first-failure labeling; axial coding; severity; frequency; root cause versus symptom.",
    "build": "Label the first meaningful failure in each trace, cluster notes into 6-10 categories, and rank by frequency times impact.",
    "doneWhen": "The taxonomy has clear definitions, examples and proposed owners/components.",
    "proof": "Failure-mode dashboard and top-three improvement plan.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P5"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Hamel Husain - Your AI Product Needs Evals",
        "url": "https://hamel.dev/blog/posts/evals/"
      },
      {
        "label": "Arize Phoenix - Documentation",
        "url": "https://arize.com/docs/phoenix"
      }
    ]
  },
  {
    "day": 17,
    "title": "Write deterministic evaluators first",
    "about": "Catch format, citation, tool and business-rule failures cheaply.",
    "why": "Code checks are fast, explainable and stable. An LLM judge should not replace assertions that normal software can enforce.",
    "resource": "Assertions; schema tests; regex; executable checks; retrieval/citation consistency; test parametrization.",
    "build": "Implement at least six evaluators and run them with pytest over the trace dataset.",
    "doneWhen": "The suite identifies known failures and prints actionable messages with trace IDs.",
    "proof": "Green/red CI example and evaluator documentation.",
    "time": "3 h",
    "difficulty": "Core",
    "projects": [
      "P5"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Hamel Husain - Your AI Product Needs Evals",
        "url": "https://hamel.dev/blog/posts/evals/"
      },
      {
        "label": "pytest - Documentation",
        "url": "https://docs.pytest.org/"
      }
    ]
  },
  {
    "day": 18,
    "title": "Create one focused LLM-as-judge evaluator",
    "about": "Evaluate a subjective criterion that deterministic code cannot measure.",
    "why": "Judges work best when the rubric is narrow, examples are clear and output is easy to audit.",
    "resource": "Binary rubrics; pairwise comparison; rationale fields; judge leakage; position and verbosity bias.",
    "build": "Write a judge for one failure mode, require structured pass/fail plus evidence, and test prompt variants.",
    "doneWhen": "The judge runs across all traces and its disagreements can be reviewed quickly.",
    "proof": "Judge prompt versions and a disagreement report.",
    "time": "2-3 h",
    "difficulty": "Deep",
    "projects": [
      "P5"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      },
      {
        "label": "Hamel Husain - Your AI Product Needs Evals",
        "url": "https://hamel.dev/blog/posts/evals/"
      }
    ]
  },
  {
    "day": 19,
    "title": "Align the judge with human labels",
    "about": "Measure when the automatic judge can and cannot be trusted.",
    "why": "A judge is another model system and needs its own evaluation. Raw agreement can mislead on imbalanced data.",
    "resource": "Confusion matrix; precision/recall; Cohen's kappa; held-out examples; calibration.",
    "build": "Create a balanced human-labeled set, calculate agreement metrics, inspect disagreements and revise the rubric once.",
    "doneWhen": "The final report states acceptable use, unacceptable use and periodic re-check frequency.",
    "proof": "Human-vs-judge alignment table committed to P5.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P5"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Hamel Husain - Your AI Product Needs Evals",
        "url": "https://hamel.dev/blog/posts/evals/"
      },
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      }
    ]
  },
  {
    "day": 20,
    "title": "Add retrieval and end-to-end regression gates",
    "about": "Make quality regressions fail before deployment.",
    "why": "Reliability becomes real when a pull request cannot silently reduce answer quality or citation correctness.",
    "resource": "Golden datasets; development versus test split; thresholds; statistical noise; CI artifacts.",
    "build": "Run retrieval metrics, deterministic checks and the aligned judge in GitHub Actions. Store results and compare against baseline.",
    "doneWhen": "An intentionally bad change produces a red pull request and a readable evaluation artifact.",
    "proof": "Screenshot of the failed gate and the fix that restores it.",
    "time": "3-4 h",
    "difficulty": "Ship",
    "projects": [
      "P5"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "GitHub Actions - Get Started",
        "url": "https://docs.github.com/en/actions/get-started"
      },
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      },
      {
        "label": "OpenAI - Retrieval",
        "url": "https://developers.openai.com/api/docs/guides/retrieval"
      }
    ]
  },
  {
    "day": 21,
    "title": "Package the eval flywheel as a standalone portfolio product",
    "about": "Document how new failures become labels, tests, fixes and monitored regressions.",
    "why": "The flywheel is what lets teams improve after launch and is a strong interview differentiator.",
    "resource": "Evaluation operations; test ownership; review cadence; dataset versioning; quality release notes.",
    "build": "Add a one-command eval runner, dashboard/report, contribution guide and weekly review SOP.",
    "doneWhen": "Someone can add one new failure example and see it flow through the whole system.",
    "proof": "Ship P5; website shows 5/20 projects; publish a reliability case study.",
    "time": "1-2 h",
    "difficulty": "Recap",
    "projects": [
      "P5"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "Hamel Husain - Your AI Product Needs Evals",
        "url": "https://hamel.dev/blog/posts/evals/"
      },
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      },
      {
        "label": "GitHub Actions - Get Started",
        "url": "https://docs.github.com/en/actions/get-started"
      }
    ]
  },
  {
    "day": 22,
    "title": "Audit every token entering the model",
    "about": "Map instructions, tools, examples, history and retrieved data into a context budget.",
    "why": "Context is finite and expensive. Good systems curate high-signal tokens rather than accumulating everything.",
    "resource": "Context components; token budgets; static versus dynamic prefixes; high-signal information.",
    "build": "Instrument P4 to log tokens by component and create a budget table for five representative requests.",
    "doneWhen": "You can identify the three largest sources of waste and their quality purpose.",
    "proof": "Context budget dashboard and proposed cuts.",
    "time": "2-3 h",
    "difficulty": "Core",
    "projects": [
      "P6"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Effective Context Engineering",
        "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
      },
      {
        "label": "OpenAI - Cost Optimization",
        "url": "https://developers.openai.com/api/docs/guides/cost-optimization"
      }
    ]
  },
  {
    "day": 23,
    "title": "Test context position and context rot",
    "about": "Measure how accuracy changes as evidence moves or irrelevant text grows.",
    "why": "Large context windows do not guarantee reliable attention. Position and noise can reduce recall.",
    "resource": "Lost-in-the-middle behavior; distractors; attention budget; position-sensitive evaluation.",
    "build": "Create controlled tests placing the answer at beginning/middle/end with increasing distractors, then chart accuracy versus tokens.",
    "doneWhen": "The report identifies a safe context policy for your corpus and model.",
    "proof": "Accuracy-token-position chart used in the final case study.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P6"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Effective Context Engineering",
        "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
      },
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      }
    ]
  },
  {
    "day": 24,
    "title": "Design prompts for caching and stable prefixes",
    "about": "Reduce repeated computation without changing behavior.",
    "why": "Caching rewards stable, reusable prefixes and can lower latency and cost for repeated system/tool instructions.",
    "resource": "Cacheable prefixes; dynamic suffixes; prompt versioning; cache hit metrics.",
    "build": "Refactor the RAG prompt so static instructions, examples and tool schemas are grouped before dynamic user data. Measure cache behavior.",
    "doneWhen": "A repeated workload reports before/after latency and cost with quality held constant.",
    "proof": "Caching benchmark and prompt diff.",
    "time": "2-3 h",
    "difficulty": "Core",
    "projects": [
      "P6"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Prompt Caching",
        "url": "https://developers.openai.com/api/docs/guides/prompt-caching"
      },
      {
        "label": "OpenAI - Cost Optimization",
        "url": "https://developers.openai.com/api/docs/guides/cost-optimization"
      }
    ]
  },
  {
    "day": 25,
    "title": "Implement compaction and memory summaries",
    "about": "Keep long conversations useful under a hard token ceiling.",
    "why": "Long-running systems need a policy for retaining decisions, facts and unresolved work while discarding redundant transcript text.",
    "resource": "Rolling summaries; semantic memory; episodic memory; pinned facts; compaction triggers.",
    "build": "Create a memory manager that compacts old turns, preserves citations/decisions and can explain what was removed.",
    "doneWhen": "A long test conversation stays below the ceiling and passes follow-up factual checks.",
    "proof": "Memory trace and compaction regression tests.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P6"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Compaction",
        "url": "https://developers.openai.com/api/docs/guides/compaction"
      },
      {
        "label": "Anthropic - Effective Context Engineering",
        "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
      }
    ]
  },
  {
    "day": 26,
    "title": "Route work across models and deterministic code",
    "about": "Use expensive reasoning only where it produces measurable value.",
    "why": "Model routing is a product and reliability decision, not merely a cost trick. Easy tasks may need no LLM at all.",
    "resource": "Rule-based routing; confidence; cascade models; fallbacks; escalation.",
    "build": "Route simple extraction to code/small model and complex synthesis to a stronger model. Log route, confidence and outcome.",
    "doneWhen": "A mixed workload reduces cost while remaining within the chosen quality tolerance.",
    "proof": "Routing confusion matrix and savings estimate.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P6"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Building Effective Agents",
        "url": "https://www.anthropic.com/engineering/building-effective-agents"
      },
      {
        "label": "OpenAI - Cost Optimization",
        "url": "https://developers.openai.com/api/docs/guides/cost-optimization"
      }
    ]
  },
  {
    "day": 27,
    "title": "Build a cost, latency and quality dashboard",
    "about": "Make engineering trade-offs visible on every request and version.",
    "why": "Teams need to see whether a quality improvement doubles cost or whether a cheaper route causes specific failures.",
    "resource": "p50/p95 latency; cost per successful task; quality-adjusted cost; trace aggregation.",
    "build": "Aggregate model, tokens, cache hits, retrieval latency, total latency, evaluation outcome and cost into a dashboard.",
    "doneWhen": "You can compare two prompt/model versions on quality, cost and p95 latency.",
    "proof": "Dashboard screenshots and exported benchmark JSON.",
    "time": "3 h",
    "difficulty": "Core",
    "projects": [
      "P6"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Arize Phoenix - Documentation",
        "url": "https://arize.com/docs/phoenix"
      },
      {
        "label": "OpenTelemetry - Documentation",
        "url": "https://opentelemetry.io/docs/"
      },
      {
        "label": "OpenAI - Cost Optimization",
        "url": "https://developers.openai.com/api/docs/guides/cost-optimization"
      }
    ]
  },
  {
    "day": 28,
    "title": "Publish an AI reliability and cost optimization case study",
    "about": "Turn P6 into a service-shaped portfolio artifact with real numbers.",
    "why": "Hiring managers and clients respond to problem-method-result evidence, not a list of technologies.",
    "resource": "Baseline design; controlled comparison; business-facing findings; limitations.",
    "build": "Write a case study showing baseline, interventions, quality delta, cost delta, latency delta and remaining risks.",
    "doneWhen": "All claims are reproducible from scripts and no percentage is based on a single request.",
    "proof": "Ship P6; website shows 6/20 projects; publish the case study.",
    "time": "1-2 h",
    "difficulty": "Recap",
    "projects": [
      "P6"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "OpenAI - Production Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/production-best-practices"
      },
      {
        "label": "OpenAI - Deployment Checklist",
        "url": "https://developers.openai.com/api/docs/guides/deployment-checklist"
      }
    ]
  },
  {
    "day": 29,
    "title": "Extract business data from PDFs and images into typed schemas",
    "about": "Build a practical document AI pipeline rather than a generic chat demo.",
    "why": "Invoices, forms, applications and reports are common paid use cases. Typed outputs connect models to real software.",
    "resource": "File inputs; multimodal extraction; schema design; nullable fields; provenance.",
    "build": "Define a schema for one document type and extract fields with page/source references. Save raw input and normalized output separately.",
    "doneWhen": "Twenty sample documents produce validated records and a field-level accuracy report.",
    "proof": "Extraction dataset and error gallery.",
    "time": "3 h",
    "difficulty": "Core",
    "projects": [
      "P7"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Images and Vision",
        "url": "https://developers.openai.com/api/docs/guides/images-vision"
      },
      {
        "label": "OpenAI - File Inputs",
        "url": "https://developers.openai.com/api/docs/guides/file-inputs"
      },
      {
        "label": "Pydantic - Documentation",
        "url": "https://docs.pydantic.dev/latest/"
      }
    ]
  },
  {
    "day": 30,
    "title": "Handle validation failures, confidence and retries",
    "about": "Make extraction safe enough for downstream databases.",
    "why": "A valid JSON object can still contain wrong values. Production pipelines need field checks and human escalation.",
    "resource": "Cross-field validation; confidence proxies; retry prompts; deterministic normalization; abstention.",
    "build": "Add validators for dates, totals, IDs and required relationships. Retry only the failed fields and flag uncertain records.",
    "doneWhen": "Known malformed documents never silently enter the accepted dataset.",
    "proof": "Validation report with accepted, retried and review-required states.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P7"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Structured Outputs",
        "url": "https://developers.openai.com/api/docs/guides/structured-outputs"
      },
      {
        "label": "Pydantic - Documentation",
        "url": "https://docs.pydantic.dev/latest/"
      },
      {
        "label": "Hamel Husain - Your AI Product Needs Evals",
        "url": "https://hamel.dev/blog/posts/evals/"
      }
    ]
  },
  {
    "day": 31,
    "title": "Add batching and a lightweight human-review screen",
    "about": "Complete the document pipeline from upload to corrected record.",
    "why": "Human review is often the correct production design for low-confidence or high-risk fields.",
    "resource": "Batch jobs; review queues; editable fields; audit history; feedback data.",
    "build": "Process a folder asynchronously and show uncertain fields in a minimal review UI. Save corrections as future eval/training data.",
    "doneWhen": "A reviewer can correct a record and the audit log preserves model output and human change.",
    "proof": "Ship P7; website shows 7/20 projects; demo a document from upload to approval.",
    "time": "3-4 h",
    "difficulty": "Ship",
    "projects": [
      "P7"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Background Mode",
        "url": "https://developers.openai.com/api/docs/guides/background"
      },
      {
        "label": "OpenAI - Webhooks",
        "url": "https://developers.openai.com/api/docs/guides/webhooks"
      },
      {
        "label": "FastAPI - Documentation",
        "url": "https://fastapi.tiangolo.com/"
      }
    ]
  },
  {
    "day": 32,
    "title": "Build a gated prompt-chaining workflow",
    "about": "Decompose a complex task into fixed, testable stages.",
    "why": "For predictable business processes, workflows provide more reliability and transparency than autonomous agents.",
    "resource": "Stage contracts; intermediate validation; gates; retries; trace structure.",
    "build": "Create a research-to-brief or support-ticket workflow with classify, retrieve, draft, verify and format stages.",
    "doneWhen": "Every stage has a typed input/output and can be replayed independently.",
    "proof": "Workflow diagram and stage-level metrics.",
    "time": "3 h",
    "difficulty": "Core",
    "projects": [
      "P8"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Building Effective Agents",
        "url": "https://www.anthropic.com/engineering/building-effective-agents"
      },
      {
        "label": "OpenAI - Structured Outputs",
        "url": "https://developers.openai.com/api/docs/guides/structured-outputs"
      }
    ]
  },
  {
    "day": 33,
    "title": "Add routing and parallelization patterns",
    "about": "Use specialized paths and concurrent work where they improve speed or accuracy.",
    "why": "One universal prompt often underperforms specialized prompts; independent subtasks can run in parallel.",
    "resource": "Intent routing; sectioning; voting; concurrency; aggregation.",
    "build": "Route at least three request types and parallelize two independent checks. Compare to one monolithic call.",
    "doneWhen": "Routing accuracy and wall-clock improvement are measured on labeled cases.",
    "proof": "Routing matrix and concurrency benchmark.",
    "time": "3 h",
    "difficulty": "Core",
    "projects": [
      "P8"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Building Effective Agents",
        "url": "https://www.anthropic.com/engineering/building-effective-agents"
      },
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      }
    ]
  },
  {
    "day": 34,
    "title": "Implement orchestrator-workers and evaluator-optimizer",
    "about": "Explore dynamic decomposition and iterative refinement without pretending every task needs full autonomy.",
    "why": "These patterns are useful when subtasks cannot be known in advance or when feedback clearly improves output.",
    "resource": "Dynamic task decomposition; worker contracts; critique loops; stopping criteria.",
    "build": "Add an orchestrator that creates worker tasks and an evaluator that requests revision only when a rubric fails.",
    "doneWhen": "The system logs why it created each task and whether an additional iteration improved the rubric score.",
    "proof": "Trace comparison showing useful and wasteful iterations.",
    "time": "3-4 h",
    "difficulty": "Deep",
    "projects": [
      "P8"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Building Effective Agents",
        "url": "https://www.anthropic.com/engineering/building-effective-agents"
      },
      {
        "label": "Hamel Husain - Your AI Product Needs Evals",
        "url": "https://hamel.dev/blog/posts/evals/"
      }
    ]
  },
  {
    "day": 35,
    "title": "Compare workflow patterns and ship the automation engine",
    "about": "Select the simplest pattern that meets quality requirements.",
    "why": "Knowing when not to build an agent is a senior engineering skill.",
    "resource": "Cost/reliability/flexibility trade-offs; pattern selection; failure containment.",
    "build": "Run the same representative task through chain, routed workflow and dynamic orchestration; document the decision framework.",
    "doneWhen": "P8 exposes reusable components and a clear 'use this when' guide.",
    "proof": "Ship P8; website shows 8/20 projects; publish the workflow-vs-agent decision matrix.",
    "time": "1-2 h",
    "difficulty": "Recap",
    "projects": [
      "P8"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "Anthropic - Building Effective Agents",
        "url": "https://www.anthropic.com/engineering/building-effective-agents"
      },
      {
        "label": "OpenAI - Deployment Checklist",
        "url": "https://developers.openai.com/api/docs/guides/deployment-checklist"
      }
    ]
  },
  {
    "day": 36,
    "title": "Define what an agent is and when not to use one",
    "about": "Create a decision checklist before writing the loop.",
    "why": "Agents trade predictability, latency and cost for flexibility. The architecture must match the problem.",
    "resource": "Workflows versus agents; environmental feedback; autonomy; stopping conditions; trust boundaries.",
    "build": "Write an agent suitability scorecard and apply it to six use cases, including one you reject.",
    "doneWhen": "The chosen project has open-ended steps, tools, clear success criteria and a bounded environment.",
    "proof": "Architecture decision record in P9.",
    "time": "2 h",
    "difficulty": "Core",
    "projects": [
      "P9"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Building Effective Agents",
        "url": "https://www.anthropic.com/engineering/building-effective-agents"
      }
    ]
  },
  {
    "day": 37,
    "title": "Code the think-act-observe loop from scratch",
    "about": "Build the minimal agent without a framework.",
    "why": "The core architecture is simple: the model selects actions, receives ground truth and continues until completion or stop.",
    "resource": "Loop state; action parsing; observations; termination; iteration caps.",
    "build": "Write a while loop with one read-only tool, a final-answer action and full event logging.",
    "doneWhen": "The agent solves ten bounded tasks and never exceeds its maximum steps.",
    "proof": "Readable trace showing each action and observation.",
    "time": "3 h",
    "difficulty": "Core",
    "projects": [
      "P9"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Building Effective Agents",
        "url": "https://www.anthropic.com/engineering/building-effective-agents"
      },
      {
        "label": "OpenAI - Function Calling",
        "url": "https://developers.openai.com/api/docs/guides/function-calling"
      }
    ]
  },
  {
    "day": 38,
    "title": "Add typed tools and robust error recovery",
    "about": "Make tool calls safe, understandable and recoverable.",
    "why": "Most agent failures happen at the model-environment interface, not in the prose prompt.",
    "resource": "Tool schemas; validation; timeouts; retries; error observations; idempotency.",
    "build": "Add three tools with Pydantic inputs, explicit errors and tests. Return compact, model-friendly observations.",
    "doneWhen": "Bad arguments, timeouts and empty results become useful observations instead of crashes.",
    "proof": "Tool test suite and error-recovery demo.",
    "time": "3 h",
    "difficulty": "Core",
    "projects": [
      "P9"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Writing Effective Tools for Agents",
        "url": "https://www.anthropic.com/engineering/writing-tools-for-agents"
      },
      {
        "label": "Pydantic - Documentation",
        "url": "https://docs.pydantic.dev/latest/"
      },
      {
        "label": "OpenAI - Function Calling",
        "url": "https://developers.openai.com/api/docs/guides/function-calling"
      }
    ]
  },
  {
    "day": 39,
    "title": "Improve tool names, boundaries and descriptions",
    "about": "Optimize the agent-computer interface through evaluation.",
    "why": "Overlapping or vague tools confuse models and increase context. Tool design deserves the same attention as user interfaces.",
    "resource": "Namespacing; consolidation; descriptive parameters; poka-yoke; minimal tool sets.",
    "build": "Generate tool-selection test tasks, measure accuracy, refactor names/descriptions and compare.",
    "doneWhen": "The agent chooses the correct tool more reliably with fewer ambiguous tools.",
    "proof": "Before/after tool-selection score and design notes.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P9"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Writing Effective Tools for Agents",
        "url": "https://www.anthropic.com/engineering/writing-tools-for-agents"
      },
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      }
    ]
  },
  {
    "day": 40,
    "title": "Add durable state, memory and human approval",
    "about": "Let the agent remember necessary facts while pausing before risky actions.",
    "why": "Useful agents need state, but memory and autonomy create safety and privacy risks.",
    "resource": "Session state; durable memory; approval checkpoints; read/write separation; action risk levels.",
    "build": "Persist task state, add a memory CRUD tool, and require approval before one irreversible write action.",
    "doneWhen": "The agent resumes after restart and cannot execute the risky action without an approval token.",
    "proof": "State transition diagram and approval demo.",
    "time": "3-4 h",
    "difficulty": "Deep",
    "projects": [
      "P9"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Effective Context Engineering",
        "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
      },
      {
        "label": "OpenAI - Safety Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/safety-best-practices"
      }
    ]
  },
  {
    "day": 41,
    "title": "Rebuild the same agent with two framework approaches",
    "about": "Learn what SDKs provide and what they hide.",
    "why": "Employers may use different frameworks. Framework literacy is valuable only after the underlying loop is understood.",
    "resource": "Agents SDK concepts; LangGraph state graphs; tracing; handoffs; checkpoints.",
    "build": "Rebuild a small slice in OpenAI Agents SDK and LangGraph. Map every framework object to your raw implementation.",
    "doneWhen": "A comparison table covers control flow, state, tracing, testing and lock-in.",
    "proof": "Two small implementations and a framework selection memo.",
    "time": "3-4 h",
    "difficulty": "Framework",
    "projects": [
      "P9"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI Agents SDK - Python",
        "url": "https://openai.github.io/openai-agents-python/"
      },
      {
        "label": "LangGraph - Documentation",
        "url": "https://docs.langchain.com/oss/python/langgraph/overview"
      }
    ]
  },
  {
    "day": 42,
    "title": "Evaluate trajectories and ship the agent",
    "about": "Test both final answers and the path taken to reach them.",
    "why": "An agent can produce a correct answer through unsafe, expensive or incorrect actions. Trajectory quality matters.",
    "resource": "Tool-selection accuracy; step efficiency; prohibited actions; final-answer grading; sandboxing.",
    "build": "Create 25 agent tasks, expected tool constraints and automated trajectory checks. Patch one discovered failure.",
    "doneWhen": "P9 reports task success, tool accuracy, average steps, cost and unsafe-action rate.",
    "proof": "Ship P9; website shows 9/20 projects; publish a transparent agent trace.",
    "time": "1-2 h",
    "difficulty": "Recap",
    "projects": [
      "P9"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      },
      {
        "label": "OpenAI Agents SDK - Python",
        "url": "https://openai.github.io/openai-agents-python/"
      },
      {
        "label": "OpenAI - Safety Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/safety-best-practices"
      }
    ]
  },
  {
    "day": 43,
    "title": "Specify a task that genuinely spans multiple sessions",
    "about": "Choose a long-horizon problem with verifiable milestones and a bounded environment.",
    "why": "A long-running agent is not simply a longer chat. It needs artifacts, checkpoints and recovery from partial progress.",
    "resource": "Task contracts; milestone graphs; acceptance tests; external state; session boundaries.",
    "build": "Write a task spec, feature checklist and done-when tests for a multi-file coding task or multi-source research report.",
    "doneWhen": "A new agent session can understand the project without reading the entire prior transcript.",
    "proof": "Long-horizon task brief and initial failing checklist.",
    "time": "2-3 h",
    "difficulty": "Core",
    "projects": [
      "P10"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Effective Harnesses for Long-Running Agents",
        "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
      }
    ]
  },
  {
    "day": 44,
    "title": "Build durable checkpoints and an artifact ledger",
    "about": "Externalize progress so the agent can resume safely.",
    "why": "Context windows and processes end. Durable state is the source of truth for long work.",
    "resource": "Checkpoint schema; append-only logs; task status; artifact hashes; resumability.",
    "build": "Create state.json, progress.md, artifacts/ and a checkpoint command that records work, tests and next action.",
    "doneWhen": "Killing the process after any step does not lose completed work or corrupt state.",
    "proof": "Restart demo and checkpoint audit log.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P10"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Effective Harnesses for Long-Running Agents",
        "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
      },
      {
        "label": "PostgreSQL - Documentation",
        "url": "https://www.postgresql.org/docs/"
      }
    ]
  },
  {
    "day": 45,
    "title": "Implement initializer and worker sessions",
    "about": "Separate project setup from incremental execution.",
    "why": "The initializer creates stable scaffolding; later sessions make bounded changes and leave clean handoffs.",
    "resource": "Initialization contracts; feature lists; session prompts; incremental commits; handoff notes.",
    "build": "Create an initializer that writes the task state and a worker that selects one incomplete item, acts, tests and checkpoints.",
    "doneWhen": "Three independent worker runs make cumulative progress without shared hidden context.",
    "proof": "Git history and state changes across sessions.",
    "time": "3-4 h",
    "difficulty": "Deep",
    "projects": [
      "P10"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Effective Harnesses for Long-Running Agents",
        "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
      },
      {
        "label": "GitHub Actions - Get Started",
        "url": "https://docs.github.com/en/actions/get-started"
      }
    ]
  },
  {
    "day": 46,
    "title": "Run long tasks in the background with webhooks",
    "about": "Decouple user requests from long model execution.",
    "why": "Production systems cannot keep one browser request open for hours. Jobs need status, cancellation and completion events.",
    "resource": "Background mode; polling; webhooks; job IDs; cancellation; idempotent callbacks.",
    "build": "Start a long job, persist its status, receive or simulate a webhook and expose a status endpoint.",
    "doneWhen": "A client can disconnect, return later and retrieve the completed artifact exactly once.",
    "proof": "Sequence diagram and webhook replay test.",
    "time": "3 h",
    "difficulty": "Production",
    "projects": [
      "P10"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Background Mode",
        "url": "https://developers.openai.com/api/docs/guides/background"
      },
      {
        "label": "OpenAI - Webhooks",
        "url": "https://developers.openai.com/api/docs/guides/webhooks"
      }
    ]
  },
  {
    "day": 47,
    "title": "Add doer-verifier and reflection loops",
    "about": "Use tests and critique to catch errors before handoff.",
    "why": "Long-horizon errors compound. Verification should use ground truth wherever possible, not only self-confidence.",
    "resource": "Doer-verifier separation; acceptance tests; reflection notes; corrective actions.",
    "build": "Require the worker to run tests or rubric checks, then let a verifier accept, reject or request a bounded correction.",
    "doneWhen": "A planted defect is caught and repaired before the task is marked complete.",
    "proof": "Failure, verifier feedback and corrected checkpoint trace.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P10"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Effective Harnesses for Long-Running Agents",
        "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
      },
      {
        "label": "Anthropic - Building Effective Agents",
        "url": "https://www.anthropic.com/engineering/building-effective-agents"
      },
      {
        "label": "pytest - Documentation",
        "url": "https://docs.pytest.org/"
      }
    ]
  },
  {
    "day": 48,
    "title": "Enforce time, token, money and permission budgets",
    "about": "Bound the agent even when the task is open-ended.",
    "why": "Long-running autonomy needs explicit economic and security limits to avoid runaway loops or excessive agency.",
    "resource": "Budget counters; tool scopes; escalation; safe stopping; user approvals.",
    "build": "Add hard limits for steps, tokens, cost and wall-clock time, plus approval rules for risky operations.",
    "doneWhen": "Budget exhaustion creates a useful partial report and recovery plan rather than a crash.",
    "proof": "Budget stress-test report.",
    "time": "3 h",
    "difficulty": "Security",
    "projects": [
      "P10"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Safety Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/safety-best-practices"
      },
      {
        "label": "OpenAI - Cost Optimization",
        "url": "https://developers.openai.com/api/docs/guides/cost-optimization"
      },
      {
        "label": "Anthropic - Effective Harnesses for Long-Running Agents",
        "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
      }
    ]
  },
  {
    "day": 49,
    "title": "Run a multi-session end-to-end evaluation and ship",
    "about": "Prove the agent resumes, verifies and finishes a real task within budget.",
    "why": "The value of the harness is demonstrated by completion quality and recovery, not by the number of agent messages.",
    "resource": "Long-task evaluation; artifact correctness; restart tests; cost accounting; postmortems.",
    "build": "Execute at least five fresh runs or one substantial multi-session task, measure completion and document failure cases.",
    "doneWhen": "The final artifact passes its tests and every session leaves a valid checkpoint.",
    "proof": "Ship P10; website shows 10/20 projects; publish a long-horizon run report.",
    "time": "1-2 h",
    "difficulty": "Recap",
    "projects": [
      "P10"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "Anthropic - Effective Harnesses for Long-Running Agents",
        "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
      },
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      }
    ]
  },
  {
    "day": 50,
    "title": "From agent loops to Loop Engineering",
    "about": "Define an external engineering contract that controls how an agent repeatedly works toward a verified goal.",
    "why": "A while-loop is not enough. Reliable autonomy requires explicit state, permitted actions, verification, recovery, budgets and terminal conditions around the model.",
    "resource": "Loop contract; state machine; trigger; goal and acceptance criteria; work step; observation; verifier; repair; terminal states; human escalation.",
    "build": "Write a provider-neutral LoopSpec schema and runner skeleton. Model states such as READY, WORKING, VERIFYING, REPAIRING, BLOCKED, SUCCEEDED and BUDGET_EXCEEDED.",
    "doneWhen": "A deterministic fake agent moves through every state and invalid transitions are rejected by tests.",
    "proof": "State diagram, typed LoopSpec and transition test report.",
    "time": "3 h",
    "difficulty": "Core",
    "projects": [
      "P11"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Effective Harnesses for Long-Running Agents",
        "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
      },
      {
        "label": "Anthropic - Building Effective Agents",
        "url": "https://www.anthropic.com/engineering/building-effective-agents"
      },
      {
        "label": "OpenAI Cookbook - Iterative Repair Loops with Codex",
        "url": "https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex"
      }
    ]
  },
  {
    "day": 51,
    "title": "Build a verification ladder and trustworthy success oracle",
    "about": "Prevent the loop from declaring victory based only on the model's opinion.",
    "why": "Autonomous systems frequently stop too early or optimize the wrong signal. External verification is the foundation of dependable loop engineering.",
    "resource": "Format checks; unit and integration tests; browser or environment validation; rubric graders; independent reviewer; human approval; false-positive verifiers.",
    "build": "Create a verifier interface and a ladder that runs cheap deterministic checks first, then targeted model or human review only when needed.",
    "doneWhen": "Three intentionally broken outputs are rejected for the correct reasons and one valid output passes all required gates.",
    "proof": "Verifier matrix showing cost, reliability and failure coverage.",
    "time": "3-4 h",
    "difficulty": "Deep",
    "projects": [
      "P11"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Effective Harnesses for Long-Running Agents",
        "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
      },
      {
        "label": "OpenAI - Evaluate Agent Workflows",
        "url": "https://developers.openai.com/api/docs/guides/agent-evals"
      },
      {
        "label": "pytest - Documentation",
        "url": "https://docs.pytest.org/"
      }
    ]
  },
  {
    "day": 52,
    "title": "Implement repair cycles, retry policy and stopping conditions",
    "about": "Make failures produce bounded corrective work instead of infinite repetition.",
    "why": "A production loop must distinguish transient tool failures, incorrect work, repeated failure and impossible tasks.",
    "resource": "Failure classification; targeted repair prompts; retry backoff; attempt history; no-progress detection; maximum iterations; time/token/cost limits.",
    "build": "Implement WORK -> VERIFY -> DIAGNOSE -> REPAIR transitions. Detect repeated identical failures and stop with a structured blocked report.",
    "doneWhen": "The loop repairs two seeded bugs, survives one transient tool failure and safely stops on an unsatisfiable task.",
    "proof": "Trace comparison for repaired, transient and blocked runs.",
    "time": "3-4 h",
    "difficulty": "Deep",
    "projects": [
      "P11"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI Cookbook - Iterative Repair Loops with Codex",
        "url": "https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex"
      },
      {
        "label": "OpenAI - Production Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/production-best-practices"
      },
      {
        "label": "OpenAI - Cost Optimization",
        "url": "https://developers.openai.com/api/docs/guides/cost-optimization"
      }
    ]
  },
  {
    "day": 53,
    "title": "Add durable state, checkpoints and resumable execution",
    "about": "Allow a loop to survive process restarts and context-window boundaries without losing intent or evidence.",
    "why": "Long-running work is only useful when progress is stored outside the model and every new session can reliably reconstruct state.",
    "resource": "Event sourcing; checkpoint schema; artifact ledger; progress notes; git history; idempotent resumption; compaction versus durable memory.",
    "build": "Persist loop events, current state, verifier results, artifacts and budgets. Kill the process mid-run and resume from the last safe checkpoint.",
    "doneWhen": "The resumed run does not repeat completed actions and produces the same verified result as an uninterrupted run.",
    "proof": "Restart demonstration and event-log replay report.",
    "time": "3-4 h",
    "difficulty": "Deep",
    "projects": [
      "P11"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Effective Harnesses for Long-Running Agents",
        "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
      },
      {
        "label": "OpenAI - Compaction",
        "url": "https://developers.openai.com/api/docs/guides/compaction"
      },
      {
        "label": "OpenAI - Background Mode",
        "url": "https://developers.openai.com/api/docs/guides/background"
      }
    ]
  },
  {
    "day": 54,
    "title": "Parallel and recursive loops with isolated subagents",
    "about": "Use parallelism only when tasks are separable and results can be merged safely.",
    "why": "Subagents can increase coverage but also multiply cost, conflicts and verification complexity. Isolation and explicit merge rules are essential.",
    "resource": "Planner-worker-reviewer pattern; task decomposition; git worktrees; fan-out/fan-in; recursive harnesses; conflict handling; independence assumptions.",
    "build": "Run two isolated workers on separate subtasks in worktrees, then use a verifier/merger to integrate only passing changes.",
    "doneWhen": "Parallel execution produces no shared-state corruption, and a deliberately conflicting change is detected rather than silently merged.",
    "proof": "Worktree diagram, task graph and parallel-versus-serial cost comparison.",
    "time": "4 h",
    "difficulty": "Frontier",
    "projects": [
      "P11"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Subagents",
        "url": "https://learn.chatgpt.com/docs/agent-configuration/subagents"
      },
      {
        "label": "OpenAI - Git Worktrees for Parallel Agent Work",
        "url": "https://learn.chatgpt.com/docs/environments/git-worktrees"
      },
      {
        "label": "Recursive Agent Harnesses (Frontier Research, 2026)",
        "url": "https://arxiv.org/abs/2606.13643"
      }
    ]
  },
  {
    "day": 55,
    "title": "Evaluate loop reliability, efficiency and safety",
    "about": "Measure the whole loop, not only final answer quality.",
    "why": "A loop may succeed while wasting calls, taking unsafe actions or gaming its verifier. Loop-level metrics reveal these failures.",
    "resource": "Task success; verifier precision; iterations to success; no-progress rate; recovery rate; cost per verified task; unsafe-action rate; approval and stop reliability.",
    "build": "Create 20 scenarios including normal, adversarial, impossible and tool-failure cases. Add traces using GenAI semantic conventions and enforce permission/budget guards.",
    "doneWhen": "A report identifies at least one loop-level failure, and a harness change improves a measured metric without breaking the eval gate.",
    "proof": "Loop dashboard and before/after reliability report.",
    "time": "3-4 h",
    "difficulty": "Deep",
    "projects": [
      "P11"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Evaluate Agent Workflows",
        "url": "https://developers.openai.com/api/docs/guides/agent-evals"
      },
      {
        "label": "OpenTelemetry - Generative AI Semantic Conventions",
        "url": "https://opentelemetry.io/docs/specs/semconv/gen-ai/"
      },
      {
        "label": "OWASP - Top 10 for Agentic Applications 2026",
        "url": "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/"
      }
    ]
  },
  {
    "day": 56,
    "title": "Ship the autonomous verification-driven loop",
    "about": "Package Loop Engineering as a reusable system and flagship case study.",
    "why": "This project shows employers that you can design the control system around an agent, not merely call an agent framework.",
    "resource": "Reusable harness APIs; documentation; risk disclosure; demo design; productized reliability evidence.",
    "build": "Apply P11 to a narrow coding or research task. Publish the LoopSpec, runner, state store, verifiers, repair policy, traces, eval suite and safety controls.",
    "doneWhen": "Five fresh tasks run unattended within limits, with successes externally verified and blocked cases clearly reported.",
    "proof": "Ship P11; website shows 11/20 projects; publish a three-minute loop-engineering demo and postmortem.",
    "time": "2 h",
    "difficulty": "Recap",
    "projects": [
      "P11"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "OpenAI Cookbook - Agent Improvement Loop with Traces, Evals and Codex",
        "url": "https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop"
      },
      {
        "label": "OpenAI Cookbook - Iterative Repair Loops with Codex",
        "url": "https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex"
      },
      {
        "label": "Anthropic - Effective Harnesses for Long-Running Agents",
        "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
      }
    ]
  },
  {
    "day": 57,
    "title": "Design a production AI service architecture",
    "about": "Separate API, jobs, data, model providers and observability into clear boundaries.",
    "why": "A production service must remain maintainable when models, prompts and workloads change.",
    "resource": "Service layers; dependency injection; configuration; health/readiness checks; environment separation.",
    "build": "Create a FastAPI service template with routes, services, repositories, model clients and settings modules.",
    "doneWhen": "The app starts with a fake model and all core dependencies can be replaced in tests.",
    "proof": "Architecture diagram and ADRs.",
    "time": "3 h",
    "difficulty": "Production",
    "projects": [
      "P12"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "FastAPI - Documentation",
        "url": "https://fastapi.tiangolo.com/"
      },
      {
        "label": "Pydantic - Documentation",
        "url": "https://docs.pydantic.dev/latest/"
      },
      {
        "label": "OpenAI - Production Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/production-best-practices"
      }
    ]
  },
  {
    "day": 58,
    "title": "Add PostgreSQL persistence and tenant isolation",
    "about": "Store users, jobs, traces and artifacts safely.",
    "why": "AI products are still software products. Data models, migrations and access boundaries matter as much as prompts.",
    "resource": "Relational schemas; migrations; repositories; tenant IDs; row-level access checks.",
    "build": "Model users, projects, runs, traces and files with SQLAlchemy/PostgreSQL and migrations.",
    "doneWhen": "Tests prove one tenant cannot read or mutate another tenant's records.",
    "proof": "Schema diagram and isolation tests.",
    "time": "3-4 h",
    "difficulty": "Production",
    "projects": [
      "P12"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "SQLAlchemy - Documentation",
        "url": "https://docs.sqlalchemy.org/"
      },
      {
        "label": "PostgreSQL - Documentation",
        "url": "https://www.postgresql.org/docs/"
      },
      {
        "label": "pgvector - PostgreSQL Vector Similarity Search",
        "url": "https://github.com/pgvector/pgvector"
      }
    ]
  },
  {
    "day": 59,
    "title": "Add Redis-backed queues, caching and concurrency controls",
    "about": "Handle background ingestion and model work without blocking the API.",
    "why": "Queues and caches protect the service during spikes and make long tasks manageable.",
    "resource": "Job queues; visibility timeouts; deduplication; distributed locks; cache invalidation.",
    "build": "Queue ingestion or evaluation jobs, expose progress, prevent duplicate submissions and cache one expensive result.",
    "doneWhen": "Concurrent duplicate requests create one job and all clients receive the same result.",
    "proof": "Load/concurrency test and queue dashboard.",
    "time": "3 h",
    "difficulty": "Production",
    "projects": [
      "P12"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Redis - Documentation",
        "url": "https://redis.io/docs/latest/"
      },
      {
        "label": "OpenAI - Background Mode",
        "url": "https://developers.openai.com/api/docs/guides/background"
      }
    ]
  },
  {
    "day": 60,
    "title": "Implement authentication, secrets, rate limits and idempotency",
    "about": "Secure the product boundary before deployment.",
    "why": "API keys in code, unlimited endpoints and duplicate writes are common prototype-to-production failures.",
    "resource": "JWT/session auth; secret injection; per-user limits; idempotency keys; safe error messages.",
    "build": "Protect endpoints, add role checks, load secrets from the environment/manager and rate-limit model-heavy routes.",
    "doneWhen": "Security tests cover unauthorized, over-limit and duplicate-write scenarios.",
    "proof": "Threat table and passing auth tests.",
    "time": "3-4 h",
    "difficulty": "Security",
    "projects": [
      "P12"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Production Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/production-best-practices"
      },
      {
        "label": "OpenAI - Workload Identity Federation",
        "url": "https://developers.openai.com/api/docs/guides/workload-identity-federation"
      },
      {
        "label": "OpenAI - Safety Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/safety-best-practices"
      }
    ]
  },
  {
    "day": 61,
    "title": "Containerize the full service",
    "about": "Create a reproducible build that runs the same locally and in staging.",
    "why": "Containers provide a stable unit for deployment, CI and teammate onboarding.",
    "resource": "Dockerfile layers; non-root users; health checks; multi-stage builds; compose.",
    "build": "Create production and development Docker configurations for API, worker, database and Redis.",
    "doneWhen": "A clean machine starts the stack with one command and health checks become ready.",
    "proof": "Container build logs and size/security notes.",
    "time": "3 h",
    "difficulty": "Production",
    "projects": [
      "P12"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Docker - Overview",
        "url": "https://docs.docker.com/get-started/docker-overview/"
      },
      {
        "label": "OpenAI - Deployment Checklist",
        "url": "https://developers.openai.com/api/docs/guides/deployment-checklist"
      }
    ]
  },
  {
    "day": 62,
    "title": "Instrument traces, metrics and logs with open standards",
    "about": "Observe both normal software and AI-specific behavior.",
    "why": "You cannot debug latency, retrieval failures or model cost from final answers alone.",
    "resource": "Trace/span hierarchy; correlation IDs; metrics; structured logs; GenAI semantic conventions.",
    "build": "Instrument HTTP, retrieval, model and tool spans; export to Phoenix or an OTLP-compatible backend.",
    "doneWhen": "One request can be followed end-to-end with latency, tokens, model, cost and errors.",
    "proof": "Trace screenshot and incident-debugging walkthrough.",
    "time": "3 h",
    "difficulty": "Production",
    "projects": [
      "P12"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenTelemetry - Documentation",
        "url": "https://opentelemetry.io/docs/"
      },
      {
        "label": "Arize Phoenix - Documentation",
        "url": "https://arize.com/docs/phoenix"
      }
    ]
  },
  {
    "day": 63,
    "title": "Create CI/CD, staging deployment and a reusable template",
    "about": "Make every future project easier to ship safely.",
    "why": "Automated tests, builds, migrations and deployment are core job skills for an AI engineer.",
    "resource": "Pull-request gates; container registry; environment secrets; migrations; rollback.",
    "build": "Create GitHub Actions for tests/evals/build/deploy, deploy staging and document rollback plus smoke tests.",
    "doneWhen": "A merged change deploys automatically only after software tests and AI evals pass.",
    "proof": "Ship P12; website shows 12/20 projects; release the template for reuse.",
    "time": "2 h",
    "difficulty": "Recap",
    "projects": [
      "P12"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "GitHub Actions - Get Started",
        "url": "https://docs.github.com/en/actions/get-started"
      },
      {
        "label": "OpenAI - Deployment Checklist",
        "url": "https://developers.openai.com/api/docs/guides/deployment-checklist"
      },
      {
        "label": "OpenAI - Workload Identity Federation",
        "url": "https://developers.openai.com/api/docs/guides/workload-identity-federation"
      }
    ]
  },
  {
    "day": 64,
    "title": "Choose OCR, parsing or vision for each document type",
    "about": "Build a decision framework for multimodal ingestion.",
    "why": "Sending every page to a vision model is expensive and may lose structure; OCR alone may miss layout and meaning.",
    "resource": "Native text extraction; OCR; vision-language models; page rendering; routing.",
    "build": "Test three ingestion approaches on text PDFs, scans, tables and forms; record accuracy, cost and latency.",
    "doneWhen": "A router selects the cheapest approach that meets field-level accuracy targets.",
    "proof": "Multimodal ingestion decision matrix.",
    "time": "3 h",
    "difficulty": "Core",
    "projects": [
      "P13"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Images and Vision",
        "url": "https://developers.openai.com/api/docs/guides/images-vision"
      },
      {
        "label": "OpenAI - File Inputs",
        "url": "https://developers.openai.com/api/docs/guides/file-inputs"
      },
      {
        "label": "OpenAI - Cost Optimization",
        "url": "https://developers.openai.com/api/docs/guides/cost-optimization"
      }
    ]
  },
  {
    "day": 65,
    "title": "Extract tables, forms and spatial relationships",
    "about": "Preserve layout information that ordinary text extraction destroys.",
    "why": "Business documents often encode meaning through columns, boxes, labels and page position.",
    "resource": "Bounding boxes; table schemas; cell relationships; page coordinates; provenance.",
    "build": "Extract one table and one form into typed schemas with page numbers and evidence crops or coordinates.",
    "doneWhen": "Rows/fields are validated and reviewers can locate every extracted value in the source.",
    "proof": "Field-level accuracy report and visual evidence viewer.",
    "time": "3-4 h",
    "difficulty": "Deep",
    "projects": [
      "P13"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Images and Vision",
        "url": "https://developers.openai.com/api/docs/guides/images-vision"
      },
      {
        "label": "Pydantic - Documentation",
        "url": "https://docs.pydantic.dev/latest/"
      }
    ]
  },
  {
    "day": 66,
    "title": "Create multimodal retrieval over text and images",
    "about": "Retrieve useful pages, figures and text chunks for questions.",
    "why": "Some answers live in diagrams or screenshots, not the extracted text stream.",
    "resource": "Page-level embeddings; captions; modality metadata; image-text retrieval; late fusion.",
    "build": "Index page text, generated figure descriptions and image/page identifiers; retrieve across modalities.",
    "doneWhen": "The evaluation set contains image-dependent questions and measures whether the correct page/figure is retrieved.",
    "proof": "Multimodal retrieval demo and metrics.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P13"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Images and Vision",
        "url": "https://developers.openai.com/api/docs/guides/images-vision"
      },
      {
        "label": "OpenAI - Retrieval",
        "url": "https://developers.openai.com/api/docs/guides/retrieval"
      },
      {
        "label": "Anthropic - Contextual Retrieval",
        "url": "https://www.anthropic.com/engineering/contextual-retrieval"
      }
    ]
  },
  {
    "day": 67,
    "title": "Evaluate multimodal reasoning and extraction",
    "about": "Separate perception failures from reasoning and answer failures.",
    "why": "A final wrong answer may come from unread text, missed layout, bad retrieval or faulty synthesis.",
    "resource": "Field accuracy; page recall; evidence validity; visual question answering evals; error decomposition.",
    "build": "Create 30 labeled cases and evaluators for extraction, retrieval and final answer stages.",
    "doneWhen": "Every failure is assigned to a specific pipeline component with examples.",
    "proof": "Multimodal failure taxonomy and benchmark.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P13"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      },
      {
        "label": "Hamel Husain - Your AI Product Needs Evals",
        "url": "https://hamel.dev/blog/posts/evals/"
      }
    ]
  },
  {
    "day": 68,
    "title": "Build a sandboxed computer-use task",
    "about": "Learn the interface, safety boundaries and verification needs of GUI agents.",
    "why": "Computer use can handle systems without APIs, but visual ambiguity and irreversible actions make it high risk.",
    "resource": "Screenshot-action loops; coordinate grounding; sandboxing; approval; visual verification.",
    "build": "Automate a harmless local or test-site task. Require confirmation before final submission and capture screenshots at each step.",
    "doneWhen": "The agent completes the task repeatedly without leaving the sandbox or clicking prohibited controls.",
    "proof": "Recorded run and safety checklist.",
    "time": "3 h",
    "difficulty": "Experimental",
    "projects": [
      "P13"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Computer Use",
        "url": "https://developers.openai.com/api/docs/guides/tools-computer-use"
      },
      {
        "label": "OpenAI - Safety Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/safety-best-practices"
      }
    ]
  },
  {
    "day": 69,
    "title": "Integrate the multimodal assistant into a usable application",
    "about": "Combine ingestion, extraction, retrieval and question answering.",
    "why": "A cohesive product demonstrates system design beyond isolated model calls.",
    "resource": "Upload workflows; status events; evidence panels; correction feedback; user experience.",
    "build": "Create an app where users upload documents, review extracted data, ask questions and open cited pages/figures.",
    "doneWhen": "The complete path works for at least three document families and retains trace/eval metadata.",
    "proof": "Public or local demo with architecture diagram.",
    "time": "4 h",
    "difficulty": "Ship",
    "projects": [
      "P13"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "FastAPI - Documentation",
        "url": "https://fastapi.tiangolo.com/"
      },
      {
        "label": "OpenAI - Images and Vision",
        "url": "https://developers.openai.com/api/docs/guides/images-vision"
      },
      {
        "label": "Arize Phoenix - Documentation",
        "url": "https://arize.com/docs/phoenix"
      }
    ]
  },
  {
    "day": 70,
    "title": "Ship the multimodal document intelligence case study",
    "about": "Package accuracy, safety, cost and limitations honestly.",
    "why": "Multimodal demos look impressive, but engineering credibility comes from measured failure analysis.",
    "resource": "Per-document metrics; human review policy; privacy; cost reporting.",
    "build": "Publish a case study with dataset, evaluation, examples, architecture, human-review thresholds and known failure modes.",
    "doneWhen": "A reviewer can reproduce the benchmark and understand when the system abstains.",
    "proof": "Ship P13; website shows 13/20 projects.",
    "time": "1-2 h",
    "difficulty": "Recap",
    "projects": [
      "P13"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "OpenAI - Deployment Checklist",
        "url": "https://developers.openai.com/api/docs/guides/deployment-checklist"
      },
      {
        "label": "OpenAI - Safety Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/safety-best-practices"
      }
    ]
  },
  {
    "day": 71,
    "title": "Design realtime voice architecture and choose a transport",
    "about": "Understand browser, server and telephony paths before coding.",
    "why": "Voice systems are event-driven and latency-sensitive; the correct transport depends on client and control requirements.",
    "resource": "WebRTC; WebSocket; SIP; ephemeral credentials; media path; server-side controls.",
    "build": "Draw architectures for browser assistant, server-controlled voice and phone agent, then choose one for P14.",
    "doneWhen": "The decision memo explains latency, security, deployment and tool-call implications.",
    "proof": "Voice architecture diagram.",
    "time": "2-3 h",
    "difficulty": "Core",
    "projects": [
      "P14"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Realtime and Audio",
        "url": "https://developers.openai.com/api/docs/guides/realtime"
      },
      {
        "label": "OpenAI Agents SDK - Voice Agents",
        "url": "https://openai.github.io/openai-agents-python/voice/quickstart/"
      }
    ]
  },
  {
    "day": 72,
    "title": "Open a realtime session and stream audio events",
    "about": "Create the smallest working speech-to-speech loop.",
    "why": "Understanding session events and audio flow is necessary before adding tools and complex prompts.",
    "resource": "Session configuration; audio formats; event lifecycle; client/server messages; ephemeral tokens.",
    "build": "Connect through WebRTC or WebSocket, stream microphone audio and render model audio plus transcripts.",
    "doneWhen": "A five-minute conversation runs without reconnecting or leaking the permanent API key to the browser.",
    "proof": "Event log and basic conversation demo.",
    "time": "3 h",
    "difficulty": "Core",
    "projects": [
      "P14"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Realtime and Audio",
        "url": "https://developers.openai.com/api/docs/guides/realtime"
      },
      {
        "label": "OpenAI - Production Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/production-best-practices"
      }
    ]
  },
  {
    "day": 73,
    "title": "Handle turn detection, interruptions and latency",
    "about": "Make the conversation feel responsive instead of sequential and robotic.",
    "why": "Voice UX depends on interruption, barge-in, silence handling and time to first audio.",
    "resource": "Voice activity detection; turn boundaries; cancellation; buffering; latency measurement.",
    "build": "Support interruption, cancel pending audio, tune VAD and log time to first audio plus end-to-end turn latency.",
    "doneWhen": "Users can interrupt naturally and the agent stops old audio before responding.",
    "proof": "Latency dashboard and interruption test video.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P14"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Realtime and Audio",
        "url": "https://developers.openai.com/api/docs/guides/realtime"
      },
      {
        "label": "OpenTelemetry - Documentation",
        "url": "https://opentelemetry.io/docs/"
      }
    ]
  },
  {
    "day": 74,
    "title": "Add safe tool calls during a live conversation",
    "about": "Let voice trigger useful business actions without losing conversational state.",
    "why": "The real value of voice agents comes from accessing live data and taking controlled actions.",
    "resource": "Realtime tool events; server execution; confirmation language; read versus write tools.",
    "build": "Add one live lookup and one write action that requires spoken confirmation plus server-side approval.",
    "doneWhen": "The result is spoken accurately and the write cannot happen from an ambiguous utterance.",
    "proof": "Tool-call trace synchronized with audio transcript.",
    "time": "3-4 h",
    "difficulty": "Deep",
    "projects": [
      "P14"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Realtime and Audio",
        "url": "https://developers.openai.com/api/docs/guides/realtime"
      },
      {
        "label": "OpenAI - Function Calling",
        "url": "https://developers.openai.com/api/docs/guides/function-calling"
      },
      {
        "label": "OpenAI - Safety Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/safety-best-practices"
      }
    ]
  },
  {
    "day": 75,
    "title": "Design bilingual Urdu-English conversations",
    "about": "Handle code-switching, names, numbers and clarification naturally.",
    "why": "Bilingual voice is locally valuable and exposes real challenges in transcription, pronunciation and entity capture.",
    "resource": "Language switching; pronunciation hints; entity confirmation; numbers/dates; transcript normalization.",
    "build": "Create 30 bilingual scenarios for appointments, support or lead qualification. Add explicit confirmation for critical entities.",
    "doneWhen": "The agent captures names, dates and phone numbers at the required accuracy and asks when uncertain.",
    "proof": "Bilingual scenario set and error clips.",
    "time": "3 h",
    "difficulty": "Specialized",
    "projects": [
      "P14"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Realtime and Audio",
        "url": "https://developers.openai.com/api/docs/guides/realtime"
      },
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      }
    ]
  },
  {
    "day": 76,
    "title": "Evaluate voice quality, task success and safety",
    "about": "Measure the conversation as a system, not only transcript accuracy.",
    "why": "A low word-error rate does not guarantee successful, safe or pleasant task completion.",
    "resource": "Task success; latency; interruption recovery; entity accuracy; escalation; unsafe-action rate.",
    "build": "Run scripted and human calls, label outcomes and create a dashboard for task success and latency percentiles.",
    "doneWhen": "The top three failure modes are reproduced and at least one is fixed with a regression test.",
    "proof": "Voice evaluation report and test audio set.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P14"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      },
      {
        "label": "OpenAI - Realtime and Audio",
        "url": "https://developers.openai.com/api/docs/guides/realtime"
      },
      {
        "label": "OpenAI - Safety Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/safety-best-practices"
      }
    ]
  },
  {
    "day": 77,
    "title": "Deploy and ship the realtime voice agent",
    "about": "Create a polished voice demo with a narrow business purpose.",
    "why": "A deployed, evaluated voice workflow is a strong differentiator for integration and agent roles.",
    "resource": "Session security; cost limits; fallback UX; production monitoring; consent disclosure.",
    "build": "Deploy the client/server, add usage caps, error fallback and a visible transcript/tool panel.",
    "doneWhen": "A new user can complete the target task while all tool actions and latency are traceable.",
    "proof": "Ship P14; website shows 14/20 projects; publish the demo and metrics.",
    "time": "2 h",
    "difficulty": "Recap",
    "projects": [
      "P14"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "OpenAI - Realtime and Audio",
        "url": "https://developers.openai.com/api/docs/guides/realtime"
      },
      {
        "label": "OpenAI - Deployment Checklist",
        "url": "https://developers.openai.com/api/docs/guides/deployment-checklist"
      },
      {
        "label": "OpenTelemetry - Documentation",
        "url": "https://opentelemetry.io/docs/"
      }
    ]
  },
  {
    "day": 78,
    "title": "Select an open model using task evidence and license constraints",
    "about": "Avoid choosing models by hype or benchmark headlines alone.",
    "why": "Deployment depends on task quality, context, hardware, license, memory and throughput.",
    "resource": "Model cards; licenses; parameter count; context; instruction tuning; task benchmarks.",
    "build": "Shortlist three models for one task, run a small evaluation and document hardware/licensing constraints.",
    "doneWhen": "One model is selected with a defensible quality-cost-operability decision.",
    "proof": "Model selection scorecard.",
    "time": "2-3 h",
    "difficulty": "Core",
    "projects": [
      "P15"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Model Optimization",
        "url": "https://developers.openai.com/api/docs/guides/model-optimization"
      },
      {
        "label": "vLLM - Documentation",
        "url": "https://docs.vllm.ai/en/latest/"
      }
    ]
  },
  {
    "day": 79,
    "title": "Run local inference and establish a baseline",
    "about": "Understand tokenizer, chat template, generation settings and memory use.",
    "why": "Self-hosted behavior is shaped by configuration; a working prompt on one server may fail on another.",
    "resource": "Chat templates; sampling; KV cache; device placement; memory footprint; throughput.",
    "build": "Run the selected model locally or on a hosted GPU, log memory, tokens/sec, latency and quality on the eval set.",
    "doneWhen": "The baseline can be reproduced from a pinned environment and command.",
    "proof": "Inference benchmark and configuration file.",
    "time": "3 h",
    "difficulty": "Systems",
    "projects": [
      "P15"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "vLLM - Documentation",
        "url": "https://docs.vllm.ai/en/latest/"
      },
      {
        "label": "Hugging Face - bitsandbytes Quantization",
        "url": "https://huggingface.co/docs/transformers/quantization/bitsandbytes"
      }
    ]
  },
  {
    "day": 80,
    "title": "Quantize to 8-bit and 4-bit and measure the trade-off",
    "about": "Reduce memory while checking quality and speed rather than assuming success.",
    "why": "Quantization makes models accessible on smaller hardware but can affect output and kernel performance.",
    "resource": "8-bit; 4-bit/NF4; compute dtype; offloading; memory measurement.",
    "build": "Load two quantized variants, compare memory, latency and evaluation quality against baseline.",
    "doneWhen": "A recommendation states which configuration is acceptable for the target workload.",
    "proof": "Quantization comparison table.",
    "time": "3-4 h",
    "difficulty": "Systems",
    "projects": [
      "P15"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Hugging Face - bitsandbytes Quantization",
        "url": "https://huggingface.co/docs/transformers/quantization/bitsandbytes"
      },
      {
        "label": "vLLM - Documentation",
        "url": "https://docs.vllm.ai/en/latest/"
      }
    ]
  },
  {
    "day": 81,
    "title": "Create and validate a supervised fine-tuning dataset",
    "about": "Learn that data quality and coverage dominate the fine-tuning workload.",
    "why": "Fine-tuning is useful for behavior, style and task format, while retrieval supplies external facts.",
    "resource": "SFT examples; chat templates; train/dev/test splits; deduplication; leakage; synthetic data filtering.",
    "build": "Curate 200-500 examples for one narrow behavior using failures from prior evals. Validate schema and manually inspect samples.",
    "doneWhen": "The dataset has documented coverage, exclusions and a fixed held-out test set.",
    "proof": "Dataset card and quality checks.",
    "time": "3 h",
    "difficulty": "Data",
    "projects": [
      "P15"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Model Optimization",
        "url": "https://developers.openai.com/api/docs/guides/model-optimization"
      },
      {
        "label": "Hugging Face - TRL",
        "url": "https://huggingface.co/docs/trl/index"
      },
      {
        "label": "Hamel Husain - Your AI Product Needs Evals",
        "url": "https://hamel.dev/blog/posts/evals/"
      }
    ]
  },
  {
    "day": 82,
    "title": "Run a PEFT LoRA or QLoRA experiment",
    "about": "Adapt a small model without full-parameter training.",
    "why": "Parameter-efficient fine-tuning reduces compute and storage while teaching the practical post-training workflow.",
    "resource": "LoRA rank; adapters; QLoRA; training curves; overfitting; checkpoints.",
    "build": "Train an adapter on the narrow dataset or complete a hosted fallback lab if hardware is limited.",
    "doneWhen": "The adapter is evaluated against the untouched test set and compared to prompt-only baseline.",
    "proof": "Training config, curves, adapter and evaluation report.",
    "time": "4 h",
    "difficulty": "GPU Lab",
    "projects": [
      "P15"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Hugging Face - PEFT",
        "url": "https://huggingface.co/docs/peft/index"
      },
      {
        "label": "Hugging Face - TRL",
        "url": "https://huggingface.co/docs/trl/index"
      },
      {
        "label": "Hugging Face - bitsandbytes Quantization",
        "url": "https://huggingface.co/docs/transformers/quantization/bitsandbytes"
      }
    ]
  },
  {
    "day": 83,
    "title": "Serve the model with an OpenAI-compatible vLLM endpoint",
    "about": "Expose the open model through a production-style API.",
    "why": "Serving teaches batching, concurrency, throughput and compatibility with existing clients.",
    "resource": "Continuous batching; tensor parallelism; OpenAI-compatible endpoints; concurrency; load testing.",
    "build": "Start vLLM, call it through your P1 provider adapter and benchmark concurrency and tokens/sec.",
    "doneWhen": "The service handles the chosen load and returns traceable usage/latency data.",
    "proof": "Load-test chart and deployment configuration.",
    "time": "3-4 h",
    "difficulty": "Systems",
    "projects": [
      "P15"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "vLLM - Documentation",
        "url": "https://docs.vllm.ai/en/latest/"
      },
      {
        "label": "OpenTelemetry - Documentation",
        "url": "https://opentelemetry.io/docs/"
      }
    ]
  },
  {
    "day": 84,
    "title": "Compare hosted, quantized and tuned models and ship the lab",
    "about": "Make a model strategy decision for a real workload.",
    "why": "AI engineers must know when self-hosting or tuning creates value and when a hosted API is simpler and cheaper.",
    "resource": "Total cost of ownership; quality per dollar; operations burden; privacy; scale.",
    "build": "Compare the hosted baseline, open model, quantized variant and adapter on quality, latency, cost and maintenance.",
    "doneWhen": "The report includes a clear recommendation at low, medium and high request volume.",
    "proof": "Ship P15; website shows 15/20 projects; publish the model strategy report.",
    "time": "1-2 h",
    "difficulty": "Recap",
    "projects": [
      "P15"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "OpenAI - Model Optimization",
        "url": "https://developers.openai.com/api/docs/guides/model-optimization"
      },
      {
        "label": "vLLM - Documentation",
        "url": "https://docs.vllm.ai/en/latest/"
      },
      {
        "label": "OpenAI - Cost Optimization",
        "url": "https://developers.openai.com/api/docs/guides/cost-optimization"
      }
    ]
  },
  {
    "day": 85,
    "title": "Understand MCP architecture and build a local server",
    "about": "Standardize how an AI client discovers and calls your tools and data.",
    "why": "MCP reduces custom integration glue and is supported across multiple AI clients and developer tools.",
    "resource": "Host; client; server; tools; resources; prompts; JSON-RPC lifecycle; stdio.",
    "build": "Create a local MCP server exposing one read-only tool over a small business database.",
    "doneWhen": "The MCP Inspector or a client discovers the server and successfully calls the tool.",
    "proof": "Architecture diagram and local call trace.",
    "time": "3 h",
    "difficulty": "Protocol",
    "projects": [
      "P16"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Model Context Protocol - Introduction",
        "url": "https://modelcontextprotocol.io/docs/getting-started/intro"
      },
      {
        "label": "MCP - Build a Server",
        "url": "https://modelcontextprotocol.io/docs/develop/build-server"
      }
    ]
  },
  {
    "day": 86,
    "title": "Design MCP tools, resources and prompts for a real domain",
    "about": "Expose the right contracts rather than converting every database function into a tool.",
    "why": "Good MCP servers have minimal, clear capabilities and safe data boundaries.",
    "resource": "Tool versus resource; read/write separation; namespacing; pagination; compact responses.",
    "build": "Add search, get and one controlled update tool; add a read-only resource and reusable prompt template.",
    "doneWhen": "Tool-selection tests show the client chooses the intended capability with minimal ambiguity.",
    "proof": "MCP capability catalog and eval tasks.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P16"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Writing Effective Tools for Agents",
        "url": "https://www.anthropic.com/engineering/writing-tools-for-agents"
      },
      {
        "label": "Model Context Protocol - Introduction",
        "url": "https://modelcontextprotocol.io/docs/getting-started/intro"
      },
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      }
    ]
  },
  {
    "day": 87,
    "title": "Move MCP to Streamable HTTP with authentication",
    "about": "Learn the current remote transport and its security requirements.",
    "why": "Remote MCP introduces origin, authentication, session and authorization risks absent from a local stdio demo.",
    "resource": "Streamable HTTP; Origin validation; session IDs; protocol versions; OAuth/resource authorization; localhost safety.",
    "build": "Serve one remote MCP endpoint, validate origins, authenticate clients and enforce tenant/resource scopes.",
    "doneWhen": "Unauthorized, wrong-origin and cross-tenant calls fail; valid sessions can resume safely.",
    "proof": "Security tests and sequence diagram.",
    "time": "3-4 h",
    "difficulty": "Security",
    "projects": [
      "P16"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "MCP - Current Streamable HTTP Transport Specification",
        "url": "https://modelcontextprotocol.io/specification/2025-11-25/basic/transports"
      },
      {
        "label": "OpenAI - Safety Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/safety-best-practices"
      },
      {
        "label": "OpenAI - Workload Identity Federation",
        "url": "https://developers.openai.com/api/docs/guides/workload-identity-federation"
      }
    ]
  },
  {
    "day": 88,
    "title": "Connect a real client, evaluate tool use and ship the MCP server",
    "about": "Demonstrate interoperability beyond your own custom client.",
    "why": "The point of a protocol is to work across clients while preserving security and semantics.",
    "resource": "Client configuration; server metadata; tool-use evals; error handling; version compatibility.",
    "build": "Connect an MCP-capable client or Responses-based app, run 30 tasks and measure tool selection plus task success.",
    "doneWhen": "P16 works end-to-end with a real client and has an eval/security report.",
    "proof": "Ship P16; website shows 16/20 projects.",
    "time": "2 h",
    "difficulty": "Ship",
    "projects": [
      "P16"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - MCP and Connectors",
        "url": "https://developers.openai.com/api/docs/guides/tools-connectors-mcp"
      },
      {
        "label": "Model Context Protocol - Introduction",
        "url": "https://modelcontextprotocol.io/docs/getting-started/intro"
      },
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      }
    ]
  },
  {
    "day": 89,
    "title": "Understand A2A agent cards, tasks, messages and artifacts",
    "about": "Separate agent-to-agent communication from agent-to-tool access.",
    "why": "A2A complements MCP by letting independent agents discover capabilities and delegate work without sharing internals.",
    "resource": "Agent cards; discovery; tasks; messages; parts; artifacts; streaming; opaque agents.",
    "build": "Define two specialized agents and publish valid agent cards with skills, input/output modes and endpoints.",
    "doneWhen": "A client can discover both agents and select the correct one from metadata.",
    "proof": "MCP-vs-A2A comparison and agent cards.",
    "time": "2-3 h",
    "difficulty": "Protocol",
    "projects": [
      "P17"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "A2A Protocol - Official Documentation",
        "url": "https://a2a-protocol.org/latest/"
      },
      {
        "label": "Model Context Protocol - Introduction",
        "url": "https://modelcontextprotocol.io/docs/getting-started/intro"
      }
    ]
  },
  {
    "day": 90,
    "title": "Build cross-agent delegation and streamed artifacts",
    "about": "Let one agent delegate a bounded task to another and consume the result.",
    "why": "Interoperability matters when agents are owned by different teams, frameworks or vendors.",
    "resource": "Task lifecycle; delegation; streaming updates; artifact contracts; failure propagation.",
    "build": "Create a coordinator agent and a specialist agent using different internal implementations. Delegate one task and stream progress/artifacts.",
    "doneWhen": "The coordinator handles success, failure and cancellation without knowing the specialist's internal tools.",
    "proof": "A2A trace and framework-independence demo.",
    "time": "3-4 h",
    "difficulty": "Deep",
    "projects": [
      "P17"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "A2A Protocol - Official Documentation",
        "url": "https://a2a-protocol.org/latest/"
      },
      {
        "label": "OpenAI Agents SDK - Python",
        "url": "https://openai.github.io/openai-agents-python/"
      },
      {
        "label": "LangGraph - Documentation",
        "url": "https://docs.langchain.com/oss/python/langgraph/overview"
      }
    ]
  },
  {
    "day": 91,
    "title": "Evaluate delegation value and ship the agent network",
    "about": "Prove that multiple agents improve the target task enough to justify complexity.",
    "why": "Multi-agent architecture can add latency, cost and failure points. It should be evidence-driven.",
    "resource": "Delegation accuracy; artifact validity; latency/cost overhead; fallback to single agent.",
    "build": "Compare single-agent and delegated runs on a test set, add a fallback and document the break-even point.",
    "doneWhen": "P17 clearly states when A2A is useful and when the coordinator should work alone.",
    "proof": "Ship P17; website shows 17/20 projects; publish the interoperability demo.",
    "time": "1-2 h",
    "difficulty": "Recap",
    "projects": [
      "P17"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "A2A Protocol - Official Documentation",
        "url": "https://a2a-protocol.org/latest/"
      },
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      }
    ]
  },
  {
    "day": 92,
    "title": "Threat-model the complete AI stack",
    "about": "Map assets, trust boundaries, attackers and controls before running scanners.",
    "why": "AI risk includes prompts, retrieved data, tool permissions, memory, models, dependencies and normal web security.",
    "resource": "Threat modeling; OWASP LLM risks; trust boundaries; abuse cases; severity.",
    "build": "Create a data-flow diagram and risk register for P9/P16 or the capstone architecture.",
    "doneWhen": "Every external input and privileged action has an owner, threat and planned control.",
    "proof": "Threat model committed to P18.",
    "time": "3 h",
    "difficulty": "Security",
    "projects": [
      "P18"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OWASP - Top 10 for LLM Applications",
        "url": "https://genai.owasp.org/llm-top-10/"
      },
      {
        "label": "OpenAI - Safety Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/safety-best-practices"
      }
    ]
  },
  {
    "day": 93,
    "title": "Attack direct and indirect prompt injection paths",
    "about": "Reproduce attacks through user prompts and untrusted retrieved content.",
    "why": "Instructions hidden in documents, pages or tool results can hijack model behavior if data and authority are not separated.",
    "resource": "Direct injection; indirect injection; instruction hierarchy; data/instruction separation; canary secrets.",
    "build": "Create at least 15 attacks against RAG and agent paths, including malicious documents and tool outputs.",
    "doneWhen": "Successful attacks are reproducible with trace IDs and impact descriptions.",
    "proof": "Attack corpus and evidence report.",
    "time": "3 h",
    "difficulty": "Offensive",
    "projects": [
      "P18"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OWASP - Top 10 for LLM Applications",
        "url": "https://genai.owasp.org/llm-top-10/"
      },
      {
        "label": "Promptfoo - LLM Red Teaming",
        "url": "https://www.promptfoo.dev/docs/red-team/"
      }
    ]
  },
  {
    "day": 94,
    "title": "Test tool misuse, excessive agency and privilege boundaries",
    "about": "See whether the model can perform actions beyond user intent.",
    "why": "The most dangerous failures occur when a manipulated model has broad write permissions.",
    "resource": "Least privilege; scoped credentials; read/write separation; approval; transaction limits.",
    "build": "Attempt cross-tenant reads, unauthorized updates, parameter smuggling and repeated actions. Add policy enforcement outside the model.",
    "doneWhen": "The agent cannot exceed its scoped identity even when explicitly instructed.",
    "proof": "Permission matrix and blocked attack traces.",
    "time": "3-4 h",
    "difficulty": "Security",
    "projects": [
      "P18"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Safety Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/safety-best-practices"
      },
      {
        "label": "MCP - Current Streamable HTTP Transport Specification",
        "url": "https://modelcontextprotocol.io/specification/2025-11-25/basic/transports"
      },
      {
        "label": "OpenAI - Workload Identity Federation",
        "url": "https://developers.openai.com/api/docs/guides/workload-identity-federation"
      }
    ]
  },
  {
    "day": 95,
    "title": "Test memory poisoning, data exfiltration and dependency risks",
    "about": "Attack long-lived state and the software supply chain.",
    "why": "Malicious memories, poisoned documents or compromised tools can persist beyond one conversation.",
    "resource": "Memory provenance; TTL; write validation; PII leakage; dependency pinning; secret scanning.",
    "build": "Insert poisoned memories/documents, attempt secret extraction and audit dependencies plus environment configuration.",
    "doneWhen": "Memory writes have provenance/approval and secrets never appear in model-visible context or logs.",
    "proof": "Persistence-risk report and remediation commits.",
    "time": "3 h",
    "difficulty": "Security",
    "projects": [
      "P18"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OWASP - Top 10 for LLM Applications",
        "url": "https://genai.owasp.org/llm-top-10/"
      },
      {
        "label": "OpenAI - Safety Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/safety-best-practices"
      },
      {
        "label": "OpenAI - Production Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/production-best-practices"
      }
    ]
  },
  {
    "day": 96,
    "title": "Automate red teaming with promptfoo, garak and PyRIT",
    "about": "Use multiple tools while keeping human triage and task-specific tests central.",
    "why": "Scanners broaden coverage, but findings still require validation and prioritization.",
    "resource": "Attack generation; plugins/probes; multi-turn attacks; false positives; reproducibility.",
    "build": "Run promptfoo plus one of garak/PyRIT, normalize findings and map them to the threat model.",
    "doneWhen": "Every high-severity finding has a reproducible test, owner and disposition.",
    "proof": "Scanner comparison and prioritized backlog.",
    "time": "3-4 h",
    "difficulty": "Offensive",
    "projects": [
      "P18"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Promptfoo - LLM Red Teaming",
        "url": "https://www.promptfoo.dev/docs/red-team/"
      },
      {
        "label": "NVIDIA garak - LLM Vulnerability Scanner",
        "url": "https://github.com/NVIDIA/garak"
      },
      {
        "label": "Microsoft PyRIT - AI Red Teaming Framework",
        "url": "https://github.com/Azure/PyRIT"
      }
    ]
  },
  {
    "day": 97,
    "title": "Implement layered guardrails and security regression CI",
    "about": "Fix the system with permissions, validation and architecture - not only another prompt.",
    "why": "Prompt-only defenses are fragile. Security should be enforced at data, tool, identity and output boundaries.",
    "resource": "Input screening; output validation; tool policies; isolation; human approval; regression suites.",
    "build": "Patch the top attacks, create deterministic and adversarial regression tests, and run them on every pull request.",
    "doneWhen": "Previously successful attacks fail for the intended architectural reason and normal tasks still pass.",
    "proof": "Security gate screenshot and control map.",
    "time": "3-4 h",
    "difficulty": "Ship",
    "projects": [
      "P18"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Safety Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/safety-best-practices"
      },
      {
        "label": "Promptfoo - LLM Red Teaming",
        "url": "https://www.promptfoo.dev/docs/red-team/"
      },
      {
        "label": "GitHub Actions - Get Started",
        "url": "https://docs.github.com/en/actions/get-started"
      }
    ]
  },
  {
    "day": 98,
    "title": "Publish the AI security audit and reusable guardrails kit",
    "about": "Turn security work into a repeatable portfolio and consulting asset.",
    "why": "A clear found-fixed-remaining report demonstrates responsible engineering better than claiming a system is secure.",
    "resource": "Security reporting; residual risk; severity; reproducible evidence; remediation verification.",
    "build": "Package threat templates, attack datasets, CI configs, control library and a case study.",
    "doneWhen": "Another AI project can adopt the kit and run the baseline security suite.",
    "proof": "Ship P18; website shows 18/20 projects; publish the audit report.",
    "time": "1-2 h",
    "difficulty": "Recap",
    "projects": [
      "P18"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "OWASP - Top 10 for LLM Applications",
        "url": "https://genai.owasp.org/llm-top-10/"
      },
      {
        "label": "Promptfoo - LLM Red Teaming",
        "url": "https://www.promptfoo.dev/docs/red-team/"
      },
      {
        "label": "NVIDIA garak - LLM Vulnerability Scanner",
        "url": "https://github.com/NVIDIA/garak"
      }
    ]
  },
  {
    "day": 99,
    "title": "Turn production traces into an agent-improvement dataset",
    "about": "Create the evidence base for improving a harness from real behavior rather than intuition.",
    "why": "The most durable 2026 skill is running a closed improvement loop: observe, label, evaluate, change the harness and verify the result.",
    "resource": "Trace sampling; human feedback; model-assisted critique; issue taxonomy; privacy and redaction; representative datasets.",
    "build": "Collect 30-50 traces from P9, P10 or P11, add structured human feedback and label the first consequential failure in each bad run.",
    "doneWhen": "The dataset covers successful, failed, expensive, unsafe and ambiguous runs with reviewer agreement checks.",
    "proof": "Versioned improvement dataset and ranked failure table.",
    "time": "3 h",
    "difficulty": "Core",
    "projects": [
      "P19"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI Cookbook - Agent Improvement Loop with Traces, Evals and Codex",
        "url": "https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop"
      },
      {
        "label": "Hamel Husain - Your AI Product Needs Evals",
        "url": "https://hamel.dev/blog/posts/evals/"
      },
      {
        "label": "OpenAI - Evaluate Agent Workflows",
        "url": "https://developers.openai.com/api/docs/guides/agent-evals"
      }
    ]
  },
  {
    "day": 100,
    "title": "Convert feedback into reusable evals and ranked harness changes",
    "about": "Transform comments into executable tests and a prioritized engineering backlog.",
    "why": "Feedback disappears unless it becomes a regression test. Evals let every future harness change be judged against the same evidence.",
    "resource": "Feedback-to-eval conversion; severity and frequency; expected-behavior specs; impact/effort ranking; change hypotheses.",
    "build": "Generate deterministic and model-based evaluators from the labeled traces, then produce a ranked harness-change document with evidence for each recommendation.",
    "doneWhen": "At least ten new eval cases fail on the current harness for understood reasons and each proposed change maps to a failure cluster.",
    "proof": "Eval suite plus evidence-linked improvement backlog.",
    "time": "3-4 h",
    "difficulty": "Deep",
    "projects": [
      "P19"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI Cookbook - Agent Improvement Loop with Traces, Evals and Codex",
        "url": "https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop"
      },
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      },
      {
        "label": "Hamel Husain - Your AI Product Needs Evals",
        "url": "https://hamel.dev/blog/posts/evals/"
      }
    ]
  },
  {
    "day": 101,
    "title": "Run an iterative repair loop in an isolated worktree",
    "about": "Let a coding agent propose and repair a harness change without risking the main branch.",
    "why": "AI-native engineering needs isolation, reproducibility and review, not direct uncontrolled edits to production code.",
    "resource": "Worktree isolation; patch generation; test-repair cycles; diff review; merge gates; rollback.",
    "build": "Give the improvement backlog to a coding agent in a worktree. Let it implement one change, run tests/evals, repair failures and produce a reviewable patch.",
    "doneWhen": "The main branch remains untouched until the patch passes software tests, AI evals and human diff review.",
    "proof": "Before/after diff, repair trace and merge decision record.",
    "time": "4 h",
    "difficulty": "Frontier",
    "projects": [
      "P19"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI Cookbook - Iterative Repair Loops with Codex",
        "url": "https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex"
      },
      {
        "label": "OpenAI - Git Worktrees for Parallel Agent Work",
        "url": "https://learn.chatgpt.com/docs/environments/git-worktrees"
      },
      {
        "label": "GitHub Actions - Get Started",
        "url": "https://docs.github.com/en/actions/get-started"
      }
    ]
  },
  {
    "day": 102,
    "title": "Record and replay tool interactions for deterministic debugging",
    "about": "Reproduce expensive or flaky agent runs without repeatedly calling live systems.",
    "why": "Record/replay makes failures debuggable, lowers cost and allows stable regression tests across model or harness changes.",
    "resource": "Interaction cassettes; deterministic fixtures; secret redaction; replay drift; mock boundaries; reproducible incident analysis.",
    "build": "Record a representative tool-using run, redact sensitive data and replay it through the harness during tests. Create one altered replay to reproduce a historical failure.",
    "doneWhen": "The same failure is reproduced offline and the repaired harness passes the replay without live external calls.",
    "proof": "Replay fixture, redaction policy and incident reproduction demo.",
    "time": "3 h",
    "difficulty": "Deep",
    "projects": [
      "P19"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Record and Replay",
        "url": "https://learn.chatgpt.com/docs/extend/record-and-replay"
      },
      {
        "label": "pytest - Documentation",
        "url": "https://docs.pytest.org/"
      },
      {
        "label": "OpenTelemetry - Generative AI Semantic Conventions",
        "url": "https://opentelemetry.io/docs/specs/semconv/gen-ai/"
      }
    ]
  },
  {
    "day": 103,
    "title": "Package skills and scale tool access with search and programmatic calls",
    "about": "Move from a bloated static tool list to discoverable, reusable capability packages.",
    "why": "As agents gain hundreds of possible operations, context-efficient tool discovery and reusable skills become important architecture concerns.",
    "resource": "Skill packaging; progressive disclosure; tool search; namespaces; programmatic tool calling; capability permissions; context cost.",
    "build": "Package one reusable skill, expose a catalog of 20+ mock tools through tool search, and let the agent load or call only the needed subset.",
    "doneWhen": "Tool-selection accuracy improves or context usage falls compared with loading all tool schemas at once.",
    "proof": "Tool catalog benchmark and reusable skill package.",
    "time": "3-4 h",
    "difficulty": "Frontier",
    "projects": [
      "P19"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Skills",
        "url": "https://developers.openai.com/api/docs/guides/tools-skills"
      },
      {
        "label": "OpenAI - Tool Search",
        "url": "https://developers.openai.com/api/docs/guides/tools-tool-search"
      },
      {
        "label": "OpenAI - Programmatic Tool Calling",
        "url": "https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling"
      }
    ]
  },
  {
    "day": 104,
    "title": "Experiment with recursive and continual harness ideas safely",
    "about": "Understand emerging self-improving and recursive harness patterns without presenting them as mature defaults.",
    "why": "Frontier work suggests the harness itself may be optimized or recursively delegated, but these patterns require strong containment and evidence.",
    "resource": "Harness recursion; online harness adaptation; process rewards; recursive decomposition; optimizer-target separation; catastrophic self-modification risks.",
    "build": "Run a sandboxed experiment where a parent harness proposes a limited prompt/tool change or delegates a bounded subtask; require eval and human approval before adoption.",
    "doneWhen": "The experiment reports whether the change helped, cost more or caused regressions, and no unreviewed self-modification reaches the baseline harness.",
    "proof": "Frontier experiment report clearly separating evidence, inference and open questions.",
    "time": "3-4 h",
    "difficulty": "Frontier",
    "projects": [
      "P19"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Recursive Agent Harnesses (Frontier Research, 2026)",
        "url": "https://arxiv.org/abs/2606.13643"
      },
      {
        "label": "Continual Harness (Frontier Research, 2026)",
        "url": "https://arxiv.org/abs/2605.09998"
      },
      {
        "label": "OWASP - Top 10 for Agentic Applications 2026",
        "url": "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/"
      }
    ]
  },
  {
    "day": 105,
    "title": "Ship the agent-improvement flywheel with before/after evidence",
    "about": "Demonstrate that an AI system can be operated and improved systematically over time.",
    "why": "This is closer to real AI engineering work than a one-time agent demo: observe failures, preserve knowledge and safely change behavior.",
    "resource": "Release comparison; eval governance; improvement cadence; approval boundaries; experiment documentation.",
    "build": "Package traces, feedback labels, evals, ranked changes, worktree repair flow, replay fixtures, skills and the final harness revision.",
    "doneWhen": "The revised harness improves at least one primary metric on a held-out set without violating cost or safety gates.",
    "proof": "Ship P19; website shows 19/20 projects; publish an improvement-flywheel case study.",
    "time": "2 h",
    "difficulty": "Recap",
    "projects": [
      "P19"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "OpenAI Cookbook - Agent Improvement Loop with Traces, Evals and Codex",
        "url": "https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop"
      },
      {
        "label": "OpenAI Cookbook - Iterative Repair Loops with Codex",
        "url": "https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex"
      },
      {
        "label": "OpenAI - Evaluate Agent Workflows",
        "url": "https://developers.openai.com/api/docs/guides/agent-evals"
      }
    ]
  },
  {
    "day": 106,
    "title": "Select a narrow capstone problem using job-market evidence",
    "about": "Choose one real workflow that matches the roles and industries you want to enter.",
    "why": "A focused product proving one valuable outcome is stronger than a general assistant with many shallow features.",
    "resource": "Target roles; user jobs; competitive alternatives; build-versus-buy; measurable business outcome; portfolio positioning.",
    "build": "Review ten relevant job descriptions or client briefs, choose a recurring problem and write a one-page opportunity memo with explicit non-goals.",
    "doneWhen": "The problem has a named user, current workaround, measurable success metric, realistic data source and a three-minute demo journey.",
    "proof": "Opportunity memo and job-skill-to-feature mapping.",
    "time": "3 h",
    "difficulty": "Capstone",
    "projects": [
      "P20"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Production Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/production-best-practices"
      },
      {
        "label": "OpenAI - Deployment Checklist",
        "url": "https://developers.openai.com/api/docs/guides/deployment-checklist"
      },
      {
        "label": "Anthropic - Building Effective Agents",
        "url": "https://www.anthropic.com/engineering/building-effective-agents"
      }
    ]
  },
  {
    "day": 107,
    "title": "Write the PRD, architecture, eval plan and risk model",
    "about": "Freeze the product contract before implementation expands.",
    "why": "Architecture and evaluation plans expose ambiguity early and keep the capstone from becoming an uncontrolled feature list.",
    "resource": "Acceptance criteria; system boundaries; data contracts; architecture decisions; threat model; cost budget; SLOs; release gates.",
    "build": "Create the PRD, architecture diagram, data flow, threat model, golden scenarios, cost ceiling, latency target and two-week task board.",
    "doneWhen": "Every core requirement has an automated or human acceptance test and every risky action has a permission decision.",
    "proof": "Reviewed design package and architecture decision records.",
    "time": "4 h",
    "difficulty": "Capstone",
    "projects": [
      "P20"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      },
      {
        "label": "OWASP - Top 10 for Agentic Applications 2026",
        "url": "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/"
      },
      {
        "label": "NIST - Generative AI Risk Management Profile",
        "url": "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf"
      }
    ]
  },
  {
    "day": 108,
    "title": "Build ingestion, storage and retrieval foundations",
    "about": "Create the reliable data path for the capstone's central user journey.",
    "why": "Agents cannot compensate for poor data contracts, broken provenance or weak retrieval.",
    "resource": "Ingestion jobs; schema evolution; provenance; tenant boundaries; indexing; freshness; deletion and retention.",
    "build": "Implement the domain data model, ingestion pipeline and retrieval/search baseline using components from P3, P4 and P12.",
    "doneWhen": "A golden query set retrieves correct evidence with stable source IDs and tenant isolation tests pass.",
    "proof": "Data-flow demo, migration files and retrieval benchmark.",
    "time": "4 h",
    "difficulty": "Capstone",
    "projects": [
      "P20"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Retrieval",
        "url": "https://developers.openai.com/api/docs/guides/retrieval"
      },
      {
        "label": "pgvector - PostgreSQL Vector Similarity Search",
        "url": "https://github.com/pgvector/pgvector"
      },
      {
        "label": "PostgreSQL - Documentation",
        "url": "https://www.postgresql.org/docs/"
      }
    ]
  },
  {
    "day": 109,
    "title": "Implement the deterministic workflow baseline",
    "about": "Solve as much of the task as possible with typed code and explicit control flow.",
    "why": "The baseline reveals exactly where model flexibility is necessary and provides a reliable fallback when autonomy fails.",
    "resource": "Workflow decomposition; typed schemas; routing; idempotency; error paths; human review queues.",
    "build": "Create the end-to-end happy path using deterministic components plus narrowly scoped model calls. Add mocks for external systems.",
    "doneWhen": "The core workflow completes on standard cases with predictable state transitions and clear error messages.",
    "proof": "Workflow trace and baseline success/cost report.",
    "time": "4 h",
    "difficulty": "Capstone",
    "projects": [
      "P20"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Structured Outputs",
        "url": "https://developers.openai.com/api/docs/guides/structured-outputs"
      },
      {
        "label": "OpenAI - Function Calling",
        "url": "https://developers.openai.com/api/docs/guides/function-calling"
      },
      {
        "label": "Pydantic - Documentation",
        "url": "https://docs.pydantic.dev/latest/"
      }
    ]
  },
  {
    "day": 110,
    "title": "Add an agent or loop only where autonomy is justified",
    "about": "Introduce tool-using autonomy for the genuinely uncertain part of the task.",
    "why": "The capstone should demonstrate architectural judgment: deterministic workflow by default, agent or loop where exploration and recovery create value.",
    "resource": "Autonomy boundary; tool contract; state; approvals; loop specification; fallback and escalation.",
    "build": "Integrate P9 or P11 into one bounded stage. Restrict tools, budgets and terminal conditions, and retain the workflow baseline as fallback.",
    "doneWhen": "An experiment shows the autonomous stage improves task coverage or effort enough to justify its added cost and risk.",
    "proof": "Decision record comparing workflow-only and agent/loop variants.",
    "time": "4 h",
    "difficulty": "Capstone",
    "projects": [
      "P20"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Anthropic - Building Effective Agents",
        "url": "https://www.anthropic.com/engineering/building-effective-agents"
      },
      {
        "label": "Anthropic - Effective Harnesses for Long-Running Agents",
        "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
      },
      {
        "label": "OpenAI Cookbook - Iterative Repair Loops with Codex",
        "url": "https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex"
      }
    ]
  },
  {
    "day": 111,
    "title": "Create the production evaluation dataset and CI gate",
    "about": "Define release quality across normal, edge, multilingual and adversarial cases.",
    "why": "The capstone will change rapidly during the final days; evals stop improvements in one area from silently breaking another.",
    "resource": "Scenario design; component versus end-to-end evals; held-out sets; graders; statistical uncertainty; release thresholds.",
    "build": "Create at least 75 cases and run retrieval, extraction, tool, loop, final-output and safety evaluators in CI.",
    "doneWhen": "A seeded regression blocks the pull request and the report identifies the failing component rather than only showing one total score.",
    "proof": "Versioned dataset, eval dashboard and red/green CI demo.",
    "time": "4 h",
    "difficulty": "Capstone",
    "projects": [
      "P20"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      },
      {
        "label": "OpenAI - Evaluate Agent Workflows",
        "url": "https://developers.openai.com/api/docs/guides/agent-evals"
      },
      {
        "label": "Hamel Husain - Your AI Product Needs Evals",
        "url": "https://hamel.dev/blog/posts/evals/"
      }
    ]
  },
  {
    "day": 112,
    "title": "Add verification, recovery and long-running execution",
    "about": "Make the core task resume safely and recover from realistic failures.",
    "why": "Production reliability depends on retries, checkpoints and verified terminal states, especially when jobs last longer than one request.",
    "resource": "Background jobs; webhooks; checkpoints; replay; no-progress detection; repair; human escalation.",
    "build": "Add durable execution state, safe retries, one repair cycle, restart recovery and an operator-visible blocked state.",
    "doneWhen": "The system survives a forced restart and one external dependency failure without duplicating side effects.",
    "proof": "Recovery test, event timeline and verified completion trace.",
    "time": "4 h",
    "difficulty": "Capstone",
    "projects": [
      "P20"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "OpenAI - Background Mode",
        "url": "https://developers.openai.com/api/docs/guides/background"
      },
      {
        "label": "OpenAI - Webhooks",
        "url": "https://developers.openai.com/api/docs/guides/webhooks"
      },
      {
        "label": "OpenAI - Record and Replay",
        "url": "https://learn.chatgpt.com/docs/extend/record-and-replay"
      }
    ]
  },
  {
    "day": 113,
    "title": "Implement authentication, privacy and least-privilege permissions",
    "about": "Protect users, tenant data and external actions before public testing.",
    "why": "A job-ready AI product must explain who can access what, how long data remains and which actions require approval.",
    "resource": "Authentication; authorization; tenant isolation; data minimization; retention; secret management; permission scopes; audit logs.",
    "build": "Add auth, row-level or application tenant checks, scoped tool permissions, secure secrets and explicit approval for irreversible actions.",
    "doneWhen": "Cross-tenant tests fail safely, secrets do not enter model context or logs, and risky actions cannot execute without approval.",
    "proof": "Privacy policy, permission matrix and security test output.",
    "time": "4 h",
    "difficulty": "Capstone",
    "projects": [
      "P20"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Workload Identity Federation",
        "url": "https://developers.openai.com/api/docs/guides/workload-identity-federation"
      },
      {
        "label": "OWASP - Top 10 for Agentic Applications 2026",
        "url": "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/"
      },
      {
        "label": "NIST - Generative AI Risk Management Profile",
        "url": "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf"
      }
    ]
  },
  {
    "day": 114,
    "title": "Instrument observability, costs and service-level objectives",
    "about": "Make every important request and loop diagnosable in production.",
    "why": "Operators need to know not only that a request failed, but which model, tool, retrieval step, verifier or dependency caused it.",
    "resource": "GenAI trace conventions; metrics and logs; SLOs; p95 latency; cost per successful task; error budgets; alerts.",
    "build": "Add distributed traces, structured logs, model/tool attributes, cost accounting, dashboards and alerts for the core journey.",
    "doneWhen": "One failed scenario can be diagnosed from telemetry alone and dashboard totals reconcile with the cost ledger.",
    "proof": "Operations dashboard and incident-debugging walkthrough.",
    "time": "4 h",
    "difficulty": "Capstone",
    "projects": [
      "P20"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenTelemetry - Generative AI Semantic Conventions",
        "url": "https://opentelemetry.io/docs/specs/semconv/gen-ai/"
      },
      {
        "label": "OpenTelemetry - Documentation",
        "url": "https://opentelemetry.io/docs/"
      },
      {
        "label": "OpenAI - Cost Optimization",
        "url": "https://developers.openai.com/api/docs/guides/cost-optimization"
      }
    ]
  },
  {
    "day": 115,
    "title": "Add the best-fit multimodal or realtime interface",
    "about": "Use vision, files or voice only when it improves the chosen workflow.",
    "why": "A thoughtful interface demonstrates product judgment; adding every modality for novelty weakens focus.",
    "resource": "Modality selection; upload/vision flow; realtime latency; accessibility; fallback UX; consent and transcript handling.",
    "build": "Add one interface from P13 or P14 and connect it to the same secure, evaluated backend contract.",
    "doneWhen": "Users can complete the core task through the new modality without bypassing permission, tracing or eval controls.",
    "proof": "Interface demo and modality-specific latency/accuracy report.",
    "time": "4 h",
    "difficulty": "Capstone",
    "projects": [
      "P20"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Images and Vision",
        "url": "https://developers.openai.com/api/docs/guides/images-vision"
      },
      {
        "label": "OpenAI - Realtime and Audio",
        "url": "https://developers.openai.com/api/docs/guides/realtime"
      },
      {
        "label": "OpenAI - Safety Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/safety-best-practices"
      }
    ]
  },
  {
    "day": 116,
    "title": "Containerize and deploy the complete production stack",
    "about": "Create a reproducible environment with database, queue, migrations and rollback.",
    "why": "Deployment evidence is required for backend and applied AI roles; a local notebook is not a production artifact.",
    "resource": "Containers; environment configuration; health checks; database migrations; worker deployment; staging and production separation.",
    "build": "Package API, worker and frontend; configure PostgreSQL/Redis; add migrations, health endpoints, seed data and CI deployment.",
    "doneWhen": "A clean staging environment deploys from the main branch and can roll back to the previous release.",
    "proof": "Deployment diagram, runbook and staging URL.",
    "time": "4-5 h",
    "difficulty": "Capstone",
    "projects": [
      "P20"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "Docker - Overview",
        "url": "https://docs.docker.com/get-started/docker-overview/"
      },
      {
        "label": "GitHub Actions - Get Started",
        "url": "https://docs.github.com/en/actions/get-started"
      },
      {
        "label": "OpenAI - Deployment Checklist",
        "url": "https://developers.openai.com/api/docs/guides/deployment-checklist"
      }
    ]
  },
  {
    "day": 117,
    "title": "Run load, failure and recovery tests",
    "about": "Measure the tested operating envelope instead of claiming unlimited scalability.",
    "why": "Latency spikes, rate limits, queue backlogs and dependency failures appear only under realistic stress.",
    "resource": "Load profiles; concurrency; backpressure; circuit breakers; graceful degradation; chaos experiments; recovery time.",
    "build": "Run representative load, inject model/tool/database failures and fix the largest bottleneck or unsafe retry behavior.",
    "doneWhen": "The system meets documented targets or clearly reports capacity limits and degraded-mode behavior.",
    "proof": "Load charts, failure matrix and recovery runbook.",
    "time": "4 h",
    "difficulty": "Capstone",
    "projects": [
      "P20"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Production Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/production-best-practices"
      },
      {
        "label": "Redis - Documentation",
        "url": "https://redis.io/docs/latest/"
      },
      {
        "label": "OpenTelemetry - Documentation",
        "url": "https://opentelemetry.io/docs/"
      }
    ]
  },
  {
    "day": 118,
    "title": "Conduct structured user testing and run the improvement flywheel",
    "about": "Use fresh users and real traces to produce one evidence-based product improvement.",
    "why": "Builders stop noticing confusing UX and missing cases. External testing converts assumptions into data.",
    "resource": "Task-based user tests; feedback capture; trace review; prioritization; release comparison; consent.",
    "build": "Ask 3-5 target users to complete the core task, review their traces, add discovered failures to evals and implement the highest-impact fix.",
    "doneWhen": "A held-out metric or completion rate improves and no existing release gate regresses.",
    "proof": "User-test summary, new eval cases and before/after result.",
    "time": "4 h",
    "difficulty": "Review",
    "projects": [
      "P20"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI Cookbook - Agent Improvement Loop with Traces, Evals and Codex",
        "url": "https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop"
      },
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      },
      {
        "label": "OpenAI - Evaluate Agent Workflows",
        "url": "https://developers.openai.com/api/docs/guides/agent-evals"
      }
    ]
  },
  {
    "day": 119,
    "title": "Package 20 projects into job-ready evidence and apply",
    "about": "Make recruiters and clients understand the strongest work within minutes.",
    "why": "A large repository does not sell itself. Clear case studies, metrics and interview stories convert engineering effort into opportunities.",
    "resource": "Portfolio information architecture; quantified resume bullets; STAR stories; system-design interviews; targeted applications; client offers.",
    "build": "Create a portfolio index, select six flagship projects, record concise demos, write architecture and debugging stories, update CV/Upwork/LinkedIn and send 15 targeted applications or messages.",
    "doneWhen": "Each flagship has a problem, architecture, hard failure, metric, demo, honest limitation and role relevance.",
    "proof": "Portfolio page, application tracker and interview story bank.",
    "time": "3-4 h",
    "difficulty": "Career",
    "projects": [
      "P20"
    ],
    "isRest": true,
    "watchLinks": [
      {
        "label": "OpenAI - Production Best Practices",
        "url": "https://developers.openai.com/api/docs/guides/production-best-practices"
      },
      {
        "label": "OpenAI - Deployment Checklist",
        "url": "https://developers.openai.com/api/docs/guides/deployment-checklist"
      }
    ]
  },
  {
    "day": 120,
    "title": "Launch production, publish the capstone and write the postmortem",
    "about": "Finish with a public, measured product and a disciplined continuation plan.",
    "why": "Shipping and maintaining a real system is the final proof that the curriculum produced engineering capability rather than tutorial completion.",
    "resource": "Release checklist; smoke/eval/security gates; monitoring; incident ownership; retrospective; 90-day roadmap.",
    "build": "Deploy production, run all release gates, record the three-minute demo, publish the case study and postmortem, announce availability for relevant roles or client work and schedule the next improvement cycle.",
    "doneWhen": "Product URL, code, setup guide, evals, security report, telemetry screenshots, runbook, demo, case study and limitations are linked from one page.",
    "proof": "Ship P20; website shows 20/20 projects and Day 120 complete.",
    "time": "3-4 h",
    "difficulty": "Launch",
    "projects": [
      "P20"
    ],
    "isRest": false,
    "watchLinks": [
      {
        "label": "OpenAI - Deployment Checklist",
        "url": "https://developers.openai.com/api/docs/guides/deployment-checklist"
      },
      {
        "label": "OpenAI - Working with Evals",
        "url": "https://developers.openai.com/api/docs/guides/evals"
      },
      {
        "label": "OWASP - Top 10 for Agentic Applications 2026",
        "url": "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/"
      }
    ]
  }
];

export const PRODUCTION_AI_2026: Challenge = {
  id: "production-ai-2026",
  title: "120 Days of Production AI Engineering",
  totalDays: 120,
  cohortStart: "2026-07-14",
  github: "https://github.com/ahmad19sep/100-days-learning-ai",
  creator: {
    name: "Ahmad X AI",
    handle: "@aixahmad",
    tagline: "teaching production AI, in public",
  },
  days: DAYS,
  weeks: WEEKS,
  projects: PROJECTS,
  courses: [],
};
