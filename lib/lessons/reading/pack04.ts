// Reading Pack 04 — Days 031–040: Workflows and Tool-Using Agents.

import type { ReadingData } from "./core";

export const PACK04: Record<number, ReadingData> = {
  31: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "Batching improves throughput, while review queues protect quality on uncertain cases. The queue should prioritize by risk and show the original evidence beside the extraction.",
    concepts: [
      { name: "Batch jobs" },
      { name: "Review queues" },
      { name: "Editable fields" },
      { name: "Audit history" },
      {
        name: "Feedback data",
        def: "Feedback becomes useful engineering data only when it is tied to a trace, categorized and converted into a reproducible test.",
      },
    ],
    walkthrough: [
      "Prepare: process a folder asynchronously and show uncertain fields in a minimal review UI.",
      "Implement: save corrections as future eval/training data.",
    ],
    gate: "A reviewer can correct a record and the audit log preserves model output and human change.",
    evidence:
      "Ship P7; website shows 7/20 projects; demo a document from upload to approval.",
    refs: [
      { label: "OpenAI - Background Mode", url: "https://developers.openai.com/api/docs/guides/background" },
      { label: "OpenAI - Webhooks", url: "https://developers.openai.com/api/docs/guides/webhooks" },
      { label: "FastAPI - Documentation", url: "https://fastapi.tiangolo.com/" },
    ],
  },

  32: {
    rule: "boundary",
    failures: "autonomy",
    problem:
      "A deterministic workflow is often better than an agent. Each step should have a narrow input, output and failure policy so it can be tested independently.",
    concepts: [
      { name: "Stage contracts" },
      { name: "Intermediate validation" },
      {
        name: "Gates",
        def: "A regression gate blocks a change when important quality, safety, cost or latency metrics fall below an agreed threshold.",
      },
      { name: "Retries" },
      { name: "Trace structure" },
    ],
    walkthrough: [
      "Create a research-to-brief or support-ticket workflow with classify, retrieve, draft, verify and format stages.",
    ],
    gate: "Every stage has a typed input/output and can be replayed independently.",
    evidence: "Workflow diagram and stage-level metrics.",
    refs: [
      { label: "Anthropic - Building Effective Agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
      { label: "OpenAI - Structured Outputs", url: "https://developers.openai.com/api/docs/guides/structured-outputs" },
    ],
  },

  33: {
    rule: "boundary",
    failures: "cost",
    problem:
      "Routing chooses the correct path; parallelization runs independent paths concurrently. Both create orchestration states that must be visible and recoverable.",
    concepts: [
      {
        name: "Intent routing",
        def: "Routing selects a path based on input type, risk or complexity. A reliable router includes fallback behavior for uncertain classifications.",
      },
      { name: "Sectioning" },
      { name: "Voting" },
      { name: "Concurrency" },
      { name: "Aggregation" },
    ],
    walkthrough: [
      "Prepare: route at least three request types and parallelize two independent checks.",
      "Implement: compare to one monolithic call.",
    ],
    gate: "Routing accuracy and wall-clock improvement are measured on labeled cases.",
    evidence: "Routing matrix and concurrency benchmark.",
    refs: [
      { label: "Anthropic - Building Effective Agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
    ],
  },

  34: {
    rule: "eval",
    failures: "metrics",
    problem:
      "These patterns add controlled model collaboration without granting open-ended autonomy. Their value should be measured against a simpler sequential workflow.",
    concepts: [
      {
        name: "Dynamic task decomposition",
        def: "Decomposition splits a complex request into smaller searches whose evidence can be combined. It is useful when one query contains multiple entities, constraints or time ranges.",
      },
      { name: "Worker contracts" },
      { name: "Critique loops" },
      { name: "Stopping criteria" },
    ],
    walkthrough: [
      "Add an orchestrator that creates worker tasks and an evaluator that requests revision only when a rubric fails.",
    ],
    gate: "The system logs why it created each task and whether an additional iteration improved the rubric score.",
    evidence: "Trace comparison showing useful and wasteful iterations.",
    refs: [
      { label: "Anthropic - Building Effective Agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
      { label: "Hamel Husain - Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/" },
    ],
  },

  35: {
    rule: "boundary",
    failures: "autonomy",
    problem:
      "This lesson turns one part of the project into an explicit engineering system. The objective is to understand the mechanism, expose its assumptions, and create evidence that the result works beyond a single demonstration.",
    concepts: [
      { name: "Cost/reliability/flexibility trade-offs" },
      { name: "Pattern selection" },
      { name: "Failure containment" },
    ],
    walkthrough: [
      "Prepare: run the same representative task through chain, routed workflow and dynamic orchestration.",
      "Implement: document the decision framework.",
    ],
    gate: "P8 exposes reusable components and a clear 'use this when' guide.",
    evidence:
      "Ship P8; website shows 8/20 projects; publish the workflow-vs-agent decision matrix.",
    refs: [
      { label: "Anthropic - Building Effective Agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
      { label: "OpenAI - Deployment Checklist", url: "https://developers.openai.com/api/docs/guides/deployment-checklist" },
    ],
  },

  36: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "Autonomy is justified when the system must choose an unpredictable sequence of actions. If the sequence can be written down reliably, a workflow is usually easier to test and secure.",
    concepts: [
      {
        name: "Workflows versus agents",
        def: "An agent is a system in which a model chooses actions and tools over multiple steps. Use one only when the path cannot be reliably fixed in advance.",
      },
      {
        name: "Environmental feedback",
        def: "Feedback becomes useful engineering data only when it is tied to a trace, categorized and converted into a reproducible test.",
      },
      { name: "Autonomy" },
      {
        name: "Stopping conditions",
        def: "Stopping conditions define success, safe failure, escalation and budget exhaustion. They are part of the product contract, not an afterthought.",
      },
      { name: "Trust boundaries" },
    ],
    walkthrough: [
      "Write an agent suitability scorecard and apply it to six use cases, including one you reject.",
    ],
    gate: "The chosen project has open-ended steps, tools, clear success criteria and a bounded environment.",
    evidence: "Architecture decision record in P9.",
    refs: [
      { label: "Anthropic - Building Effective Agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
    ],
  },

  37: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "The agent loop should be ordinary code around a model. Each action is proposed, validated, executed and recorded; the model never directly owns the environment.",
    concepts: [
      { name: "Loop state" },
      { name: "Action parsing" },
      { name: "Observations" },
      { name: "Termination" },
      { name: "Iteration caps" },
    ],
    walkthrough: [
      "Prepare: write a while loop with one read-only tool.",
      "Implement: add a final-answer action and full event logging.",
    ],
    gate: "The agent solves ten bounded tasks and never exceeds its maximum steps.",
    evidence: "Readable trace showing each action and observation.",
    refs: [
      { label: "Anthropic - Building Effective Agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
      { label: "OpenAI - Function Calling", url: "https://developers.openai.com/api/docs/guides/function-calling" },
    ],
  },

  38: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "Tools are APIs for models. Precise schemas, narrow capabilities and machine-readable errors reduce hallucinated calls and make recovery possible.",
    concepts: [
      { name: "Tool schemas" },
      {
        name: "Validation",
        def: "Pydantic converts untrusted input into typed Python objects or produces explicit validation errors. Validation is a boundary, not a cosmetic convenience.",
      },
      {
        name: "Timeouts",
        def: "A timeout prevents a request from hanging forever. Exponential backoff spaces retries farther apart, ideally with jitter, so many clients do not retry at the same instant.",
      },
      { name: "Retries" },
      { name: "Error observations" },
      {
        name: "Idempotency",
        def: "An idempotent operation can be retried without creating duplicate effects. This matters when a network failure leaves the client unsure whether the first attempt succeeded.",
      },
    ],
    walkthrough: [
      "Prepare: add three tools with Pydantic inputs, explicit errors and tests.",
      "Implement: return compact, model-friendly observations.",
    ],
    gate: "Bad arguments, timeouts and empty results become useful observations instead of crashes.",
    evidence: "Tool test suite and error-recovery demo.",
    refs: [
      { label: "Anthropic - Writing Effective Tools for Agents", url: "https://www.anthropic.com/engineering/writing-tools-for-agents" },
      { label: "Pydantic - Documentation", url: "https://docs.pydantic.dev/latest/" },
      { label: "OpenAI - Function Calling", url: "https://developers.openai.com/api/docs/guides/function-calling" },
    ],
  },

  39: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "Tool design changes model behavior. Good names describe intent, boundaries prevent dangerous combinations, and descriptions explain when not to call the tool.",
    concepts: [
      { name: "Namespacing" },
      { name: "Consolidation" },
      { name: "Descriptive parameters" },
      { name: "Poka-yoke" },
      { name: "Minimal tool sets" },
    ],
    walkthrough: [
      "Prepare: generate tool-selection test tasks.",
      "Implement: measure accuracy.",
      "Measure: refactor names/descriptions and compare.",
    ],
    gate: "The agent chooses the correct tool more reliably with fewer ambiguous tools.",
    evidence: "Before/after tool-selection score and design notes.",
    refs: [
      { label: "Anthropic - Writing Effective Tools for Agents", url: "https://www.anthropic.com/engineering/writing-tools-for-agents" },
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
    ],
  },

  40: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "State needed for correctness should live outside conversation text. Approval gates belong before irreversible effects, not after they occur.",
    concepts: [
      { name: "Session state" },
      { name: "Durable memory" },
      {
        name: "Approval checkpoints",
        def: "A checkpoint records enough state to resume safely. It should include completed work, outstanding tasks, artifacts, budgets and the next allowed action.",
      },
      { name: "Read/write separation" },
      { name: "Action risk levels" },
    ],
    walkthrough: [
      "Prepare: persist task state.",
      "Implement: add a memory CRUD tool.",
      "Measure: require approval before one irreversible write action.",
    ],
    gate: "The agent resumes after restart and cannot execute the risky action without an approval token.",
    evidence: "State transition diagram and approval demo.",
    refs: [
      { label: "Anthropic - Effective Context Engineering", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
      { label: "OpenAI - Safety Best Practices", url: "https://developers.openai.com/api/docs/guides/safety-best-practices" },
    ],
  },
};
