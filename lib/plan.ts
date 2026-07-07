// 100 Days of Modern AI — full curriculum data (2026 edition)
// Phases: raw-API foundations → evals → context & cost → agents → MCP → retrieval → security → capstone.
// Every 7th day is a Rest + Recap + Showcase day.

export type ProjectId =
  | "P1"
  | "P2"
  | "P3"
  | "P4"
  | "P5"
  | "P6"
  | "P7"
  | "P8"
  | "CAP";

export interface DayPlan {
  day: number;
  title: string;
  /** Viewer resource, ~30–45 min */
  resource: string;
  /** Viewer build task, ~45–75 min */
  build: string;
  doneWhen?: string;
  videoTitle?: string;
  projects: ProjectId[];
  isRest: boolean;
}

export interface WeekPlan {
  week: number;
  title: string;
  start: number;
  end: number;
}

export interface Project {
  id: ProjectId;
  name: string;
  /** Short label for badges, e.g. "P2 · Eval harness" */
  short: string;
  /** One-line card blurb */
  blurb: string;
  start: number;
  end: number;
  /** The day this project ships as a standalone portfolio piece */
  shipDay: number;
  flagship?: boolean;
  description: string;
  doneWhen: string;
}

export const WEEKS: WeekPlan[] = [
  { week: 1, title: "Foundations from scratch", start: 1, end: 7 },
  { week: 2, title: "Evals begin: error analysis", start: 8, end: 14 },
  { week: 3, title: "Evals into CI, golden datasets, RAG eval", start: 15, end: 21 },
  { week: 4, title: "Context engineering + cost begin", start: 22, end: 28 },
  { week: 5, title: "Memory, structured output, finish P3", start: 29, end: 35 },
  { week: 6, title: "Agents from scratch", start: 36, end: 42 },
  { week: 7, title: "Agent patterns & orchestration", start: 43, end: 49 },
  { week: 8, title: "Long-horizon agents & harnesses", start: 50, end: 56 },
  { week: 9, title: "Buffer, tasters, mid-challenge case study", start: 57, end: 63 },
  { week: 10, title: "Build an MCP server", start: 64, end: 70 },
  { week: 11, title: "Retrieval depth", start: 71, end: 77 },
  { week: 12, title: "AI security & red-teaming", start: 78, end: 84 },
  { week: 13, title: "Guardrails, defense, ship P8", start: 85, end: 91 },
  { week: 14, title: "Capstone + client-acquisition sprint", start: 92, end: 100 },
];

export const PROJECTS: Project[] = [
  {
    id: "P1",
    name: "Hand-rolled RAG Q&A",
    short: "RAG Q&A",
    blurb: "RAG over your own docs — no framework, fully traced.",
    start: 1,
    end: 7,
    shipDay: 7,
    description:
      "RAG over local docs with your own chunking, embeddings, FAISS/Chroma store, retrieve + generate, served via FastAPI with Phoenix tracing — no RAG framework.",
    doneWhen:
      "A user asks a question over their own documents and gets a grounded, cited answer, and every call is traceable.",
  },
  {
    id: "P2",
    name: "Eval harness + aligned judge",
    short: "Eval harness",
    blurb: "Error analysis → LLM judge aligned to you → CI gate.",
    start: 8,
    end: 21,
    shipDay: 21,
    flagship: true,
    description:
      "Trace collection → error analysis → named failure taxonomy → code-based + LLM-as-judge evals → judge aligned to human labels (Cohen's Kappa) → golden dataset → promptfoo/Ragas in a CI regression gate.",
    doneWhen:
      "A PR that degrades quality fails CI automatically, and the judge agrees with your labels on a held-out set.",
  },
  {
    id: "P3",
    name: "AI Reliability & Cost Audit",
    short: "Cost audit",
    blurb: "Cut real cost, prove quality — the productized audit.",
    start: 22,
    end: 35,
    shipDay: 35,
    description:
      "Applied to your own P1 system: context audit, prompt caching, compaction, model routing, cost/latency dashboard, plus a repeatable audit checklist — the productized-service spec.",
    doneWhen:
      "A public case study reports a real % cost reduction and a measured quality delta, with a reusable checklist.",
  },
  {
    id: "P4",
    name: "Agent from scratch w/ tools",
    short: "Agent",
    blurb: "A while-loop agent with sharp, namespaced tools.",
    start: 36,
    end: 42,
    shipDay: 42,
    description:
      "A while-loop think→act→observe agent, no framework, 3+ well-designed namespaced tools, error handling, and its own eval suite.",
    doneWhen:
      "The agent reliably solves tasks needing its tools and passes trajectory + final-answer evals.",
  },
  {
    id: "P5",
    name: "Long-horizon agent + harness",
    short: "Harness",
    blurb: "Durable state, self-verification, resumes after restarts.",
    start: 50,
    end: 56,
    shipDay: 56,
    description:
      "Durable external state, self-verification (doer-verifier), reflection, context-awareness + compaction under a hard cost cap.",
    doneWhen:
      "The agent resumes a multi-session task after a “restart” and completes it within budget.",
  },
  {
    id: "P6",
    name: "MCP server over hand-built DB",
    short: "MCP server",
    blurb: "Your SQLite DB, exposed to real clients via MCP.",
    start: 64,
    end: 70,
    shipDay: 70,
    description:
      "A real seeded SQLite DB exposed via an MCP server (tools + resources + prompts), namespaced, connected to a real MCP client like Claude Desktop, with tool-use evals.",
    doneWhen:
      "A real client drives your database through MCP and tool-selection accuracy is measured.",
  },
  {
    id: "P7",
    name: "Hybrid-search retrieval engine",
    short: "Retrieval",
    blurb: "BM25 + vectors + rerank, measured properly.",
    start: 71,
    end: 77,
    shipDay: 77,
    description:
      "BM25 + vectors fused with RRF, query rewriting/HyDE, reranking, contextual chunks, evaluated with recall@k / MRR / context-precision.",
    doneWhen:
      "Hybrid + rerank measurably beats naive vector search on your golden queries.",
  },
  {
    id: "P8",
    name: "Red-team + guardrails kit",
    short: "Red-team",
    blurb: "Attack your own apps, then block every exploit.",
    start: 78,
    end: 89,
    shipDay: 89,
    description:
      "OWASP LLM + Agentic threat models, attacks via garak/promptfoo/PyRIT (incl. multi-turn crescendo), then input/output guardrails, least-privilege tool scopes, and security regression tests in CI.",
    doneWhen:
      "The guardrails block your own documented attacks and the security suite stays green in CI.",
  },
  {
    id: "CAP",
    name: "Final capstone",
    short: "Capstone",
    blurb: "Retrieval + agent + evals + security in one system.",
    start: 90,
    end: 100,
    shipDay: 100,
    description:
      "One polished system combining retrieval + agent + evals + security, with a full case study — plus the client-acquisition sprint (portfolio, repositioning, productized audit offer).",
    doneWhen:
      "It passes its own evals, survives its own red-team, and ships with a public case study and metrics.",
  },
];

/** The public cohort's shared Day-1 date ("Align with cohort" in onboarding). */
export const COHORT_START_DATE = "2026-06-01";

/** Monorepo with one folder per day (day-001 … day-100). */
export const GITHUB_REPO = "https://github.com/aixahmad/100-days-of-modern-ai";

export const CREATOR = {
  name: "Ahmad · AI Radar",
  handle: "@aixahmad",
  tagline: "teaching modern AI, in public",
};

export function pad3(n: number): string {
  return ("00" + n).slice(-3);
}

function d(
  day: number,
  title: string,
  resource: string,
  build: string,
  extra: Partial<Omit<DayPlan, "day" | "title" | "resource" | "build">> = {}
): DayPlan {
  return { day, title, resource, build, projects: [], isRest: false, ...extra };
}

const REST = "Rest + Recap + Showcase";

export const DAYS: DayPlan[] = [
  // ── Week 1 — Foundations from scratch (P1) ──────────────────────────────
  d(1, "Raw LLM API, no SDK sugar",
    "Anthropic Messages API docs + OpenAI chat completions reference",
    "Call Claude/OpenAI with raw httpx; print tokens & cost from the usage field",
    { projects: ["P1"] }),
  d(2, "Tokenization deep-dive",
    "Karpathy “Let's build the GPT Tokenizer” (video + fast.ai text version) + tiktokenizer web app",
    "Implement a mini BPE: get_stats + merge on a text file; compare token counts EN vs Urdu",
    { projects: ["P1"] }),
  d(3, "Embeddings from first principles",
    "Microsoft Learn “Develop a RAG Solution — Generate Embeddings”",
    "Embed 20 sentences; compute cosine similarity by hand (numpy); rank nearest neighbors",
    { projects: ["P1"] }),
  d(4, "Chunking that doesn't suck",
    "Anthropic “Contextual Retrieval” + pguso/rag-from-scratch chunking module",
    "Write 3 chunkers (fixed, sentence-window, overlap); measure chunk counts",
    { projects: ["P1"] }),
  d(5, "The RAG loop, hand-rolled",
    "langchain-ai/rag-from-scratch notebooks (concepts) + KDnuggets “7 Steps to Build a Simple RAG”",
    "Wire ingest→chunk→embed→store (FAISS/Chroma)→retrieve→generate, no RAG framework",
    { projects: ["P1"] }),
  d(6, "Serve it: FastAPI + tracing",
    "FastAPI “First Steps” + Arize Phoenix tracing quickstart",
    "Wrap the RAG loop in a FastAPI /ask endpoint; add Phoenix/OpenInference tracing",
    { projects: ["P1"] }),
  d(7, REST,
    "Re-read your week's READMEs",
    "Polish P1 repo README; post demo GIF; review 2 viewers' repos on Discord",
    { projects: ["P1"], isRest: true }),

  // ── Week 2 — Evals begin: error analysis (P2) ───────────────────────────
  d(8, "Why evals are the moat",
    "Hamel Husain “LLM Evals: Everything You Need to Know” (evals-faq)",
    "Collect 30–50 real traces from your P1 RAG into a JSONL dataset",
    { doneWhen: "You have a trace dataset ready to analyze", videoTitle: "Day 8: Evals — yehi hai asli hunar", projects: ["P2"] }),
  d(9, "Error analysis (open coding)",
    "Hamel & Shreya lesson notes: error analysis, open/axial coding",
    "Hand-label your 50 traces; write open-ended failure notes on the FIRST failure per trace",
    { doneWhen: "50 traces labeled with free-text failure notes", videoTitle: "Day 9: Error analysis — insaan ki tarah dekho", projects: ["P2"] }),
  d(10, "Failure taxonomy (axial coding)",
    "Hamel's “Why is error analysis so important” FAQ",
    "Cluster notes into 5–8 named failure modes; count frequency",
    { doneWhen: "A ranked failure-mode table for your app", videoTitle: "Day 10: Failure modes ko group karo", projects: ["P2"] }),
  d(11, "Code-based evals first",
    "Eugene Yan on X: “don't neglect simple code-based evaluators such as checking for parsing structure, using regex, or executing tool calls”",
    "Write assertions for the failures a regex/parser CAN catch",
    { doneWhen: "≥3 deterministic checks run on the dataset", videoTitle: "Day 11: Pehle code se test karo, phir LLM se", projects: ["P2"] }),
  d(12, "LLM-as-judge, done right",
    "Eugene Yan “Evaluating the Effectiveness of LLM-Evaluators” + Evidently LLM-as-judge guide",
    "Write a binary pass/fail judge prompt for ONE subjective failure mode",
    { doneWhen: "Judge returns pass/fail with reasoning on all traces", videoTitle: "Day 12: LLM judge ko insaan jitna accurate kaise banayein", projects: ["P2"] }),
  d(13, "Aligning the judge to humans",
    "Eugene Yan “AlignEval” + Cohen's Kappa explainer (Han-Chung Lee)",
    "Measure judge-vs-your-labels agreement (Cohen's Kappa); iterate prompt until aligned",
    { doneWhen: "Kappa reported; judge agrees with you on a held-out set", videoTitle: "Day 13: Judge ko human ke saath align karo (Kappa)", projects: ["P2"] }),
  d(14, REST,
    "Review week",
    "Write P2 README; showcase your failure-mode table",
    { doneWhen: "Aligned judge + failure taxonomy documented", videoTitle: "Day 14: Hafta 2 recap — judge kitna accurate nikla?", projects: ["P2"], isRest: true }),

  // ── Week 3 — Evals into CI, golden datasets, RAG eval (P2) ──────────────
  d(15, "Golden datasets",
    "Hamel evals-faq (synthetic data section)",
    "Curate a 30-example golden set (inputs + expected behavior), incl. synthetic edge cases",
    { doneWhen: "Versioned golden.jsonl in repo", videoTitle: "Day 15: Golden dataset banao", projects: ["P2"] }),
  d(16, "Eval frameworks tour",
    "promptfoo docs + DeepEval docs + Ragas docs",
    "Re-implement your judge as a promptfoo assert; run the golden set",
    { doneWhen: "promptfoo config runs and prints a pass grid", videoTitle: "Day 16: promptfoo se evals chalao", projects: ["P2"] }),
  d(17, "RAG-specific metrics",
    "DeepLearning.AI “Building and Evaluating Advanced RAG” (RAG triad: context relevance, groundedness, answer relevance) + Ragas faithfulness/context-precision",
    "Add faithfulness + context-precision metrics to P1 via Ragas or Phoenix",
    { doneWhen: "RAG triad scores computed on golden set", videoTitle: "Day 17: RAG ka triad — kya jawab sach hai?", projects: ["P2"] }),
  d(18, "CI regression gates",
    "Hamel evals-faq (CI) + promptfoo CI docs",
    "GitHub Action that runs evals on every PR and fails if pass-rate drops below threshold",
    { doneWhen: "Red X on a PR that regresses quality", videoTitle: "Day 18: CI mein eval gate lagao — regression pakdo", projects: ["P2"] }),
  d(19, "Evaluating agents/trajectories",
    "DeepLearning.AI “Evaluating AI Agents” (Arize AI; John Gilhuly & Aman Khan)",
    "Add a trajectory/tool-call correctness check to a multi-step trace",
    { doneWhen: "Tool-call correctness measured on sample", videoTitle: "Day 19: Agent ki trajectory ko evaluate karo", projects: ["P2"] }),
  d(20, "The eval flywheel",
    "Shreya Shankar “Data Flywheels for LLM Applications” + Eugene Yan “An LLM-as-Judge Won't Save The Product—Fixing Your Process Will”",
    "Document a weekly review→label→improve loop; set a cadence",
    { doneWhen: "A written flywheel SOP in the repo", videoTitle: "Day 20: Data flywheel — evals ko zinda rakho", projects: ["P2"] }),
  d(21, REST,
    "Review week",
    "Ship P2 (eval harness + aligned judge + CI) as a portfolio piece",
    { doneWhen: "P2 is a standalone repo with README + CI badge", videoTitle: "Day 21: Hafta 3 recap — eval harness tayyar", projects: ["P2"], isRest: true }),

  // ── Week 4 — Context engineering + cost begin (P3) ──────────────────────
  d(22, "Context engineering intro",
    "Anthropic “Effective context engineering for AI agents” (Sep 29, 2025)",
    "Audit your P1 prompt; measure tokens per call; identify waste",
    { doneWhen: "Token budget table for your RAG", videoTitle: "Day 22: Context engineering — prompt nahi, context", projects: ["P3"] }),
  d(23, "Context rot & “lost in the middle”",
    "Chroma “Context Rot” report + “Lost in the Middle” (TACL 2024)",
    "Test retrieval quality as you stuff more/less context; chart accuracy vs tokens",
    { doneWhen: "A chart showing the accuracy/token tradeoff", videoTitle: "Day 23: Zyada context = behtar? Nahi!", projects: ["P3"] }),
  d(24, "Prompt caching for cost",
    "Anthropic prompt-caching docs",
    "Add prompt caching to repeated-prefix calls; measure $ saved",
    { doneWhen: "Before/after cost numbers logged", videoTitle: "Day 24: Prompt caching se paisa bachao", projects: ["P3"] }),
  d(25, "Compaction & summarization",
    "Anthropic context-engineering post (compaction)",
    "Implement conversation compaction (summarize old turns) for a long chat",
    { doneWhen: "Long chat stays under a token ceiling", videoTitle: "Day 25: Purani baat ko compact karo", projects: ["P3"] }),
  d(26, "Model routing for cost",
    "Anthropic “Building Effective Agents” (model selection) + OpenAI “A Practical Guide to Building Agents”",
    "Route easy queries to a small/cheap model, hard ones to a big model",
    { doneWhen: "Router cuts cost on a mixed workload", videoTitle: "Day 26: Sasta model kab, mehanga kab?", projects: ["P3"] }),
  d(27, "Cost/latency dashboard",
    "Phoenix cost tracking",
    "Add per-request cost + latency to your traces; build a simple summary view",
    { doneWhen: "Dashboard shows $ and ms per endpoint", videoTitle: "Day 27: Cost aur latency ka dashboard", projects: ["P3"] }),
  d(28, REST,
    "Review week",
    "Draft P3 “AI Reliability & Cost Audit” case study on your own RAG",
    { doneWhen: "P3 case study v1 with a real % cost reduction", videoTitle: "Day 28: Hafta 4 recap — kitna cost bacha?", projects: ["P3"], isRest: true }),

  // ── Week 5 — Memory, structured output, finish P3 ───────────────────────
  d(29, "Memory tools (persistent)",
    "Anthropic memory-tool docs / context-engineering post",
    "Add a file-based memory store (CRUD) to a chat agent",
    { doneWhen: "Agent recalls a fact across sessions", videoTitle: "Day 29: Agent ko yaad dilana sikhao", projects: ["P3", "P5"] }),
  d(30, "Structured outputs & validation",
    "Pydantic docs + provider JSON-mode docs",
    "Force JSON output validated by Pydantic; handle parse failures",
    { doneWhen: "Invalid outputs are caught and retried", videoTitle: "Day 30: Structured output — JSON hamesha sahi", projects: ["P3"] }),
  d(31, "Programmatic tool calling",
    "Anthropic context-engineering (programmatic tool calling)",
    "Let the model emit code that calls tools and returns only the final result",
    { doneWhen: "Context stays small on a multi-tool task", videoTitle: "Day 31: Tool ko code se call karo", projects: ["P3"] }),
  d(32, "Improving accuracy systematically",
    "DeepLearning.AI “Improving Accuracy of LLM Applications” (AMD/Meta)",
    "Apply prompt + eval + memory tuning to lift your golden-set pass rate",
    { doneWhen: "Documented accuracy gain vs baseline", videoTitle: "Day 32: Accuracy ko systematically barhao", projects: ["P2", "P3"] }),
  d(33, "The audit methodology",
    "Hamel evals-faq + your own P2/P3 work",
    "Write a repeatable “Reliability & Cost Audit” checklist (the productized-service spec)",
    { doneWhen: "A 1-page audit SOP anyone can follow", videoTitle: "Day 33: Reliability audit ka formula", projects: ["P3"] }),
  d(34, "Package the audit as an offer",
    "Freelance case-study blueprint (problem→approach→result)",
    "Turn P3 into a public case study: problem, method, % cost cut, quality delta",
    { doneWhen: "Publishable case study with metrics", videoTitle: "Day 34: Audit ko service banao", projects: ["P3"] }),
  d(35, REST,
    "Review",
    "Ship P3; post the case study; invite audits from Discord",
    { doneWhen: "P3 is a standalone case study others can copy", videoTitle: "Day 35: Hafta 5 recap — audit service live", projects: ["P3"], isRest: true }),

  // ── Week 6 — Agents from scratch (P4) ───────────────────────────────────
  d(36, "What an agent really is",
    "Anthropic “Building Effective Agents” (workflows vs agents)",
    "Write the definition + a decision checklist: when NOT to build an agent",
    { doneWhen: "A README section arguing agent vs workflow", videoTitle: "Day 36: Agent ya workflow? Pehle socho", projects: ["P4"] }),
  d(37, "The agent loop, hand-rolled",
    "Victor Dibia “The Agent Execution Loop” + “Build an AI Agent from Scratch — No Frameworks” (DEV)",
    "Write a while-loop agent (think→act→observe) with ONE tool, no framework",
    { doneWhen: "Agent solves a task needing the tool", videoTitle: "Day 37: Agent loop — sirf Python aur while loop", projects: ["P4"] }),
  d(38, "Tools as functions + schema",
    "Anthropic “Writing effective tools for AI agents”",
    "Add 3 tools with JSON schemas; handle tool errors gracefully",
    { doneWhen: "Agent picks the right tool for varied inputs", videoTitle: "Day 38: Tools likhna — agent ke liye, agent ke saath", projects: ["P4"] }),
  d(39, "Tool design & namespacing",
    "Anthropic writing-tools post (namespacing, consolidation)",
    "Refactor tools: consolidate (e.g., search_contacts not list_contacts); namespace",
    { doneWhen: "Fewer, sharper tools; agent less confused", videoTitle: "Day 39: Kam tools, behtar tools", projects: ["P4"] }),
  d(40, "Prompt-chaining workflow",
    "Anthropic “Building Effective Agents” (prompt chaining, routing)",
    "Build a deterministic workflow variant of a task; compare to the agent",
    { doneWhen: "Table: workflow vs agent on cost/reliability", videoTitle: "Day 40: Kabhi kabhi workflow hi kaafi hai", projects: ["P4"] }),
  d(41, "Evaluate your agent",
    "DeepLearning.AI “Evaluating AI Agents” (Arize) + your P2 harness",
    "Run trajectory + final-answer evals on the agent; catch a failure mode",
    { doneWhen: "Agent has its own eval suite", videoTitle: "Day 41: Apne agent ko test karo", projects: ["P4"] }),
  d(42, REST,
    "Review",
    "Ship P4 (agent-from-scratch + tools + evals)",
    { doneWhen: "P4 standalone repo works and is evaluated", videoTitle: "Day 42: Hafta 6 recap — agent zinda hai", projects: ["P4"], isRest: true }),

  // ── Week 7 — Agent patterns & orchestration ─────────────────────────────
  d(43, "Evaluator-optimizer loop",
    "Anthropic “Building Effective Agents” (evaluator-optimizer)",
    "Add a generate→critique→revise loop to improve outputs",
    { doneWhen: "Quality improves over iterations, measured", videoTitle: "Day 43: Agent apni ghalti khud sudhare" }),
  d(44, "Orchestrator-workers",
    "Anthropic (orchestrator-workers pattern)",
    "Build an orchestrator that delegates subtasks to worker calls",
    { doneWhen: "Orchestrator completes a multi-part task", videoTitle: "Day 44: Orchestrator — kaam baant do" }),
  d(45, "Multi-agent tradeoffs",
    "Anthropic multi-agent research write-up + “Building Effective Agents”",
    "Add a doer-verifier pair; measure token cost of multi-agent",
    { doneWhen: "You can state when multi-agent is worth it", videoTitle: "Day 45: Multi-agent — faida ya kharcha?" }),
  d(46, "Human-in-the-loop checkpoints",
    "Anthropic “human-agent teams” (verification, checkpoints)",
    "Add an approval checkpoint before an irreversible action",
    { doneWhen: "Agent pauses for human OK on risky steps", videoTitle: "Day 46: Khatarnak kaam se pehle insaan se pucho" }),
  d(47, "Guardrails on agents",
    "OpenAI “Practical Guide to Building Agents” (guardrails)",
    "Add input/output guardrails; block out-of-scope requests",
    { doneWhen: "Guardrail blocks a bad request in a demo", videoTitle: "Day 47: Agent pe guardrails lagao" }),
  d(48, "Framework literacy (one day)",
    "Hugging Face Agents Course (smolagents/LangGraph units)",
    "Rebuild your agent in one framework; note what it hides",
    { doneWhen: "You can map framework calls to your loop", videoTitle: "Day 48: Framework woh chhupata kya hai?" }),
  d(49, REST,
    "Review",
    "Consolidate agent patterns doc",
    { doneWhen: "Patterns cheatsheet in repo", videoTitle: "Day 49: Hafta 7 recap — patterns clear?", isRest: true }),

  // ── Week 8 — Long-horizon agents & harnesses (P5) ───────────────────────
  d(50, "Long-horizon problem",
    "Anthropic “Effective harnesses for long-running agents” (Nov 26, 2025)",
    "Design a task that spans multiple context windows; document the memory problem",
    { doneWhen: "Written spec of a long-horizon task", videoTitle: "Day 50: Ghanton chalne wala agent — challenge kya hai", projects: ["P5"] }),
  d(51, "Harness: external state",
    "Anthropic harnesses post (session state)",
    "Give the agent a durable to-do/state file it reads at each session start",
    { doneWhen: "Agent resumes work after a “restart”", videoTitle: "Day 51: Har session yaad rakhe kaam kahan tha", projects: ["P5"] }),
  d(52, "Verification in the harness",
    "Anthropic harnesses post (doer-verifier)",
    "Add self-verification (tests/rubrics) before handoff",
    { doneWhen: "Agent verifies its own work each cycle", videoTitle: "Day 52: Kaam check karke aage barho", projects: ["P5"] }),
  d(53, "Reflection & self-correction",
    "Anthropic harnesses + human-agent teams (reflection)",
    "Add a reflection step that reviews past misses and adjusts",
    { doneWhen: "Agent improves across runs, logged", videoTitle: "Day 53: Agent apni misses se seekhe", projects: ["P5"] }),
  d(54, "Cost control on long runs",
    "Anthropic context-awareness/compaction",
    "Add context-awareness (remaining budget) + compaction to the long-horizon agent",
    { doneWhen: "Long run stays under a hard token/$ cap", videoTitle: "Day 54: Lambe run mein paisa control", projects: ["P5", "P3"] }),
  d(55, "End-to-end long-horizon eval",
    "Your P2 harness + trajectory evals",
    "Evaluate the long-horizon agent over a full multi-session task",
    { doneWhen: "Pass/fail on a realistic long task", videoTitle: "Day 55: Poore lambe task ko evaluate karo", projects: ["P5"] }),
  d(56, REST,
    "Review",
    "Ship P5 (long-horizon agent + memory + harness)",
    { doneWhen: "P5 standalone, resumes across sessions", videoTitle: "Day 56: Hafta 8 recap — long-horizon agent tayyar", projects: ["P5"], isRest: true }),

  // ── Week 9 — Buffer, tasters, mid-challenge case study ──────────────────
  d(57, "Computer-use taster",
    "DeepLearning.AI “Building toward Computer Use with Anthropic”",
    "Run a sandboxed computer-use demo; note safety limits",
    { doneWhen: "A recorded computer-use demo", videoTitle: "Day 57: Computer use — agent screen chalaye" }),
  d(58, "Voice taster",
    "DeepLearning.AI “Voice for AI Agents and Applications” (Vocal Bridge)",
    "Add a voice layer to an existing agent (one integration pattern)",
    { doneWhen: "Voice in/out works on a demo", videoTitle: "Day 58: Apne agent ko awaaz do" }),
  d(59, "Refactor & test coverage",
    "pytest docs",
    "Add tests to your two strongest projects",
    { doneWhen: "Tests pass in CI", videoTitle: "Day 59: Code ko test se mazboot karo" }),
  d(60, "Mid-challenge case study",
    "Freelance case-study blueprint",
    "Write a “Days 1–59: what I built” case study with metrics",
    { doneWhen: "Public mid-point case study", videoTitle: "Day 60: Aadha challenge — kya seekha" }),
  d(61, "MCP: the problem it solves",
    "Hugging Face MCP Course Unit 1 (M×N integration problem)",
    "Diagram how MCP replaces custom integrations",
    { doneWhen: "A clear MCP explainer in your words", videoTitle: "Day 61: MCP kya hai aur kyun zaroori" }),
  d(62, "MCP architecture",
    "HF MCP Course Unit 1–2 + DeepLearning.AI “MCP: Build Rich-Context AI Apps with Anthropic” (Elie Schoppik)",
    "Map client/server/tools/resources/prompts of MCP",
    { doneWhen: "You can label every MCP component", videoTitle: "Day 62: MCP ka architecture kholo" }),
  d(63, REST,
    "Review",
    "Consolidate; plan the MCP build",
    { doneWhen: "MCP plan documented", videoTitle: "Day 63: Hafta 9 recap — MCP se pehle", isRest: true }),

  // ── Week 10 — Build an MCP server (P6) ──────────────────────────────────
  d(64, "Hand-build the database",
    "SQLite docs",
    "Design + seed a small real DB (e.g., a bookstore/inventory)",
    { doneWhen: "Queryable local DB with real data", videoTitle: "Day 64: Apna database khud banao", projects: ["P6"] }),
  d(65, "First MCP server",
    "HF MCP Course Unit 2 (SDK) + FastMCP",
    "Expose ONE tool (query the DB) via an MCP server",
    { doneWhen: "An MCP client can call your tool", videoTitle: "Day 65: Pehla MCP server — DB pe tool", projects: ["P6"] }),
  d(66, "Resources & prompts",
    "HF MCP Course Unit 2",
    "Add MCP resources (read-only data) and a prompt template",
    { doneWhen: "Client sees resources + prompt", videoTitle: "Day 66: MCP resources aur prompts", projects: ["P6"] }),
  d(67, "Multiple tools + namespacing",
    "Anthropic writing-tools (namespacing)",
    "Add search/create/update tools; namespace them",
    { doneWhen: "Agent uses your MCP server end-to-end", videoTitle: "Day 67: Ek server, kai tools", projects: ["P6"] }),
  d(68, "Connect to a real client",
    "HF MCP Course Unit 3",
    "Wire your server into Claude Desktop / an MCP-capable client",
    { doneWhen: "Real client drives your DB via MCP", videoTitle: "Day 68: Asli client se MCP jodo", projects: ["P6"] }),
  d(69, "Evaluate the MCP tools",
    "Anthropic tool-evaluation cookbook",
    "Generate eval tasks; measure tool-selection accuracy",
    { doneWhen: "Tool-use eval report", videoTitle: "Day 69: MCP tools ko test karo", projects: ["P6"] }),
  d(70, REST,
    "Review",
    "Ship P6 (MCP server over hand-built DB)",
    { doneWhen: "P6 standalone, works with a real client", videoTitle: "Day 70: Hafta 10 recap — MCP server live", projects: ["P6"], isRest: true }),

  // ── Week 11 — Retrieval depth (P7) ──────────────────────────────────────
  d(71, "Keyword vs semantic",
    "DeepLearning.AI “Retrieval Augmented Generation (RAG)” (search techniques)",
    "Add BM25 keyword search alongside your vector search",
    { doneWhen: "Both retrievers run on the same corpus", videoTitle: "Day 71: Keyword vs semantic search", projects: ["P7"] }),
  d(72, "Hybrid search + fusion",
    "pguso/rag-from-scratch (RRF, weighted fusion)",
    "Combine BM25 + vectors with Reciprocal Rank Fusion",
    { doneWhen: "Hybrid beats either alone on your eval", videoTitle: "Day 72: Hybrid search — dono ka faida", projects: ["P7"] }),
  d(73, "Query rewriting & expansion",
    "Dataquest “Build a RAG from Scratch” (multi-query, HyDE) + rag-from-scratch query-rewriting",
    "Add multi-query expansion; test on vocabulary-gap queries",
    { doneWhen: "Recall improves on hard queries", videoTitle: "Day 73: Query ko behtar likho (multi-query, HyDE)", projects: ["P7"] }),
  d(74, "Reranking",
    "Dataquest RAG post (Cohere Rerank) + open reranker",
    "Add a reranking stage; measure precision lift",
    { doneWhen: "Rerank improves top-k precision", videoTitle: "Day 74: Reranking — behtareen chunk upar", projects: ["P7"] }),
  d(75, "Contextual retrieval",
    "Anthropic “Contextual Retrieval”",
    "Add context to chunks before embedding; measure retrieval gain",
    { doneWhen: "Contextual chunks beat naive chunks", videoTitle: "Day 75: Chunk ko context do", projects: ["P7"] }),
  d(76, "Retrieval metrics done right",
    "Hamel evals-faq (similarity metrics for retrieval) + Ragas context metrics",
    "Build a retrieval eval: recall@k, MRR, context-precision",
    { doneWhen: "Retrieval scored on golden queries", videoTitle: "Day 76: Retrieval ko sahi metric se naapo", projects: ["P7"] }),
  d(77, REST,
    "Review",
    "Ship P7 (hybrid-search retrieval engine)",
    { doneWhen: "P7 standalone with a metrics report", videoTitle: "Day 77: Hafta 11 recap — retrieval engine tayyar", projects: ["P7"], isRest: true }),

  // ── Week 12 — AI security & red-teaming (P8) ────────────────────────────
  d(78, "OWASP LLM Top 10",
    "OWASP Top 10 for LLM Applications (2025)",
    "Map each risk to your own P1/P4 apps",
    { doneWhen: "A risk register for your apps", videoTitle: "Day 78: OWASP LLM Top 10 — apne app pe", projects: ["P8"] }),
  d(79, "Prompt injection hands-on",
    "OWASP LLM01 + DeepLearning.AI “Red Teaming LLM Applications” (Giskard)",
    "Craft injections that break your RAG; document each",
    { doneWhen: "≥3 working injections on your app", videoTitle: "Day 79: Prompt injection — apne app ko toro", projects: ["P8"] }),
  d(80, "OWASP Agentic Top 10",
    "OWASP “Top 10 for Agentic Applications” (Dec 9, 2025): goal hijack, tool misuse, memory poisoning",
    "Threat-model your agent (P4/P5) against ASI01–ASI10",
    { doneWhen: "Agentic threat model documented", videoTitle: "Day 80: Agentic Top 10 — naye khatre", projects: ["P8"] }),
  d(81, "Automated scan: garak",
    "garak docs (NVIDIA, 120+ probes)",
    "Run garak against your LLM endpoint; triage findings",
    { doneWhen: "garak report with prioritized issues", videoTitle: "Day 81: garak se scan karo", projects: ["P8"] }),
  d(82, "CI red-team: promptfoo",
    "promptfoo redteam docs (plugins: jailbreak, pii, hijacking; OWASP preset)",
    "Add a promptfoo redteam config to CI; block on new vulns",
    { doneWhen: "Red-team gate runs on PRs", videoTitle: "Day 82: promptfoo redteam CI mein", projects: ["P8"] }),
  d(83, "Multi-turn attacks: PyRIT",
    "PyRIT docs (Crescendo, TAP)",
    "Run a multi-turn crescendo attack; see what single-shot scans miss",
    { doneWhen: "A multi-turn exploit documented", videoTitle: "Day 83: PyRIT — multi-turn crescendo attack", projects: ["P8"] }),
  d(84, REST,
    "Review",
    "Draft the guardrails kit design",
    { doneWhen: "Guardrails plan documented", videoTitle: "Day 84: Hafta 12 recap — kitne holes mile?", projects: ["P8"], isRest: true }),

  // ── Week 13 — Guardrails, defense, ship P8 ──────────────────────────────
  d(85, "Input/output guardrails",
    "OpenAI Practical Guide (guardrails) + OWASP mitigations",
    "Build input filters + output validators for injection/PII",
    { doneWhen: "Guardrails block your Day 79–83 attacks", videoTitle: "Day 85: Guardrails jo attacks rok dein", projects: ["P8"] }),
  d(86, "Tool/permission boundaries",
    "OWASP Agentic (excessive agency, ASI mitigations)",
    "Restrict agent tool scopes; add least-privilege + approval",
    { doneWhen: "Agent can't do out-of-scope actions", videoTitle: "Day 86: Agent ko sirf itni azaadi", projects: ["P8"] }),
  d(87, "Regression: security in CI",
    "promptfoo redteam + your CI",
    "Add security regression tests so fixed vulns stay fixed",
    { doneWhen: "Security suite green in CI", videoTitle: "Day 87: Security regression gate", projects: ["P8"] }),
  d(88, "Security audit case study",
    "Freelance case-study blueprint",
    "Write a red-team + guardrails case study (found X, fixed Y)",
    { doneWhen: "Publishable security case study", videoTitle: "Day 88: Security audit case study", projects: ["P8"] }),
  d(89, "Ship P8",
    "Review",
    "Package red-team + guardrails kit as a reusable repo",
    { doneWhen: "P8 standalone, reusable on any LLM app", videoTitle: "Day 89: Red-team + guardrails kit live", projects: ["P8"] }),
  d(90, "Capstone spec",
    "Anthropic “Building Effective Agents” (start simple)",
    "Scope ONE polished capstone combining RAG+agent+evals+security",
    { doneWhen: "Written capstone spec + done-when", videoTitle: "Day 90: Capstone plan — sab kuch jodo", projects: ["CAP"] }),
  d(91, REST,
    "Review",
    "Kickoff capstone build; recruit Discord feedback",
    { doneWhen: "Capstone repo scaffolded", videoTitle: "Day 91: Hafta 13 recap — capstone shuru", projects: ["CAP"], isRest: true }),

  // ── Week 14 — Capstone + client-acquisition sprint (CAP) ────────────────
  d(92, "Capstone build I",
    "Your own stack",
    "Build core: retrieval + agent loop",
    { doneWhen: "Core capstone path works", videoTitle: "Day 92: Capstone build — core tayyar", projects: ["CAP"] }),
  d(93, "Capstone build II + evals",
    "Your P2 harness",
    "Add eval suite + CI gate to capstone",
    { doneWhen: "Capstone has passing evals", videoTitle: "Day 93: Capstone pe evals lagao", projects: ["CAP"] }),
  d(94, "Capstone build III + security",
    "Your P8 kit",
    "Add guardrails + a red-team pass",
    { doneWhen: "Capstone survives your own red-team", videoTitle: "Day 94: Capstone ko secure karo", projects: ["CAP"] }),
  d(95, "Portfolio & case studies",
    "Freelance case-study blueprint (problem→approach→result→metrics)",
    "Assemble all 8 projects + capstone into a portfolio site/README index",
    { doneWhen: "Portfolio index live with metrics", videoTitle: "Day 95: Portfolio banao — 8 projects", projects: ["CAP"] }),
  d(96, "Upwork/LinkedIn repositioning",
    "Freelance positioning patterns (specialize; “use case” story posts)",
    "Rewrite Upwork profile + LinkedIn around “AI Reliability & Cost Audit”; add a specialized profile",
    { doneWhen: "Profiles repositioned to the niche", videoTitle: "Day 96: Upwork profile ko reposition karo", projects: ["CAP"] }),
  d(97, "The productized audit offer",
    "Your P3 audit SOP",
    "Publish a fixed-scope “AI Reliability & Cost Audit” offer (deliverables, price band)",
    { doneWhen: "A public one-page audit offer", videoTitle: "Day 97: Audit offer — scope, fixed price", projects: ["CAP"] }),
  d(98, REST,
    "Review",
    "Community showcase of capstones; peer feedback",
    { doneWhen: "Capstone demo recorded", videoTitle: "Day 98: Hafta 14 recap — capstone demos", projects: ["CAP"], isRest: true }),
  d(99, "Outreach & funnel",
    "Build-in-public + LinkedIn “use case” posts",
    "Turn the 100 days into 3 client-facing posts; send warm outreach to 10 targets",
    { doneWhen: "10 outreach messages sent; posts live", videoTitle: "Day 99: Funnel — content ko client mein badlo", projects: ["CAP"] }),
  d(100, "Ship + retrospective",
    "—",
    "Publish final capstone case study; write a “what 100 days taught me” post; announce audit availability",
    { doneWhen: "Everything public; offer live", videoTitle: "Day 100: Challenge complete — kaam public", projects: ["CAP"] }),
];

export function getDay(n: number): DayPlan | undefined {
  return DAYS[n - 1];
}

export function weekOf(day: number): WeekPlan {
  return WEEKS.find((w) => day >= w.start && day <= w.end)!;
}
