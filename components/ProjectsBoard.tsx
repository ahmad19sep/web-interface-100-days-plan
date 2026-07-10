"use client";

import Link from "next/link";
import { PROJECTS, TOTAL_DAYS, TOTAL_PROJECTS } from "@/lib/plan";
import {
  currentDay,
  projectDone,
  projectStatus,
  shippedCount,
  useProgress,
} from "@/lib/store";
import { ProgressBar } from "./ProgressBar";

export default function ProjectsBoard() {
  const state = useProgress();
  const current = currentDay(state.checkins);
  const shipped = shippedCount(state.checkins);
  const capstone = PROJECTS[PROJECTS.length - 1];
  const capstoneStatus = projectStatus(capstone, state.checkins, current);

  return (
    <div>
      <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm text-mut2">
            What you&apos;ll ship across {TOTAL_DAYS} days
          </div>
          <h1 className="font-display text-[26px] font-bold tracking-[-.02em]">
            Projects
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-edge2 bg-card2 px-3.5 py-2">
          <span className="font-mono text-[15px] font-bold text-accent">
            {shipped}
          </span>
          <span className="text-xs text-mut2">
            / {TOTAL_PROJECTS} shipped · Capstone{" "}
            {capstoneStatus === "locked" ? "locked" : capstoneStatus === "shipped" ? "shipped" : "in progress"}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p) => {
          const st = projectStatus(p, state.checkins, current);
          const done = projectDone(p, state.checkins);
          const total = p.end - p.start + 1;
          const pct = Math.round((done / total) * 100);

          const tagColor =
            st === "shipped" ? "#35D399" : st === "progress" ? "#F5B54B" : "#5D6672";
          const barColor = st === "progress" ? "#F5B54B" : "#35D399";
          const border =
            st === "progress" ? "rgba(245,181,75,.3)" : "var(--edge)";

          const badge =
            st === "shipped" ? (
              <span className="tag-mono bg-[rgba(53,211,153,.12)] text-accent">
                SHIPPED
              </span>
            ) : st === "progress" ? (
              <span className="tag-mono bg-[rgba(245,181,75,.14)] text-today">
                IN PROGRESS
              </span>
            ) : (
              <span className="tag-mono bg-locked text-mut3">LOCKED</span>
            );

          const body = (
            <>
              <div className="mb-3.5 flex items-center justify-between">
                <span
                  className="font-mono text-sm font-bold"
                  style={{ color: tagColor }}
                >
                  {p.id === "CAP" ? "C" : p.id}
                </span>
                {badge}
              </div>
              <div className="mb-1.5 font-display text-[17px] font-semibold">
                {p.name}
              </div>
              <div className="mb-[18px] min-h-[38px] text-[12.5px] leading-[1.5] text-[#7C858F]">
                {p.blurb}
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11.5px] text-mut3">
                  Days {p.start}–{p.end}
                </span>
                <span className="font-mono text-[11.5px] text-mut">
                  {done}/{total}
                </span>
              </div>
              <ProgressBar pct={pct} color={barColor} />
            </>
          );

          if (st === "locked") {
            return (
              <div
                key={p.id}
                className="card-std p-5 opacity-[.62]"
                style={{ borderColor: border }}
              >
                {body}
              </div>
            );
          }
          return (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="card-std lift3d block p-5 !text-ink"
              style={{ borderColor: border }}
            >
              {body}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
