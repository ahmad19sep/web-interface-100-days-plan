// Reading Pack 05 — Days 041–050: Long-Horizon Agents and Loop Engineering.

import type { ReadingData } from "./core";

export const PACK05: Record<number, ReadingData> = {
  41: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "Framework literacy means mapping abstractions back to the underlying loop, tools, state and events. Rebuilding the same agent exposes what a framework adds and what it hides.",
    concepts: [
      {
        name: "Agents SDK concepts",
        def: "An agent is a system in which a model chooses actions and tools over multiple steps. Use one only when the path cannot be reliably fixed in advance.",
      },
      { name: "LangGraph state graphs" },
      {
        name: "Tracing",
        def: "A trace records the path of one request through model calls, tools, retrieval and code. It makes distributed failures inspectable instead of mysterious.",
      },
      { name: "Handoffs" },
      {
        name: "Checkpoints",
        def: "A checkpoint records enough state to resume safely. It should include completed work, outstanding tasks, artifacts, budgets and the next allowed action.",
      },
    ],
    walkthrough: [
      "Prepare: rebuild a small slice in OpenAI Agents SDK and LangGraph.",
      "Implement: map every framework object to your raw implementation.",
    ],
    gate: "A comparison table covers control flow, state, tracing, testing and lock-in.",
    evidence: "Two small implementations and a framework selection memo.",
    refs: [
      { label: "OpenAI Agents SDK - Python", url: "https://openai.github.io/openai-agents-python/" },
      { label: "LangGraph - Documentation", url: "https://docs.langchain.com/oss/python/langgraph/overview" },
    ],
  },

  42: {
    rule: "eval",
    failures: "metrics",
    problem:
      "A correct final answer can hide wasteful loops, wrong tool calls or unsafe intermediate actions. Trajectory evaluation judges the path as well as the destination.",
    concepts: [
      { name: "Tool-selection accuracy" },
      { name: "Step efficiency" },
      { name: "Prohibited actions" },
      { name: "Final-answer grading" },
      { name: "Sandboxing" },
    ],
    walkthrough: [
      "Prepare: create 25 agent tasks, expected tool constraints and automated trajectory checks.",
      "Implement: patch one discovered failure.",
    ],
    gate: "P9 reports task success, tool accuracy, average steps, cost and unsafe-action rate.",
    evidence: "Ship P9; website shows 9/20 projects; publish a transparent agent trace.",
    refs: [
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
      { label: "OpenAI Agents SDK - Python", url: "https://openai.github.io/openai-agents-python/" },
      { label: "OpenAI - Safety Best Practices", url: "https://developers.openai.com/api/docs/guides/safety-best-practices" },
    ],
  },

  43: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "A truly long task cannot depend on one context window. It needs a durable specification, artifact inventory, progress log and explicit handoff state.",
    concepts: [
      { name: "Task contracts" },
      { name: "Milestone graphs" },
      { name: "Acceptance tests" },
      { name: "External state" },
      { name: "Session boundaries" },
    ],
    walkthrough: [
      "Prepare: write a task spec.",
      "Implement: a feature checklist and done-when tests for a multi-file coding task or multi-source research report.",
    ],
    gate: "A new agent session can understand the project without reading the entire prior transcript.",
    evidence: "Long-horizon task brief and initial failing checklist.",
    refs: [
      { label: "Anthropic - Effective Harnesses for Long-Running Agents", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" },
    ],
  },

  44: {
    rule: "boundary",
    failures: "autonomy",
    problem:
      "A checkpoint is a restart boundary. The artifact ledger tells the next session what exists, what is trustworthy and what remains unresolved.",
    concepts: [
      {
        name: "Checkpoint schema",
        def: "A checkpoint records enough state to resume safely. It should include completed work, outstanding tasks, artifacts, budgets and the next allowed action.",
      },
      { name: "Append-only logs" },
      { name: "Task status" },
      { name: "Artifact hashes" },
      { name: "Resumability" },
    ],
    walkthrough: [
      "Prepare: create state.json.",
      "Implement: progress.md.",
      "Measure: artifacts/ and a checkpoint command that records work.",
      "Validate: tests and next action.",
    ],
    gate: "Killing the process after any step does not lose completed work or corrupt state.",
    evidence: "Restart demo and checkpoint audit log.",
    refs: [
      { label: "Anthropic - Effective Harnesses for Long-Running Agents", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" },
      { label: "PostgreSQL - Documentation", url: "https://www.postgresql.org/docs/" },
    ],
  },

  45: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "Initialization and execution are different responsibilities. The initializer creates a stable environment and acceptance contract; workers make bounded, verifiable progress.",
    concepts: [
      { name: "Initialization contracts" },
      { name: "Feature lists" },
      { name: "Session prompts" },
      { name: "Incremental commits" },
      { name: "Handoff notes" },
    ],
    walkthrough: [
      "Prepare: create an initializer that writes the task state and a worker that selects one incomplete item.",
      "Implement: acts.",
      "Measure: tests and checkpoints.",
    ],
    gate: "Three independent worker runs make cumulative progress without shared hidden context.",
    evidence: "Git history and state changes across sessions.",
    refs: [
      { label: "Anthropic - Effective Harnesses for Long-Running Agents", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" },
      { label: "GitHub Actions - Get Started", url: "https://docs.github.com/en/actions/get-started" },
    ],
  },

  46: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "Long work should continue outside the request that started it. Users need a job ID, progress state, cancellation, and authenticated completion events.",
    concepts: [
      { name: "Background mode" },
      { name: "Polling" },
      {
        name: "Webhooks",
        def: "A webhook notifies another system that an event occurred. Receivers must authenticate the event, handle duplicates and process it idempotently.",
      },
      { name: "Job IDs" },
      { name: "Cancellation" },
      { name: "Idempotent callbacks" },
    ],
    walkthrough: [
      "Prepare: start a long job.",
      "Implement: persist its status.",
      "Measure: receive or simulate a webhook and expose a status endpoint.",
    ],
    gate: "A client can disconnect, return later and retrieve the completed artifact exactly once.",
    evidence: "Sequence diagram and webhook replay test.",
    refs: [
      { label: "OpenAI - Background Mode", url: "https://developers.openai.com/api/docs/guides/background" },
      { label: "OpenAI - Webhooks", url: "https://developers.openai.com/api/docs/guides/webhooks" },
    ],
  },

  47: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "Separating production from verification reduces self-confirming errors. Reflection is useful only when it changes the next action or stored procedure.",
    concepts: [
      {
        name: "Doer-verifier separation",
        def: "The doer produces work; the verifier independently checks it. Separation reduces the chance that the same mistaken assumption passes unchallenged.",
      },
      { name: "Acceptance tests" },
      {
        name: "Reflection notes",
        def: "Reflection turns a failure into an explicit update to the plan or state. It should produce actionable changes, not vague self-commentary.",
      },
      { name: "Corrective actions" },
    ],
    walkthrough: [
      "Prepare: require the worker to run tests or rubric checks.",
      "Implement: let a verifier accept.",
      "Measure: reject or request a bounded correction.",
    ],
    gate: "A planted defect is caught and repaired before the task is marked complete.",
    evidence: "Failure, verifier feedback and corrected checkpoint trace.",
    refs: [
      { label: "Anthropic - Effective Harnesses for Long-Running Agents", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" },
      { label: "Anthropic - Building Effective Agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
      { label: "pytest - Documentation", url: "https://docs.pytest.org/" },
    ],
  },

  48: {
    rule: "boundary",
    failures: "retrieval",
    problem:
      "Autonomy without budgets is an unbounded liability. Every run should know what it may spend, which actions it may take and when to ask for help.",
    concepts: [
      {
        name: "Budget counters",
        def: "A budget bounds time, tokens, money, tool calls or risk. Exhaustion should lead to a defined terminal state rather than uncontrolled continuation.",
      },
      { name: "Tool scopes" },
      { name: "Escalation" },
      { name: "Safe stopping" },
      { name: "User approvals" },
    ],
    walkthrough: [
      "Prepare: add hard limits for steps.",
      "Implement: tokens.",
      "Measure: cost and wall-clock time.",
      "Validate: plus approval rules for risky operations.",
    ],
    gate: "Budget exhaustion creates a useful partial report and recovery plan rather than a crash.",
    evidence: "Budget stress-test report.",
    refs: [
      { label: "OpenAI - Safety Best Practices", url: "https://developers.openai.com/api/docs/guides/safety-best-practices" },
      { label: "OpenAI - Cost Optimization", url: "https://developers.openai.com/api/docs/guides/cost-optimization" },
      { label: "Anthropic - Effective Harnesses for Long-Running Agents", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" },
    ],
  },

  49: {
    rule: "eval",
    failures: "metrics",
    problem:
      "A long-horizon system is not proven by unit tests alone. Kill it mid-run, restart it, inject failures and verify the final artifact and budget.",
    concepts: [
      { name: "Long-task evaluation" },
      { name: "Artifact correctness" },
      { name: "Restart tests" },
      { name: "Cost accounting" },
      {
        name: "Postmortems",
        def: "A postmortem explains what happened, impact, contributing factors, detection, response and corrective actions without hiding uncomfortable evidence.",
      },
    ],
    walkthrough: [
      "Prepare: execute at least five fresh runs or one substantial multi-session task.",
      "Implement: measure completion and document failure cases.",
    ],
    gate: "The final artifact passes its tests and every session leaves a valid checkpoint.",
    evidence: "Ship P10; website shows 10/20 projects; publish a long-horizon run report.",
    refs: [
      { label: "Anthropic - Effective Harnesses for Long-Running Agents", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" },
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
    ],
  },

  50: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "Loop engineering moves attention from clever prompts to the external system that repeatedly drives, verifies and constrains model work. The loop contract is the primary design artifact.",
    concepts: [
      {
        name: "Loop contract",
        def: "A loop contract defines the goal, allowed actions, state, verifier, repair policy, budgets, escalation and terminal conditions before execution begins.",
      },
      {
        name: "State machine",
        def: "A state machine restricts execution to named states and valid transitions. It makes autonomous behavior inspectable and testable.",
      },
      { name: "Trigger" },
      { name: "Goal and acceptance criteria" },
      { name: "Work step" },
      { name: "Observation" },
      {
        name: "Verifier",
        def: "The doer produces work; the verifier independently checks it. Separation reduces the chance that the same mistaken assumption passes unchallenged.",
      },
      {
        name: "Repair",
        def: "A repair cycle turns a failed verification into a diagnosed, bounded correction attempt. It must preserve the failure evidence and avoid repeating the same action blindly.",
      },
      { name: "Terminal states" },
      { name: "Human escalation" },
    ],
    walkthrough: [
      "Prepare: write a provider-neutral LoopSpec schema and runner skeleton.",
      "Implement: model states such as READY, WORKING, VERIFYING, REPAIRING, BLOCKED, SUCCEEDED and BUDGET_EXCEEDED.",
    ],
    gate: "A deterministic fake agent moves through every state and invalid transitions are rejected by tests.",
    evidence: "State diagram, typed LoopSpec and transition test report.",
    refs: [
      { label: "Anthropic - Effective Harnesses for Long-Running Agents", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents" },
      { label: "Anthropic - Building Effective Agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
      { label: "OpenAI Cookbook - Iterative Repair Loops with Codex", url: "https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex" },
    ],
  },
};
