"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { DAYS, PROJECTS, getDay, pad3, weekOf, youTubeSearchUrl } from "@/lib/plan";
import {
  computeStreak,
  currentDay,
  expectedDay,
  shippedCount,
  toggleDay,
  useProgress,
} from "@/lib/store";
import { useDayContent } from "@/lib/use-day-content";
import { buildCells, JourneyCells } from "./JourneyGrid";
import { ProgressBar } from "./ProgressBar";
import { Toast, useToast } from "./Toast";
import { IconCheck, IconClockBack } from "./icons";

/**
 * Check-in action for the dashboard. When today's day has a quiz, this
 * always routes to the day page instead of completing inline — otherwise
 * the dashboard's one-click check-in would silently bypass the quiz's 60%
 * pass gate that only lives on /day/[n].
 */
function CheckInAction({
  day,
  ready,
  hasQuiz,
  quizLabel,
  label,
  className,
  onCheckIn,
}: {
  day: number;
  /** Whether we've confirmed today's quiz status — false briefly on load. */
  ready: boolean;
  hasQuiz: boolean;
  quizLabel: string;
  label: React.ReactNode;
  className: string;
  onCheckIn: () => void;
}) {
  // Disabled until we know whether this day has a quiz — otherwise a fast
  // click in that window could bypass a quiz that's only set in the
  // database (no code-based fallback to catch it on the first render).
  if (!ready) {
    return (
      <button type="button" disabled className={`${className} cursor-default opacity-60`}>
        {label}
      </button>
    );
  }
  if (hasQuiz) {
    return (
      <Link href={`/day/${day}`} className={className}>
        🧩 {quizLabel}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onCheckIn} className={className}>
      {label}
    </button>
  );
}

const emptySubscribe = () => () => {};
/** false during SSR/hydration, true after — avoids a streak-number mismatch */
function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function projectBadge(day: number): string | null {
  const plan = getDay(day);
  if (!plan || plan.projects.length === 0) return null;
  const p = PROJECTS.find((x) => x.id === plan.projects[0]);
  return p ? `${p.id} · ${p.short}` : null;
}

function DayCounterCard({
  label,
  day,
  done,
  shipped,
  extra,
}: {
  label: string;
  day: number;
  done: number;
  shipped: number;
  extra?: React.ReactNode;
}) {
  return (
    <div className="card-grad flex flex-col p-[26px] py-7">
      <div className="mb-1.5 font-mono text-xs tracking-[.1em] text-mut3">
        {label}
      </div>
      <div className="stat-md font-mono font-extrabold leading-[.9] tracking-[-.04em] text-accent">
        {pad3(day)}
      </div>
      <div className="mt-1 font-mono text-[15px] text-mut3">/ 100</div>
      <div className="my-[22px] h-px bg-edge3" />
      {extra ?? (
        <>
          <div className="mb-3 flex justify-between">
            <span className="text-[13px] text-mut2">Progress</span>
            <span className="font-mono text-[13px] text-ink">{done}%</span>
          </div>
          <div className="mb-5">
            <ProgressBar pct={done} />
          </div>
          <div className="flex justify-between text-[12.5px] text-mut2">
            <span>Projects shipped</span>
            <span className="font-mono text-ink">{shipped} / 8</span>
          </div>
        </>
      )}
    </div>
  );
}

function ThisWeekCard({
  day,
  checkins,
}: {
  day: number;
  checkins: Record<number, string>;
}) {
  const week = weekOf(Math.min(day, 100));
  const days = DAYS.filter((d) => d.day >= week.start && d.day <= week.end);
  return (
    <div className="card-std p-[22px]">
      <div className="mb-4 font-display text-[15px] font-semibold">
        This week
      </div>
      <div className="flex flex-col gap-3">
        {days.map((d) => {
          const done = Boolean(checkins[d.day]);
          const today = d.day === day;
          if (done)
            return (
              <Link
                key={d.day}
                href={`/day/${d.day}`}
                className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-0.5 transition-colors hover:bg-card2"
              >
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-accent-deep">
                  <IconCheck size={12} />
                </span>
                <span className="flex-1 truncate text-[13.5px] !text-ink">
                  Day {d.day} · {d.title}
                </span>
                <span className="font-mono text-xs text-mut3">done</span>
              </Link>
            );
          if (today)
            return (
              <Link
                key={d.day}
                href={`/day/${d.day}`}
                className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-0.5 transition-colors hover:bg-card2"
              >
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-md border border-[rgba(245,181,75,.5)] bg-[rgba(245,181,75,.16)] font-mono text-[10px] text-today">
                  {d.day}
                </span>
                <span className="flex-1 truncate text-[13.5px] !text-today">
                  Day {d.day} · {d.title}
                </span>
                <span className="font-mono text-xs text-today">today</span>
              </Link>
            );
          return (
            <Link
              key={d.day}
              href={`/day/${d.day}`}
              className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-0.5 opacity-50 transition-colors hover:bg-card2"
            >
              <span className="h-[22px] w-[22px] rounded-md bg-locked" />
              <span className="flex-1 truncate text-[13.5px] !text-ink">
                Day {d.day} · {d.title}
              </span>
              <span className="font-mono text-xs text-mut3">
                {checkins[d.day] ? "done" : d.day < day ? "open" : "locked"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function JourneyMini({
  checkins,
  current,
}: {
  checkins: Record<number, string>;
  current: number;
}) {
  return (
    <div className="card-std p-[22px]">
      <div className="mb-4 flex items-center justify-between">
        <div className="font-display text-[15px] font-semibold">
          Journey map
        </div>
        <Link href="/journey" className="text-[12.5px] !text-accent hover:!text-accent2">
          Open full →
        </Link>
      </div>
      <JourneyCells
        cells={buildCells(checkins, current)}
        variant="flat"
        cols={10}
        gap={5}
        interactive
      />
    </div>
  );
}

export default function DashboardHome() {
  const router = useRouter();
  const state = useProgress();
  const [toast, showToast] = useToast();
  const mounted = useHydrated();

  const day = currentDay(state.checkins);
  const plan = day <= 100 ? getDay(day) : undefined;
  const { content: dayContent, ready: dayContentReady } = useDayContent(Math.min(day, 100));
  const effectiveQuiz = dayContent.quiz ?? plan?.quiz;
  const hasQuiz = Boolean(effectiveQuiz && effectiveQuiz.length > 0);
  const doneCount = Object.keys(state.checkins).length;
  const streak = computeStreak(state.checkins);
  const shipped = shippedCount(state.checkins);
  const expected = expectedDay(state.startDate);
  const behind = Math.max(0, expected - Math.min(day, 100));
  const firstName = (state.name || "").split(/\s+/)[0];

  const mode: "complete" | "paused" | "rest" | "catchup" | "today" = !plan
    ? "complete"
    : streak.status === "paused"
      ? "paused"
      : plan.isRest
        ? "rest"
        : behind > 0
          ? "catchup"
          : "today";

  function checkIn(n: number) {
    const newStreak = toggleDay(n);
    showToast({
      title: `Shabash! Day ${n} logged.`,
      sub: `Streak → ${newStreak} 🔥 · see you tomorrow`,
    });
  }

  const badge = plan ? projectBadge(plan.day) : null;

  return (
    <div>
      {/* header */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm text-mut2">
            Assalam-o-alaikum{firstName ? `, ${firstName}` : ""}
          </div>
          <h1 className="font-display text-[26px] font-bold tracking-[-.02em]">
            Today
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-edge2 bg-card2 px-3.5 py-2">
          <span className="text-[15px]">🔥</span>
          <span className="font-mono text-[15px] font-bold text-today">
            {mounted ? streak.streak : 0}
          </span>
          <span className="text-xs text-mut2">day streak</span>
          <span className="mx-0.5 h-4 w-px bg-[#2A323D]" />
          <span
            className={`text-xs ${streak.graceAvailable ? "text-accent" : "text-mut3"}`}
          >
            🛡 {streak.graceAvailable ? 1 : 0} grace
          </span>
        </div>
      </div>
      <div className="h-4" />

      {/* ── COMPLETE ── */}
      {mode === "complete" && (
        <div className="anim-fade-up card-grad p-8 text-center">
          <div className="mb-3 font-mono text-xs tracking-[.14em] text-accent">
            CHALLENGE COMPLETE
          </div>
          <h2 className="mb-2 font-display text-3xl font-bold tracking-[-.02em]">
            All 100 days are done.
          </h2>
          <p className="mx-auto mb-6 max-w-[440px] text-[15px] text-mut">
            Eight projects shipped, a capstone built, and a habit that&apos;s
            now yours.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/complete" className="btn-primary px-6 py-3 text-sm">
              See your certificate
            </Link>
            <Link href="/share" className="btn-ghost px-5 py-3 text-sm">
              Get the share card
            </Link>
          </div>
        </div>
      )}

      {/* ── TODAY ── */}
      {mode === "today" && plan && (
        <>
          <div className="anim-fade-up grid gap-5 md:grid-cols-[300px_1fr]">
            <DayCounterCard
              label="MY DAY"
              day={day}
              done={doneCount}
              shipped={shipped}
            />
            <div className="card-grad flex flex-col p-7">
              <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
                <span className="tag-mono bg-[rgba(245,181,75,.14)] text-today">
                  TODAY&apos;S BUILD
                </span>
                {badge && (
                  <span className="tag-mono bg-[rgba(53,211,153,.1)] text-accent">
                    {badge}
                  </span>
                )}
              </div>
              <h2 className="mb-2.5 font-display text-2xl font-bold tracking-[-.02em]">
                {plan.title}
              </h2>
              <p className="mb-5 text-[14.5px] leading-[1.6] text-mut">
                {plan.build}
              </p>
              <div className="mb-5 flex flex-col gap-2.5 sm:flex-row">
                <div className="flex-1 rounded-xl border border-edge3 bg-panel p-3.5">
                  <div className="mb-1.5 text-[11.5px] text-mut3">
                    📺 Lesson + resource
                  </div>
                  <div className="text-[13.5px] font-medium leading-[1.4]">
                    {plan.resource}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-accent">
                    ~30–45 min
                  </div>
                </div>
                <div className="flex-1 rounded-xl border border-edge3 bg-panel p-3.5">
                  <div className="mb-1.5 text-[11.5px] text-mut3">
                    ✓ Done when
                  </div>
                  <div className="text-[13.5px] font-medium leading-[1.4]">
                    {plan.doneWhen ?? "The build is pushed and your note is logged"}
                  </div>
                </div>
              </div>
              <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                <CheckInAction
                  day={day}
                  ready={dayContentReady}
                  hasQuiz={hasQuiz}
                  onCheckIn={() => checkIn(day)}
                  quizLabel={`Take the quiz to finish Day ${day} →`}
                  className="btn-primary flex-1 px-4 py-[15px] text-[15px] !font-bold"
                  label={
                    <>
                      <IconCheck size={18} strokeWidth={2.5} />
                      Check in — mark Day {day} done
                    </>
                  }
                />
                <div className="flex gap-3">
                  <Link
                    href={`/day/${day}`}
                    className="btn-ghost flex-1 px-[18px] py-[15px] text-sm"
                  >
                    Notes
                  </Link>
                  <a
                    href={plan.video ?? youTubeSearchUrl(plan)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost flex-1 px-[18px] py-[15px] text-sm"
                  >
                    {plan.video ? "▶ Watch" : "🔎 Find the video"}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="anim-fade-up-slow mt-5 grid gap-5 md:grid-cols-2">
            <ThisWeekCard day={day} checkins={state.checkins} />
            <JourneyMini checkins={state.checkins} current={day} />
          </div>
        </>
      )}

      {/* ── CATCH-UP ── */}
      {mode === "catchup" && plan && (
        <div className="anim-fade-up">
          <div
            className="mb-5 flex items-start gap-3.5 rounded-2xl border border-[rgba(53,211,153,.2)] p-5 px-[22px]"
            style={{
              background: "linear-gradient(150deg,rgba(53,211,153,.08),#12181F)",
            }}
          >
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-[rgba(53,211,153,.12)]">
              <IconClockBack />
            </div>
            <div>
              <div className="mb-1 font-display text-base font-semibold">
                The cohort is on Day {expected} — you&apos;re on Day {day}. No
                stress.
              </div>
              <div className="text-[13.5px] leading-[1.55] text-mut">
                Everyone moves at their own pace. We&apos;ll keep centering your
                next incomplete day — pick up right where you left off. Your
                streak and grace token are untouched.
              </div>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-[300px_1fr]">
            <DayCounterCard
              label="MY NEXT DAY"
              day={day}
              done={doneCount}
              shipped={shipped}
              extra={
                <div className="text-[13px] leading-[1.6] text-mut2">
                  Calendar Day {expected} ·{" "}
                  <span className="text-today">
                    {behind} day{behind === 1 ? "" : "s"} to catch up
                  </span>
                  . Do one a day and you&apos;re back in sync soon.
                </div>
              }
            />
            <div className="card-grad flex flex-col p-7">
              <div className="mb-3.5 flex items-center gap-2.5">
                {badge && (
                  <span className="tag-mono bg-[rgba(53,211,153,.1)] text-accent">
                    {badge}
                  </span>
                )}
                <span className="font-mono text-[11px] text-mut3">
                  resume here
                </span>
              </div>
              <h2 className="mb-2.5 font-display text-2xl font-bold tracking-[-.02em]">
                {plan.title}
              </h2>
              <p className="mb-5 text-[14.5px] leading-[1.6] text-mut">
                {plan.build}
              </p>
              <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                <CheckInAction
                  day={day}
                  ready={dayContentReady}
                  hasQuiz={hasQuiz}
                  onCheckIn={() => checkIn(day)}
                  quizLabel={`Take the quiz to finish Day ${day} →`}
                  className="btn-primary flex-1 px-4 py-[15px] text-[15px] !font-bold"
                  label={`Resume Day ${day}`}
                />
                <Link
                  href={`/day/${day}`}
                  className="btn-ghost px-[18px] py-[15px] text-sm"
                >
                  Open detail
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── REST DAY ── */}
      {mode === "rest" && plan && (
        <div className="anim-fade-up">
          <div
            className="mb-5 rounded-[20px] border border-[#2A2A22] p-[34px] text-center"
            style={{
              background: "linear-gradient(150deg,rgba(245,181,75,.09),#12181F)",
            }}
          >
            <div className="mb-2.5 font-mono text-xs tracking-[.1em] text-today">
              REST DAY · DAY {day}
            </div>
            <h2 className="mb-2.5 font-display text-3xl font-bold tracking-[-.02em]">
              No new task today. Breathe.
            </h2>
            <p className="mx-auto mb-6 max-w-[460px] text-[15px] text-mut">
              Every 7th day is for recap and rest. Skim your notes, see what
              the community shipped, and come back fresh tomorrow. Your streak
              counts rest days too.
            </p>
            <CheckInAction
              day={day}
              ready={dayContentReady}
              hasQuiz={hasQuiz}
              onCheckIn={() => checkIn(day)}
              quizLabel={`Take the quiz to log rest Day ${day} →`}
              className="btn-primary px-6 py-3.5 text-[15px] !font-bold"
              label={
                <>
                  <IconCheck size={17} strokeWidth={2.5} />
                  Check in — log rest Day {day}
                </>
              }
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="card-std p-6">
              <div className="mb-4 font-display text-base font-semibold">
                Week {weekOf(day).week} recap checklist
              </div>
              <RecapChecklist />
            </div>
            <div className="card-std flex flex-col p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="font-display text-base font-semibold">
                  Community showcase
                </div>
                <Link
                  href="/leaderboard"
                  className="text-[12.5px] !text-accent hover:!text-accent2"
                >
                  See wall →
                </Link>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-edge3 bg-panel p-3">
                  <div
                    className="h-[34px] w-[34px] rounded-lg"
                    style={{ background: "linear-gradient(150deg,#7C6CF5,#5B4BD6)" }}
                  />
                  <div className="flex-1">
                    <div className="text-[13.5px] font-medium">
                      Ayesha shipped P1 — RAG over 400 PDFs
                    </div>
                    <div className="text-xs text-mut3">Day 34 · 128 likes</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-edge3 bg-panel p-3">
                  <div
                    className="h-[34px] w-[34px] rounded-lg"
                    style={{ background: "linear-gradient(150deg,#35D399,#16A97E)" }}
                  />
                  <div className="flex-1">
                    <div className="text-[13.5px] font-medium">
                      Bilal&apos;s eval harness caught a 30% regression
                    </div>
                    <div className="text-xs text-mut3">Day 33 · 94 likes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STREAK PAUSED ── */}
      {mode === "paused" && plan && (
        <div className="anim-fade-up">
          <div className="mb-5 flex items-start gap-3.5 rounded-2xl border border-[#2A323D] bg-card p-[22px]">
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-locked text-lg">
              ⏸
            </div>
            <div className="flex-1">
              <div className="mb-1 font-display text-base font-semibold">
                Your streak is paused — not lost.
              </div>
              <div className="text-[13.5px] leading-[1.55] text-mut">
                You used your grace token, then missed another day. Your{" "}
                {streak.streak}-day streak is safely on hold. Check in today to
                bring it back to life — nothing resets to zero here.
              </div>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-[300px_1fr]">
            <div className="card-grad p-[26px] py-7">
              <div className="mb-1.5 font-mono text-xs tracking-[.1em] text-mut3">
                STREAK
              </div>
              <div className="flex items-baseline gap-2">
                <div className="stat-sm font-mono font-extrabold leading-[.9] tracking-[-.04em] text-mut3">
                  {streak.streak}
                </div>
                <div className="text-[15px] text-mut3">paused</div>
              </div>
              <div className="my-5 h-px bg-edge3" />
              <div className="mb-2 flex items-center gap-2 text-[13px] text-mut2">
                <span className="opacity-50">🛡</span> Grace token spent
              </div>
              <div className="flex items-center gap-2 text-[13px] text-mut2">
                Refills after 7 clean check-ins
              </div>
            </div>
            <div className="card-grad flex flex-col p-7">
              <h2 className="mb-2.5 font-display text-[23px] font-bold tracking-[-.02em]">
                Bring your streak back to life
              </h2>
              <p className="mb-5 text-[14.5px] leading-[1.6] text-mut">
                One check-in un-pauses everything. You&apos;ll resume at{" "}
                {streak.streak} and keep climbing — the missed days just
                don&apos;t count against you.
              </p>
              <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                <CheckInAction
                  day={day}
                  ready={dayContentReady}
                  hasQuiz={hasQuiz}
                  onCheckIn={() => checkIn(day)}
                  quizLabel={`Take the quiz to resume streak →`}
                  className="btn-primary flex-1 px-4 py-[15px] text-[15px] !font-bold"
                  label="Check in — resume streak"
                />
                <button
                  type="button"
                  onClick={() => router.push("/journey")}
                  className="btn-ghost px-[18px] py-[15px] text-sm"
                >
                  View journey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
}

function RecapChecklist() {
  const items = [
    "Re-read this week's notes",
    "Push this week's code to GitHub",
    "Write one paragraph: what clicked?",
    "Note one thing to revisit next week",
  ];
  const [checked, setChecked] = useState<boolean[]>([false, false, false, false]);
  return (
    <div className="flex flex-col gap-3">
      {items.map((label, i) => (
        <label
          key={label}
          className="flex cursor-pointer items-center gap-3 text-sm"
          onClick={() =>
            setChecked((c) => c.map((v, j) => (j === i ? !v : v)))
          }
        >
          {checked[i] ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-accent-deep">
              <IconCheck size={11} />
            </span>
          ) : (
            <span className="h-5 w-5 rounded-md border-[1.5px] border-[#2A323D]" />
          )}
          <span className={checked[i] ? "text-mut2 line-through" : ""}>
            {label}
          </span>
        </label>
      ))}
    </div>
  );
}
