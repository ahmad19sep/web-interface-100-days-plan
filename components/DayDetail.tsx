"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CREATOR,
  dayFolderUrl,
  getDay,
  pad3,
  PROJECTS,
  youTubeSearchUrl,
} from "@/lib/plan";
import type { QuizQuestion } from "@/lib/challenges/types";
import {
  currentDay,
  isLocked,
  setNote,
  submitQuiz,
  toggleDay,
  useProgress,
} from "@/lib/store";
import { useDayContent, type DayContent } from "@/lib/use-day-content";
import { Toast, useToast } from "./Toast";
import { IconBack, IconCheck, IconGitHub, IconPlay } from "./icons";

/** Video id from any YouTube URL shape (youtu.be, watch, live, shorts…). */
function youTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|live\/|shorts\/))([\w-]{11})/
  );
  return m ? m[1] : null;
}

const QUIZ_PASS_FRACTION = 0.6;

const CONFETTI_EMOJI = ["🎉", "🎊", "✨", "⭐", "🥳", "💚"];

interface ConfettiPiece {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

function randomPieces(): ConfettiPiece[] {
  return Array.from({ length: 44 }, (_, i) => ({
    id: i,
    emoji: CONFETTI_EMOJI[i % CONFETTI_EMOJI.length],
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2.1 + Math.random() * 1.5,
    size: 15 + Math.random() * 15,
  }));
}

function Confetti() {
  // Lazy initializer runs once on mount and caches the result — the
  // React-endorsed way to seed state from an impure source like
  // Math.random() without re-rolling on every render.
  const [pieces] = useState<ConfettiPiece[]>(randomPieces);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="anim-confetti-fall absolute top-0"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

function QuizResultModal({
  correct,
  total,
  passed,
  onClose,
}: {
  correct: number;
  total: number;
  passed: boolean;
  onClose: () => void;
}) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <>
      {passed && <Confetti />}
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-5"
        onClick={onClose}
      >
        <div
          className="anim-toast-in w-full max-w-[360px] rounded-[20px] border border-edge bg-card p-8 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-3 text-[52px] leading-none">{passed ? "🎉" : "😢"}</div>
          <div className="mb-1.5 font-display text-xl font-bold">
            {passed ? "Congratulations!" : "Not quite — try again"}
          </div>
          <div className="mb-5 font-mono text-sm text-mut2">
            {correct} / {total} correct · {pct}%
          </div>
          <button
            type="button"
            onClick={onClose}
            className={passed ? "btn-primary w-full py-3 text-sm" : "btn-ghost w-full py-3 text-sm"}
          >
            {passed ? "Continue →" : "Try again"}
          </button>
        </div>
      </div>
    </>
  );
}

function QuizCard({
  day,
  quiz,
  saved,
  onPassed,
  disabled,
}: {
  day: number;
  quiz: QuizQuestion[];
  saved: Record<number, number>;
  onPassed?: () => void;
  disabled?: boolean;
}) {
  const [selected, setSelected] = useState<Record<number, number>>(saved);
  const [graded, setGraded] = useState(Object.keys(saved).length > 0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ correct: number; total: number; passed: boolean } | null>(
    null
  );

  const allAnswered = quiz.every((_, i) => selected[i] !== undefined);
  const correctCount = quiz.filter((q, i) => selected[i] === q.correctIndex).length;
  const passed = correctCount / quiz.length >= QUIZ_PASS_FRACTION;

  async function onSubmit() {
    setBusy(true);
    await submitQuiz(
      day,
      Object.entries(selected).map(([qi, si]) => ({
        questionIndex: Number(qi),
        selectedIndex: si,
      }))
    );
    setBusy(false);
    setGraded(true);
    const nowCorrect = quiz.filter((q, i) => selected[i] === q.correctIndex).length;
    const nowPassed = nowCorrect / quiz.length >= QUIZ_PASS_FRACTION;
    setResult({ correct: nowCorrect, total: quiz.length, passed: nowPassed });
    if (nowPassed) onPassed?.();
  }

  return (
    <div id="quiz">
      {result && (
        <QuizResultModal
          correct={result.correct}
          total={result.total}
          passed={result.passed}
          onClose={() => setResult(null)}
        />
      )}
      <div className="mb-3 flex items-center justify-between">
        <div className="font-mono text-[11px] tracking-[.08em] text-mut3">
          🧩 QUIZ · PASS AT {Math.round(QUIZ_PASS_FRACTION * 100)}%
        </div>
        {graded && (
          <span
            className={`font-mono text-[12.5px] ${passed ? "text-accent" : "text-today"}`}
          >
            {correctCount} / {quiz.length} correct{passed ? " · passed" : " · try again"}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {quiz.map((q, qi) => (
          <div key={qi}>
            <div className="mb-2 text-[13.5px] font-medium text-ink2">
              {qi + 1}. {q.question}
            </div>
            <div className="flex flex-col gap-1.5">
              {q.options.map((opt, oi) => {
                const isSelected = selected[qi] === oi;
                const isCorrect = oi === q.correctIndex;
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={busy || disabled}
                    onClick={() => {
                      setSelected((s) => ({ ...s, [qi]: oi }));
                      setGraded(false);
                    }}
                    className={`flex items-center gap-2.5 rounded-[10px] border p-2.5 text-left text-[13px] transition-colors ${
                      graded && isCorrect
                        ? "border-[rgba(53,211,153,.5)] bg-[rgba(53,211,153,.08)] !text-accent"
                        : graded && isSelected && !isCorrect
                          ? "border-[rgba(245,181,75,.5)] bg-[rgba(245,181,75,.08)] !text-today"
                          : isSelected
                            ? "border-[rgba(53,211,153,.4)] bg-panel !text-ink"
                            : "border-edge3 bg-panel !text-ink2 hover:border-[#2A3542]"
                    }`}
                  >
                    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-current text-[10px]">
                      {graded && isCorrect ? "✓" : graded && isSelected ? "✕" : ""}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => void onSubmit()}
        disabled={!allAnswered || busy || disabled}
        className="btn-primary mt-4 w-full py-3 text-sm disabled:cursor-default disabled:opacity-50"
      >
        {disabled
          ? "🔒 Locked"
          : busy
            ? "Checking…"
            : graded
              ? "Re-check answers"
              : "Check answers"}
      </button>
    </div>
  );
}

interface QuizDraft {
  question: string;
  options: string[];
  correctIndex: number;
}

const smallInputClass =
  "flex-1 rounded-[8px] border border-edge3 bg-card px-2.5 py-1.5 text-[13px] text-ink placeholder:text-dim focus:border-[rgba(53,211,153,.5)] focus:outline-none";

function QuizBuilder({
  quiz,
  onChange,
}: {
  quiz: QuizDraft[];
  onChange: (next: QuizDraft[]) => void;
}) {
  function updateQuestion(qi: number, patch: Partial<QuizDraft>) {
    onChange(quiz.map((q, i) => (i === qi ? { ...q, ...patch } : q)));
  }
  function updateOption(qi: number, oi: number, value: string) {
    onChange(
      quiz.map((q, i) =>
        i === qi ? { ...q, options: q.options.map((o, j) => (j === oi ? value : o)) } : q
      )
    );
  }
  function addQuestion() {
    onChange([...quiz, { question: "", options: ["", ""], correctIndex: 0 }]);
  }
  function removeQuestion(qi: number) {
    onChange(quiz.filter((_, i) => i !== qi));
  }
  function addOption(qi: number) {
    onChange(quiz.map((q, i) => (i === qi ? { ...q, options: [...q.options, ""] } : q)));
  }
  function removeOption(qi: number, oi: number) {
    onChange(
      quiz.map((q, i) => {
        if (i !== qi) return q;
        const options = q.options.filter((_, j) => j !== oi);
        const correctIndex = q.correctIndex >= oi && q.correctIndex > 0 ? q.correctIndex - 1 : q.correctIndex;
        return { ...q, options, correctIndex: Math.min(correctIndex, options.length - 1) };
      })
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {quiz.map((q, qi) => (
        <div key={qi} className="rounded-[10px] border border-edge3 bg-panel p-3">
          <div className="mb-2 flex items-center gap-2">
            <input
              type="text"
              value={q.question}
              onChange={(e) => updateQuestion(qi, { question: e.target.value })}
              placeholder={`Question ${qi + 1}`}
              className={smallInputClass}
            />
            <button
              type="button"
              onClick={() => removeQuestion(qi)}
              className="shrink-0 text-[11px] text-mut3 hover:text-today"
            >
              Remove
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${qi}`}
                  checked={q.correctIndex === oi}
                  onChange={() => updateQuestion(qi, { correctIndex: oi })}
                  title="Mark as the correct answer"
                  className="accent-[#35D399]"
                />
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(qi, oi, e.target.value)}
                  placeholder={`Option ${oi + 1}`}
                  className={smallInputClass}
                />
                {q.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(qi, oi)}
                    className="shrink-0 text-[11px] text-mut3 hover:text-today"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(qi)}
              className="self-start text-[12px] !text-accent hover:!text-accent2"
            >
              + Add option
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addQuestion}
        className="btn-ghost self-start px-3 py-1.5 text-[12.5px]"
      >
        + Add question
      </button>
    </div>
  );
}

/** Owner-only panel to set this day's video/GitHub link/note/quiz live, from the app. */
function CreatorDayPanel({
  day,
  content,
  onSaved,
}: {
  day: number;
  content: DayContent;
  onSaved: (next: DayContent) => void;
}) {
  const [videoUrl, setVideoUrl] = useState(content.videoUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(content.githubUrl ?? "");
  const [note, setNoteText] = useState(content.note ?? "");
  const [quiz, setQuiz] = useState<QuizDraft[]>(content.quiz ?? []);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSave() {
    setBusy(true);
    setSaved(false);
    const res = await fetch(`/api/day-content/${day}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoUrl, githubUrl, note, quiz }),
    });
    const body = (await res.json()) as DayContent;
    setBusy(false);
    if (res.ok) {
      onSaved(body);
      setSaved(true);
    }
  }

  const inputClass =
    "w-full rounded-[10px] border border-edge3 bg-panel px-3 py-2.5 text-[13px] text-ink placeholder:text-dim focus:border-[rgba(53,211,153,.5)] focus:outline-none";

  return (
    <div className="mb-[22px] rounded-[14px] border border-[rgba(245,181,75,.3)] bg-[rgba(245,181,75,.05)] p-[18px]">
      <div className="mb-3 font-mono text-[11px] tracking-[.08em] text-today">
        👑 CREATOR — visible only to you
      </div>
      <div className="flex flex-col gap-2.5">
        <label className="block">
          <span className="mb-1 block text-xs text-mut3">Video link</span>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtu.be/…"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-mut3">
            GitHub link (defaults to the day-{day} folder if left blank)
          </span>
          <input
            type="text"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/…"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-mut3">
            Note — shown to everyone on this day
          </span>
          <textarea
            value={note}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
            placeholder="Anything worth flagging for today's build…"
            className={`${inputClass} resize-y`}
          />
        </label>

        <div>
          <span className="mb-1.5 block text-xs text-mut3">
            Quiz — leave empty for no quiz today
          </span>
          <QuizBuilder quiz={quiz} onChange={setQuiz} />
        </div>

        <button
          type="button"
          onClick={() => void onSave()}
          disabled={busy}
          className="btn-primary self-start px-4 py-2 text-[13px] disabled:cursor-default disabled:opacity-60"
        >
          {busy ? "Saving…" : saved ? "Saved ✓" : "Save for everyone"}
        </button>
      </div>
    </div>
  );
}

export default function DayDetail({ day }: { day: number }) {
  const state = useProgress();
  const [toast, showToast] = useToast();
  const plan = getDay(day)!;
  const current = currentDay(state.checkins);
  const done = Boolean(state.checkins[day]);
  const isToday = day === current;
  const locked = isLocked(day, state.checkins);
  const { content: dayContent, ready: dayContentReady, setContent: setDayContent } =
    useDayContent(day);

  // Owner-set content (live, no deploy) wins over the code-based defaults.
  const effectiveVideo = dayContent.videoUrl ?? plan.video;
  const effectiveGithubUrl = dayContent.githubUrl ?? dayFolderUrl(day);
  const effectiveNote = dayContent.note ?? plan.ownerNote;
  const effectiveQuiz = dayContent.quiz ?? plan.quiz;
  const hasQuiz = Boolean(effectiveQuiz && effectiveQuiz.length > 0);
  const quizPassed = !hasQuiz || (() => {
    const saved = state.quizAnswers[day] ?? {};
    if (!effectiveQuiz || Object.keys(saved).length < effectiveQuiz.length) return false;
    const correct = effectiveQuiz.filter((q, i) => saved[i] === q.correctIndex).length;
    return correct / effectiveQuiz.length >= QUIZ_PASS_FRACTION;
  })();

  const project = plan.projects.length
    ? PROJECTS.find((p) => p.id === plan.projects[0])
    : undefined;

  function onCheckIn() {
    if (locked) {
      showToast({
        title: "Locked",
        sub: `Complete day ${day - 1} first.`,
      });
      return;
    }
    const newStreak = toggleDay(day);
    if (!state.checkins[day]) {
      showToast({
        title: `Shabash! Day ${day} logged.`,
        sub: `Streak → ${newStreak} 🔥 · see you tomorrow`,
      });
    }
  }

  const around = [day - 1, day, day + 1].filter((n) => n >= 1 && n <= 100);

  return (
    <div>
      <Link
        href="/journey"
        className="mb-[18px] flex items-center gap-[7px] text-[13px] !text-mut2 hover:!text-ink"
      >
        <IconBack />
        Back to journey map
      </Link>

      <div className="grid items-start gap-[22px] lg:grid-cols-[1fr_320px]">
        {/* main column */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div
              className={`font-mono text-[44px] font-extrabold tracking-[-.03em] ${
                done || isToday ? "text-accent" : "text-dim"
              }`}
            >
              {pad3(day)}
            </div>
            <div className="pt-1.5">
              <div className="font-mono text-xs text-mut3">/ 100</div>
              <div className="mt-1 flex flex-wrap gap-2">
                {project && (
                  <span className="tag-mono !px-[9px] !py-[3px] bg-[rgba(53,211,153,.1)] text-accent">
                    {project.id} · {project.short}
                  </span>
                )}
                {plan.isRest && (
                  <span className="tag-mono !px-[9px] !py-[3px] bg-[rgba(245,181,75,.14)] text-today">
                    REST DAY
                  </span>
                )}
                {done ? (
                  <span className="tag-mono !px-[9px] !py-[3px] bg-[rgba(53,211,153,.12)] text-accent">
                    DONE{state.checkins[day] ? ` · ${state.checkins[day]}` : ""}
                  </span>
                ) : isToday ? (
                  <span className="tag-mono !px-[9px] !py-[3px] bg-[rgba(245,181,75,.14)] text-today">
                    TODAY
                  </span>
                ) : (
                  <span className="tag-mono !px-[9px] !py-[3px] bg-locked text-mut3">
                    LOCKED
                  </span>
                )}
              </div>
            </div>
          </div>

          <h1 className="mb-2 font-display text-[28px] font-bold tracking-[-.02em]">
            {plan.title}
          </h1>
          {plan.about ? (
            <p className="mb-[22px] max-w-[680px] text-[14.5px] leading-[1.7] text-mut">
              {plan.about}
            </p>
          ) : (
            <div className="mb-[22px]" />
          )}

          {state.isOwner && dayContentReady && (
            <CreatorDayPanel day={day} content={dayContent} onSaved={setDayContent} />
          )}

          {/* Today's learnings from the creator — note, video, GitHub link, quiz,
              all in one clearly-labeled section instead of scattered around the page. */}
          <div className="mb-[22px] overflow-hidden rounded-[16px] border border-edge bg-card">
            <div className="border-b border-edge3 px-[18px] py-3.5 font-display text-[15px] font-semibold">
              📦 Today&apos;s learnings from {CREATOR.name}
            </div>
            <div className="flex flex-col gap-[18px] p-[18px]">
              {effectiveNote && (
                <div id="creator-note">
                  <div className="mb-1.5 font-mono text-[11px] tracking-[.08em] text-accent">
                    📌 NOTE
                  </div>
                  <div className="text-sm leading-[1.6] text-ink2">{effectiveNote}</div>
                </div>
              )}

              <div id="creator-video">
                <div className="mb-1.5 font-mono text-[11px] tracking-[.08em] text-mut3">
                  🎬 VIDEO
                </div>
                {effectiveVideo && youTubeId(effectiveVideo) ? (
                  <div className="overflow-hidden rounded-[14px] border border-edge3 bg-inset">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${youTubeId(effectiveVideo)}`}
                      title={plan.videoTitle ?? `Day ${day} — ${plan.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="aspect-video w-full"
                    />
                  </div>
                ) : (
                  <a
                    href={effectiveVideo ?? undefined}
                    target={effectiveVideo ? "_blank" : undefined}
                    rel={effectiveVideo ? "noopener noreferrer" : undefined}
                    className={`relative flex min-h-[230px] items-center justify-center overflow-hidden rounded-[14px] border border-edge3 bg-inset ${
                      effectiveVideo ? "" : "pointer-events-none"
                    }`}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(135deg,rgba(53,211,153,.08),transparent)",
                      }}
                    />
                    <div className="z-[1] flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-[rgba(255,255,255,.1)] backdrop-blur-[4px]">
                      <IconPlay size={24} />
                    </div>
                    <div className="absolute bottom-3.5 left-4 z-[1]">
                      <div className="text-[13.5px] font-medium text-ink">
                        {plan.videoTitle ?? `Day ${day} — ${plan.title}`}
                      </div>
                      <div className="mt-[3px] font-mono text-[11px] text-accent">
                        {effectiveVideo
                          ? "AI Radar · daily lesson"
                          : "AI Radar · video coming soon"}
                      </div>
                    </div>
                  </a>
                )}
              </div>

              <div>
                <div className="mb-1.5 font-mono text-[11px] tracking-[.08em] text-mut3">
                  💻 CODE
                </div>
                <a
                  href={effectiveGithubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost self-start px-4 py-2.5 text-[13px] !font-normal !text-ink"
                >
                  <IconGitHub />
                  View the code
                </a>
              </div>

              {effectiveQuiz && effectiveQuiz.length > 0 && (
                <>
                  <div className="h-px bg-edge3" />
                  <QuizCard
                    day={day}
                    quiz={effectiveQuiz}
                    saved={state.quizAnswers[day] ?? {}}
                    disabled={locked}
                    onPassed={() => {
                      if (!done) onCheckIn();
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* build + resource tiles */}
          <div id="resources" className="mb-3.5 grid gap-3.5 sm:grid-cols-2">
            <div className="card-std rounded-[14px] p-[18px]">
              <div className="mb-2 text-[11.5px] text-mut3">
                📺 THE RESOURCE · ~30–45 MIN
              </div>
              <div className="text-sm leading-[1.6] text-ink2">
                {plan.resource}
              </div>
              {plan.watchLinks && plan.watchLinks.length > 0 && (
                <div className="mt-3 flex flex-col gap-1.5">
                  {plan.watchLinks.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] !text-accent hover:!text-accent2"
                    >
                      ▶ {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
              {!plan.isRest && (
                <a
                  href={youTubeSearchUrl(plan)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-[13px] !text-accent hover:!text-accent2"
                >
                  🔍 Search this topic on YouTube ↗
                </a>
              )}
            </div>
            <div className="card-std rounded-[14px] p-[18px]">
              <div className="mb-2 text-[11.5px] text-mut3">
                📖 THE BUILD · ~45–75 MIN
              </div>
              <div className="text-sm leading-[1.6] text-ink2">
                {plan.build}
              </div>
            </div>
          </div>
          {plan.doneWhen && (
            <div className="card-std mb-[22px] rounded-[14px] p-[18px]">
              <div className="mb-2 text-[11.5px] text-mut3">✓ DONE WHEN</div>
              <div className="text-sm leading-[1.6] text-ink2">
                {plan.doneWhen}
              </div>
            </div>
          )}

          {/* notes */}
          <div className="card-std rounded-[14px] p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-display text-[15px] font-semibold">
                Your notes
              </div>
              <span className="text-[11.5px] text-mut3">🔒 Private</span>
            </div>
            <textarea
              value={state.notes[day] ?? ""}
              onChange={(e) => setNote(day, e.target.value)}
              placeholder="What clicked? What broke? What will you try tomorrow?"
              rows={4}
              className="min-h-[88px] w-full resize-y rounded-[10px] border border-edge3 bg-panel p-3.5 text-[13.5px] leading-[1.6] text-ink placeholder:text-dim focus:border-[rgba(53,211,153,.5)] focus:outline-none"
            />
          </div>
        </div>

        {/* right rail */}
        <div className="flex flex-col gap-3.5 lg:sticky lg:top-6">
          <div className="card-std p-5">
            {done ? (
              <button
                type="button"
                onClick={onCheckIn}
                className="btn-ghost w-full !border-[rgba(53,211,153,.4)] py-3.5 text-[14.5px] !text-accent"
              >
                <IconCheck size={17} stroke="#35D399" strokeWidth={2.5} />
                Day {day} done · tap to undo
              </button>
            ) : locked ? (
              <button
                type="button"
                disabled
                className="btn-ghost w-full cursor-default py-3.5 text-[14.5px] !text-mut3 opacity-50"
              >
                🔒 Complete Day {day - 1} first
              </button>
            ) : hasQuiz && !quizPassed ? (
              <a
                href="#quiz"
                className="btn-ghost flex w-full items-center justify-center gap-2 !border-[rgba(245,181,75,.4)] py-3.5 text-[14.5px] !text-today"
              >
                🧩 Pass the quiz to finish (60%+)
              </a>
            ) : (
              <button
                type="button"
                onClick={onCheckIn}
                className="btn-primary w-full py-3.5 text-[14.5px] !font-bold"
              >
                <IconCheck size={17} strokeWidth={2.5} />
                Mark Day {day} done
              </button>
            )}
          </div>

          <div className="card-std p-5">
            <div className="mb-3.5 font-display text-sm font-semibold">
              Helping material
            </div>
            <div className="flex flex-col gap-2">
              {effectiveNote && (
                <a
                  href="#creator-note"
                  className="btn-ghost w-full py-2.5 text-[13px] !rounded-[11px] !font-normal !text-ink"
                >
                  📝 Creator&apos;s note
                </a>
              )}
              {effectiveVideo ? (
                <a
                  href={effectiveVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost w-full py-2.5 text-[13px] !rounded-[11px] !font-normal !text-ink"
                >
                  🎬 Watch the video
                </a>
              ) : (
                <a
                  href="#creator-video"
                  className="btn-ghost w-full py-2.5 text-[13px] !rounded-[11px] !font-normal !text-ink"
                >
                  🎬 Video (coming soon)
                </a>
              )}
              <a
                href={effectiveGithubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full py-2.5 text-[13px] !rounded-[11px] !font-normal !text-ink"
              >
                <IconGitHub />
                View the code
              </a>
              <a
                href="#resources"
                className="btn-ghost w-full py-2.5 text-[13px] !rounded-[11px] !font-normal !text-ink"
              >
                📚 Resources
              </a>
              {hasQuiz && (
                <a
                  href="#quiz"
                  className="btn-ghost w-full py-2.5 text-[13px] !rounded-[11px] !font-normal !text-ink"
                >
                  🧩 Quiz
                </a>
              )}
            </div>
          </div>

          <div className="card-std p-5">
            <div className="mb-3.5 font-display text-sm font-semibold">
              Around today
            </div>
            <div className="flex flex-col gap-0.5">
              {around.map((n) => {
                const p = getDay(n)!;
                const nDone = Boolean(state.checkins[n]);
                const nCurrent = n === current;
                const self = n === day;
                return (
                  <Link
                    key={n}
                    href={`/day/${n}`}
                    className={`flex items-center gap-2.5 rounded-lg p-2 ${
                      self ? "bg-[rgba(245,181,75,.08)]" : ""
                    } ${!nDone && !nCurrent && !self ? "opacity-50" : ""}`}
                  >
                    <span
                      className={`w-[26px] font-mono text-[11px] ${
                        self ? "text-today" : "text-mut3"
                      }`}
                    >
                      {pad3(n)}
                    </span>
                    <span
                      className="h-2 w-2 shrink-0 rounded-[2px]"
                      style={{
                        background: nDone
                          ? "var(--done)"
                          : nCurrent
                            ? "var(--today)"
                            : "var(--locked)",
                      }}
                    />
                    <span
                      className={`flex-1 truncate text-[13px] ${
                        self ? "!text-today" : "!text-ink"
                      }`}
                    >
                      {p.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
