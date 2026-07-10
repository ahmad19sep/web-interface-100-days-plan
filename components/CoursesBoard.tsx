"use client";

// The course catalog. One course — the challenge itself — no external
// courses. After login this is the landing screen: click the course, start.

import Link from "next/link";
import {
  CHALLENGE,
  CREATOR,
  TOTAL_DAYS,
  TOTAL_PROJECTS,
} from "@/lib/plan";
import {
  computeStreak,
  currentDay,
  shippedCount,
  useProgress,
} from "@/lib/store";
import { Logo } from "./icons";
import { ProgressBar } from "./ProgressBar";

export default function CoursesBoard() {
  const state = useProgress();
  const done = Object.keys(state.checkins).length;
  const day = Math.min(currentDay(state.checkins), TOTAL_DAYS);
  const started = done > 0;
  const complete = done >= TOTAL_DAYS;
  const streak = computeStreak(state.checkins);
  const shipped = shippedCount(state.checkins);
  const pct = Math.round((done / TOTAL_DAYS) * 100);

  return (
    <div>
      <div className="mb-[22px]">
        <div className="text-sm text-mut2">Your courses</div>
        <h1 className="font-display text-[26px] font-bold tracking-[-.02em]">
          Courses
        </h1>
      </div>

      <Link
        href="/today"
        className="card-grad block max-w-[760px] p-6 !text-ink transition-transform hover:-translate-y-0.5 sm:p-8"
      >
        <div className="mb-4 flex items-center gap-3.5">
          <Logo size={46} radius={13} />
          <div className="min-w-0">
            <div className="font-display text-[19px] font-bold tracking-[-.02em] sm:text-[22px]">
              {CHALLENGE.title}
            </div>
            <div className="text-[13px] text-mut2">
              By {CREATOR.name} · {CREATOR.handle}
            </div>
          </div>
        </div>

        <p className="mb-5 max-w-[620px] text-[14.5px] leading-[1.6] text-mut">
          Raw APIs → retrieval → evals → agents → loop engineering →
          production backend → multimodal → voice → open models → MCP/A2A →
          AI security → capstone. Build the primitive, measure the system,
          ship the evidence — every day has a lesson, a build, a done-when,
          and public proof.
        </p>

        <div className="mb-5 flex flex-wrap gap-[18px] font-mono text-[13px] text-mut2">
          <span>
            <span className="font-bold text-ink">{TOTAL_DAYS}</span> days
          </span>
          <span>
            <span className="font-bold text-ink">{TOTAL_PROJECTS}</span>{" "}
            portfolio projects
          </span>
          <span>
            <span className="font-bold text-today">🔥 {streak.streak}</span>{" "}
            streak
          </span>
        </div>

        <div className="mb-2 flex items-center justify-between text-xs text-mut2">
          <span>
            {done}/{TOTAL_DAYS} days · {shipped}/{TOTAL_PROJECTS} projects
            shipped
          </span>
          <span className="font-mono">{pct}%</span>
        </div>
        <div className="mb-6">
          <ProgressBar pct={pct} />
        </div>

        <span className="btn-primary px-6 py-3.5 text-[15px] !font-bold">
          {complete
            ? "Course complete — see your certificate →"
            : started
              ? `Continue — Day ${day} →`
              : "Start the course →"}
        </span>
      </Link>
    </div>
  );
}
