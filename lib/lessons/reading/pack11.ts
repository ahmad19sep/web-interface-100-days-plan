// Reading Pack 11 — Days 101–110: Capstone Product Foundations.

import type { ReadingData } from "./core";

export const PACK11: Record<number, ReadingData> = {
  101: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "An isolated worktree lets an improvement agent modify code, run tests and produce a reviewable diff without contaminating the main branch.",
    concepts: [
      {
        name: "Worktree isolation",
        def: "A Git worktree creates an isolated working directory attached to the same repository. It lets an agent attempt changes without corrupting the main workspace.",
      },
      { name: "Patch generation" },
      {
        name: "Test-repair cycles",
        def: "A repair cycle turns a failed verification into a diagnosed, bounded correction attempt. It must preserve the failure evidence and avoid repeating the same action blindly.",
      },
      { name: "Diff review" },
      { name: "Merge gates" },
      { name: "Rollback" },
    ],
    walkthrough: [
      "Prepare: give the improvement backlog to a coding agent in a worktree.",
      "Implement: let it implement one change, run tests/evals, repair failures and produce a reviewable patch.",
    ],
    gate: "The main branch remains untouched until the patch passes software tests, AI evals and human diff review.",
    evidence: "Before/after diff, repair trace and merge decision record.",
    refs: [
      { label: "OpenAI Cookbook - Iterative Repair Loops with Codex", url: "https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex" },
      { label: "OpenAI - Git Worktrees for Parallel Agent Work", url: "https://learn.chatgpt.com/docs/environments/git-worktrees" },
      { label: "GitHub Actions - Get Started", url: "https://docs.github.com/en/actions/get-started" },
    ],
  },

  102: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "Recording tool interactions creates deterministic debugging. Replaying the same environment separates harness changes from external API variability.",
    concepts: [
      { name: "Interaction cassettes" },
      { name: "Deterministic fixtures" },
      { name: "Secret redaction" },
      { name: "Replay drift" },
      { name: "Mock boundaries" },
      { name: "Reproducible incident analysis" },
    ],
    walkthrough: [
      "Prepare: record a representative tool-using run, redact sensitive data and replay it through the harness during tests.",
      "Implement: create one altered replay to reproduce a historical failure.",
    ],
    gate: "The same failure is reproduced offline and the repaired harness passes the replay without live external calls.",
    evidence: "Replay fixture, redaction policy and incident reproduction demo.",
    refs: [
      { label: "OpenAI - Record and Replay", url: "https://learn.chatgpt.com/docs/extend/record-and-replay" },
      { label: "pytest - Documentation", url: "https://docs.pytest.org/" },
      { label: "OpenTelemetry - Generative AI Semantic Conventions", url: "https://opentelemetry.io/docs/specs/semconv/gen-ai/" },
    ],
  },

  103: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "Large toolsets consume context and confuse selection. Package repeatable procedures as skills and retrieve only the capabilities relevant to the task.",
    concepts: [
      { name: "Skill packaging" },
      { name: "Progressive disclosure" },
      {
        name: "Tool search",
        def: "Tool search lets an agent discover relevant capabilities instead of loading every tool into context. The search layer itself must be evaluated for recall and permissions.",
      },
      { name: "Namespaces" },
      { name: "Programmatic tool calling" },
      { name: "Capability permissions" },
      { name: "Context cost" },
    ],
    walkthrough: [
      "Prepare: package one reusable skill.",
      "Implement: expose a catalog of 20+ mock tools through tool search.",
      "Measure: let the agent load or call only the needed subset.",
    ],
    gate: "Tool-selection accuracy improves or context usage falls compared with loading all tool schemas at once.",
    evidence: "Tool catalog benchmark and reusable skill package.",
    refs: [
      { label: "OpenAI - Skills", url: "https://developers.openai.com/api/docs/guides/tools-skills" },
      { label: "OpenAI - Tool Search", url: "https://developers.openai.com/api/docs/guides/tools-tool-search" },
      { label: "OpenAI - Programmatic Tool Calling", url: "https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling" },
    ],
  },

  104: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "Frontier harness ideas should be treated as experiments with strict containment. Define depth, budgets, verification and rollback before allowing self-directed expansion.",
    concepts: [
      { name: "Harness recursion" },
      { name: "Online harness adaptation" },
      { name: "Process rewards" },
      {
        name: "Recursive decomposition",
        def: "Decomposition splits a complex request into smaller searches whose evidence can be combined. It is useful when one query contains multiple entities, constraints or time ranges.",
      },
      { name: "Optimizer-target separation" },
      { name: "Catastrophic self-modification risks" },
    ],
    walkthrough: [
      "Prepare: run a sandboxed experiment where a parent harness proposes a limited prompt/tool change or delegates a bounded subtask.",
      "Implement: require eval and human approval before adoption.",
    ],
    gate: "The experiment reports whether the change helped, cost more or caused regressions, and no unreviewed self-modification reaches the baseline harness.",
    evidence:
      "Frontier experiment report clearly separating evidence, inference and open questions.",
    refs: [
      { label: "Recursive Agent Harnesses (Frontier Research, 2026)", url: "https://arxiv.org/abs/2606.13643" },
      { label: "Continual Harness (Frontier Research, 2026)", url: "https://arxiv.org/abs/2605.09998" },
      { label: "OWASP - Top 10 for Agentic Applications 2026", url: "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/" },
    ],
  },

  105: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "The improvement flywheel is complete only when before-and-after evals show a gain and production monitoring confirms it did not create a new failure elsewhere.",
    concepts: [
      { name: "Release comparison" },
      { name: "Eval governance" },
      { name: "Improvement cadence" },
      { name: "Approval boundaries" },
      { name: "Experiment documentation" },
    ],
    walkthrough: [
      "Prepare: package traces.",
      "Implement: feedback labels.",
      "Measure: evals.",
      "Validate: ranked changes.",
      "Document: worktree repair flow.",
      "Ship: replay fixtures.",
    ],
    gate: "The revised harness improves at least one primary metric on a held-out set without violating cost or safety gates.",
    evidence:
      "Ship P19; website shows 19/20 projects; publish an improvement-flywheel case study.",
    refs: [
      { label: "OpenAI Cookbook - Agent Improvement Loop with Traces, Evals and Codex", url: "https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop" },
      { label: "OpenAI Cookbook - Iterative Repair Loops with Codex", url: "https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex" },
      { label: "OpenAI - Evaluate Agent Workflows", url: "https://developers.openai.com/api/docs/guides/agent-evals" },
    ],
  },

  106: {
    rule: "narrow",
    failures: "capstone",
    problem:
      "The capstone should solve a narrow, painful workflow for a specific user. A smaller problem with measured value is stronger than a broad \"AI assistant.\"",
    concepts: [
      { name: "Target roles" },
      { name: "User jobs" },
      { name: "Competitive alternatives" },
      { name: "Build-versus-buy" },
      { name: "Measurable business outcome" },
      { name: "Portfolio positioning" },
    ],
    walkthrough: [
      "Prepare: review ten relevant job descriptions or client briefs.",
      "Implement: choose a recurring problem and write a one-page opportunity memo with explicit non-goals.",
    ],
    gate: "The problem has a named user, current workaround, measurable success metric, realistic data source and a three-minute demo journey.",
    evidence: "Opportunity memo and job-skill-to-feature mapping.",
    refs: [
      { label: "OpenAI - Production Best Practices", url: "https://developers.openai.com/api/docs/guides/production-best-practices" },
      { label: "OpenAI - Deployment Checklist", url: "https://developers.openai.com/api/docs/guides/deployment-checklist" },
      { label: "Anthropic - Building Effective Agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
    ],
  },

  107: {
    rule: "eval",
    failures: "metrics",
    problem:
      "The design package should connect user needs to architecture, evaluation, security and scope. Non-goals protect the project from expanding beyond the time available.",
    concepts: [
      { name: "Acceptance criteria" },
      { name: "System boundaries" },
      { name: "Data contracts" },
      { name: "Architecture decisions" },
      {
        name: "Threat model",
        def: "A threat model identifies assets, trust boundaries, attackers, abuse paths and mitigations before incidents occur.",
      },
      {
        name: "Cost budget",
        def: "A budget bounds time, tokens, money, tool calls or risk. Exhaustion should lead to a defined terminal state rather than uncontrolled continuation.",
      },
      {
        name: "SLOs",
        def: "A service-level objective is a measurable reliability target such as availability, latency or successful task completion. It turns \"production ready\" into an explicit promise.",
      },
      { name: "Release gates" },
    ],
    walkthrough: [
      "Prepare: create the PRD.",
      "Implement: architecture diagram.",
      "Measure: data flow.",
      "Validate: threat model.",
      "Document: golden scenarios.",
      "Ship: cost ceiling.",
    ],
    gate: "Every core requirement has an automated or human acceptance test and every risky action has a permission decision.",
    evidence: "Reviewed design package and architecture decision records.",
    refs: [
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
      { label: "OWASP - Top 10 for Agentic Applications 2026", url: "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/" },
      { label: "NIST - Generative AI Risk Management Profile", url: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf" },
    ],
  },

  108: {
    rule: "eval",
    failures: "retrieval",
    problem:
      "Capstone foundations should be boring and dependable: repeatable ingestion, versioned data, correct tenant boundaries and a retrieval baseline with citations.",
    concepts: [
      { name: "Ingestion jobs" },
      { name: "Schema evolution" },
      { name: "Provenance" },
      { name: "Tenant boundaries" },
      { name: "Indexing" },
      { name: "Freshness" },
      { name: "Deletion and retention" },
    ],
    walkthrough: [
      "Prepare: implement the domain data model.",
      "Implement: ingestion pipeline and retrieval/search baseline using components from P3.",
      "Measure: P4 and P12.",
    ],
    gate: "A golden query set retrieves correct evidence with stable source IDs and tenant isolation tests pass.",
    evidence: "Data-flow demo, migration files and retrieval benchmark.",
    refs: [
      { label: "OpenAI - Retrieval", url: "https://developers.openai.com/api/docs/guides/retrieval" },
      { label: "pgvector - PostgreSQL Vector Similarity Search", url: "https://github.com/pgvector/pgvector" },
      { label: "PostgreSQL - Documentation", url: "https://www.postgresql.org/docs/" },
    ],
  },

  109: {
    rule: "boundary",
    failures: "autonomy",
    problem:
      "A local baseline should record hardware, model configuration, prompt format, quality, latency and memory. Every optimization is compared to this snapshot.",
    concepts: [
      {
        name: "Workflow decomposition",
        def: "Decomposition splits a complex request into smaller searches whose evidence can be combined. It is useful when one query contains multiple entities, constraints or time ranges.",
      },
      { name: "Typed schemas" },
      {
        name: "Routing",
        def: "Routing selects a path based on input type, risk or complexity. A reliable router includes fallback behavior for uncertain classifications.",
      },
      {
        name: "Idempotency",
        def: "An idempotent operation can be retried without creating duplicate effects. This matters when a network failure leaves the client unsure whether the first attempt succeeded.",
      },
      { name: "Error paths" },
      {
        name: "Human review queues",
        def: "Human review is a designed control point for ambiguous or high-impact cases. Review queues should show evidence and reasons, not just raw model output.",
      },
    ],
    walkthrough: [
      "Prepare: create the end-to-end happy path using deterministic components plus narrowly scoped model calls.",
      "Implement: add mocks for external systems.",
    ],
    gate: "The core workflow completes on standard cases with predictable state transitions and clear error messages.",
    evidence: "Workflow trace and baseline success/cost report.",
    refs: [
      { label: "OpenAI - Structured Outputs", url: "https://developers.openai.com/api/docs/guides/structured-outputs" },
      { label: "OpenAI - Function Calling", url: "https://developers.openai.com/api/docs/guides/function-calling" },
      { label: "Pydantic - Documentation", url: "https://docs.pydantic.dev/latest/" },
    ],
  },

  110: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "Autonomy must earn its place by handling genuinely variable work better than the deterministic baseline under the same evaluation.",
    concepts: [
      { name: "Autonomy boundary" },
      { name: "Tool contract" },
      {
        name: "State",
        def: "Durable state lives outside the model context so work can survive restarts. It should be versioned, validated and separated from temporary conversational text.",
      },
      { name: "Approvals" },
      { name: "Loop specification" },
      { name: "Fallback and escalation" },
    ],
    walkthrough: [
      "Prepare: integrate P9 or P11 into one bounded stage.",
      "Implement: restrict tools, budgets and terminal conditions, and retain the workflow baseline as fallback.",
    ],
    gate: "An experiment shows the autonomous stage improves task coverage or effort enough to justify its added cost and risk.",
    evidence: "Decision record comparing workflow-only and agent/loop variants.",
    refs: [
      { label: "Anthropic - Building Effective Agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
      { label: "Anthropic - Effective Harnesses for Long-Running Agents", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" },
      { label: "OpenAI Cookbook - Iterative Repair Loops with Codex", url: "https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex" },
    ],
  },
};
