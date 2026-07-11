// Reading Pack 07 — Days 061–070: Multimodal and Realtime Voice Systems.

import type { ReadingData } from "./core";

export const PACK07: Record<number, ReadingData> = {
  61: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "A container creates a consistent runtime from laptop to staging. It should have health checks, a non-root user, explicit ports and no embedded secrets.",
    concepts: [
      {
        name: "Dockerfile layers",
        def: "Docker packages an application and its runtime dependencies into a repeatable image. The image should be minimal, non-root where possible and configurable through environment variables.",
      },
      { name: "Non-root users" },
      { name: "Health checks" },
      { name: "Multi-stage builds" },
      { name: "Compose" },
    ],
    walkthrough: [
      "Prepare: create production and development Docker configurations for API.",
      "Implement: worker.",
      "Measure: database and Redis.",
    ],
    gate: "A clean machine starts the stack with one command and health checks become ready.",
    evidence: "Container build logs and size/security notes.",
    refs: [
      { label: "Docker - Overview", url: "https://docs.docker.com/get-started/docker-overview/" },
      { label: "OpenAI - Deployment Checklist", url: "https://developers.openai.com/api/docs/guides/deployment-checklist" },
    ],
  },

  62: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "Observability answers different questions: traces explain one request, metrics reveal trends, and logs capture discrete events. Correlation IDs connect them.",
    concepts: [
      { name: "Trace/span hierarchy" },
      { name: "Correlation IDs" },
      { name: "Metrics" },
      { name: "Structured logs" },
      { name: "GenAI semantic conventions" },
    ],
    walkthrough: [
      "Prepare: instrument HTTP, retrieval, model and tool spans.",
      "Implement: export to Phoenix or an OTLP-compatible backend.",
    ],
    gate: "One request can be followed end-to-end with latency, tokens, model, cost and errors.",
    evidence: "Trace screenshot and incident-debugging walkthrough.",
    refs: [
      { label: "OpenTelemetry - Documentation", url: "https://opentelemetry.io/docs/" },
      { label: "Arize Phoenix - Documentation", url: "https://arize.com/docs/phoenix" },
    ],
  },

  63: {
    rule: "operations",
    failures: "ops",
    problem:
      "A reusable production template should prove that code can be tested, scanned, built and promoted without manual mystery. Staging is where integrations and migrations are exercised before users are affected.",
    concepts: [
      { name: "Pull-request gates" },
      { name: "Container registry" },
      { name: "Environment secrets" },
      { name: "Migrations" },
      { name: "Rollback" },
    ],
    walkthrough: [
      "Prepare: create GitHub Actions for tests/evals/build/deploy.",
      "Implement: deploy staging and document rollback plus smoke tests.",
    ],
    gate: "A merged change deploys automatically only after software tests and AI evals pass.",
    evidence: "Ship P12; website shows 12/20 projects; release the template for reuse.",
    refs: [
      { label: "GitHub Actions - Get Started", url: "https://docs.github.com/en/actions/get-started" },
      { label: "OpenAI - Deployment Checklist", url: "https://developers.openai.com/api/docs/guides/deployment-checklist" },
      { label: "OpenAI - Workload Identity Federation", url: "https://developers.openai.com/api/docs/guides/workload-identity-federation" },
    ],
  },

  64: {
    rule: "boundary",
    failures: "documents",
    problem:
      "Document modality determines the extraction strategy. Native text should usually be parsed directly; scans may need OCR; visually complex pages may need a vision model.",
    concepts: [
      { name: "Native text extraction" },
      {
        name: "OCR",
        def: "OCR converts pixels into text. It can lose reading order, tables and visual relationships, so the extraction strategy should match the document type.",
      },
      {
        name: "Vision-language models",
        def: "Vision-language models reason over visual content directly. They can preserve layout context but still require validation and provenance.",
      },
      { name: "Page rendering" },
      {
        name: "Routing",
        def: "Routing selects a path based on input type, risk or complexity. A reliable router includes fallback behavior for uncertain classifications.",
      },
    ],
    walkthrough: [
      "Prepare: test three ingestion approaches on text PDFs, scans, tables and forms.",
      "Implement: record accuracy, cost and latency.",
    ],
    gate: "A router selects the cheapest approach that meets field-level accuracy targets.",
    evidence: "Multimodal ingestion decision matrix.",
    refs: [
      { label: "OpenAI - Images and Vision", url: "https://developers.openai.com/api/docs/guides/images-vision" },
      { label: "OpenAI - File Inputs", url: "https://developers.openai.com/api/docs/guides/file-inputs" },
      { label: "OpenAI - Cost Optimization", url: "https://developers.openai.com/api/docs/guides/cost-optimization" },
    ],
  },

  65: {
    rule: "boundary",
    failures: "documents",
    problem:
      "Tables and forms are two-dimensional structures. Flattening them into plain text can destroy row, column and label relationships.",
    concepts: [
      { name: "Bounding boxes" },
      { name: "Table schemas" },
      { name: "Cell relationships" },
      { name: "Page coordinates" },
      { name: "Provenance" },
    ],
    walkthrough: [
      "Extract one table and one form into typed schemas with page numbers and evidence crops or coordinates.",
    ],
    gate: "Rows/fields are validated and reviewers can locate every extracted value in the source.",
    evidence: "Field-level accuracy report and visual evidence viewer.",
    refs: [
      { label: "OpenAI - Images and Vision", url: "https://developers.openai.com/api/docs/guides/images-vision" },
      { label: "Pydantic - Documentation", url: "https://docs.pydantic.dev/latest/" },
    ],
  },

  66: {
    rule: "eval",
    failures: "retrieval",
    problem:
      "A multimodal index should preserve page, region, text and image relationships. Retrieval evaluation must include questions whose answer depends on visual evidence.",
    concepts: [
      {
        name: "Page-level embeddings",
        def: "An embedding maps an item into a numeric vector whose geometry captures useful similarity. The vector is useful only relative to the task and evaluation set.",
      },
      { name: "Captions" },
      { name: "Modality metadata" },
      { name: "Image-text retrieval" },
      { name: "Late fusion" },
    ],
    walkthrough: [
      "Prepare: index page text, generated figure descriptions and image/page identifiers.",
      "Implement: retrieve across modalities.",
    ],
    gate: "The evaluation set contains image-dependent questions and measures whether the correct page/figure is retrieved.",
    evidence: "Multimodal retrieval demo and metrics.",
    refs: [
      { label: "OpenAI - Images and Vision", url: "https://developers.openai.com/api/docs/guides/images-vision" },
      { label: "OpenAI - Retrieval", url: "https://developers.openai.com/api/docs/guides/retrieval" },
      { label: "Anthropic - Contextual Retrieval", url: "https://www.anthropic.com/engineering/contextual-retrieval" },
    ],
  },

  67: {
    rule: "eval",
    failures: "metrics",
    problem:
      "Multimodal evaluation needs field-level accuracy, citation correctness and document-type slices. A few attractive examples are not enough.",
    concepts: [
      { name: "Field accuracy" },
      { name: "Page recall" },
      { name: "Evidence validity" },
      { name: "Visual question answering evals" },
      {
        name: "Error decomposition",
        def: "Decomposition splits a complex request into smaller searches whose evidence can be combined. It is useful when one query contains multiple entities, constraints or time ranges.",
      },
    ],
    walkthrough: [
      "Prepare: create 30 labeled cases and evaluators for extraction.",
      "Implement: retrieval and final answer stages.",
    ],
    gate: "Every failure is assigned to a specific pipeline component with examples.",
    evidence: "Multimodal failure taxonomy and benchmark.",
    refs: [
      { label: "OpenAI - Working with Evals", url: "https://developers.openai.com/api/docs/guides/evals" },
      { label: "Hamel Husain - Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/" },
    ],
  },

  68: {
    rule: "boundary",
    failures: "happy-path",
    problem:
      "Computer use is remote control with uncertain perception. Run it in a sandbox, restrict domains and actions, record screenshots and require approval for consequences.",
    concepts: [
      { name: "Screenshot-action loops" },
      { name: "Coordinate grounding" },
      { name: "Sandboxing" },
      {
        name: "Approval",
        def: "Human approval is required before irreversible or high-risk actions. The approval screen should explain the proposed action and its consequences.",
      },
      { name: "Visual verification" },
    ],
    walkthrough: [
      "Prepare: automate a harmless local or test-site task.",
      "Implement: require confirmation before final submission and capture screenshots at each step.",
    ],
    gate: "The agent completes the task repeatedly without leaving the sandbox or clicking prohibited controls.",
    evidence: "Recorded run and safety checklist.",
    refs: [
      { label: "OpenAI - Computer Use", url: "https://developers.openai.com/api/docs/guides/tools-computer-use" },
      { label: "OpenAI - Safety Best Practices", url: "https://developers.openai.com/api/docs/guides/safety-best-practices" },
    ],
  },

  69: {
    rule: "boundary",
    failures: "documents",
    problem:
      "Integration turns separate extraction and retrieval pieces into a coherent user workflow with upload status, evidence display, corrections and export.",
    concepts: [
      { name: "Upload workflows" },
      { name: "Status events" },
      { name: "Evidence panels" },
      {
        name: "Correction feedback",
        def: "Feedback becomes useful engineering data only when it is tied to a trace, categorized and converted into a reproducible test.",
      },
      { name: "User experience" },
    ],
    walkthrough: [
      "Prepare: create an app where users upload documents.",
      "Implement: review extracted data.",
      "Measure: ask questions and open cited pages/figures.",
    ],
    gate: "The complete path works for at least three document families and retains trace/eval metadata.",
    evidence: "Public or local demo with architecture diagram.",
    refs: [
      { label: "FastAPI - Documentation", url: "https://fastapi.tiangolo.com/" },
      { label: "OpenAI - Images and Vision", url: "https://developers.openai.com/api/docs/guides/images-vision" },
      { label: "Arize Phoenix - Documentation", url: "https://arize.com/docs/phoenix" },
    ],
  },

  70: {
    rule: "boundary",
    failures: "documents",
    problem:
      "This lesson turns one part of the project into an explicit engineering system. The objective is to understand the mechanism, expose its assumptions, and create evidence that the result works beyond a single demonstration.",
    concepts: [
      { name: "Per-document metrics" },
      {
        name: "Human review policy",
        def: "Human review is a designed control point for ambiguous or high-impact cases. Review queues should show evidence and reasons, not just raw model output.",
      },
      { name: "Privacy" },
      { name: "Cost reporting" },
    ],
    walkthrough: [
      "Prepare: publish a case study with dataset.",
      "Implement: evaluation.",
      "Measure: examples.",
      "Validate: architecture.",
      "Document: human-review thresholds and known failure modes.",
    ],
    gate: "A reviewer can reproduce the benchmark and understand when the system abstains.",
    evidence: "Ship P13; website shows 13/20 projects.",
    refs: [
      { label: "OpenAI - Deployment Checklist", url: "https://developers.openai.com/api/docs/guides/deployment-checklist" },
      { label: "OpenAI - Safety Best Practices", url: "https://developers.openai.com/api/docs/guides/safety-best-practices" },
    ],
  },
};
