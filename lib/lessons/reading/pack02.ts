// Reading Pack 02 — Days 011–020: Hybrid Retrieval, Grounded RAG and
// Evaluation.

import type { ReadingData } from "./core";

export const PACK02: Record<number, ReadingData> = {
  11: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "Hybrid retrieval works best when each component contributes a different signal. Rank fusion combines those signals without pretending their raw scores share the same scale.",
    concepts: [
      {
        name: "Reciprocal-rank fusion",
        def: "Reciprocal Rank Fusion combines ranked lists using positions rather than incomparable raw scores. It is a robust way to blend lexical and semantic retrieval.",
      },
      { name: "Weighted fusion" },
      { name: "Deduplication" },
      { name: "Rank versus score" },
    ],
    walkthrough: [
      "Prepare: combine BM25 and vector results.",
      "Implement: tune one fusion parameter on a development set and freeze it before testing.",
    ],
    gate: "Hybrid retrieval is evaluated on a held-out set and either beats the baselines or documents why it does not.",
    evidence: "P3 metric card: recall@k, MRR and p95 latency.",
    refs: [
      { label: "OpenAI - Retrieval", url: "https://developers.openai.com/api/docs/guides/retrieval" },
      { label: "Anthropic - Contextual Retrieval", url: "https://www.anthropic.com/engineering/contextual-retrieval" },
    ],
  },

  12: {
    rule: "boundary",
    failures: "documents",
    problem:
      "Search fails when the user's wording differs from the source. Rewriting, decomposition and hypothetical representations can bridge that gap, but generated search representations must never be confused with source evidence.",
    concepts: [
      { name: "Multi-query retrieval" },
      {
        name: "Decomposition",
        def: "Decomposition splits a complex request into smaller searches whose evidence can be combined. It is useful when one query contains multiple entities, constraints or time ranges.",
      },
      { name: "HyDE" },
      { name: "Fallback search" },
      { name: "Intent preservation" },
    ],
    walkthrough: [
      "Prepare: add two rewriting strategies and route them only when the baseline confidence is low.",
      "Implement: save original and rewritten queries in traces.",
    ],
    gate: "Hard-query recall improves without reducing easy-query precision beyond the chosen tolerance.",
    evidence: "Before/after query examples and a drift failure analysis.",
    refs: [
      { label: "Anthropic - Effective Context Engineering", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
      { label: "OpenAI - Retrieval", url: "https://developers.openai.com/api/docs/guides/retrieval" },
    ],
  },

  13: {
    rule: "eval",
    failures: "retrieval",
    problem:
      "A strong RAG pipeline first retrieves broadly, then spends more compute deciding which evidence deserves the top positions. Provenance must survive every stage so the final answer can point back to exact sources.",
    concepts: [
      {
        name: "Cross-encoder/LLM reranking",
        def: "Reranking applies a more expensive relevance model to a small candidate set. The first retriever optimizes recall; the reranker improves precision near the top.",
      },
      { name: "Contextualized chunks" },
      { name: "Source IDs" },
      { name: "Citation contracts" },
      { name: "Answer abstention" },
    ],
    walkthrough: [
      "Prepare: rerank retrieved chunks.",
      "Implement: add contextual descriptions before indexing.",
      "Measure: generate answers that cite exact chunk IDs with quoted evidence limits.",
    ],
    gate: "Top-k precision and citation validity are measured; unsupported answers abstain.",
    evidence: "Ship P3 and freeze the retrieval benchmark used later by evals.",
    refs: [
      { label: "Anthropic - Contextual Retrieval", url: "https://www.anthropic.com/engineering/contextual-retrieval" },
      { label: "OpenAI - Retrieval", url: "https://developers.openai.com/api/docs/guides/retrieval" },
    ],
  },

  14: {
    rule: "provenance",
    failures: "http",
    problem:
      "A useful RAG demo becomes an engineering product only when ingestion, retrieval, generation, citations and failures can be observed through a stable API contract.",
    concepts: [
      { name: "Ingestion jobs" },
      { name: "/ask endpoint" },
      {
        name: "Streaming",
        def: "Non-streaming waits for one complete response. Streaming emits events as work progresses, improving perceived latency but adding event ordering, partial-state and disconnect concerns.",
      },
      { name: "Source payloads" },
      {
        name: "Tracing",
        def: "A trace records the path of one request through model calls, tools, retrieval and code. It makes distributed failures inspectable instead of mysterious.",
      },
      { name: "API contracts" },
    ],
    walkthrough: [
      "Prepare: create FastAPI endpoints for upload/status/ask.",
      "Implement: return citations and trace IDs.",
      "Measure: instrument the full path with Phoenix or OpenTelemetry.",
    ],
    gate: "A fresh document can be uploaded and queried; every answer links to retrieved evidence and trace data.",
    evidence: "Ship P4; website shows 4/20 projects; record a complete demo.",
    refs: [
      { label: "FastAPI - Documentation", url: "https://fastapi.tiangolo.com/" },
      { label: "Arize Phoenix - Documentation", url: "https://arize.com/docs/phoenix" },
      { label: "OpenAI - File Inputs", url: "https://developers.openai.com/api/docs/guides/file-inputs" },
    ],
  },

  15: {
    rule: "eval",
    failures: "metrics",
    problem:
      "Quality must be written before optimization begins. A team that cannot name success cases, failure cases and trade-offs cannot know whether a new prompt or model is an improvement.",
    concepts: [
      { name: "Task specification" },
      { name: "Trace schemas" },
      { name: "Feature/scenario matrices" },
      { name: "Sampling" },
      { name: "Privacy-aware logging" },
    ],
    walkthrough: [
      "Collect 40-60 RAG traces containing input, retrieved chunks, answer, citations, latency, cost and model version.",
    ],
    gate: "Every trace can be replayed and linked to a feature and scenario.",
    evidence: "Versioned traces.jsonl and evaluation README.",
    refs: [
      { label: "Hamel Husain - Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/" },
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
    ],
  },

  16: {
    rule: "eval",
    failures: "metrics",
    problem:
      "Error analysis starts with real traces, not a favorite metric. Reading failures and grouping them by the earliest meaningful cause produces a roadmap for evaluators and fixes.",
    concepts: [
      { name: "Open coding" },
      { name: "First-failure labeling" },
      { name: "Axial coding" },
      { name: "Severity" },
      { name: "Frequency" },
      { name: "Root cause versus symptom" },
    ],
    walkthrough: [
      "Prepare: label the first meaningful failure in each trace.",
      "Implement: cluster notes into 6-10 categories.",
      "Measure: rank by frequency times impact.",
    ],
    gate: "The taxonomy has clear definitions, examples and proposed owners/components.",
    evidence: "Failure-mode dashboard and top-three improvement plan.",
    refs: [
      { label: "Hamel Husain - Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/" },
      { label: "Arize Phoenix - Documentation", url: "https://arize.com/docs/phoenix" },
    ],
  },

  17: {
    rule: "eval",
    failures: "metrics",
    problem:
      "Use code for behavior that code can check. Schemas, parsers, exact business rules and execution tests are cheaper and more stable than asking another model.",
    concepts: [
      { name: "Assertions" },
      { name: "Schema tests" },
      { name: "Regex" },
      { name: "Executable checks" },
      { name: "Retrieval/citation consistency" },
      { name: "Test parametrization" },
    ],
    walkthrough: [
      "Implement at least six evaluators and run them with pytest over the trace dataset.",
    ],
    gate: "The suite identifies known failures and prints actionable messages with trace IDs.",
    evidence: "Green/red CI example and evaluator documentation.",
    refs: [
      { label: "Hamel Husain - Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/" },
      { label: "pytest - Documentation", url: "https://docs.pytest.org/" },
    ],
  },

  18: {
    rule: "eval",
    failures: "metrics",
    problem:
      'An LLM judge should answer one narrow question with an explicit rubric. Broad "score this answer" prompts hide disagreement and are difficult to calibrate.',
    concepts: [
      { name: "Binary rubrics" },
      { name: "Pairwise comparison" },
      { name: "Rationale fields" },
      { name: "Judge leakage" },
      { name: "Position and verbosity bias" },
    ],
    walkthrough: [
      "Prepare: write a judge for one failure mode.",
      "Implement: require structured pass/fail plus evidence.",
      "Measure: test prompt variants.",
    ],
    gate: "The judge runs across all traces and its disagreements can be reviewed quickly.",
    evidence: "Judge prompt versions and a disagreement report.",
    refs: [
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
      { label: "Hamel Husain - Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/" },
    ],
  },

  19: {
    rule: "eval",
    failures: "metrics",
    problem:
      "A judge is useful only if its decisions match the judgments that matter. Alignment requires labeled examples, held-out testing, disagreement analysis and periodic recalibration.",
    concepts: [
      { name: "Confusion matrix" },
      { name: "Precision/recall" },
      { name: "Cohen's kappa" },
      { name: "Held-out examples" },
      { name: "Calibration" },
    ],
    walkthrough: [
      "Prepare: create a balanced human-labeled set.",
      "Implement: calculate agreement metrics.",
      "Measure: inspect disagreements and revise the rubric once.",
    ],
    gate: "The final report states acceptable use, unacceptable use and periodic re-check frequency.",
    evidence: "Human-vs-judge alignment table committed to P5.",
    refs: [
      { label: "Hamel Husain - Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/" },
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
    ],
  },

  20: {
    rule: "eval",
    failures: "retrieval",
    problem:
      "An evaluation suite becomes operational when it runs on changes and can block a regression. Thresholds should reflect product risk, not arbitrary perfection.",
    concepts: [
      {
        name: "Golden datasets",
        def: "A golden dataset is a curated, version-controlled set of cases used to prevent regressions. It should grow from real failures, not only synthetic happy paths.",
      },
      { name: "Development versus test split" },
      { name: "Thresholds" },
      { name: "Statistical noise" },
      { name: "CI artifacts" },
    ],
    walkthrough: [
      "Prepare: run retrieval metrics, deterministic checks and the aligned judge in GitHub Actions.",
      "Implement: store results and compare against baseline.",
    ],
    gate: "An intentionally bad change produces a red pull request and a readable evaluation artifact.",
    evidence: "Screenshot of the failed gate and the fix that restores it.",
    refs: [
      { label: "GitHub Actions - Get Started", url: "https://docs.github.com/en/actions/get-started" },
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
      { label: "OpenAI - Retrieval", url: "https://developers.openai.com/api/docs/guides/retrieval" },
    ],
  },
};
