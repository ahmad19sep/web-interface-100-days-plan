// Reading-pack engine. The course's reading packs (12 packs × 10 days)
// share a fixed skeleton — the five-question mental model, a small set of
// production rules and failure-mode triples, the evidence-note format and
// the self-check pattern — while each day contributes its own engineering
// problem, concepts, walkthrough, completion gate and references.
//
// Each pack file (pack01.ts …) stores only the per-day content; this module
// holds the shared skeleton once and expands a day's data into the full
// reading as structured LessonSections for the Understand stage. The full
// text renders inside the site — external links stay in the collapsed
// optional-references block.

import type { Block, LessonSection } from "../types";

// ── the production rules (section 2 closes with one of these) ───────────────

export type RuleKey = "boundary" | "eval" | "authority" | "provenance";

const RULES: Record<RuleKey, string> = {
  boundary:
    "Make the boundary explicit, validate inputs and outputs, record evidence, and define what happens when the component fails.",
  eval: "Never promote a change because one demonstration looks better. Promote it because a versioned evaluation shows improvement on important cases and no unacceptable regression.",
  authority:
    "The model proposes; deterministic code authorizes, executes, records and verifies. Keep authority outside the model.",
  provenance:
    "Preserve provenance from document ingestion to final citation, and evaluate retrieval separately from generation.",
};

// ── the failure-mode triples (section 6 uses one of these sets) ──────────────

export type FailureKey =
  | "happy-path"
  | "metrics"
  | "autonomy"
  | "retrieval"
  | "http"
  | "documents"
  | "cost";

const FAILURES: Record<FailureKey, string[]> = {
  "happy-path": [
    "Building the happy path before defining failure behavior.",
    "Treating a model response as evidence instead of validating it.",
    "Finishing code without publishing reproducible proof.",
  ],
  metrics: [
    "Using generic metrics before reading real failures.",
    "Evaluating the training or prompt-tuning examples instead of a held-out set.",
    "Changing multiple components at once and losing causal evidence.",
  ],
  autonomy: [
    "Allowing the model to directly perform unvalidated actions.",
    "Using conversational history as the only state store.",
    "Missing explicit budgets, cancellation and terminal conditions.",
  ],
  retrieval: [
    "Selecting parameters from intuition without a labeled query set.",
    "Treating similarity as proof of relevance.",
    "Losing source metadata before answer generation.",
  ],
  http: [
    "Logging secrets or full sensitive payloads.",
    "Retrying every error class without checking whether the request is safe to repeat.",
    "Depending on one provider's response shape throughout the application.",
  ],
  documents: [
    "Forcing uncertain fields into confident values.",
    "Ignoring layout and source provenance.",
    "Testing only clean sample documents.",
  ],
  cost: [
    "Optimizing cost without checking quality.",
    "Adding summaries that silently delete constraints.",
    "Routing uncertain work without a safe fallback.",
  ],
};

// ── per-project framing (belongs-to paragraph + employer signal) ─────────────

export const PROJECT_PURPOSE: Record<string, string> = {
  P1: "Raw HTTP and Python clients for OpenAI/Anthropic-style APIs, structured outputs, streaming, token/cost logging, and a clean provider abstraction.",
  P2: "A mini BPE tokenizer plus experiments showing how Urdu, Roman Urdu, and English are tokenized and billed differently.",
  P3: "Embeddings, BM25, reciprocal-rank fusion, query rewriting, reranking, contextual retrieval, and retrieval metrics.",
  P4: "A cited, traceable RAG service over local files with ingestion, retrieval, answer synthesis, FastAPI serving, and provenance.",
  P5: "Trace dataset, error taxonomy, deterministic evaluators, aligned LLM judge, golden dataset, metrics, and CI regression gates.",
  P6: "Token budgets, context-position experiments, prompt caching, compaction, model routing, and cost/latency dashboards.",
  P7: "PDF/image ingestion to validated business schemas, confidence handling, retries, batching, and human review.",
  P8: "Prompt chaining, routing, parallelization, orchestrator-workers, and evaluator-optimizer patterns with metrics.",
  P9: "A transparent think-act-observe loop with typed tools, error recovery, state, approval checkpoints, and trajectory evals.",
};

export const PROJECT_SIGNAL: Record<string, string> = {
  P1: "API integration, schema validation, provider abstraction, production debugging.",
  P2: "Model fundamentals, multilingual awareness, data/latency intuition.",
  P3: "Search, information retrieval, vector databases, measurable optimization.",
  P4: "End-to-end RAG, backend APIs, citations, observability.",
  P5: "Evaluation engineering — the strongest differentiator in the portfolio.",
  P6: "AI performance engineering and measurable cost reduction.",
  P7: "Document AI, structured outputs, practical business automation.",
  P8: "Reliable orchestration before agents; workflow design and trade-offs.",
  P9: "Agent architecture, tool calling, debugging, framework literacy.",
};

// ── fixed skeleton texts ──────────────────────────────────────────────────────

const COMPLETE_NOTE =
  "Today is not complete when the interface looks correct or the model returns one impressive answer. It is complete when the mechanism is understood, the important failure paths are visible, and the required evidence can be reproduced by another engineer.";

const MODEL_INTRO = "Treat today's component as a contract with five questions:";

const MODEL_QUESTIONS = [
  "What enters the component? Identify data, state, identity and assumptions.",
  "What leaves it? Define a typed result, artifact or state transition.",
  "What can fail? Include network, model, data, permission and human errors.",
  "How will failure be observed? Add tests, traces, metrics or review evidence.",
  "Who decides success? Prefer deterministic or independent verification over the component declaring itself correct.",
];

const FIT_TEXT_1 =
  "The concepts above should not be learned as separate definitions. Connect them in a single flow. First, define the input and constraints. Next, transform or route the input using the simplest reliable mechanism. Then validate the result before it can affect later steps. Finally, record enough evidence to explain what happened after the fact.";

const FIT_TEXT_2 =
  "For this day, the output of one stage will become tomorrow's dependency. Keep interfaces small and versioned. A later component should not need to know every internal detail of today's implementation. This is how a 120-day curriculum becomes one coherent engineering portfolio instead of 120 unrelated demos.";

const LOG_NOTE =
  "While building, keep a small experiment log with the input, configuration, result, latency or runtime, and unexpected behavior. This log is often more useful than a long description written after you have forgotten what happened.";

const FAILURE_SUFFIX =
  "Before marking the day complete, create a check or note that makes each of these failures visible.";

const EVIDENCE_NOTE_PARTS = [
  "Problem — what engineering risk or user need did the day address?",
  "Decision — which design did you choose, and what simpler alternative did you reject?",
  "Measurement — what test, metric or reproducible command supports the claim?",
  "Limitation — what remains uncertain, brittle or outside the current scope?",
];

const REMEMBER = [
  "Do not confuse a model's confidence with verified correctness.",
  "Keep state and permissions explicit when the system can act or continue over time.",
  "Prefer a measurable baseline before adding complexity.",
  "Preserve provenance and observability so failures can be reconstructed.",
  "Publish evidence that shows engineering judgment, not only finished UI.",
];

/** Template definition for concepts the pack lists without a unique one. */
function conceptTemplate(name: string): string {
  return `${name} is part of the day's engineering contract. Define its input, output, assumptions, failure modes and measurable success criteria before integrating it with the rest of the system.`;
}

// ── per-day reading data ──────────────────────────────────────────────────────

export interface ReadingConcept {
  name: string;
  /** unique definition from the pack; omitted = the standard contract line */
  def?: string;
}

export interface ReadingData {
  rule: RuleKey;
  /** section 1 — the engineering problem (project framing appended automatically) */
  problem: string;
  concepts: ReadingConcept[];
  walkthrough: string[];
  failures: FailureKey;
  gate: string;
  evidence: string;
  refs: { label: string; url: string }[];
}

export interface Reading {
  sections: LessonSection[];
  references: { label: string; url: string }[];
}

/** Expand one day's pack data into the full structured reading. */
export function buildReading(
  d: ReadingData,
  project?: { id: string; name: string }
): Reading {
  const purpose = project ? PROJECT_PURPOSE[project.id] : undefined;

  const problemBlocks: Block[] = [
    { t: "p", text: d.problem },
    ...(project && purpose
      ? ([
          {
            t: "p",
            text: `This lesson belongs to ${project.name}. The project's larger purpose is: ${purpose} The daily task should therefore strengthen the project rather than create an isolated notebook that will be discarded tomorrow.`,
          },
        ] as Block[])
      : []),
    { t: "callout", kind: "warn", title: "When is today complete?", text: COMPLETE_NOTE },
    { t: "h", text: "A practical mental model" },
    { t: "p", text: MODEL_INTRO },
    { t: "list", items: MODEL_QUESTIONS, ordered: true },
    {
      t: "callout",
      kind: "info",
      title: "The production rule for this topic",
      text: RULES[d.rule],
    },
  ];

  const conceptBlocks: Block[] = [
    ...d.concepts.flatMap((c): Block[] => [
      { t: "h", text: c.name },
      { t: "p", text: c.def ?? conceptTemplate(c.name) },
    ]),
    { t: "h", text: "How the pieces fit together" },
    { t: "p", text: FIT_TEXT_1 },
    { t: "p", text: FIT_TEXT_2 },
  ];

  const buildBlocks: Block[] = [
    { t: "list", items: d.walkthrough, ordered: true },
    { t: "callout", kind: "info", title: "Keep an experiment log", text: LOG_NOTE },
    { t: "h", text: "Common failure modes" },
    { t: "list", items: FAILURES[d.failures] },
    { t: "p", text: FAILURE_SUFFIX },
  ];

  const evidenceBlocks: Block[] = [
    { t: "callout", kind: "info", title: "Completion gate", text: d.gate },
    { t: "p", text: `Evidence to publish: ${d.evidence}` },
    { t: "h", text: "A strong evidence note has four short parts" },
    { t: "list", items: EVIDENCE_NOTE_PARTS },
    { t: "h", text: "What you should remember" },
    { t: "list", items: REMEMBER },
    { t: "h", text: "Quick self-check" },
    {
      t: "list",
      items: [
        `Explain in your own words why "${d.concepts[0]?.name}" matters to this project.`,
        `What evidence would prove that today's result meets this completion gate: "${d.gate}"?`,
        "Name one failure mode that a happy-path demo would miss.",
        "Which part of today's system should be deterministic, and which part genuinely benefits from a model?",
        "How would you describe today's engineering decision in a job interview without listing tools only?",
      ],
    },
    ...(project && PROJECT_SIGNAL[project.id]
      ? ([
          {
            t: "callout",
            kind: "job",
            title: "Project signal for employers",
            text: PROJECT_SIGNAL[project.id],
          },
        ] as Block[])
      : []),
  ];

  return {
    sections: [
      { id: "rd-problem", title: "The engineering problem", blocks: problemBlocks },
      { id: "rd-concepts", title: "Concepts you must understand", blocks: conceptBlocks },
      { id: "rd-build", title: "Walkthrough of today's build", blocks: buildBlocks },
      { id: "rd-evidence", title: "Completion, evidence and self-check", blocks: evidenceBlocks },
    ],
    references: d.refs,
  };
}
