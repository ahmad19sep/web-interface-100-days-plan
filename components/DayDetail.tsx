"use client";

import { useEffect, useState } from "react";
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
  setNote,
  submitQuiz,
  toggleDay,
  useProgress,
} from "@/lib/store";
import { Toast, useToast } from "./Toast";
import { IconBack, IconCheck, IconGitHub, IconPlay } from "./icons";

function QuizCard({
  day,
  quiz,
  saved,
}: {
  day: number;
  quiz: QuizQuestion[];
  saved: Record<number, number>;
}) {
  const [selected, setSelected] = useState<Record<number, number>>(saved);
  const [graded, setGraded] = useState(Object.keys(saved).length > 0);
  const [busy, setBusy] = useState(false);

  const allAnswered = quiz.every((_, i) => selected[i] !== undefined);
  const correctCount = quiz.filter((q, i) => selected[i] === q.correctIndex).length;

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
  }

  return (
    <div className="card-std mb-[22px] rounded-[14px] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="font-display text-[15px] font-semibold">Quick quiz</div>
        {graded && (
          <span className="font-mono text-[12.5px] text-accent">
            {correctCount} / {quiz.length} correct
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
                    disabled={busy}
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
        disabled={!allAnswered || busy}
        className="btn-primary mt-4 w-full py-3 text-sm disabled:cursor-default disabled:opacity-50"
      >
        {busy ? "Checking…" : graded ? "Re-check answers" : "Check answers"}
      </button>
    </div>
  );
}

/** Video id from any YouTube URL shape (youtu.be, watch, live, shorts…). */
function youTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|live\/|shorts\/))([\w-]{11})/
  );
  return m ? m[1] : null;
}

interface DayContent {
  videoUrl: string | null;
  githubUrl: string | null;
  note: string | null;
}

const EMPTY_CONTENT: DayContent = { videoUrl: null, githubUrl: null, note: null };

/**
 * Owner-editable day content (video/GitHub link/note) — live, no deploy
 * needed. `ready` gates the edit panel so its inputs mount already
 * initialized from the fetched value, instead of syncing via an effect.
 */
function useDayContent(day: number): {
  content: DayContent;
  ready: boolean;
  setContent: (next: DayContent) => void;
} {
  const [content, setContent] = useState<DayContent>(EMPTY_CONTENT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/day-content/${day}`)
      .then((res) => res.json())
      .then((body: DayContent) => {
        if (cancelled) return;
        setContent(body);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [day]);

  return { content, ready, setContent };
}

/** Owner-only panel to set this day's video/GitHub link/note live, from the app. */
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
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSave() {
    setBusy(true);
    setSaved(false);
    const res = await fetch(`/api/day-content/${day}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoUrl, githubUrl, note }),
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
  const { content: dayContent, ready: dayContentReady, setContent: setDayContent } =
    useDayContent(day);

  // Owner-set content (live, no deploy) wins over the code-based defaults.
  const effectiveVideo = dayContent.videoUrl ?? plan.video;
  const effectiveGithubUrl = dayContent.githubUrl ?? dayFolderUrl(day);
  const effectiveNote = dayContent.note ?? plan.ownerNote;

  const project = plan.projects.length
    ? PROJECTS.find((p) => p.id === plan.projects[0])
    : undefined;

  function onCheckIn() {
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

          {effectiveNote && (
            <div className="mb-[22px] rounded-[14px] border border-[rgba(53,211,153,.3)] bg-[rgba(53,211,153,.06)] p-[18px]">
              <div className="mb-1.5 font-mono text-[11px] tracking-[.08em] text-accent">
                📌 NOTE FROM {CREATOR.handle.toUpperCase()}
              </div>
              <div className="text-sm leading-[1.6] text-ink2">
                {effectiveNote}
              </div>
            </div>
          )}

          {/* video — embedded once the owner adds the day's link */}
          {effectiveVideo && youTubeId(effectiveVideo) ? (
            <div className="mb-[22px] overflow-hidden rounded-[14px] border border-edge3 bg-inset">
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
              className={`relative mb-[22px] flex min-h-[230px] items-center justify-center overflow-hidden rounded-[14px] border border-edge3 bg-inset ${
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

          {/* build + resource tiles */}
          <div className="mb-3.5 grid gap-3.5 sm:grid-cols-2">
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

          {plan.quiz && plan.quiz.length > 0 && (
            <QuizCard day={day} quiz={plan.quiz} saved={state.quizAnswers[day] ?? {}} />
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
                className="btn-ghost mb-2.5 w-full !border-[rgba(53,211,153,.4)] py-3.5 text-[14.5px] !text-accent"
              >
                <IconCheck size={17} stroke="#35D399" strokeWidth={2.5} />
                Day {day} done · tap to undo
              </button>
            ) : (
              <button
                type="button"
                onClick={onCheckIn}
                className="btn-primary mb-2.5 w-full py-3.5 text-[14.5px] !font-bold"
              >
                <IconCheck size={17} strokeWidth={2.5} />
                Mark Day {day} done
              </button>
            )}
            <a
              href={effectiveGithubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full py-3 text-[13.5px] !rounded-[11px] !font-normal !text-ink"
            >
              <IconGitHub />
              Open the GitHub folder
            </a>
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
                          ? "#2AB98A"
                          : nCurrent
                            ? "#F5B54B"
                            : "#1C2530",
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
