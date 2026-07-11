"use client";

import Link from "next/link";
import { DAYS, TOTAL_DAYS, pad3, type Project } from "@/lib/plan";
import {
  currentDay,
  projectDone,
  projectStatus,
  useProgress,
} from "@/lib/store";
import { IconBack } from "./icons";
import { ProgressBar } from "./ProgressBar";

export default function ProjectDetail({ project }: { project: Project }) {
  const state = useProgress();
  const current = currentDay(state.checkins);
  const st = projectStatus(project, state.checkins, current);
  const done = projectDone(project, state.checkins);
  const total = project.end - project.start + 1;
  const pct = Math.round((done / total) * 100);
  const days = DAYS.filter(
    (d) => d.day >= project.start && d.day <= project.end
  );
  const nextInProject =
    days.find((d) => !state.checkins[d.day])?.day ?? project.end;

  const accentTag =
    st === "progress"
      ? { color: "var(--today)", bg: "rgba(245,181,75,.14)" }
      : st === "shipped"
        ? { color: "var(--accent)", bg: "rgba(34,211,238,.12)" }
        : { color: "var(--mut3)", bg: "var(--locked)" };

  return (
    <div>
      <Link
        href="/projects"
        className="mb-[18px] flex items-center gap-[7px] text-[13px] !text-mut2 hover:!text-ink"
      >
        <IconBack />
        All projects
      </Link>

      <div className="grid items-start gap-[22px] lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span
              className="rounded-lg px-3 py-[5px] font-mono text-[15px] font-bold"
              style={{ color: accentTag.color, background: accentTag.bg }}
            >
              {project.id === "CAP" ? "C" : project.id}
            </span>
            <span
              className="rounded-md px-2.5 py-[5px] font-mono text-[11.5px]"
              style={{ color: accentTag.color, background: accentTag.bg }}
            >
              {st === "shipped"
                ? "SHIPPED"
                : st === "progress"
                  ? "IN PROGRESS"
                  : "LOCKED"}
            </span>
          </div>
          <h1 className="mb-2.5 font-display text-[28px] font-bold tracking-[-.02em]">
            {project.name}
          </h1>
          <p className="mb-6 max-w-[560px] text-[15px] leading-[1.6] text-mut">
            {project.description}
          </p>

          <div className="card-std p-[22px]">
            <div className="mb-4 font-display text-[15px] font-semibold">
              Days {project.start}–{project.end} · {total} days
            </div>
            <div className="flex flex-col gap-0.5">
              {days.map((d) => {
                const dDone = Boolean(state.checkins[d.day]);
                const dCurrent = d.day === current;
                const status = dDone ? "done" : dCurrent ? "today" : "locked";
                return (
                  <Link
                    key={d.day}
                    href={`/learn/day/${d.day}`}
                    className="flex items-center gap-3 rounded-[9px] px-2 py-2.5"
                    style={{
                      background: dCurrent ? "rgba(245,181,75,.08)" : "transparent",
                    }}
                  >
                    <span
                      className="w-[30px] font-mono text-xs"
                      style={{
                        color: dDone
                          ? "var(--mut3)"
                          : dCurrent
                            ? "var(--today)"
                            : "var(--dim)",
                      }}
                    >
                      {pad3(d.day)}
                    </span>
                    <span
                      className="h-2 w-2 shrink-0 rounded-[2px]"
                      style={{
                        background: dDone
                          ? "var(--done)"
                          : dCurrent
                            ? "var(--today)"
                            : "var(--locked)",
                      }}
                    />
                    <span
                      className="flex-1 truncate text-[13.5px]"
                      style={{
                        color: dDone
                          ? "var(--ink)"
                          : dCurrent
                            ? "var(--today)"
                            : "var(--mut3)",
                      }}
                    >
                      {d.title}
                    </span>
                    <span className="font-mono text-[11px] text-mut3">
                      {status}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* right rail */}
        <div className="flex flex-col gap-3.5 lg:sticky lg:top-6">
          <div className="card-grad rounded-2xl p-[22px]">
            <div className="mb-2.5 font-mono text-xs tracking-[.08em] text-mut3">
              YOUR PROGRESS
            </div>
            <div className="mb-3.5 flex items-baseline gap-2">
              <span className="font-mono text-[34px] font-extrabold text-accent">
                {done}
              </span>
              <span className="text-sm text-mut3">/ {total} days</span>
            </div>
            <div className="mb-1.5">
              <ProgressBar pct={pct} />
            </div>
            <div className="text-xs text-mut3">
              {pct}% · you&apos;re on Day {Math.min(current, TOTAL_DAYS)} of your track
            </div>
          </div>

          <div className="card-std p-[22px]">
            <div className="mb-3 font-display text-sm font-semibold">
              Done when
            </div>
            <p className="mb-4 text-[13px] leading-[1.6] text-mut">
              {project.doneWhen}
            </p>
            <div className="mb-4 text-xs text-mut3">
              Ships as a standalone portfolio piece on Day {project.shipDay}.
            </div>
            <Link
              href={`/learn/day/${nextInProject}`}
              className="btn-ghost w-full py-3 text-[13.5px] !rounded-[11px]"
            >
              Go to {nextInProject === current ? "today's" : "the next"} task
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
