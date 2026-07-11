// Reading Pack 06 — Days 051–060: Loop Engineering and Production AI Services.

import type { ReadingData } from "./core";

export const PACK06: Record<number, ReadingData> = {
  51: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "The model should not grade its own homework. Success must be decided by independent tests, environment checks, reviewers or humans arranged from cheapest to most authoritative.",
    concepts: [
      { name: "Format checks" },
      { name: "Unit and integration tests" },
      { name: "Browser or environment validation" },
      { name: "Rubric graders" },
      { name: "Independent reviewer" },
      {
        name: "Human approval",
        def: "Human approval is required before irreversible or high-risk actions. The approval screen should explain the proposed action and its consequences.",
      },
      { name: "False-positive verifiers" },
    ],
    walkthrough: [
      "Prepare: create a verifier interface and a ladder that runs cheap deterministic checks first.",
      "Implement: targeted model or human review only when needed.",
    ],
    gate: "Three intentionally broken outputs are rejected for the correct reasons and one valid output passes all required gates.",
    evidence: "Verifier matrix showing cost, reliability and failure coverage.",
    refs: [
      { label: "Anthropic - Effective Harnesses for Long-Running Agents", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" },
      { label: "OpenAI - Evaluate Agent Workflows", url: "https://developers.openai.com/api/docs/guides/agent-evals" },
      { label: "pytest - Documentation", url: "https://docs.pytest.org/" },
    ],
  },

  52: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "A failed check should produce a diagnosis and a bounded repair attempt. Repeated identical failure is a signal to stop or escalate, not to continue forever.",
    concepts: [
      { name: "Failure classification" },
      { name: "Targeted repair prompts" },
      { name: "Retry backoff" },
      { name: "Attempt history" },
      { name: "No-progress detection" },
      { name: "Maximum iterations" },
      { name: "Time/token/cost limits" },
    ],
    walkthrough: [
      "Prepare: implement WORK → VERIFY → DIAGNOSE → REPAIR transitions.",
      "Implement: detect repeated identical failures and stop with a structured blocked report.",
    ],
    gate: "The loop repairs two seeded bugs, survives one transient tool failure and safely stops on an unsatisfiable task.",
    evidence: "Trace comparison for repaired, transient and blocked runs.",
    refs: [
      { label: "OpenAI Cookbook - Iterative Repair Loops with Codex", url: "https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex" },
      { label: "OpenAI - Production Best Practices", url: "https://developers.openai.com/api/docs/guides/production-best-practices" },
      { label: "OpenAI - Cost Optimization", url: "https://developers.openai.com/api/docs/guides/cost-optimization" },
    ],
  },

  53: {
    rule: "boundary",
    failures: "autonomy",
    problem:
      "State needed for correctness should live outside conversation text. Approval gates belong before irreversible effects, not after they occur.",
    concepts: [
      { name: "Event sourcing" },
      {
        name: "Checkpoint schema",
        def: "A checkpoint records enough state to resume safely. It should include completed work, outstanding tasks, artifacts, budgets and the next allowed action.",
      },
      {
        name: "Artifact ledger",
        def: "An artifact ledger records files, reports, URLs, datasets and other outputs produced during a long task. It provides continuity across sessions.",
      },
      { name: "Progress notes" },
      { name: "Git history" },
      { name: "Idempotent resumption" },
      {
        name: "Compaction versus durable memory",
        def: "Compaction replaces long history with a smaller state representation. A good compacted state preserves decisions, constraints, unresolved work and evidence references.",
      },
    ],
    walkthrough: [
      "Prepare: persist loop events, current state, verifier results, artifacts and budgets.",
      "Implement: kill the process mid-run and resume from the last safe checkpoint.",
    ],
    gate: "The resumed run does not repeat completed actions and produces the same verified result as an uninterrupted run.",
    evidence: "Restart demonstration and event-log replay report.",
    refs: [
      { label: "Anthropic - Effective Harnesses for Long-Running Agents", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" },
      { label: "OpenAI - Compaction", url: "https://developers.openai.com/api/docs/guides/compaction" },
      { label: "OpenAI - Background Mode", url: "https://developers.openai.com/api/docs/guides/background" },
    ],
  },

  54: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "Parallelism and recursion amplify both capability and risk. Isolation, depth limits, shared budgets and artifact merge rules must be designed first.",
    concepts: [
      { name: "Planner-worker-reviewer pattern" },
      {
        name: "Task decomposition",
        def: "Decomposition splits a complex request into smaller searches whose evidence can be combined. It is useful when one query contains multiple entities, constraints or time ranges.",
      },
      {
        name: "Git worktrees",
        def: "A Git worktree creates an isolated working directory attached to the same repository. It lets an agent attempt changes without corrupting the main workspace.",
      },
      { name: "Fan-out/fan-in" },
      {
        name: "Recursive harnesses",
        def: "A recursive harness allows a system to create or delegate structured subwork. Recursion must be bounded by depth, budgets, isolation and verification.",
      },
      { name: "Conflict handling" },
      { name: "Independence assumptions" },
    ],
    walkthrough: [
      "Prepare: run two isolated workers on separate subtasks in worktrees.",
      "Implement: use a verifier/merger to integrate only passing changes.",
    ],
    gate: "Parallel execution produces no shared-state corruption, and a deliberately conflicting change is detected rather than silently merged.",
    evidence: "Worktree diagram, task graph and parallel-versus-serial cost comparison.",
    refs: [
      { label: "OpenAI - Subagents", url: "https://learn.chatgpt.com/docs/agent-configuration/subagents" },
      { label: "OpenAI - Git Worktrees for Parallel Agent Work", url: "https://learn.chatgpt.com/docs/environments/git-worktrees" },
      { label: "Recursive Agent Harnesses (Frontier Research, 2026)", url: "https://arxiv.org/abs/2606.13643" },
    ],
  },

  55: {
    rule: "eval",
    failures: "metrics",
    problem:
      "Loop-level metrics include success rate, iteration count, verification false positives, cost per successful task, unsafe-action rate and escalation quality.",
    concepts: [
      { name: "Task success" },
      { name: "Verifier precision" },
      { name: "Iterations to success" },
      { name: "No-progress rate" },
      { name: "Recovery rate" },
      { name: "Cost per verified task" },
      { name: "Unsafe-action rate" },
      { name: "Approval and stop reliability" },
    ],
    walkthrough: [
      "Prepare: create 20 scenarios including normal, adversarial, impossible and tool-failure cases.",
      "Implement: add traces using GenAI semantic conventions and enforce permission/budget guards.",
    ],
    gate: "A report identifies at least one loop-level failure, and a harness change improves a measured metric without breaking the eval gate.",
    evidence: "Loop dashboard and before/after reliability report.",
    refs: [
      { label: "OpenAI - Evaluate Agent Workflows", url: "https://developers.openai.com/api/docs/guides/agent-evals" },
      { label: "OpenTelemetry - Generative AI Semantic Conventions", url: "https://opentelemetry.io/docs/specs/semconv/gen-ai/" },
      { label: "OWASP - Top 10 for Agentic Applications 2026", url: "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/" },
    ],
  },

  56: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "This lesson turns one part of the project into an explicit engineering system. The objective is to understand the mechanism, expose its assumptions, and create evidence that the result works beyond a single demonstration.",
    concepts: [
      { name: "Reusable harness APIs" },
      { name: "Documentation" },
      { name: "Risk disclosure" },
      { name: "Demo design" },
      { name: "Productized reliability evidence" },
    ],
    walkthrough: [
      "Prepare: apply P11 to a narrow coding or research task.",
      "Implement: publish the LoopSpec, runner, state store, verifiers, repair policy, traces, eval suite and safety controls.",
    ],
    gate: "Five fresh tasks run unattended within limits, with successes externally verified and blocked cases clearly reported.",
    evidence:
      "Ship P11; website shows 11/20 projects; publish a three-minute loop-engineering demo and postmortem.",
    refs: [
      { label: "OpenAI Cookbook - Agent Improvement Loop with Traces, Evals and Codex", url: "https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop" },
      { label: "OpenAI Cookbook - Iterative Repair Loops with Codex", url: "https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex" },
      { label: "Anthropic - Effective Harnesses for Long-Running Agents", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" },
    ],
  },

  57: {
    rule: "operations",
    failures: "ops",
    problem:
      "The model call is one dependency inside a service. Production design includes APIs, workers, storage, queues, identity, observability and operational ownership.",
    concepts: [
      { name: "Service layers" },
      { name: "Dependency injection" },
      { name: "Configuration" },
      { name: "Health/readiness checks" },
      { name: "Environment separation" },
    ],
    walkthrough: [
      "Prepare: create a FastAPI service template with routes.",
      "Implement: services.",
      "Measure: repositories.",
      "Validate: model clients and settings modules.",
    ],
    gate: "The app starts with a fake model and all core dependencies can be replaced in tests.",
    evidence: "Architecture diagram and ADRs.",
    refs: [
      { label: "FastAPI - Documentation", url: "https://fastapi.tiangolo.com/" },
      { label: "Pydantic - Documentation", url: "https://docs.pydantic.dev/latest/" },
      { label: "OpenAI - Production Best Practices", url: "https://developers.openai.com/api/docs/guides/production-best-practices" },
    ],
  },

  58: {
    rule: "operations",
    failures: "ops",
    problem:
      "Persistent application state belongs in a transactional database with explicit tenant boundaries. Every query path should carry and enforce tenant identity.",
    concepts: [
      { name: "Relational schemas" },
      { name: "Migrations" },
      { name: "Repositories" },
      { name: "Tenant IDs" },
      { name: "Row-level access checks" },
    ],
    walkthrough: [
      "Prepare: model users.",
      "Implement: projects.",
      "Measure: runs.",
      "Validate: traces and files with SQLAlchemy/PostgreSQL and migrations.",
    ],
    gate: "Tests prove one tenant cannot read or mutate another tenant's records.",
    evidence: "Schema diagram and isolation tests.",
    refs: [
      { label: "SQLAlchemy - Documentation", url: "https://docs.sqlalchemy.org/" },
      { label: "PostgreSQL - Documentation", url: "https://www.postgresql.org/docs/" },
      { label: "pgvector - PostgreSQL Vector Similarity Search", url: "https://github.com/pgvector/pgvector" },
    ],
  },

  59: {
    rule: "operations",
    failures: "cost",
    problem:
      "Caching rewards stable repeated context. Prompt structure should separate fixed instructions and schemas from variable user data so repeated prefixes remain reusable.",
    concepts: [
      { name: "Job queues" },
      { name: "Visibility timeouts" },
      { name: "Deduplication" },
      { name: "Distributed locks" },
      { name: "Cache invalidation" },
    ],
    walkthrough: [
      "Prepare: queue ingestion or evaluation jobs.",
      "Implement: expose progress.",
      "Measure: prevent duplicate submissions and cache one expensive result.",
    ],
    gate: "Concurrent duplicate requests create one job and all clients receive the same result.",
    evidence: "Load/concurrency test and queue dashboard.",
    refs: [
      { label: "Redis - Documentation", url: "https://redis.io/docs/latest/" },
      { label: "OpenAI - Background Mode", url: "https://developers.openai.com/api/docs/guides/background" },
    ],
  },

  60: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "Security and reliability meet at the request boundary. Identify the caller, protect credentials, limit abuse and make retries safe.",
    concepts: [
      { name: "JWT/session auth" },
      { name: "Secret injection" },
      { name: "Per-user limits" },
      {
        name: "Idempotency keys",
        def: "An idempotent operation can be retried without creating duplicate effects. This matters when a network failure leaves the client unsure whether the first attempt succeeded.",
      },
      { name: "Safe error messages" },
    ],
    walkthrough: [
      "Prepare: protect endpoints.",
      "Implement: add role checks.",
      "Measure: load secrets from the environment/manager and rate-limit model-heavy routes.",
    ],
    gate: "Security tests cover unauthorized, over-limit and duplicate-write scenarios.",
    evidence: "Threat table and passing auth tests.",
    refs: [
      { label: "OpenAI - Production Best Practices", url: "https://developers.openai.com/api/docs/guides/production-best-practices" },
      { label: "OpenAI - Workload Identity Federation", url: "https://developers.openai.com/api/docs/guides/workload-identity-federation" },
      { label: "OpenAI - Safety Best Practices", url: "https://developers.openai.com/api/docs/guides/safety-best-practices" },
    ],
  },
};
