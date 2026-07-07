"use client";

import Link from "next/link";
import { PROJECTS } from "@/lib/plan";
import {
  currentDay,
  projectDone,
  projectStatus,
  shippedCount,
  useProgress,
} from "@/lib/store";

export default function ProjectsBoard() {
  const state = useProgress();
  const current = currentDay(state.checkins);
  const shipped = shippedCount(state.checkins);
  const capstone = PROJECTS.find((p) => p.id === "CAP")!;
  const capstoneStatus = projectStatus(capstone, state.checkins, current);

  return (
    <div>
      <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm text-mut2">
            What you&apos;ll ship across 100 days
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
            / 8 shipped · Capstone{" "}
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
            st === "progress" ? "rgba(245,181,75,.3)" : "#212934";

          const badge =
            st === "shipped" ? (
              <span className="rounded-md bg-[rgba(53,211,153,.12)] px-[9px] py-[3px] font-mono text-[10.5px] text-accent">
                SHIPPED
              </span>
            ) : st === "progress" ? (
              <span className="rounded-md bg-[rgba(245,181,75,.14)] px-[9px] py-[3px] font-mono text-[10.5px] text-today">
                IN PROGRESS
              </span>
            ) : (
              <span className="rounded-md bg-locked px-[9px] py-[3px] font-mono text-[10.5px] text-mut3">
                LOCKED
              </span>
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
              <div className="h-1.5 overflow-hidden rounded-full bg-locked">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: barColor }}
                />
              </div>
            </>
          );

          if (st === "locked") {
            return (
              <div
                key={p.id}
                className="rounded-2xl bg-card p-5 opacity-[.62]"
                style={{ border: `1px solid ${border}` }}
              >
                {body}
              </div>
            );
          }
          return (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="block rounded-2xl bg-card p-5 !text-ink transition-transform hover:-translate-y-0.5"
              style={{ border: `1px solid ${border}` }}
            >
              {body}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
