"use client";

// The full-page daily learning workspace (/learn/day/N).
//
// Layout: stage rail (left) · stage content (center) · utility panel (right,
// collapsible). On mobile the rail becomes horizontal chips and the panel
// stacks below the content. The user's position (lastStage) and every stage's
// state persist server-side (day_progress) — leave and return anywhere,
// any device, and you resume exactly where you stopped.

import Link from "next/link";
import { useMemo, useState } from "react";
import { CreatorDayPanel } from "../DayDetail";
import {
  applyDayContent,
  gateChecklist,
  labDone,
  lessonFor,
  projectPhaseOf,
  reflectionDone,
  sectionsDone,
  shipDone,
  stagesFor,
  verifyStatusOf,
  videoStageDone,
  workspaceState,
  STAGE_LABEL,
  type StageId,
} from "@/lib/lessons";
import { getDay, pad3 } from "@/lib/plan";
import { isLocked, setNote, useProgress } from "@/lib/store";
import { useDayContent } from "@/lib/use-day-content";
import { useWorkspaceProgress } from "@/lib/use-workspace-progress";
import {
  LabStage,
  MissionStage,
  UnderstandStage,
  WatchStage,
} from "./stages-learn";
import {
  BuildStage,
  GateStage,
  QuizStage,
  ReflectStage,
  ShipStage,
  VerifyStage,
} from "./stages-build";

const QUIZ_PASS_FRACTION = 0.6;

const STATE_LABEL: Record<string, string> = {
  locked: "LOCKED",
  available: "AVAILABLE",
  learning: "LEARNING",
  practising: "PRACTISING",
  building: "BUILDING",
  verification_failed: "VERIFICATION FAILED",
  ready_to_submit: "READY TO SUBMIT",
  completed: "COMPLETED",
};

export default function Workspace({ day }: { day: number }) {
  const state = useProgress();
  const {
    content: dayContent,
    ready: contentReady,
    setContent: setDayContent,
  } = useDayContent(day);
  const ws = useWorkspaceProgress(day);

  const plan = getDay(day);
  // whatever the owner attaches live (video/note/links) merges into the
  // lesson here — publishing content never needs a code change
  const lesson = useMemo(() => {
    const base = lessonFor(day);
    return base ? applyDayContent(base, dayContent) : null;
  }, [day, dayContent]);
  const effectiveQuiz = dayContent.quiz ?? plan?.quiz;
  const hasQuiz = Boolean(effectiveQuiz && effectiveQuiz.length > 0);
  const savedAnswers = state.quizAnswers[day] ?? {};
  const quizPassed = hasQuiz
    ? effectiveQuiz!.filter((q, i) => savedAnswers[i] === q.correctIndex)
        .length /
        effectiveQuiz!.length >=
      QUIZ_PASS_FRACTION
    : true;

  const stages = useMemo(
    () => (lesson ? stagesFor(lesson, hasQuiz) : []),
    [lesson, hasQuiz]
  );

  // The stage on screen: the user's explicit choice this visit, else the
  // server-restored lastStage (resume where you stopped), else Mission.
  const [stageOverride, setStageOverride] = useState<StageId | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const saved = ws.progress.lastStage;
  const stage: StageId =
    stageOverride ?? (saved && stages.includes(saved) ? saved : "mission");

  if (!plan || !lesson) return null;

  const checkedIn = Boolean(state.checkins[day]);
  const locked = !checkedIn && isLocked(day, state.checkins);

  const goToStage = (s: StageId) => {
    setStageOverride(s);
    ws.update({ lastStage: s });
    document.getElementById("ws-main")?.scrollTo({ top: 0 });
  };
  const goNext = () => {
    const i = stages.indexOf(stage);
    if (i < stages.length - 1) goToStage(stages[i + 1]);
  };

  const stageDone: Record<StageId, boolean> = {
    mission: stages.indexOf(stage) > 0 || checkedIn,
    watch: videoStageDone(lesson, ws.progress),
    understand: sectionsDone(lesson, ws.progress),
    lab: labDone(lesson, ws.progress) && Boolean(ws.progress.lab),
    build: Boolean(ws.progress.buildStarted),
    verify:
      verifyStatusOf(lesson.verification.fields, ws.progress.verify) ===
      "passed",
    quiz: hasQuiz && quizPassed,
    reflect: reflectionDone(lesson, ws.progress) &&
      Boolean(ws.progress.reflections),
    ship: lesson.shipFields.length > 0 && shipDone(lesson, ws.progress),
    unlock: checkedIn,
  };

  const reqs = gateChecklist(lesson, ws.progress, {
    hasQuiz,
    passed: quizPassed,
  });
  const reqsDone = reqs.filter((r) => r.done).length;
  const dayState = workspaceState(lesson, ws.progress, {
    checkedIn,
    locked,
    hasQuiz,
    quizPassed,
  });
  const phase = projectPhaseOf(day);
  const remainingMin = lesson.durationMinutes
    ? Math.max(
        0,
        Math.round(
          lesson.durationMinutes * (1 - reqsDone / Math.max(1, reqs.length))
        )
      )
    : null;

  // ── locked day ──────────────────────────────────────────────────────────
  if (locked) {
    return (
      <div className="grid min-h-full place-items-center p-8">
        <div className="max-w-[420px] text-center">
          <div className="mb-3 text-[40px]">🔒</div>
          <div className="mb-2 font-display text-[20px] font-bold">
            Day {day} is still dark
          </div>
          <p className="mb-6 text-[13.5px] leading-[1.7] text-mut">
            The road opens one day at a time. Finish the earlier days and this
            workspace illuminates.
          </p>
          <Link href="/journey" className="btn-primary px-6 py-3 text-[14px]">
            Back to the world →
          </Link>
        </div>
      </div>
    );
  }

  if (!ws.ready || !contentReady) {
    return (
      <div className="grid min-h-full place-items-center p-8">
        <div className="font-mono text-[11px] tracking-[.3em] text-mut3">
          OPENING DAY {pad3(day)} WORKSPACE…
        </div>
      </div>
    );
  }

  const renderStage = () => {
    const p = { lesson, progress: ws.progress, update: ws.update, goNext };
    switch (stage) {
      case "mission":
        return <MissionStage {...p} />;
      case "watch":
        return <WatchStage {...p} />;
      case "understand":
        return <UnderstandStage {...p} />;
      case "lab":
        return <LabStage {...p} />;
      case "build":
        return <BuildStage {...p} />;
      case "verify":
        return <VerifyStage {...p} />;
      case "quiz":
        return (
          <QuizStage
            lesson={lesson}
            quiz={effectiveQuiz ?? []}
            saved={savedAnswers}
            goNext={goNext}
          />
        );
      case "reflect":
        return <ReflectStage {...p} />;
      case "ship":
        return <ShipStage {...p} />;
      case "unlock":
        return (
          <GateStage
            lesson={lesson}
            progress={ws.progress}
            hasQuiz={hasQuiz}
            quizPassed={quizPassed}
            flush={ws.flush}
            goToStage={goToStage}
          />
        );
    }
  };

  const stageChip = (s: StageId, i: number, vertical: boolean) => {
    const active = s === stage;
    const done = stageDone[s];
    return (
      <button
        key={s}
        type="button"
        onClick={() => goToStage(s)}
        className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-[10px] border px-3 py-2 text-left transition-colors ${
          vertical ? "w-full" : ""
        } ${
          active
            ? "border-[rgba(34,211,238,.5)] bg-[rgba(34,211,238,.08)]"
            : "border-transparent hover:bg-[rgba(255,255,255,.03)]"
        }`}
      >
        <span
          className={`font-mono text-[10px] ${
            done ? "text-accent" : active ? "text-ink" : "text-mut3"
          }`}
        >
          {done ? "✓" : String(i + 1).padStart(2, "0")}
        </span>
        <span
          className={`text-[12.5px] ${
            active ? "font-semibold text-ink" : done ? "text-ink2" : "text-mut"
          }`}
        >
          {STAGE_LABEL[s]}
        </span>
        {s === "unlock" && !vertical && <span className="text-[11px]">⛩</span>}
      </button>
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* ── header ── */}
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-edge2 bg-[rgba(9,13,24,.85)] px-4 py-3 sm:px-6">
        <span className="rounded-[8px] bg-[rgba(245,158,11,.14)] px-2.5 py-1 font-mono text-[10.5px] font-bold tracking-[.14em] text-today">
          DAY {pad3(day)}
        </span>
        <h1 className="min-w-0 flex-1 truncate font-display text-[15.5px] font-bold tracking-[-.01em]">
          {lesson.title}
        </h1>
        {phase && (
          <span className="hidden rounded-full border border-[rgba(167,139,250,.4)] bg-[rgba(167,139,250,.08)] px-3 py-1 font-mono text-[9.5px] tracking-[.12em] text-[#c4b5fd] md:inline">
            {phase.project.id} · {lesson.projectPhase} · DAY {phase.dayIndex}/
            {phase.totalDays}
          </span>
        )}
        <span className="rounded-full border border-edge2 px-3 py-1 font-mono text-[9.5px] tracking-[.12em] text-mut2">
          {STATE_LABEL[dayState]}
        </span>
        <button
          type="button"
          onClick={() => setPanelOpen((o) => !o)}
          className="hidden cursor-pointer rounded-[8px] border border-edge2 px-2.5 py-1.5 font-mono text-[10px] text-mut2 hover:text-ink lg:block"
          aria-label="Toggle utility panel"
        >
          {panelOpen ? "▸ PANEL" : "◂ PANEL"}
        </button>
        <Link
          href={`/day/${day}`}
          className="rounded-[8px] border border-edge2 px-2.5 py-1.5 font-mono text-[10px] tracking-[.06em] !text-mut2 hover:!text-ink"
        >
          MISSION PREVIEW
        </Link>
        <Link
          href="/journey"
          title="Back to the world"
          className="rounded-[8px] border border-edge2 px-2.5 py-1.5 font-mono text-[11px] !text-mut2 hover:!text-ink"
        >
          ✕
        </Link>
      </header>

      {/* ── mobile stage chips ── */}
      <nav className="flex gap-1 overflow-x-auto border-b border-edge2 bg-[rgba(9,13,24,.7)] px-3 py-2 lg:hidden">
        {stages.map((s, i) => stageChip(s, i, false))}
      </nav>

      <div className="flex min-h-0 flex-1">
        {/* ── left stage rail (desktop) ── */}
        <nav className="hidden w-[190px] shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-edge2 bg-[rgba(9,13,24,.6)] p-3 lg:flex">
          <div className="mb-2 px-3 font-mono text-[9.5px] tracking-[.24em] text-mut3">
            LESSON STAGES
          </div>
          {stages.map((s, i) => stageChip(s, i, true))}
        </nav>

        {/* ── main content ── */}
        <main
          id="ws-main"
          className="min-w-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8"
        >
          <div className="mx-auto max-w-[760px] pb-24">
            {ws.error && (
              <div className="mb-5 rounded-[10px] border border-[rgba(245,158,11,.4)] bg-[rgba(245,158,11,.07)] px-3.5 py-2.5 text-[12.5px] text-today">
                ⚠ {ws.error}
              </div>
            )}
            {renderStage()}

            {/* references live at the end, optional by design */}
            {stage === "understand" && lesson.references.length > 0 && (
              <details className="mt-10 rounded-[14px] border border-edge2 bg-card2 p-4">
                <summary className="cursor-pointer font-mono text-[10.5px] tracking-[.2em] text-mut3">
                  📚 OPTIONAL REFERENCES — THE LESSON ABOVE IS COMPLETE WITHOUT
                  THEM
                </summary>
                <ul className="mt-3 flex flex-col gap-2">
                  {lesson.references.map((r) => (
                    <li key={r.url}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[13px] text-accent hover:text-accent2"
                      >
                        {r.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {/* 👑 owner: attach video / note / links / quiz for this day —
                live for every user and merged into this lesson instantly */}
            {state.isOwner && (
              <div className="mt-10">
                <div className="mb-2 font-mono text-[10px] tracking-[.24em] text-mut3">
                  👑 CREATOR · ATTACH CONTENT TO DAY {pad3(day)}
                </div>
                <CreatorDayPanel
                  day={day}
                  content={dayContent}
                  onSaved={setDayContent}
                />
              </div>
            )}
          </div>
        </main>

        {/* ── right utility panel ── */}
        {panelOpen && (
          <aside className="hidden w-[250px] shrink-0 flex-col gap-3.5 overflow-y-auto border-l border-edge2 bg-[rgba(9,13,24,.6)] p-4 lg:flex">
            <UtilityPanel
              day={day}
              reqsDone={reqsDone}
              reqsTotal={reqs.length}
              remainingMin={remainingMin}
              verifyStatus={ws.progress.verifyStatus ?? "none"}
              hintsUnlocked={ws.progress.hintsUnlocked ?? 0}
              hintsTotal={lesson.hints.length}
              note={state.notes[day] ?? ""}
            />
          </aside>
        )}
      </div>
    </div>
  );
}

function UtilityPanel({
  day,
  reqsDone,
  reqsTotal,
  remainingMin,
  verifyStatus,
  hintsUnlocked,
  hintsTotal,
  note,
}: {
  day: number;
  reqsDone: number;
  reqsTotal: number;
  remainingMin: number | null;
  verifyStatus: "none" | "failed" | "passed";
  hintsUnlocked: number;
  hintsTotal: number;
  note: string;
}) {
  const pct = Math.round((reqsDone / Math.max(1, reqsTotal)) * 100);
  return (
    <>
      <div className="rounded-[14px] border border-edge2 bg-card2 p-3.5">
        <div className="mb-2 font-mono text-[9.5px] tracking-[.2em] text-mut3">
          DAY PROGRESS
        </div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="font-display text-[20px] font-bold text-accent">
            {pct}%
          </span>
          <span className="font-mono text-[10.5px] text-mut3">
            {reqsDone}/{reqsTotal} requirements
          </span>
        </div>
        <div className="h-[6px] overflow-hidden rounded-full bg-[#1a2338]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0e7490] to-[#22d3ee] transition-[width]"
            style={{ width: `${pct}%` }}
          />
        </div>
        {remainingMin !== null && (
          <div className="mt-2 font-mono text-[10px] tracking-[.08em] text-mut3">
            ≈ {remainingMin} MIN REMAINING
          </div>
        )}
      </div>

      <div className="rounded-[14px] border border-edge2 bg-card2 p-3.5">
        <div className="mb-2 font-mono text-[9.5px] tracking-[.2em] text-mut3">
          VERIFICATION
        </div>
        <div
          className={`font-mono text-[11px] tracking-[.06em] ${
            verifyStatus === "passed"
              ? "text-accent"
              : verifyStatus === "failed"
                ? "text-today"
                : "text-mut3"
          }`}
        >
          {verifyStatus === "passed"
            ? "● PASSED"
            : verifyStatus === "failed"
              ? "● FAILED — RESUBMIT"
              : "○ NOT SUBMITTED"}
        </div>
        {hintsTotal > 0 && (
          <div className="mt-2 font-mono text-[10px] text-mut3">
            💡 HINTS USED · {hintsUnlocked}/{hintsTotal}
          </div>
        )}
      </div>

      <div className="flex min-h-[140px] flex-1 flex-col rounded-[14px] border border-edge2 bg-card2 p-3.5">
        <div className="mb-2 font-mono text-[9.5px] tracking-[.2em] text-mut3">
          📝 QUICK NOTE · PRIVATE · AUTOSAVES
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(day, e.target.value)}
          placeholder="Scratchpad for today…"
          className="min-h-[110px] flex-1 resize-none rounded-[10px] border border-edge3 bg-panel p-2.5 text-[12px] leading-[1.6] text-ink placeholder:text-dim focus:border-[rgba(34,211,238,.5)] focus:outline-none"
        />
      </div>
    </>
  );
}
