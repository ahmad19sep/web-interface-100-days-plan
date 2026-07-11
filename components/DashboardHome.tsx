"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import {
  DAYS,
  PROJECTS,
  TOTAL_DAYS,
  TOTAL_PROJECTS,
  getDay,
  pad3,
  weekOf,
} from "@/lib/plan";
import {
  computeStreak,
  currentDay,
  expectedDay,
  shippedCount,
  useProgress,
} from "@/lib/store";
import dynamic from "next/dynamic";
import { buildCells } from "./JourneyGrid";
import { ProgressBar } from "./ProgressBar";
import Tilt from "./Tilt";
import { IconCheck, IconClockBack } from "./icons";

const Journey3D = dynamic(() => import("./Journey3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[228px] items-center justify-center font-mono text-xs text-mut3">
      loading 3D…
    </div>
  ),
});

// Check-in deliberately does NOT live on the dashboard: the only way to
// finish a day is to open its page — where the creator's video, notes,
// resources, and the quiz gate are.

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
    <Tilt className="rounded-[20px]">
    <div className="card-grad flex h-full flex-col p-[26px] py-7">
      <div className="mb-1.5 font-mono text-xs tracking-[.1em] text-mut3">
        {label}
      </div>
      <div className="stat-md font-mono font-extrabold leading-[.9] tracking-[-.04em] text-accent">
        {pad3(day)}
      </div>
      <div className="mt-1 font-mono text-[15px] text-mut3">/ {TOTAL_DAYS}</div>
      <div className="my-[22px] h-px bg-edge3" />
      {extra ?? (
        <>
          <div className="mb-3 flex justify-between">
            <span className="text-[13px] text-mut2">Progress</span>
            <span className="font-mono text-[13px] text-ink">
              {Math.round((done / TOTAL_DAYS) * 100)}%
            </span>
          </div>
          <div className="mb-5">
            <ProgressBar pct={Math.round((done / TOTAL_DAYS) * 100)} />
          </div>
          <div className="flex justify-between text-[12.5px] text-mut2">
            <span>Projects shipped</span>
            <span className="font-mono text-ink">{shipped} / {TOTAL_PROJECTS}</span>
          </div>
        </>
      )}
    </div>
    </Tilt>
  );
}

function ThisWeekCard({
  day,
  checkins,
}: {
  day: number;
  checkins: Record<number, string>;
}) {
  const week = weekOf(Math.min(day, TOTAL_DAYS));
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
      <Journey3D cells={buildCells(checkins, current)} height={228} />
    </div>
  );
}

export default function DashboardHome() {
  const router = useRouter();
  const state = useProgress();
  const mounted = useHydrated();

  const day = currentDay(state.checkins);
  const plan = day <= TOTAL_DAYS ? getDay(day) : undefined;
  const doneCount = Object.keys(state.checkins).length;
  const streak = computeStreak(state.checkins);
  const shipped = shippedCount(state.checkins);
  const expected = expectedDay(state.startDate);
  const behind = Math.max(0, expected - Math.min(day, TOTAL_DAYS));
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
            All {TOTAL_DAYS} days are done.
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
                  <span className="tag-mono bg-[rgba(34,211,238,.1)] text-accent">
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
                    {plan.time ?? "2–3 h"}
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
              <div className="mt-auto">
                <Link
                  href={`/learn/day/${day}`}
                  className="btn-amber w-full px-4 py-[15px] text-[15px] !font-bold"
                >
                  Enter Day {day} Workspace →
                </Link>
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
            className="mb-5 flex items-start gap-3.5 rounded-2xl border border-[rgba(34,211,238,.2)] p-5 px-[22px]"
            style={{
              background: "linear-gradient(150deg,rgba(34,211,238,.08),#12181F)",
            }}
          >
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px] bg-[rgba(34,211,238,.12)]">
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
                  <span className="tag-mono bg-[rgba(34,211,238,.1)] text-accent">
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
              <div className="mt-auto">
                <Link
                  href={`/day/${day}`}
                  className="btn-primary w-full px-4 py-[15px] text-[15px] !font-bold"
                >
                  Resume Day {day} →
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
            <Link
              href={`/day/${day}`}
              className="btn-primary px-6 py-3.5 text-[15px] !font-bold"
            >
              Open rest Day {day} →
            </Link>
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
                    style={{ background: "linear-gradient(150deg,#22D3EE,#0E7490)" }}
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
                <Link
                  href={`/day/${day}`}
                  className="btn-primary flex-1 px-4 py-[15px] text-[15px] !font-bold"
                >
                  Resume Day {day} →
                </Link>
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
