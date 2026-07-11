// Reading Pack 08 — Days 071–080: Open Models, Quantization and Fine-Tuning
// (opens with the realtime voice week).

import type { ReadingData } from "./core";

export const PACK08: Record<number, ReadingData> = {
  71: {
    rule: "session",
    failures: "voice",
    problem:
      "Voice is an event-driven system involving audio capture, transport, turn detection, generation, playback and tools. Transport choice affects latency and deployment complexity.",
    concepts: [
      {
        name: "WebRTC",
        def: "WebRTC is optimized for low-latency media transport and browser connectivity. It handles audio delivery differently from a general-purpose WebSocket.",
      },
      {
        name: "WebSocket",
        def: "A WebSocket provides a persistent bidirectional channel. The application defines its event protocol, reconnection behavior and ordering guarantees.",
      },
      { name: "SIP" },
      { name: "Ephemeral credentials" },
      { name: "Media path" },
      { name: "Server-side controls" },
    ],
    walkthrough: [
      "Prepare: draw architectures for browser assistant.",
      "Implement: server-controlled voice and phone agent.",
      "Measure: choose one for P14.",
    ],
    gate: "The decision memo explains latency, security, deployment and tool-call implications.",
    evidence: "Voice architecture diagram.",
    refs: [
      { label: "OpenAI - Realtime and Audio", url: "https://developers.openai.com/api/docs/guides/realtime" },
      { label: "OpenAI Agents SDK - Voice Agents", url: "https://openai.github.io/openai-agents-python/voice/quickstart/" },
    ],
  },

  72: {
    rule: "session",
    failures: "voice",
    problem:
      "A realtime session has a lifecycle and an event protocol. The client must handle partial transcripts, audio chunks, tool requests, errors and reconnects.",
    concepts: [
      { name: "Session configuration" },
      { name: "Audio formats" },
      { name: "Event lifecycle" },
      { name: "Client/server messages" },
      { name: "Ephemeral tokens" },
    ],
    walkthrough: [
      "Prepare: connect through WebRTC or WebSocket.",
      "Implement: stream microphone audio and render model audio plus transcripts.",
    ],
    gate: "A five-minute conversation runs without reconnecting or leaking the permanent API key to the browser.",
    evidence: "Event log and basic conversation demo.",
    refs: [
      { label: "OpenAI - Realtime and Audio", url: "https://developers.openai.com/api/docs/guides/realtime" },
      { label: "OpenAI - Production Best Practices", url: "https://developers.openai.com/api/docs/guides/production-best-practices" },
    ],
  },

  73: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "Voice quality is dominated by timing. The system must know when to listen, when to speak, and how to stop immediately when the user interrupts.",
    concepts: [
      { name: "Voice activity detection" },
      { name: "Turn boundaries" },
      { name: "Cancellation" },
      { name: "Buffering" },
      { name: "Latency measurement" },
    ],
    walkthrough: [
      "Prepare: support interruption.",
      "Implement: cancel pending audio.",
      "Measure: tune VAD and log time to first audio plus end-to-end turn latency.",
    ],
    gate: "Users can interrupt naturally and the agent stops old audio before responding.",
    evidence: "Latency dashboard and interruption test video.",
    refs: [
      { label: "OpenAI - Realtime and Audio", url: "https://developers.openai.com/api/docs/guides/realtime" },
      { label: "OpenTelemetry - Documentation", url: "https://opentelemetry.io/docs/" },
    ],
  },

  74: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "A voice agent should acknowledge work, execute the tool, and speak the verified result without exposing raw internal data or blocking the audio pipeline.",
    concepts: [
      {
        name: "Realtime tool events",
        def: "Realtime systems exchange events while a session is active. They must handle partial data, disconnects, backpressure and state synchronization.",
      },
      { name: "Server execution" },
      { name: "Confirmation language" },
      { name: "Read versus write tools" },
    ],
    walkthrough: [
      "Add one live lookup and one write action that requires spoken confirmation plus server-side approval.",
    ],
    gate: "The result is spoken accurately and the write cannot happen from an ambiguous utterance.",
    evidence: "Tool-call trace synchronized with audio transcript.",
    refs: [
      { label: "OpenAI - Realtime and Audio", url: "https://developers.openai.com/api/docs/guides/realtime" },
      { label: "OpenAI - Function Calling", url: "https://developers.openai.com/api/docs/guides/function-calling" },
      { label: "OpenAI - Safety Best Practices", url: "https://developers.openai.com/api/docs/guides/safety-best-practices" },
    ],
  },

  75: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "Real Pakistani conversation often mixes Urdu, Roman Urdu and English entities. Design and test code-switching, not two isolated language modes.",
    concepts: [
      { name: "Language switching" },
      { name: "Pronunciation hints" },
      { name: "Entity confirmation" },
      { name: "Numbers/dates" },
      { name: "Transcript normalization" },
    ],
    walkthrough: [
      "Prepare: create 30 bilingual scenarios for appointments, support or lead qualification.",
      "Implement: add explicit confirmation for critical entities.",
    ],
    gate: "The agent captures names, dates and phone numbers at the required accuracy and asks when uncertain.",
    evidence: "Bilingual scenario set and error clips.",
    refs: [
      { label: "OpenAI - Realtime and Audio", url: "https://developers.openai.com/api/docs/guides/realtime" },
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
    ],
  },

  76: {
    rule: "eval",
    failures: "metrics",
    problem:
      "Loop-level metrics include success rate, iteration count, verification false positives, cost per successful task, unsafe-action rate and escalation quality.",
    concepts: [
      { name: "Task success" },
      { name: "Latency" },
      { name: "Interruption recovery" },
      { name: "Entity accuracy" },
      { name: "Escalation" },
      { name: "Unsafe-action rate" },
    ],
    walkthrough: [
      "Prepare: run scripted and human calls.",
      "Implement: label outcomes and create a dashboard for task success and latency percentiles.",
    ],
    gate: "The top three failure modes are reproduced and at least one is fixed with a regression test.",
    evidence: "Voice evaluation report and test audio set.",
    refs: [
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
      { label: "OpenAI - Realtime and Audio", url: "https://developers.openai.com/api/docs/guides/realtime" },
      { label: "OpenAI - Safety Best Practices", url: "https://developers.openai.com/api/docs/guides/safety-best-practices" },
    ],
  },

  77: {
    rule: "authority",
    failures: "autonomy",
    problem:
      "This lesson turns one part of the project into an explicit engineering system. The objective is to understand the mechanism, expose its assumptions, and create evidence that the result works beyond a single demonstration.",
    concepts: [
      { name: "Session security" },
      { name: "Cost limits" },
      { name: "Fallback UX" },
      { name: "Production monitoring" },
      { name: "Consent disclosure" },
    ],
    walkthrough: [
      "Prepare: deploy the client/server.",
      "Implement: add usage caps.",
      "Measure: error fallback and a visible transcript/tool panel.",
    ],
    gate: "A new user can complete the target task while all tool actions and latency are traceable.",
    evidence: "Ship P14; website shows 14/20 projects; publish the demo and metrics.",
    refs: [
      { label: "OpenAI - Realtime and Audio", url: "https://developers.openai.com/api/docs/guides/realtime" },
      { label: "OpenAI - Deployment Checklist", url: "https://developers.openai.com/api/docs/guides/deployment-checklist" },
      { label: "OpenTelemetry - Documentation", url: "https://opentelemetry.io/docs/" },
    ],
  },

  78: {
    rule: "benchmark",
    failures: "open-models",
    problem:
      "Model selection is an engineering and legal decision. Benchmark the actual task and confirm that the license permits the intended deployment.",
    concepts: [
      { name: "Model cards" },
      { name: "Licenses" },
      { name: "Parameter count" },
      {
        name: "Context",
        def: "Contextual retrieval enriches a chunk with document-level meaning before indexing. This can make isolated fragments easier to retrieve without stuffing the whole document into every query.",
      },
      { name: "Instruction tuning" },
      { name: "Task benchmarks" },
    ],
    walkthrough: [
      "Prepare: shortlist three models for one task.",
      "Implement: run a small evaluation and document hardware/licensing constraints.",
    ],
    gate: "One model is selected with a defensible quality-cost-operability decision.",
    evidence: "Model selection scorecard.",
    refs: [
      { label: "OpenAI - Model Optimization", url: "https://developers.openai.com/api/docs/guides/model-optimization" },
      { label: "vLLM - Documentation", url: "https://docs.vllm.ai/en/latest/" },
    ],
  },

  79: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "A local baseline should record hardware, model configuration, prompt format, quality, latency and memory. Every optimization is compared to this snapshot.",
    concepts: [
      { name: "Chat templates" },
      { name: "Sampling" },
      { name: "KV cache" },
      { name: "Device placement" },
      { name: "Memory footprint" },
      { name: "Throughput" },
    ],
    walkthrough: [
      "Prepare: run the selected model locally or on a hosted GPU.",
      "Implement: log memory.",
      "Measure: tokens/sec.",
      "Validate: latency and quality on the eval set.",
    ],
    gate: "The baseline can be reproduced from a pinned environment and command.",
    evidence: "Inference benchmark and configuration file.",
    refs: [
      { label: "vLLM - Documentation", url: "https://docs.vllm.ai/en/latest/" },
      { label: "Hugging Face - bitsandbytes Quantization", url: "https://huggingface.co/docs/transformers/quantization/bitsandbytes" },
    ],
  },

  80: {
    rule: "benchmark",
    failures: "open-models",
    problem:
      "Quantization changes the runtime representation of weights. Measure quality on your task and latency under realistic concurrency rather than assuming lower precision is always better.",
    concepts: [
      { name: "8-bit" },
      { name: "4-bit/NF4" },
      { name: "Compute dtype" },
      { name: "Offloading" },
      { name: "Memory measurement" },
    ],
    walkthrough: [
      "Prepare: load two quantized variants.",
      "Implement: compare memory.",
      "Measure: latency and evaluation quality against baseline.",
    ],
    gate: "A recommendation states which configuration is acceptable for the target workload.",
    evidence: "Quantization comparison table.",
    refs: [
      { label: "Hugging Face - bitsandbytes Quantization", url: "https://huggingface.co/docs/transformers/quantization/bitsandbytes" },
      { label: "vLLM - Documentation", url: "https://docs.vllm.ai/en/latest/" },
    ],
  },
};
