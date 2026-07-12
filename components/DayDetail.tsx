"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CREATOR,
  dayFolderUrl,
  getDay,
  pad3,
  PROJECTS,
  TOTAL_DAYS,
  youTubeSearchUrl,
} from "@/lib/plan";
import type { QuizQuestion } from "@/lib/challenges/types";
import { projectPhaseOf } from "@/lib/lessons";
import {
  computeStreak,
  isLocked,
  setNote,
  submitQuiz,
  toggleDay,
  useProgress,
} from "@/lib/store";
import { useDayContent, type DayContent } from "@/lib/use-day-content";
import type { DayDoc, DayVideo } from "@/lib/day-content";
import { DocRows, VideoRows } from "./creator/Attachments";
import { Toast, useToast } from "./Toast";
import { IconCheck } from "./icons";

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

export function QuizCard({
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
                        ? "border-[rgba(34,211,238,.5)] bg-[rgba(34,211,238,.08)] !text-accent"
                        : graded && isSelected && !isCorrect
                          ? "border-[rgba(245,181,75,.5)] bg-[rgba(245,181,75,.08)] !text-today"
                          : isSelected
                            ? "border-[rgba(34,211,238,.4)] bg-panel !text-ink"
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
        className="btn-amber mt-4 w-full py-3 text-sm disabled:cursor-default disabled:opacity-50"
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
  "flex-1 rounded-[8px] border border-edge3 bg-card px-2.5 py-1.5 text-[13px] text-ink placeholder:text-dim focus:border-[rgba(34,211,238,.5)] focus:outline-none";

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
                  className="accent-[#22D3EE]"
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

/** "Label | https://url" lines ⇆ link objects, for the creator links field. */
function linksToText(links: { label: string; url: string }[] | null): string {
  return (links ?? [])
    .map((l) => (l.label && l.label !== l.url ? `${l.label} | ${l.url}` : l.url))
    .join("\n");
}

function textToLinks(text: string): { label: string; url: string }[] {
  const out: { label: string; url: string }[] = [];
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    const parts = t.split("|").map((s) => s.trim());
    const url = parts.length > 1 ? parts[1] : parts[0];
    if (!/^https?:\/\//i.test(url)) continue;
    out.push({ label: parts.length > 1 && parts[0] ? parts[0] : url, url });
  }
  return out;
}

/** Owner-only panel to set this day's video/GitHub link/note/links/quiz live, from the app. */
export function CreatorDayPanel({
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
  const [linksText, setLinksText] = useState(linksToText(content.links));
  const [quiz, setQuiz] = useState<QuizDraft[]>(content.quiz ?? []);
  const [videos, setVideos] = useState<DayVideo[]>(content.videos ?? []);
  const [docs, setDocs] = useState<DayDoc[]>(content.docs ?? []);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSave() {
    setBusy(true);
    setSaved(false);
    const res = await fetch(`/api/day-content/${day}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoUrl,
        githubUrl,
        note,
        quiz,
        links: textToLinks(linksText),
        videos,
        docs,
      }),
    });
    const body = (await res.json()) as DayContent;
    setBusy(false);
    if (res.ok) {
      onSaved(body);
      setSaved(true);
    }
  }

  const inputClass =
    "w-full rounded-[10px] border border-edge3 bg-panel px-3 py-2.5 text-[13px] text-ink placeholder:text-dim focus:border-[rgba(34,211,238,.5)] focus:outline-none";

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

        <label className="block">
          <span className="mb-1 block text-xs text-mut3">
            Resource links — one per line, &quot;Label | https://url&quot; (or
            just the URL)
          </span>
          <textarea
            value={linksText}
            onChange={(e) => setLinksText(e.target.value)}
            rows={3}
            placeholder={"Karpathy — GPT Tokenizer | https://youtu.be/…"}
            className={`${inputClass} resize-y font-mono`}
          />
        </label>

        <div className="my-1 h-px bg-[rgba(245,181,75,.2)]" />
        <VideoRows videos={videos} onChange={setVideos} />
        <DocRows docs={docs} onChange={setDocs} />
        <div className="my-1 h-px bg-[rgba(245,181,75,.2)]" />

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
  const done = Boolean(state.checkins[day]);
  const locked = isLocked(day, state.checkins);
  const { content: dayContent, ready: dayContentReady, setContent: setDayContent } =
    useDayContent(day);

  // Owner-set content (live, no deploy) wins over the code-based defaults.
  const effectiveVideo = dayContent.videoUrl ?? plan.video;
  const effectiveGithubUrl = dayContent.githubUrl ?? dayFolderUrl(day);
  const effectiveNote = dayContent.note ?? plan.ownerNote;
  const effectiveQuiz = dayContent.quiz ?? plan.quiz;
  const effectiveLinks = dayContent.links ?? plan.watchLinks ?? null;
  const hasQuiz = Boolean(effectiveQuiz && effectiveQuiz.length > 0);

  // ── build tasks (per-day ritual, kept on this device) ──────────────────
  const [tasks, setTasks] = useState<boolean[]>([false, false, false]);
  const [showNotes, setShowNotes] = useState(false);
  useEffect(() => {
    try {
      const v = localStorage.getItem(`axw-tasks-${day}`);
      setTasks(v ? (JSON.parse(v) as boolean[]) : [false, false, false]);
    } catch {
      setTasks([false, false, false]);
    }
  }, [day]);
  function toggleTask(i: number) {
    if (done || locked) return;
    setTasks((t) => {
      const next = [...t];
      next[i] = !next[i];
      try {
        localStorage.setItem(`axw-tasks-${day}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  }
  const taskLabels = plan.isRest
    ? [
        "Re-read this week's notes and mark your takeaways",
        plan.build,
        `Write one line: what still confuses you? (day-${day})`,
      ]
    : [
        "Study today's lesson material (left side)",
        plan.build,
        `Commit your work + a short note to day-${day}`,
      ];
  const tasksDone = done ? 3 : tasks.filter(Boolean).length;
  const allTasks = done || tasksDone === 3;
  const gateOpen = done;
  const streakNow = computeStreak(state.checkins).streak;
  const xpToday = plan.isRest ? 40 : plan.projects.length ? 250 : 100;

  const savedQuiz = state.quizAnswers[day] ?? {};
  const quizCorrect = effectiveQuiz
    ? effectiveQuiz.filter((q, i) => savedQuiz[i] === q.correctIndex).length
    : 0;

  const project = plan.projects.length
    ? PROJECTS.find((p) => p.id === plan.projects[0])
    : undefined;

  function onCheckIn() {
    if (locked) {
      showToast({ title: "Locked", sub: `Complete day ${day - 1} first.` });
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

  const learnBullets = [plan.resource, plan.why].filter(Boolean) as string[];
  const doneBullets = [plan.doneWhen, plan.proof].filter(Boolean) as string[];

  return (
    <div className="-m-5 sm:-m-7">
      {/* ── header ── */}
      <div className="flex items-center gap-3.5 border-b border-[rgba(148,163,184,.1)] px-5 py-4 pr-16 sm:px-7">
        <span className="whitespace-nowrap rounded-[7px] border border-[rgba(245,158,11,.4)] px-2.5 py-1 font-mono text-[11.5px] tracking-[.14em] text-today">
          DAY {pad3(day)}
        </span>
        <span className="min-w-0 truncate font-display text-[19px] font-bold sm:text-[20px]">
          {plan.title}
        </span>
        {project && (
          <span className="hidden whitespace-nowrap rounded-[6px] border border-[rgba(167,139,250,.35)] px-2 py-0.5 font-mono text-[10px] tracking-[.08em] text-[#c4b5fd] sm:block">
            {project.id} · {projectPhaseOf(day)?.label ?? "BUILD"}
          </span>
        )}
        <Link
          href={`/learn/day/${day}`}
          className="ml-auto hidden whitespace-nowrap rounded-[9px] border border-[rgba(245,158,11,.45)] bg-[rgba(245,158,11,.09)] px-3 py-1.5 font-mono text-[10px] tracking-[.1em] !text-today hover:bg-[rgba(245,158,11,.16)] sm:block"
        >
          ⚒ ENTER FULL WORKSPACE →
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* ── left: the lesson ── */}
        <div className="flex min-w-0 flex-[1.35] flex-col gap-5 px-5 py-6 sm:px-7">
          {/* objective */}
          <div className="border-l-[3px] border-accent py-0.5 pl-3.5">
            <div className="mb-1.5 font-mono text-[10px] tracking-[.22em] text-accent">
              OBJECTIVE
            </div>
            <div className="text-[15px] leading-[1.6] text-ink">
              {plan.about ?? plan.build}
            </div>
          </div>

          {/* video, when it exists */}
          {effectiveVideo && youTubeId(effectiveVideo) && (
            <div className="overflow-hidden rounded-[14px] border border-edge3 bg-inset">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youTubeId(effectiveVideo)}`}
                title={plan.videoTitle ?? `Day ${day} — ${plan.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="aspect-video w-full"
              />
            </div>
          )}

          {/* what to learn */}
          <div>
            <div className="mb-2 font-mono text-[10px] tracking-[.22em] text-mut2">
              WHAT TO LEARN
            </div>
            {learnBullets.map((b) => (
              <div key={b.slice(0, 24)} className="flex gap-2.5 py-1 text-[13.5px] leading-[1.6] text-ink2">
                <span className="text-accent">▸</span>
                <span>{b}</span>
              </div>
            ))}
            {effectiveLinks && effectiveLinks.length > 0 && (
              <div className="mt-1.5 flex flex-col gap-1">
                {effectiveLinks.map((l) => (
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
                className="mt-1.5 block text-[12.5px] !text-mut2 hover:!text-ink"
              >
                🔍 Search this topic on YouTube ↗
              </a>
            )}
          </div>

          {/* creator note */}
          {effectiveNote && (
            <div className="border-l-[3px] border-today py-0.5 pl-3.5">
              <div className="mb-1.5 font-mono text-[10px] tracking-[.22em] text-today">
                📌 NOTE FROM {CREATOR.name.toUpperCase()}
              </div>
              <div className="text-[13.5px] leading-[1.65] text-ink2">
                {effectiveNote}
              </div>
            </div>
          )}

          {/* done when */}
          {doneBullets.length > 0 && (
            <div>
              <div className="mb-2 font-mono text-[10px] tracking-[.22em] text-mut2">
                DONE WHEN
              </div>
              {doneBullets.map((b) => (
                <div key={b.slice(0, 24)} className="flex gap-2.5 py-1 text-[13.5px] leading-[1.6] text-ink2">
                  <span className="text-today">◆</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          )}

          {/* code · video · notes */}
          <div className="flex flex-wrap gap-2.5">
            <a
              href={effectiveGithubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[9px] border border-[rgba(34,211,238,.4)] bg-[rgba(34,211,238,.08)] px-3.5 py-2.5 font-mono text-[12px] !text-accent hover:bg-[rgba(34,211,238,.14)]"
            >
              📦 day-{day} code folder
            </a>
            {effectiveVideo ? (
              <a
                href={effectiveVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[9px] border border-[rgba(248,113,113,.4)] bg-[rgba(248,113,113,.07)] px-3.5 py-2.5 font-mono text-[12px] !text-[#fca5a5] hover:bg-[rgba(248,113,113,.12)]"
              >
                🎬 watch the video
              </a>
            ) : (
              <span className="rounded-[9px] border border-edge2 px-3.5 py-2.5 font-mono text-[12px] text-mut2">
                🎬 video — coming soon
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowNotes((v) => !v)}
              className={`cursor-pointer rounded-[9px] border px-3.5 py-2.5 font-mono text-[12px] transition-colors ${
                showNotes
                  ? "border-[rgba(245,158,11,.5)] bg-[rgba(245,158,11,.1)] text-today"
                  : "border-[rgba(245,158,11,.35)] bg-[rgba(245,158,11,.05)] text-today hover:bg-[rgba(245,158,11,.1)]"
              }`}
            >
              📝 my notes {showNotes ? "▴" : "▾"}
            </button>
          </div>

          {showNotes && (
            <div className="anim-rise rounded-[12px] border border-[rgba(245,158,11,.25)] bg-[rgba(245,158,11,.03)] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[.22em] text-today">
                  MY NOTES — DAY {day}
                </span>
                <span className="font-mono text-[10px] text-mut3">🔒 PRIVATE</span>
              </div>
              <textarea
                value={state.notes[day] ?? ""}
                onChange={(e) => setNote(day, e.target.value)}
                placeholder="What clicked? What broke? What will you try tomorrow?"
                rows={4}
                className="min-h-[88px] w-full resize-y rounded-[10px] border border-edge3 bg-inset p-3.5 text-[13.5px] leading-[1.6] text-ink placeholder:text-dim focus:border-[rgba(245,158,11,.5)] focus:outline-none"
              />
            </div>
          )}

          {state.isOwner && dayContentReady && (
            <CreatorDayPanel day={day} content={dayContent} onSaved={setDayContent} />
          )}
        </div>

        {/* ── right: tasks + gate ── */}
        <div className="flex min-w-0 flex-1 flex-col gap-5 border-t border-[rgba(148,163,184,.1)] bg-[rgba(9,13,24,.5)] px-5 py-6 sm:px-6 lg:border-l lg:border-t-0">
          <div>
            <div className="mb-2.5 font-mono text-[10px] tracking-[.22em] text-mut2">
              BUILD TASKS — {tasksDone}/3
            </div>
            <div className="flex flex-col gap-2">
              {taskLabels.map((label, i) => {
                const checked = done || tasks[i];
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleTask(i)}
                    className="flex cursor-pointer items-start gap-2.5 rounded-[10px] border p-3 text-left text-[13px] leading-[1.5] transition-colors"
                    style={{
                      borderColor: checked
                        ? "rgba(34,211,238,.35)"
                        : "rgba(148,163,184,.16)",
                      background: checked
                        ? "rgba(34,211,238,.05)"
                        : "rgba(148,163,184,.03)",
                      color: checked ? "#8b98ad" : "#e6ecf5",
                    }}
                  >
                    <span
                      className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] text-[11px] text-[#06121a]"
                      style={{
                        borderColor: checked ? "#22d3ee" : "#3b4a63",
                        background: checked ? "#22d3ee" : "transparent",
                      }}
                    >
                      {checked ? "✓" : ""}
                    </span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* the gate */}
          <div
            className="overflow-hidden rounded-[14px] border"
            style={{
              borderColor: gateOpen
                ? "rgba(34,211,238,.45)"
                : allTasks
                  ? "rgba(245,158,11,.35)"
                  : "rgba(148,163,184,.16)",
            }}
          >
            <div className="flex items-center justify-between border-b border-[rgba(148,163,184,.1)] bg-[rgba(148,163,184,.05)] px-4 py-3">
              <span
                className="font-mono text-[11px] tracking-[.18em]"
                style={{
                  color: gateOpen ? "#22d3ee" : allTasks ? "#f59e0b" : "#61708a",
                }}
              >
                ⬢ {hasQuiz ? "QUIZ GATE" : "CHECK-IN GATE"}
              </span>
              <span className="font-mono text-[9.5px] tracking-[.1em] text-mut3">
                {hasQuiz ? "PASS ≥ 60% TO OPEN" : "TASKS OPEN THE GATE"}
              </span>
            </div>

            {locked ? (
              <div className="px-4 py-7 text-center">
                <div className="mb-1.5 text-[26px]">🔒</div>
                <div className="font-mono text-[11px] leading-[1.8] tracking-[.1em] text-mut3">
                  GATE SEALED
                  <br />
                  CLEAR DAY {day - 1} FIRST
                </div>
              </div>
            ) : gateOpen ? (
              <div
                className="anim-rise px-4 py-7 text-center"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(34,211,238,.12), transparent 70%)",
                }}
              >
                <div className="mb-2 text-[32px]">⛩</div>
                <div className="mb-1.5 font-mono text-[13px] tracking-[.26em] text-accent">
                  GATE OPEN
                </div>
                <div className="mb-1 text-[13px] text-ink2">
                  {hasQuiz && effectiveQuiz
                    ? `${quizCorrect}/${effectiveQuiz.length} correct · `
                    : ""}
                  +{xpToday} XP · streak {streakNow} 🔥
                </div>
                {day < TOTAL_DAYS && (
                  <div className="mb-4 font-mono text-[11px] tracking-[.08em] text-today">
                    DAY {day + 1} NOW ILLUMINATED
                  </div>
                )}
                <Link
                  href="/journey"
                  className="btn-primary inline-block px-6 py-3 text-[14px] !font-bold"
                >
                  Continue Journey →
                </Link>
                <button
                  type="button"
                  onClick={onCheckIn}
                  className="mt-3 block w-full cursor-pointer text-center font-mono text-[10px] tracking-[.08em] text-mut3 hover:text-mut"
                >
                  undo this check-in
                </button>
              </div>
            ) : !allTasks ? (
              <div className="px-4 py-7 text-center">
                <div className="mb-1.5 text-[26px]">🔒</div>
                <div className="font-mono text-[11px] leading-[1.8] tracking-[.1em] text-mut3">
                  GATE SEALED
                  <br />
                  COMPLETE ALL BUILD TASKS
                </div>
              </div>
            ) : hasQuiz && effectiveQuiz ? (
              <div className="p-4">
                <QuizCard
                  day={day}
                  quiz={effectiveQuiz}
                  saved={state.quizAnswers[day] ?? {}}
                  disabled={locked}
                  onPassed={() => {
                    if (!done) onCheckIn();
                  }}
                />
              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <div className="mb-3 text-[13px] leading-[1.6] text-ink2">
                  All tasks done — log today and light the next building.
                </div>
                <button
                  type="button"
                  onClick={onCheckIn}
                  className="btn-amber w-full py-3 text-[14px]"
                >
                  <IconCheck size={16} strokeWidth={2.5} />
                  Log check-in — open the gate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
