"use client";

// The Certification tab. Before the finish line: a locked certificate
// preview plus a live "how to earn it" checklist. After Day 120: the real
// certificate of completion — named, dated, numbered, signed by Ahmad —
// with a print/download button (print CSS isolates the document).

import Link from "next/link";
import { CHALLENGE, CREATOR, PROJECTS, TOTAL_DAYS, TOTAL_PROJECTS } from "@/lib/plan";
import {
  computeStreak,
  currentDay,
  localToday,
  shippedCount,
  useProgress,
} from "@/lib/store";
import { Logo } from "./icons";

function prettyDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function CertificateDocument({
  name,
  handle,
  finishedOn,
  preview = false,
}: {
  name: string;
  handle: string;
  finishedOn: string;
  preview?: boolean;
}) {
  return (
    <div
      id="ax-cert"
      className="relative overflow-hidden rounded-[6px] border-2 border-[rgba(245,158,11,.5)] bg-[#0b1120] p-2"
    >
      <div className="rounded-[3px] border border-[rgba(34,211,238,.3)] px-6 py-9 text-center sm:px-12 sm:py-12">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(560px 260px at 50% -8%, rgba(34,211,238,.1), transparent 70%), radial-gradient(400px 220px at 50% 108%, rgba(245,158,11,.08), transparent 70%)",
          }}
        />
        <div className="relative">
          <div className="mb-4 flex items-center justify-center gap-2.5">
            <Logo size={34} radius={9} />
            <span className="font-display text-[15px] font-semibold">
              Ahmad X AI
            </span>
          </div>
          <div className="mb-6 font-mono text-[10.5px] tracking-[.42em] text-today">
            CERTIFICATE OF COMPLETION
          </div>
          <div className="mb-1.5 text-[12.5px] text-mut2">
            This certifies that
          </div>
          <div className="mb-1.5 font-display text-[34px] font-bold tracking-[-.02em] text-ink sm:text-[42px]">
            {name}
          </div>
          <div className="mx-auto mb-5 h-px w-[220px] bg-[rgba(245,158,11,.4)]" />
          <div className="mb-1.5 text-[12.5px] leading-[1.7] text-mut2">
            walked every step of the road and completed
          </div>
          <div className="mb-2 font-display text-[19px] font-bold text-accent sm:text-[21px]">
            {CHALLENGE.title}
          </div>
          <div className="mb-7 font-mono text-[11px] tracking-[.1em] text-mut">
            {TOTAL_DAYS} DAYS · {TOTAL_PROJECTS} SHIPPED PROJECTS · BUILT IN
            PUBLIC
          </div>

          <div className="mx-auto flex max-w-[440px] items-end justify-between gap-6">
            <div className="text-left">
              <div className="font-display text-[19px] italic text-ink">
                {CREATOR.name}
              </div>
              <div className="mt-1 border-t border-edge2 pt-1 font-mono text-[9px] tracking-[.14em] text-mut3">
                {CREATOR.name.toUpperCase()} · CREATOR
              </div>
            </div>
            <div className="text-right">
              <div className="text-[13px] text-ink2">
                {prettyDate(finishedOn)}
              </div>
              <div className="mt-1 border-t border-edge2 pt-1 font-mono text-[9px] tracking-[.14em] text-mut3">
                DATE OF COMPLETION
              </div>
            </div>
          </div>

          <div className="mt-7 font-mono text-[9px] tracking-[.14em] text-mut3">
            CERTIFICATE NO. AX-{TOTAL_DAYS}-{handle.toUpperCase() || "EXPLORER"}{" "}
            · VERIFY AT RADAR.HAFIZAHMAD.COM/LEADERBOARD
          </div>
        </div>
      </div>
      {preview && (
        <div className="absolute inset-0 grid place-items-center bg-[rgba(6,9,18,.55)] backdrop-blur-[3px]">
          <div className="text-center">
            <div className="mb-1.5 text-[34px]">🔒</div>
            <div className="font-mono text-[11px] tracking-[.22em] text-mut2">
              SEALED UNTIL DAY {TOTAL_DAYS}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Certificate() {
  const state = useProgress();
  const done = Object.keys(state.checkins).length;
  const day = Math.min(currentDay(state.checkins), TOTAL_DAYS);
  const shipped = shippedCount(state.checkins);
  const streak = computeStreak(state.checkins);
  const capstone = PROJECTS[PROJECTS.length - 1];
  const capstoneDone = Boolean(state.checkins[capstone.shipDay]);
  const complete = done >= TOTAL_DAYS;
  const name = state.name || "Explorer";
  // day the last check-in landed — the completion date on the document
  const finishedOn = complete
    ? Object.values(state.checkins).sort().at(-1) ?? localToday()
    : localToday();

  const requirements = [
    {
      icon: "🗓",
      label: `Complete all ${TOTAL_DAYS} days`,
      done: done,
      total: TOTAL_DAYS,
      color: "#22d3ee",
    },
    {
      icon: "📦",
      label: `Ship all ${TOTAL_PROJECTS} projects`,
      done: shipped,
      total: TOTAL_PROJECTS,
      color: "#a78bfa",
    },
    {
      icon: "🚀",
      label: `Launch the capstone — ${capstone.name}`,
      done: capstoneDone ? 1 : 0,
      total: 1,
      color: "#f59e0b",
    },
  ];

  return (
    <div>
      {/* print: only the certificate document */}
      <style>{`@media print {
        body * { visibility: hidden !important; }
        #ax-cert, #ax-cert * { visibility: visible !important; }
        #ax-cert { position: fixed; inset: 0; margin: auto; max-height: 100vh; }
      }`}</style>

      <div className="mb-[22px]">
        <div className="text-sm text-mut2">
          {complete
            ? "You earned this — every single day of it"
            : "The document waiting at the end of the road"}
        </div>
        <h1 className="font-display text-[26px] font-bold tracking-[-.02em]">
          Certification
        </h1>
      </div>

      {complete ? (
        <div className="mx-auto max-w-[760px]">
          <CertificateDocument
            name={name}
            handle={state.handle}
            finishedOn={finishedOn}
          />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="btn-amber px-6 py-3.5 text-[14.5px]"
            >
              🖨 Download / print certificate
            </button>
            <Link href="/share" className="btn-ghost px-5 py-3.5 text-[14px]">
              📸 Share card
            </Link>
          </div>
          <div className="mt-4 text-center font-mono text-[11px] text-mut3">
            longest streak {streak.longest} 🔥 · {shipped}/{TOTAL_PROJECTS}{" "}
            projects shipped
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* locked preview */}
          <div className="min-w-0 flex-1">
            <CertificateDocument
              name={name}
              handle={state.handle}
              finishedOn={finishedOn}
              preview
            />
          </div>

          {/* how to earn it */}
          <div className="flex w-full shrink-0 flex-col gap-4 lg:w-[340px]">
            <div className="card-std rounded-[16px] p-5">
              <div className="mb-4 font-mono text-[10px] tracking-[.24em] text-mut3">
                HOW TO EARN IT
              </div>
              <div className="flex flex-col gap-4">
                {requirements.map((r) => {
                  const ok = r.done >= r.total;
                  return (
                    <div key={r.label}>
                      <div className="mb-1.5 flex items-baseline justify-between gap-3">
                        <div className="flex items-center gap-2 text-[13px] text-ink2">
                          <span>{ok ? "✅" : r.icon}</span>
                          <span>{r.label}</span>
                        </div>
                        <span
                          className="whitespace-nowrap font-mono text-[11px]"
                          style={{ color: ok ? "#22d3ee" : "#8b98ad" }}
                        >
                          {r.done}/{r.total}
                        </span>
                      </div>
                      <div className="h-[5px] overflow-hidden rounded-[3px] bg-[#1a2338]">
                        <div
                          className="h-full rounded-[3px]"
                          style={{
                            width: `${Math.min(100, Math.round((r.done / r.total) * 100))}%`,
                            background: r.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card-std rounded-[16px] p-5">
              <div className="mb-2 font-mono text-[10px] tracking-[.24em] text-mut3">
                WHAT YOU GET
              </div>
              <ul className="flex flex-col gap-1.5 text-[13px] leading-[1.6] text-ink2">
                <li>◆ A named, dated, numbered certificate</li>
                <li>◆ Signed by {CREATOR.name} — verifiable on the leaderboard</li>
                <li>◆ Print it, share it, pin it to your portfolio</li>
                <li>◆ Plus the real prize: {TOTAL_PROJECTS} shipped projects on GitHub</li>
              </ul>
            </div>

            <Link
              href={`/learn/day/${day}`}
              className="btn-amber w-full py-3.5 text-center text-[14.5px]"
            >
              Continue — Day {day} →
            </Link>
            <div className="text-center font-mono text-[10.5px] text-mut3">
              {TOTAL_DAYS - done} days between you and this document
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
