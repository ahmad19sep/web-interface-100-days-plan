"use client";

// Renderer for the structured written-lesson blocks (lib/lessons/types.ts).
// Pure presentation — completion tracking lives in the stage components.

import { useState } from "react";
import type { Block } from "@/lib/lessons/types";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}
      className="absolute right-2 top-2 cursor-pointer rounded-[7px] border border-edge2 bg-[rgba(13,18,32,.9)] px-2 py-1 font-mono text-[9.5px] tracking-[.08em] text-mut2 hover:text-ink"
      aria-label="Copy code"
    >
      {copied ? "✓ COPIED" : "COPY"}
    </button>
  );
}

const CALLOUT_STYLE = {
  info: {
    border: "rgba(34,211,238,.35)",
    bg: "rgba(34,211,238,.06)",
    icon: "◆",
    fallback: "GOOD TO KNOW",
  },
  warn: {
    border: "rgba(245,158,11,.4)",
    bg: "rgba(245,158,11,.06)",
    icon: "⚠",
    fallback: "WATCH OUT",
  },
  job: {
    border: "rgba(167,139,250,.4)",
    bg: "rgba(167,139,250,.07)",
    icon: "💼",
    fallback: "WHAT AN EMPLOYER SEES",
  },
  interview: {
    border: "rgba(52,211,153,.4)",
    bg: "rgba(52,211,153,.06)",
    icon: "🎤",
    fallback: "INTERVIEW ANGLE",
  },
} as const;

export function BlockView({ block }: { block: Block }) {
  switch (block.t) {
    case "h":
      return (
        <h3 className="mt-2 font-display text-[16.5px] font-bold tracking-[-.01em]">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="text-[14px] leading-[1.75] text-ink2">{block.text}</p>
      );
    case "list":
      return block.ordered ? (
        <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-[13.5px] leading-[1.65] text-ink2">
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      ) : (
        <ul className="flex flex-col gap-1.5 text-[13.5px] leading-[1.65] text-ink2">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-[2px] shrink-0 text-accent">▸</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <div className="relative overflow-hidden rounded-[12px] border border-edge2 bg-[#0a0f1c]">
          {block.file && (
            <div className="border-b border-edge2 px-3.5 py-1.5 font-mono text-[10px] tracking-[.08em] text-mut3">
              {block.file}
            </div>
          )}
          <CopyButton text={block.code} />
          <pre className="overflow-x-auto p-3.5 font-mono text-[12px] leading-[1.6] text-[#c9d6ea]">
            <code>{block.code}</code>
          </pre>
        </div>
      );
    case "terminal":
      return (
        <div className="relative overflow-hidden rounded-[12px] border border-[rgba(34,211,238,.25)] bg-[#07131a]">
          <CopyButton text={block.code} />
          <pre className="overflow-x-auto p-3.5 font-mono text-[12px] leading-[1.6] text-accent">
            <code>$ {block.code}</code>
          </pre>
        </div>
      );
    case "output":
      return (
        <div className="overflow-hidden rounded-[12px] border border-edge3 bg-[#0b101d]">
          <div className="border-b border-edge3 px-3.5 py-1.5 font-mono text-[9.5px] tracking-[.14em] text-mut3">
            {(block.label ?? "expected output").toUpperCase()}
          </div>
          <pre className="overflow-x-auto p-3.5 font-mono text-[11.5px] leading-[1.6] text-mut">
            <code>{block.code}</code>
          </pre>
        </div>
      );
    case "callout": {
      const s = CALLOUT_STYLE[block.kind];
      return (
        <div
          className="rounded-[12px] border p-3.5"
          style={{ borderColor: s.border, background: s.bg }}
        >
          <div className="mb-1 font-mono text-[10px] tracking-[.18em] text-mut2">
            {s.icon} {(block.title ?? s.fallback).toUpperCase()}
          </div>
          <div className="text-[13px] leading-[1.65] text-ink2">
            {block.text}
          </div>
        </div>
      );
    }
  }
}

export function BlockList({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}
