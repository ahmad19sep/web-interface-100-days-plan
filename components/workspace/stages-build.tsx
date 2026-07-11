"use client";

// Workspace stages 5–10: Main Build, Verification, Quiz, Reflection, Ship,
// and the Unlock gate. The gate re-derives every requirement from the
// server-stored progress blob + server-graded quiz — and the check-in API
// re-checks the quiz on its side, so local state can't cheat the unlock.

import Link from "next/link";
import { useEffect, useState } from "react";
import { QuizCard } from "../DayDetail";
import {
  fieldOk,
  gateChecklist,
  verifyStatusOf,
} from "@/lib/lessons";
import type {
  EvidenceField,
  Lesson,
  StageId,
  WorkspaceProgress,
} from "@/lib/lessons/types";
import { getDay, TOTAL_DAYS } from "@/lib/plan";
import { SHIP_DAYS } from "@/lib/game";
import {
  computeStreak,
  toggleDay,
  useProgress,
} from "@/lib/store";
import type { QuizQuestion } from "@/lib/challenges/types";
import { ContinueBar, StageShell, type StageProps } from "./stages-learn";

// ── 05 · MAIN BUILD ──────────────────────────────────────────────────────────

const HINT_COOLDOWN_MIN = 10;

export function BuildStage({ lesson, progress, update, goNext }: StageProps) {
  // a slow clock for the hint cooldown countdown (ticks every 30 s)
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const started = Boolean(progress.buildStarted);
  const unlocked = progress.hintsUnlocked ?? 0;
  const verifyFailed = progress.verifyStatus === "failed";
  const minutesIn = progress.buildStarted
    ? (now - Date.parse(progress.buildStarted)) / 60_000
    : 0;
  const nextHintReady =
    started &&
    (unlocked === 0 ||
      verifyFailed ||
      minutesIn >= HINT_COOLDOWN_MIN * (unlocked + 1));

  const list = (label: string, items: string[] | undefined, mark: string) =>
    items && items.length > 0 ? (
      <div className="mb-4">
        <div className="mb-2 font-mono text-[10px] tracking-[.2em] text-mut3">
          {label}
        </div>
        <ul className="flex flex-col gap-1.5 text-[13.5px] leading-[1.6] text-ink2">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-[2px] shrink-0 text-accent">{mark}</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  return (
    <StageShell kicker="05 · MAIN BUILD" title="Today's independent build">
      <p className="mb-5 max-w-[640px] text-[14px] leading-[1.75] text-ink2">
        {lesson.build.brief}
      </p>

      {list("⚙ REQUIREMENTS", lesson.build.requirements, "▸")}
      {list("◆ DONE WHEN — ACCEPTANCE CRITERIA", lesson.build.acceptance, "◆")}
      {list("⚠ COMMON MISTAKES", lesson.build.commonMistakes, "⚠")}
      {list("📤 WHAT TO SUBMIT", lesson.build.submission, "▸")}

      {!started ? (
        <button
          type="button"
          onClick={() => update({ buildStarted: new Date().toISOString() })}
          className="btn-primary mt-2 px-6 py-3 text-[14px]"
        >
          ⚒ I&apos;m building — start the clock
        </button>
      ) : (
        <div className="mt-2 font-mono text-[11px] tracking-[.08em] text-accent">
          ⚒ BUILD IN PROGRESS · STARTED{" "}
          {new Date(progress.buildStarted!).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}

      {lesson.hints.length > 0 && (
        <div className="mt-7">
          <div className="mb-3 font-mono text-[10px] tracking-[.2em] text-mut3">
            💡 PROGRESSIVE HINTS — STRUGGLE FIRST, THEY&apos;LL WAIT
          </div>
          <div className="flex flex-col gap-2.5">
            {lesson.hints.map((h, i) => {
              const revealed = unlocked > i;
              const isNext = unlocked === i;
              return (
                <div
                  key={i}
                  className="rounded-[12px] border border-edge2 bg-card2 p-3.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[10.5px] tracking-[.1em] text-mut2">
                      HINT {h.level} · {h.title.toUpperCase()}
                    </span>
                    {!revealed &&
                      (isNext ? (
                        <button
                          type="button"
                          disabled={!nextHintReady}
                          onClick={() => update({ hintsUnlocked: unlocked + 1 })}
                          className="cursor-pointer rounded-[8px] border border-[rgba(245,158,11,.4)] bg-[rgba(245,158,11,.08)] px-3 py-1.5 font-mono text-[10px] tracking-[.08em] text-today disabled:cursor-default disabled:opacity-50"
                        >
                          {nextHintReady
                            ? "REVEAL"
                            : !started
                              ? "START THE BUILD FIRST"
                              : `UNLOCKS AFTER ${Math.ceil(HINT_COOLDOWN_MIN * (unlocked + 1) - minutesIn)} MIN OR A FAILED VERIFICATION`}
                        </button>
                      ) : (
                        <span className="font-mono text-[10px] text-mut3">
                          🔒 AFTER HINT {i}
                        </span>
                      ))}
                  </div>
                  {revealed && (
                    <p className="mt-2 text-[13px] leading-[1.7] text-ink2">
                      {h.body}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ContinueBar
        onClick={goNext}
        disabled={!started}
        note={started ? undefined : "Start the build before moving to verification."}
      />
    </StageShell>
  );
}

// ── evidence field input (shared by Verify + Ship) ───────────────────────────

function EvidenceInput({
  field,
  value,
  onChange,
  showResult,
}: {
  field: EvidenceField;
  value: string;
  onChange: (v: string) => void;
  showResult: boolean;
}) {
  const ok = fieldOk(field, value);
  const attempted = value.trim() !== "";
  const border = showResult
    ? ok
      ? "border-[rgba(34,211,238,.5)]"
      : attempted || field.required
        ? "border-[rgba(245,158,11,.5)]"
        : "border-edge3"
    : "border-edge3";

  if (field.kind === "attest") {
    const checked = value === "yes";
    return (
      <label
        className={`flex cursor-pointer items-start gap-3 rounded-[12px] border bg-panel p-3.5 ${border}`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked ? "yes" : "")}
          className="mt-[2px] h-4 w-4 accent-[#22d3ee]"
        />
        <span>
          <span className="block text-[13px] leading-[1.6] text-ink2">
            {field.label}
            {field.required && <span className="text-today"> *</span>}
          </span>
          {field.hint && (
            <span className="mt-1 block text-[11.5px] text-mut3">
              {field.hint}
            </span>
          )}
        </span>
      </label>
    );
  }

  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] text-ink2">
        {field.label}
        {field.required && <span className="text-today"> *</span>}
      </span>
      {field.kind === "paste" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={`w-full rounded-[12px] border bg-panel px-3.5 py-3 font-mono text-[12px] leading-[1.6] text-ink placeholder:text-dim focus:border-[rgba(34,211,238,.5)] focus:outline-none ${border}`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={`w-full rounded-[12px] border bg-panel px-3.5 py-2.5 text-[13px] text-ink placeholder:text-dim focus:border-[rgba(34,211,238,.5)] focus:outline-none ${border}`}
        />
      )}
      {showResult && !ok && (attempted || field.required) && field.failHelp && (
        <span className="mt-1.5 block text-[12px] leading-[1.6] text-today">
          {field.failHelp}
        </span>
      )}
      {showResult && ok && (
        <span className="mt-1 block font-mono text-[10.5px] text-accent">
          ✓ VERIFIED
        </span>
      )}
    </label>
  );
}

// ── 06 · VERIFICATION ────────────────────────────────────────────────────────

export function VerifyStage({ lesson, progress, update, goNext }: StageProps) {
  const [submitted, setSubmitted] = useState(
    (progress.verifyStatus ?? "none") !== "none"
  );
  const values = progress.verify ?? {};
  const status = progress.verifyStatus ?? "none";

  function setValue(id: string, v: string) {
    update({ verify: { ...values, [id]: v } });
  }

  function submit() {
    const next = verifyStatusOf(lesson.verification.fields, values);
    setSubmitted(true);
    update({
      verifyStatus: next === "none" ? "failed" : next,
      verifyAt: new Date().toISOString(),
    });
  }

  return (
    <StageShell kicker="06 · VERIFICATION" title="Prove the build works">
      {lesson.verification.intro && (
        <p className="mb-5 max-w-[620px] text-[13.5px] leading-[1.7] text-mut">
          {lesson.verification.intro}
        </p>
      )}

      <div
        className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[10.5px] tracking-[.1em] ${
          status === "passed"
            ? "border-[rgba(34,211,238,.5)] bg-[rgba(34,211,238,.08)] text-accent"
            : status === "failed"
              ? "border-[rgba(245,158,11,.5)] bg-[rgba(245,158,11,.08)] text-today"
              : "border-edge3 text-mut3"
        }`}
      >
        {status === "passed"
          ? "● VERIFICATION PASSED"
          : status === "failed"
            ? "● VERIFICATION FAILED — FIX AND RESUBMIT"
            : "○ NOT SUBMITTED"}
        {progress.verifyAt && status !== "none" && (
          <span className="text-mut3">
            {new Date(progress.verifyAt).toLocaleString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      <div className="flex max-w-[640px] flex-col gap-4">
        {lesson.verification.fields.map((f) => (
          <EvidenceInput
            key={f.id}
            field={f}
            value={values[f.id] ?? ""}
            onChange={(v) => setValue(f.id, v)}
            showResult={submitted}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submit}
          className="btn-primary px-6 py-3 text-[14px]"
        >
          Run verification
        </button>
        {status === "passed" && (
          <button
            type="button"
            onClick={goNext}
            className="btn-amber px-6 py-3 text-[14px]"
          >
            Continue →
          </button>
        )}
      </div>
      <p className="mt-4 max-w-[620px] text-[11.5px] leading-[1.6] text-mut3">
        Pastes are checked against the lesson&apos;s expected patterns and URLs
        are validated; deeper automated checks (GitHub repo inspection,
        sandboxed test runs) are on the roadmap — see docs/verification-system.md.
        This course runs on honest evidence: it&apos;s your portfolio you&apos;d
        be faking.
      </p>
    </StageShell>
  );
}

// ── 07 · QUIZ ────────────────────────────────────────────────────────────────

export function QuizStage({
  lesson,
  quiz,
  saved,
  goNext,
}: {
  lesson: Lesson;
  quiz: QuizQuestion[];
  saved: Record<number, number>;
  goNext: () => void;
}) {
  return (
    <StageShell kicker="07 · QUIZ" title="Prove you understood it">
      <div className="max-w-[640px] rounded-[16px] border border-edge2 bg-card2 p-5">
        <QuizCard day={lesson.day} quiz={quiz} saved={saved} onPassed={goNext} />
      </div>
      <p className="mt-3 text-[11.5px] text-mut3">
        Your answers are stored server-side — the gate re-grades them there, and
        retries are unlimited.
      </p>
    </StageShell>
  );
}

// ── 08 · REFLECTION ──────────────────────────────────────────────────────────

export function ReflectStage({ lesson, progress, update, goNext }: StageProps) {
  const reflections = progress.reflections ?? {};
  const anySaved = Object.values(reflections).some((r) => r.trim().length >= 20);

  return (
    <StageShell kicker="08 · REFLECTION" title="Write it down — future you is reading">
      <p className="mb-5 max-w-[620px] text-[13.5px] leading-[1.7] text-mut">
        These notes autosave, stay private, and become raw material for your
        portfolio case studies, LinkedIn posts and the Day-120 retrospective.
        Answer at least one properly (a real sentence or two) to satisfy the gate.
      </p>
      <div className="flex max-w-[640px] flex-col gap-4">
        {lesson.reflectionPrompts.map((prompt, i) => (
          <label key={i} className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-ink2">
              {prompt}
            </span>
            <textarea
              value={reflections[i] ?? ""}
              onChange={(e) =>
                update({ reflections: { ...reflections, [i]: e.target.value } })
              }
              rows={3}
              placeholder="Write in your own words…"
              className="w-full rounded-[12px] border border-edge3 bg-panel px-3.5 py-3 text-[13px] leading-[1.65] text-ink placeholder:text-dim focus:border-[rgba(34,211,238,.5)] focus:outline-none"
            />
          </label>
        ))}
      </div>
      <ContinueBar
        onClick={goNext}
        disabled={!anySaved}
        note={anySaved ? "Saved ✓" : "Answer at least one prompt (20+ characters)."}
      />
    </StageShell>
  );
}

// ── 09 · SHIP ────────────────────────────────────────────────────────────────

export function ShipStage({ lesson, progress, update, goNext }: StageProps) {
  const values = progress.ship ?? {};
  const allOk = lesson.shipFields
    .filter((f) => f.required)
    .every((f) => fieldOk(f, values[f.id]));

  return (
    <StageShell kicker="09 · SHIP" title="Submit your portfolio evidence">
      <div className="flex max-w-[640px] flex-col gap-4">
        {lesson.shipFields.map((f) => (
          <EvidenceInput
            key={f.id}
            field={f}
            value={values[f.id] ?? ""}
            onChange={(v) => update({ ship: { ...values, [f.id]: v } })}
            showResult
          />
        ))}
      </div>

      {allOk && (
        <div className="mt-6 max-w-[640px] rounded-[16px] border border-[rgba(245,158,11,.35)] bg-[rgba(245,158,11,.04)] p-5">
          <div className="mb-2 font-mono text-[10px] tracking-[.24em] text-mut3">
            🏆 DAY {lesson.day} EVIDENCE CARD
          </div>
          <div className="mb-1 text-[15px] font-semibold">{lesson.title}</div>
          {values["ship-note"] && (
            <div className="mb-2 text-[13px] leading-[1.6] text-ink2">
              {values["ship-note"]}
            </div>
          )}
          {Object.entries(values)
            .filter(([, v]) => v.trim().startsWith("http"))
            .map(([k, v]) => (
              <div key={k} className="truncate font-mono text-[11.5px] text-accent">
                {v}
              </div>
            ))}
          <div className="mt-2 font-mono text-[10px] tracking-[.1em] text-mut3">
            SAVED TO YOUR PROFILE · {lesson.projectId ?? "AX-120"}
          </div>
        </div>
      )}

      <ContinueBar
        onClick={goNext}
        disabled={!allOk}
        label="To the gate →"
        note={allOk ? undefined : "Fill the required evidence to continue."}
      />
    </StageShell>
  );
}

// ── 10 · UNLOCK — the gate ───────────────────────────────────────────────────

export function GateStage({
  lesson,
  progress,
  hasQuiz,
  quizPassed,
  flush,
  goToStage,
}: {
  lesson: Lesson;
  progress: WorkspaceProgress;
  hasQuiz: boolean;
  quizPassed: boolean;
  flush: () => Promise<void>;
  goToStage: (s: StageId) => void;
}) {
  const state = useProgress();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const checkedIn = Boolean(state.checkins[lesson.day]);
  const reqs = gateChecklist(lesson, progress, { hasQuiz, passed: quizPassed });
  const allDone = reqs.every((r) => r.done);
  const plan = getDay(lesson.day);
  const xp = plan?.isRest ? 40 : SHIP_DAYS.has(lesson.day) ? 250 : 100;
  const streak = computeStreak(state.checkins).streak;

  async function openGate() {
    setBusy(true);
    setError("");
    try {
      await flush(); // progress lands server-side before the check-in
      toggleDay(lesson.day);
    } catch {
      setError("Couldn't reach the server — try again.");
    } finally {
      setBusy(false);
    }
  }

  if (checkedIn) {
    return (
      <StageShell kicker="10 · UNLOCK" title="Gate open">
        <div className="max-w-[560px] rounded-[18px] border border-[rgba(34,211,238,.4)] bg-[rgba(34,211,238,.05)] p-7 text-center">
          <div className="mb-2 text-[44px]">⛩</div>
          <div className="mb-1 font-display text-[24px] font-bold tracking-[-.02em] text-accent">
            GATE OPEN
          </div>
          <div className="mb-4 font-mono text-[12px] tracking-[.08em] text-mut">
            +{xp} XP · STREAK {streak} 🔥
          </div>
          {lesson.day < TOTAL_DAYS && (
            <div className="mb-5 font-mono text-[10.5px] tracking-[.22em] text-today">
              DAY {lesson.day + 1} NOW ILLUMINATED
            </div>
          )}
          {lesson.nextDayPreview && (
            <p className="mb-5 text-[13px] leading-[1.6] text-mut">
              Next: {lesson.nextDayPreview}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/journey" className="btn-primary px-6 py-3 text-[14px]">
              Continue journey →
            </Link>
            {lesson.shipFields.length > 0 && (
              <button
                type="button"
                onClick={() => goToStage("ship")}
                className="btn-ghost px-5 py-3 text-[13.5px]"
              >
                View evidence
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => toggleDay(lesson.day)}
            className="mt-5 cursor-pointer text-[11.5px] text-mut3 hover:text-ink"
          >
            Undo check-in
          </button>
        </div>
      </StageShell>
    );
  }

  return (
    <StageShell kicker="10 · UNLOCK" title="The check-in gate">
      <div className="max-w-[560px]">
        <div className="mb-5 rounded-[16px] border border-edge2 bg-card2 p-5">
          <div className="mb-3 font-mono text-[10px] tracking-[.24em] text-mut3">
            ⬢ GATE REQUIREMENTS · {reqs.filter((r) => r.done).length}/{reqs.length}
          </div>
          <div className="flex flex-col gap-2">
            {reqs.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => goToStage(r.stage)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-[10px] border px-3.5 py-2.5 text-left text-[13px] transition-colors ${
                  r.done
                    ? "border-[rgba(34,211,238,.3)] bg-[rgba(34,211,238,.04)] text-ink2"
                    : "border-edge3 bg-panel text-mut hover:border-[#2A3542]"
                }`}
              >
                <span>
                  {r.done ? "✅" : "○"} {r.label}
                </span>
                {!r.done && (
                  <span className="font-mono text-[9.5px] tracking-[.1em] text-mut3">
                    GO →
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-3 rounded-[10px] border border-[rgba(248,113,113,.35)] bg-[rgba(248,113,113,.06)] px-3.5 py-2.5 text-[13px] text-[#fca5a5]">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={() => void openGate()}
          disabled={!allDone || busy}
          className="btn-amber w-full py-4 text-[15px] !font-bold disabled:cursor-default disabled:opacity-50"
        >
          {busy
            ? "Opening…"
            : allDone
              ? `⛩ Open the gate — complete Day ${lesson.day}`
              : "⛩ Gate sealed — finish the requirements above"}
        </button>
        <p className="mt-3 text-center font-mono text-[10px] tracking-[.1em] text-mut3">
          THE SERVER RE-CHECKS THE QUIZ — LOCAL STATE CAN&apos;T OPEN THIS
        </p>
      </div>
    </StageShell>
  );
}
