// Reading Pack 03 — Days 021–030: Evaluation, Context Optimization and
// Document AI.

import type { ReadingData } from "./core";

export const PACK03: Record<number, ReadingData> = {
  21: {
    rule: "eval",
    failures: "metrics",
    problem:
      "The eval flywheel is a repeatable operating process: collect traces, label failures, add tests, make a targeted change, replay the suite and monitor production.",
    concepts: [
      { name: "Evaluation operations" },
      { name: "Test ownership" },
      { name: "Review cadence" },
      { name: "Dataset versioning" },
      { name: "Quality release notes" },
    ],
    walkthrough: [
      "Prepare: add a one-command eval runner.",
      "Implement: build the dashboard/report.",
      "Measure: write a contribution guide and weekly review SOP.",
    ],
    gate: "Someone can add one new failure example and see it flow through the whole system.",
    evidence: "Ship P5; website shows 5/20 projects; publish a reliability case study.",
    refs: [
      { label: "Hamel Husain - Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/" },
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
      { label: "GitHub Actions - Get Started", url: "https://docs.github.com/en/actions/get-started" },
    ],
  },

  22: {
    rule: "boundary",
    failures: "retrieval",
    problem:
      "Context is a scarce runtime resource. A token audit asks which pieces are instructions, evidence, memory or accidental repetition and measures the value of each category.",
    concepts: [
      { name: "Context components" },
      {
        name: "Token budgets",
        def: "A token budget allocates limited context among instructions, user input, evidence, memory and tool results. Every token should have a reason to exist.",
      },
      { name: "Static versus dynamic prefixes" },
      { name: "High-signal information" },
    ],
    walkthrough: [
      "Instrument P4 to log tokens by component and create a budget table for five representative requests.",
    ],
    gate: "You can identify the three largest sources of waste and their quality purpose.",
    evidence: "Context budget dashboard and proposed cuts.",
    refs: [
      { label: "Anthropic - Effective Context Engineering", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
      { label: "OpenAI - Cost Optimization", url: "https://developers.openai.com/api/docs/guides/cost-optimization" },
    ],
  },

  23: {
    rule: "boundary",
    failures: "cost",
    problem:
      "Relevant information can be lost in a long context because attention is limited and ordering matters. The correct experiment varies position and noise while keeping the question constant.",
    concepts: [
      { name: "Lost-in-the-middle behavior" },
      { name: "Distractors" },
      {
        name: "Attention budget",
        def: "A budget bounds time, tokens, money, tool calls or risk. Exhaustion should lead to a defined terminal state rather than uncontrolled continuation.",
      },
      { name: "Position-sensitive evaluation" },
    ],
    walkthrough: [
      "Prepare: create controlled tests placing the answer at beginning/middle/end with increasing distractors.",
      "Implement: chart accuracy versus tokens.",
    ],
    gate: "The report identifies a safe context policy for your corpus and model.",
    evidence: "Accuracy-token-position chart used in the final case study.",
    refs: [
      { label: "Anthropic - Effective Context Engineering", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
    ],
  },

  24: {
    rule: "boundary",
    failures: "cost",
    problem:
      "Caching rewards stable repeated context. Prompt structure should separate fixed instructions and schemas from variable user data so repeated prefixes remain reusable.",
    concepts: [
      { name: "Cacheable prefixes" },
      { name: "Dynamic suffixes" },
      { name: "Prompt versioning" },
      { name: "Cache hit metrics" },
    ],
    walkthrough: [
      "Prepare: refactor the RAG prompt so static instructions, examples and tool schemas are grouped before dynamic user data.",
      "Implement: measure cache behavior.",
    ],
    gate: "A repeated workload reports before/after latency and cost with quality held constant.",
    evidence: "Caching benchmark and prompt diff.",
    refs: [
      { label: "OpenAI - Prompt Caching", url: "https://developers.openai.com/api/docs/guides/prompt-caching" },
      { label: "OpenAI - Cost Optimization", url: "https://developers.openai.com/api/docs/guides/cost-optimization" },
    ],
  },

  25: {
    rule: "boundary",
    failures: "cost",
    problem:
      "A long conversation should not be copied forever. Compaction preserves decisions, unresolved tasks and evidence while discarding redundant wording.",
    concepts: [
      { name: "Rolling summaries" },
      { name: "Semantic memory" },
      { name: "Episodic memory" },
      { name: "Pinned facts" },
      {
        name: "Compaction triggers",
        def: "Compaction replaces long history with a smaller state representation. A good compacted state preserves decisions, constraints, unresolved work and evidence references.",
      },
    ],
    walkthrough: [
      "Prepare: create a memory manager that compacts old turns.",
      "Implement: preserve citations/decisions and make it explain what was removed.",
    ],
    gate: "A long test conversation stays below the ceiling and passes follow-up factual checks.",
    evidence: "Memory trace and compaction regression tests.",
    refs: [
      { label: "OpenAI - Compaction", url: "https://developers.openai.com/api/docs/guides/compaction" },
      { label: "Anthropic - Effective Context Engineering", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
    ],
  },

  26: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "The cheapest and most reliable component should perform each step. Some inputs need a strong model, some need a smaller model, and some need no model at all.",
    concepts: [
      {
        name: "Rule-based routing",
        def: "Routing selects a path based on input type, risk or complexity. A reliable router includes fallback behavior for uncertain classifications.",
      },
      {
        name: "Confidence",
        def: "Confidence should represent evidence about reliability, not a decorative model-generated number. Useful signals include parser success, agreement, retrieval quality and human review outcomes.",
      },
      { name: "Cascade models" },
      { name: "Fallbacks" },
      { name: "Escalation" },
    ],
    walkthrough: [
      "Prepare: route simple extraction to code/small model and complex synthesis to a stronger model.",
      "Implement: log route, confidence and outcome.",
    ],
    gate: "A mixed workload reduces cost while remaining within the chosen quality tolerance.",
    evidence: "Routing confusion matrix and savings estimate.",
    refs: [
      { label: "Anthropic - Building Effective Agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
      { label: "OpenAI - Cost Optimization", url: "https://developers.openai.com/api/docs/guides/cost-optimization" },
    ],
  },

  27: {
    rule: "eval",
    failures: "metrics",
    problem:
      "Optimization is a three-way trade-off among quality, latency and cost. A dashboard makes that trade-off visible per route, model and request type.",
    concepts: [
      { name: "p50/p95 latency" },
      { name: "Cost per successful task" },
      { name: "Quality-adjusted cost" },
      { name: "Trace aggregation" },
    ],
    walkthrough: [
      "Aggregate model, tokens, cache hits, retrieval latency, total latency, evaluation outcome and cost into a dashboard.",
    ],
    gate: "You can compare two prompt/model versions on quality, cost and p95 latency.",
    evidence: "Dashboard screenshots and exported benchmark JSON.",
    refs: [
      { label: "Arize Phoenix - Documentation", url: "https://arize.com/docs/phoenix" },
      { label: "OpenTelemetry - Documentation", url: "https://opentelemetry.io/docs/" },
      { label: "OpenAI - Cost Optimization", url: "https://developers.openai.com/api/docs/guides/cost-optimization" },
    ],
  },

  28: {
    rule: "boundary",
    failures: "cost",
    problem:
      "A case study is credible when it reports baseline, intervention, evaluation method, quality change and cost change. Percent savings without a quality measure are incomplete.",
    concepts: [
      { name: "Baseline design" },
      { name: "Controlled comparison" },
      { name: "Business-facing findings" },
      { name: "Limitations" },
    ],
    walkthrough: [
      "Write a case study showing baseline, interventions, quality delta, cost delta, latency delta and remaining risks.",
    ],
    gate: "All claims are reproducible from scripts and no percentage is based on a single request.",
    evidence: "Ship P6; website shows 6/20 projects; publish the case study.",
    refs: [
      { label: "OpenAI - Production Best Practices", url: "https://developers.openai.com/api/docs/guides/production-best-practices" },
      { label: "OpenAI - Deployment Checklist", url: "https://developers.openai.com/api/docs/guides/deployment-checklist" },
    ],
  },

  29: {
    rule: "boundary",
    failures: "documents",
    problem:
      "Document AI should begin with the business schema and evidence requirements, not with a model demo. Missing or uncertain fields must remain explicit.",
    concepts: [
      { name: "File inputs" },
      { name: "Multimodal extraction" },
      { name: "Schema design" },
      { name: "Nullable fields" },
      { name: "Provenance" },
    ],
    walkthrough: [
      "Prepare: define a schema for one document type and extract fields with page/source references.",
      "Implement: save raw input and normalized output separately.",
    ],
    gate: "Twenty sample documents produce validated records and a field-level accuracy report.",
    evidence: "Extraction dataset and error gallery.",
    refs: [
      { label: "OpenAI - Images and Vision", url: "https://developers.openai.com/api/docs/guides/images-vision" },
      { label: "OpenAI - File Inputs", url: "https://developers.openai.com/api/docs/guides/file-inputs" },
      { label: "Pydantic - Documentation", url: "https://docs.pydantic.dev/latest/" },
    ],
  },

  30: {
    rule: "eval",
    failures: "happy-path",
    problem:
      "Retries are useful only when the failure is recoverable. A system should distinguish invalid structure, unreadable source, missing evidence and ambiguous content.",
    concepts: [
      { name: "Cross-field validation" },
      {
        name: "Confidence proxies",
        def: "Confidence should represent evidence about reliability, not a decorative model-generated number. Useful signals include parser success, agreement, retrieval quality and human review outcomes.",
      },
      { name: "Retry prompts" },
      { name: "Deterministic normalization" },
      { name: "Abstention" },
    ],
    walkthrough: [
      "Prepare: add validators for dates, totals, IDs and required relationships.",
      "Implement: retry only the failed fields and flag uncertain records.",
    ],
    gate: "Known malformed documents never silently enter the accepted dataset.",
    evidence: "Validation report with accepted, retried and review-required states.",
    refs: [
      { label: "OpenAI - Structured Outputs", url: "https://developers.openai.com/api/docs/guides/structured-outputs" },
      { label: "Pydantic - Documentation", url: "https://docs.pydantic.dev/latest/" },
      { label: "Hamel Husain - Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/" },
    ],
  },
};
