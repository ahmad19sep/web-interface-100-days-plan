"use client";

import Link from "next/link";
import { GITHUB_REPO, PROJECTS, getDay, pad3 } from "@/lib/plan";
import {
  currentDay,
  setNote,
  toggleDay,
  useProgress,
} from "@/lib/store";
import { Toast, useToast } from "./Toast";
import { IconBack, IconCheck, IconGitHub, IconPlay } from "./icons";

export default function DayDetail({ day }: { day: number }) {
  const state = useProgress();
  const [toast, showToast] = useToast();
  const plan = getDay(day)!;
  const current = currentDay(state.checkins);
  const done = Boolean(state.checkins[day]);
  const isToday = day === current;

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

          <h1 className="mb-[22px] font-display text-[28px] font-bold tracking-[-.02em]">
            {plan.title}
          </h1>

          {/* video placeholder */}
          <div className="relative mb-[22px] flex min-h-[230px] items-center justify-center overflow-hidden rounded-[14px] border border-edge3 bg-inset">
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
                AI Radar · daily lesson
              </div>
            </div>
          </div>

          {/* build + resource tiles */}
          <div className="mb-3.5 grid gap-3.5 sm:grid-cols-2">
            <div className="card-std rounded-[14px] p-[18px]">
              <div className="mb-2 text-[11.5px] text-mut3">
                📺 THE RESOURCE · ~30–45 MIN
              </div>
              <div className="text-sm leading-[1.6] text-ink2">
                {plan.resource}
              </div>
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
              href={`${GITHUB_REPO}/tree/main/day-${pad3(day)}`}
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
