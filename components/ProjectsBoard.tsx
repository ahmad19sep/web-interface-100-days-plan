"use client";

// Project Landmarks — the design's row layout with all 20 real projects:
// icon tile, name, P# · ship day · region, chips, live progress and a
// status pill. Unlocked rows open the full project page.

import Link from "next/link";
import { PROJECTS, TOTAL_DAYS, TOTAL_PROJECTS, weekOf } from "@/lib/plan";
import {
  currentDay,
  projectDone,
  projectStatus,
  shippedCount,
  useProgress,
} from "@/lib/store";

/** Deterministic emoji tile from the project's wording. */
function iconFor(text: string): string {
  const t = text.toLowerCase();
  const rules: [RegExp, string][] = [
    [/capstone|launch/, "🚀"],
    [/agent/, "🤖"],
    [/voice|audio|speech/, "🎙️"],
    [/vision|image|multimodal/, "👁️"],
    [/rag|retriev|search|index/, "📡"],
    [/eval|harness|test/, "⚖️"],
    [/prompt/, "🧪"],
    [/fine-?tun|train|lora|model/, "🧠"],
    [/security|guard|red-?team|inject/, "🛡️"],
    [/deploy|production|backend|serve/, "🏭"],
    [/data|dataset|pipeline|etl/, "🗄️"],
    [/mcp|tool|protocol/, "🔌"],
    [/browser|web|scrape/, "🌐"],
    [/chat|assistant|bot/, "💬"],
    [/api|workbench|cli/, "🛠️"],
  ];
  for (const [re, icon] of rules) if (re.test(t)) return icon;
  return "📦";
}

export default function ProjectsBoard() {
  const state = useProgress();
  const current = currentDay(state.checkins);
  const shipped = shippedCount(state.checkins);

  return (
    <div>
      <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm text-mut2">
            What you&apos;ll ship across {TOTAL_DAYS} days
          </div>
          <h1 className="font-display text-[26px] font-bold tracking-[-.02em]">
            Project Landmarks
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-edge2 bg-card2 px-3.5 py-2">
          <span className="font-mono text-[15px] font-bold text-accent">
            {shipped}
          </span>
          <span className="text-xs text-mut2">/ {TOTAL_PROJECTS} shipped</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {PROJECTS.map((p) => {
          const st = projectStatus(p, state.checkins, current);
          const done = projectDone(p, state.checkins);
          const total = p.end - p.start + 1;
          const region = weekOf(p.shipDay).title.toUpperCase();
          const num = p.id === "CAP" ? "CAP" : p.id;
          const statusColor =
            st === "shipped"
              ? "#22d3ee"
              : st === "progress"
                ? "#f59e0b"
                : "#61708a";
          const statusLabel =
            st === "shipped"
              ? "SHIPPED"
              : st === "progress"
                ? "IN PROGRESS"
                : "LOCKED";

          const chips = [
            `DAYS ${p.start}–${p.end}`,
            `${done}/${total} DONE`,
            ...(p.flagship ? ["⭐ FLAGSHIP"] : []),
          ];

          const rowStyle = {
            borderColor:
              st === "progress"
                ? "rgba(245,158,11,.35)"
                : st === "shipped"
                  ? "rgba(34,211,238,.22)"
                  : "rgba(148,163,184,.1)",
            background:
              st === "shipped" ? "rgba(34,211,238,.04)" : "rgba(13,20,36,.72)",
            opacity: st === "locked" ? 0.72 : 1,
          };

          const body = (
            <>
              <div
                className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[12px] text-[22px]"
                style={{
                  background: "rgba(167,139,250,.1)",
                  border: "1px solid rgba(167,139,250,.25)",
                }}
              >
                {iconFor(p.name + " " + p.blurb)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                  <span className="font-display text-[16px] font-bold">
                    {p.name}
                  </span>
                  <span className="font-mono text-[10px] tracking-[.1em] text-mut3">
                    {num} · SHIP DAY {p.shipDay} · {region}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {chips.map((c) => (
                    <span
                      key={c}
                      className="rounded-[5px] border border-edge3 bg-panel px-2 py-[3px] font-mono text-[9.5px] tracking-[.05em] text-mut"
                    >
                      {c}
                    </span>
                  ))}
                  {st === "progress" && (
                    <span className="ml-1 hidden h-[4px] w-[120px] overflow-hidden rounded-[2px] bg-[#1a2338] sm:block">
                      <span
                        className="block h-full rounded-[2px]"
                        style={{
                          width: `${Math.round((done / total) * 100)}%`,
                          background: "#f59e0b",
                        }}
                      />
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div
                  className="rounded-[6px] border px-2.5 py-1 font-mono text-[9.5px] tracking-[.14em]"
                  style={{
                    color: statusColor,
                    borderColor: `${statusColor}55`,
                  }}
                >
                  {statusLabel}
                </div>
                <div className="mt-1.5 font-mono text-[10.5px] text-mut3">
                  +250 XP
                </div>
              </div>
            </>
          );

          const rowClass =
            "flex items-center gap-4 rounded-[14px] border px-4 py-4 !text-ink transition-colors sm:gap-5 sm:px-5";

          if (st === "locked") {
            return (
              <div key={p.id} className={rowClass} style={rowStyle}>
                {body}
              </div>
            );
          }
          return (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className={`${rowClass} hover:border-[rgba(34,211,238,.4)]`}
              style={rowStyle}
            >
              {body}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
