"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  CHALLENGE,
  CREATOR,
  PROJECTS,
  TOTAL_DAYS,
  TOTAL_PROJECTS,
} from "@/lib/plan";
import { currentDay, expectedDay, useProgress } from "@/lib/store";
import { demoCells, buildCells, JourneyCells } from "./JourneyGrid";
import { IconCheck, IconPlay, Logo } from "./icons";

export default function Landing() {
  const router = useRouter();
  const state = useProgress();

  // Logged-in users land on their dashboard
  useEffect(() => {
    if (state.onboarded) router.replace("/today");
  }, [state.onboarded, router]);

  const cells = state.onboarded
    ? buildCells(state.checkins, currentDay(state.checkins))
    : demoCells(37);
  const liveDay = state.onboarded
    ? expectedDay(state.startDate)
    : 37;
  const doneCount = state.onboarded
    ? Object.keys(state.checkins).length
    : 37;

  return (
    <div className="mx-auto max-w-[1280px] px-5 pb-[90px] sm:px-10">
      {/* nav */}
      <nav className="sticky top-0 z-20 -mx-5 flex h-[78px] items-center justify-between border-b border-divider bg-[rgba(13,17,23,.82)] px-5 backdrop-blur-[10px] sm:-mx-10 sm:px-10">
        <div className="flex items-center gap-[11px]">
          <Logo size={32} />
          <div className="font-display text-[15.5px] font-semibold tracking-[-.01em]">
            {CHALLENGE.title}
          </div>
          <span className="ml-1 hidden rounded-md border border-[#232B35] px-[7px] py-[2px] font-mono text-[10.5px] text-dim2 sm:inline">
            AHMAD X AI
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-[30px]">
          <div className="hidden gap-[26px] text-[13.5px] text-mut md:flex">
            <a className="!text-mut hover:!text-ink" href="#how">How it works</a>
            <a className="!text-mut hover:!text-ink" href="#projects">The 8 projects</a>
            <a className="!text-mut hover:!text-ink" href="#creator">Creator</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/today"
              className="!text-ink2 text-[13.5px] font-medium hover:!text-ink"
            >
              Log in
            </Link>
            <Link
              href="/start"
              className="btn-primary px-4 py-2.5 text-[13.5px] !rounded-[10px]"
            >
              Start the challenge
            </Link>
          </div>
        </div>
      </nav>

      {/* hero */}
      <section className="grid items-center gap-10 py-[74px] pb-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(53,211,153,.22)] bg-[rgba(53,211,153,.09)] px-3 py-1.5 text-[12.5px] font-medium text-accent2">
            <span
              className="h-1.5 w-1.5 rounded-full bg-accent"
              style={{ boxShadow: "0 0 8px #35D399" }}
            />
            Cohort live now · Day {liveDay} of {TOTAL_DAYS}
          </div>
          <h1 className="mb-[22px] font-display text-[40px] font-bold leading-[1.03] tracking-[-.025em] sm:text-[57px]">
            120 days.
            <br />
            20 real projects.
            <br />
            <span className="text-accent">Production AI, built by hand.</span>
          </h1>
          <p className="mb-8 max-w-[480px] text-[17px] leading-[1.6] text-mut">
            A daily training log for a public learning challenge. Watch the
            lesson, ship the build, check in. Keep your streak alive — one day
            at a time, at your own pace.
          </p>
          <div className="mb-[34px] flex flex-wrap items-center gap-3.5">
            <Link href="/start" className="btn-primary px-6 py-3.5 text-[15px]">
              Start Day 1 — free
            </Link>
            <Link href="/today" className="btn-ghost px-[22px] py-3.5 text-[15px]">
              See the dashboard
            </Link>
          </div>
          <div className="flex items-center gap-[26px]">
            <div>
              <div className="font-mono text-[26px] font-extrabold text-ink">
                14,208
              </div>
              <div className="text-[12.5px] text-mut3">learners on the track</div>
            </div>
            <div className="h-[34px] w-px bg-[#232B35]" />
            <div>
              <div className="font-mono text-[26px] font-extrabold text-ink">
                1.2M
              </div>
              <div className="text-[12.5px] text-mut3">check-ins logged</div>
            </div>
            <div className="h-[34px] w-px bg-[#232B35]" />
            <div>
              <div className="font-mono text-[26px] font-extrabold text-accent">
                89k
              </div>
              <div className="text-[12.5px] text-mut3">projects shipped</div>
            </div>
          </div>
        </div>

        {/* journey preview */}
        <div
          className="rounded-[20px] border border-edge p-6"
          style={{
            background: "linear-gradient(180deg,#12181F,#0F141A)",
            boxShadow: "0 30px 60px -30px rgba(0,0,0,.6)",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="font-display text-sm font-semibold">
              Your journey map
            </div>
            <div className="font-mono text-xs text-mut3">
              {doneCount} / {TOTAL_DAYS}
            </div>
          </div>
          <JourneyCells cells={cells} variant="flat" cols={10} gap={6} />
          <div className="mt-4 flex gap-4 text-[11.5px] text-mut3">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-done" />
              Done
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-today" />
              Today
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-locked" />
              Locked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[3px] border border-dashed border-[#3A4552]" />
              Rest
            </span>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="scroll-mt-20 py-16 pb-6">
        <div className="mb-2.5 font-mono text-xs tracking-[.08em] text-accent">
          HOW IT WORKS
        </div>
        <h2 className="mb-[34px] font-display text-3xl font-bold tracking-[-.02em]">
          Three moves, every day.
        </h2>
        <div className="grid gap-[18px] md:grid-cols-3">
          {[
            {
              n: "01",
              icon: <IconPlay size={20} fill="#35D399" />,
              title: "Watch the lesson",
              body: "A focused daily video on one modern-AI concept. 15–30 minutes, no filler.",
            },
            {
              n: "02",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#35D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                </svg>
              ),
              title: "Build the task",
              body: "A concrete build with a clear “done-when”. Every week becomes a shippable project.",
            },
            {
              n: "03",
              icon: <IconCheck size={20} stroke="#35D399" strokeWidth={2} />,
              title: "Check in",
              body: "Mark the day complete, log a note, keep the streak alive. One grace token has your back.",
            },
          ].map((c) => (
            <div key={c.n} className="card-std rounded-2xl p-[26px]">
              <div className="mb-4 font-mono text-xs text-mut3">{c.n}</div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[11px] bg-[rgba(53,211,153,.1)]">
                {c.icon}
              </div>
              <div className="mb-2 font-display text-[17px] font-semibold">
                {c.title}
              </div>
              <div className="text-sm leading-[1.6] text-mut2">{c.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* the 8 projects */}
      <section id="projects" className="scroll-mt-20 py-14 pb-6">
        <div className="mb-2.5 font-mono text-xs tracking-[.08em] text-accent">
          THE OUTPUT
        </div>
        <h2 className="mb-[34px] font-display text-3xl font-bold tracking-[-.02em]">
          {TOTAL_PROJECTS} projects you&apos;ll actually ship.
        </h2>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECTS.map((p) => (
            <div
              key={p.id}
              className="card-std flex min-h-[132px] flex-col justify-between rounded-[14px] p-5"
            >
              <div>
                <div className="mb-2.5 font-mono text-xs text-accent">
                  {p.id}
                </div>
                <div className="mb-1.5 font-display text-base font-semibold">
                  {p.name}
                </div>
                <div className="text-[12.5px] leading-[1.5] text-[#7C858F]">
                  {p.blurb}
                </div>
              </div>
              <div className="mt-3 font-mono text-[11px] text-dim2">
                Days {p.start}–{p.end}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* weekly rhythm + creator */}
      <section id="creator" className="grid scroll-mt-20 gap-[18px] py-14 pb-6 lg:grid-cols-2">
        <div
          className="rounded-[18px] border border-[#2A2A22] p-[30px]"
          style={{
            background: "linear-gradient(150deg,rgba(245,181,75,.08),#12181F)",
          }}
        >
          <div className="mb-3 font-mono text-xs tracking-[.06em] text-today">
            WEEKLY RHYTHM
          </div>
          <h3 className="mb-3 font-display text-[23px] font-bold tracking-[-.02em]">
            Every 7th day, you rest.
          </h3>
          <p className="mb-5 text-[14.5px] leading-[1.6] text-mut">
            No new task. A recap checklist, a look at the community showcase,
            and space to catch your breath. Discipline includes rest.
          </p>
          <div className="flex gap-1.5">
            {["D1", "D2", "D3", "D4", "D5", "D6"].map((d) => (
              <div
                key={d}
                className="flex h-[34px] flex-1 items-center justify-center rounded-[7px] bg-locked font-mono text-[11px] text-mut3"
              >
                {d}
              </div>
            ))}
            <div className="flex h-[34px] flex-1 items-center justify-center rounded-[7px] border border-dashed border-[rgba(245,181,75,.5)] bg-[rgba(245,181,75,.14)] font-mono text-[11px] text-today">
              R
            </div>
          </div>
        </div>
        <div className="card-std flex flex-col rounded-[18px] p-[30px]">
          <div className="mb-3 font-mono text-xs tracking-[.06em] text-accent">
            THE CREATOR
          </div>
          <div className="mb-[18px] flex items-center gap-3.5">
            <div
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full font-display text-xl font-bold text-[#062018]"
              style={{ background: "linear-gradient(150deg,#35D399,#16A97E)" }}
            >
              A
            </div>
            <div>
              <div className="font-display text-[17px] font-semibold">
                {CREATOR.name}
              </div>
              <div className="text-[13px] text-mut2">
                {CREATOR.handle} · {CREATOR.tagline}
              </div>
            </div>
          </div>
          <div className="relative flex min-h-[150px] flex-1 items-center justify-center overflow-hidden rounded-xl border border-edge3 bg-inset">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg,rgba(53,211,153,.08),transparent)",
              }}
            />
            <div className="z-[1] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[rgba(255,255,255,.1)] backdrop-blur-[4px]">
              <IconPlay size={20} />
            </div>
            <div className="absolute bottom-3 left-3.5 z-[1] text-[12.5px] text-ink2">
              Latest: “Day 8 — Evals: yehi hai asli hunar”
            </div>
          </div>
        </div>
      </section>

      {/* join CTA + footer */}
      <section
        className="mt-14 rounded-[22px] border border-[rgba(53,211,153,.22)] p-8 text-center sm:p-[52px]"
        style={{
          background:
            "linear-gradient(150deg,rgba(53,211,153,.1),rgba(29,186,137,.03))",
        }}
      >
        <h2 className="mb-3.5 font-display text-[28px] font-bold tracking-[-.025em] sm:text-[34px]">
          Your Day 1 starts when you say so.
        </h2>
        <p className="mx-auto mb-7 max-w-[520px] text-base text-mut">
          Start today, or align with the live cohort. Either way, the track is
          yours — your streak, your notes, your pace.
        </p>
        <Link href="/start" className="btn-primary px-[30px] py-[15px] text-[15px]">
          Start the challenge
        </Link>
        <div className="mt-11 flex flex-col items-center justify-between gap-2 border-t border-[rgba(255,255,255,.06)] pt-[22px] text-[12.5px] text-dim2 sm:flex-row">
          <span>© 2026 Ahmad X AI · {CHALLENGE.title}</span>
          <span className="font-mono">Latin script only · built in public</span>
        </div>
      </section>
    </div>
  );
}
