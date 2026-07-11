// Reading Pack 12 — Days 111–120: Capstone Production, Career and Launch.

import type { ReadingData } from "./core";

export const PACK12: Record<number, ReadingData> = {
  111: {
    rule: "eval",
    failures: "metrics",
    problem:
      "A capstone is ready for users only when its critical behavior is represented in a versioned evaluation set that runs before release.",
    concepts: [
      { name: "Scenario design" },
      { name: "Component versus end-to-end evals" },
      { name: "Held-out sets" },
      { name: "Graders" },
      { name: "Statistical uncertainty" },
      { name: "Release thresholds" },
    ],
    walkthrough: [
      "Prepare: create at least 75 cases and run retrieval.",
      "Implement: extraction.",
      "Measure: tool.",
      "Validate: loop.",
      "Document: final-output and safety evaluators in CI.",
    ],
    gate: "A seeded regression blocks the pull request and the report identifies the failing component rather than only showing one total score.",
    evidence: "Versioned dataset, eval dashboard and red/green CI demo.",
    refs: [
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
      { label: "OpenAI - Evaluate Agent Workflows", url: "https://developers.openai.com/api/docs/guides/agent-evals" },
      { label: "Hamel Husain - Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/" },
    ],
  },

  112: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "Long operations need checkpoints, retries, cancellation and clear terminal states. Recovery should be tested, not merely described.",
    concepts: [
      {
        name: "Background jobs",
        def: "Background jobs decouple long work from an HTTP request. They need durable status, retries, cancellation and user-visible progress.",
      },
      {
        name: "Webhooks",
        def: "A webhook notifies another system that an event occurred. Receivers must authenticate the event, handle duplicates and process it idempotently.",
      },
      {
        name: "Checkpoints",
        def: "A checkpoint records enough state to resume safely. It should include completed work, outstanding tasks, artifacts, budgets and the next allowed action.",
      },
      {
        name: "Replay",
        def: "Record-and-replay stores tool inputs and outputs so a workflow can be debugged deterministically without repeatedly calling external systems.",
      },
      { name: "No-progress detection" },
      {
        name: "Repair",
        def: "A repair cycle turns a failed verification into a diagnosed, bounded correction attempt. It must preserve the failure evidence and avoid repeating the same action blindly.",
      },
      { name: "Human escalation" },
    ],
    walkthrough: [
      "Prepare: add durable execution state.",
      "Implement: safe retries.",
      "Measure: one repair cycle.",
      "Validate: restart recovery and an operator-visible blocked state.",
    ],
    gate: "The system survives a forced restart and one external dependency failure without duplicating side effects.",
    evidence: "Recovery test, event timeline and verified completion trace.",
    refs: [
      { label: "OpenAI - Background Mode", url: "https://developers.openai.com/api/docs/guides/background" },
      { label: "OpenAI - Webhooks", url: "https://developers.openai.com/api/docs/guides/webhooks" },
      { label: "OpenAI - Record and Replay", url: "https://learn.chatgpt.com/docs/extend/record-and-replay" },
    ],
  },

  113: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "Security and reliability meet at the request boundary. Identify the caller, protect credentials, limit abuse and make retries safe.",
    concepts: [
      {
        name: "Authentication",
        def: "Most model APIs authenticate with a secret carried in an HTTP header. The client must protect the secret, avoid logging it, and distinguish authentication failures from ordinary application errors.",
      },
      { name: "Authorization" },
      {
        name: "Tenant isolation",
        def: "Tenant isolation prevents one customer from accessing another customer's data, prompts, files or traces. It must be enforced in data access, storage and logs.",
      },
      { name: "Data minimization" },
      { name: "Retention" },
      { name: "Secret management" },
      { name: "Permission scopes" },
      { name: "Audit logs" },
    ],
    walkthrough: [
      "Prepare: add auth.",
      "Implement: row-level or application tenant checks.",
      "Measure: scoped tool permissions.",
      "Validate: secure secrets and explicit approval for irreversible actions.",
    ],
    gate: "Cross-tenant tests fail safely, secrets do not enter model context or logs, and risky actions cannot execute without approval.",
    evidence: "Privacy policy, permission matrix and security test output.",
    refs: [
      { label: "OpenAI - Workload Identity Federation", url: "https://developers.openai.com/api/docs/guides/workload-identity-federation" },
      { label: "OWASP - Top 10 for Agentic Applications 2026", url: "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/" },
      { label: "NIST - Generative AI Risk Management Profile", url: "https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf" },
    ],
  },

  114: {
    rule: "operations",
    failures: "cost",
    problem:
      "Define what good operation means: task success, latency, cost, errors and availability. Instrument those signals before launch.",
    concepts: [
      { name: "GenAI trace conventions" },
      { name: "Metrics and logs" },
      {
        name: "SLOs",
        def: "A service-level objective is a measurable reliability target such as availability, latency or successful task completion. It turns \"production ready\" into an explicit promise.",
      },
      { name: "p95 latency" },
      { name: "Cost per successful task" },
      {
        name: "Error budgets",
        def: "A budget bounds time, tokens, money, tool calls or risk. Exhaustion should lead to a defined terminal state rather than uncontrolled continuation.",
      },
      { name: "Alerts" },
    ],
    walkthrough: [
      "Prepare: add distributed traces.",
      "Implement: structured logs.",
      "Measure: model/tool attributes.",
      "Validate: cost accounting.",
      "Document: dashboards and alerts for the core journey.",
    ],
    gate: "One failed scenario can be diagnosed from telemetry alone and dashboard totals reconcile with the cost ledger.",
    evidence: "Operations dashboard and incident-debugging walkthrough.",
    refs: [
      { label: "OpenTelemetry - Generative AI Semantic Conventions", url: "https://opentelemetry.io/docs/specs/semconv/gen-ai/" },
      { label: "OpenTelemetry - Documentation", url: "https://opentelemetry.io/docs/" },
      { label: "OpenAI - Cost Optimization", url: "https://developers.openai.com/api/docs/guides/cost-optimization" },
    ],
  },

  115: {
    rule: "session",
    failures: "documents",
    problem:
      "Choose the interface that reduces friction for the real user. Do not add voice or vision only to make the demo look futuristic.",
    concepts: [
      { name: "Modality selection" },
      {
        name: "Upload/vision flow",
        def: "Vision-language models reason over visual content directly. They can preserve layout context but still require validation and provenance.",
      },
      {
        name: "Realtime latency",
        def: "Realtime systems exchange events while a session is active. They must handle partial data, disconnects, backpressure and state synchronization.",
      },
      { name: "Accessibility" },
      { name: "Fallback UX" },
      { name: "Consent and transcript handling" },
    ],
    walkthrough: [
      "Prepare: add one interface from P13 or P14 and connect it to the same secure.",
      "Implement: evaluated backend contract.",
    ],
    gate: "Users can complete the core task through the new modality without bypassing permission, tracing or eval controls.",
    evidence: "Interface demo and modality-specific latency/accuracy report.",
    refs: [
      { label: "OpenAI - Images and Vision", url: "https://developers.openai.com/api/docs/guides/images-vision" },
      { label: "OpenAI - Realtime and Audio", url: "https://developers.openai.com/api/docs/guides/realtime" },
      { label: "OpenAI - Safety Best Practices", url: "https://developers.openai.com/api/docs/guides/safety-best-practices" },
    ],
  },

  116: {
    rule: "operations",
    failures: "ops",
    problem:
      "A container creates a consistent runtime from laptop to staging. It should have health checks, a non-root user, explicit ports and no embedded secrets.",
    concepts: [
      { name: "Containers" },
      { name: "Environment configuration" },
      { name: "Health checks" },
      { name: "Database migrations" },
      { name: "Worker deployment" },
      { name: "Staging and production separation" },
    ],
    walkthrough: [
      "Prepare: package API, worker and frontend.",
      "Implement: configure PostgreSQL/Redis.",
      "Measure: add migrations, health endpoints, seed data and CI deployment.",
    ],
    gate: "A clean staging environment deploys from the main branch and can roll back to the previous release.",
    evidence: "Deployment diagram, runbook and staging URL.",
    refs: [
      { label: "Docker - Overview", url: "https://docs.docker.com/get-started/docker-overview/" },
      { label: "GitHub Actions - Get Started", url: "https://docs.github.com/en/actions/get-started" },
      { label: "OpenAI - Deployment Checklist", url: "https://developers.openai.com/api/docs/guides/deployment-checklist" },
    ],
  },

  117: {
    rule: "eval",
    failures: "happy-path",
    problem:
      "A production test plan includes overload, provider timeout, queue backlog, database interruption and restart recovery — not only happy-path traffic.",
    concepts: [
      { name: "Load profiles" },
      { name: "Concurrency" },
      { name: "Backpressure" },
      { name: "Circuit breakers" },
      { name: "Graceful degradation" },
      { name: "Chaos experiments" },
      { name: "Recovery time" },
    ],
    walkthrough: [
      "Prepare: run representative load.",
      "Implement: inject model/tool/database failures and fix the largest bottleneck or unsafe retry behavior.",
    ],
    gate: "The system meets documented targets or clearly reports capacity limits and degraded-mode behavior.",
    evidence: "Load charts, failure matrix and recovery runbook.",
    refs: [
      { label: "OpenAI - Production Best Practices", url: "https://developers.openai.com/api/docs/guides/production-best-practices" },
      { label: "Redis - Documentation", url: "https://redis.io/docs/latest/" },
      { label: "OpenTelemetry - Documentation", url: "https://opentelemetry.io/docs/" },
    ],
  },

  118: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "The improvement flywheel is complete only when before-and-after evals show a gain and production monitoring confirms it did not create a new failure elsewhere.",
    concepts: [
      { name: "Task-based user tests" },
      {
        name: "Feedback capture",
        def: "Feedback becomes useful engineering data only when it is tied to a trace, categorized and converted into a reproducible test.",
      },
      { name: "Trace review" },
      { name: "Prioritization" },
      { name: "Release comparison" },
      { name: "Consent" },
    ],
    walkthrough: [
      "Prepare: ask 3-5 target users to complete the core task.",
      "Implement: review their traces.",
      "Measure: add discovered failures to evals and implement the highest-impact fix.",
    ],
    gate: "A held-out metric or completion rate improves and no existing release gate regresses.",
    evidence: "User-test summary, new eval cases and before/after result.",
    refs: [
      { label: "OpenAI Cookbook - Agent Improvement Loop with Traces, Evals and Codex", url: "https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop" },
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
      { label: "OpenAI - Evaluate Agent Workflows", url: "https://developers.openai.com/api/docs/guides/agent-evals" },
    ],
  },

  119: {
    rule: "boundary",
    failures: "capstone",
    problem:
      "Hiring evidence should make technical judgment visible: problem, architecture, trade-offs, evaluation, security, metrics, demo and clear personal contribution.",
    concepts: [
      { name: "Portfolio information architecture" },
      { name: "Quantified resume bullets" },
      { name: "STAR stories" },
      { name: "System-design interviews" },
      { name: "Targeted applications" },
      { name: "Client offers" },
    ],
    walkthrough: [
      "Prepare: create a portfolio index.",
      "Implement: select six flagship projects.",
      "Measure: record concise demos.",
      "Validate: write architecture and debugging stories.",
      "Document: update CV/Upwork/LinkedIn and send 15 targeted applications or messages.",
    ],
    gate: "Each flagship has a problem, architecture, hard failure, metric, demo, honest limitation and role relevance.",
    evidence: "Portfolio page, application tracker and interview story bank.",
    refs: [
      { label: "OpenAI - Production Best Practices", url: "https://developers.openai.com/api/docs/guides/production-best-practices" },
      { label: "OpenAI - Deployment Checklist", url: "https://developers.openai.com/api/docs/guides/deployment-checklist" },
    ],
  },

  120: {
    rule: "operations",
    failures: "ops",
    problem:
      "Launch is the start of operational responsibility. Run release gates, monitor the system, document limitations and publish a candid postmortem plus next roadmap.",
    concepts: [
      { name: "Release checklist" },
      { name: "Smoke/eval/security gates" },
      { name: "Monitoring" },
      { name: "Incident ownership" },
      { name: "Retrospective" },
      { name: "90-day roadmap" },
    ],
    walkthrough: [
      "Prepare: deploy production.",
      "Implement: run all release gates.",
      "Measure: record the three-minute demo.",
      "Validate: publish the case study and postmortem.",
      "Document: announce availability for relevant roles or client work and schedule the next improvement cycle.",
    ],
    gate: "Product URL, code, setup guide, evals, security report, telemetry screenshots, runbook, demo, case study and limitations are linked from one page.",
    evidence: "Ship P20; website shows 20/20 projects and Day 120 complete.",
    refs: [
      { label: "OpenAI - Deployment Checklist", url: "https://developers.openai.com/api/docs/guides/deployment-checklist" },
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
      { label: "OWASP - Top 10 for Agentic Applications 2026", url: "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/" },
    ],
  },
};
