// Reading Pack 09 — Days 081–090: MCP, A2A and AI Security.

import type { ReadingData } from "./core";

export const PACK09: Record<number, ReadingData> = {
  81: {
    rule: "benchmark",
    failures: "open-models",
    problem:
      "Fine-tuning quality starts with data. Examples need consistent instructions, desired outputs, coverage, licensing, privacy review and a held-out evaluation split.",
    concepts: [
      { name: "SFT examples" },
      { name: "Chat templates" },
      { name: "Train/dev/test splits" },
      { name: "Deduplication" },
      { name: "Leakage" },
      { name: "Synthetic data filtering" },
    ],
    walkthrough: [
      "Prepare: curate 200-500 examples for one narrow behavior using failures from prior evals.",
      "Implement: validate schema and manually inspect samples.",
    ],
    gate: "The dataset has documented coverage, exclusions and a fixed held-out test set.",
    evidence: "Dataset card and quality checks.",
    refs: [
      { label: "OpenAI - Model Optimization", url: "https://developers.openai.com/api/docs/guides/model-optimization" },
      { label: "Hugging Face - TRL", url: "https://huggingface.co/docs/trl/index" },
      { label: "Hamel Husain - Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/" },
    ],
  },

  82: {
    rule: "benchmark",
    failures: "open-models",
    problem:
      "Parameter-efficient tuning changes a small adapter rather than the full model. The experiment must compare against a strong prompt or retrieval baseline.",
    concepts: [
      {
        name: "LoRA rank",
        def: "LoRA trains small low-rank adapters instead of updating all model weights. It reduces training memory and makes experiments easier to version.",
      },
      { name: "Adapters" },
      {
        name: "QLoRA",
        def: "QLoRA combines a quantized base model with trainable low-rank adapters. It lowers hardware requirements while preserving a high-precision training path for the adapters.",
      },
      { name: "Training curves" },
      { name: "Overfitting" },
      {
        name: "Checkpoints",
        def: "A checkpoint records enough state to resume safely. It should include completed work, outstanding tasks, artifacts, budgets and the next allowed action.",
      },
    ],
    walkthrough: [
      "Train an adapter on the narrow dataset or complete a hosted fallback lab if hardware is limited.",
    ],
    gate: "The adapter is evaluated against the untouched test set and compared to prompt-only baseline.",
    evidence: "Training config, curves, adapter and evaluation report.",
    refs: [
      { label: "Hugging Face - PEFT", url: "https://huggingface.co/docs/peft/index" },
      { label: "Hugging Face - TRL", url: "https://huggingface.co/docs/trl/index" },
      { label: "Hugging Face - bitsandbytes Quantization", url: "https://huggingface.co/docs/transformers/quantization/bitsandbytes" },
    ],
  },

  83: {
    rule: "benchmark",
    failures: "open-models",
    problem:
      "Serving is a systems problem. Measure cold start, first-token latency, output throughput, concurrency and memory pressure through a standard API surface.",
    concepts: [
      { name: "Continuous batching" },
      { name: "Tensor parallelism" },
      { name: "OpenAI-compatible endpoints" },
      { name: "Concurrency" },
      {
        name: "Load testing",
        def: "Load testing measures behavior under expected and stressful concurrency. It should reveal saturation, queue growth, latency tails and failure recovery.",
      },
    ],
    walkthrough: [
      "Prepare: start vLLM.",
      "Implement: call it through your P1 provider adapter and benchmark concurrency and tokens/sec.",
    ],
    gate: "The service handles the chosen load and returns traceable usage/latency data.",
    evidence: "Load-test chart and deployment configuration.",
    refs: [
      { label: "vLLM - Documentation", url: "https://docs.vllm.ai/en/latest/" },
      { label: "OpenTelemetry - Documentation", url: "https://opentelemetry.io/docs/" },
    ],
  },

  84: {
    rule: "benchmark",
    failures: "open-models",
    problem:
      "Quantization changes the runtime representation of weights. Measure quality on your task and latency under realistic concurrency rather than assuming lower precision is always better.",
    concepts: [
      { name: "Total cost of ownership" },
      { name: "Quality per dollar" },
      { name: "Operations burden" },
      { name: "Privacy" },
      { name: "Scale" },
    ],
    walkthrough: [
      "Prepare: compare the hosted baseline.",
      "Implement: open model.",
      "Measure: quantized variant and adapter on quality.",
      "Validate: latency.",
      "Document: cost and maintenance.",
    ],
    gate: "The report includes a clear recommendation at low, medium and high request volume.",
    evidence: "Ship P15; website shows 15/20 projects; publish the model strategy report.",
    refs: [
      { label: "OpenAI - Model Optimization", url: "https://developers.openai.com/api/docs/guides/model-optimization" },
      { label: "vLLM - Documentation", url: "https://docs.vllm.ai/en/latest/" },
      { label: "OpenAI - Cost Optimization", url: "https://developers.openai.com/api/docs/guides/cost-optimization" },
    ],
  },

  85: {
    rule: "interop",
    failures: "protocol",
    problem:
      "MCP separates clients from domain-specific tool and context servers. A server publishes capabilities; the client decides how a model may use them.",
    concepts: [
      { name: "Host" },
      { name: "Client" },
      { name: "Server" },
      {
        name: "Tools",
        def: "A typed tool has a clear name, description, input schema, output schema and error contract. The model should not have to guess what a tool accepts.",
      },
      {
        name: "Resources",
        def: "In MCP, resources expose readable context and prompts expose reusable interaction templates, while tools perform actions. Keeping these concepts separate improves client behavior.",
      },
      {
        name: "Prompts",
        def: "In MCP, resources expose readable context and prompts expose reusable interaction templates, while tools perform actions. Keeping these concepts separate improves client behavior.",
      },
      { name: "JSON-RPC lifecycle" },
      { name: "stdio" },
    ],
    walkthrough: [
      "Create a local MCP server exposing one read-only tool over a small business database.",
    ],
    gate: "The MCP Inspector or a client discovers the server and successfully calls the tool.",
    evidence: "Architecture diagram and local call trace.",
    refs: [
      { label: "Model Context Protocol - Introduction", url: "https://modelcontextprotocol.io/docs/getting-started/intro" },
      { label: "MCP - Build a Server", url: "https://modelcontextprotocol.io/docs/develop/build-server" },
    ],
  },

  86: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "Tools perform actions, resources expose data, and prompts package reusable guidance. Modeling the domain correctly is more important than exposing many capabilities.",
    concepts: [
      { name: "Tool versus resource" },
      { name: "Read/write separation" },
      { name: "Namespacing" },
      { name: "Pagination" },
      { name: "Compact responses" },
    ],
    walkthrough: [
      "Prepare: add search, get and one controlled update tool.",
      "Implement: add a read-only resource and reusable prompt template.",
    ],
    gate: "Tool-selection tests show the client chooses the intended capability with minimal ambiguity.",
    evidence: "MCP capability catalog and eval tasks.",
    refs: [
      { label: "Anthropic - Writing Effective Tools for Agents", url: "https://www.anthropic.com/engineering/writing-tools-for-agents" },
      { label: "Model Context Protocol - Introduction", url: "https://modelcontextprotocol.io/docs/getting-started/intro" },
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
    ],
  },

  87: {
    rule: "interop",
    failures: "http",
    problem:
      "Security and reliability meet at the request boundary. Identify the caller, protect credentials, limit abuse and make retries safe.",
    concepts: [
      {
        name: "Streamable HTTP",
        def: "Streamable HTTP is an MCP transport for remote communication. A secure deployment still needs authentication, origin controls, session handling and least privilege.",
      },
      { name: "Origin validation" },
      { name: "Session IDs" },
      { name: "Protocol versions" },
      { name: "OAuth/resource authorization" },
      { name: "Localhost safety" },
    ],
    walkthrough: [
      "Prepare: serve one remote MCP endpoint.",
      "Implement: validate origins.",
      "Measure: authenticate clients and enforce tenant/resource scopes.",
    ],
    gate: "Unauthorized, wrong-origin and cross-tenant calls fail; valid sessions can resume safely.",
    evidence: "Security tests and sequence diagram.",
    refs: [
      { label: "MCP - Current Streamable HTTP Transport Specification", url: "https://modelcontextprotocol.io/specification/2025-11-25/basic/transports" },
      { label: "OpenAI - Safety Best Practices", url: "https://developers.openai.com/api/docs/guides/safety-best-practices" },
      { label: "OpenAI - Workload Identity Federation", url: "https://developers.openai.com/api/docs/guides/workload-identity-federation" },
    ],
  },

  88: {
    rule: "eval",
    failures: "metrics",
    problem:
      "Interoperability is proven when a real client discovers the server, calls the right capability and handles errors. Tool-selection tasks should be evaluated like any other model behavior.",
    concepts: [
      { name: "Client configuration" },
      { name: "Server metadata" },
      { name: "Tool-use evals" },
      { name: "Error handling" },
      { name: "Version compatibility" },
    ],
    walkthrough: [
      "Prepare: connect an MCP-capable client or Responses-based app.",
      "Implement: run 30 tasks and measure tool selection plus task success.",
    ],
    gate: "P16 works end-to-end with a real client and has an eval/security report.",
    evidence: "Ship P16; website shows 16/20 projects.",
    refs: [
      { label: "OpenAI - MCP and Connectors", url: "https://developers.openai.com/api/docs/guides/tools-connectors-mcp" },
      { label: "Model Context Protocol - Introduction", url: "https://modelcontextprotocol.io/docs/getting-started/intro" },
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
    ],
  },

  89: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "A2A focuses on communication between independent agents. The agent card declares capabilities; tasks, messages and artifacts carry the work lifecycle.",
    concepts: [
      {
        name: "Agent cards",
        def: "An agent is a system in which a model chooses actions and tools over multiple steps. Use one only when the path cannot be reliably fixed in advance.",
      },
      { name: "Discovery" },
      { name: "Tasks" },
      { name: "Messages" },
      { name: "Parts" },
      { name: "Artifacts" },
      {
        name: "Streaming",
        def: "Non-streaming waits for one complete response. Streaming emits events as work progresses, improving perceived latency but adding event ordering, partial-state and disconnect concerns.",
      },
      { name: "Opaque agents" },
    ],
    walkthrough: [
      "Prepare: define two specialized agents and publish valid agent cards with skills.",
      "Implement: input/output modes and endpoints.",
    ],
    gate: "A client can discover both agents and select the correct one from metadata.",
    evidence: "MCP-vs-A2A comparison and agent cards.",
    refs: [
      { label: "A2A Protocol - Official Documentation", url: "https://a2a-protocol.org/latest/" },
      { label: "Model Context Protocol - Introduction", url: "https://modelcontextprotocol.io/docs/getting-started/intro" },
    ],
  },

  90: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "Delegation should send a bounded task and receive progress plus durable artifacts. The receiving agent remains an external system, not a hidden function call.",
    concepts: [
      { name: "Task lifecycle" },
      {
        name: "Delegation",
        def: "Delegation transfers a bounded task with explicit inputs, expected artifacts and completion status. It should be evaluated against doing the work locally.",
      },
      { name: "Streaming updates" },
      { name: "Artifact contracts" },
      { name: "Failure propagation" },
    ],
    walkthrough: [
      "Prepare: create a coordinator agent and a specialist agent using different internal implementations.",
      "Implement: delegate one task and stream progress/artifacts.",
    ],
    gate: "The coordinator handles success, failure and cancellation without knowing the specialist's internal tools.",
    evidence: "A2A trace and framework-independence demo.",
    refs: [
      { label: "A2A Protocol - Official Documentation", url: "https://a2a-protocol.org/latest/" },
      { label: "OpenAI Agents SDK - Python", url: "https://openai.github.io/openai-agents-python/" },
      { label: "LangGraph - Documentation", url: "https://docs.langchain.com/oss/python/langgraph/overview" },
    ],
  },
};
