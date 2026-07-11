// Reading Pack 10 — Days 091–100: AI Security and Agent Improvement.

import type { ReadingData } from "./core";

export const PACK10: Record<number, ReadingData> = {
  91: {
    rule: "eval",
    failures: "metrics",
    problem:
      "A distributed agent network is useful only if specialization or ownership improves the result enough to justify latency, cost and new failure modes.",
    concepts: [
      {
        name: "Delegation accuracy",
        def: "Delegation transfers a bounded task with explicit inputs, expected artifacts and completion status. It should be evaluated against doing the work locally.",
      },
      { name: "Artifact validity" },
      { name: "Latency/cost overhead" },
      {
        name: "Fallback to single agent",
        def: "An agent is a system in which a model chooses actions and tools over multiple steps. Use one only when the path cannot be reliably fixed in advance.",
      },
    ],
    walkthrough: [
      "Prepare: compare single-agent and delegated runs on a test set.",
      "Implement: add a fallback and document the break-even point.",
    ],
    gate: "P17 clearly states when A2A is useful and when the coordinator should work alone.",
    evidence: "Ship P17; website shows 17/20 projects; publish the interoperability demo.",
    refs: [
      { label: "A2A Protocol - Official Documentation", url: "https://a2a-protocol.org/latest/" },
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
    ],
  },

  92: {
    rule: "untrusted",
    failures: "security",
    problem:
      "Threat modeling should cover model inputs, retrieved content, memory, tools, identities, storage, network access, dependencies and human operators.",
    concepts: [
      {
        name: "Threat modeling",
        def: "A threat model identifies assets, trust boundaries, attackers, abuse paths and mitigations before incidents occur.",
      },
      { name: "OWASP LLM risks" },
      { name: "Trust boundaries" },
      { name: "Abuse cases" },
      { name: "Severity" },
    ],
    walkthrough: [
      "Create a data-flow diagram and risk register for P9/P16 or the capstone architecture.",
    ],
    gate: "Every external input and privileged action has an owner, threat and planned control.",
    evidence: "Threat model committed to P18.",
    refs: [
      { label: "OWASP - Top 10 for LLM Applications", url: "https://genai.owasp.org/llm-top-10/" },
      { label: "OpenAI - Safety Best Practices", url: "https://developers.openai.com/api/docs/guides/safety-best-practices" },
    ],
  },

  93: {
    rule: "untrusted",
    failures: "security",
    problem:
      "Direct injection arrives from the user; indirect injection is embedded in untrusted content such as documents or web pages. Both exploit confusion between data and authority.",
    concepts: [
      { name: "Direct injection" },
      { name: "Indirect injection" },
      { name: "Instruction hierarchy" },
      { name: "Data/instruction separation" },
      { name: "Canary secrets" },
    ],
    walkthrough: [
      "Prepare: create at least 15 attacks against RAG and agent paths.",
      "Implement: including malicious documents and tool outputs.",
    ],
    gate: "Successful attacks are reproducible with trace IDs and impact descriptions.",
    evidence: "Attack corpus and evidence report.",
    refs: [
      { label: "OWASP - Top 10 for LLM Applications", url: "https://genai.owasp.org/llm-top-10/" },
      { label: "Promptfoo - LLM Red Teaming", url: "https://www.promptfoo.dev/docs/red-team/" },
    ],
  },

  94: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "Tool design changes model behavior. Good names describe intent, boundaries prevent dangerous combinations, and descriptions explain when not to call the tool.",
    concepts: [
      { name: "Least privilege" },
      { name: "Scoped credentials" },
      { name: "Read/write separation" },
      {
        name: "Approval",
        def: "Human approval is required before irreversible or high-risk actions. The approval screen should explain the proposed action and its consequences.",
      },
      { name: "Transaction limits" },
    ],
    walkthrough: [
      "Prepare: attempt cross-tenant reads, unauthorized updates, parameter smuggling and repeated actions.",
      "Implement: add policy enforcement outside the model.",
    ],
    gate: "The agent cannot exceed its scoped identity even when explicitly instructed.",
    evidence: "Permission matrix and blocked attack traces.",
    refs: [
      { label: "OpenAI - Safety Best Practices", url: "https://developers.openai.com/api/docs/guides/safety-best-practices" },
      { label: "MCP - Current Streamable HTTP Transport Specification", url: "https://modelcontextprotocol.io/specification/2025-11-25/basic/transports" },
      { label: "OpenAI - Workload Identity Federation", url: "https://developers.openai.com/api/docs/guides/workload-identity-federation" },
    ],
  },

  95: {
    rule: "untrusted",
    failures: "security",
    problem:
      "State needed for correctness should live outside conversation text. Approval gates belong before irreversible effects, not after they occur.",
    concepts: [
      { name: "Memory provenance" },
      { name: "TTL" },
      { name: "Write validation" },
      { name: "PII leakage" },
      { name: "Dependency pinning" },
      { name: "Secret scanning" },
    ],
    walkthrough: [
      "Prepare: insert poisoned memories/documents.",
      "Implement: attempt secret extraction and audit dependencies plus environment configuration.",
    ],
    gate: "Memory writes have provenance/approval and secrets never appear in model-visible context or logs.",
    evidence: "Persistence-risk report and remediation commits.",
    refs: [
      { label: "OWASP - Top 10 for LLM Applications", url: "https://genai.owasp.org/llm-top-10/" },
      { label: "OpenAI - Safety Best Practices", url: "https://developers.openai.com/api/docs/guides/safety-best-practices" },
      { label: "OpenAI - Production Best Practices", url: "https://developers.openai.com/api/docs/guides/production-best-practices" },
    ],
  },

  96: {
    rule: "boundary",
    failures: "security",
    problem:
      "Automated scanners provide breadth, but findings still require triage. Use them to create reproducible attacks and then keep those attacks in CI.",
    concepts: [
      { name: "Attack generation" },
      { name: "Plugins/probes" },
      { name: "Multi-turn attacks" },
      { name: "False positives" },
      { name: "Reproducibility" },
    ],
    walkthrough: [
      "Prepare: run promptfoo plus one of garak/PyRIT.",
      "Implement: normalize findings and map them to the threat model.",
    ],
    gate: "Every high-severity finding has a reproducible test, owner and disposition.",
    evidence: "Scanner comparison and prioritized backlog.",
    refs: [
      { label: "Promptfoo - LLM Red Teaming", url: "https://www.promptfoo.dev/docs/red-team/" },
      { label: "NVIDIA garak - LLM Vulnerability Scanner", url: "https://github.com/NVIDIA/garak" },
      { label: "Microsoft PyRIT - AI Red Teaming Framework", url: "https://github.com/Azure/PyRIT" },
    ],
  },

  97: {
    rule: "untrusted",
    failures: "security",
    problem:
      "Defense in depth combines input handling, content isolation, tool permissions, output validation, monitoring and human approval. Fixed vulnerabilities must become regression tests.",
    concepts: [
      { name: "Input screening" },
      { name: "Output validation" },
      { name: "Tool policies" },
      {
        name: "Isolation",
        def: "Tenant isolation prevents one customer from accessing another customer's data, prompts, files or traces. It must be enforced in data access, storage and logs.",
      },
      {
        name: "Human approval",
        def: "Human approval is required before irreversible or high-risk actions. The approval screen should explain the proposed action and its consequences.",
      },
      { name: "Regression suites" },
    ],
    walkthrough: [
      "Prepare: patch the top attacks.",
      "Implement: create deterministic and adversarial regression tests.",
      "Measure: run them on every pull request.",
    ],
    gate: "Previously successful attacks fail for the intended architectural reason and normal tasks still pass.",
    evidence: "Security gate screenshot and control map.",
    refs: [
      { label: "OpenAI - Safety Best Practices", url: "https://developers.openai.com/api/docs/guides/safety-best-practices" },
      { label: "Promptfoo - LLM Red Teaming", url: "https://www.promptfoo.dev/docs/red-team/" },
      { label: "GitHub Actions - Get Started", url: "https://docs.github.com/en/actions/get-started" },
    ],
  },

  98: {
    rule: "untrusted",
    failures: "security",
    problem:
      "A security case study should document scope, threat model, reproducible attacks, impact, mitigations, residual risk and evidence that the fix remains effective.",
    concepts: [
      { name: "Security reporting" },
      { name: "Residual risk" },
      { name: "Severity" },
      { name: "Reproducible evidence" },
      { name: "Remediation verification" },
    ],
    walkthrough: [
      "Prepare: package threat templates.",
      "Implement: attack datasets.",
      "Measure: CI configs.",
      "Validate: control library and a case study.",
    ],
    gate: "Another AI project can adopt the kit and run the baseline security suite.",
    evidence: "Ship P18; website shows 18/20 projects; publish the audit report.",
    refs: [
      { label: "OWASP - Top 10 for LLM Applications", url: "https://genai.owasp.org/llm-top-10/" },
      { label: "Promptfoo - LLM Red Teaming", url: "https://www.promptfoo.dev/docs/red-team/" },
      { label: "NVIDIA garak - LLM Vulnerability Scanner", url: "https://github.com/NVIDIA/garak" },
    ],
  },

  99: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "Real traces show what users actually ask and how the system really fails. Remove sensitive data, preserve context and label the first actionable failure.",
    concepts: [
      { name: "Trace sampling" },
      {
        name: "Human feedback",
        def: "Feedback becomes useful engineering data only when it is tied to a trace, categorized and converted into a reproducible test.",
      },
      { name: "Model-assisted critique" },
      { name: "Issue taxonomy" },
      { name: "Privacy and redaction" },
      { name: "Representative datasets" },
    ],
    walkthrough: [
      "Prepare: collect 30-50 traces from P9.",
      "Implement: P10 or P11.",
      "Measure: add structured human feedback and label the first consequential failure in each bad run.",
    ],
    gate: "The dataset covers successful, failed, expensive, unsafe and ambiguous runs with reviewer agreement checks.",
    evidence: "Versioned improvement dataset and ranked failure table.",
    refs: [
      { label: "OpenAI Cookbook - Agent Improvement Loop with Traces, Evals and Codex", url: "https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop" },
      { label: "Hamel Husain - Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/" },
      { label: "OpenAI - Evaluate Agent Workflows", url: "https://developers.openai.com/api/docs/guides/agent-evals" },
    ],
  },

  100: {
    rule: "eval",
    failures: "metrics",
    problem:
      "Feedback should become a ranked backlog tied to eval cases. Change one harness component at a time and replay the same suite.",
    concepts: [
      {
        name: "Feedback-to-eval conversion",
        def: "Feedback becomes useful engineering data only when it is tied to a trace, categorized and converted into a reproducible test.",
      },
      { name: "Severity and frequency" },
      { name: "Expected-behavior specs" },
      { name: "Impact/effort ranking" },
      { name: "Change hypotheses" },
    ],
    walkthrough: [
      "Prepare: generate deterministic and model-based evaluators from the labeled traces.",
      "Implement: produce a ranked harness-change document with evidence for each recommendation.",
    ],
    gate: "At least ten new eval cases fail on the current harness for understood reasons and each proposed change maps to a failure cluster.",
    evidence: "Eval suite plus evidence-linked improvement backlog.",
    refs: [
      { label: "OpenAI Cookbook - Agent Improvement Loop with Traces, Evals and Codex", url: "https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop" },
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
      { label: "Hamel Husain - Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/" },
    ],
  },
};
