"use client";

// Workspace stages 1–4: Mission, Watch, Understand, Guided Lab.
// Each stage reads/writes the shared WorkspaceProgress blob via `update`.

import { useEffect, useRef, useState } from "react";
import {
  WATCH_THRESHOLD,
  type Lesson,
  type LessonVideo,
  type VideoProgress,
  type WorkspaceProgress,
} from "@/lib/lessons/types";
import { projectPhaseOf } from "@/lib/lessons";
import { pad3 } from "@/lib/plan";
import { BlockList } from "./Blocks";

export interface StageProps {
  lesson: Lesson;
  progress: WorkspaceProgress;
  update: (patch: Partial<WorkspaceProgress>) => void;
  goNext: () => void;
}

export function StageShell({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="anim-fade-up">
      <div className="mb-1 font-mono text-[10px] tracking-[.24em] text-mut3">
        {kicker}
      </div>
      <h2 className="mb-5 font-display text-[21px] font-bold tracking-[-.02em]">
        {title}
      </h2>
      {children}
    </div>
  );
}

export function ContinueBar({
  label = "Continue →",
  onClick,
  disabled,
  note,
}: {
  label?: string;
  onClick: () => void;
  disabled?: boolean;
  note?: string;
}) {
  return (
    <div className="mt-7 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="btn-amber px-6 py-3 text-[14px] disabled:cursor-default disabled:opacity-50"
      >
        {label}
      </button>
      {note && <span className="text-[12px] text-mut3">{note}</span>}
    </div>
  );
}

// ── 01 · MISSION ─────────────────────────────────────────────────────────────

export function MissionStage({ lesson, goNext }: StageProps) {
  const phase = lesson.day ? projectPhaseOf(lesson.day) : null;
  const facts: [string, string][] = [];
  if (lesson.module) facts.push(["MODULE", lesson.module]);
  if (phase)
    facts.push([
      "PROJECT",
      `${phase.project.short} · ${lesson.projectPhase ?? phase.label} · day ${phase.dayIndex} of ${phase.totalDays}`,
    ]);
  if (lesson.durationMinutes)
    facts.push(["TIME", `≈ ${Math.round(lesson.durationMinutes / 60 * 10) / 10} h`]);
  if (lesson.difficulty) facts.push(["LEVEL", lesson.difficulty]);

  return (
    <StageShell kicker={`DAY ${pad3(lesson.day)} · TODAY'S MISSION`} title={lesson.title}>
      <p className="mb-5 max-w-[640px] text-[14.5px] leading-[1.75] text-ink2">
        {lesson.missionBrief}
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        {facts.map(([k, v]) => (
          <span
            key={k}
            className="rounded-[9px] border border-edge2 bg-panel px-3 py-1.5 font-mono text-[10.5px] tracking-[.06em] text-mut"
          >
            <span className="text-mut3">{k}</span> {v}
          </span>
        ))}
      </div>

      {lesson.objectives.length > 0 && (
        <div className="mb-4 rounded-[14px] border-l-[3px] border-accent bg-[rgba(34,211,238,.05)] p-4">
          <div className="mb-2 font-mono text-[10px] tracking-[.2em] text-mut3">
            ◎ BY THE END OF TODAY YOU CAN
          </div>
          <ul className="flex flex-col gap-1.5 text-[13.5px] leading-[1.6] text-ink2">
            {lesson.objectives.map((o, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-[2px] shrink-0 text-accent">▸</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {lesson.whyItMatters && (
        <div className="mb-4 rounded-[14px] border-l-[3px] border-today bg-[rgba(245,158,11,.05)] p-4">
          <div className="mb-1.5 font-mono text-[10px] tracking-[.2em] text-mut3">
            ⚡ WHY THIS MATTERS
          </div>
          <p className="text-[13.5px] leading-[1.7] text-ink2">
            {lesson.whyItMatters}
          </p>
        </div>
      )}

      {lesson.jobRelevance && (
        <div className="mb-4 rounded-[14px] border border-[rgba(167,139,250,.35)] bg-[rgba(167,139,250,.06)] p-4">
          <div className="mb-1.5 font-mono text-[10px] tracking-[.2em] text-mut3">
            💼 WHAT AN EMPLOYER SEES
          </div>
          <p className="text-[13.5px] leading-[1.7] text-ink2">
            {lesson.jobRelevance}
          </p>
        </div>
      )}

      {lesson.prerequisites.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 font-mono text-[10px] tracking-[.2em] text-mut3">
            BEFORE YOU START
          </div>
          <ul className="flex flex-col gap-1 text-[13px] text-mut">
            {lesson.prerequisites.map((pr, i) => (
              <li key={i}>· {pr}</li>
            ))}
          </ul>
        </div>
      )}

      {lesson.finalEvidence && (
        <div className="text-[12.5px] text-mut2">
          <span className="font-mono text-[10px] tracking-[.14em] text-mut3">
            FINAL EVIDENCE ·{" "}
          </span>
          {lesson.finalEvidence}
        </div>
      )}

      <ContinueBar label="Begin →" onClick={goNext} />
    </StageShell>
  );
}

// ── 02 · WATCH ───────────────────────────────────────────────────────────────

function ytIdOf(url: string): string | null {
  const m =
    url.match(/[?&]v=([\w-]{11})/) ??
    url.match(/youtu\.be\/([\w-]{11})/) ??
    url.match(/embed\/([\w-]{11})/) ??
    url.match(/shorts\/([\w-]{11})/);
  return m?.[1] ?? null;
}

interface YTPlayer {
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}
interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      playerVars: Record<string, number | string>;
      events: { onStateChange: (e: { data: number }) => void };
    }
  ) => YTPlayer;
}
declare global {
  interface Window {
    YT?: YTNamespace & { loaded?: number };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  if (!ytApiPromise) {
    ytApiPromise = new Promise((resolve) => {
      if (window.YT?.Player) return resolve(window.YT);
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve(window.YT!);
      };
      if (!document.querySelector("script[src*='youtube.com/iframe_api']")) {
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
    });
  }
  return ytApiPromise;
}

/** Embedded player that reports real watch progress (polled every 5 s). */
function TrackedVideo({
  video,
  saved,
  onProgress,
}: {
  video: LessonVideo;
  saved: VideoProgress | undefined;
  onProgress: (vp: VideoProgress) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const latest = useRef<VideoProgress>(
    saved ?? { seconds: 0, duration: 0, done: false }
  );
  const report = useRef(onProgress);
  useEffect(() => {
    report.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const id = video.url ? ytIdOf(video.url) : null;
    if (!id || !hostRef.current) return;
    let player: YTPlayer | null = null;
    let poll: ReturnType<typeof setInterval> | null = null;
    let disposed = false;

    void loadYouTubeApi().then((YT) => {
      if (disposed || !hostRef.current) return;
      const mount = document.createElement("div");
      hostRef.current.appendChild(mount);
      player = new YT.Player(mount, {
        videoId: id,
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (e) => {
            // 0 = ended
            if (e.data === 0) {
              latest.current = { ...latest.current, done: true };
              report.current(latest.current);
            }
          },
        },
      });
      poll = setInterval(() => {
        if (!player) return;
        try {
          const t = player.getCurrentTime();
          const d = player.getDuration();
          if (!d) return;
          const prev = latest.current;
          const seconds = Math.max(prev.seconds, Math.floor(t));
          const done = prev.done || seconds / d >= WATCH_THRESHOLD;
          if (seconds > prev.seconds + 4 || done !== prev.done) {
            latest.current = { seconds, duration: Math.floor(d), done };
            report.current(latest.current);
          }
        } catch {
          /* player mid-teardown */
        }
      }, 5000);
    });

    return () => {
      disposed = true;
      if (poll) clearInterval(poll);
      try {
        player?.destroy();
      } catch {
        /* already gone */
      }
    };
  }, [video.url]);

  return (
    <div
      ref={hostRef}
      className="aspect-video w-full overflow-hidden rounded-[14px] border border-edge2 bg-black [&>div]:h-full [&>div]:w-full [&_iframe]:h-full [&_iframe]:w-full"
    />
  );
}

const VIDEO_KIND_LABEL = {
  concept: "CONCEPT",
  walkthrough: "CODE WALKTHROUGH",
  mistakes: "COMMON MISTAKES",
  briefing: "BUILD BRIEFING",
} as const;

export function WatchStage({ lesson, progress, update, goNext }: StageProps) {
  const done = (v: LessonVideo) => {
    const vp = progress.video?.[v.id];
    return Boolean(
      vp &&
        (vp.done ||
          (vp.duration > 0 && vp.seconds / vp.duration >= WATCH_THRESHOLD))
    );
  };
  const required = lesson.videos.filter((v) => v.required && v.url);
  const allDone = required.every(done);

  return (
    <StageShell kicker="02 · WATCH" title="Today's video lessons">
      <div className="flex flex-col gap-6">
        {lesson.videos.map((v) => (
          <div key={v.id}>
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-[10px] tracking-[.16em] text-mut3">
                🎬 {VIDEO_KIND_LABEL[v.kind]}
              </span>
              <span className="text-[13.5px] font-medium">{v.title}</span>
              {v.minutes && (
                <span className="font-mono text-[10.5px] text-mut3">
                  {v.minutes} min
                </span>
              )}
              <span
                className={`rounded-full border px-2 py-[2px] font-mono text-[9px] tracking-[.1em] ${
                  v.required
                    ? "border-[rgba(245,158,11,.4)] text-today"
                    : "border-edge3 text-mut3"
                }`}
              >
                {v.required ? "REQUIRED" : "OPTIONAL"}
              </span>
              {done(v) && (
                <span className="font-mono text-[10.5px] text-accent">
                  ✓ WATCHED
                </span>
              )}
            </div>
            {v.url ? (
              <TrackedVideo
                video={v}
                saved={progress.video?.[v.id]}
                onProgress={(vp) =>
                  update({ video: { ...(progress.video ?? {}), [v.id]: vp } })
                }
              />
            ) : (
              <div className="grid aspect-video w-full place-items-center rounded-[14px] border border-dashed border-edge2 bg-[#0a0f1c]">
                <div className="text-center">
                  <div className="mb-1 text-[26px]">🎬</div>
                  <div className="font-mono text-[10.5px] tracking-[.18em] text-mut3">
                    OFFICIAL VIDEO COMING SOON
                  </div>
                  <div className="mt-1 text-[12px] text-mut3">
                    The written lesson below covers everything — the video is a
                    companion, not a requirement.
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ContinueBar
        onClick={goNext}
        note={
          required.length > 0 && !allDone
            ? `Required videos count at ${Math.round(WATCH_THRESHOLD * 100)}% watched — you can read ahead and come back.`
            : undefined
        }
      />
    </StageShell>
  );
}

// ── 03 · UNDERSTAND ──────────────────────────────────────────────────────────

export function UnderstandStage({ lesson, progress, update, goNext }: StageProps) {
  const doneCount = lesson.sections.filter((s) => progress.sections?.[s.id]).length;
  const allDone = doneCount === lesson.sections.length;

  return (
    <StageShell
      kicker={`03 · UNDERSTAND · ${doneCount}/${lesson.sections.length} SECTIONS`}
      title="The written lesson"
    >
      <div className="flex flex-col gap-8">
        {lesson.sections.map((s, i) => {
          const read = Boolean(progress.sections?.[s.id]);
          return (
            <section key={s.id}>
              <h3 className="mb-3 flex items-baseline gap-2.5 font-display text-[16.5px] font-bold tracking-[-.01em]">
                <span className="font-mono text-[11px] text-mut3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.title}
                {read && <span className="text-[12px] text-accent">✓</span>}
              </h3>
              <BlockList blocks={s.blocks} />
              <button
                type="button"
                onClick={() =>
                  update({
                    sections: { ...(progress.sections ?? {}), [s.id]: !read },
                  })
                }
                className={`mt-3.5 cursor-pointer rounded-[10px] border px-3.5 py-2 font-mono text-[10.5px] tracking-[.08em] transition-colors ${
                  read
                    ? "border-[rgba(34,211,238,.4)] bg-[rgba(34,211,238,.08)] text-accent"
                    : "border-edge3 bg-panel text-mut hover:border-[#2A3542] hover:text-ink"
                }`}
              >
                {read ? "✓ SECTION COMPLETE" : "MARK SECTION COMPLETE"}
              </button>
            </section>
          );
        })}
      </div>

      <ContinueBar
        onClick={goNext}
        disabled={!allDone}
        note={allDone ? undefined : "Mark every section complete to continue."}
      />
    </StageShell>
  );
}

// ── 04 · GUIDED LAB ──────────────────────────────────────────────────────────

export function LabStage({ lesson, progress, update, goNext }: StageProps) {
  const lab = lesson.lab;
  const [openHelp, setOpenHelp] = useState<string | null>(null);
  if (!lab) return null;
  const doneCount = lab.steps.filter((s) => progress.lab?.[s.id]).length;
  const allDone = doneCount === lab.steps.length;

  return (
    <StageShell
      kicker={`04 · GUIDED LAB · ${doneCount}/${lab.steps.length} STEPS`}
      title="Practise it, step by step"
    >
      {lab.intro && (
        <p className="mb-5 max-w-[620px] text-[13.5px] leading-[1.7] text-mut">
          {lab.intro}
        </p>
      )}
      <div className="flex flex-col gap-4">
        {lab.steps.map((step, i) => {
          const done = Boolean(progress.lab?.[step.id]);
          const helpOpen = openHelp === step.id;
          return (
            <div
              key={step.id}
              className={`rounded-[14px] border p-4 transition-colors ${
                done
                  ? "border-[rgba(34,211,238,.3)] bg-[rgba(34,211,238,.04)]"
                  : "border-edge2 bg-card2"
              }`}
            >
              <div className="mb-2 flex items-start gap-3">
                <button
                  type="button"
                  aria-label={`Mark step ${i + 1} ${done ? "incomplete" : "complete"}`}
                  onClick={() =>
                    update({ lab: { ...(progress.lab ?? {}), [step.id]: !done } })
                  }
                  className={`mt-[1px] flex h-[22px] w-[22px] shrink-0 cursor-pointer items-center justify-center rounded-[7px] border text-[11px] transition-colors ${
                    done
                      ? "border-accent bg-[rgba(34,211,238,.15)] text-accent"
                      : "border-edge3 text-transparent hover:border-[#2A3542]"
                  }`}
                >
                  ✓
                </button>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 text-[14px] font-semibold">
                    <span className="font-mono text-[11px] text-mut3">
                      STEP {i + 1} ·{" "}
                    </span>
                    {step.title}
                  </div>
                  <p className="text-[13px] leading-[1.65] text-ink2">
                    {step.instruction}
                  </p>
                  {step.explanation && (
                    <p className="mt-1.5 text-[12.5px] leading-[1.6] text-mut">
                      {step.explanation}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pl-[34px]">
                {step.code && (
                  <BlockList
                    blocks={[{ t: "code", ...step.code }]}
                  />
                )}
                {step.command && (
                  <BlockList blocks={[{ t: "terminal", code: step.command }]} />
                )}
                {step.expected && (
                  <div className="text-[12px] text-mut">
                    <span className="font-mono text-[9.5px] tracking-[.14em] text-mut3">
                      EXPECTED ·{" "}
                    </span>
                    {step.expected}
                  </div>
                )}
                {step.commonError && (
                  <div className="text-[12px] text-today">
                    <span className="font-mono text-[9.5px] tracking-[.14em]">
                      ⚠ COMMON ERROR ·{" "}
                    </span>
                    {step.commonError}
                  </div>
                )}
                {(step.troubleshooting || step.hint) && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setOpenHelp(helpOpen ? null : step.id)}
                      className="cursor-pointer font-mono text-[10.5px] tracking-[.08em] text-mut3 hover:text-ink"
                    >
                      {helpOpen ? "▾" : "▸"} I GOT A DIFFERENT RESULT
                    </button>
                    {helpOpen && (
                      <div className="mt-2 rounded-[10px] border border-[rgba(245,158,11,.3)] bg-[rgba(245,158,11,.05)] p-3 text-[12.5px] leading-[1.65] text-ink2">
                        {step.troubleshooting ?? step.hint}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ContinueBar
        onClick={goNext}
        disabled={!allDone}
        note={
          allDone
            ? undefined
            : "Check off every step — actually run them, that's the practice."
        }
      />
    </StageShell>
  );
}
